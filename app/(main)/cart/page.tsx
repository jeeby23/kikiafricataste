'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ArrowLeft, ShoppingCart } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { calculateDeliveryFee } from '@/lib/format'
export default function CartPage() {
  const { items, updateQty, removeItem, clearCart } = useCartStore()

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0)

  const totalWeightKg = items
    .filter((item) => item.pricingType === 'PER_KG')
    .reduce((sum, item) => sum + item.qty, 0)

  const deliveryFeePence = calculateDeliveryFee(totalWeightKg)
  const deliveryFee = deliveryFeePence / 100

  const total = subtotal + deliveryFee

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
        <ShoppingCart size={64} strokeWidth={1} className="text-gray-300 mb-6" />
        <h2 className="text-3xl font-bold mb-3">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link
          href="/products"
          className="bg-black text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#c9a96e] hover:text-black transition"
        >
          Start Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 md:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-gray-500 hover:text-black transition"
            >
              <ArrowLeft size={18} /> Continue Shopping
            </Link>
            <h1 className="text-4xl font-bold tracking-tight mt-3">CART</h1>
            <p className="text-sm text-gray-400 mt-1">
              {items.reduce((s, i) => s + i.qty, 0)} item
              {items.reduce((s, i) => s + i.qty, 0) !== 1 ? 's' : ''}
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 transition"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Items */}
          <div className="lg:col-span-7 space-y-8">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 border-b pb-8">
                <div className="w-28 h-28 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg truncate">{item.name}</h3>
                  {item.detail && <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>}
                  <p className="text-sm text-gray-500 mt-1">£{item.price.toFixed(2)} each</p>

                  <div className="flex items-center gap-4 mt-4">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="px-3 py-2 hover:bg-gray-100 transition"
                        aria-label="Decrease"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 font-medium text-sm">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="px-3 py-2 hover:bg-gray-100 transition"
                        aria-label="Increase"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-300 hover:text-red-500 transition flex items-center gap-1 text-sm"
                      aria-label="Remove"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-lg">£{(item.price * item.qty).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 sticky top-24">
              <h2 className="font-bold text-xl mb-6">Order Summary</h2>

              <div className="flex justify-between py-4 border-b">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">£{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between py-4 border-b">
                <span className="text-gray-600">Shipping</span>

                <span className="font-semibold">
                  {totalWeightKg === 0 ? '—' : `£${deliveryFee.toFixed(2)}`}
                </span>
              </div>

              {totalWeightKg > 0 && (
                <p className="text-xs text-gray-500 py-2 border-b">
                  Based on {totalWeightKg.toFixed(1)}kg total weight
                </p>
              )}

              <div className="flex justify-between py-6 text-lg">
                <span className="font-bold">Total</span>
                <span className="font-bold">£{total.toFixed(2)}</span>
              </div>

              <Link href="/checkout">
                <Button className="w-full bg-black hover:bg-[#c9a96e] hover:text-black text-white py-7 text-base font-bold tracking-widest rounded-xl">
                  PROCEED TO CHECKOUT
                </Button>
              </Link>

              <p className="text-xs text-center text-gray-500 mt-6">
                Pickup available in Brixton Market. <br />
                Orders usually ready within 2–4 hours.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
