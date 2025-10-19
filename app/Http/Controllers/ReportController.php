<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use App\Models\Product;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function salesReport(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now());

        $sales = Invoice::whereBetween('date', [$startDate, $endDate])
            ->with(['customer', 'items.product'])
            ->get();

        $summary = [
            'total_sales' => $sales->sum('total'),
            'total_invoices' => $sales->count(),
            'average_sale' => $sales->avg('total'),
            'cash_sales' => $sales->where('payment_method', 'cash')->sum('total'),
            'credit_sales' => $sales->where('payment_method', 'credit')->sum('total'),
            'pending_amount' => $sales->where('payment_status', 'pending')->sum('total'),
        ];

        return response()->json([
            'sales' => $sales,
            'summary' => $summary,
        ]);
    }

    public function inventoryReport()
    {
        $products = Product::with('movements')
            ->where('is_active', true)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'code' => $product->code,
                    'stock' => $product->stock,
                    'min_stock' => $product->min_stock,
                    'is_low_stock' => $product->isLowStock(),
                    'unit_price' => $product->unit_price,
                    'cost' => $product->cost,
                    'total_value' => $product->stock * $product->cost,
                ];
            });

        return response()->json([
            'products' => $products,
            'total_inventory_value' => $products->sum('total_value'),
            'low_stock_count' => $products->where('is_low_stock', true)->count(),
        ]);
    }

    public function balanceSheet(Request $request)
    {
        $accounts = Account::with('transactions')
            ->where('is_active', true)
            ->get()
            ->map(function ($account) {
                return [
                    'code' => $account->code,
                    'name' => $account->name,
                    'type' => $account->type,
                    'balance' => $account->getBalance(),
                ];
            })
            ->groupBy('type');

        $totalAssets = $accounts->get('activo', collect())->sum('balance');
        $totalLiabilities = $accounts->get('pasivo', collect())->sum('balance');
        $totalEquity = $accounts->get('patrimonio', collect())->sum('balance');

        return response()->json([
            'accounts' => $accounts,
            'totals' => [
                'assets' => $totalAssets,
                'liabilities' => $totalLiabilities,
                'equity' => $totalEquity,
            ],
        ]);
    }

    public function profitAndLoss(Request $request)
    {
        $startDate = $request->input('start_date', now()->startOfMonth());
        $endDate = $request->input('end_date', now());

        $income = Account::where('type', 'ingreso')
            ->with(['transactions' => function ($query) use ($startDate, $endDate) {
                $query->whereBetween('date', [$startDate, $endDate]);
            }])
            ->get()
            ->sum(fn($account) => $account->transactions->sum('credit') - $account->transactions->sum('debit'));

        $costs = Account::where('type', 'costo')
            ->with(['transactions' => function ($query) use ($startDate, $endDate) {
                $query->whereBetween('date', [$startDate, $endDate]);
            }])
            ->get()
            ->sum(fn($account) => $account->transactions->sum('debit') - $account->transactions->sum('credit'));

        $expenses = Account::where('type', 'gasto')
            ->with(['transactions' => function ($query) use ($startDate, $endDate) {
                $query->whereBetween('date', [$startDate, $endDate]);
            }])
            ->get()
            ->sum(fn($account) => $account->transactions->sum('debit') - $account->transactions->sum('credit'));

        $grossProfit = $income - $costs;
        $netProfit = $grossProfit - $expenses;

        return response()->json([
            'income' => $income,
            'costs' => $costs,
            'gross_profit' => $grossProfit,
            'expenses' => $expenses,
            'net_profit' => $netProfit,
            'profit_margin' => $income > 0 ? ($netProfit / $income) * 100 : 0,
        ]);
    }
}
