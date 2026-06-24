"use client";

import * as React from "react";
import Image from "next/image";
import Autoplay from "embla-carousel-autoplay";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Bokor } from "next/font/google";

const bokorFont = Bokor({
  subsets: ["latin"],
  weight: "400",
});

const slides = [
  { src: "/kiki-fish-3.webp", alt: "Smoked dried fish" },
  { src: "/kiki-goatmeat.webp", alt: "Fresh goat meat" },
  { src: "/kiki-fish-01.webp", alt: "Dried stockfish" },
  { src: "/kiki-ponmo-white-05.webp", alt: "Ponmo" },
];

const Hero = () => {
  const plugin = React.useRef(
    Autoplay({ delay: 3500, stopOnInteraction: false })
  );

  return (
    <section className="relative w-full h-[480px] md:h-[580px] overflow-hidden">
      <Carousel
        plugins={[plugin.current]}
        opts={{ loop: true }}
        className="absolute inset-0 w-full h-full"
      >
        <CarouselContent className="h-full ml-0">
          {slides.map((slide, i) => (
            <CarouselItem key={i} className="pl-0 relative w-full h-[480px] md:h-[580px]">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority={i === 0}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="absolute inset-0 bg-black/50 z-10" />

      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-6">
        <p className="text-[#c9a96e] text-xs md:text-sm tracking-[0.3em] uppercase mb-3 flex items-center gap-2">
          <span>◆</span>
          <span>Welcome</span>
          <span>◆</span>
        </p>

        <h1 className={`${bokorFont.className} text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-wide uppercase leading-tight`}>
          Kiki African Taste
        </h1>

        <p className="text-white/80 mt-3 max-w-xs sm:max-w-sm md:max-w-md text-xs sm:text-sm md:text-base leading-relaxed">
          We sell fresh African taste essentials including smoked fish, catfish,
          ponmo, and goat meat — bringing rich, authentic home flavors straight
          to you.
        </p>

        <div className="mt-4">
          <Badge
            variant="secondary"
            className="border-2 border-white/70 shadow-2xl text-xs md:text-sm"
          >
            <span>◆</span>
            Real authentic African taste
            <span>◆</span>
          </Badge>
        </div>
      </div>

    </section>
  );
};

export default Hero;