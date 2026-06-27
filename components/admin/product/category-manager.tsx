'use client'

import { useState } from 'react'
import { Plus, X, Check, Pencil, Trash2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import {
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from '@/features/products/products.query'

interface CategoryManagerProps {
  categories: any[]
  categoryId?: string
  onSelect: (id: string) => void
}

export function CategoryManager({ categories, categoryId, onSelect }: CategoryManagerProps) {
  const [newName, setNewName] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [showAdd, setShowAdd] = useState(false)

  const createCategory = useCreateCategory()
  const updateCategory = useUpdateCategory()
  const deleteCategory = useDeleteCategory()

  const handleAdd = () => {
    if (!newName.trim()) return
    createCategory.mutate(newName.trim(), {
      onSuccess: () => {
        setNewName('')
        setShowAdd(false)
      },
    })
  }

  const handleEdit = (id: string) => {
    if (!editingName.trim()) return
    updateCategory.mutate({ id, name: editingName.trim() }, {
      onSuccess: () => {
        setEditingId(null)
        setEditingName('')
      },
    })
  }

  const handleDelete = (id: string, name: string) => {
    if (!confirm(`Delete category "${name}"? Products in this category will be uncategorised.`)) return
    deleteCategory.mutate(id)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-900">Category</h3>
        <button
          type="button"
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-1 text-xs text-black/70 hover:text-black/80 font-medium"
        >
          <Plus className="w-3.5 h-3.5" />
          Add
        </button>
      </div>

      {showAdd && (
        <div className="flex gap-2 mb-3">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Category name..."
            className="text-sm h-8"
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <button
            type="button"
            onClick={handleAdd}
            disabled={createCategory.isPending || !newName.trim()}
            className="px-3 py-1 bg-black/70 text-white text-xs rounded-lg hover:bg-blue-700 transition disabled:opacity-40 flex-shrink-0"
          >
            {createCategory.isPending ? '...' : 'Add'}
          </button>
          <button
            type="button"
            onClick={() => { setShowAdd(false); setNewName('') }}
            className="px-2 py-1 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        {categories.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-3">
            No categories yet. Add one above.
          </p>
        )}
        {categories.map((cat) => (
          <div key={cat.id} className="group">
            {editingId === cat.id ? (
              <div className="flex gap-2 items-center">
                <Input
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  className="text-sm h-8 flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit(cat.id)}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => handleEdit(cat.id)}
                  disabled={updateCategory.isPending}
                  className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => { setEditingId(null); setEditingName('') }}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div
                className={`flex items-center justify-between px-3 py-2 rounded-lg transition cursor-pointer ${
                  categoryId === cat.id
                    ? 'bg-black/5 border border-gray-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => onSelect(cat.id)}
              >
                <div className="flex-1 min-w-0">
                  <span className={`text-sm capitalize font-medium ${
                    categoryId === cat.id ? 'text-black/70' : 'text-gray-700'
                  }`}>
                    {cat.name}
                  </span>
                  <span className="text-xs text-gray-400 ml-2">
                    {cat._count?.products ?? 0}
                  </span>
                </div>

                <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition ml-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setEditingId(cat.id)
                      setEditingName(cat.name)
                    }}
                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(cat.id, cat.name)
                    }}
                    disabled={deleteCategory.isPending}
                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}