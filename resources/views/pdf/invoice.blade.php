<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ $invoice->invoice_number }}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: Arial, sans-serif;
            font-size: 12px;
            color: #333;
            padding: 20px;
        }
        .header {
            display: table;
            width: 100%;
            margin-bottom: 30px;
            border-bottom: 2px solid #1b1b18;
            padding-bottom: 15px;
        }
        .header-left {
            display: table-cell;
            width: 60%;
            vertical-align: top;
        }
        .header-right {
            display: table-cell;
            width: 40%;
            vertical-align: top;
            text-align: right;
        }
        .company-name {
            font-size: 20px;
            font-weight: bold;
            color: #1b1b18;
            margin-bottom: 5px;
        }
        .company-info {
            font-size: 11px;
            color: #666;
            line-height: 1.5;
        }
        .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #1b1b18;
            margin-bottom: 5px;
        }
        .invoice-number {
            font-size: 14px;
            color: #666;
        }
        .section {
            margin-bottom: 20px;
        }
        .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #1b1b18;
            margin-bottom: 8px;
            text-transform: uppercase;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }
        .customer-info {
            background: #f9f9f9;
            padding: 12px;
            border-radius: 4px;
        }
        .info-row {
            margin-bottom: 4px;
        }
        .info-label {
            font-weight: bold;
            color: #555;
            display: inline-block;
            width: 100px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        thead {
            background: #1b1b18;
            color: white;
        }
        th {
            padding: 10px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
        }
        th.text-right {
            text-align: right;
        }
        td {
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        td.text-right {
            text-align: right;
        }
        td.text-center {
            text-align: center;
        }
        .totals {
            margin-top: 20px;
            float: right;
            width: 300px;
        }
        .total-row {
            display: table;
            width: 100%;
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .total-row.final {
            border-bottom: 2px solid #1b1b18;
            font-size: 14px;
            font-weight: bold;
            background: #f9f9f9;
            padding: 12px 0;
            margin-top: 5px;
        }
        .total-label {
            display: table-cell;
            text-align: left;
            padding-left: 10px;
        }
        .total-value {
            display: table-cell;
            text-align: right;
            padding-right: 10px;
        }
        .footer {
            margin-top: 60px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 10px;
            color: #999;
            clear: both;
        }
        .payment-info {
            background: #f0f8ff;
            padding: 12px;
            border-radius: 4px;
            margin-top: 20px;
            border-left: 4px solid #1b1b18;
        }
        .status-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-paid {
            background: #d4edda;
            color: #155724;
        }
        .status-pending {
            background: #fff3cd;
            color: #856404;
        }
        .status-partial {
            background: #d1ecf1;
            color: #0c5460;
        }
    </style>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-left">
            <div class="company-name">{{ $company['name'] }}</div>
            <div class="company-info">
                NIT: {{ $company['nit'] }}<br>
                {{ $company['address'] }}<br>
                {{ $company['city'] }}, {{ $company['department'] }}<br>
                @if($company['phone'])
                Tel: {{ $company['phone'] }}<br>
                @endif
                @if($company['email'])
                Email: {{ $company['email'] }}
                @endif
            </div>
        </div>
        <div class="header-right">
            <div class="invoice-title">FACTURA</div>
            <div class="invoice-number">{{ $invoice->invoice_number }}</div>
            <div style="margin-top: 10px; font-size: 11px; color: #666;">
                Fecha: {{ \Carbon\Carbon::parse($invoice->date)->format('d/m/Y H:i') }}
            </div>
        </div>
    </div>

    <!-- Customer Info -->
    <div class="section">
        <div class="section-title">Información del Cliente</div>
        <div class="customer-info">
            <div class="info-row">
                <span class="info-label">Cliente:</span>
                <span>{{ $invoice->customer->name }}</span>
            </div>
            <div class="info-row">
                <span class="info-label">Documento:</span>
                <span>{{ $invoice->customer->document_number }}</span>
            </div>
            @if($invoice->customer->email)
            <div class="info-row">
                <span class="info-label">Email:</span>
                <span>{{ $invoice->customer->email }}</span>
            </div>
            @endif
            @if($invoice->customer->phone)
            <div class="info-row">
                <span class="info-label">Teléfono:</span>
                <span>{{ $invoice->customer->phone }}</span>
            </div>
            @endif
            @if($invoice->customer->address)
            <div class="info-row">
                <span class="info-label">Dirección:</span>
                <span>{{ $invoice->customer->address }}</span>
            </div>
            @endif
        </div>
    </div>

    <!-- Items -->
    <div class="section">
        <div class="section-title">Detalle de Productos</div>
        <table>
            <thead>
                <tr>
                    <th style="width: 10%;">Cant.</th>
                    <th style="width: 50%;">Producto</th>
                    <th class="text-right" style="width: 20%;">Precio Unit.</th>
                    <th class="text-right" style="width: 20%;">Subtotal</th>
                </tr>
            </thead>
            <tbody>
                @foreach($invoice->items as $item)
                <tr>
                    <td class="text-center">{{ $item->quantity }}</td>
                    <td>{{ $item->product->name }}</td>
                    <td class="text-right">${{ number_format($item->unit_price, 0, ',', '.') }}</td>
                    <td class="text-right">${{ number_format($item->subtotal, 0, ',', '.') }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <!-- Totals -->
    <div class="totals">
        <div class="total-row">
            <div class="total-label">Subtotal:</div>
            <div class="total-value">${{ number_format($invoice->subtotal, 0, ',', '.') }}</div>
        </div>
        <div class="total-row">
            <div class="total-label">IVA (19%):</div>
            <div class="total-value">${{ number_format($invoice->tax, 0, ',', '.') }}</div>
        </div>
        @if($invoice->discount > 0)
        <div class="total-row">
            <div class="total-label">Descuento:</div>
            <div class="total-value">-${{ number_format($invoice->discount, 0, ',', '.') }}</div>
        </div>
        @endif
        <div class="total-row final">
            <div class="total-label">TOTAL:</div>
            <div class="total-value">${{ number_format($invoice->total, 0, ',', '.') }}</div>
        </div>
    </div>

    <!-- Payment Info -->
    <div style="clear: both;"></div>
    <div class="payment-info">
        <div class="info-row">
            <span class="info-label">Método de Pago:</span>
            <span>
                @switch($invoice->payment_method)
                    @case('cash')
                        Efectivo
                        @break
                    @case('card')
                        Tarjeta
                        @break
                    @case('transfer')
                        Transferencia
                        @break
                    @case('credit')
                        Crédito
                        @break
                    @default
                        {{ $invoice->payment_method }}
                @endswitch
            </span>
        </div>
        <div class="info-row" style="margin-top: 8px;">
            <span class="info-label">Estado:</span>
            <span class="status-badge 
                @if($invoice->payment_status === 'paid') status-paid
                @elseif($invoice->payment_status === 'pending') status-pending
                @else status-partial
                @endif">
                @switch($invoice->payment_status)
                    @case('paid')
                        Pagado
                        @break
                    @case('pending')
                        Pendiente
                        @break
                    @case('partial')
                        Parcial
                        @break
                    @default
                        {{ $invoice->payment_status }}
                @endswitch
            </span>
        </div>
        @if($invoice->user)
        <div class="info-row" style="margin-top: 8px;">
            <span class="info-label">Atendido por:</span>
            <span>{{ $invoice->user->name }}</span>
        </div>
        @endif
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>Gracias por su compra</p>
        <p style="margin-top: 5px;">Este documento es una representación impresa de la factura electrónica</p>
    </div>
</body>
</html>
