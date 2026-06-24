'use client'

import Image from 'next/image'
import Container from '@/components/Container'
import { Badge } from '../ui/badge'

const ProductsHero = () => {
  return (
    <section className="relative w-full h-[280px] md:h-[380px] lg:h-[520px] overflow-hidden flex items-center pt-16">
      <div className="absolute inset-0 z-0">
        <Image
          src="/kiki-product-img.webp"
          alt="Kiki African Taste Products"
          fill
          sizes="100vw"
        
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/70 pointer-events-none" />
      </div>
      <Container className="relative z-20 flex flex-col items-center justify-center text-center gap-4 px-4">
        <Badge>
          <p className="text-[#c9a96e] text-xs md:text-sm tracking-[0.4em] uppercase flex items-center gap-2">
            <span>◆</span>
            <span>Authentic African Taste</span>
            <span>◆</span>
          </p>
        </Badge>

        <h1 className="text-white text-xl md:text-6xl lg:text-7xl font-light tracking-[0.3em] uppercase leading-tight">
          Our Products
        </h1>

        <div className="w-16 h-[1px] bg-[#c9a96e]" />

        <p className="text-white/70 text-sm md:text-base max-w-md leading-relaxed tracking-wide">
          Handpicked smoked fish, catfish, ponmo, goat meat and more — straight from our kitchen to
          yours.
        </p>
      </Container>
    </section>
  )
}

export default ProductsHero
