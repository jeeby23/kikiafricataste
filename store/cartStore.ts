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
  pricingType?: 'FIXED' | 'PER_KG'
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

          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      totalPrice: i.totalPrice + item.price, // ✅ only price increases
                    }
                  : i
              ),
            }
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                qty: 1,
                totalPrice: item.price,
              },
            ],
          }
        }),

      updateQty: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              i.id === id
                ? {
                    ...i,
                    qty: Math.max(1, i.qty + delta),
                    totalPrice: Math.max(0, i.totalPrice + i.price * delta),
                  }
                : i
            )
            .filter((i) => i.qty > 0),
        })),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== id),
        })),

      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'kiki-cart',
    }
  )
)