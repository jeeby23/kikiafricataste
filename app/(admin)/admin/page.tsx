'use client'

import Link from 'next/link'
import { useAdminOrders } from '@/features/orders/orders.query'

export const dynamic = 'force-dynamic'

export default function AdminDashboard() {
  const { data, isLoading } = useAdminOrders(1)

  const orders = data?.orders ?? []

  const totalOrders = data?.total ?? 0

  const pendingOrders = orders.filter(
    (order) => order.status === 'PENDING_PAYMENT'
  ).length

  const confirmedOrders = orders.filter(
    (order) => order.status === 'CONFIRMED'
  ).length

  const cancelledOrders = orders.filter(
    (order) => order.status === 'CANCELLED'
  ).length

  // Revenue from confirmed orders on the current fetched page
  const totalRevenue = orders
    .filter((order) => order.status === 'CONFIRMED')
    .reduce((sum, order) => sum + Number(order.total), 0)

  const averageOrderValue =
    confirmedOrders > 0 ? totalRevenue / confirmedOrders : 0

  const formatGBP = (amount: number) =>
    new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">
        Dashboard
      </h1>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
        <div className="rounded-xl border bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-900">
            {isLoading ? '...' : totalOrders}
          </h2>
        </div>

        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm">
          <p className="text-sm text-yellow-700">Pending Payment</p>
          <h2 className="mt-2 text-3xl font-bold text-yellow-600">
            {isLoading ? '...' : pendingOrders}
          </h2>
        </div>

        <div className="rounded-xl border border-green-200 bg-green-50 p-5 shadow-sm">
          <p className="text-sm text-green-700">Confirmed</p>
          <h2 className="mt-2 text-3xl font-bold text-green-600">
            {isLoading ? '...' : confirmedOrders}
          </h2>
        </div>

        <div className="rounded-xl border border-red-200 bg-red-50 p-5 shadow-sm">
          <p className="text-sm text-red-700">Cancelled</p>
          <h2 className="mt-2 text-3xl font-bold text-red-600">
            {isLoading ? '...' : cancelledOrders}
          </h2>
        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
          <p className="text-sm text-emerald-700">Revenue</p>
          <h2 className="mt-2 break-words text-2xl font-bold text-emerald-700">
            {isLoading ? '...' : formatGBP(totalRevenue/100)}
          </h2>
        </div>

        {/* <div className="rounded-xl border border-blue-200 bg-blue-50 p-5 shadow-sm">
          <p className="text-sm text-blue-700">Average Order</p>
          <h2 className="mt-2 break-words text-2xl font-bold text-blue-700">
            {isLoading ? '...' : formatGBP(averageOrderValue)}
          </h2>
        </div> */}
      </div>

      {/* Quick Links */}
      <div className="grid gap-5 md:grid-cols-2">
        <Link
          href="/admin/orders"
          className="rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-3 text-3xl">📦</div>

          <h3 className="text-lg font-semibold text-gray-900">
            Manage Orders
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            View, update and manage customer orders and payment statuses.
          </p>
        </Link>

        <Link
          href="/admin/products"
          className="rounded-xl border bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
        >
          <div className="mb-3 text-3xl">🛍️</div>

          <h3 className="text-lg font-semibold text-gray-900">
            Manage Products
          </h3>

          <p className="mt-2 text-sm text-gray-600">
            Add, edit or remove products from your store.
          </p>
        </Link>
      </div>
    </div>
  )
}