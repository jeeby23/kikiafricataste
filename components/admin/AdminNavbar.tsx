'use client'

import { useState, useCallback } from 'react'
import { Search } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useRouter, usePathname } from 'next/navigation'

interface AdminNavbarProps {
  onMenuClick?: () => void
  showMobileMenu?: boolean
}

export default function AdminNavbar({ onMenuClick, showMobileMenu }: AdminNavbarProps) {

  const [searchValue, setSearchValue] = useState('')
  const router = useRouter()
  const pathname = usePathname()

  const handleSearch = useCallback(
    (value: string) => {
      setSearchValue(value)
      window.dispatchEvent(new CustomEvent('admin:search', { detail: value }))

      if (!pathname?.startsWith('/admin/products') && value.trim()) {
        router.push('/admin/products')
      }
    },
    [pathname, router],
  )

  return (
    <nav className="sticky top-0 z-40 w-full max-w-[400px] md:max-w-none md:w-full mx-auto md:mx-0 bg-white">
      <div className="flex items-center justify-between h-14 px-5 w-full">
        <div className="flex flex-1 max-w-[220px] sm:max-w-xs md:max-w-sm items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition-colors focus-within:border-gray-300">
          <Search className="w-4 h-4 text-gray-400 shrink-0" strokeWidth={1.75} />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search anything"
            className="min-w-0 flex-1 bg-transparent  text-gray-700 text-base placeholder:text-gray-400 outline-none"
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

        <div className="flex shrink-0 items-center gap-1">
         
          <div className="  bg-gray-200 mx-2" />
          <div className="w-px h-5 bg-gray-200 mx-2" />
          <button className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg p-1 transition-colors hover:bg-gray-100">
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
