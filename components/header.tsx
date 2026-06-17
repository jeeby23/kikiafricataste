'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Search, ShoppingCart, X, Menu, Minus, Plus, Trash2 } from 'lucide-react'
import Container from '@/components/Container'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet'
import { useCartStore } from '@/store/cartStore'

const Header = () => {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const { items: cartItems, updateQty, removeItem } = useCartStore()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <>
      <Container>
        <header
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled ? 'bg-white/70 backdrop-blur-md border-b border-white/10' : 'bg-transparent'
          }`}
        >
          <div className="max-w-5xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between rounded-full text-black bg-white/70">
            {/* Logo */}

            <Image
              src="/kiki-rebrand.svg"
              alt="Kiki African Taste"
              width={50}
              height={48}
              className="object-contain rounded-4xl"
            />
            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8 text-black">
              <Link
                href="/"
                className="text-sm font-bold tracking-widest uppercase hover:text-[#c9a96e]"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-sm font-bold tracking-widest uppercase hover:text-[#c9a96e]"
              >
                Products
              </Link>
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="flex items-center gap-2">
                {searchOpen && (
                  <input
                    autoFocus
                    type="text"
                    placeholder="Search products..."
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-black placeholder-black/50 text-sm rounded-full px-4 py-1.5 w-40 md:w-64 outline-none focus:border-[#c9a96e]"
                  />
                )}
                <button
                  onClick={() => setSearchOpen(!searchOpen)}
                  className="text-black hover:text-[#c9a96e]"
                >
                  {searchOpen ? <X size={20} /> : <Search size={20} />}
                </button>
              </div>

              {/* Cart */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative text-black hover:text-[#c9a96e] transition-colors"
                aria-label="Open cart"
              >
                <ShoppingCart size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#c9a96e] text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Hamburger */}
              <button className="md:hidden text-black" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={26} />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/30 z-40 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-[80%] sm:w-1/2 bg-white z-50 md:hidden text-black transform transition-transform duration-300 ease-in-out ${mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="h-full flex flex-col">
            <div className="flex justify-end p-6">
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={28} />
              </button>
            </div>
            <div className="flex flex-col items-start px-8 gap-8 mt-6 flex-1">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'Products' },
              ].map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-black text-xl uppercase tracking-widest hover:text-[#c9a96e]"
                >
                  {label}
                </Link>
              ))}
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  setCartOpen(true)
                }}
                className="text-black text-xl uppercase tracking-widest hover:text-[#c9a96e] flex items-center gap-2"
              >
                Cart{' '}
                {cartCount > 0 && (
                  <span className="text-sm bg-[#c9a96e] text-white rounded-full px-2">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
            <div className="p-6">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center bg-[#c9a96e] text-black font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-black hover:text-white transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </Container>

      {/* Cart Sheet */}
      <Sheet open={cartOpen} onOpenChange={setCartOpen}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-md flex flex-col p-0"
          showCloseButton={false}
        >
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <div className="flex items-center justify-between">
              <SheetTitle className="text-2xl font-bold tracking-widest uppercase">Cart</SheetTitle>
              <button
                onClick={() => setCartOpen(false)}
                className="text-gray-400 hover:text-black transition"
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>
          </SheetHeader>

          {/* Items */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400 py-20">
                <ShoppingCart size={48} strokeWidth={1} />
                <p className="text-sm tracking-wide">Your cart is empty</p>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-sm text-[#c9a96e] hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex gap-4 border-b pb-6">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                    {item.detail && <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>}

                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="px-3 py-1.5 text-gray-500 hover:text-black transition"
                          aria-label="Decrease"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="px-2 text-sm font-medium w-6 text-center">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="px-3 py-1.5 text-gray-500 hover:text-black transition"
                          aria-label="Increase"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition ml-auto"
                        aria-label="Remove item"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">
                      £{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {cartItems.length > 0 && (
            <SheetFooter className="px-6 pt-4 pb-6 border-t bg-white space-y-4">
              <div className="flex items-center justify-between w-full">
                <span className="text-xs tracking-widest uppercase text-gray-500">Subtotal</span>
                <span className="text-lg font-bold text-gray-900">£{subtotal.toFixed(2)}</span>
              </div>
              <p className="text-xs text-center text-gray-400 w-full">
                Pickup is free. No shipping costs.
              </p>
              <Link
                href="/checkout"
                onClick={() => setCartOpen(false)}
                className="block w-full text-center bg-black text-white font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-[#c9a96e] hover:text-black transition"
              >
                Check Out
              </Link>
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>
    </>
  )
}

export default Header
