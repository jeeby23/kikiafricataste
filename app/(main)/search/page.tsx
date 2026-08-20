import { Suspense } from 'react'

import SearchContent from './SearchContent'
import PageLoader from '@/components/shared/PageLoader'
export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div>
          <PageLoader
            title="Loading Product..."
            description="Please wait while we fetch the product."
          />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  )
}
