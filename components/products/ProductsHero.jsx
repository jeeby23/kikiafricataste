import Image from 'next/image'
import Container from '@/components/Container'

const ProductsHero = () => {
  return (
    <section className="relative w-full h-[250px] md:h-[350px] lg:h-[500px] overflow-hidden flex items-center z-0">
      
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/street-market.webp"
          alt="Kiki African Taste Products"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />

        {/* Overlay (FIXED: no click blocking) */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-none" />
      </div>

      {/* Centered Text */}
      <Container className="relative z-20 flex items-center justify-center text-center">
        <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-light tracking-[0.35em] uppercase">
          Products
        </h1>
      </Container>

    </section>
  )
}

export default ProductsHero