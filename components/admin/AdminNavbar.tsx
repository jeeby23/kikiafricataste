// kikiafricataste/components/admin/AdminNavbar.tsx
"use client";

import { useState } from "react";
import { Bell, Menu, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminNavbarProps {
  onMenuClick?: () => void;
  showMobileMenu?: boolean;
}

export default function AdminNavbar({ onMenuClick, showMobileMenu }: AdminNavbarProps) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notification data
  const notifications = [
    { id: 1, message: "New order #ORD-1003", time: "2 min ago", read: false },
    { id: 2, message: "Payment received for ORD-1002", time: "15 min ago", read: false },
    { id: 3, message: "Product 'Catfish Pack' is low in stock", time: "1 hour ago", read: true },
    { id: 4, message: "New user registered", time: "3 hours ago", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    if (pathname?.startsWith("/admin/orders")) {
      if (pathname === "/admin/orders") return "Orders";
      return "Order Details";
    }
    if (pathname?.startsWith("/admin/products")) {
      if (pathname === "/admin/products") return "Products";
      if (pathname?.includes("/add")) return "Add Product";
      return "Edit Product";
    }
    return "Admin";
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side - Mobile menu button + Title */}
          <div className="flex items-center gap-3">
            {/* Mobile menu toggle button */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {showMobileMenu ? (
                <X className="h-5 w-5 text-gray-600" />
              ) : (
                <Menu className="h-5 w-5 text-gray-600" />
              )}
            </button>

            {/* Page Title */}
            <h1 className="text-lg sm:text-xl font-semibold text-gray-800">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right side - Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] font-medium rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                      <button className="text-sm text-blue-600 hover:text-blue-800">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer ${
                          !notification.read ? "bg-blue-50/50" : ""
                        }`}
                      >
                        <p className={`text-sm ${!notification.read ? "font-medium" : "text-gray-600"}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    ))}
                  </div>
                  <div className="p-3 bg-gray-50 text-center">
                    <Link
                      href="/admin/notifications"
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-6 w-px bg-gray-200"></div>

            {/* Admin Profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-medium text-gray-700">Admin User</p>
                <p className="text-xs text-gray-500">admin@kikiafricataste.com</p>
              </div>

              <Avatar size="default" className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all">
                <AvatarImage src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="Admin" />
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}