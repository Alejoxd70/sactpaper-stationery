<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

Route::get('/', function () {
    if (Auth::check()) {
        return redirect()->route('dashboard');
    }
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $stats = [
            'today_sales' => \App\Models\Invoice::whereBetween(DB::raw('DATE(date)'), [today()->format('Y-m-d'), today()->format('Y-m-d')])->sum('total'),
            'pending_invoices' => \App\Models\Invoice::where('payment_status', 'pending')->count(),
            'low_stock_products' => \App\Models\Product::whereColumn('stock', '<=', 'min_stock')->count(),
            'total_customers' => \App\Models\Customer::where('is_active', true)->count(),
        ];
        
        return Inertia::render('dashboard', ['stats' => $stats]);
    })->name('dashboard');

    // Ventas
    Route::get('sales', function () {
        $invoices = \App\Models\Invoice::with(['customer', 'user', 'items.product'])
            ->orderBy('created_at', 'desc')
            ->get();
        return Inertia::render('sales/index', ['invoices' => $invoices]);
    })->name('sales');

    Route::get('sales/new', function () {
        $products = \App\Models\Product::where('is_active', true)->get();
        $customers = \App\Models\Customer::where('is_active', true)->get();
        return Inertia::render('sales/new', ['products' => $products, 'customers' => $customers]);
    })->name('sales.new');

    Route::post('sales', [InvoiceController::class, 'store'])->name('sales.store');
    Route::get('sales/{invoice}/xml', [InvoiceController::class, 'generateXml'])->name('sales.xml');
    Route::get('sales/{invoice}/pdf', [InvoiceController::class, 'generatePdf'])->name('sales.pdf');

    // Productos
    Route::get('products', function () {
        $products = \App\Models\Product::where('is_active', true)->get();
        return Inertia::render('products/index', ['products' => $products]);
    })->name('products');

    Route::post('products', [ProductController::class, 'store'])->name('products.store');
    Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
    Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

    // Clientes
    Route::get('customers', function () {
        $customers = \App\Models\Customer::where('is_active', true)->get();
        return Inertia::render('customers/index', ['customers' => $customers]);
    })->name('customers');

    Route::post('customers', [CustomerController::class, 'store'])->name('customers.store');

    // Usuarios (solo admin)
    Route::middleware(['role:admin'])->group(function () {
        Route::get('users', [UserController::class, 'index'])->name('users');
        Route::post('users', [UserController::class, 'store'])->name('users.store');
        Route::put('users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });

    // Contabilidad
    Route::get('accounting', function () {
        $accounts = \App\Models\Account::with(['parent', 'children'])
            ->orderBy('code')
            ->get();
        
        $transactions = \App\Models\Transaction::with(['account', 'user', 'invoice'])
            ->orderBy('date', 'desc')
            ->orderBy('created_at', 'desc')
            ->limit(50)
            ->get();
        
        return Inertia::render('accounting/index', [
            'accounts' => $accounts,
            'transactions' => $transactions
        ]);
    })->name('accounting');

    // Reportes
    Route::get('reports', function () {
        $startDate = request('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = request('end_date', now()->endOfDay()->format('Y-m-d'));

        // Ventas del período
        $sales = \App\Models\Invoice::whereBetween(DB::raw('DATE(date)'), [$startDate, $endDate])->get();
        
        // Productos
        $products = \App\Models\Product::where('is_active', true)->get();
        $inventoryValue = $products->sum(fn($p) => $p->stock * $p->cost);
        
        // Top productos vendidos
        $topProducts = DB::table('invoice_items')
            ->join('invoices', 'invoice_items.invoice_id', '=', 'invoices.id')
            ->join('products', 'invoice_items.product_id', '=', 'products.id')
            ->whereBetween(DB::raw('DATE(invoices.date)'), [$startDate, $endDate])
            ->select(
                'products.name',
                DB::raw('SUM(invoice_items.quantity) as total_quantity'),
                DB::raw('SUM(invoice_items.subtotal) as total_sales')
            )
            ->groupBy('products.id', 'products.name')
            ->orderByDesc('total_sales')
            ->limit(5)
            ->get();

        // Estado de Resultados
        $income = \App\Models\Account::where('type', 'ingreso')
            ->with(['transactions' => fn($q) => $q->whereBetween(DB::raw('DATE(date)'), [$startDate, $endDate])])
            ->get()
            ->sum(fn($a) => $a->transactions->sum('credit') - $a->transactions->sum('debit'));

        $costs = \App\Models\Account::where('type', 'costo')
            ->with(['transactions' => fn($q) => $q->whereBetween(DB::raw('DATE(date)'), [$startDate, $endDate])])
            ->get()
            ->sum(fn($a) => $a->transactions->sum('debit') - $a->transactions->sum('credit'));

        $expenses = \App\Models\Account::where('type', 'gasto')
            ->with(['transactions' => fn($q) => $q->whereBetween(DB::raw('DATE(date)'), [$startDate, $endDate])])
            ->get()
            ->sum(fn($a) => $a->transactions->sum('debit') - $a->transactions->sum('credit'));

        return Inertia::render('reports/index', [
            'startDate' => $startDate,
            'endDate' => $endDate,
            'data' => [
                'sales' => [
                    'total' => $sales->sum('total'),
                    'count' => $sales->count(),
                    'average' => $sales->avg('total') ?? 0,
                    'by_payment_method' => [
                        'cash' => $sales->where('payment_method', 'cash')->sum('total'),
                        'card' => $sales->where('payment_method', 'card')->sum('total'),
                        'transfer' => $sales->where('payment_method', 'transfer')->sum('total'),
                        'credit' => $sales->where('payment_method', 'credit')->sum('total'),
                    ],
                    'pending' => $sales->where('payment_status', 'pending')->sum('total'),
                ],
                'inventory' => [
                    'total_value' => $inventoryValue,
                    'low_stock_count' => $products->filter(fn($p) => $p->stock <= $p->min_stock)->count(),
                ],
                'top_products' => $topProducts->map(fn($p) => [
                    'name' => $p->name,
                    'quantity' => $p->total_quantity,
                    'revenue' => $p->total_sales,
                ]),
                'profit_loss' => [
                    'income' => $income,
                    'costs' => $costs,
                    'gross_profit' => $income - $costs,
                    'expenses' => $expenses,
                    'net_profit' => $income - $costs - $expenses,
                    'margin' => $income > 0 ? (($income - $costs - $expenses) / $income) * 100 : 0,
                ],
            ],
        ]);
    })->name('reports');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
