import Link from "next/link";
import { dummyOrders } from "@/data/dummyOrders"; 

export default function OrdersPage() {
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-6 text-black">Orders</h1>

      <div className="bg-white text-black rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-3">Order ID</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Time</th>
            </tr>
          </thead>

          <tbody>
            {dummyOrders.map((order) => (
              <tr key={order.id} className="border-t hover:bg-gray-50 cursor-pointer">
                <td className="p-3">
                  <Link href={`/admin/orders/${order.id}`}>
                    {order.id}
                  </Link>
                </td>
                <td className="p-3">{order.name}</td>
                <td className="p-3">{order.email}</td>
                <td className="p-3">{order.phone}</td>
                <td className="p-3">₦{order.total.toLocaleString()}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    order.status === 'paid' ? 'bg-green-100 text-green-800' : 
                    order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="p-3">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}