import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { Users, Plus, X, Mail, Phone, IdCard } from 'lucide-react'
import InputError from '@/components/input-error'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Clientes', href: '/customers' },
]

interface Customer {
  id: number
  name: string
  document_type: string
  document_number: string
  email: string
  phone: string
}

interface CustomersIndexProps {
  customers: Customer[]
}

export default function CustomersIndex({ customers }: CustomersIndexProps) {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    document_type: 'CC',
    document_number: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación del frontend
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!form.document_number.trim()) {
      newErrors.document_number = 'El número de documento es requerido'
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El formato del email no es válido'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    router.post('/customers', form, {
      onSuccess: () => {
        setShowForm(false)
        setForm({ name: '', document_type: 'CC', document_number: '', email: '', phone: '' })
        setErrors({})
      },
      onError: (errors) => {
        setErrors(errors as Record<string, string>)
      },
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Clientes" />
      <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Clientes</h2>
            <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
              Gestiona tu base de clientes
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1b1b18] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#2d2d28] hover:shadow-md dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d5d5d0]"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancelar' : 'Nuevo Cliente'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-lg border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-[#161615]">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
              <Users className="h-5 w-5" />
              Nuevo Cliente
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <input
                  type="text"
                  placeholder="Nombre completo"
                  value={form.name}
                  onChange={e => {
                    setForm({ ...form, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: '' })
                  }}
                  className={`w-full rounded-sm border ${errors.name ? 'border-red-500' : 'border-[#19140035]'} bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]`}
                />
                <InputError message={errors.name} />
              </div>
              <select
                value={form.document_type}
                onChange={e => setForm({ ...form, document_type: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
              >
                <option value="CC">Cédula</option>
                <option value="NIT">NIT</option>
                <option value="CE">Cédula Extranjería</option>
                <option value="TI">Tarjeta Identidad</option>
              </select>
              <div>
                <input
                  type="text"
                  placeholder="Número documento"
                  value={form.document_number}
                  onChange={e => {
                    setForm({ ...form, document_number: e.target.value })
                    if (errors.document_number) setErrors({ ...errors, document_number: '' })
                  }}
                  className={`w-full rounded-sm border ${errors.document_number ? 'border-red-500' : 'border-[#19140035]'} bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]`}
                />
                <InputError message={errors.document_number} />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email (opcional)"
                  value={form.email}
                  onChange={e => {
                    setForm({ ...form, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: '' })
                  }}
                  className={`w-full rounded-sm border ${errors.email ? 'border-red-500' : 'border-[#19140035]'} bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]`}
                />
                <InputError message={errors.email} />
              </div>
              <input
                type="tel"
                placeholder="Teléfono (opcional)"
                value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
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

        <div className="overflow-hidden rounded-lg border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-[#161615]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1a1a19]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Documento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Contacto
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#19140035] dark:divide-[#3E3E3A]">
                {customers.map(customer => (
                  <tr
                    key={customer.id}
                    className="transition-colors hover:bg-gray-50/50 dark:hover:bg-[#1a1a19]/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="rounded-full bg-purple-100 p-2 dark:bg-purple-900/30">
                          <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <span className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                          {customer.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <IdCard className="h-3.5 w-3.5 text-[#706f6c] dark:text-[#A1A09A]" />
                        <div>
                          <span className="text-xs font-medium text-[#706f6c] dark:text-[#A1A09A]">
                            {customer.document_type}
                          </span>
                          <span className="ml-1.5 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                            {customer.document_number}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        {customer.email && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Mail className="h-3 w-3 text-[#706f6c] dark:text-[#A1A09A]" />
                            <span className="text-[#706f6c] dark:text-[#A1A09A]">{customer.email}</span>
                          </div>
                        )}
                        {customer.phone && (
                          <div className="flex items-center gap-1.5 text-xs">
                            <Phone className="h-3 w-3 text-[#706f6c] dark:text-[#A1A09A]" />
                            <span className="text-[#706f6c] dark:text-[#A1A09A]">{customer.phone}</span>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
