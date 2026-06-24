'use client'

import { useState } from 'react'
import { ImagePlus, X, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useUploadProductImage } from '@/features/products/products.query'
import { Product } from '@/types/products.types'

interface ImagePanelProps {
  product: Product
  onDone: () => void
}

export function ImagePanel({ product, onDone }: ImagePanelProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [uploadedCount, setUploadedCount] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const upload = useUploadProductImage(product.id)

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const valid = Array.from(incoming).filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type)
    )
    setFiles((p) => [...p, ...valid])
    setPreviews((p) => [...p, ...valid.map((f) => URL.createObjectURL(f))])
  }

  const removeFile = (i: number) => {
    setFiles((p) => p.filter((_, idx) => idx !== i))
    setPreviews((p) => p.filter((_, idx) => idx !== i))
  }

  const handleUpload = async () => {
    for (const file of files) {
      await upload.mutateAsync({ file, altText: product.name })
      setUploadedCount((c) => c + 1)
    }
    onDone()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <span className="text-green-600 text-sm">✓</span>
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Product Created!</h1>
            <p className="text-sm text-gray-500">
              Now add images for <span className="font-medium">{product.name}</span>
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
            onClick={() => document.getElementById('img-input')?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              dragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
            }`}
          >
            <ImagePlus className="w-10 h-10 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-600">
              Drag & drop images, or <span className="text-blue-500">browse</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — max 5MB each</p>
            <input
              id="img-input"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
          </div>

          {previews.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-4">
              {previews.map((src, i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
                  <img src={src} alt="" className="w-full h-full object-cover" />
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                      Cover
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeFile(i) }}
                    className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {upload.isPending && (
            <p className="text-sm text-blue-600 mt-4">
              Uploading {uploadedCount + 1} of {files.length}...
            </p>
          )}

          <div className="flex gap-3 mt-6">
            <Button
              onClick={handleUpload}
              disabled={files.length === 0 || upload.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <Upload className="w-4 h-4" />
              {upload.isPending ? 'Uploading...' : `Upload ${files.length} image${files.length !== 1 ? 's' : ''}`}
            </Button>
            <Button variant="outline" onClick={onDone} disabled={upload.isPending}>
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}