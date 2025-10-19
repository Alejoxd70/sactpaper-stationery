<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Transaction;
use App\Models\InventoryMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

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
                'date' => $request->date,
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
                    'date' => $request->date,
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
        // Débito: Caja o Clientes (si es crédito)
        Transaction::create([
            'user_id' => Auth::id(),
            'account_id' => $invoice->payment_method === 'credit' ? 5 : 3, // 1305 Clientes : 1105 Caja
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
            'account_id' => 11, // 2367 IVA por pagar
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
            'account_id' => 16, // 4135 Comercio
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
            'account_id' => 23, // 6135 Costo mercancías
            'invoice_id' => $invoice->id,
            'date' => $invoice->date,
            'description' => "Costo venta - Factura {$invoice->invoice_number}",
            'debit' => $costTotal,
            'credit' => 0,
            'reference' => $invoice->invoice_number,
        ]);

        Transaction::create([
            'user_id' => Auth::id(),
            'account_id' => 6, // 1435 Inventario
            'invoice_id' => $invoice->id,
            'date' => $invoice->date,
            'description' => "Salida inventario - Factura {$invoice->invoice_number}",
            'debit' => 0,
            'credit' => $costTotal,
            'reference' => $invoice->invoice_number,
        ]);
    }
}
