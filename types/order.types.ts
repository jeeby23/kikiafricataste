export type OrderStatus = 'PENDING_PAYMENT' | 'CONFIRMED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  pricingType: 'FIXED' | 'PER_KG';
  quantity?: number | null;
  weightKg?: number | null;
  unitPrice: number;
  subtotal: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images?: Array<{ url: string; isPrimary: boolean }>;
  };
}

export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  customerName: string;
  customerEmail: string;
  customerWhatsapp: string;
  deliveryAddress: string;
  deliveryCity: string;
  deliveryPostCode:string
  deliveryState: string;
  notes?: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  expiresAt?: string;
  confirmedAt?: string | null;
  cancelledAt?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface OrdersResponse {
  data: {
    orders: Order[];
    total: number;
    page: number;
    limit: number;
  };
  error: string | null;
}

export interface OrderResponse {
  data: Order;
  error: string | null;
}