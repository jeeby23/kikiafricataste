'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowLeft, ImagePlus, X, Trash2, Upload } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import {
  useCategories,
  useUpdateProduct,
  useToggleProduct,
  useUploadProductImage,
  useDeleteProductImage,
} from '@/features/products/products.query'
import { getAdminProducts } from '@/features/products/products.api'
import { Product, CreateProductInput } from '@/types/products.types'

const schema = z
  .object({
    name: z.string().min(1, 'Product name is required'),
    description: z.string().optional(),
    pricingType: z.enum(['FIXED', 'PER_KG']),
    price: z.coerce.number({ error: 'Must be a number' }).positive().optional(),
    pricePerKg: z.coerce.number({ error: 'Must be a number' }).positive().optional(),
    stockQty: z.coerce.number({ error: 'Must be a number' }).int().min(0).optional(),
    stockKg: z.coerce.number({ error: 'Must be a number' }).min(0).optional(),
    minWeightKg: z.coerce.number({ error: 'Must be a number' }).min(0).optional(), 
    stepWeightKg: z.coerce.number({ error: 'Must be a number' }).min(0).optional(), 
    categoryId: z.string().optional(),
    isActive: z.boolean().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.pricingType === 'FIXED' && !data.price) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'Price is required', path: ['price'] })
    }
    if (data.pricingType === 'PER_KG' && !data.pricePerKg) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Price per kg is required',
        path: ['pricePerKg'],
      })
    }
  })

