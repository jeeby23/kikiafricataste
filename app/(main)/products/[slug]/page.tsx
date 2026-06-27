'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useProduct } from '@/features/products/products.query'
import { useCartStore } from '@/store/cartStore'
import ProductSkeleton from '@/components/products/ProductSkeleton'
import ProductGallery from "@/components/products/ ProductGallery"
import ProductInfo from '@/components/products/ProductInfo'
import RelatedProducts from '@/components/products/RelatedProducts'
import { toast } from 'sonner'
export default function Page() {
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

  const { data: product, isLoading } = useProduct(slug || '')
  const addItem = useCartStore((s) => s.addItem)

  const [qty, setQty] = useState(1) // This is in KG for PER_KG products
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  if (isLoading) return <ProductSkeleton />
  if (!product) return <div className="min-h-screen flex items-center justify-center text-gray-400">Product not found</div>

  const images = product.images || []
  const isPerKg = product.pricingType === 'PER_KG'

  const price = isPerKg ? (product.pricePerKg ?? 0) : (product.price ?? 0)
  const formattedPrice = isPerKg ? `£${price.toFixed(2)}/kg` : `£${price.toFixed(2)}`

  const inStock = isPerKg 
    ? (product.stockKg ?? 0) > 0 
    : (product.stockQty ?? 0) > 0

  const handleAddToCart = () => {
  addItem({
    id: product.id,
    name: product.name,
    image: images[0]?.url || '/placeholder.png',
    price,
    qty: qty,                   
    pricingType: product.pricingType || 'FIXED',   
    totalPrice: price * qty,
    detail: isPerKg ? `${qty} kg` : `${qty} pcs`,
  })

 toast.success('Added to cart', {
    id: `cart-${product.id}`,        // ← Add this line
    description: `${product.name} (${qty}${isPerKg ? 'kg' : ' items'}) added successfully`,
  })

  setAdded(true)
  setTimeout(() => setAdded(false), 2000)
}
  return (
    <div className="bg-white text-black pt-16">
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 items-start">
          <div className="md:col-span-7 lg:col-span-6">
            <ProductGallery images={images} activeImage={activeImage} setActiveImage={setActiveImage} productName={product.name} />
          </div>

          <div className="md:col-span-5 lg:col-span-5 md:sticky md:top-24 self-start">
            <ProductInfo
              product={product}
              price={price}
              formattedPrice={formattedPrice}
              qty={qty}
              setQty={setQty}
              inStock={inStock}
              handleAddToCart={handleAddToCart}
              added={added}
            />
          </div>
        </div>
      </section>

      {/* ── Description + How to use ── */}
      <section className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20">

            {/* Description */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#c9a96e] mb-4">
                About this product
              </h2>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 leading-snug">
                {product.name}
              </h3>
              <p className="text-gray-600 text-[15px] leading-relaxed">
                {product.description || 'No description available for this product.'}
              </p>

              {/* Quick facts */}
              <div className="mt-8 grid grid-cols-2 gap-4">
                {product.category && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Category</p>
                    <p className="text-sm font-medium text-gray-800 capitalize">{product.category.name}</p>
                  </div>
                )}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Pricing</p>
                  <p className="text-sm font-medium text-gray-800">
                    {product.pricingType === 'PER_KG' ? 'Sold by weight (kg)' : 'Fixed price'}
                  </p>
                </div>
                {product.pricingType === 'PER_KG' && product.minWeightKg ? (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Min. order</p>
                    <p className="text-sm font-medium text-gray-800">{product.minWeightKg} kg</p>
                  </div>
                ) : null}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-1">Availability</p>
                  <p className={`text-sm font-medium ${inStock ? 'text-emerald-600' : 'text-red-500'}`}>
                    {inStock ? 'In stock' : 'Out of stock'}
                  </p>
                </div>
              </div>
            </div>

            {/* How to use */}
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-[#c9a96e] mb-4">
                How to use
              </h2>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4 leading-snug">
                Serving &amp; preparation
              </h3>

              <ol className="space-y-5">
                {[
                  {
                    step: '01',
                    title: 'Store correctly',
                    body: 'Keep refrigerated or frozen immediately on arrival. Use fresh portions within 2–3 days; freeze the rest for up to 3 months.',
                  },
                  {
                    step: '02',
                    title: 'Prepare your ingredients',
                    body: 'Rinse under cold water if desired. Season generously with your favourite African spices — iru (locust bean), uziza, or crayfish all pair beautifully.',
                  },
                  {
                    step: '03',
                    title: 'Cook with confidence',
                    body: 'Works perfectly in soups, stews, pepper soups, and grills. Simmer low and slow for depth of flavour, or grill over high heat for a charred finish.',
                  },
                  {
                    step: '04',
                    title: 'Serve & enjoy',
                    body: 'Pair with eba, pounded yam, jollof rice, or fufu. Best enjoyed fresh and shared.',
                  },
                ].map(({ step, title, body }) => (
                  <li key={step} className="flex gap-4">
                    <span className="text-[11px] font-bold text-[#c9a96e] mt-0.5 shrink-0 w-6">{step}</span>
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">{title}</p>
                      <p className="text-[14px] text-gray-500 leading-relaxed">{body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── Related products ── */}
      <section className="border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <RelatedProducts slug={product.slug} limit={4} />
        </div>
      </section>

    </div>
  )
}