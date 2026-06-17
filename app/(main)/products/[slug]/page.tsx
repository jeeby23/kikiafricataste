"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import Container from "@/components/Container";

const products = [
  {
    id: 1,
    name: "Ponmo",
    slug: "ponmo",
    image: "/kiki-ponmo-white-05.webp",
    price: 5000,
    description: "Fresh, clean ponmo ready for cooking.",
    howToConsume:
      "Wash thoroughly and cook with your soup of choice like egusi or ogbono.",
  },
  {
    id: 2,
    name: "Abo",
    slug: "abo",
    image: "/kiki-fish-3.webp",
    price: 4000,
    description: "Dried vegetable leaves used in African dishes.",
    howToConsume: "Soak in warm water before adding to soups.",
  },
  {
    id: 3,
    name: "Goat Meat",
    slug: "goat-meat",
    image: "/kiki-goatmeat.webp",
    price: 8000,
    description: "Premium fresh goat meat cuts.",
    howToConsume:
      "Season and cook thoroughly before adding to meals.",
  },
  {
    id: 4,
    name: "Smoked Panla",
    slug: "smoked-panla",
    image: "/kiki-fish-01.webp",
    price: 3500,
    description: "Smoked panla fish for rich flavor.",
    howToConsume:
      "Rinse lightly and add to soups or stews.",
  },
  {
    id: 5,
    name: "Smoked Catfish",
    slug: "smoked-catfish",
    image: "/kiki-cafish-02.webp",
    price: 6000,
    description: "Well smoked catfish with deep flavor.",
    howToConsume:
      "Break into pieces and add to pepper soup or stew.",
  },
];

export default function ProductDetails() {
  const params = useParams();
  const product = products.find((p) => p.slug === params.slug);

  const [qty, setQty] = useState(1);

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  const related = products
    .filter((p) => p.slug !== product.slug)
    .slice(0, 4);

  return (
    <div className="w-full bg-white text-black">
      <Container className="py-22">

        {/* TOP SECTION */}
        <div className="grid md:grid-cols-2 gap-12">

          {/* LEFT IMAGE */}
          <div className="relative w-full h-[400px] md:h-[500px]">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover rounded-md"
              priority
            />
          </div>

          {/* RIGHT DETAILS */}
          <div className="space-y-6">

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-semibold tracking-wide">
              {product.name}
            </h1>

            {/* Price */}
            <p className="text-xl font-medium">
              ₦{product.price.toLocaleString()}
            </p>

            {/* Fabric Description */}
            <div>
              <h3 className="font-semibold underline mb-2">
                Product Description
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Delivery */}
            <div>
              <h3 className="font-semibold underline mb-2">
                Delivery
              </h3>
              <p className="text-gray-600 text-sm">
                Delivery fee within Nigeria will be added at checkout.
              </p>
            </div>

            {/* Variant buttons (mock) */}
            <div className="flex gap-3">
              <button className="border px-4 py-2 text-sm">
                Default
              </button>
              <button className="border px-4 py-2 text-sm">
                Premium
              </button>
            </div>

            {/* Quantity */}
            <div>
              <p className="text-xs tracking-widest mb-2">
                QUANTITY
              </p>
              <div className="flex items-center border w-fit">
                <button
                  className="px-3 py-1"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                >
                  -
                </button>
                <span className="px-4">{qty}</span>
                <button
                  className="px-3 py-1"
                  onClick={() => setQty((q) => q + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Stock */}
            <p className="text-sm text-yellow-600">
              ● Low stock - 2 items left
            </p>

            {/* Add to Cart */}
            <button className="w-full bg-black text-white py-4 tracking-widest hover:bg-[#c9a96e] transition">
              ADD TO CART
            </button>
          </div>
        </div>

        {/* BOTTOM DESCRIPTION */}
        <div className="mt-20 max-w-3xl">
          <h2 className="text-xl font-semibold mb-3">
            How to Consume
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {product.howToConsume}
          </p>
        </div>

        {/* RELATED PRODUCTS */}
        <div className="mt-20">
          <h2 className="text-xl font-semibold mb-6">
            Related Products
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((item) => (
              <Link key={item.id} href={`/products/${item.slug}`}>
                <div className="group">
                  <div className="relative h-40 w-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition"
                    />
                  </div>
                  <p className="text-sm mt-2 text-center">
                    {item.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </Container>
    </div>
  );
}