type FormValues = z.input<typeof schema>

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general')
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [newPreviews, setNewPreviews] = useState<string[]>([])
  const [dragOver, setDragOver] = useState(false)
  const [uploadedCount, setUploadedCount] = useState(0)
  const [successMsg, setSuccessMsg] = useState('')

  const { data: categories = [] } = useCategories()
  const updateProduct = useUpdateProduct()
  const toggleProduct = useToggleProduct()
  const uploadImage = useUploadProductImage(id)
  const deleteImage = useDeleteProductImage(id)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isDirty },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { pricingType: 'FIXED', isActive: false },
  })

  const pricingType = watch('pricingType')
  const isActive = watch('isActive')
  const categoryId = watch('categoryId')

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const data = await getAdminProducts(1, 100)
        const found = data.products.find((p) => p.id === id)
        if (!found) {
          router.push('/admin/products')
          return
        }
        setProduct(found)
        reset({
          name: found.name,
          description: found.description ?? '',
          pricingType: found.pricingType ?? 'FIXED',
          price: found.price ?? undefined,
          pricePerKg: found.pricePerKg ?? undefined,
          stockQty: found.stockQty ?? undefined,
          stockKg: found.stockKg ?? undefined,
          minWeightKg: found.minWeightKg && found.minWeightKg > 0 ? found.minWeightKg : undefined, 
          stepWeightKg:
            found.stepWeightKg && found.stepWeightKg > 0 ? found.stepWeightKg : undefined, 
          categoryId: found.category?.id ?? '',
          isActive: found.isActive,
        })
      } catch (e) {
        router.push('/admin/products')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const onSubmit = (values: FormValues) => {
    console.log('📦 Submitting values:', values)

    const payload: Partial<CreateProductInput> = {
      name: values.name,
      description: values.description,
      pricingType: values.pricingType,
      price: values.price as number | undefined,
      pricePerKg: values.pricePerKg as number | undefined,
      stockQty: values.stockQty as number | undefined,
      stockKg: values.stockKg as number | undefined,
      minWeightKg: values.minWeightKg as number | undefined,
      stepWeightKg: values.stepWeightKg as number | undefined,
      categoryId: values.categoryId?.trim() || undefined,
      isActive: values.isActive ?? false,
    }

    console.log('📤 Payload:', payload)

    updateProduct.mutate(
      { id, payload },
      {
        onSuccess: (res: any) => {
          console.log(' Update success:', res)
          if (res?.error) {
            alert(res.error)
            return
          }
          setSuccessMsg('Product updated successfully!')
          setTimeout(() => setSuccessMsg(''), 3000)
          if (res?.data) setProduct(res.data)
        },
        onError: (err: any) => {
          console.error(' Update error:', err?.response?.data || err?.message || err)
          alert('Failed: ' + (err?.response?.data?.error || err?.message || 'Unknown error'))
        },
      },
    )
  }
  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return
    const valid = Array.from(incoming).filter((f) =>
      ['image/jpeg', 'image/png', 'image/webp'].includes(f.type),
    )
    setNewFiles((p) => [...p, ...valid])
    setNewPreviews((p) => [...p, ...valid.map((f) => URL.createObjectURL(f))])
  }

  const removeNewFile = (i: number) => {
    setNewFiles((p) => p.filter((_, idx) => idx !== i))
    setNewPreviews((p) => p.filter((_, idx) => idx !== i))
  }

  const handleUploadNew = async () => {
    for (const file of newFiles) {
      await uploadImage.mutateAsync({ file, altText: product?.name })
      setUploadedCount((c) => c + 1)
    }
    setNewFiles([])
    setNewPreviews([])
    setUploadedCount(0)
  
    const data = await getAdminProducts(1, 100)
    const found = data.products.find((p) => p.id === id)
    if (found) setProduct(found)
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Remove this image?')) return
    await deleteImage.mutateAsync(imageId)
    setProduct((prev) =>
      prev ? { ...prev, images: prev.images.filter((img) => img.id !== imageId) } : prev,
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto space-y-4 animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-7 h-96 bg-gray-200 rounded-2xl" />
            <div className="col-span-5 h-64 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const sortedImages = [...(product.images ?? [])].sort((a, b) =>
    a.isPrimary === b.isPrimary ? 0 : a.isPrimary ? -1 : 1,
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/products">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition">
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Edit Product</h1>
              <p className="text-xs text-gray-600 mt-0.5 truncate max-w-xs">{product.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() =>
                toggleProduct.mutate(product.id, {
                  onSuccess: () => setValue('isActive', !isActive),
                })
              }
              className={`px-4 py-2 text-sm font-medium rounded-lg border transition ${
                isActive
                  ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {isActive ? '● Published' : '○ Draft'}
            </button>
            <button
              type="button"
              onClick={() => {
                handleSubmit(
                  (values) => {
                    console.log('✅ Form passed validation')
                    onSubmit(values)
                  },
                  (formErrors) => {
                    console.log('❌ Form validation failed:', formErrors)
                    const firstError = Object.values(formErrors)[0]
                    alert('Validation error: ' + (firstError?.message ?? 'Check all fields'))
                  },
                )()
              }}
              disabled={updateProduct.isPending}
              className="px-5 py-2 text-sm font-semibold text-white bg-black/70 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {updateProduct.isPending ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {successMsg && (
          <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Product Details</h2>
                  <p className="text-xs text-gray-400 mt-0.5">
                    Key info to describe and display your product.
                  </p>
                </div>
                <span
                  className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}
                >
                  Status: {isActive ? 'Active' : 'Draft'}
                </span>
              </div>
              <div className="flex border border-gray-200 rounded-lg p-0.5 mb-6 bg-gray-50">
                {(['general', 'advanced'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition capitalize ${
                      activeTab === tab
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {activeTab === 'general' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <Input
                      {...register('name')}
                      placeholder="e.g. Goat Meat"
                      className="text-gray-600"
                    />
                    {errors.name && (
                      <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Pricing Type <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={pricingType}
                        onValueChange={(val) =>
                          setValue('pricingType', val as 'FIXED' | 'PER_KG', {
                            shouldValidate: true,
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIXED" className='text-gray-700'>Fixed Price</SelectItem>
                          <SelectItem value="PER_KG" className='text-gray-700'>Per KG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Category
                      </label>
                      <Select
                        value={categoryId ?? ''}
                        onValueChange={(val) => setValue('categoryId', val)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {pricingType === 'FIXED' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 className='text-gray-700'">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Price (£) <span className="text-red-500">*</span>
                        </label>
                        <Input
                          type="number"
                          {...register('price')}
                          placeholder="e.g. 29.99"
                          className="text-gray-700"
                        />
                        {errors.price && (
                          <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Stock Quantity
                        </label>
                        <Input
                          type="number"
                          {...register('stockQty')}
                          placeholder="e.g. 50"
                          className="text-gray-600"
                        />
                      </div>
                    </div>
                  )}

                  {pricingType === 'PER_KG' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Price per KG (£) <span className="text-red-500">*</span>
                        </label>
                        <Input type="number" {...register('pricePerKg')} placeholder="e.g. 15.00" className='text-gray-700' />
                        {errors.pricePerKg && (
                          <p className="text-xs text-red-500 mt-1">{errors.pricePerKg.message}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Stock (KG)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register('stockKg')}
                          placeholder="e.g. 20.5"
                          className='text-gray-700'
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Description
                    </label>
                    <Textarea
                      {...register('description')}
                      placeholder="Write a short description..."
                      className="h-28 resize-none text-gray-600"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-5">
                  {pricingType === 'PER_KG' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Min Weight (KG)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register('minWeightKg')}
                          placeholder="0.25"
                          className='text-gray-700'
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Step Weight (KG)
                        </label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register('stepWeightKg')}
                          placeholder="0.25"
                           className='text-gray-700'
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Publish immediately</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Toggle to make product visible to customers
                      </p>
                    </div>
                    <Switch
                      checked={isActive}
                      onCheckedChange={(val) => setValue('isActive', val)}
                    />
                  </div>
                </div>
              )}

              {updateProduct.isError && (
                <p className="text-sm text-red-500 mt-4">
                  Failed to update product. Please try again.
                </p>
              )}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-4">Product Images</h2>
              {sortedImages.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-4">
                  {sortedImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
                    >
                      <Image
                        src={img.url}
                        alt={img.altText || 'Product'}
                        fill
                        className="object-cover"
                      />
                      {img.isPrimary && (
                        <span className="absolute bottom-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(img.id)}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div
                onDragOver={(e) => {
                  e.preventDefault()
                  setDragOver(true)
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault()
                  setDragOver(false)
                  addFiles(e.dataTransfer.files)
                }}
                onClick={() => document.getElementById('edit-img-input')?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? 'border-blue-400 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                }`}
              >
                <ImagePlus className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">
                  Add more images, or <span className="text-blue-500">browse</span>
                </p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP — max 5MB</p>
                <input
                  id="edit-img-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => addFiles(e.target.files)}
                />
              </div>

              {newPreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-3">
                  {newPreviews.map((src, i) => (
                    <div
                      key={i}
                      className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200"
                    >
                      <img src={src} alt="" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          removeNewFile(i)
                        }}
                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {newFiles.length > 0 && (
                <Button
                  onClick={handleUploadNew}
                  disabled={uploadImage.isPending}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploadImage.isPending
                    ? `Uploading ${uploadedCount + 1} of ${newFiles.length}...`
                    : `Upload ${newFiles.length} image${newFiles.length !== 1 ? 's' : ''}`}
                </Button>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Visibility</h3>
              <p className="text-xs text-gray-400 mb-4">
                Control whether this product is visible to customers
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {isActive ? 'Visible to customers' : 'Hidden (Draft)'}
                </span>
                <Switch checked={isActive} onCheckedChange={(val) => setValue('isActive', val)} />
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Category</h3>
              <div className="space-y-2">
                {categories.length === 0 ? (
                  <p className="text-xs text-gray-400">No categories found.</p>
                ) : (
                  categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setValue('categoryId', cat.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition ${
                        categoryId === cat.id
                          ? 'bg-blue-50 text-blue-700 font-medium border border-blue-200'
                          : 'text-gray-600 hover:bg-gray-50 border border-transparent'
                      }`}
                    >
                      <span className="capitalize">{cat.name}</span>
                      <span className="text-xs text-gray-400">
                        {cat._count?.products ?? 0} products
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Product Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">ID</span>
                  <span className="text-gray-700 font-mono text-xs truncate max-w-[140px]">
                    {product.id}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Slug</span>
                  <span className="text-gray-700 font-mono text-xs">{product.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Images</span>
                  <span className="text-gray-700">{product.images?.length ?? 0}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6">
              <h3 className="text-sm font-semibold text-red-600 mb-1">Danger Zone</h3>
              <p className="text-xs text-gray-400 mb-4">
                Deleting a product is a soft delete — it can be restored.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (!confirm(`Delete "${product.name}"? This will hide it from the store.`))
                    return
                 
                  import('@/features/products/products.api').then(({ deleteProduct: del }) => {
                    del(product.id).then(() => router.push('/admin/products'))
                  })
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-red-200 text-red-600 text-sm font-medium hover:bg-red-50 transition"
              >
                <Trash2 className="w-4 h-4" />
                Delete Product
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
