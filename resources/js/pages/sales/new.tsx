import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head, Link, router } from '@inertiajs/react'
import { useState } from 'react'
import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import InputError from '@/components/input-error'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Ventas', href: '/sales' },
  { title: 'Nueva Venta', href: '/sales/new' },
]

interface Product {
  id: number
  name: string
  code: string
  unit_price: number
  stock: number
}

interface Customer {
  id: number
  name: string
  document_number: string
}

interface NewSaleProps {
  products: Product[]
  customers: Customer[]
}

export default function NewSale({ products, customers }: NewSaleProps) {
  const [customerId, setCustomerId] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [items, setItems] = useState<Array<{ product_id: string, quantity: number, unit_price: number }>>([])
  const [errors, setErrors] = useState<Record<string, string>>({})

  const addItem = () => {
    setItems([...items, { product_id: '', quantity: 1, unit_price: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items]

    if (field === 'product_id') {
      const productId = typeof value === 'string' ? parseInt(value) : value
      newItems[index].product_id = String(productId)

      const product = products.find(p => p.id === productId)
      if (product) {
        newItems[index].unit_price = product.unit_price
      }
    }
    else if (field === 'quantity') {
      newItems[index].quantity = typeof value === 'number' ? value : parseInt(value)
    }
    else if (field === 'unit_price') {
      newItems[index].unit_price = typeof value === 'number' ? value : parseFloat(value)
    }

    setItems(newItems)
  }

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0)
  const tax = subtotal * 0.19
  const total = subtotal + tax

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validación del frontend
    const newErrors: Record<string, string> = {}

    if (!customerId) {
      newErrors.customer_id = 'Debe seleccionar un cliente'
    }

    if (items.length === 0) {
      newErrors.items = 'Debe agregar al menos un producto a la venta'
    }

    // Validar que todos los productos tengan datos completos y stock
    for (let i = 0; i < items.length; i++) {
      const item = items[i]

      if (!item.product_id) {
        newErrors[`item_${i}_product`] = 'Debe seleccionar un producto'
      } else {
        const product = products.find(p => p.id === parseInt(item.product_id))
        if (product && item.quantity > product.stock) {
          newErrors[`item_${i}_stock`] = `Stock insuficiente para ${product.name}. Disponible: ${product.stock}`
        }
      }

      if (item.quantity <= 0) {
        newErrors[`item_${i}_quantity`] = 'La cantidad debe ser mayor a 0'
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    router.post('/sales', {
      customer_id: customerId,
      date: new Date().toISOString().split('T')[0],
      payment_method: paymentMethod,
      items: items.map(item => ({
        product_id: parseInt(item.product_id),
        quantity: item.quantity,
        unit_price: item.unit_price,
      })),
    }, {
      onError: (errors) => {
        setErrors(errors as Record<string, string>)
      },
    })
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Nueva Venta" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <form onSubmit={handleSubmit} className="rounded-xl border border-sidebar-border/70 bg-white p-6 dark:border-sidebar-border dark:bg-[#161615]">
          <h2 className="mb-6 text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Nueva Venta</h2>

          <div className="mb-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-[#706f6c] dark:text-[#A1A09A]">Cliente</label>
              <select
                value={customerId}
                onChange={e => {
                  setCustomerId(e.target.value)
                  if (errors.customer_id) setErrors({ ...errors, customer_id: '' })
                }}
                className={`w-full rounded-sm border ${errors.customer_id ? 'border-red-500' : 'border-[#19140035]'} bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]`}
              >
                <option value="">Seleccionar cliente</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                    {' '}
                    -
                    {' '}
                    {c.document_number}
                  </option>
                ))}
              </select>
              <InputError message={errors.customer_id} />
            </div>

            <div>
              <label className="mb-2 block text-sm text-[#706f6c] dark:text-[#A1A09A]">Método de Pago</label>
              <select
                value={paymentMethod}
                onChange={e => setPaymentMethod(e.target.value)}
                className="w-full rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
              >
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
              </select>
            </div>
          </div>

          <div className="mb-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">Productos</h3>
              <button
                type="button"
                onClick={() => {
                  addItem()
                  if (errors.items) setErrors({ ...errors, items: '' })
                }}
                className="rounded-sm border border-[#1b1b18] bg-[#1b1b18] px-4 py-2 text-sm text-white hover:bg-[#2d2d28] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#1b1b18]"
              >
                <Plus className="mr-2 inline h-4 w-4" />
                Agregar Producto
              </button>
            </div>
            <InputError message={errors.items} className="mb-3" />

            {items.map((item, index) => {
              const selectedProduct = products.find(p => p.id === parseInt(item.product_id))
              const hasStockError = selectedProduct && item.quantity > selectedProduct.stock
              const itemProductError = errors[`item_${index}_product`]
              const itemStockError = errors[`item_${index}_stock`]
              const itemQuantityError = errors[`item_${index}_quantity`]

              return (
                <div key={index} className="mb-3">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <select
                        value={item.product_id}
                        onChange={e => {
                          updateItem(index, 'product_id', e.target.value)
                          const newErrors = { ...errors }
                          delete newErrors[`item_${index}_product`]
                          delete newErrors[`item_${index}_stock`]
                          setErrors(newErrors)
                        }}
                        className={`w-full rounded-sm border ${itemProductError || itemStockError ? 'border-red-500' : 'border-[#19140035]'} bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]`}
                      >
                        <option value="">Seleccionar producto</option>
                        {products.map(p => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                            {' '}
                            - $
                            {p.unit_price}
                            {' '}
                            (Stock:
                            {' '}
                            {p.stock}
                            )
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={e => {
                          updateItem(index, 'quantity', parseInt(e.target.value))
                          const newErrors = { ...errors }
                          delete newErrors[`item_${index}_quantity`]
                          delete newErrors[`item_${index}_stock`]
                          setErrors(newErrors)
                        }}
                        className={`w-24 rounded-sm border px-4 py-2 ${hasStockError || itemQuantityError || itemStockError ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-[#19140035] bg-white dark:border-[#3E3E3A] dark:bg-[#161615]'} text-[#1b1b18] dark:text-[#EDEDEC]`}
                        min="1"
                        max={selectedProduct?.stock || undefined}
                      />
                    </div>

                    <input
                      type="number"
                      value={item.unit_price}
                      onChange={e => updateItem(index, 'unit_price', parseFloat(e.target.value))}
                      className="w-32 rounded-sm border border-[#19140035] bg-white px-4 py-2 text-[#1b1b18] dark:border-[#3E3E3A] dark:bg-[#161615] dark:text-[#EDEDEC]"
                      step="0.01"
                    />

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="rounded-sm border border-red-500 px-3 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  {(hasStockError || itemStockError) && (
                    <InputError message={itemStockError || `Stock insuficiente. Disponible: ${selectedProduct?.stock}`} className="mt-1" />
                  )}
                  {itemProductError && <InputError message={itemProductError} className="mt-1" />}
                  {itemQuantityError && <InputError message={itemQuantityError} className="mt-1" />}
                </div>
              )
            })}
          </div>

          <div className="mb-6 rounded-sm border border-[#19140035] bg-[#fafaf9] p-4 dark:border-[#3E3E3A] dark:bg-[#1f1f1e]">
            <div className="flex justify-between text-sm">
              <span className="text-[#706f6c] dark:text-[#A1A09A]">Subtotal:</span>
              <span className="text-[#1b1b18] dark:text-[#EDEDEC]">
                $
                {subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#706f6c] dark:text-[#A1A09A]">IVA (19%):</span>
              <span className="text-[#1b1b18] dark:text-[#EDEDEC]">
                $
                {tax.toFixed(2)}
              </span>
            </div>
            <div className="mt-2 flex justify-between border-t border-[#19140035] pt-2 text-lg font-semibold dark:border-[#3E3E3A]">
              <span className="text-[#1b1b18] dark:text-[#EDEDEC]">Total:</span>
              <span className="text-[#1b1b18] dark:text-[#EDEDEC]">
                $
                {total.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-sm border border-[#1b1b18] bg-[#1b1b18] px-6 py-3 text-sm text-white hover:bg-[#2d2d28] dark:border-[#EDEDEC] dark:bg-[#EDEDEC] dark:text-[#1b1b18]"
            >
              Registrar Venta
            </button>
            <Link
              href="/sales"
              className="rounded-sm border border-[#19140035] px-6 py-3 text-sm text-[#1b1b18] hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:text-[#EDEDEC] dark:hover:bg-[#1f1f1e]"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
