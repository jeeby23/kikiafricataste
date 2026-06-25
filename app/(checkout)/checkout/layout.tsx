'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart } from 'lucide-react'
import { Bokor } from 'next/font/google'
import { useCartStore } from '@/store/cartStore'

const bokorFont = Bokor({
  subsets: ['latin'],
  weight: '400',
})



export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const { items } = useCartStore()
type CartItem = {

  qty: number

}
const cartCount = useCartStore((s) => s.items.length)

  return (
    <div className="min-h-screen bg-[#f8f7f4]">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <Image src="/kikiafrica-logo.webp" alt="Kiki African Taste" width={48} height={48} />
            <h1 className={`${bokorFont.className} text-black text-2xl pt-6 mr-8`}>
              Kiki African Taste
            </h1>
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/products" className="text-black">
              Shop
            </Link>
            <Link href="/cart" className="relative">
              <ShoppingCart size={24} className="text-black" />

              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c9a96e] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">{children}</main>
    </div>
  )
}
