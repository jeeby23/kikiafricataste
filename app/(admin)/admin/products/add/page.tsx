"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddProduct() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    mainImage: null as File | null,
    secondaryImages: [] as File[],
    packSize: "",
    pricePerPiece: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // 🔥 Prepare FormData (for backend later)
    const data = new FormData();
    data.append("name", formData.name);
    data.append("category", formData.category);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("description", formData.description);

    if (formData.mainImage) {
      data.append("mainImage", formData.mainImage);
    }

    formData.secondaryImages.forEach((img) => {
      data.append("secondaryImages", img);
    });

    console.log("Product Data:", formData);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setLoading(false);
    router.push("/admin/products");
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Add Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white text-black p-6 rounded-lg shadow space-y-4"
      >
        {/* Product Name */}
        <div>
          <label className="block font-medium mb-1">Product Name *</label>
          <input
            type="text"
            required
            className="w-full border rounded p-2"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1">Category *</label>
          <select
            required
            className="w-full border rounded p-2"
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="">Select Category</option>
            <option value="Catfish">Catfish</option>
            <option value="Ponmon">Ponmon</option>
            <option value="Goat Meat">Goat Meat</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Pack Size & Price Per Piece */}
        {(formData.category === "Catfish" ||
          formData.category === "Ponmon") && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">
                Pack Size (pieces)
              </label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={formData.packSize}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    packSize: e.target.value,
                  })
                }
              />
            </div>
            <div>
              <label className="block font-medium mb-1">
                Price Per Piece (₦)
              </label>
              <input
                type="number"
                className="w-full border rounded p-2"
                value={formData.pricePerPiece}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    pricePerPiece: e.target.value,
                  })
                }
              />
            </div>
          </div>
        )}

        {/* Price */}
        <div>
          <label className="block font-medium mb-1">Price (₦) *</label>
          <input
            type="number"
            required
            className="w-full border rounded p-2"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </div>

        {/* Stock */}
        <div>
          <label className="block font-medium mb-1">
            Stock Quantity *
          </label>
          <input
            type="number"
            required
            className="w-full border rounded p-2"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />
        </div>

        {/* Description */}
        <div>
          <label className="block font-medium mb-1">
            Description
          </label>
          <textarea
            className="w-full border rounded p-2 h-24"
            value={formData.description}
            onChange={(e) =>
              setFormData({
                ...formData,
                description: e.target.value,
              })
            }
          />
        </div>

        {/* Main Image */}
        <div>
          <label className="block font-medium mb-1">
            Main Image *
          </label>
          <input
            type="file"
            accept="image/*"
            required
            className="w-full border rounded p-2"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setFormData({
                  ...formData,
                  mainImage: file,
                });
              }
            }}
          />

          {formData.mainImage && (
            <img
              src={URL.createObjectURL(formData.mainImage)}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>

        {/* Secondary Images */}
        <div>
          <label className="block font-medium mb-1">
            Secondary Images
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            className="w-full border rounded p-2"
            onChange={(e) => {
              const files = Array.from(e.target.files || []);
              setFormData({
                ...formData,
                secondaryImages: [
                  ...formData.secondaryImages,
                  ...files,
                ],
              });
            }}
          />

          <div className="mt-2 flex flex-wrap gap-2">
            {formData.secondaryImages.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Secondary ${index}`}
                  className="w-20 h-20 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      secondaryImages:
                        formData.secondaryImages.filter(
                          (_, i) => i !== index
                        ),
                    });
                  }}
                  className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}