'use client'

import { useState, useCallback } from 'react'
import { Search, Sun, Moon, Bell } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'

interface AdminNavbarProps {
  onMenuClick?: () => void
  showMobileMenu?: boolean
}

export default function AdminNavbar({ onMenuClick, showMobileMenu }: AdminNavbarProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const notifications = [
    { id: 1, message: 'New order #ORD-1003', time: '2 min ago', read: false },
    { id: 2, message: 'Payment received for ORD-1002', time: '15 min ago', read: false },
    { id: 3, message: "Product 'Catfish Pack' is low in stock", time: '1 hour ago', read: true },
    { id: 4, message: 'New user registered', time: '3 hours ago', read: true },
  ]
  const unreadCount = notifications.filter((n) => !n.read).length

  // Fire custom event so the current page can react to search input
  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value)
      // Dispatch to current page
      window.dispatchEvent(
        new CustomEvent('admin:search', { detail: value })
      )
      // If not already on a searchable page, navigate to products
      if (!pathname?.startsWith('/admin/products') && value.trim()) {
        router.push('/admin/products')
      }
    },
    [pathname, router]
  )

  return (
<nav className="sticky top-0 z-40 bg-white w-full">
  <div className="flex items-center justify-between h-14 px-5 w-full">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 w-64 focus-within:border-gray-300 transition-colors">
          <Search className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={1.75} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search anything"
            className="bg-transparent text-sm text-gray-700 placeholder:text-gray-400 outline-none flex-1 min-w-0"
          />
          <div className="hidden sm:flex items-center gap-0.5 shrink-0">
            <kbd className="text-[11px] text-gray-400 bg-gray-100 border border-gray-200 rounded px-1 py-0.5 leading-none font-sans">
              ⌘
            </kbd>
            <kbd className="text-[11px] text-gray-400 bg-gray-100 border border-gray-200 rounded px-1 py-0.5 leading-none font-sans">
              K
            </kbd>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <Sun className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`relative w-10 h-5 rounded-full transition-colors duration-200 mx-0.5 ${
              darkMode ? 'bg-gray-700' : 'bg-gray-200'
            }`}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${
                darkMode ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>

          <button className="p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
            <Moon className="w-4 h-4" strokeWidth={1.75} />
          </button>
          <div className="w-px h-5 bg-gray-200 mx-2" />
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" strokeWidth={1.75} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              )}
            </button>

            {showNotifications && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                    <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                    <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-gray-50">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer flex gap-3 ${
                          !n.read ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        {!n.read && (
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                        )}
                        <div className={!n.read ? '' : 'pl-[18px]'}>
                          <p className={`text-xs leading-normal ${!n.read ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                            {n.message}
                          </p>
                          <p className="text-[10px] text-gray-400 mt-0.5">{n.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-gray-50 text-center">
                    <Link
                      href="/admin/notifications"
                      className="text-xs font-medium text-gray-500 hover:text-indigo-600 transition-colors"
                    >
                      See all notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className="w-px h-5 bg-gray-200 mx-2" />
          <button className="flex items-center gap-1.5 rounded-lg p-1 hover:bg-gray-100 transition-colors">
            <Avatar className="h-8 w-8 border border-gray-200">
              <AvatarImage
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
                alt="Admin"
              />
              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-xs font-bold">
                AU
              </AvatarFallback>
            </Avatar>
          </button>
        </div>
      </div>
    </nav>
  )
}