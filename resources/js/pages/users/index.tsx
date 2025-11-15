import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem, type User } from '@/types'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { UserCog, Edit2, Trash2, Save, X, Plus, Shield, Eye, EyeOff } from 'lucide-react'
import InputError from '@/components/input-error'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Usuarios', href: '/users' },
]

interface UsersIndexProps {
  users: User[]
}

type UserRole = 'admin' | 'accountant' | 'cashier'

interface UpdateUserData {
  name: string
  email: string
  role: UserRole
  is_active: boolean
  password?: string
  password_confirmation?: string
  [key: string]: string | boolean | undefined
}

export default function UsersIndex({ users }: UsersIndexProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'cashier' as 'admin' | 'accountant' | 'cashier',
    is_active: true,
  })
  const [editForm, setEditForm] = useState<User & { password?: string, password_confirmation?: string } | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const roleLabels = {
    admin: 'Administrador',
    accountant: 'Contador/a',
    cashier: 'Cajero/a',
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación del frontend
    const newErrors: Record<string, string> = {}

    if (!form.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!form.email.trim()) {
      newErrors.email = 'El email es requerido'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'El formato del email no es válido'
    }

    if (!form.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (form.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }

    if (form.password !== form.password_confirmation) {
      newErrors.password_confirmation = 'Las contraseñas no coinciden'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    router.post('/users', form, {
      onSuccess: () => {
        setShowForm(false)
        setForm({ name: '', email: '', password: '', password_confirmation: '', role: 'cashier', is_active: true })
        setErrors({})
      },
      onError: (errors) => {
        setErrors(errors as Record<string, string>)
      },
    })
  }

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setEditForm({ ...user, password: '', password_confirmation: '' })
  }

  const handleUpdate = (id: number) => {
    if (!editForm) return
    const data: UpdateUserData = {
      name: editForm.name,
      email: editForm.email,
      role: editForm.role,
      is_active: editForm.is_active,
    }

    if (editForm.password) {
      data.password = editForm.password
      data.password_confirmation = editForm.password_confirmation
    }

    router.put(`/users/${id}`, data, {
      onSuccess: () => {
        setEditingId(null)
        setEditForm(null)
      },
    })
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      router.delete(`/users/${id}`)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm(null)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Usuarios" />
      <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Gestión de Usuarios</h2>
            <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
              Administra los usuarios del sistema
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1b1b18] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#2d2d28] hover:shadow-md dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d5d5d0]"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancelar' : 'Nuevo Usuario'}
          </button>
        </div>

        {showForm && (
          <div className="rounded-lg border border-[#DDDDD8] bg-white p-6 shadow-sm dark:border-[#2d2d28] dark:bg-[#1b1b18]">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
              <UserCog className="h-5 w-5" />
              Nuevo Usuario
            </h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                  Nombre completo
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => {
                    setForm({ ...form, name: e.target.value })
                    if (errors.name) setErrors({ ...errors, name: '' })
                  }}
                  className={`w-full rounded-lg border ${errors.name ? 'border-red-500' : 'border-[#DDDDD8]'} bg-white px-4 py-2.5 text-[#1b1b18] transition-colors focus:border-[#1b1b18] focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#2d2d28] dark:bg-[#0f0f0e] dark:text-[#EDEDEC] dark:focus:border-[#EDEDEC] dark:focus:ring-[#EDEDEC]/20`}
                />
                <InputError message={errors.name} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                  Email
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => {
                    setForm({ ...form, email: e.target.value })
                    if (errors.email) setErrors({ ...errors, email: '' })
                  }}
                  className={`w-full rounded-lg border ${errors.email ? 'border-red-500' : 'border-[#DDDDD8]'} bg-white px-4 py-2.5 text-[#1b1b18] transition-colors focus:border-[#1b1b18] focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#2d2d28] dark:bg-[#0f0f0e] dark:text-[#EDEDEC] dark:focus:border-[#EDEDEC] dark:focus:ring-[#EDEDEC]/20`}
                />
                <InputError message={errors.email} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                  Rol
                </label>
                <select
                  required
                  value={form.role}
                  onChange={e => setForm({ ...form, role: e.target.value as UserRole })}
                  className="w-full rounded-lg border border-[#DDDDD8] bg-white px-4 py-2.5 text-[#1b1b18] transition-colors focus:border-[#1b1b18] focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#2d2d28] dark:bg-[#0f0f0e] dark:text-[#EDEDEC] dark:focus:border-[#EDEDEC] dark:focus:ring-[#EDEDEC]/20"
                >
                  <option value="cashier">Cajero/a</option>
                  <option value="accountant">Contador/a</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <div className="relative">
                <label className="mb-2 block text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    minLength={8}
                    value={form.password}
                    onChange={e => {
                      setForm({ ...form, password: e.target.value })
                      if (errors.password) setErrors({ ...errors, password: '' })
                    }}
                    className={`w-full rounded-lg border ${errors.password ? 'border-red-500' : 'border-[#DDDDD8]'} bg-white px-4 py-2.5 pr-10 text-[#1b1b18] transition-colors focus:border-[#1b1b18] focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#2d2d28] dark:bg-[#0f0f0e] dark:text-[#EDEDEC] dark:focus:border-[#EDEDEC] dark:focus:ring-[#EDEDEC]/20`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#706f6c] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:text-[#EDEDEC]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                <InputError message={errors.password} />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                  Confirmar contraseña
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  minLength={8}
                  value={form.password_confirmation}
                  onChange={e => {
                    setForm({ ...form, password_confirmation: e.target.value })
                    if (errors.password_confirmation) setErrors({ ...errors, password_confirmation: '' })
                  }}
                  className={`w-full rounded-lg border ${errors.password_confirmation ? 'border-red-500' : 'border-[#DDDDD8]'} bg-white px-4 py-2.5 text-[#1b1b18] transition-colors focus:border-[#1b1b18] focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#2d2d28] dark:bg-[#0f0f0e] dark:text-[#EDEDEC] dark:focus:border-[#EDEDEC] dark:focus:ring-[#EDEDEC]/20`}
                />
                <InputError message={errors.password_confirmation} />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={form.is_active}
                  onChange={e => setForm({ ...form, is_active: e.target.checked })}
                  className="h-4 w-4 rounded border-[#DDDDD8] text-[#1b1b18] focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#2d2d28] dark:bg-[#0f0f0e]"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                  Usuario activo
                </label>
              </div>

              <div className="flex gap-2 md:col-span-2">
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-[#1b1b18] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#2d2d28] dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d5d5d0]"
                >
                  Crear Usuario
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-[#DDDDD8] px-4 py-2.5 text-sm font-medium text-[#1b1b18] transition-colors hover:bg-[#F5F5F0] dark:border-[#2d2d28] dark:text-[#EDEDEC] dark:hover:bg-[#2d2d28]"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="overflow-hidden rounded-lg border border-[#DDDDD8] bg-white shadow-sm dark:border-[#2d2d28] dark:bg-[#1b1b18]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-[#DDDDD8] bg-[#F5F5F0] dark:border-[#2d2d28] dark:bg-[#0f0f0e]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Usuario
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Rol
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDDDD8] dark:divide-[#2d2d28]">
                {users.map(user => (
                  <tr key={user.id} className="transition-colors hover:bg-[#F5F5F0] dark:hover:bg-[#2d2d28]">
                    {editingId === user.id && editForm
                      ? (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-2">
                              <input
                                type="text"
                                value={editForm.name}
                                onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                className="rounded border border-[#DDDDD8] px-2 py-1 text-sm dark:border-[#2d2d28] dark:bg-[#0f0f0e] dark:text-[#EDEDEC]"
                              />
                              <input
                                type="email"
                                value={editForm.email}
                                onChange={e => setEditForm({ ...editForm, email: e.target.value })}
                                className="rounded border border-[#DDDDD8] px-2 py-1 text-sm dark:border-[#2d2d28] dark:bg-[#0f0f0e] dark:text-[#EDEDEC]"
                              />
                              <input
                                type="password"
                                placeholder="Nueva contraseña (opcional)"
                                value={editForm.password || ''}
                                onChange={e => setEditForm({ ...editForm, password: e.target.value })}
                                className="rounded border border-[#DDDDD8] px-2 py-1 text-sm dark:border-[#2d2d28] dark:bg-[#0f0f0e] dark:text-[#EDEDEC]"
                              />
                              <input
                                type="password"
                                placeholder="Confirmar contraseña"
                                value={editForm.password_confirmation || ''}
                                onChange={e => setEditForm({ ...editForm, password_confirmation: e.target.value })}
                                className="rounded border border-[#DDDDD8] px-2 py-1 text-sm dark:border-[#2d2d28] dark:bg-[#0f0f0e] dark:text-[#EDEDEC]"
                              />
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <select
                              value={editForm.role}
                              onChange={e => setEditForm({ ...editForm, role: e.target.value as UserRole })}
                              className="rounded border border-[#DDDDD8] px-2 py-1 text-sm dark:border-[#2d2d28] dark:bg-[#0f0f0e] dark:text-[#EDEDEC]"
                            >
                              <option value="cashier">Cajero/a</option>
                              <option value="accountant">Contador/a</option>
                              <option value="admin">Administrador</option>
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <input
                              type="checkbox"
                              checked={editForm.is_active}
                              onChange={e => setEditForm({ ...editForm, is_active: e.target.checked })}
                              className="h-4 w-4 rounded border-[#DDDDD8] dark:border-[#2d2d28] dark:bg-[#0f0f0e]"
                            />
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleUpdate(user.id)}
                                className="rounded p-1.5 text-green-600 transition-colors hover:bg-green-50 dark:hover:bg-green-950"
                              >
                                <Save className="h-4 w-4" />
                              </button>
                              <button
                                onClick={handleCancel}
                                className="rounded p-1.5 text-gray-600 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )
                      : (
                        <>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1b1b18] text-white dark:bg-[#EDEDEC] dark:text-[#1b1b18]">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-medium text-[#1b1b18] dark:text-[#EDEDEC]">{user.name}</div>
                                <div className="text-sm text-[#706f6c] dark:text-[#A1A09A]">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#F5F5F0] px-3 py-1 text-xs font-medium text-[#1b1b18] dark:bg-[#2d2d28] dark:text-[#EDEDEC]">
                              <Shield className="h-3 w-3" />
                              {roleLabels[user.role]}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${user.is_active
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                }`}
                            >
                              {user.is_active ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEdit(user)}
                                className="rounded p-1.5 text-blue-600 transition-colors hover:bg-blue-50 dark:hover:bg-blue-950"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="rounded p-1.5 text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </>
                      )}
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
