import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Receipt, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Ventas', href: '/sales' },
];

interface Invoice {
  id: number;
  invoice_number: string;
  date: string;
  total: number;
  payment_status: string;
  payment_method: string;
  customer: {
    name: string;
    document_number: string;
  };
  user: {
    name: string;
  };
  items: Array<{
    quantity: number;
    product: {
      name: string;
    };
  }>;
}

interface SalesIndexProps {
  invoices: Invoice[];
}

export default function SalesIndex({ invoices }: SalesIndexProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-orange-500" />;
      case 'partial':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Pagado';
      case 'pending':
        return 'Pendiente';
      case 'partial':
        return 'Parcial';
      default:
        return status;
    }
  };

  const getPaymentMethod = (method: string) => {
    switch (method) {
      case 'cash':
        return 'Efectivo';
      case 'card':
        return 'Tarjeta';
      case 'transfer':
        return 'Transferencia';
      case 'credit':
        return 'Crédito';
      default:
        return method;
    }
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Ventas" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Ventas</h2>
          <Link
            href="/sales/new"
            className="rounded-sm border border-[#1b1b18] bg-[#1b1b18] px-6 py-2 text-sm text-white hover:bg-[#2d2d28] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#1b1b18]"
          >
            Nueva Venta
          </Link>
        </div>

        <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-[#161615]">
          {invoices.length === 0 ? (
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
          ) : (
            <table className="w-full">
              <thead className="border-b border-[#19140035] dark:border-[#3E3E3A]">
                <tr>
                  <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Factura</th>
                  <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Fecha</th>
                  <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Cliente</th>
                  <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Productos</th>
                  <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Método</th>
                  <th className="p-4 text-right text-sm text-[#706f6c] dark:text-[#A1A09A]">Total</th>
                  <th className="p-4 text-center text-sm text-[#706f6c] dark:text-[#A1A09A]">Estado</th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr
                    key={invoice.id}
                    className="border-b border-[#19140035] last:border-0 dark:border-[#3E3E3A]"
                  >
                    <td className="p-4 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                      <div className="flex items-center gap-2">
                        <Receipt className="h-4 w-4 text-[#706f6c]" />
                        {invoice.invoice_number}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                      {invoice.date.split('T')[0].split('-').reverse().join('/')}
                    </td>
                    <td className="p-4 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                      <div>
                        <div>{invoice.customer.name}</div>
                        <div className="text-xs text-[#706f6c] dark:text-[#A1A09A]">
                          {invoice.customer.document_number}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                      {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="p-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                      {getPaymentMethod(invoice.payment_method)}
                    </td>
                    <td className="p-4 text-right text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                      ${parseFloat(invoice.total.toString()).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        {getStatusIcon(invoice.payment_status)}
                        <span className="text-[#706f6c] dark:text-[#A1A09A]">
                          {getStatusText(invoice.payment_status)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
