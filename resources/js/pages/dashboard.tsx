import AppLayout from '@/layouts/app-layout'
import { dashboard } from '@/routes'
import { type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { ShoppingCart, Package, Users, AlertCircle, TrendingUp, ArrowUpRight, DollarSign } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: dashboard().url,
  },
]

interface DashboardProps {
  stats: {
    today_sales: number
    yesterday_sales: number
    sales_change: number
    pending_invoices: number
    low_stock_products: number
    total_customers: number
    new_customers_this_month: number
  }
}

export default function Dashboard({ stats }: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Dashboard</h1>
          <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
            Resumen general de tu negocio
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {/* Ventas Hoy */}
          <div className="group relative overflow-hidden rounded-lg border border-sidebar-border/70 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border dark:from-[#161615] dark:to-[#1a1a19]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-[#706f6c] dark:text-[#A1A09A]">
                  Ventas Hoy
                </p>
                <p className="mt-2 text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                  $
                  {stats.today_sales.toLocaleString('es-CO')}
                </p>
                {stats.sales_change !== 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <TrendingUp
                      className={`h-3 w-3 ${stats.sales_change >= 0 ? 'text-green-500' : 'rotate-180 text-red-500'}`}
                    />
                    <span
                      className={`font-medium ${stats.sales_change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                    >
                      {stats.sales_change > 0 ? '+' : ''}
                      {stats.sales_change}%
                    </span>
                    <span className="text-[#706f6c] dark:text-[#A1A09A]">vs ayer</span>
                  </div>
                )}
                {stats.sales_change === 0 && stats.yesterday_sales > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <span className="text-[#706f6c] dark:text-[#A1A09A]">Sin cambio vs ayer</span>
                  </div>
                )}
                {stats.sales_change === 0 && stats.yesterday_sales === 0 && stats.today_sales > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <span className="font-medium text-green-600 dark:text-green-400">Primera venta del período</span>
                  </div>
                )}
              </div>
              <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                <DollarSign className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Facturas Pendientes */}
          <div className="group relative overflow-hidden rounded-lg border border-sidebar-border/70 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border dark:from-[#161615] dark:to-[#1a1a19]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-[#706f6c] dark:text-[#A1A09A]">
                  Facturas Pendientes
                </p>
                <p className="mt-2 text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                  {stats.pending_invoices}
                </p>
                <Link
                  href="/sales"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-orange-600 hover:underline dark:text-orange-400"
                >
                  Ver detalles
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="rounded-lg bg-orange-100 p-3 dark:bg-orange-900/30">
                <AlertCircle className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Stock Bajo */}
          <div className="group relative overflow-hidden rounded-lg border border-sidebar-border/70 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border dark:from-[#161615] dark:to-[#1a1a19]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-[#706f6c] dark:text-[#A1A09A]">
                  Productos Stock Bajo
                </p>
                <p className="mt-2 text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                  {stats.low_stock_products}
                </p>
                <Link
                  href="/products"
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                >
                  Revisar inventario
                  <ArrowUpRight className="h-3 w-3" />
                </Link>
              </div>
              <div className="rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
                <Package className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
          </div>

          {/* Clientes */}
          <div className="group relative overflow-hidden rounded-lg border border-sidebar-border/70 bg-gradient-to-br from-white to-gray-50 p-5 shadow-sm transition-all hover:shadow-md dark:border-sidebar-border dark:from-[#161615] dark:to-[#1a1a19]">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-xs font-medium uppercase tracking-wide text-[#706f6c] dark:text-[#A1A09A]">
                  Clientes Activos
                </p>
                <p className="mt-2 text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">
                  {stats.total_customers}
                </p>
                {stats.new_customers_this_month > 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <ArrowUpRight className="h-3 w-3 text-green-500" />
                    <span className="font-medium text-green-600 dark:text-green-400">
                      +{stats.new_customers_this_month}
                    </span>
                    <span className="text-[#706f6c] dark:text-[#A1A09A]">este mes</span>
                  </div>
                )}
                {stats.new_customers_this_month === 0 && (
                  <div className="mt-2 flex items-center gap-1 text-xs">
                    <span className="text-[#706f6c] dark:text-[#A1A09A]">Sin nuevos clientes este mes</span>
                  </div>
                )}
              </div>
              <div className="rounded-lg bg-green-100 p-3 dark:bg-green-900/30">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions and Recent Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Quick Actions */}
          <div className="rounded-lg border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-[#161615]">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
              <ShoppingCart className="h-5 w-5" />
              Acciones Rápidas
            </h3>
            <div className="space-y-3">
              <Link
                href="/sales/new"
                className="flex items-center justify-between rounded-lg border border-[#19140035] bg-gradient-to-r from-[#1b1b18] to-[#2d2d28] px-5 py-3.5 text-sm font-medium text-white transition-all hover:shadow-md dark:border-[#3E3E3A] dark:from-[#EDEDEC] dark:to-[#d5d5d0] dark:text-[#1b1b18]"
              >
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-5 w-5" />
                  <span>Nueva Venta</span>
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/products"
                className="flex items-center justify-between rounded-lg border border-[#19140035] px-5 py-3 text-sm text-[#1b1b18] transition-all hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#1f1f1e]"
              >
                <div className="flex items-center gap-3">
                  <Package className="h-4 w-4" />
                  <span>Gestionar Inventario</span>
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/customers"
                className="flex items-center justify-between rounded-lg border border-[#19140035] px-5 py-3 text-sm text-[#1b1b18] transition-all hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#1f1f1e]"
              >
                <div className="flex items-center gap-3">
                  <Users className="h-4 w-4" />
                  <span>Ver Clientes</span>
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                href="/reports"
                className="flex items-center justify-between rounded-lg border border-[#19140035] px-5 py-3 text-sm text-[#1b1b18] transition-all hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#1f1f1e]"
              >
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-4 w-4" />
                  <span>Ver Reportes</span>
                </div>
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* System Info */}
          <div className="rounded-lg border border-sidebar-border/70 bg-gradient-to-br from-blue-50 to-white p-6 shadow-sm dark:border-sidebar-border dark:from-blue-950/20 dark:to-[#161615]">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
              <TrendingUp className="h-5 w-5" />
              Sistema Contable Inteligente
            </h3>
            <div className="space-y-4">
              <p className="text-sm leading-relaxed text-[#706f6c] dark:text-[#A1A09A]">
                Control total de tu papelería con facturación automática, inventario en tiempo real y reportes contables profesionales.
              </p>
              <div className="space-y-2 rounded-lg bg-white/50 p-4 dark:bg-[#1a1a19]/50">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#706f6c] dark:text-[#A1A09A]">Facturación Electrónica</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Activo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#706f6c] dark:text-[#A1A09A]">Inventario Sincronizado</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Activo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#706f6c] dark:text-[#A1A09A]">Contabilidad Automatizada</span>
                  <span className="font-semibold text-green-600 dark:text-green-400">Activo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
