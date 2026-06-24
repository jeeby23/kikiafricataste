'use client'

import Container from '@/components/Container'
import { Skeleton } from '@/components/ui/skeleton'

export default function ProductSkeleton() {
  const lines = (n: number) => Array.from({ length: n })

  return (
    <div className="w-full bg-white text-black min-h-screen">
      <Container className="py-22">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="flex flex-col gap-3">
            <Skeleton className="w-full h-[400px] md:h-[500px]" />
            <div className="flex gap-2 mt-1">
              {lines(3).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20" />
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <div className="space-y-2">
              {lines(3).map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
      </Container>
    </div>
  )
}