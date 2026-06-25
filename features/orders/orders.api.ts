import axios from "@/lib/axios";
import { OrdersResponse, OrderResponse } from "@/types/order.types";

export const getAdminOrders = async (
  page = 1,
  limit = 20,
  status?: string,
  search = "",
  from?: string,
  to?: string
) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) params.append("status", status);
  if (search) params.append("search", search);
  if (from) params.append("from", from);
  if (to) params.append("to", to);

  const res = await axios.get<OrdersResponse>(`/admin/order?${params}`);
  return res.data.data;
};

export const getOrderById = async (id: string) => {
  const res = await axios.get<OrderResponse>(`/admin/order/${id}`);
  return res.data.data;
};

export const confirmOrder = async (id: string) => {
  const res = await axios.patch(`/admin/order/${id}/confirm`);
  return res.data;
};

export const createOrder = async (payload: any) => {
  try {
    const res = await axios.post("/public/order", payload)
    return res.data
  } catch (err: any) {
    // Axios throws on 4xx/5xx — pull the error message from the response body
    const message = err?.response?.data?.error || 'Something went wrong placing your order'
    return { data: null, error: message }
  }
}

export const cancelOrder = async (id: string) => {
  const res = await axios.patch(`/admin/order/${id}/cancel`);
  return res.data;
};

export const estimateShipping = async (
  items: { productId: string; pricingType: string; quantity: number }[]
) => {
  const res = await axios.post('/orders/estimate-shipping', { items })
  return res.data.data 
}
