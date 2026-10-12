import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ordersApi } from "./api";
import {
  ChangeOrderStatusInput,
  CreateOrderInput,
  OrderQueryParams,
  UpdateOrderItemsInput,
} from "./types";

export const ORDER_KEYS = {
  all: ["orders"] as const,
  lists: () => [...ORDER_KEYS.all, "list"] as const,
  list: (params?: OrderQueryParams) => [...ORDER_KEYS.lists(), params] as const,
  details: () => [...ORDER_KEYS.all, "detail"] as const,
  detail: (id: number) => [...ORDER_KEYS.details(), id] as const,
};

export function useOrders(params?: OrderQueryParams) {
  return useQuery({
    queryKey: ORDER_KEYS.list(params),
    queryFn: () => ordersApi.getOrders(params),
  });
}

export function useOrder(id: number, options?: { refetchInterval?: number | false }) {
  return useQuery({
    queryKey: ORDER_KEYS.detail(id),
    queryFn: () => ordersApi.getOrderById(id),
    enabled: !!id,
    refetchInterval: options?.refetchInterval,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateOrderInput) => ordersApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
    },
  });
}

export function useUpdateOrderItems() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateOrderItemsInput }) =>
      ordersApi.updateOrderItems(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
    },
  });
}

export function useChangeOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: ChangeOrderStatusInput }) =>
      ordersApi.changeStatus(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.lists() });
    },
  });
}

export function useCheckoutOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => ordersApi.checkoutOrder(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ORDER_KEYS.detail(id) });
    },
  });
}
