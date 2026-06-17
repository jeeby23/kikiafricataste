"use client";

import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: 1,
    name: "ponmo",
    slug: "ponmo",
    image: "/kiki-ponmo-white-05.webp",
    label: "SPECIAL OFFER",
  },
  {
    id: 2,
    name: "abo",
    slug: "abo",
    image: "/kiki-fish-3.webp",
    label: "SPECIAL OFFER",
  },
  {
    id: 3,
    name: "goat meat",
    slug: "goat-meat",
    image: "/kiki-goatmeat.webp",
    label: "SPECIAL OFFER",
  },
  {
    id: 4,
    name: "smoked panla",
    slug: "smoked-panla",
    image: "/kiki-fish-01.webp",
    label: "SPECIAL OFFER",
  },
  {
    id: 5,
    name: "smoked catfish",
    slug: "smoked-catfish",
    image: "/kiki-cafish-02.webp",
    label: "SPECIAL OFFER",
  },
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold tracking-wide uppercase text-black mb-2">
            KIKI AFRICAN TASTE
          </h2>
          <div className="w-24 h-[2px] bg-[#c9a96e] mx-auto"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 md:gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              {/* Image Container */}
              <div className="relative h-64 w-full overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              </div>

              {/* Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-semibold uppercase tracking-widest text-black mb-4">
                  {product.name}
                </h3>

                <div className="inline-block px-6 py-2 bg-[#fef9c3] text-black text-xs font-medium rounded-full tracking-wider">
                  {product.label}
                </div>

                <Link
                  href={`/products/${product.name.toLowerCase().replace(/\s+/g, '-')}`}
                  className="mt-6 block text-[#c9a96e] hover:text-amber-700 font-medium text-sm tracking-widest uppercase transition-colors"
                >
                  Shop Now →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Dots Indicator (like in screenshot) */}
        <div className="flex justify-center mt-10 gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                i === 0 ? "bg-black scale-125" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;