<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reporte General</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #333;
            padding: 20px;
        }

        .header {
            display: table;
            width: 100%;
            margin-bottom: 25px;
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
            font-size: 18px;
            font-weight: bold;
            color: #1b1b18;
            margin-bottom: 5px;
        }

        .company-info {
            font-size: 10px;
            color: #666;
            line-height: 1.5;
        }

        .report-title {
            font-size: 22px;
            font-weight: bold;
            color: #1b1b18;
            margin-bottom: 5px;
        }

        .report-date {
            font-size: 11px;
            color: #666;
        }

        .section {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 13px;
            font-weight: bold;
            color: #1b1b18;
            margin-bottom: 10px;
            text-transform: uppercase;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
        }

        .card {
            background: #f9f9f9;
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 10px;
        }

        .stat-grid {
            display: table;
            width: 100%;
            margin-bottom: 10px;
        }

        .stat-item {
            display: table-cell;
            width: 33.33%;
            padding: 8px;
        }

        .stat-label {
            font-size: 10px;
            color: #666;
            margin-bottom: 3px;
        }

        .stat-value {
            font-size: 16px;
            font-weight: bold;
            color: #1b1b18;
        }

        .payment-method {
            margin-bottom: 8px;
        }

        .payment-method-header {
            display: table;
            width: 100%;
            margin-bottom: 3px;
        }

        .payment-method-label {
            display: table-cell;
            font-size: 10px;
            color: #1b1b18;
        }

        .payment-method-value {
            display: table-cell;
            text-align: right;
            font-size: 10px;
            font-weight: bold;
            color: #1b1b18;
        }

        .payment-bar {
            height: 6px;
            background: #e0e0e0;
            border-radius: 3px;
            overflow: hidden;
        }

        .payment-bar-fill {
            height: 100%;
            background: #706f6c;
        }

        .alert-box {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 10px;
            margin-top: 10px;
        }

        .alert-box.danger {
            background: #f8d7da;
            border-left-color: #dc3545;
        }

        .alert-title {
            font-weight: bold;
            font-size: 10px;
            color: #856404;
            margin-bottom: 3px;
        }

        .alert-box.danger .alert-title {
            color: #721c24;
        }

        .alert-value {
            font-size: 14px;
            font-weight: bold;
            color: #856404;
        }

        .alert-box.danger .alert-value {
            color: #721c24;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }

        th {
            background: #1b1b18;
            color: white;
            padding: 8px;
            text-align: left;
            font-size: 10px;
            text-transform: uppercase;
        }

        th.text-right {
            text-align: right;
        }

        td {
            padding: 8px;
            border-bottom: 1px solid #eee;
            font-size: 10px;
        }

        td.text-right {
            text-align: right;
        }

        .pl-row {
            display: table;
            width: 100%;
            padding: 6px 0;
            border-bottom: 1px solid #eee;
        }

        .pl-row.total {
            background: #f9f9f9;
            padding: 10px;
            border: 2px solid #1b1b18;
            margin-top: 10px;
        }

        .pl-label {
            display: table-cell;
            width: 70%;
            font-size: 11px;
        }

        .pl-label.bold {
            font-weight: bold;
        }

        .pl-value {
            display: table-cell;
            text-align: right;
            font-size: 11px;
        }

        .pl-value.bold {
            font-weight: bold;
            font-size: 14px;
        }

        .pl-value.red {
            color: #dc3545;
        }

        .pl-value.green {
            color: #28a745;
        }

        .two-col {
            display: table;
            width: 100%;
        }

        .col-50 {
            display: table-cell;
            width: 48%;
            vertical-align: top;
            padding-right: 2%;
        }

        .footer {
            margin-top: 30px;
            padding-top: 15px;
            border-top: 1px solid #ddd;
            text-align: center;
            font-size: 9px;
            color: #999;
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
                {{ $company['city'] }}
            </div>
        </div>
        <div class="header-right">
            <div class="report-title">REPORTE GENERAL</div>
            <div class="report-date">
                Período: {{ $startDate }} - {{ $endDate }}<br>
                Generado: {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
            </div>
        </div>
    </div>

    <!-- Ventas -->
    <div class="section">
        <div class="section-title">Ventas</div>
        <div class="card">
            <div class="stat-grid">
                <div class="stat-item">
                    <div class="stat-label">Total Vendido</div>
                    <div class="stat-value">${{ number_format($sales['total'], 0, ',', '.') }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Facturas</div>
                    <div class="stat-value">{{ $sales['count'] }}</div>
                </div>
                <div class="stat-item">
                    <div class="stat-label">Promedio</div>
                    <div class="stat-value">${{ number_format($sales['average'], 0, ',', '.') }}</div>
                </div>
            </div>

            <div style="margin-top: 15px;">
                <div style="font-size: 11px; font-weight: bold; margin-bottom: 8px;">Por Método de Pago</div>

                <div class="payment-method">
                    <div class="payment-method-header">
                        <div class="payment-method-label">Efectivo</div>
                        <div class="payment-method-value">
                            ${{ number_format($sales['by_payment_method']['cash'], 0, ',', '.') }}</div>
                    </div>
                    <div class="payment-bar">
                        <div class="payment-bar-fill"
                            style="width: {{ $sales['total'] > 0 ? ($sales['by_payment_method']['cash'] / $sales['total'] * 100) : 0 }}%;">
                        </div>
                    </div>
                </div>

                <div class="payment-method">
                    <div class="payment-method-header">
                        <div class="payment-method-label">Tarjeta</div>
                        <div class="payment-method-value">
                            ${{ number_format($sales['by_payment_method']['card'], 0, ',', '.') }}</div>
                    </div>
                    <div class="payment-bar">
                        <div class="payment-bar-fill"
                            style="width: {{ $sales['total'] > 0 ? ($sales['by_payment_method']['card'] / $sales['total'] * 100) : 0 }}%;">
                        </div>
                    </div>
                </div>

                <div class="payment-method">
                    <div class="payment-method-header">
                        <div class="payment-method-label">Transferencia</div>
                        <div class="payment-method-value">
                            ${{ number_format($sales['by_payment_method']['transfer'], 0, ',', '.') }}</div>
                    </div>
                    <div class="payment-bar">
                        <div class="payment-bar-fill"
                            style="width: {{ $sales['total'] > 0 ? ($sales['by_payment_method']['transfer'] / $sales['total'] * 100) : 0 }}%;">
                        </div>
                    </div>
                </div>
            </div>

            @if($sales['pending'] > 0)
                <div class="alert-box">
                    <div class="alert-title">Pendiente por cobrar</div>
                    <div class="alert-value">${{ number_format($sales['pending'], 0, ',', '.') }}</div>
                </div>
            @endif
        </div>
    </div>

    <!-- Inventario y Top Productos -->
    <div class="two-col">
        <div class="col-50">
            <div class="section">
                <div class="section-title">Inventario</div>
                <div class="card">
                    <div class="stat-label">Valor Total</div>
                    <div class="stat-value" style="margin-bottom: 10px;">
                        ${{ number_format($inventory['total_value'], 0, ',', '.') }}</div>

                    @if($inventory['low_stock_count'] > 0)
                        <div class="alert-box danger">
                            <div class="alert-title">Productos con stock bajo</div>
                            <div class="alert-value">{{ $inventory['low_stock_count'] }}</div>
                        </div>
                    @endif
                </div>
            </div>
        </div>

        <div class="col-50">
            <div class="section">
                <div class="section-title">Top 5 Productos</div>
                <table>
                    <thead>
                        <tr>
                            <th>Producto</th>
                            <th class="text-right">Unid.</th>
                            <th class="text-right">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($top_products as $product)
                            <tr>
                                <td>{{ $product->name }}</td>
                                <td class="text-right">{{ $product->total_quantity }}</td>
                                <td class="text-right">${{ number_format($product->total_sales, 0, ',', '.') }}</td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Estado de Pérdidas y Ganancias -->
    <div class="section">
        <div class="section-title">Estado de Pérdidas y Ganancias</div>
        <div class="card">
            <div class="pl-row">
                <div class="pl-label">Ingresos</div>
                <div class="pl-value">${{ number_format($profit_loss['income'], 0, ',', '.') }}</div>
            </div>

            <div class="pl-row">
                <div class="pl-label">- Costos</div>
                <div class="pl-value red">${{ number_format($profit_loss['costs'], 0, ',', '.') }}</div>
            </div>

            <div class="pl-row">
                <div class="pl-label bold">Utilidad Bruta</div>
                <div class="pl-value bold">${{ number_format($profit_loss['gross_profit'], 0, ',', '.') }}</div>
            </div>

            <div class="pl-row total">
                <div class="pl-label bold">UTILIDAD NETA</div>
                <div class="pl-value bold {{ $profit_loss['net_profit'] >= 0 ? 'green' : 'red' }}">
                    ${{ number_format($profit_loss['net_profit'], 0, ',', '.') }}<br>
                    <span style="font-size: 10px;">{{ number_format($profit_loss['margin'], 2) }}% margen</span>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <div class="footer">
        <p>{{ $company['name'] }} - Reporte generado automáticamente</p>
    </div>
</body>

</html>