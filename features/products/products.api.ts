import axios from "@/lib/axios";
import {
  ProductsResponse,
  ProductResponse,
  CreateProductInput,
  CreateProductResponse,
  UploadImageResponse,
  DeleteImageResponse,
  CategoriesResponse,
} from "@/types/products.types";

export const getProducts = async (page = 1, limit = 4, search = "") => {
  const params = new URLSearchParams({ page: String(page), limit: String(limit) });
  if (search.trim()) params.append("search", search.trim());
  const res = await axios.get<ProductsResponse>(`/public/product?${params}`);
  return res.data.data;
};

export const getProductBySlug = async (slug: string) => {
  const res = await axios.get<ProductResponse>(`/public/product/${slug}`);
  return res.data.data;
};

export const getAdminProducts = async (page = 1, limit = 20, search = "", status?: string) => {
  const res = await axios.get<ProductsResponse>("/admin/product", {
    params: { page, limit, search, status },
  });
  return res.data.data;
};

export const getCategories = async () => {
  const res = await axios.get<CategoriesResponse>("/admin/categories");
  return res.data.data;
};

export const createCategory = async (name: string) => {
  const res = await axios.post("/admin/categories", { name });
  return res.data;
};

export const updateCategory = async (id: string, name: string) => {
  const res = await axios.put(`/admin/categories/${id}`, { name });
  return res.data;
};

export const deleteCategory = async (id: string) => {
  const res = await axios.delete(`/admin/categories/${id}`);
  return res.data;
};

export const createProduct = async (payload: CreateProductInput) => {
  const res = await axios.post<CreateProductResponse>("/admin/product", payload);
  return res.data;
};

export const updateProduct = async (id: string, payload: Partial<CreateProductInput>) => {
  const res = await axios.put<CreateProductResponse>(`/admin/product/${id}`, payload);
  return res.data;
};

export const deleteProduct = async (id: string) => {
  const res = await axios.delete(`/admin/product/${id}`);
  return res.data;
};

export const toggleProductStatus = async (id: string) => {
  const res = await axios.patch(`/admin/product/${id}/toggle`);
  return res.data;
};

export const uploadProductImage = async (productId: string, file: File, altText?: string) => {
  const formData = new FormData();
  formData.append("image", file);
  if (altText) formData.append("altText", altText);
  const res = await axios.post<UploadImageResponse>(
    `/admin/product/${productId}/images`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
  return res.data;
};

export const deleteProductImage = async (productId: string, imageId: string) => {
  const res = await axios.delete<DeleteImageResponse>(
    `/admin/product/${productId}/images/${imageId}`
  );
  return res.data;
};