'use client'

import { useState, useMemo, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useAdminOrders, useConfirmOrder, useCancelOrder } from '@/features/orders/orders.query'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Search, ArrowUpDown, Check } from 'lucide-react'
import PageLoader from '@/components/shared/PageLoader'

type SortOption = 'newest' | 'oldest' | 'highest' | 'lowest'

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'highest', label: 'Highest total' },
  { value: 'lowest', label: 'Lowest total' },
]

export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<string | undefined>(undefined)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOption>('newest')
  const [sortOpen, setSortOpen] = useState(false)
  const sortRef = useRef<HTMLDivElement>(null)

  const { data, isLoading } = useAdminOrders(page, status, search)
  const confirmOrder = useConfirmOrder()
  const cancelOrder = useCancelOrder()

  const rawOrders = data?.orders ?? []
  const total = data?.total ?? 0

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const orders = useMemo(() => {
    const copy = [...rawOrders]
    switch (sort) {
      case 'newest':
        return copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'oldest':
        return copy.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
      case 'highest':
        return copy.sort((a, b) => b.total - a.total)
      case 'lowest':
        return copy.sort((a, b) => a.total - b.total)
      default:
        return copy
    }
  }, [rawOrders, sort])

  const tabs = [
    { label: 'All', value: undefined },
    { label: 'Unpaid', value: 'PENDING_PAYMENT' },
    { label: 'Paid', value: 'CONFIRMED' },
    { label: 'Cancelled', value: 'CANCELLED' },
  ]

  const getPaymentStatusClass = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-emerald-50 text-emerald-600 border border-emerald-100'
      case 'CANCELLED':
        return 'bg-rose-50 text-rose-400 border border-rose-100'
      case 'PENDING_PAYMENT':
      default:
        return 'bg-amber-50 text-amber-600 border border-amber-100'
    }
  }

  const getPaymentLabel = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'Paid'
      case 'CANCELLED': return 'Cancelled'
      default: return 'Unpaid'
    }
  }

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sort)?.label ?? 'Sort'
  const isCustomSort = sort !== 'newest'

  if (isLoading) {
    return <PageLoader title="Loading Orders..." description="Please wait while we fetch customer orders." />
  }

  return (
    <div className="space-y-4 p-3 sm:p-4 md:p-6 text-gray-700 min-h-screen">

      {/* Top Tabs + Controls */}
      <div className="flex flex-col gap-3 border-b pb-4">

        {/* Tabs row */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-hide -mx-3 px-3 sm:-mx-4 sm:px-4 md:mx-0 md:px-0">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              onClick={() => {
                setStatus(tab.value)
                setPage(1)
              }}
              className={`px-4 py-1.5 text-sm font-medium rounded-full whitespace-nowrap transition-all flex-shrink-0 ${
                status === tab.value ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2">
          <div className="relative flex-1 xs:max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Find order..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-white w-full h-9 text-sm"
            />
          </div>

          <div className="flex gap-2 xs:ml-auto flex-shrink-0">
            <div className="relative flex-1 xs:flex-none" ref={sortRef}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOpen((o) => !o)}
                className={`flex items-center gap-1.5 w-full xs:w-auto h-9 text-sm px-3 transition-colors  text-white  ${
                  isCustomSort ? 'bg-black text-white border-black hover:bg-black hover:text-white' : ''
                }`}
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
                {currentSortLabel}
              </Button>

              {sortOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl shadow-lg border border-gray-100  overflow-hidden z-50">
                  {SORT_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => {
                        setSort(option.value)
                        setSortOpen(false)
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors text-left ${
                        sort === option.value
                          ? 'bg-gray-50 text-gray-900 font-medium'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                      {sort === option.value && <Check className="w-3.5 h-3.5 text-gray-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            
          </div>
        </div>
      </div>

      {/* Cards + Table */}
      <div className="bg-white rounded-2xl shadow overflow-hidden border">

        {/* Mobile Card View */}
        <div className="md:hidden divide-y divide-gray-100">
          {orders.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">
              No orders found
            </div>
          ) : (
            orders.map((order) => (
              <div key={order.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <Link href={`/admin/orders/${order.id}`} className="font-semibold text-sm hover:underline">
                    #{order.orderNumber}
                  </Link>
                  <span className="text-xs text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <p className="text-sm font-medium text-gray-900 truncate max-w-[60%]">{order.customerName}</p>
                  <p className="text-sm font-semibold">£{order.total}</p>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusClass(order.status)}`}>
                    {getPaymentLabel(order.status)}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="block w-full text-center bg-black text-white py-2.5 rounded-xl text-sm font-medium hover:bg-[#c9a96e] hover:text-black transition-colors"
                >
                  View Details
                </Link>
              </div>
            ))
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[860px]">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4 text-left font-medium text-sm whitespace-nowrap">ID Order</th>
                <th className="p-4 text-left font-medium text-sm whitespace-nowrap">Date</th>
                <th className="p-4 text-left font-medium text-sm whitespace-nowrap">Customer</th>
                <th className="p-4 text-left font-medium text-sm whitespace-nowrap">Total</th>
                <th className="p-4 text-left font-medium text-sm whitespace-nowrap">Payment Status</th>
                <th className="p-4 text-left font-medium text-sm whitespace-nowrap">Items</th>
                <th className="p-4 text-left font-medium text-sm whitespace-nowrap">Order Status</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-gray-400 text-sm">No orders found</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-sm">
                      <Link href={`/admin/orders/${order.id}`} className="hover:underline">#{order.orderNumber}</Link>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString('en-GB', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="p-4 text-sm max-w-[160px] truncate">{order.customerName}</td>
                    <td className="p-4 font-medium text-sm whitespace-nowrap">£{order.total}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getPaymentStatusClass(order.status)}`}>
                        {getPaymentLabel(order.status)}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${getPaymentStatusClass(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-blue-600 bg-blue-100 py-2 px-4 hover:underline text-sm font-medium whitespace-nowrap rounded-full"
                      >
                        View →
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}