"use client";

import { useState } from "react";
import Image from "next/image";

type Product = {
  name: string;
  category: string;
  price: number;
  unit: string;
  description: string;
  primaryImage: File | null;
  secondaryImages: File[];
};

export default function ProductForm({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState<Product>({
    name: "",
    category: "catfish",
    price: 0,
    unit: "pack",
    description: "",
    primaryImage: null,
    secondaryImages: [],
  });

  const [primaryPreview, setPrimaryPreview] = useState<string>("");
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>([]);

  const handlePrimaryImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, primaryImage: file });
      setPrimaryPreview(URL.createObjectURL(file));
    }
  };

  const handleSecondaryImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setForm({ ...form, secondaryImages: files });
    setSecondaryPreviews(files.map(file => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Product Data:", form);
    alert("Product added successfully! (Demo)");
    onClose();
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg mb-10">
      <h2 className="text-2xl font-bold mb-6">Add New Product</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label>Product Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Smoked Catfish (6pcs)"
              required
            />
          </div>

          <div>
            <label>Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="catfish">Smoked Catfish</option>
              <option value="ponmo">Ponmo</option>
              <option value="goatmeat">Goat Meat</option>
              <option value="abo">Abo (Dried Leaves)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label>Price (₦)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
              className="w-full border rounded-lg px-4 py-3"
              required
            />
          </div>
          <div>
            <label>Unit</label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full border rounded-lg px-4 py-3"
            >
              <option value="pack">Pack</option>
              <option value="kg">Per Kg</option>
              <option value="piece">Per Piece</option>
            </select>
          </div>
        </div>

        <div>
          <label>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 h-24"
            placeholder="6 pieces of premium smoked catfish..."
          />
        </div>
        <div>
          <label className="block mb-2">Primary Image</label>
          <input type="file" accept="image/*" onChange={handlePrimaryImage} className="mb-3" />
          {primaryPreview && (
            <Image src={primaryPreview} alt="preview" width={200} height={200} className="rounded-lg" />
          )}
        </div>
        <div>
          <label className="block mb-2">Secondary Images (Thumbnails)</label>
          <input type="file" multiple accept="image/*" onChange={handleSecondaryImages} />
          <div className="flex gap-3 mt-4 flex-wrap">
            {secondaryPreviews.map((src, i) => (
              <Image key={i} src={src} alt={`thumb ${i}`} width={120} height={120} className="rounded-lg" />
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-6">
          <button type="submit" className="bg-black text-white px-8 py-3 rounded-lg">
            Save Product
          </button>
          <button type="button" onClick={onClose} className="border px-8 py-3 rounded-lg">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}