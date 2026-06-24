'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Button } from '@/components/ui/button'
import Container from '@/components/Container'

gsap.registerPlugin(ScrollTrigger)

const StoreInfo = () => {
  // ❌ removed TypeScript generics (THIS fixes your crash)
  const sectionRef = useRef(null)
  const bgRef = useRef(null)
  const contentRef = useRef(null)

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current || !contentRef.current) return

    const ctx = gsap.context(() => {
      // =========================
      // BACKGROUND (BOUNCE + PARALLAX IN/OUT)
      // =========================
      gsap.fromTo(
        bgRef.current,
        {
          scale: 1.2,
          opacity: 0.6,
        },
        {
          scale: 1,
          opacity: 1,
          duration: 1.4,
          ease: 'back.out(1.6)', // bounce IN
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 1.5,
            toggleActions: 'play reverse play reverse', // bounce OUT on scroll back
          },
        },
      )

      // =========================
      // CONTENT CARD (BOUNCE IN/OUT)
      // =========================
      gsap.fromTo(
        contentRef.current,
        {
          opacity: 0,
          y: 120,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.2,
          ease: 'back.out(1.7)', // strong bounce
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            end: 'bottom 30%',
            toggleActions: 'play reverse play reverse', // bounce OUT too
          },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className="relative w-full">
      <div className="bg-white h-10" />

      <div className="relative w-full h-[500px] md:h-[600px] lg:h-[650px] overflow-hidden flex items-center">
        <div ref={bgRef} className="absolute inset-0 -z-10">
          <Image
            src="/meat-spanish-market.webp"
            alt="Kiki African Taste Premium Meats"
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <Container className="h-full flex items-center relative z-10">
          <div
            ref={contentRef}
            className="bg-white text-neutral-800 p-8 md:p-12 w-full max-w-md md:max-w-lg shadow-2xl border border-neutral-100 flex flex-col gap-6"
          >
            <div>
              <h2 className="text-2xl md:text-3xl font-light tracking-widest text-neutral-900 uppercase mb-4">
                Our Store
              </h2>
              <p className="text-sm md:text-base text-neutral-600 leading-relaxed tracking-wide">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat laboriosam iste,
                reiciendis obcaecati possimus commodi!
              </p>
            </div>

            <div className="border-t border-neutral-100 pt-4">
              <p className="text-sm md:text-base text-neutral-700 tracking-wide">
                <span className="font-medium">Mon - Sat</span>, 9.00am - 5.00pm
              </p>
            </div>

            <div className="flex flex-col gap-2 border-t border-neutral-100 pt-4 text-sm md:text-base text-neutral-600 tracking-wide">
              <p>
                Call or WhatsApp{' '}
                <Link
                  href="https://wa.me/2349039376252"
                  className="hover:text-black font-medium transition-colors"
                  target="_blank"
                >
                  +234 903 937 6252
                </Link>
              </p>

              <p>
                WhatsApp{' '}
                <Link
                  href="https://wa.me/2349121784360"
                  className="hover:text-black font-medium transition-colors"
                  target="_blank"
                >
                  +234 912 178 4360
                </Link>{' '}
                <span className="text-neutral-400">(Asoebi)</span>
              </p>
            </div>

            <div className="pt-2">
              <Button
                asChild
                className="bg-black hover:bg-neutral-800 text-white rounded-none uppercase text-xs tracking-[0.2em] font-semibold px-6 py-5 transition-all w-full"
              >
                <Link href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">
                  Get Directions
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </div>
    </section>
  )
}

export default StoreInfo
