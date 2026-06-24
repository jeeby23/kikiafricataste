'use client'

import { ShoppingCart } from 'lucide-react'
import { toast } from 'sonner'

export default function ProductInfo({
  product,
  price,
  formattedPrice,
  qty,
  setQty,
  inStock,
  handleAddToCart,
  added,
}: any) {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl md:text-4xl font-semibold">
        {product.name}
      </h1>

      <p className="text-xl">{formattedPrice}</p>

      <p className="text-gray-600 text-sm">
        {product.description}
      </p>

      <div className="flex items-center border w-fit">
        <button
          onClick={() => setQty((q: number) => Math.max(1, q - 1))}
        >
          -
        </button>
        <span className="px-4">{qty}</span>
        <button
          onClick={() => setQty((q: number) => q + 1)}
        >
          +
        </button>
      </div>

      {inStock ? (
        <p className="text-green-600 text-sm">● In stock</p>
      ) : (
        <p className="text-red-500 text-sm">● Out of stock</p>
      )}
      <button
        onClick={() => {
          handleAddToCart()

          toast.success('Added to cart 🛒', {
            description: `${product.name} added successfully`,
          })
        }}
        disabled={!inStock || added}
        className="w-full py-4 bg-black text-white flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <ShoppingCart size={18} />
        ADD TO CART
      </button>
    </div>
  )
}