'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import Container from '@/components/Container'
import { useProduct } from '@/features/products/products.query'
import { useCartStore } from '@/store/cartStore'

import ProductSkeleton from '@/components/products/ProductSkeleton'
import ProductGallery from '@/components/products/ ProductGallery'
import ProductInfo from '@/components/products/ProductInfo'
import RelatedProducts from '@/components/products/RelatedProducts'

export default function Page() {
  const params = useParams()
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug

  const { data: product, isLoading } = useProduct(slug || '')
  const addItem = useCartStore((s) => s.addItem)

  const [qty, setQty] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [added, setAdded] = useState(false)

  if (isLoading) return <ProductSkeleton />
  if (!product) return <div>Not found</div>

  const images = product.images || []

  const price = product.price ?? 0
  const formattedPrice = `£${price}`

  const inStock = true

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: price,
      qty: 1, 
      totalPrice: price, 
      image: images[0]?.url || '/placeholder.png',
      detail:
        product.pricingType === 'PER_KG'
          ? 'per kg'
          : product.stockQty
            ? `${product.stockQty} in stock`
            : undefined,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="bg-white text-black">
      <Container className="py-22">
        <div className="grid md:grid-cols-2 gap-12">
          <ProductGallery
            images={images}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            productName={product.name}
          />

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

        <RelatedProducts />
      </Container>
    </div>
  )
}
