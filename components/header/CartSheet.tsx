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
import { toast } from 'sonner'

const GOAT_MEAT_ALLOWED_WEIGHTS = [2, 5, 10, 20]

function isGoatMeatItem(name: string, pricingType: string): boolean {
  const n = name.toLowerCase()
  return pricingType === 'PER_KG' && (n.includes('goat meat') || n.includes('goat'))
}

function getItemStepSize(name: string): number {
  const n = name.toLowerCase()
  if (n.includes('ponmo')) return 10
  if (n.includes('smoked abo') || n.includes('abo fish')) return 6
  if (n.includes('smoked catfish') || n.includes('catfish')) return 4
  if (n.includes('eja kika') || n.includes('smoked eja')) return 16
  return 1
}

export default function CartSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, updateQty, removeItem } = useCartStore()
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  const handleDecrease = (item: (typeof items)[0]) => {
    if (isGoatMeatItem(item.name, item.pricingType)) {
      const idx = GOAT_MEAT_ALLOWED_WEIGHTS.indexOf(item.qty)
      if (idx <= 0) {
        toast.error('Minimum order for Goat Meat is 2kg')
        return
      }
      updateQty(item.id, GOAT_MEAT_ALLOWED_WEIGHTS[idx - 1] - item.qty)
      return
    }

    const step = getItemStepSize(item.name)
    const next = item.qty - step
    if (next < step) {
      toast.error(`Minimum order is ${step} for this item`)
      return
    }
    updateQty(item.id, -step)
  }

  const handleIncrease = (item: (typeof items)[0]) => {
    if (isGoatMeatItem(item.name, item.pricingType)) {
      const idx = GOAT_MEAT_ALLOWED_WEIGHTS.indexOf(item.qty)
      if (idx >= GOAT_MEAT_ALLOWED_WEIGHTS.length - 1) {
        toast.error('Maximum order for Goat Meat is 20kg')
        return
      }
      updateQty(item.id, GOAT_MEAT_ALLOWED_WEIGHTS[idx + 1] - item.qty)
      return
    }

    const step = getItemStepSize(item.name)
    updateQty(item.id, step)
  }

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
            items.map((item) => {
              const isGoat = isGoatMeatItem(item.name, item.pricingType)
              const step = getItemStepSize(item.name)
              const atMin = isGoat
                ? GOAT_MEAT_ALLOWED_WEIGHTS.indexOf(item.qty) <= 0
                : item.qty <= step

              return (
                <div key={item.id} className="flex gap-4 border-b pb-6">
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image src={item.image} alt={item.name} fill sizes="96px" className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                    {item.detail && (
                      <p className="text-xs text-gray-400 mt-0.5">{item.detail}</p>
                    )}

                    {/* Goat meat: weight chips */}
                    {isGoat ? (
                      <div className="flex gap-1 mt-3 flex-wrap">
                        {GOAT_MEAT_ALLOWED_WEIGHTS.map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => updateQty(item.id, w - item.qty)}
                            className={`px-2 py-1 text-[10px] font-medium rounded-lg border transition-all ${
                              item.qty === w
                                ? 'bg-black text-white border-black'
                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                          >
                            {w}kg
                          </button>
                        ))}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition ml-auto"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ) : (
                      /* All other products: step-aware +/- */
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center border border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleDecrease(item)}
                            disabled={atMin}
                            className="px-3 py-1.5 text-gray-500 hover:text-black transition disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 text-sm font-medium w-8 text-center">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => handleIncrease(item)}
                            className="px-3 py-1.5 text-gray-500 hover:text-black transition"
                            aria-label="Increase quantity"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        {step > 1 && (
                          <span className="text-[10px] text-gray-400">×{step}</span>
                        )}

                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition ml-auto"
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">
                      £{(item.price * item.qty).toFixed(2)}
                    </p>
                  </div>
                </div>
              )
            })
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