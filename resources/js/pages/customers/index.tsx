import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Users } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Clientes', href: '/customers' },
];

interface Customer {
  id: number;
  name: string;
  document_type: string;
  document_number: string;
  email: string;
  phone: string;
}

interface CustomersIndexProps {
  customers: Customer[];
}

export default function CustomersIndex({ customers }: CustomersIndexProps) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    document_type: 'CC',
    document_number: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/customers', form, {
      onSuccess: () => {
        setShowForm(false);
        setForm({ name: '', document_type: 'CC', document_number: '', email: '', phone: '' });
      },
    });
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Clientes" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Clientes</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-sm border border-[#1b1b18] bg-[#1b1b18] px-6 py-2 text-sm text-white hover:bg-[#2d2d28] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#1b1b18]"
          >
            {showForm ? 'Cancelar' : 'Nuevo Cliente'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="text"
                placeholder="Nombre completo"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                required
              />
              <select
                value={form.document_type}
                onChange={(e) => setForm({ ...form, document_type: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
              >
                <option value="CC">Cédula</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula Extranjería</option>
                <option value="TI">Tarjeta Identidad</option>
              </select>
              <input
                type="text"
                placeholder="Número documento"
                value={form.document_number}
                onChange={(e) => setForm({ ...form, document_number: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                required
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
              />
              <input
                type="tel"
                placeholder="Teléfono"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
              />
              <button
                type="submit"
                className="rounded-sm border border-[#1b1b18] bg-[#1b1b18] px-4 py-2 text-sm text-white hover:bg-[#2d2d28] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#1b1b18]"
              >
                Guardar
              </button>
            </div>
          </form>
        )}

        <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-[#161615]">
          <table className="w-full">
            <thead className="border-b border-[#19140035] dark:border-[#3E3E3A]">
              <tr>
                <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Nombre</th>
                <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Documento</th>
                <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Email</th>
                <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b border-[#19140035] last:border-0 dark:border-[#3E3E3A]">
                  <td className="p-4 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#706f6c]" />
                      {customer.name}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                    {customer.document_type} {customer.document_number}
                  </td>
                  <td className="p-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">{customer.email}</td>
                  <td className="p-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">{customer.phone}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
}
