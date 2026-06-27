'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  image: string
  price: number
  qty: number
  totalPrice: number
  detail?: string
  pricingType: 'FIXED' | 'PER_KG'   // ← This must be saved
}

interface CartState {
  items: CartItem[]
  addItem: (item: CartItem) => void
  updateQty: (id: string, delta: number) => void
  removeItem: (id: string) => void
  clearCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)

          const newItem = {
            ...item,
          pricingType: item.pricingType,   // ← Ensure it's always set
            qty: item.qty || 1,
            totalPrice: (item.price || 0) * (item.qty || 1),
          }

          if (existing) {
            const newQty = existing.qty + newItem.qty
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, qty: newQty, totalPrice: newQty * i.price }
                  : i
              ),
            }
          }

          return {
            items: [...state.items, newItem],
          }
        }),

      updateQty: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((i) => {
              if (i.id === id) {
                const newQty = Math.max(1, i.qty + delta)
                return {
                  ...i,
                  qty: newQty,
                  totalPrice: newQty * i.price,
                }
              }
              return i
            })
            .filter((i) => i.qty > 0),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'kiki-cart' }
  )
)