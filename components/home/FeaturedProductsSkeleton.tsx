import { Skeleton } from '@/components/ui/skeleton'

const FeaturedProductsSkeleton = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-72 mx-auto mb-4" />
          <Skeleton className="h-1 w-24 mx-auto" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <Skeleton className="h-56 sm:h-64 w-full rounded-2xl" />
              <div className="p-4 sm:p-6 space-y-3 text-center">
                <Skeleton className="h-4 w-3/4 mx-auto" />
                <Skeleton className="h-3 w-1/2 mx-auto" />
                <Skeleton className="h-8 w-24 mx-auto rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedProductsSkeleton