"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import axiosInstance from "@/lib/axios";

type Product = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  pricingType?: "FIXED" | "PER_KG";
  pricePerKg?: number;
  images: { url: string; isPrimary: boolean }[];
  category?: { name: string };
};

const formatPrice = (amount: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(amount);

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryFromUrl = searchParams.get("search") || "";

  const [search, setSearch] = useState(queryFromUrl);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProducts = async (query: string) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/public/product", {
        params: { search: query, page: 1, limit: 20 },
      });
      const data = res.data;
      if (Array.isArray(data?.data)) {
        setProducts(data.data);
      } else if (Array.isArray(data?.data?.products)) {
        setProducts(data.data.products);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error("Search failed:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearch(queryFromUrl);
    if (queryFromUrl.trim()) {
      fetchProducts(queryFromUrl);
    } else {
      setProducts([]);
    }
  }, [queryFromUrl]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = search.trim();
    if (!trimmed) return;
    router.push(`/search?search=${encodeURIComponent(trimmed)}`);
  };

  const getPrice = (product: Product) => {
    if (product.pricingType === "PER_KG" && product.pricePerKg) {
      return `${formatPrice(product.pricePerKg)}/kg`;
    }
    return product.price ? formatPrice(product.price) : "—";
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Hero search banner */}
      <div className="relative w-full bg-black pt-24 pb-16 overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)", backgroundSize: "32px 32px" }}
        />

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#c9a96e] text-xs tracking-[0.4em] uppercase mb-3 flex items-center justify-center gap-2">
            <span>◆</span><span>Kiki African Taste</span><span>◆</span>
          </p>
          <h1 className="text-white text-3xl md:text-5xl font-light tracking-[0.25em] uppercase mb-2">
            Search
          </h1>
          <p className="text-white/40 text-sm tracking-wide mb-8">
            Find your favourite African ingredients
          </p>

          {/* Search input */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search goat meat, catfish, ponmo..."
              className="w-full pl-14 pr-32 py-4 rounded-full bg-white text-gray-800 text-sm tracking-wide focus:outline-none focus:ring-2 focus:ring-[#c9a96e] shadow-xl"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black text-white text-xs tracking-widest uppercase px-5 py-2.5 rounded-full hover:bg-[#c9a96e] hover:text-black transition"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* Results section */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">

        {/* Results meta */}
        {queryFromUrl && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8 pb-6 border-b border-gray-100">
            <div>
              <p className="text-gray-400 text-xs tracking-widest uppercase mb-1">
                Search results
              </p>
              <p className="text-gray-800 text-lg">
                <span className="font-semibold">{products.length}</span> result{products.length !== 1 ? "s" : ""} for{" "}
                <span className="text-[#c9a96e] font-medium italic">"{queryFromUrl}"</span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="tracking-widest uppercase">All categories</span>
            </div>
          </div>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-100 rounded-2xl mb-3" />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && queryFromUrl && products.length === 0 && (
          <div className="text-center py-24">
            <p className="text-gray-200 text-6xl mb-6">◆</p>
            <p className="text-gray-600 text-lg font-light tracking-wide mb-2">
              No results for "{queryFromUrl}"
            </p>
            <p className="text-gray-400 text-sm mb-8">
              Try searching for catfish, goat meat, ponmo, or smoked fish.
            </p>
            <Link
              href="/products"
              className="inline-block bg-black text-white text-xs tracking-widest uppercase px-8 py-3 rounded-full hover:bg-[#c9a96e] hover:text-black transition"
            >
              Browse All Products
            </Link>
          </div>
        )}

        {/* No query yet */}
        {!loading && !queryFromUrl && (
          <div className="text-center py-24">
            <p className="text-gray-200 text-6xl mb-6">◆</p>
            <p className="text-gray-500 text-base font-light tracking-wide mb-2">
              What are you looking for?
            </p>
            <p className="text-gray-400 text-sm">
              Start typing above to discover our products.
            </p>

            {/* Popular searches */}
            <div className="mt-10">
              <p className="text-xs text-gray-300 uppercase tracking-widest mb-4">Popular searches</p>
              <div className="flex flex-wrap justify-center gap-2">
                {["Goat Meat", "Catfish", "Ponmo", "Smoked Fish", "Dried Fish"].map((term) => (
                  <button
                    key={term}
                    onClick={() => router.push(`/search?search=${encodeURIComponent(term)}`)}
                    className="px-4 py-1.5 border border-gray-200 rounded-full text-xs text-gray-500 hover:border-[#c9a96e] hover:text-[#c9a96e] transition tracking-wide"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Product grid */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
              {products.map((product) => {
                const primaryImage =
                  product.images?.find((img) => img.isPrimary) || product.images?.[0];

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group block"
                  >
                    <div className="flex flex-col">
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 rounded-2xl mb-4 border border-gray-100">
                        <Image
                          src={primaryImage?.url || "/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all duration-300 rounded-2xl" />

                        {/* View pill */}
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                          <span className="bg-white text-black text-[10px] tracking-widest uppercase px-4 py-1.5 rounded-full shadow-md whitespace-nowrap">
                            View Product
                          </span>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="text-center flex flex-col gap-1">
                        {product.category?.name && (
                          <span className="text-[10px] text-gray-400 uppercase tracking-widest">
                            {product.category.name}
                          </span>
                        )}
                        <h3 className="text-xs sm:text-sm uppercase tracking-[0.2em] text-black font-medium leading-snug">
                          {product.name}
                        </h3>
                        <span className="text-sm text-[#c9a96e] font-medium">
                          {getPrice(product)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Bottom tagline */}
            <div className="text-center mt-16">
              <div className="w-12 h-[1px] bg-gray-100 mx-auto mb-4" />
              <p className="text-gray-300 text-xs tracking-[0.3em] uppercase">
                Sourced with care · Packed with love
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}