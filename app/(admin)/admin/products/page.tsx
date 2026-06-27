'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, FilePenLine, MoreHorizontal } from 'lucide-react'
import {
  useAdminProducts,
  useToggleProduct,
  useDraftProduct,
  useDeleteProduct,
} from '@/features/products/products.query'
import Swal from 'sweetalert2'

type StatusFilter = 'all' | 'active' | 'inactive' | 'draft'

function StatusBadge({ isActive, isDraft }: { isActive: boolean; isDraft?: boolean }) {
  if (isDraft) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
        Draft
      </span>
    )
  }
  if (isActive) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-600 border border-emerald-100">
        Published
      </span>
    )
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-400 border border-rose-100">
      Inactive
    </span>
  )
}

function ActionsMenu({
  productId,
  productName,
  onDelete,
  onDraft,
  onToggle,
}: {
  productId: string
  productName: string
  onDelete: () => void
  onDraft: () => void
  onToggle: () => void
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
      >
        <MoreHorizontal className="w-4 h-4" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-40 z-50 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
          <Link
            href={`/admin/products/${productId}`}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => setOpen(false)}
          >
            <Pencil className="w-3.5 h-3.5 text-gray-400" />
            Edit
          </Link>
          <button
            onClick={() => { onToggle(); setOpen(false) }}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors w-full text-left"
          >
            <span className="w-3.5 h-3.5 flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </span>
            Toggle Status
          </button>
          <button
            onClick={() => { onDraft(); setOpen(false) }}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-500 hover:bg-red-50 transition-colors w-full text-left"
          >
            <FilePenLine className="w-4 h-4" />
            Save as draft
          </button>
          <button
            onClick={() => { onDelete(); setOpen(false) }}
            className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors w-full text-left"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data, isLoading, isError } = useAdminProducts(page, search)
  const toggleProduct = useToggleProduct()
  const draftProduct = useDraftProduct()
  const deleteProduct = useDeleteProduct()

  const products = data?.products ?? []
  const total = data?.total ?? 0
  const limit = data?.limit ?? 20
  const totalPages = Math.ceil(total / limit)

  useEffect(() => {
    const handler = (e: Event) => {
      const q = (e as CustomEvent<string>).detail
      setSearch(q)
      setPage(1)
    }
    window.addEventListener('admin:search', handler)
    return () => window.removeEventListener('admin:search', handler)
  }, [])

  const handleDraft = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Save as Draft?',
      text: `"${name}" will be unpublished and hidden from customers.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Save as Draft',
      cancelButtonText: 'Cancel',
    })
    if (!result.isConfirmed) return
    setDeletingId(id)
    draftProduct.mutate(id, {
      onSuccess: () => Swal.fire({ title: 'Saved as Draft', icon: 'success', timer: 1500, showConfirmButton: false }),
      onError: () => Swal.fire({ title: 'Error', text: 'Failed to save draft.', icon: 'error' }),
      onSettled: () => setDeletingId(null),
    })
  }

  const handleDelete = async (id: string, name: string) => {
    const result = await Swal.fire({
      title: 'Delete product?',
      text: `"${name}" will be permanently removed.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true,
    })
    if (!result.isConfirmed) return
    setDeletingId(id)
    deleteProduct.mutate(id, {
      onSuccess: () => Swal.fire({ title: 'Deleted!', icon: 'success', timer: 1500, showConfirmButton: false }),
      onError: (error: any) =>
        Swal.fire({
          title: 'Cannot Delete',
          text: error?.response?.data?.error || 'This product may already be attached to orders.',
          icon: 'error',
        }),
      onSettled: () => setDeletingId(null),
    })
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  }

  // Skeleton — adapts to mobile (5 cols) vs desktop (6 cols)
  const skeletonRows = [...Array(6)].map((_, i) => (
    <tr key={i} className="border-b border-gray-50">
      {[...Array(6)].map((_, j) => (
        <td key={j} className="px-4 py-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse" style={{ width: j === 0 ? 160 : 70 }} />
        </td>
      ))}
    </tr>
  ))

  return (
    <div className="space-y-4 p-3 sm:p-4 md:p-6">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-black/70 shrink-0" />
          <h1 className="text-sm sm:text-base font-semibold text-gray-900 truncate">
            Most Popular Products
          </h1>
        </div>
        <Link
          href="/admin/products/add"
          className="inline-flex items-center gap-1.5 bg-black/70 hover:bg-black/80 text-white px-3 py-2 rounded-lg text-xs font-medium transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Add Product</span>
          <span className="xs:hidden">Add Product</span>
        </Link>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

        {/* ── MOBILE CARD LIST (< md) ── */}
        <div className="md:hidden divide-y divide-gray-100">
          {isLoading && (
            [...Array(4)].map((_, i) => (
              <div key={i} className="p-4 space-y-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-100 shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <div className="h-3.5 bg-gray-100 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 bg-gray-100 rounded-full w-16" />
                  <div className="h-6 bg-gray-100 rounded-full w-12" />
                </div>
              </div>
            ))
          )}

          {!isLoading && isError && (
            <p className="p-10 text-center text-sm text-red-400">Failed to load products.</p>
          )}

          {!isLoading && !isError && products.length === 0 && (
            <p className="p-12 text-center text-sm text-gray-400">No products found.</p>
          )}

          {!isLoading && !isError && products.map((product, idx) => {
            const primaryImage = product.images?.find((i: any) => i.isPrimary)
            const isDeleting = deletingId === product.id
            const shortId = `P-${1000 + idx + (page - 1) * limit}`

            return (
              <div
                key={product.id}
                className={`p-4 hover:bg-gray-50/60 transition-colors ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
              >
                <div className="flex items-start gap-3">
                  {/* Thumbnail */}
                  <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                    {primaryImage ? (
                      <img src={primaryImage.url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 text-[9px]">IMG</div>
                    )}
                  </div>

                  {/* Main info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-gray-900 text-[13px] leading-tight truncate">
                          {product.name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-mono">{shortId}</p>
                      </div>
                      {/* Actions menu — top right of card */}
                      <ActionsMenu
                        productId={product.id}
                        productName={product.name}
                        onDraft={() => handleDraft(product.id, product.name)}
                        onDelete={() => handleDelete(product.id, product.name)}
                        onToggle={() => toggleProduct.mutate(product.id)}
                      />
                    </div>

                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <StatusBadge isActive={product.isActive} />
                      {product.category?.name && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500">
                          {product.category.name.length > 14
                            ? product.category.name.slice(0, 14) + '…'
                            : product.category.name}
                        </span>
                      )}
                      <span className="text-[13px] font-semibold text-gray-900 ml-auto">
                        {product.pricingType === 'FIXED'
                          ? `£${product.price?.toLocaleString()}`
                          : `£${product.pricePerKg?.toLocaleString()}/kg`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── DESKTOP TABLE (≥ md) ── */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-[12px] font-medium text-gray-500 px-5 py-3.5 whitespace-nowrap">Product name</th>
                <th className="text-left text-[12px] font-medium text-gray-500 px-5 py-3.5 whitespace-nowrap">Category</th>
                <th className="text-left text-[12px] font-medium text-gray-500 px-5 py-3.5 whitespace-nowrap">ID</th>
                <th className="text-left text-[12px] font-medium text-gray-500 px-5 py-3.5 whitespace-nowrap">Price</th>
                <th className="text-left text-[12px] font-medium text-gray-500 px-5 py-3.5 whitespace-nowrap">Status</th>
                <th className="text-left text-[12px] font-medium text-gray-500 px-5 py-3.5 whitespace-nowrap">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50">
              {isLoading && skeletonRows}

              {!isLoading && isError && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-red-400">
                    Failed to load products.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && products.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-14 text-center text-sm text-gray-400">
                    No products found.
                  </td>
                </tr>
              )}

              {!isLoading && !isError && products.map((product, idx) => {
                const primaryImage = product.images?.find((i: any) => i.isPrimary)
                const isDeleting = deletingId === product.id
                const shortId = `P-${1000 + idx + (page - 1) * limit}`

                return (
                  <tr
                    key={product.id}
                    className={`hover:bg-gray-50/60 transition-colors ${isDeleting ? 'opacity-40 pointer-events-none' : ''}`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                          {primaryImage ? (
                            <img src={primaryImage.url} alt={product.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300 text-[9px]">IMG</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-[13px] leading-tight max-w-[160px] truncate">
                            {product.name}
                          </p>
                          <p className="text-[11px] text-gray-400 mt-0.5">
                            ({product.stockQty ?? product.stockKg ?? 0})
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500 whitespace-nowrap">
                      {product.category?.name
                        ? product.category.name.length > 12
                          ? product.category.name.slice(0, 12) + '...'
                          : product.category.name
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-gray-500 font-mono whitespace-nowrap">{shortId}</td>
                    <td className="px-5 py-3.5 text-[13px] font-medium text-gray-900 whitespace-nowrap">
                      {product.pricingType === 'FIXED'
                        ? `£${product.price?.toLocaleString()}`
                        : `£${product.pricePerKg?.toLocaleString()}/kg`}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge isActive={product.isActive} />
                    </td>
                    <td className="px-5 py-3.5">
                      <ActionsMenu
                        productId={product.id}
                        productName={product.name}
                        onDraft={() => handleDraft(product.id, product.name)}
                        onDelete={() => handleDelete(product.id, product.name)}
                        onToggle={() => toggleProduct.mutate(product.id)}
                      />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1">
            {[...Array(Math.min(totalPages, 4))].map((_, i) => {
              const p = i + 1
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                    page === p ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              )
            })}
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors text-lg leading-none"
            >
              ←
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:bg-gray-50 disabled:opacity-30 transition-colors text-lg leading-none"
            >
              →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}