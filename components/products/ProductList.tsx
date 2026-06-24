'use client'

import Image from 'next/image'
import Link from 'next/link'
import Container from '@/components/Container'
import { useProducts } from '@/features/products/products.query'

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(amount)
}

const ProductList = () => {
  const { data, isLoading, error } = useProducts(1, 20)
  const products = data?.products || []

  return (
    <section className="w-full py-16 md:py-24 bg-white">
      <Container>
        <div className="text-center mb-14">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase mb-3">
            Fresh & Authentic
          </p>
          <h2 className="text-black text-xl md:text-3xl font-light tracking-[0.2em] uppercase mb-4">
            Browse All Products
          </h2>
          <div className="w-12 h-[1px] bg-[#c9a96e] mx-auto" />
          <p className="text-gray-400 text-sm mt-4 max-w-sm mx-auto leading-relaxed">
            Every item is carefully prepared and packaged to bring you the richest African flavours.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {isLoading &&
            [...Array(8)].map((_, i) => (
              <div key={i} className="flex flex-col items-center text-center animate-pulse">
                <div className="relative w-full aspect-[3/4] bg-gray-100 mb-4 rounded-xl" />
                <div className="flex flex-col items-center gap-2 w-full">
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="h-3 bg-gray-100 rounded w-1/3" />
                </div>
              </div>
            ))}

          {error && !isLoading && (
            <p className="text-red-500 col-span-full text-center text-sm">
              Failed to load products. Please try again.
            </p>
          )}

          {!isLoading &&
            !error &&
            products.map((product) => {
              const primaryImage =
                product.images?.find((img) => img.isPrimary)?.url || '/placeholder.png'

              const price = product.pricingType === 'PER_KG' ? product.pricePerKg : product.price

              const priceLabel = product.pricingType === 'PER_KG' ? '/kg' : ''

              return (
                <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-50 mb-4 rounded-xl border border-gray-100">
                      <Image
                        src={primaryImage}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 50vw,(max-width: 768px) 50vw,(max-width: 1024px) 33vw,25vw"
             
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-xl" />
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="bg-white text-black text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                          View Product
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                      <h3 className="text-xs sm:text-sm uppercase tracking-[0.2em] text-black font-medium leading-snug">
                        {product.name}
                      </h3>

                      {product.category?.name && (
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                          {product.category.name}
                        </span>
                      )}

                      <span className="text-sm text-[#c9a96e] tracking-wide font-medium">
                        {price ? `${formatPrice(price)}${priceLabel}` : '—'}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
        </div>

        {!isLoading && !error && products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-300 text-5xl mb-4">◆</p>
            <p className="text-gray-500 text-sm tracking-wide">No products available right now.</p>
            <p className="text-gray-400 text-xs mt-1">
              Check back soon — new stock arrives regularly.
            </p>
          </div>
        )}

        {!isLoading && products.length > 0 && (
          <div className="text-center mt-16">
            <div className="w-12 h-[1px] bg-gray-200 mx-auto mb-4" />
            <p className="text-gray-400 text-xs tracking-[0.3em] uppercase">
              Sourced with care · Packed with love
            </p>
          </div>
        )}
      </Container>
    </section>
  )
}

export default ProductList
