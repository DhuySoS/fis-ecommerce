import { apiClient } from "@/lib/api-client";
import {
  Category,
  CategoryListResponse,
  CategoryQueryParams,
  CategorySummary,
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./types";

interface ApiResponseWrapper<T> {
  success?: boolean;
  message?: string;
  data?: T;
  code?: string;
}

interface SpringPage<T> {
  content?: T[];
  items?: T[];
  totalElements?: number;
  total?: number;
  pageNumber?: number;
  page?: number;
  pageSize?: number;
  size?: number;
}

export const categoriesApi = {
  getCategories: async (
    params?: CategoryQueryParams,
  ): Promise<CategoryListResponse> => {
    const queryParams: Record<string, unknown> = {};

    if (params?.page) {
      queryParams.page = params.page - 1; // Spring Boot Pageable sử dụng 0-index
    }
    if (params?.pageSize) {
      queryParams.size = params.pageSize;
    }
    if (params?.keyword) {
      queryParams.keyword = params.keyword;
    }
    if (params?.managedByUserId) {
      queryParams.managedByUserId = params.managedByUserId;
    }
    if (params?.sortBy) {
      const order = params.sortOrder === "descend" ? "desc" : "asc";
      queryParams.sort = `${params.sortBy},${order}`;
    }

    const res = await apiClient.get<
      unknown,
      ApiResponseWrapper<SpringPage<Category>> | SpringPage<Category>
    >("/categories", { params: queryParams });

    const pageData =
      res && typeof res === "object" && "data" in res && res.data
        ? res.data
        : (res as SpringPage<Category>);

    const items: Category[] =
      pageData?.content ||
      pageData?.items ||
      (Array.isArray(pageData) ? (pageData as Category[]) : []);
    const total: number =
      pageData?.totalElements ?? pageData?.total ?? items.length;
    const page: number =
      (pageData?.pageNumber !== undefined ? pageData.pageNumber + 1 : pageData?.page) ??
      (params?.page || 1);
    const pageSize: number =
      pageData?.pageSize ?? pageData?.size ?? (params?.pageSize || 20);

    return {
      items,
      total,
      page,
      pageSize,
    };
  },

  getMyManagedCategories: async (): Promise<CategorySummary[]> => {
    const res = await apiClient.get<
      unknown,
      ApiResponseWrapper<CategorySummary[]> | CategorySummary[]
    >("/categories/my-categories");

    if (res && typeof res === "object" && "data" in res && Array.isArray(res.data)) {
      return res.data;
    }
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  },

  getCategoryById: async (id: number): Promise<Category> => {
    const res = await apiClient.get<
      unknown,
      ApiResponseWrapper<Category> | Category
    >(`/categories/${id}`);

    if (res && typeof res === "object" && "data" in res && res.data) {
      return res.data;
    }
    return res as Category;
  },

  createCategory: (
    data: CreateCategoryInput,
  ): Promise<ApiResponseWrapper<Category>> => {
    return apiClient.post<unknown, ApiResponseWrapper<Category>>(
      "/categories",
      data,
    );
  },

  updateCategory: (
    id: number,
    data: UpdateCategoryInput,
  ): Promise<ApiResponseWrapper<Category>> => {
    return apiClient.put<unknown, ApiResponseWrapper<Category>>(
      `/categories/${id}`,
      data,
    );
  },

  deleteCategory: (id: number): Promise<ApiResponseWrapper<void>> => {
    return apiClient.delete<unknown, ApiResponseWrapper<void>>(
      `/categories/${id}`,
    );
  },
};
