// kikiafricataste/app/admin/orders/[id]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { dummyOrders } from "@/data/dummyOrders";

export default function OrderDetails() {
  const params = useParams();
  const order = dummyOrders.find((o) => o.id === params.id);

  const [status, setStatus] = useState(order?.status);

  if (!order) {
    return <div className="p-10">Order not found</div>;
  }

  const handleMarkAsPaid = () => {
    setStatus("paid");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">
        Order {order.id}
      </h1>

      {/* Customer Info */}
      <div className="bg-white text-black p-6 rounded-lg shadow space-y-2">
        <h2 className="font-semibold text-lg">Customer Info</h2>
        <p><strong>Name:</strong> {order.name}</p>
        <p><strong>Email:</strong> {order.email}</p>
        <p><strong>Phone:</strong> {order.phone}</p>
      </div>

      {/* Address */}
      <div className="bg-white text-black p-6 rounded-lg shadow space-y-2">
        <h2 className="font-semibold text-lg">Address</h2>
        <p>{order.address}</p>
        <p>Post Code: {order.postcode}</p>
      </div>

      {/* Items */}
      <div className="bg-white text-black p-6 rounded-lg shadow">
        <h2 className="font-semibold text-lg mb-4">Items</h2>

        <div className="space-y-3">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between border-b pb-2">
              <span>{item.name} (x{item.qty})</span>
              <span>₦{(item.price * item.qty).toLocaleString()}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-4 font-semibold">
          <span>Total</span>
          <span>₦{order.total.toLocaleString()}</span>
        </div>
      </div>

      {/* Status + Action */}
      <div className="bg-white text-black p-6 rounded-lg shadow flex items-center justify-between">
        <div>
          <p className="font-semibold">Status:</p>
          <p className="capitalize">{status}</p>
        </div>

        {status !== "paid" && (
          <button
            onClick={handleMarkAsPaid}
            className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700"
          >
            Mark as Paid
          </button>
        )}
      </div>
    </div>
  );
}