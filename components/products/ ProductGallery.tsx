'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface GalleryImage {
  id: string
  url: string
  altText?: string
}

interface ProductGalleryProps {
  images: GalleryImage[]
  activeImage: number
  setActiveImage: (i: number) => void
  productName: string
}

export default function ProductGallery({
  images,
  activeImage,
  setActiveImage,
  productName,
}: ProductGalleryProps) {
  const activeUrl = images[activeImage]?.url || '/placeholder.png'
  const activeAlt = images[activeImage]?.altText || productName

  const prev = () => setActiveImage((activeImage - 1 + images.length) % images.length)
  const next = () => setActiveImage((activeImage + 1) % images.length)

  return (
    <div className="flex flex-col gap-4">

      {/* Main image */}
      <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gray-50 group">
        <Image
          src={activeUrl}
          alt={activeAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
        />

        {/* Prev / Next arrows — only if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm text-gray-700 hover:bg-white transition opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm text-gray-700 hover:bg-white transition opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === activeImage ? 'bg-white w-4' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {images.map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(i)}
              className={`relative w-[72px] h-[72px] rounded-xl overflow-hidden border-2 transition-all duration-200 ${
                activeImage === i
                  ? 'border-[#c9a96e] shadow-sm'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              <Image src={img.url} alt={img.altText || ''} fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}