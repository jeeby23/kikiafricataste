'use client'

import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingCart, Minus, Plus, Trash2 } from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetDescription,
} from '@/components/ui/sheet'
import { useCartStore } from '@/store/cartStore'

export default function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQty, removeItem } = useCartStore()

  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md flex flex-col p-0"
        showCloseButton={false}
      >
        <SheetHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-2xl font-bold tracking-widest uppercase text-black">
              Cart
            </SheetTitle>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black transition"
              aria-label="Close cart"
            >
              <X size={22} />
            </button>
          </div>
          <SheetDescription className="sr-only">
            View and manage items in your shopping cart, adjust quantities, or proceed to checkout.
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-gray-400 py-20">
              <ShoppingCart size={48} strokeWidth={1} />
              <p className="text-sm tracking-wide">Your cart is empty</p>

              <button onClick={onClose} className="text-sm text-[#c9a96e] hover:underline">
                <Link href="/products">Continue Shopping</Link>
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 border-b pb-6">
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{item.name}</p>

                  {item.detail && <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQty(item.id, -1)}
                        className="px-3 py-1.5 text-gray-500 hover:text-black transition"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} />
                      </button>

                      <span className="px-2 text-sm font-medium w-6 text-center">{item.qty}</span>

                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="px-3 py-1.5 text-gray-500 hover:text-black transition"
                        aria-label="Increase quantity"
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
        {items.length > 0 && (
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
              onClick={onClose}
              className="block w-full text-center bg-black text-white font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-[#c9a96e] hover:text-black transition"
            >
              Check Out
            </Link>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}
