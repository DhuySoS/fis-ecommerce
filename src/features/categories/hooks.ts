import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoriesApi } from "./api";
import {
  CategoryQueryParams,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./types";

export const CATEGORY_KEYS = {
  all: ["categories"] as const,
  lists: () => [...CATEGORY_KEYS.all, "list"] as const,
  list: (params?: CategoryQueryParams) =>
    [...CATEGORY_KEYS.lists(), params] as const,
  myManaged: () => [...CATEGORY_KEYS.all, "my-managed"] as const,
  details: () => [...CATEGORY_KEYS.all, "detail"] as const,
  detail: (id: number) => [...CATEGORY_KEYS.details(), id] as const,
};

export function useCategories(params?: CategoryQueryParams) {
  return useQuery({
    queryKey: CATEGORY_KEYS.list(params),
    queryFn: () => categoriesApi.getCategories(params),
  });
}

export function useMyManagedCategories() {
  return useQuery({
    queryKey: CATEGORY_KEYS.myManaged(),
    queryFn: () => categoriesApi.getMyManagedCategories(),
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: CATEGORY_KEYS.detail(id),
    queryFn: () => categoriesApi.getCategoryById(id),
    enabled: !!id,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateCategoryInput) =>
      categoriesApi.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryInput }) =>
      categoriesApi.updateCategory(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: CATEGORY_KEYS.detail(variables.id),
      });
    },
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CATEGORY_KEYS.all });
    },
  });
}
