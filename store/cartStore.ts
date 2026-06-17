import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  image: string
  price: number // in GBP £
  qty: number
  detail?: string
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
      items: [
        // seed data — remove when wiring real products
        { id: '1', name: 'Catfish (Dried)', image: '/kiki-fish-01.webp', price: 4.5, qty: 1, detail: '6 pieces / pack' },
        { id: '2', name: 'Goat Meat', image: '/kiki-goatmeat.webp', price: 9.99, qty: 2, detail: 'per kg' },
      ],

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + item.qty } : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      updateQty: (id, delta) =>
        set((state) => ({
          items: state.items
            .map((i) => (i.id === id ? { ...i, qty: i.qty + delta } : i))
            .filter((i) => i.qty > 0),
        })),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      clearCart: () => set({ items: [] }),
    }),
    { name: 'kiki-cart' }
  )
)