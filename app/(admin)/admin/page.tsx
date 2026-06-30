'use client'

import Link from 'next/link'
import { useAdminOrders } from '@/features/orders/orders.query'

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const { data, isLoading } = useAdminOrders(1)

  const orders = data?.orders ?? []

  const totalOrders = orders.length
  const pendingOrders = orders.filter((o) => o.status === 'PENDING_PAYMENT').length
  const paidOrders = orders.filter((o) => o.status === 'CONFIRMED').length
  const cancelledOrders = orders.filter((o) => o.status === 'CANCELLED').length
  const totalRevenue = orders
    .filter((o) => o.status === 'CONFIRMED')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="mx-auto w-full max-w-7xl space-y-5 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <h1 className="text-xl font-semibold text-black sm:text-2xl md:text-3xl">
        Dashboard
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5 md:gap-4">
        <div className="rounded-xl bg-white p-4 shadow min-h-[110px] flex flex-col justify-between">
          <h3 className="text-xs text-gray-500 sm:text-sm">
            Total Orders
          </h3>

          <p className="break-words text-2xl font-bold text-gray-700 sm:text-3xl">
            {isLoading ? '...' : totalOrders}
          </p>
        </div>

        <div className="rounded-xl bg-yellow-50 p-4 shadow min-h-[110px] flex flex-col justify-between">
          <h3 className="text-xs text-gray-500 sm:text-sm">
            Pending
          </h3>

          <p className="break-words text-2xl font-bold text-yellow-600 sm:text-3xl">
            {isLoading ? '...' : pendingOrders}
          </p>
        </div>

        <div className="rounded-xl bg-green-50 p-4 shadow min-h-[110px] flex flex-col justify-between">
          <h3 className="text-xs text-gray-500 sm:text-sm">
            Paid
          </h3>

          <p className="break-words text-2xl font-bold text-green-600 sm:text-3xl">
            {isLoading ? '...' : paidOrders}
          </p>
        </div>

        <div className="rounded-xl bg-red-50 p-4 shadow min-h-[110px] flex flex-col justify-between">
          <h3 className="text-xs text-gray-500 sm:text-sm">
            Cancelled
          </h3>

          <p className="break-words text-2xl font-bold text-red-600 sm:text-3xl">
            {isLoading ? '...' : cancelledOrders}
          </p>
        </div>

        <div className="col-span-2 rounded-xl border border-green-200 bg-white p-4 shadow min-h-[110px] flex flex-col justify-between sm:col-span-1">
          <h3 className="text-xs text-gray-500 sm:text-sm">
            Revenue (Paid)
          </h3>

          <p className="break-words text-xl font-bold text-green-700 sm:text-2xl lg:text-3xl">
            {isLoading ? '...' : `£${totalRevenue.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-6">
        <Link
          href="/admin/orders"
          className="rounded-xl bg-white p-5 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <h3 className="text-base font-semibold text-gray-700">
            📦 View All Orders
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Manage customer orders & payments
          </p>
        </Link>

        <Link
          href="/admin/products"
          className="rounded-xl bg-white p-5 shadow transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <h3 className="text-base font-semibold text-gray-700">
            🛍️ Manage Products
          </h3>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            Add, edit or remove products
          </p>
        </Link>
      </div>
    </div>
  )
}