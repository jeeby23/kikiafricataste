'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ShopByCategory = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !bgRef.current) return;

    const ctx = gsap.context(() => {
     
      gsap.to(bgRef.current, {
        scale: 1.12,           
        y: "-15%",             
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.2,        
        },
      });

      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="w-full bg-white pb-10 md:pb-24" />
      <section 
        ref={sectionRef}
        className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden flex items-center justify-center bg-white"
      >
        <div ref={bgRef} className="absolute inset-0 z-0">
          <Image
            src="/kiki-kika.webp"
            alt="African catfish"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/60" />
        </div>
        <div 
          ref={contentRef}
          className="relative z-10 flex flex-col items-center justify-center text-center px-4 gap-6"
        >
          <h2 className="text-white text-xl md:text-6xl lg:text-7xl font-light tracking-[0.3em] uppercase leading-tight">
            Shop By Category
          </h2>
          
          <Link
            href="/products"
            className="inline-block bg-[#c9a96e] text-black text-xs md:text-sm font-bold tracking-[0.3em] uppercase px-8 py-3 hover:bg-white transition-colors duration-300"
          >
            Shop Now
          </Link>
        </div>
      </section>
    </>
  );
};

export default ShopByCategory;