<?php

use App\Http\Controllers\InvoiceController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\AccountController;
use App\Http\Controllers\ReportController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes - Sistema Contable
|--------------------------------------------------------------------------
*/

// Rutas públicas
Route::middleware(['auth'])->group(function () {
    
    // FACTURAS - Todos los roles autenticados
    Route::prefix('invoices')->group(function () {
        Route::get('/', [InvoiceController::class, 'index']);
        Route::get('/{id}', [InvoiceController::class, 'show']);
        Route::post('/', [InvoiceController::class, 'store']);
        Route::put('/{id}', [InvoiceController::class, 'update']);
        Route::delete('/{id}', [InvoiceController::class, 'destroy']);
    });

    // PRODUCTOS - Cajeros y superiores
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index']);
        Route::get('/{id}', [ProductController::class, 'show']);
        Route::post('/', [ProductController::class, 'store']);
        Route::put('/{id}', [ProductController::class, 'update']);
        Route::delete('/{id}', [ProductController::class, 'destroy']);
        Route::get('/{id}/movements', [ProductController::class, 'movements']);
    });

    // CLIENTES - Cajeros y superiores
    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index']);
        Route::get('/{id}', [CustomerController::class, 'show']);
        Route::post('/', [CustomerController::class, 'store']);
        Route::put('/{id}', [CustomerController::class, 'update']);
        Route::delete('/{id}', [CustomerController::class, 'destroy']);
        Route::get('/{id}/invoices', [CustomerController::class, 'invoices']);
    });

    // CUENTAS PUC - Solo contadores y admin
    Route::prefix('accounts')->group(function () {
        Route::get('/', [AccountController::class, 'index']);
        Route::get('/{id}', [AccountController::class, 'show']);
        Route::post('/', [AccountController::class, 'store']);
        Route::put('/{id}', [AccountController::class, 'update']);
        Route::delete('/{id}', [AccountController::class, 'destroy']);
        Route::get('/{id}/transactions', [AccountController::class, 'transactions']);
        Route::get('/{id}/balance', [AccountController::class, 'balance']);
    });

    // REPORTES - Solo contadores y admin
    Route::prefix('reports')->group(function () {
        Route::get('/sales', [ReportController::class, 'salesReport']);
        Route::get('/inventory', [ReportController::class, 'inventoryReport']);
        Route::get('/balance-sheet', [ReportController::class, 'balanceSheet']);
        Route::get('/profit-loss', [ReportController::class, 'profitAndLoss']);
    });

    // DASHBOARD - Todos
    Route::get('/dashboard/summary', function () {
        $user = Auth::user();
        
        return response()->json([
            'user' => [
                'name' => $user->name,
                'role' => $user->role,
            ],
            'quick_stats' => [
                'today_sales' => \App\Models\Invoice::whereBetween(DB::raw('DATE(date)'), [today()->format('Y-m-d'), today()->format('Y-m-d')])->sum('total'),
                'pending_invoices' => \App\Models\Invoice::where('payment_status', 'pending')->count(),
                'low_stock_products' => \App\Models\Product::whereColumn('stock', '<=', 'min_stock')->count(),
                'total_customers' => \App\Models\Customer::where('is_active', true)->count(),
            ],
        ]);
    });
});

/*
|--------------------------------------------------------------------------
| Registro del Middleware en bootstrap/app.php
|--------------------------------------------------------------------------

use App\Http\Middleware\RoleMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);
    })
    ->create();

*/
