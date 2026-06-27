import { create } from "zustand";
import { Product } from "@/types/products.types";
import {
  getProducts,
  getProductBySlug,
} from "@/features/products/products.api";

interface ProductStore {
  /* LIST */
  products: Product[];
  total: number;
  page: number;
  limit: number;

  /* SINGLE PRODUCT */
  product: Product | null;

  /* UI STATES */
  loading: boolean;
  productLoading: boolean;
  error: string | null;

  /* ACTIONS */
  fetchProducts: (page?: number) => Promise<void>;
  fetchProductBySlug: (slug: string) => Promise<void>;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  product: null,
  total: 0,
  page: 1,
  limit: 20,
  loading: false,
  productLoading: false,
  error: null,

  /* LIST */
  fetchProducts: async (page = 1) => {
    try {
      set({ loading: true, error: null });

      const data = await getProducts(page);

      set({
        products: data.products,
        total: data.total,
        page: data.page,
        limit: data.limit,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || "Failed to load products",
      });
    }
  },

  /* SINGLE */
  fetchProductBySlug: async (slug: string) => {
    try {
      set({ productLoading: true, error: null });
      const product = await getProductBySlug(slug);

      set({
        product,
        productLoading: false,
      });
    } catch (err: any) {
      set({
        productLoading: false,
        error: err.message || "Failed to load product",
      });
    }
  },
}));