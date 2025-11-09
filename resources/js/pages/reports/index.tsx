import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { TrendingUp, Package, AlertCircle } from 'lucide-react'
import { useState } from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Reportes', href: '/reports' },
]

interface ReportsData {
  sales: {
    total: number
    count: number
    average: number
    by_payment_method: {
      cash: number
      card: number
      transfer: number
      credit: number
    }
    pending: number
  }
  inventory: {
    total_value: number
    low_stock_count: number
  }
  top_products: Array<{
    name: string
    quantity: number
    revenue: number
  }>
  profit_loss: {
    income: number
    costs: number
    gross_profit: number
    expenses: number
    net_profit: number
    margin: number
  }
}

export default function ReportsIndex({ data, startDate: initialStartDate, endDate: initialEndDate }: { data: ReportsData, startDate: string, endDate: string }) {
  const [startDate, setStartDate] = useState(initialStartDate)
  const [endDate, setEndDate] = useState(initialEndDate)

  const handleFilterChange = () => {
    if (startDate && endDate) {
      window.location.href = `/reports?start_date=${startDate}&end_date=${endDate}`
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const paymentMethods = [
    { key: 'cash', label: 'Efectivo', value: data.sales.by_payment_method.cash },
    { key: 'card', label: 'Tarjeta', value: data.sales.by_payment_method.card },
    { key: 'transfer', label: 'Transferencia', value: data.sales.by_payment_method.transfer },
    { key: 'credit', label: 'Crédito', value: data.sales.by_payment_method.credit },
  ]

  const maxPaymentValue = Math.max(...paymentMethods.map(pm => pm.value))

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Reportes" />
      <div className="flex h-full flex-1 flex-col gap-6 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Reportes</h2>
          <div className="flex gap-2">
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="rounded-lg border border-sidebar-border/70 bg-white px-3 py-2 text-sm dark:border-sidebar-border dark:bg-[#161615] dark:text-[#EDEDEC]"
              placeholder="Desde"
            />
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="rounded-lg border border-sidebar-border/70 bg-white px-3 py-2 text-sm dark:border-sidebar-border dark:bg-[#161615] dark:text-[#EDEDEC]"
              placeholder="Hasta"
            />
            <button
              onClick={handleFilterChange}
              disabled={!startDate || !endDate}
              className="rounded-lg bg-[#1b1b18] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d2d28] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d4d4d0]"
            >
              Filtrar
            </button>
          </div>
        </div>

        {/* Ventas */}
        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-[#706f6c]" />
            <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Ventas</h3>
          </div>

          <div className="grid gap-4 md:grid-cols-3 mb-6">
            <div>
              <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mb-1">Total Vendido</p>
              <p className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                {formatCurrency(data.sales.total)}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mb-1">Facturas</p>
              <p className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                {data.sales.count}
              </p>
            </div>
            <div>
              <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mb-1">Promedio</p>
              <p className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                {formatCurrency(data.sales.average)}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-[#706f6c] dark:text-[#A1A09A]">Por Método de Pago</p>
            {paymentMethods.map(method => (
              <div key={method.key}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#1b1b18] dark:text-[#EDEDEC]">{method.label}</span>
                  <span className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                    {formatCurrency(method.value)}
                  </span>
                </div>
                <div className="h-2 bg-[#EDEDEC] dark:bg-[#1b1b18] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#706f6c] dark:bg-[#A1A09A] transition-all"
                    style={{ width: `${maxPaymentValue > 0 ? (method.value / maxPaymentValue) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {data.sales.pending > 0 && (
            <div className="mt-6 p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-sm font-medium text-orange-900 dark:text-orange-200">
                    Pendiente por cobrar
                  </p>
                  <p className="text-lg font-bold text-orange-900 dark:text-orange-200">
                    {formatCurrency(data.sales.pending)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Inventario y Top Productos */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
            <div className="mb-6 flex items-center gap-2">
              <Package className="h-6 w-6 text-[#706f6c]" />
              <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Inventario</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A] mb-1">Valor Total</p>
                <p className="text-2xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                  {formatCurrency(data.inventory.total_value)}
                </p>
              </div>

              {data.inventory.low_stock_count > 0 && (
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-200">
                        Productos con stock bajo
                      </p>
                      <p className="text-lg font-bold text-red-900 dark:text-red-200">
                        {data.inventory.low_stock_count}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
            <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-6">
              Top 5 Productos
            </h3>

            <div className="space-y-4">
              {data.top_products.map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                      {product.name}
                    </p>
                    <p className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                      {product.quantity}
                      {' '}
                      unidades
                    </p>
                  </div>
                  <p className="text-sm font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                    {formatCurrency(product.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* P&L */}
        <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
          <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC] mb-6">
            Estado de Pérdidas y Ganancias
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between py-2 border-b border-sidebar-border/70 dark:border-sidebar-border">
              <span className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Ingresos</span>
              <span className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                {formatCurrency(data.profit_loss.income)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-sidebar-border/70 dark:border-sidebar-border">
              <span className="text-sm text-[#706f6c] dark:text-[#A1A09A]">- Costos</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {formatCurrency(data.profit_loss.costs)}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-sidebar-border/70 dark:border-sidebar-border">
              <span className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">Utilidad Bruta</span>
              <span className="font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                {formatCurrency(data.profit_loss.gross_profit)}
              </span>
            </div>

            {/* <div className="flex justify-between py-2 border-b border-sidebar-border/70 dark:border-sidebar-border">
              <span className="text-sm text-[#706f6c] dark:text-[#A1A09A]">- Gastos</span>
              <span className="font-medium text-red-600 dark:text-red-400">
                {formatCurrency(data.profit_loss.expenses)}
              </span>
            </div> */}

            <div className="flex justify-between py-3 bg-[#EDEDEC] dark:bg-[#1b1b18] rounded-lg px-4">
              <span className="font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Utilidad Neta</span>
              <div className="text-right">
                <p className="font-bold text-xl text-[#1b1b18] dark:text-[#EDEDEC]">
                  {formatCurrency(data.profit_loss.net_profit)}
                </p>
                <p className={`text-sm font-medium ${data.profit_loss.margin >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {data.profit_loss.margin.toFixed(2)}
                  % margen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
