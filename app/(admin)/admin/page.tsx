"use client";

import { dummyOrders } from "@/data/dummyOrders";
import Link from "next/link";

export default function AdminDashboard() {
  // 📦 Order counts
  const totalOrders = dummyOrders.length;

  const pendingOrders = dummyOrders.filter(
    (o) => o.status === "pending"
  ).length;

  const paidOrders = dummyOrders.filter(
    (o) => o.status === "paid"
  ).length;

  const cancelledOrders = dummyOrders.filter(
    (o) => o.status === "cancelled"
  ).length;

  // 💰 REAL revenue (ONLY paid orders)
  const totalRevenue = dummyOrders
    .filter((o) => o.status === "paid")
    .reduce((sum, o) => sum + o.total, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold text-black">
        Dashboard
      </h1>

      {/* 📊 STATS CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{totalOrders}</p>
        </div>

        {/* Pending */}
        <div className="bg-yellow-50 p-5 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">
            {pendingOrders}
          </p>
        </div>

        {/* Paid */}
        <div className="bg-green-50 p-5 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Paid</h3>
          <p className="text-2xl font-bold text-green-600">
            {paidOrders}
          </p>
        </div>

        {/* Cancelled */}
        <div className="bg-red-50 p-5 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Cancelled</h3>
          <p className="text-2xl font-bold text-red-600">
            {cancelledOrders}
          </p>
        </div>

        {/* Revenue */}
        <div className="bg-white p-5 rounded-lg shadow border border-green-200">
          <h3 className="text-gray-500 text-sm">Revenue (Paid)</h3>
          <p className="text-2xl font-bold text-green-700">
            ￡{totalRevenue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* 🚀 QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <Link
          href="/admin/orders"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="font-semibold">📦 View All Orders</h3>
          <p className="text-sm text-gray-500">
            Manage customer orders & payments
          </p>
        </Link>

        <Link
          href="/admin/products"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="font-semibold">🛍️ Manage Products</h3>
          <p className="text-sm text-gray-500">
            Add, edit or remove products
          </p>
        </Link>
      </div>
    </div>
  );
}