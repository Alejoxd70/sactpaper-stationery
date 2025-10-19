import AppLayout from '@/layouts/app-layout';
import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ShoppingCart, Package, Users, AlertCircle } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: dashboard().url,
    },
];

interface DashboardProps {
    stats: {
        today_sales: number;
        pending_invoices: number;
        low_stock_products: number;
        total_customers: number;
    };
}

export default function Dashboard({ stats }: DashboardProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 p-4">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-4">
                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Ventas Hoy</p>
                                <p className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                    ${stats.today_sales.toLocaleString()}
                                </p>
                            </div>
                            <ShoppingCart className="h-8 w-8 text-[#706f6c]" />
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Facturas Pendientes</p>
                                <p className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                    {stats.pending_invoices}
                                </p>
                            </div>
                            <AlertCircle className="h-8 w-8 text-orange-500" />
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Stock Bajo</p>
                                <p className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                    {stats.low_stock_products}
                                </p>
                            </div>
                            <Package className="h-8 w-8 text-red-500" />
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">Clientes Activos</p>
                                <p className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                    {stats.total_customers}
                                </p>
                            </div>
                            <Users className="h-8 w-8 text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
                        <h3 className="mb-4 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                            Acciones Rápidas
                        </h3>
                        <div className="space-y-2">
                            <Link
                                href="/sales/new"
                                className="block rounded-sm border border-[#19140035] px-4 py-3 text-sm text-[#1b1b18] hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#1f1f1e]"
                            >
                                <ShoppingCart className="mr-2 inline h-4 w-4" />
                                Nueva Venta
                            </Link>
                            <Link
                                href="/products"
                                className="block rounded-sm border border-[#19140035] px-4 py-3 text-sm text-[#1b1b18] hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#1f1f1e]"
                            >
                                <Package className="mr-2 inline h-4 w-4" />
                                Gestionar Inventario
                            </Link>
                        </div>
                    </div>

                    <div className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
                        <h3 className="mb-4 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                            Sistema Contable
                        </h3>
                        <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                            Control total de tu papelería con facturación automática, inventario en tiempo real y
                            reportes contables profesionales.
                        </p>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
