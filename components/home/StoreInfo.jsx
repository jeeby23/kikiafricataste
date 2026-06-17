import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Container from '@/components/Container' // Imported your wrapper here

const StoreInfo = () => {
  return (
    // Section stays full width (w-full) so the background image stretches to the edges
    <section className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden flex items-center">
      
      {/* Background Image - untouched, safely full-bleed */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/meat-spanish-market.webp"
          alt="Kiki African Taste Premium Meats"
          fill
          sizes="100vw"
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* 
        Container wraps the card content to keep alignment consistent across your app.
        We pass 'h-full flex items-center' so the overlay aligns nicely on the Y-axis.
      */}
      <Container className="h-full flex items-center">
        {/* Info Card Overlay */}
        <div className="bg-white text-neutral-800 p-8 md:p-12 w-full max-w-md md:max-w-lg shadow-xl border border-neutral-100 flex flex-col gap-6 relative z-10">
          <div>
            <h2 className="text-2xl md:text-3xl font-light tracking-widest text-neutral-900 uppercase mb-4">
              Our Store
            </h2>
            <p className="text-sm md:text-base text-neutral-600 leading-relaxed tracking-wide">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat laboriosam iste, reiciendis obcaecati possimus commodi!
            </p>
          </div>

          {/* Store Hours */}
          <div className="border-t border-neutral-100 pt-4">
            <p className="text-sm md:text-base text-neutral-700 tracking-wide">
              <span className="font-medium">Mon - Sat</span>, 9.00am - 5.00pm
            </p>
          </div>

          {/* Contact Links */}
          <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4 text-sm md:text-base text-neutral-600 tracking-wide">
            <p>
              Call or WhatsApp{' '}
              <Link 
                href="https://wa.me/2349039376252" 
                className="hover:text-black font-medium transition-colors"
                target="_blank"
              >
                +234 9039376252
              </Link>
            </p>
            <p>
              WhatsApp{' '}
              <Link 
                href="https://wa.me/2349121784360" 
                className="hover:text-black font-medium transition-colors"
                target="_blank"
              >
                +234 9121784360
              </Link>{' '}
              <span className="text-neutral-400">( Asoebi )</span>
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <Button 
              asChild
              className="bg-black hover:bg-neutral-800 text-white rounded-none uppercase text-xs tracking-[0.2em] font-semibold px-6 py-5 transition-all"
            >
              <Link 
                href="https://www.google.com/maps/place/mafott+fabrics" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Get Directions
              </Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}

export default StoreInfo