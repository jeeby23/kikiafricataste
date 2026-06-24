'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingCart, Menu } from 'lucide-react'
import { useState } from 'react'
import { useCartStore } from '@/store/cartStore'
import SearchOverlay from '@/components/header/SearchOverlay'

export default function NavBar({
  scrolled,
  onCartOpen,
  onMenuOpen,
  onSearchOpen,
}: {
  scrolled: boolean
  onCartOpen: () => void
  onMenuOpen: () => void
  onSearchOpen: () => void
}) {

  const cartCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.qty, 0))

  return (
    <>
      <div
        className={`max-w-5xl mx-auto px-4 md:px-8 h-16  flex items-center justify-between text-black transition-all duration-300 ${
          scrolled ? 'bg-transparent rounded-none ' : 'bg-white/70 rounded-full'
        }`}
      >
        <Link href="/">
          <Image
            src="/kiki-rebrand.svg"
            alt="Kiki African Taste"
            width={50}
            height={50}
            sizes="(max-width: 640px) 50vw, 25vw"
            className="rounded-full" 
          />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-black">
          <Link href="/" className="text-sm font-bold uppercase hover:text-[#c9a96e]">
            Home
          </Link>
          <Link href="/products" className="text-sm font-bold uppercase hover:text-[#c9a96e]">
            Products
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <button
            onClick={onSearchOpen}
            className="text-black hover:text-[#c9a96e] transition"
            aria-label="Open search"
          >
            <Search size={20} />
          </button>

          <button onClick={onCartOpen} className="relative text-black hover:text-[#c9a96e]">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#c9a96e] text-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <button className="md:hidden" onClick={onMenuOpen}>
            <Menu size={26} />
          </button>
        </div>
      </div>
    </>
  )
}
