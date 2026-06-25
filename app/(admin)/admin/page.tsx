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
    <div className="space-y-6 p-3 sm:p-4 md:p-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-black">Dashboard</h1>

      {/* Stats grid — 2 cols on mobile, 3 on sm, 5 on md+ */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-gray-500 text-xs sm:text-sm">Total Orders</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-600 mt-1">
            {isLoading ? '...' : totalOrders}
          </p>
        </div>

        <div className="bg-yellow-50 p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-gray-500 text-xs sm:text-sm">Pending</h3>
          <p className="text-xl sm:text-2xl font-bold text-yellow-600 mt-1">
            {isLoading ? '...' : pendingOrders}
          </p>
        </div>

        <div className="bg-green-50 p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-gray-500 text-xs sm:text-sm">Paid</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-600 mt-1">
            {isLoading ? '...' : paidOrders}
          </p>
        </div>

        <div className="bg-red-50 p-4 sm:p-5 rounded-lg shadow">
          <h3 className="text-gray-500 text-xs sm:text-sm">Cancelled</h3>
          <p className="text-xl sm:text-2xl font-bold text-red-600 mt-1">
            {isLoading ? '...' : cancelledOrders}
          </p>
        </div>

        {/* Revenue card spans full width on mobile so the number isn't cramped */}
        <div className="col-span-2 sm:col-span-1 bg-white p-4 sm:p-5 rounded-lg shadow border border-green-200">
          <h3 className="text-gray-500 text-xs sm:text-sm">Revenue (Paid)</h3>
          <p className="text-xl sm:text-2xl font-bold text-green-700 mt-1">
            {isLoading ? '...' : `£${totalRevenue.toLocaleString()}`}
          </p>
        </div>
      </div>

      {/* Quick-link cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <Link
          href="/admin/orders"
          className="bg-white p-5 sm:p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="font-semibold text-gray-700 text-sm sm:text-base">📦 View All Orders</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Manage customer orders & payments</p>
        </Link>

        <Link
          href="/admin/products"
          className="bg-white p-5 sm:p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="font-semibold text-gray-700 text-sm sm:text-base">🛍️ Manage Products</h3>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">Add, edit or remove products</p>
        </Link>
      </div>
    </div>
  )
}