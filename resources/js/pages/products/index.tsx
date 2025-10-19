import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Package, Edit2, Trash2, Save, X } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Productos', href: '/products' },
];

interface Product {
  id: number;
  name: string;
  code: string;
  unit_price: number;
  cost: number;
  stock: number;
  min_stock: number;
}

interface ProductsIndexProps {
  products: Product[];
}

export default function ProductsIndex({ products }: ProductsIndexProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    code: '',
    name: '',
    unit_price: '',
    cost: '',
    stock: '',
    min_stock: '5',
  });
  const [editForm, setEditForm] = useState<Product | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.post('/products', form, {
      onSuccess: () => {
        setShowForm(false);
        setForm({ code: '', name: '', unit_price: '', cost: '', stock: '', min_stock: '5' });
      },
    });
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);
    setEditForm({ ...product });
  };

  const handleUpdate = (id: number) => {
    if (!editForm) return;
    router.put(`/products/${id}`, {
      code: editForm.code,
      name: editForm.name,
      unit_price: editForm.unit_price,
      cost: editForm.cost,
      stock: editForm.stock,
      min_stock: editForm.min_stock,
    }, {
      onSuccess: () => {
        setEditingId(null);
        setEditForm(null);
      },
    });
  };

  const handleDelete = (id: number) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      router.delete(`/products/${id}`);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Productos" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Inventario</h2>
          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-sm border border-[#1b1b18] bg-[#1b1b18] px-6 py-2 text-sm text-white hover:bg-[#2d2d28] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#1b1b18]"
          >
            {showForm ? 'Cancelar' : 'Nuevo Producto'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleSubmit} className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
            <div className="grid gap-4 md:grid-cols-3">
              <input
                type="text"
                placeholder="Código"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                required
              />
              <input
                type="text"
                placeholder="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                required
              />
              <input
                type="number"
                placeholder="Precio"
                value={form.unit_price}
                onChange={(e) => setForm({ ...form, unit_price: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                step="0.01"
                required
              />
              <input
                type="number"
                placeholder="Costo"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                step="0.01"
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                className="rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                required
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
                <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Código</th>
                <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Producto</th>
                <th className="p-4 text-right text-sm text-[#706f6c] dark:text-[#A1A09A]">Costo</th>
                <th className="p-4 text-right text-sm text-[#706f6c] dark:text-[#A1A09A]">Precio</th>
                <th className="p-4 text-right text-sm text-[#706f6c] dark:text-[#A1A09A]">Stock</th>
                <th className="p-4 text-right text-sm text-[#706f6c] dark:text-[#A1A09A]">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="border-b border-[#19140035] last:border-0 dark:border-[#3E3E3A]">
                  {editingId === product.id ? (
                    <>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editForm?.code || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, code: e.target.value } : null)}
                          className="w-full rounded-sm border border-[#19140035] bg-white px-2 py-1 text-sm text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="text"
                          value={editForm?.name || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, name: e.target.value } : null)}
                          className="w-full rounded-sm border border-[#19140035] bg-white px-2 py-1 text-sm text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editForm?.cost || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, cost: parseFloat(e.target.value) } : null)}
                          className="w-full rounded-sm border border-[#19140035] bg-white px-2 py-1 text-sm text-right text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                          step="0.01"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editForm?.unit_price || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, unit_price: parseFloat(e.target.value) } : null)}
                          className="w-full rounded-sm border border-[#19140035] bg-white px-2 py-1 text-sm text-right text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                          step="0.01"
                        />
                      </td>
                      <td className="p-4">
                        <input
                          type="number"
                          value={editForm?.stock || ''}
                          onChange={(e) => setEditForm(prev => prev ? { ...prev, stock: parseInt(e.target.value) } : null)}
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
                  ) : (
                    <>
                      <td className="p-4 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">{product.code}</td>
                      <td className="p-4 text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-[#706f6c]" />
                          {product.name}
                        </div>
                      </td>
                      <td className="p-4 text-right text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        ${product.cost.toLocaleString()}
                      </td>
                      <td className="p-4 text-right text-sm font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
                        ${product.unit_price.toLocaleString()}
                      </td>
                      <td className="p-4 text-right text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
                        {product.stock}
                        {product.stock <= product.min_stock && (
                          <span className="ml-2 text-xs text-red-500">(Bajo)</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleEdit(product)}
                            className="rounded-sm bg-blue-500 p-2 text-white hover:bg-blue-600"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="rounded-sm bg-red-500 p-2 text-white hover:bg-red-600"
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
    </AppLayout>
  );
}
