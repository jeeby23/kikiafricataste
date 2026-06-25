'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef, useMemo } from 'react';
import { useProducts } from '@/features/products/products.query';
import { Bokor } from 'next/font/google';
import { useSearchStore } from '@/store/search.store';
import { useQueryClient } from '@tanstack/react-query';
import { getProducts } from '@/features/products/products.api';
import FeaturedProductsSkeleton from './FeaturedProductsSkeleton';

// ✅ GSAP
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ✅ shadcn pagination
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

gsap.registerPlugin(ScrollTrigger);

const bokorFont = Bokor({ subsets: ['latin'], weight: '400' });

const ITEMS_PER_PAGE = 4;

const FeaturedProducts = () => {
  const [page, setPage] = useState(1);
  const search = useSearchStore((s) => s.search);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, isFetching } = useProducts(
    page,
    ITEMS_PER_PAGE,
    search
  );

  const products = data?.products ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // ✅ Prefetch next page (FIXED KEY)
  useEffect(() => {
    if (page < totalPages) {
      queryClient.prefetchQuery({
        queryKey: ['products', page + 1, ITEMS_PER_PAGE, search],
        queryFn: () => getProducts(page + 1, ITEMS_PER_PAGE, search),
      });
    }
  }, [page, totalPages, search, queryClient]);

  // ✅ GSAP Animation
  useEffect(() => {
    if (isLoading || products.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, x: 80, scale: 0.95 },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.1,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [products, isLoading]);

  // ✅ Smart pagination (no overload)
  const visiblePages = useMemo(() => {
    const pages = [];
    for (let i = Math.max(1, page - 1); i <= Math.min(totalPages, page + 1); i++) {
      pages.push(i);
    }
    return pages;
  }, [page, totalPages]);

  if (isLoading && products.length === 0) {
    return <FeaturedProductsSkeleton />;
  }

  if (isError) {
    return <p className="text-center text-red-500 py-10">Failed to load products.</p>;
  }

  return (
    <section ref={sectionRef} className="pt-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">

        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className={`${bokorFont.className} text-4xl md:text-5xl font-bold uppercase text-black mb-2`}
          >
            KIKI AFRICAN TASTE
          </h2>
          <div className="w-24 h-[2px] bg-[#c9a96e] mx-auto" />
        </div>

        {/* Products */}
        <div
          className={`grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 transition-opacity ${
            isFetching ? 'opacity-70' : ''
          }`}
        >
          {products.map((product, index) => {
            const image =
              product.images?.find((i) => i.isPrimary)?.url ??
              product.images?.[0]?.url;

            return (
              <div
                key={product.id}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-56 sm:h-64 w-full">
                  <Image
                    src={image || '/placeholder.png'}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>

                <div className="p-4 sm:p-6 text-center">
                  <h3 className="text-base sm:text-xl font-semibold uppercase mb-3 text-black">
                    {product.name}
                  </h3>

                  <div className="inline-block px-4 py-1.5 bg-[#fef9c3] text-black text-xs rounded-full">
                    SPECIAL OFFER
                  </div>

                  <Link
                    href={`/products/${product.slug}`}
                    className="mt-4 block text-[#c9a96e] text-sm uppercase hover:underline"
                  >
                    Shop Now →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        {totalPages > 1 && (
          <Pagination className="mt-12">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                   className='text-white bg-black hover:bg-[#c9a96e] hover:text-black shadow-2xl'
                />
              </PaginationItem>

              {visiblePages.map((p) => (
                <PaginationItem key={p}>
                  <PaginationLink
                    href="#"
                    isActive={page === p}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(p);
                    }}
                     className='text-white bg-black hover:bg-[#c9a96e] hover:text-black shadow-2xl'
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                  className='text-white bg-black hover:bg-[#c9a96e] hover:text-black shadow-2xl'
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;