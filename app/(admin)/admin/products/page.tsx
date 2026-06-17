// kikiafricataste/app/admin/products/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { dummyProducts } from '@/data/dummyOrders' // ✅ Using dummyOrders file

export default function ProductsPage() {
  const [products, setProducts] = useState(dummyProducts)

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <Link
          href="/admin/products/add"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white text-black rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-black text-left">
            <tr>
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Pack Size</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-t hover:bg-gray-50">
                <td className="p-3">
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                </td>
                <td className="p-3 font-medium">{product.name}</td>
                <td className="p-3">
                  <span className="px-2 py-1 bg-gray-100 text-black rounded-full text-xs">
                    {product.category}
                  </span>
                </td>
                <td className="p-3">₦{product.price.toLocaleString()}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">{product.packSize} pcs</td>
                <td className="p-3 space-x-2">
                  <Link
                    href={`/admin/products/${product.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}