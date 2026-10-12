import { apiClient } from "@/lib/api-client";
import {
  ChangeOrderStatusInput,
  CreateOrderInput,
  Order,
  OrderListResponse,
  OrderQueryParams,
  UpdateOrderItemsInput,
} from "./types";

export const ordersApi = {
  getOrders: (params?: OrderQueryParams): Promise<OrderListResponse> => {
    return apiClient.get("/orders", { params });
  },

  getOrderById: (id: number): Promise<Order> => {
    return apiClient.get(`/orders/${id}`);
  },

  createOrder: (data: CreateOrderInput): Promise<Order> => {
    return apiClient.post("/orders", data);
  },

  updateOrderItems: (id: number, data: UpdateOrderItemsInput): Promise<Order> => {
    return apiClient.put(`/orders/${id}/items`, data);
  },

  changeStatus: (
    id: number,
    data: ChangeOrderStatusInput
  ): Promise<Order> => {
    return apiClient.patch(`/orders/${id}/status`, data);
  },

  checkoutOrder: (id: number): Promise<{ paymentUrl: string; expiresAt: string }> => {
    return apiClient.post(`/orders/${id}/checkout`);
  },
};
