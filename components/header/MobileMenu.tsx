'use client'

import Link from 'next/link'
import { X } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

export default function MobileMenu({
  open,
  onClose,
  onCartOpen,
}: {
  open: boolean
  onClose: () => void
  onCartOpen: () => void
}) {
const cartCount = useCartStore((s) => s.items.length)

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/30 z-30 md:hidden" onClick={onClose} />
      )}
      <div className={`fixed top-0 right-0 h-full w-[80%] sm:w-1/2 bg-white z-50 md:hidden text-black transform transition-transform duration-300 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="flex justify-end p-6">
            <button onClick={onClose}><X size={28} /></button>
          </div>
          <div className="flex flex-col items-start px-8 gap-8 mt-6 flex-1">
            {[{ href: '/', label: 'Home' }, { href: '/products', label: 'Products' }].map(({ href, label }) => (
              <Link key={href} href={href} onClick={onClose} className="text-black text-xl uppercase tracking-widest hover:text-[#c9a96e]">
                {label}
              </Link>
            ))}
            <button
              onClick={() => { onClose(); onCartOpen(); }}
              className="text-black text-xl uppercase tracking-widest hover:text-[#c9a96e] flex items-center gap-2"
            >
              Cart{' '}
              {cartCount > 0 && (
                <span className="text-sm bg-[#c9a96e] text-white rounded-full px-2">{cartCount}</span>
              )}
            </button>
          </div>
          <div className="p-6">
            <Link
              href="/products"
              onClick={onClose}
              className="block w-full text-center bg-[#c9a96e] text-black font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-black hover:text-white transition"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}