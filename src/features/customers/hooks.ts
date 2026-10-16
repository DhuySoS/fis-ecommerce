import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { customersApi } from "./api";
import { CreateCustomerInput, CustomerQueryParams, UpdateCustomerInput } from "./types";

export const CUSTOMER_KEYS = {
  all: ["customers"] as const,
  lists: () => [...CUSTOMER_KEYS.all, "list"] as const,
  list: (params?: CustomerQueryParams) => [...CUSTOMER_KEYS.lists(), params] as const,
  details: () => [...CUSTOMER_KEYS.all, "detail"] as const,
  detail: (id: number) => [...CUSTOMER_KEYS.details(), id] as const,
};

export function useCustomers(
  params?: CustomerQueryParams,
  options?: { enabled?: boolean },
) {
  return useQuery({
    queryKey: CUSTOMER_KEYS.list(params),
    queryFn: () => customersApi.getCustomers(params),
    enabled: options?.enabled,
  });
}

export function useCustomer(id: number) {
  return useQuery({
    queryKey: CUSTOMER_KEYS.detail(id),
    queryFn: () => customersApi.getCustomerById(id),
    enabled: !!id,
  });
}

export function useCreateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCustomerInput) => customersApi.createCustomer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.lists() });
    },
  });
}

export function useUpdateCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCustomerInput }) =>
      customersApi.updateCustomer(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => customersApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.lists() });
    },
  });
}

export function useResendCustomerActivation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => customersApi.resendActivation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CUSTOMER_KEYS.lists() });
    },
  });
}

