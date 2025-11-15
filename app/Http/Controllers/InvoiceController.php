<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Transaction;
use App\Models\InventoryMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'date' => 'required|date',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'payment_method' => 'nullable|in:cash,card,transfer,credit',
            'discount' => 'nullable|numeric|min:0',
        ]);

        return DB::transaction(function () use ($request) {
            // Validar stock disponible antes de crear la factura
            foreach ($request->items as $item) {
                $product = \App\Models\Product::find($item['product_id']);
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stock insuficiente para {$product->name}. Disponible: {$product->stock}, Solicitado: {$item['quantity']}");
                }
            }

            // Crear factura
            $invoice = Invoice::create([
                'user_id' => Auth::id(),
                'customer_id' => $request->customer_id,
                'invoice_number' => 'INV-' . date('Ymd') . '-' . str_pad(Invoice::whereBetween(DB::raw('DATE(created_at)'), [today()->format('Y-m-d'), today()->format('Y-m-d')])->count() + 1, 4, '0', STR_PAD_LEFT),
                'date' => now(),
                'payment_method' => $request->payment_method,
                'discount' => $request->discount ?? 0,
                'payment_status' => $request->payment_method === 'credit' ? 'pending' : 'paid',
            ]);

            // Crear items y actualizar inventario
            foreach ($request->items as $item) {
                InvoiceItem::create([
                    'invoice_id' => $invoice->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                ]);

                // Reducir inventario
                $product = \App\Models\Product::find($item['product_id']);
                $product->updateStock($item['quantity'], 'sale');

                // Registrar movimiento
                InventoryMovement::create([
                    'product_id' => $item['product_id'],
                    'user_id' => Auth::id(),
                    'type' => 'sale',
                    'quantity' => $item['quantity'],
                    'date' => now(),
                    'notes' => "Venta - Factura {$invoice->invoice_number}",
                ]);
            }

            // Calcular totales
            $invoice->calculateTotals();

            // Crear asiento contable
            $this->createAccountingEntry($invoice);

            return redirect()->route('sales')->with('success', 'Venta registrada exitosamente');
        });
    }

    private function createAccountingEntry(Invoice $invoice)
    {
        // Obtener cuentas por código (no por ID)
        $cuentaCaja = \App\Models\Account::where('code', '1105')->first();
        $cuentaClientes = \App\Models\Account::where('code', '1305')->first();
        $cuentaIvaPorPagar = \App\Models\Account::where('code', '2367')->first();
        $cuentaIngresoVentas = \App\Models\Account::where('code', '4135')->first();
        $cuentaCostoVentas = \App\Models\Account::where('code', '6135')->first();
        $cuentaInventario = \App\Models\Account::where('code', '1435')->first();

        // Validar que todas las cuentas existan
        if (!$cuentaCaja || !$cuentaClientes || !$cuentaIvaPorPagar || !$cuentaIngresoVentas || !$cuentaCostoVentas || !$cuentaInventario) {
            throw new \Exception('Error: Las cuentas contables no están configuradas correctamente. Por favor ejecute el seeder de cuentas.');
        }

        // Débito: Caja o Clientes (si es crédito)
        $cuentaDebito = $invoice->payment_method === 'credit' ? $cuentaClientes : $cuentaCaja;
        Transaction::create([
            'user_id' => Auth::id(),
            'account_id' => $cuentaDebito->id,
            'invoice_id' => $invoice->id,
            'date' => $invoice->date,
            'description' => "Venta - Factura {$invoice->invoice_number}",
            'debit' => $invoice->total,
            'credit' => 0,
            'reference' => $invoice->invoice_number,
        ]);

        // Crédito: IVA por pagar
        Transaction::create([
            'user_id' => Auth::id(),
            'account_id' => $cuentaIvaPorPagar->id,
            'invoice_id' => $invoice->id,
            'date' => $invoice->date,
            'description' => "IVA Venta - Factura {$invoice->invoice_number}",
            'debit' => 0,
            'credit' => $invoice->tax,
            'reference' => $invoice->invoice_number,
        ]);

        // Crédito: Ingreso por ventas
        Transaction::create([
            'user_id' => Auth::id(),
            'account_id' => $cuentaIngresoVentas->id,
            'invoice_id' => $invoice->id,
            'date' => $invoice->date,
            'description' => "Venta - Factura {$invoice->invoice_number}",
            'debit' => 0,
            'credit' => $invoice->subtotal,
            'reference' => $invoice->invoice_number,
        ]);

        // Débito: Costo de ventas y Crédito: Inventario
        $costTotal = $invoice->items->sum(fn($item) => $item->product->cost * $item->quantity);
        
        Transaction::create([
            'user_id' => Auth::id(),
            'account_id' => $cuentaCostoVentas->id,
            'invoice_id' => $invoice->id,
            'date' => $invoice->date,
            'description' => "Costo venta - Factura {$invoice->invoice_number}",
            'debit' => $costTotal,
            'credit' => 0,
            'reference' => $invoice->invoice_number,
        ]);

        Transaction::create([
            'user_id' => Auth::id(),
            'account_id' => $cuentaInventario->id,
            'invoice_id' => $invoice->id,
            'date' => $invoice->date,
            'description' => "Salida inventario - Factura {$invoice->invoice_number}",
            'debit' => 0,
            'credit' => $costTotal,
            'reference' => $invoice->invoice_number,
        ]);
    }

    public function generateXml(Invoice $invoice)
    {
        $invoice->load(['customer', 'items.product', 'user']);

        $xml = new \DOMDocument('1.0', 'UTF-8');
        $xml->formatOutput = true;

        // Crear elemento raíz
        $root = $xml->createElement('Invoice');
        $root->setAttribute('xmlns', 'urn:oasis:names:specification:ubl:schema:xsd:Invoice-2');
        $root->setAttribute('xmlns:cac', 'urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2');
        $root->setAttribute('xmlns:cbc', 'urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2');
        $root->setAttribute('xmlns:sts', 'dian:gov:co:facturaelectronica:Structures-2-1');
        $xml->appendChild($root);

        // Cabecera
        $this->addElement($xml, $root, 'cbc:ProfileID', 'DIAN 2.1');
        $this->addElement($xml, $root, 'cbc:ID', $invoice->invoice_number);
        
        $uuid = $xml->createElement('cbc:UUID', hash('sha384', $invoice->invoice_number . $invoice->date . $invoice->total));
        $uuid->setAttribute('schemeID', '2');
        $uuid->setAttribute('schemeName', 'CUFE-SHA384');
        $root->appendChild($uuid);

        $this->addElement($xml, $root, 'cbc:IssueDate', date('Y-m-d', strtotime($invoice->date)));
        $this->addElement($xml, $root, 'cbc:IssueTime', date('H:i:s-05:00', strtotime($invoice->date)));
        $this->addElement($xml, $root, 'cbc:InvoiceTypeCode', '01');
        $this->addElement($xml, $root, 'cbc:DocumentCurrencyCode', 'COP');

        // Emisor
        $supplierParty = $xml->createElement('cac:AccountingSupplierParty');
        $party = $xml->createElement('cac:Party');
        
        $partyId = $xml->createElement('cac:PartyIdentification');
        $id = $xml->createElement('cbc:ID', config('app.company.nit', '900123456'));
        $id->setAttribute('schemeID', '31');
        $partyId->appendChild($id);
        $party->appendChild($partyId);

        $partyName = $xml->createElement('cac:PartyName');
        $this->addElement($xml, $partyName, 'cbc:Name', config('app.company.name', 'PAPELERÍA SACT'));
        $party->appendChild($partyName);

        $location = $xml->createElement('cac:PhysicalLocation');
        $address = $xml->createElement('cac:Address');
        $this->addElement($xml, $address, 'cbc:Department', config('app.company.department', 'CUNDINAMARCA'));
        $this->addElement($xml, $address, 'cbc:CityName', config('app.company.city', 'FUSAGASUGÁ'));
        $addressLine = $xml->createElement('cbc:AddressLine');
        $this->addElement($xml, $addressLine, 'cbc:Line', config('app.company.address', 'Carrera 6 # 10-55'));
        $address->appendChild($addressLine);
        $this->addElement($xml, $address, 'cbc:CountrySubentity', 'CO');
        $location->appendChild($address);
        $party->appendChild($location);

        $supplierParty->appendChild($party);
        $root->appendChild($supplierParty);

        // Cliente
        $customerParty = $xml->createElement('cac:AccountingCustomerParty');
        $customerElem = $xml->createElement('cac:Party');
        
        $customerIdElem = $xml->createElement('cac:PartyIdentification');
        $custId = $xml->createElement('cbc:ID', $invoice->customer->document_number);
        $custId->setAttribute('schemeID', '13');
        $customerIdElem->appendChild($custId);
        $customerElem->appendChild($customerIdElem);

        $customerNameElem = $xml->createElement('cac:PartyName');
        $this->addElement($xml, $customerNameElem, 'cbc:Name', $invoice->customer->name);
        $customerElem->appendChild($customerNameElem);

        $customerLocation = $xml->createElement('cac:PhysicalLocation');
        $customerAddress = $xml->createElement('cac:Address');
        $this->addElement($xml, $customerAddress, 'cbc:Department', $invoice->customer->city ?? 'N/A');
        $this->addElement($xml, $customerAddress, 'cbc:CityName', $invoice->customer->city ?? 'N/A');
        $customerAddressLine = $xml->createElement('cbc:AddressLine');
        $this->addElement($xml, $customerAddressLine, 'cbc:Line', $invoice->customer->address ?? 'N/A');
        $customerAddress->appendChild($customerAddressLine);
        $this->addElement($xml, $customerAddress, 'cbc:CountrySubentity', 'CO');
        $customerLocation->appendChild($customerAddress);
        $customerElem->appendChild($customerLocation);

        $customerParty->appendChild($customerElem);
        $root->appendChild($customerParty);

        // Líneas de detalle
        foreach ($invoice->items as $index => $item) {
            $line = $xml->createElement('cac:InvoiceLine');
            $this->addElement($xml, $line, 'cbc:ID', $index + 1);
            
            $quantity = $xml->createElement('cbc:InvoicedQuantity', $item->quantity);
            $quantity->setAttribute('unitCode', 'EA');
            $line->appendChild($quantity);
            
            $lineAmount = $xml->createElement('cbc:LineExtensionAmount', number_format($item->subtotal, 0, '', ''));
            $lineAmount->setAttribute('currencyID', 'COP');
            $line->appendChild($lineAmount);

            $itemElem = $xml->createElement('cac:Item');
            $this->addElement($xml, $itemElem, 'cbc:Description', $item->product->name);
            $line->appendChild($itemElem);

            $price = $xml->createElement('cac:Price');
            $priceAmount = $xml->createElement('cbc:PriceAmount', number_format($item->unit_price, 0, '', ''));
            $priceAmount->setAttribute('currencyID', 'COP');
            $price->appendChild($priceAmount);
            $line->appendChild($price);

            $root->appendChild($line);
        }

        // Impuestos
        $taxTotal = $xml->createElement('cac:TaxTotal');
        $taxAmount = $xml->createElement('cbc:TaxAmount', number_format((float)$invoice->tax, 0, '', ''));
        $taxAmount->setAttribute('currencyID', 'COP');
        $taxTotal->appendChild($taxAmount);

        $taxSubtotal = $xml->createElement('cac:TaxSubtotal');
        $taxableAmount = $xml->createElement('cbc:TaxableAmount', number_format((float)$invoice->subtotal, 0, '', ''));
        $taxableAmount->setAttribute('currencyID', 'COP');
        $taxSubtotal->appendChild($taxableAmount);

        $taxAmountSub = $xml->createElement('cbc:TaxAmount', number_format((float)$invoice->tax, 0, '', ''));
        $taxAmountSub->setAttribute('currencyID', 'COP');
        $taxSubtotal->appendChild($taxAmountSub);

        $taxCategory = $xml->createElement('cac:TaxCategory');
        $this->addElement($xml, $taxCategory, 'cbc:Percent', '19');
        $taxScheme = $xml->createElement('cac:TaxScheme');
        $this->addElement($xml, $taxScheme, 'cbc:ID', '01');
        $this->addElement($xml, $taxScheme, 'cbc:Name', 'IVA');
        $taxCategory->appendChild($taxScheme);
        $taxSubtotal->appendChild($taxCategory);

        $taxTotal->appendChild($taxSubtotal);
        $root->appendChild($taxTotal);

        // Totales
        $monetaryTotal = $xml->createElement('cac:LegalMonetaryTotal');
        $lineExt = $xml->createElement('cbc:LineExtensionAmount', number_format((float)$invoice->subtotal, 0, '', ''));
        $lineExt->setAttribute('currencyID', 'COP');
        $monetaryTotal->appendChild($lineExt);

        $taxExclusive = $xml->createElement('cbc:TaxExclusiveAmount', number_format((float)$invoice->subtotal, 0, '', ''));
        $taxExclusive->setAttribute('currencyID', 'COP');
        $monetaryTotal->appendChild($taxExclusive);

        $taxInclusive = $xml->createElement('cbc:TaxInclusiveAmount', number_format((float)$invoice->total, 0, '', ''));
        $taxInclusive->setAttribute('currencyID', 'COP');
        $monetaryTotal->appendChild($taxInclusive);

        $payable = $xml->createElement('cbc:PayableAmount', number_format((float)$invoice->total, 0, '', ''));
        $payable->setAttribute('currencyID', 'COP');
        $monetaryTotal->appendChild($payable);

        $root->appendChild($monetaryTotal);

        // Firma digital (simulada)
        $signature = $xml->createElement('cac:Signature');
        $this->addElement($xml, $signature, 'cbc:ID', 'SIG-' . $invoice->invoice_number);
        $signatoryParty = $xml->createElement('cac:SignatoryParty');
        $sigPartyName = $xml->createElement('cac:PartyName');
        $this->addElement($xml, $sigPartyName, 'cbc:Name', config('app.company.name', 'PAPELERÍA SACT'));
        $signatoryParty->appendChild($sigPartyName);
        $signature->appendChild($signatoryParty);

        $digitalSig = $xml->createElement('cac:DigitalSignatureAttachment');
        $externalRef = $xml->createElement('cac:ExternalReference');
        $this->addElement($xml, $externalRef, 'cbc:URI', '#Signature' . $invoice->id);
        $digitalSig->appendChild($externalRef);
        $signature->appendChild($digitalSig);
        $root->appendChild($signature);

        return response($xml->saveXML())
            ->header('Content-Type', 'application/xml')
            ->header('Content-Disposition', 'inline; filename="' . $invoice->invoice_number . '.xml"');
    }

    private function addElement($xml, $parent, $name, $value)
    {
        $element = $xml->createElement($name, htmlspecialchars($value));
        $parent->appendChild($element);
        return $element;
    }

    public function generatePdf(Invoice $invoice)
    {
        $invoice->load(['customer', 'items.product', 'user']);

        $data = [
            'invoice' => $invoice,
            'company' => [
                'name' => config('app.company.name'),
                'nit' => config('app.company.nit'),
                'address' => config('app.company.address'),
                'city' => config('app.company.city'),
                'department' => config('app.company.department'),
                'phone' => config('app.company.phone'),
                'email' => config('app.company.email'),
            ],
        ];

        $pdf = Pdf::loadView('pdf.invoice', $data);
        return $pdf->stream($invoice->invoice_number . '.pdf');
    }
}
