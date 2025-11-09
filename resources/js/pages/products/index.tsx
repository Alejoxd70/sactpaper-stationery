import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, router } from '@inertiajs/react'
import { useState } from 'react'
import { Package, Edit2, Trash2, Save, X, Plus, AlertTriangle } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Productos', href: '/products' },
]

interface Product {
  id: number
  name: string
  code: string
  unit_price: number
  cost: number
  stock: number
  min_stock: number
}

interface ProductsIndexProps {
  products: Product[]
}

export default function ProductsIndex({ products }: ProductsIndexProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    code: '',
    name: '',
    unit_price: '',
    cost: '',
    stock: '',
    min_stock: '5',
  })
  const [editForm, setEditForm] = useState<Product | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    router.post('/products', form, {
      onSuccess: () => {
        setShowForm(false)
        setForm({ code: '', name: '', unit_price: '', cost: '', stock: '', min_stock: '5' })
      },
    })
  }

  const handleEdit = (product: Product) => {
    setEditingId(product.id)
    setEditForm({ ...product })
  }

  const handleUpdate = (id: number) => {
    if (!editForm) return
    router.put(`/products/${id}`, {
      code: editForm.code,
      name: editForm.name,
      unit_price: editForm.unit_price,
      cost: editForm.cost,
      stock: editForm.stock,
      min_stock: editForm.min_stock,
    }, {
      onSuccess: () => {
        setEditingId(null)
        setEditForm(null)
      },
    })
  }

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      router.delete(`/products/${id}`)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditForm(null)
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Productos" />
      <div className="flex h-full flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-[#1b1b18] dark:text-[#EDEDEC]">Inventario</h2>
            <p className="mt-1 text-sm text-[#706f6c] dark:text-[#A1A09A]">
              Gestiona tus productos y stock
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1b1b18] px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-[#2d2d28] hover:shadow-md dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d5d5d0]"
          >
            {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {showForm ? 'Cancelar' : 'Nuevo Producto'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-lg border border-sidebar-border/70 bg-white p-6 shadow-sm dark:border-sidebar-border dark:bg-[#161615]">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
              <Package className="h-5 w-5" />
              Nuevo Producto
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A]">Código</label>
                <input
                  type="text"
                  placeholder="COD-001"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value })}
                  className="w-full rounded-md border border-[#19140035] bg-white px-3 py-2 text-sm text-[#1b1b18] transition-colors focus:border-[#1b1b18] focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC] dark:focus:border-[#EDEDEC] dark:focus:ring-[#EDEDEC]/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A]">Nombre</label>
                <input
                  type="text"
                  placeholder="Nombre del producto"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-[#19140035] bg-white px-3 py-2 text-sm text-[#1b1b18] transition-colors focus:border-[#1b1b18] focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC] dark:focus:border-[#EDEDEC] dark:focus:ring-[#EDEDEC]/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A]">Precio Venta</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.unit_price}
                  onChange={e => setForm({ ...form, unit_price: e.target.value })}
                  className="w-full rounded-md border border-[#19140035] bg-white px-3 py-2 text-sm text-[#1b1b18] transition-colors focus:border-[#1b1b18] focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC] dark:focus:border-[#EDEDEC] dark:focus:ring-[#EDEDEC]/20"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A]">Costo</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.cost}
                  onChange={e => setForm({ ...form, cost: e.target.value })}
                  className="w-full rounded-md border border-[#19140035] bg-white px-3 py-2 text-sm text-[#1b1b18] transition-colors focus:border-[#1b1b18] focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC] dark:focus:border-[#EDEDEC] dark:focus:ring-[#EDEDEC]/20"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-[#706f6c] dark:text-[#A1A09A]">Stock Inicial</label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.stock}
                  onChange={e => setForm({ ...form, stock: e.target.value })}
                  className="w-full rounded-md border border-[#19140035] bg-white px-3 py-2 text-sm text-[#1b1b18] transition-colors focus:border-[#1b1b18] focus:outline-none focus:ring-2 focus:ring-[#1b1b18]/20 dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC] dark:focus:border-[#EDEDEC] dark:focus:ring-[#EDEDEC]/20"
                  required
                />
              </div>
              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-[#1b1b18] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#2d2d28] dark:bg-[#EDEDEC] dark:text-[#1b1b18] dark:hover:bg-[#d5d5d0]"
                >
                  Guardar Producto
                </button>
              </div>
            </div>
          </form>
        )}

        <div className="overflow-hidden rounded-lg border border-sidebar-border/70 bg-white shadow-sm dark:border-sidebar-border dark:bg-[#161615]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-[#1a1a19]">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Código
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Producto
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Costo
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Precio Venta
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Stock
                  </th>
                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-[#706f6c] dark:text-[#A1A09A]">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#19140035] dark:divide-[#3E3E3A]">
                {products.map(product => (
                  <tr
                    key={product.id}
                    className="transition-colors hover:bg-gray-50/50 dark:hover:bg-[#1a1a19]/50"
                  >
                    {editingId === product.id
                      ? (
                          <>
                            <td className="p-4">
                              <input
                                type="text"
                                value={editForm?.code || ''}
                                onChange={e => setEditForm(prev => prev ? { ...prev, code: e.target.value } : null)}
                                className="w-full rounded-sm border border-[#19140035] bg-white px-2 py-1 text-sm text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                              />
                            </td>
                            <td className="p-4">
                              <input
                                type="text"
                                value={editForm?.name || ''}
                                onChange={e => setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)}
                                className="w-full rounded-sm border border-[#19140035] bg-white px-2 py-1 text-sm text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                              />
                            </td>
                            <td className="p-4">
                              <input
                                type="number"
                                value={editForm?.cost || ''}
                                onChange={e => setEditForm(prev => prev ? { ...prev, cost: parseFloat(e.target.value) } : null)}
                                className="w-full rounded-sm border border-[#19140035] bg-white px-2 py-1 text-sm text-right text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                                step="0.01"
                              />
                            </td>
                            <td className="p-4">
                              <input
                                type="number"
                                value={editForm?.unit_price || ''}
                                onChange={e => setEditForm(prev => prev ? { ...prev, unit_price: parseFloat(e.target.value) } : null)}
                                className="w-full rounded-sm border border-[#19140035] bg-white px-2 py-1 text-sm text-right text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                                step="0.01"
                              />
                            </td>
                            <td className="p-4">
                              <input
                                type="number"
                                value={editForm?.stock || ''}
                                onChange={e => setEditForm(prev => prev ? { ...prev, stock: parseInt(e.target.value) } : null)}
                                className="w-full rounded-sm border border-[#19140035] bg-white px-2 py-1 text-sm text-right text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                              />
                            </td>
                            <td className="p-4">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleUpdate(product.id)}
                                  className="rounded-sm bg-green-500 p-2 text-white hover:bg-green-600"
                                >
                                  <Save className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={handleCancel}
                                  className="rounded-sm bg-gray-500 p-2 text-white hover:bg-gray-600"
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </>
                        )
                      : (
                          <>
                            <td className="px-4 py-3">
                              <span className="inline-flex items-center gap-2 rounded-md bg-gray-100 px-2.5 py-1 text-xs font-mono font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                {product.code}
                              </span>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <div className="rounded-md bg-blue-100 p-1.5 dark:bg-blue-900/30">
                                  <Package className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <span className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                  {product.name}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                                $
                                {product.cost.toLocaleString('es-CO')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <span className="text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                                $
                                {product.unit_price.toLocaleString('es-CO')}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className="text-sm font-medium text-[#1b1b18] dark:text-[#EDEDEC]">
                                  {product.stock}
                                </span>
                                {product.stock <= product.min_stock && (
                                  <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                    <AlertTriangle className="h-3 w-3" />
                                    Bajo
                                  </span>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleEdit(product)}
                                  className="inline-flex items-center gap-1 rounded-md bg-blue-500 p-2 text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                                  title="Editar"
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDelete(product.id)}
                                  className="inline-flex items-center gap-1 rounded-md bg-red-500 p-2 text-white transition-colors hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                                  title="Eliminar"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
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
