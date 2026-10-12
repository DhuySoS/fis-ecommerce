import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { productsApi } from "./api";
import { CreateProductInput, ProductQueryParams, UpdateProductInput } from "./types";

export const PRODUCT_KEYS = {
  all: ["products"] as const,
  lists: () => [...PRODUCT_KEYS.all, "list"] as const,
  list: (params?: ProductQueryParams) => [...PRODUCT_KEYS.lists(), params] as const,
  details: () => [...PRODUCT_KEYS.all, "detail"] as const,
  detail: (id: number) => [...PRODUCT_KEYS.details(), id] as const,
};

export function useProducts(params?: ProductQueryParams) {
  return useQuery({
    queryKey: PRODUCT_KEYS.list(params),
    queryFn: () => productsApi.getProducts(params),
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: PRODUCT_KEYS.detail(id),
    queryFn: () => productsApi.getProductById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateProductInput) => productsApi.createProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateProductInput }) =>
      productsApi.updateProduct(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.detail(variables.id) });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => productsApi.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PRODUCT_KEYS.lists() });
    },
  });
}
