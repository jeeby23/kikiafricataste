type PageLoaderProps = {
  title?: string
  description?: string
}

export default function PageLoader({
  title = 'Loading...',
  description = 'Please wait...',
}: PageLoaderProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black/70 mx-auto mb-4" />

        <h2 className="text-lg font-semibold text-gray-700">
          {title}
        </h2>

        <p className="text-sm text-gray-400 mt-2">
          {description}
        </p>
      </div>
    </div>
  )
}