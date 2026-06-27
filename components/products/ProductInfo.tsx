'use client'

import { ShoppingCart, Check, Minus, Plus } from 'lucide-react'
import { Product } from '@/types/products.types'

interface ProductInfoProps {
  product: Product
  price: number
  formattedPrice: string
  qty: number

  setQty: React.Dispatch<React.SetStateAction<number>>
  inStock: boolean
  handleAddToCart: () => void
  added: boolean
}

export default function ProductInfo({
  product,
  price,
  formattedPrice,
  qty,
  setQty,
  inStock,
  handleAddToCart,
  added,
}: ProductInfoProps) {
  const lineTotal = `£${(price * qty).toFixed(2)}`

  const isGoatMeat = product.name.toLowerCase().includes('goat meat')
  const presets = [2, 5, 10, 20]

  return (
    <div className="space-y-7">
      {product.category && (
        <p className="text-[11px] font-semibold uppercase tracking-widest text-[#c9a96e]">
          {product.category.name}
        </p>
      )}

      <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
        {product.name}
      </h1>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-gray-900">
          {isGoatMeat ? `£${(price * qty).toFixed(2)}` : formattedPrice}
        </span>
        {product.pricingType === 'PER_KG' && (
          <span className="text-sm text-gray-400">
            {isGoatMeat ? `for ${qty}kg (£${price.toFixed(2)}/kg)` : 'per kilogram'}
          </span>
        )}
      </div>

      {product.description && (
        <p className="text-gray-500 text-[14.5px] leading-relaxed line-clamp-3">
          {product.description}
        </p>
      )}

      <div className="border-t border-gray-100" />

      {isGoatMeat && (
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Select Weight Option
          </label>
          <div className="flex gap-2">
            {presets.map((weight) => (
              <button
                key={weight}
                type="button"
                onClick={() => setQty(weight)}
                className={`flex-1 py-2.5 px-4 text-xs font-medium rounded-xl border transition-all ${
                  qty === weight
                    ? 'bg-black text-white border-black shadow-sm'
                    : 'border-gray-200 text-gray-800 hover:bg-gray-50'
                }`}
              >
                {weight}kg
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Qty & Add selector row */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
          {product.pricingType === 'PER_KG' ? 'Adjust Weight (kg)' : 'Quantity'}
        </label>

        <div className="flex items-center gap-0">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-l-xl text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Decrease"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="w-14 h-11 flex items-center justify-center border-t border-b border-gray-200 text-sm font-semibold text-gray-900">
            {qty}
          </div>
          <button
            onClick={() => setQty((q) => q + 1)}
            className="w-11 h-11 flex items-center justify-center border border-gray-200 rounded-r-xl text-gray-600 hover:bg-gray-50 transition-colors"
            aria-label="Increase"
          >
            <Plus className="w-4 h-4" />
          </button>

          {!isGoatMeat && qty > 1 && (
            <span className="ml-4 text-sm text-gray-400">
              Total: <span className="font-semibold text-gray-700">{lineTotal}</span>
            </span>
          )}
        </div>
      </div>

      {/* Stock status */}
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-400'}`} />
        <span className={`text-sm font-medium ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>
          {inStock ? 'In stock — ready to ship' : 'Out of stock'}
        </span>
      </div>

      {/* Add to cart */}
      <button
       onClick={handleAddToCart}
        disabled={!inStock || added}
        className={`w-full h-14 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold tracking-wide transition-all duration-200 ${
          added
            ? 'bg-emerald-600 text-white'
            : inStock
              ? 'bg-black text-white hover:bg-[#c9a96e] hover:text-black'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        {added ? (
          <>
            <Check className="w-4 h-4" />
            Added to cart
          </>
        ) : (
          <>
            <ShoppingCart className="w-4 h-4" />
            Add to cart
          </>
        )}
      </button>

      {/* Trust note */}
      <p className="text-[11px] text-gray-400 text-center">
        🚚 Free delivery on orders over £10 · Secure checkout
      </p>
    </div>
  )
}
