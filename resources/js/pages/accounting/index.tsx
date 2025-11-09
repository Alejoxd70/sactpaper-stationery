import AppLayout from '@/layouts/app-layout'
import { type BreadcrumbItem } from '@/types'
import { Head } from '@inertiajs/react'
import { useState } from 'react'
import { BookOpen, ChevronRight, TrendingUp, TrendingDown, ArrowRightLeft } from 'lucide-react'

const breadcrumbs: BreadcrumbItem[] = [
  { title: 'Contabilidad', href: '/accounting' },
]

interface Account {
  id: number
  code: string
  name: string
  type: string
  parent_id: number | null
  children?: Account[]
}

interface Transaction {
  id: number
  date: string
  description: string
  debit: number
  credit: number
  reference: string
  account: {
    code: string
    name: string
  }
  user: {
    name: string
  }
  invoice: {
    invoice_number: string
  } | null
}

interface AccountingIndexProps {
  accounts: Account[]
  transactions: Transaction[]
}

export default function AccountingIndex({ accounts, transactions }: AccountingIndexProps) {
  const [activeTab, setActiveTab] = useState<'puc' | 'movements'>('puc')
  const [expandedAccounts, setExpandedAccounts] = useState<number[]>([])

  const toggleAccount = (id: number) => {
    setExpandedAccounts(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id],
    )
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'activo': return 'text-blue-600 dark:text-blue-400'
      case 'pasivo': return 'text-red-600 dark:text-red-400'
      case 'patrimonio': return 'text-purple-600 dark:text-purple-400'
      case 'ingreso': return 'text-green-600 dark:text-green-400'
      case 'gasto': return 'text-orange-600 dark:text-orange-400'
      case 'costo': return 'text-yellow-600 dark:text-yellow-400'
      default: return 'text-[#706f6c]'
    }
  }

  const getTypeLabel = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1)
  }

  const parentAccounts = accounts.filter(a => !a.parent_id)
  const childAccounts = (parentId: number) => accounts.filter(a => a.parent_id === parentId)

  const renderAccount = (account: Account, level: number = 0) => {
    const children = childAccounts(account.id)
    const hasChildren = children.length > 0
    const isExpanded = expandedAccounts.includes(account.id)

    return (
      <div key={account.id}>
        <div
          className={`flex items-center justify-between border-b border-[#19140035] py-3 px-4 hover:bg-[#fafaf9] dark:border-[#3E3E3A] dark:hover:bg-[#1f1f1e] ${level > 0 ? 'pl-' + (4 + level * 4) : ''
          }`}
          style={{ paddingLeft: `${1 + level * 1.5}rem` }}
        >
          <div className="flex items-center gap-3 flex-1">
            {hasChildren && (
              <button
                onClick={() => toggleAccount(account.id)}
                className="text-[#706f6c] hover:text-[#1b1b18] dark:hover:text-[#EDEDEC]"
              >
                <ChevronRight className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
              </button>
            )}
            {!hasChildren && <div className="w-4" />}
            <span className="font-mono text-sm text-[#706f6c] dark:text-[#A1A09A] w-20">
              {account.code}
            </span>
            <span className="text-sm text-[#1b1b18] dark:text-[#EDEDEC]">
              {account.name}
            </span>
          </div>
          <span className={`text-xs font-medium ${getTypeColor(account.type)}`}>
            {getTypeLabel(account.type)}
          </span>
        </div>
        {hasChildren && isExpanded && (
          <div>
            {children.map(child => renderAccount(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Contabilidad" />
      <div className="flex h-full flex-1 flex-col gap-4 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-[#1b1b18] dark:text-[#EDEDEC]">
            Contabilidad
          </h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-[#19140035] dark:border-[#3E3E3A]">
          <button
            onClick={() => setActiveTab('puc')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'puc'
              ? 'border-b-2 border-[#1b1b18] text-[#1b1b18] dark:border-[#EDEDEC] dark:text-[#EDEDEC]'
              : 'text-[#706f6c] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:text-[#EDEDEC]'
            }`}
          >
            <BookOpen className="mr-2 inline h-4 w-4" />
            Plan de Cuentas (PUC)
          </button>
          <button
            onClick={() => setActiveTab('movements')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === 'movements'
              ? 'border-b-2 border-[#1b1b18] text-[#1b1b18] dark:border-[#EDEDEC] dark:text-[#EDEDEC]'
              : 'text-[#706f6c] hover:text-[#1b1b18] dark:text-[#A1A09A] dark:hover:text-[#EDEDEC]'
            }`}
          >
            <ArrowRightLeft className="mr-2 inline h-4 w-4" />
            Movimientos Contables
          </button>
        </div>

        {/* PUC Tab */}
        {activeTab === 'puc' && (
          <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-[#161615]">
            <div className="border-b border-[#19140035] p-4 dark:border-[#3E3E3A]">
              <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                Estructura jerárquica del Plan Único de Cuentas. Haz clic en las flechas para expandir.
              </p>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {parentAccounts.map(account => renderAccount(account))}
            </div>
          </div>
        )}

        {/* Movimientos Tab */}
        {activeTab === 'movements' && (
          <div className="rounded-xl border border-sidebar-border/70 bg-white dark:border-sidebar-border dark:bg-[#161615]">
            <div className="border-b border-[#19140035] p-4 dark:border-[#3E3E3A]">
              <p className="text-sm text-[#706f6c] dark:text-[#A1A09A]">
                Últimos 50 movimientos contables registrados automáticamente
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-[#19140035] dark:border-[#3E3E3A]">
                  <tr>
                    <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Fecha</th>
                    <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Cuenta</th>
                    <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Descripción</th>
                    <th className="p-4 text-right text-sm text-[#706f6c] dark:text-[#A1A09A]">Débito</th>
                    <th className="p-4 text-right text-sm text-[#706f6c] dark:text-[#A1A09A]">Crédito</th>
                    <th className="p-4 text-left text-sm text-[#706f6c] dark:text-[#A1A09A]">Referencia</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(transaction => (
                    <tr
                      key={transaction.id}
                      className="border-b border-[#19140035] last:border-0 dark:border-[#3E3E3A]"
                    >
                      <td className="p-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        {new Date(transaction.date).toLocaleDateString('es-CO')}
                      </td>
                      <td className="p-4 text-sm">
                        <div className="text-[#1b1b18] dark:text-[#EDEDEC]">
                          {transaction.account.name}
                        </div>
                        <div className="font-mono text-xs text-[#706f6c] dark:text-[#A1A09A]">
                          {transaction.account.code}
                        </div>
                      </td>
                      <td className="p-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        {transaction.description}
                      </td>
                      <td className="p-4 text-right text-sm">
                        {transaction.debit > 0
                          ? (
                              <span className="flex items-center justify-end gap-1 text-blue-600 dark:text-blue-400">
                                <TrendingUp className="h-3 w-3" />
                                $
                                {parseFloat(transaction.debit.toString()).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                              </span>
                            )
                          : (
                              <span className="text-[#706f6c] dark:text-[#A1A09A]">-</span>
                            )}
                      </td>
                      <td className="p-4 text-right text-sm">
                        {transaction.credit > 0
                          ? (
                              <span className="flex items-center justify-end gap-1 text-green-600 dark:text-green-400">
                                <TrendingDown className="h-3 w-3" />
                                $
                                {parseFloat(transaction.credit.toString()).toLocaleString('es-CO', { minimumFractionDigits: 2 })}
                              </span>
                            )
                          : (
                              <span className="text-[#706f6c] dark:text-[#A1A09A]">-</span>
                            )}
                      </td>
                      <td className="p-4 text-sm text-[#706f6c] dark:text-[#A1A09A]">
                        {transaction.reference}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
