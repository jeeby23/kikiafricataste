export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isPrimary: boolean;
  position?: number;
  publicId?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  pricingType?: "PER_KG" | "FIXED";
  price: number | null;
  pricePerKg: number | null;
  stockQty: number | null;
  stockKg: number | null;
  minWeightKg?: number | null;
  stepWeightKg?: number | null;
  isActive: boolean;
  images: ProductImage[];
  category: Category;
}

export interface ProductsResponse {
  data: {
    products: Product[];
    total: number;
    page: number;
    limit: number;
  };
  error: string | null;
}

export interface ProductResponse {
  data: Product;
  error: string | null;
}

export interface CreateProductResponse {
  data: Product;
  error: string | null;
}

export interface UploadImageResponse {
  data: ProductImage;
  error: string | null;
}

export interface DeleteImageResponse {
  data: { deleted: boolean };
  error: string | null;
}

export interface CategoriesResponse {
  data: Category[];
  error: string | null;
}

export interface CreateProductInput {
  name: string;
  description?: string;
  pricingType: "FIXED" | "PER_KG";
  price?: number;
  pricePerKg?: number;
  stockQty?: number;
  stockKg?: number;
  minWeightKg?: number;
  stepWeightKg?: number;
  categoryId?: string;
  isActive: boolean;
}