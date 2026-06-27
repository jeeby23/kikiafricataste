// kikiafricataste/app/admin/notifications/page.tsx
"use client";

import { Bell } from "lucide-react";

export default function NotificationsPage() {
  const notifications = [
    { id: 1, message: "New order #ORD-1003", time: "2 min ago", read: false },
    { id: 2, message: "Payment received for ORD-1002", time: "15 min ago", read: false },
    { id: 3, message: "Product 'Catfish Pack' is low in stock", time: "1 hour ago", read: true },
    { id: 4, message: "New user registered", time: "3 hours ago", read: true },
    { id: 5, message: "Order #ORD-1001 has been delivered", time: "5 hours ago", read: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Notifications</h1>
        <button className="text-sm text-blue-600 hover:text-blue-800">
          Mark all as read
        </button>
      </div>

      <div className="bg-white rounded-lg shadow divide-y">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 hover:bg-gray-50 transition-colors ${
              !notification.read ? "bg-blue-50/30" : ""
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                !notification.read ? "bg-blue-500" : "bg-gray-300"
              }`} />
              <div className="flex-1">
                <p className={`${!notification.read ? "font-medium" : "text-gray-600"}`}>
                  {notification.message}
                </p>
                <p className="text-sm text-gray-400 mt-1">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}