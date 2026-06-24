'use client'

import Image from 'next/image'

export default function ProductGallery({
  images,
  activeImage,
  setActiveImage,
  productName,
}: any) {
  const activeUrl = images[activeImage]?.url || '/placeholder.png'

  return (
    <div className="flex flex-col gap-3">
      <div className="relative w-full h-[400px] md:h-[500px]">
        <Image
          src={activeUrl}
          alt={images[activeImage]?.altText || productName}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover rounded-md"
      
        />
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 flex-wrap mt-1">
          {images.map((img: any, i: number) => (
            <button
              key={img.id}
              onClick={() => setActiveImage(i)}
              className={`relative w-20 h-20 rounded overflow-hidden ${
                activeImage === i
                  ? 'ring-2 ring-black scale-105'
                  : 'opacity-60 hover:opacity-90'
              }`}
            >
              <Image src={img.url} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}