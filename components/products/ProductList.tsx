"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";

const PRODUCTS = [
  {
    id: 1,
    name: "Ponmo",
    price: 15000,
    image: "/kiki-ponmo-white-05.webp",
    slug: "ponmo",
  },
  {
    id: 2,
    name: "Abo",
    price: 35000,
    image: "/kiki-fish-3.webp",
    slug: "abo",
  },
  {
    id: 3,
    name: "Goat Meat",
    price: 35000,
    image: "/kiki-goatmeat.webp",
    slug: "goat-meat",
  },
  {
    id: 4,
    name: "Smoked Panla",
    price: 20000,
    image: "/kiki-fish-01.webp",
    slug: "smoked-panla",
  },
  {
    id: 5,
    name: "Smoked Catfish",
    price: 25000,
    image: "/kiki-cafish-02.webp",
    slug: "smoked-catfish",
  },
];

const formatPrice = (amount: number) => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
  }).format(amount);
};

const ProductList = () => {
  return (
    <section className="w-full py-16 bg-white">
      <Container>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">

          {PRODUCTS.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.slug}`}
              className="group block"
            >
              <div className="flex flex-col items-center text-center">

                {/* Image */}
                <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-100 mb-4 rounded-lg">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Info */}
                <div className="flex flex-col items-center gap-1">
                  <h3 className="text-sm uppercase tracking-[0.2em] text-black">
                    {product.name}
                  </h3>

                  <span className="text-sm text-gray-600 tracking-wide">
                    {formatPrice(product.price)}
                  </span>
                </div>

              </div>
            </Link>
          ))}

        </div>

      </Container>
    </section>
  );
};

export default ProductList;