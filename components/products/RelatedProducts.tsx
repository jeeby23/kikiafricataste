'use client'

import Image from 'next/image'
import Link from 'next/link'

export default function RelatedProducts() {
  const items = [
    { id: 1, name: 'Ponmo', slug: 'ponmo', image: '/kiki-ponmo-white-05.webp' },
    { id: 2, name: 'Abo', slug: 'abo', image: '/kiki-fish-3.webp' },
    { id: 3, name: 'Goat Meat', slug: 'goat-meat', image: '/kiki-goatmeat.webp' },
    { id: 4, name: 'Smoked Fish', slug: 'smoked-fish', image: '/kiki-fish-01.webp' },
  ]

  return (
    <div className="mt-20">
      <h2 className="text-xl font-semibold mb-6">Related Products</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {items.map((item) => (
          <Link key={item.id} href={`/products/${item.slug}`}>
            <div>
              <div className="relative h-40 w-full">
                <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 640px) 50vw, 25vw" />
              </div>
              <p className="text-center mt-2">{item.name}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}