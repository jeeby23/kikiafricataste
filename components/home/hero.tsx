import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Bokor } from 'next/font/google'

const bokorFont = Bokor({
  subsets:["latin"],
  weight:"400"
})
const Hero = () => {
  return (
    <section className="relative w-full h-[500px] md:h-[600px] flex overflow-hidden">
      {/* Left panel */}
      <div className="relative flex-1">
        <Image
          src="/kiki-fish-3.webp"
          alt="Smoked dried fish"
          fill
          sizes="750px"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Divider */}
      <div className="w-[3px] bg-[#c9a96e] z-10 flex-shrink-0" />

      {/* Center panel */}
      <div className="relative flex-[1.2]">
        <Image
          src="/kiki-goatmeat.webp"
          alt="Fresh goat meat"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />

        {/* Centered text overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4 z-10">
          {/* Small top text */}
          <p className="text-[#c9a96e] text-sm tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
            <span>◆</span>
            <span>Welcome</span>
            <span>◆</span>
          </p>

          {/* Main title */}
          <h1  className="text-white font-bold text-3xl md:text-4xl lg:text-5xl tracking-wide uppercase leading-tight `${bokorFont.className}`" >
            Kiki African Taste
          </h1>
          <p className="text-white/80 mt-3 max-w-md text-sm md:text-base leading-relaxed">
            We sell fresh African taste essentials including smoked fish, catfish, ponmo, and goat
            meat — bringing rich, authentic home flavors straight to you.
          </p>
          {/* 🔥 Badge under title */}
          <div className="mt-4">
            <Badge variant="secondary" className='border-2 border-gray-500 shadow-2xl'>Real authentic African taste</Badge>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="w-[3px] bg-[#c9a96e] z-10 flex-shrink-0" />

      {/* Right panel */}
      <div className="relative flex-1">
        <Image
          src="/kiki-fish-01.webp"
          alt="Dried stockfish"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
    </section>
  )
}

export default Hero
