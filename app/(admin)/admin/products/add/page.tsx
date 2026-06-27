'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'

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

import { useCreateProduct, useCategories } from '@/features/products/products.query'
import { Product } from '@/types/products.types'

import { productFormSchema, type FormValues } from '@/schema/product.schema'
import { ImagePanel } from '@/components/admin/product/image-panel'
import { CategoryManager } from '@/components/admin/product/category-manager'

export default function AddProductPage() {
  const router = useRouter()
  const createProduct = useCreateProduct()
  const { data: categories = [] } = useCategories()
  const [createdProduct, setCreatedProduct] = useState<Product | null>(null)
  const [activeTab, setActiveTab] = useState<'general' | 'advanced'>('general')

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: { pricingType: 'FIXED', isActive: false },
  })

  const pricingType = watch('pricingType')
  const isActive = watch('isActive')
  const categoryId = watch('categoryId')

  const submitForm = (isActiveOverride: boolean) => {
     console.log("submitForm called")
     
    handleSubmit((values) => {
      const payload = {
        name: values.name,
        description: values.description,
        pricingType: values.pricingType,
        price: values.price !== undefined ? Number(values.price) : undefined,
        pricePerKg: values.pricePerKg !== undefined ? Number(values.pricePerKg) : undefined,
        stockQty: values.stockQty !== undefined ? Number(values.stockQty) : undefined,
        stockKg: values.stockKg !== undefined ? Number(values.stockKg) : undefined,
        minWeightKg: values.minWeightKg !== undefined ? Number(values.minWeightKg) : undefined,
        stepWeightKg: values.stepWeightKg !== undefined ? Number(values.stepWeightKg) : undefined,
        categoryId: values.categoryId?.trim() || undefined,
        isActive: isActiveOverride,
      }
      console.log("payload", payload)

      createProduct.mutate(payload, {
        onSuccess: (res) => {
          if (res.error) {
            alert(res.error)
            return
          }
          if (payload.isActive) {
            setCreatedProduct(res.data)
          } else {
            router.push('/admin/products')
          }
        },
        onError: (err: any) => {
          console.error('🔴 API ERROR:', err?.response?.data || err)
          alert('Failed to create product (check console)')
        },
      })
    })()
  }

  if (createdProduct) {
    return (
      <ImagePanel
        product={createdProduct}
        onDone={() => router.push('/admin/products')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/products">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition">
                <ArrowLeft className="w-4 h-4 text-gray-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Add New Product</h1>
              <p className="text-xs text-gray-400 mt-0.5">Fill in the details below</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => submitForm(false)}
              disabled={createProduct.isPending}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4 text-red-400" />
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => {

  console.log("🔥 Publish button clicked")

  submitForm(true)

}}
              disabled={createProduct.isPending}
              className="px-5 py-2 text-sm font-semibold text-white bg-black/70 rounded-lg hover:bg-black/80 transition disabled:opacity-50"
            >
              {createProduct.isPending ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
            isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
            {isActive ? 'Will be published' : 'Draft'}
          </span>
        </div>

        {/* Main Grid Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-semibold text-gray-900">Product Details</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Key info to describe your product.</p>
                </div>
              </div>

              <div className="flex border border-gray-200 rounded-lg p-0.5 mb-6 bg-gray-50">
                {(['general', 'advanced'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-2 text-sm font-medium rounded-md transition capitalize ${
                      activeTab === tab ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
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
                    <Input {...register('name')} placeholder="e.g. Goat Meat" className="text-gray-700" />
                    {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">
                        Pricing Type <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={pricingType}
                        onValueChange={(val) => setValue('pricingType', val as 'FIXED' | 'PER_KG', { shouldValidate: true })}
                      >
                        <SelectTrigger><SelectValue placeholder="Choose pricing type" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIXED">Fixed Price</SelectItem>
                          <SelectItem value="PER_KG">Per KG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                      <Select value={categoryId ?? ''} onValueChange={(val) => setValue('categoryId', val)}>
                        <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {pricingType === 'FIXED' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Price (£) <span className="text-red-500">*</span>
                        </label>
                        <Input type="number" {...register('price')} placeholder="e.g. 29.99" className="text-gray-700" />
                        {errors.price && <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity</label>
                        <Input type="number" {...register('stockQty')} placeholder="e.g. 50" className="text-gray-700" />
                      </div>
                    </div>
                  )}

                  {pricingType === 'PER_KG' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                          Price per KG (£) <span className="text-red-500">*</span>
                        </label>
                        <Input type="number" {...register('pricePerKg')} placeholder="e.g. 15.00" className="text-gray-700" />
                        {errors.pricePerKg && <p className="text-xs text-red-500 mt-1">{errors.pricePerKg.message}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock (KG)</label>
                        <Input type="number" step="0.01" {...register('stockKg')} placeholder="e.g. 20.5" className="text-gray-700" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description</label>
                    <Textarea
                      {...register('description')}
                      placeholder="Write a short description..."
                      className="h-28 resize-none text-gray-700"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'advanced' && (
                <div className="space-y-5">
                  {pricingType === 'PER_KG' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Min Weight (KG)</label>
                        <Input type="number" step="0.01" {...register('minWeightKg')} placeholder="0.25" className="text-gray-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Step Weight (KG)</label>
                        <Input type="number" step="0.01" {...register('stepWeightKg')} placeholder="0.25" className="text-gray-700" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Publish immediately</p>
                      <p className="text-xs text-gray-400 mt-0.5">Toggle to make product visible to customers</p>
                    </div>
                    <Switch checked={isActive} onCheckedChange={(val) => setValue('isActive', val)} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right hand sidebar actions */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-1">Visibility</h3>
              <p className="text-xs text-gray-400 mb-4">Control visibility parameters</p>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {isActive ? 'Visible' : 'Hidden (Draft)'}
                </span>
                <Switch checked={isActive} onCheckedChange={(val) => setValue('isActive', val)} />
              </div>
            </div>

            <CategoryManager
              categories={categories}
              categoryId={categoryId}
              onSelect={(id) => setValue('categoryId', id)}
            />

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => submitForm(false)}
                  disabled={createProduct.isPending}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Save as Draft
                </button>
                <button
                  type="button"
                  onClick={() => submitForm(true)}
                  disabled={createProduct.isPending}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg bg-black/70 text-white text-sm font-medium hover:bg-black/80 transition disabled:opacity-50"
                >
                  Publish Product
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}