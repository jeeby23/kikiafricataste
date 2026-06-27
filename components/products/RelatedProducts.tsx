'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRelatedProducts } from '@/features/products/products.query'

// ─── Skeleton card ─────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="relative h-40 w-full bg-gray-100 rounded-xl" />
      <div className="mt-3 h-3.5 bg-gray-100 rounded w-3/4 mx-auto" />
      <div className="mt-1.5 h-3 bg-gray-100 rounded w-1/2 mx-auto" />
    </div>
  )
}

// ─── Single product card ────────────────────────────────────────────────────────
function ProductCard({ product }: { product: import('@/types/products.types').Product }) {
  const primaryImage = product.images?.find((i) => i.isPrimary) ?? product.images?.[0]

  const priceLabel =
    product.pricingType === 'PER_KG'
      ? `£${product.pricePerKg?.toFixed(2)}/kg`
      : `£${product.price?.toFixed(2)}`

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block"
      prefetch={false}
    >
      {/* Image */}
      <div className="relative h-40 w-full overflow-hidden rounded-xl bg-gray-100">
        {primaryImage ? (
          <Image
            src={primaryImage.url}
            alt={primaryImage.altText ?? product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
            No image
          </div>
        )}
      </div>

      {/* Info */}
      <div className="mt-3 text-center">
        <p className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors truncate">
          {product.name}
        </p>
        <p className="text-xs text-gray-500 mt-0.5">{priceLabel}</p>
      </div>
    </Link>
  )
}

// ─── Main component ─────────────────────────────────────────────────────────────
interface RelatedProductsProps {
  /** Current product's slug — used as the API key */
  slug: string
  limit?: number
}

export default function RelatedProducts({ slug, limit = 4 }: RelatedProductsProps) {
  const { data: related, isLoading, isError } = useRelatedProducts(slug, limit)

  // Don't render the section at all if there's nothing to show
  if (!isLoading && (!related || related.length === 0)) return null

  return (
    <div className="mt-20">
      <h2 className="text-xl font-semibold mb-6">Related Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {isLoading &&
          [...Array(limit)].map((_, i) => <SkeletonCard key={i} />)}

        {isError && (
          <p className="col-span-4 text-sm text-gray-400">
            Could not load related products.
          </p>
        )}

        {!isLoading &&
          !isError &&
          related?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
      </div>
    </div>
  )
}