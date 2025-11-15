import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link } from '@inertiajs/react'
import { Receipt, CheckCircle, Clock, AlertCircle, FileText, Printer } from 'lucide-react'
import React from 'react'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Ventas', href: '/sales' },
]

interface Invoice {
  id: number
  invoice_number: string
  date: string
  total: number
  payment_status: string
  payment_method: string
  customer: {
    name: string
    document_number: string
  }
  user: {
    name: string
  }
  items: Array<{
    quantity: number
    product: {
      name: string
    }
  }>
}

interface SalesIndexProps {
  invoices: Invoice[]
  startDate: string
  endDate: string
}

export default function SalesIndex({ invoices, startDate: initialStartDate, endDate: initialEndDate }: SalesIndexProps) {
  const [startDate, setStartDate] = React.useState(initialStartDate)
  const [endDate, setEndDate] = React.useState(initialEndDate)
  const today = new Date().toISOString().split('T')[0]

  const handleFilterChange = () => {
    if (startDate && endDate) {
      window.location.href = `/sales?start_date=${startDate}&end_date=${endDate}`
    }
  }
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagado'
      case 'pending':
        return 'Pendiente'
      case 'partial':
        return 'Parcial'
      default:
        return status
    }
  }

  // const getPaymentMethod = (method: string) => {
  //   switch (method) {
  //     case 'cash':
  //       return 'Efectivo'
  //     case 'card':
  //       return 'Tarjeta'
  //     case 'transfer':
  //       return 'Transferencia'
  //     case 'credit':
  //       return 'Crédito'
  //     default:
  //       return method
  //   }
  // }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ventas" />
      <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Ventas</h2>
              <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                Gestiona tus facturas y ventas
              </p>
            </div>
            <Link
              href="/sales/new"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1b1b18] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#2d2d28] hover:shadow-md dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d5d5d0]"
            >
              <Receipt className="h-4 w-4" />
              Nueva Venta
            </Link>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#706f6c] dark:text-[#A1A09A] px-1">
                Fecha Inicio
              </label>
              <input
                type="date"
                value={startDate}
                max={today}
                onChange={e => setStartDate(e.target.value)}
                className="w-full sm:w-auto rounded-lg border border-sidebar-border/70 bg-white px-3 py-2 text-sm dark:border-sidebar-border dark:bg-[#161615] dark:text-[#EDEDEC]"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-[#706f6c] dark:text-[#A1A09A] px-1">
                Fecha Final
              </label>
              <input
                type="date"
                value={endDate}
                max={today}
                onChange={e => setEndDate(e.target.value)}
                className="w-full sm:w-auto rounded-lg border border-sidebar-border/70 bg-white px-3 py-2 text-sm dark:border-sidebar-border dark:bg-[#161615] dark:text-[#EDEDEC]"
              />
            </div>
            <button
              onClick={handleFilterChange}
              disabled={!startDate || !endDate}
              className="rounded-lg bg-[#1b1b18] px-4 py-2 text-sm font-medium text-white hover:bg-[#2d2d28] disabled:opacity-50 disabled:cursor-not-allowed dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d4d4d0]"
            >
              Filtrar
            </button>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-[#161615]">
          {invoices.length === 0
            ? (
                <div className="p-12 text-center">
                  <Receipt className="mx-auto mb-4 h-12 w-12 text-[#706f6c]" />
                  <p className="text-[#706f6c] dark:text-[#A1A09A]">No hay ventas registradas</p>
                  <Link
                    href="/sales/new"
                    className="mt-4 inline-block rounded-sm border border-[#19140035] px-4 py-2 text-sm text-[#1b1b18] hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#1f1f1e]"
                  >
                    Registrar primera venta
                  </Link>
                </div>
              )
            : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-[#1a1a19]">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                          Factura
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                          Cliente
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                          Fecha y Hora
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                          Items
                        </th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                          Total
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                          Estado
                        </th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#19140035] dark:divide-[#3E3E3A]">
                      {invoices.map(invoice => (
                        <tr
                          key={invoice.id}
                          className="transition-colors hover:bg-gray-50/50 dark:hover:bg-[#1a1a19]/50"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="rounded-md bg-blue-100 p-1.5 dark:bg-blue-900/30">
                                <Receipt className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                              </div>
                              <span className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                {invoice.invoice_number}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="max-w-[200px]">
                              <div className="truncate text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                {invoice.customer.name}
                              </div>
                              <div className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                                {invoice.customer.document_number}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                              {invoice.date.split(' ')[0].split('-').reverse().join('/')}
                            </div>
                            <div className="text-xs text-[#706f6c]/70 dark:text-[#A1A09A]/70">
                              {invoice.date.split(' ')[1]?.substring(0, 5) || '--:--'}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="inline-flex items-center justify-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                              {invoice.items.length}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                              $
                              {parseFloat(invoice.total.toString()).toLocaleString('es-CO', { minimumFractionDigits: 0 })}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center">
                              <span
                                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${invoice.payment_status === 'paid'
                                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                  : invoice.payment_status === 'pending'
                                    ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                                }`}
                              >
                                {getStatusIcon(invoice.payment_status)}
                                {getStatusText(invoice.payment_status)}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-center gap-1.5">
                              <a
                                href={`/sales/${invoice.id}/pdf`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md border border-[#19140035] px-2.5 py-1.5 text-xs font-medium text-[#1b1b18] transition-colors hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#1f1f1e]"
                                title="Descargar PDF"
                              >
                                <Printer className="h-3.5 w-3.5" />
                              </a>
                              <a
                                href={`/sales/${invoice.id}/xml`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 rounded-md border border-[#19140035] px-2.5 py-1.5 text-xs font-medium text-[#1b1b18] transition-colors hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#1f1f1e]"
                                title="Ver XML DIAN"
                              >
                                <FileText className="h-3.5 w-3.5" />
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
        </div>
      </div>
    </AppLayout>
  )
}
