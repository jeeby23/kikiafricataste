import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getProducts, getProductBySlug, getAdminProducts,
  getCategories, createCategory, updateCategory, deleteCategory,
  createProduct, updateProduct, deleteProduct,
  toggleProductStatus, uploadProductImage, deleteProductImage,
} from './products.api'
import { CreateProductInput } from '@/types/products.types'

export const useProducts = (page = 1, limit = 4, search = '') => {

  return useQuery({
    queryKey: ['products', page, limit, search],
    queryFn: () => getProducts(page, limit, search),
    staleTime: 1000 * 60 * 60, 
    gcTime: 1000 * 60 * 60 * 24, 
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    
    placeholderData: (prev) => prev,

  })

}
export const useAdminProducts = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['admin-products', page, search],
    queryFn: () => getAdminProducts(page, 20, search),
  })
}

export const useProduct = (slug: string) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
    enabled: !!slug,
    staleTime: 1000 * 60 * 10,
  })
}

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 10,
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (name: string) => createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err: any) => {
      console.error('❌ CREATE CATEGORY ERROR:', err?.response?.data || err)
    },
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) => updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err: any) => {
      console.error('❌ UPDATE CATEGORY ERROR:', err?.response?.data || err)
    },
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (err: any) => {
      console.error('❌ DELETE CATEGORY ERROR:', err?.response?.data || err)
    },
  })
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: CreateProductInput) => createProduct(data),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: (err: any) => {
      console.error('❌ CREATE PRODUCT ERROR:', err?.response?.data || err)
    },
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateProductInput> }) =>
      updateProduct(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: (err: any) => {
      console.error('❌ UPDATE PRODUCT ERROR:', err?.response?.data || err)
    },
  })
}

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
    },
    onError: (err: any) => {
      console.error('❌ DELETE PRODUCT ERROR:', err?.response?.data || err);
      alert('Failed to delete product. Please try again.');
    },
  });
};

export const useToggleProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => toggleProductStatus(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
    onError: (err: any) => {
      console.error('❌ TOGGLE ERROR:', err?.response?.data || err)
    },
  })
}

export const useUploadProductImage = (productId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, altText }: { file: File; altText?: string }) =>
      uploadProductImage(productId, file, altText),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })
}

export const useDeleteProductImage = (productId: string) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (imageId: string) => deleteProductImage(productId, imageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })
}