import { OrderStatus } from "@/lib/order-state-machine";

export interface OrderItem {
  id?: number;
  productId: number;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
}

export interface OrderHistoryEntry {
  id?: number;
  fromStatus: OrderStatus;
  toStatus: OrderStatus;
  timestamp: string;
  changedBy: string; // e.g. "admin", "SYSTEM"
  reason?: string;
}

export interface Order {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  status: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  paymentExpiresAt?: string;
  paidAt?: string;
  history?: OrderHistoryEntry[];
}

export interface CreateOrderItemInput {
  productId: number;
  quantity: number;
}

export interface CreateOrderInput {
  customerId: number;
  items: CreateOrderItemInput[];
}

export interface UpdateOrderItemsInput {
  items: CreateOrderItemInput[];
}

export interface ChangeOrderStatusInput {
  status: OrderStatus;
  reason?: string;
}

export interface OrderQueryParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus | "ALL";
  customerId?: number;
}

export interface OrderListResponse {
  items: Order[];
  total: number;
  page: number;
  pageSize: number;
}
