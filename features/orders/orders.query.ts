import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminOrders,
  getOrderById,
  confirmOrder,
  cancelOrder,
} from './orders.api';

export const useAdminOrders = (
  page = 1,
  status?: string,
  search = "",
  from?: string,
  to?: string
) => {
  return useQuery({
    queryKey: ['admin-orders', page, status, search, from, to],
    queryFn: () => getAdminOrders(page, 20, status, search, from, to),
  });
};

export const useOrderById = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });
};

export const useConfirmOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => confirmOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
};

export const useCancelOrder = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => cancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
    },
  });
};