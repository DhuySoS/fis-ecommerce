import { apiClient } from "@/lib/api-client";
import {
  CreateProductInput,
  Product,
  ProductListResponse,
  ProductQueryParams,
  UpdateProductInput,
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

export const productsApi = {
  getProducts: async (
    params?: ProductQueryParams,
  ): Promise<ProductListResponse> => {
    const queryParams: Record<string, unknown> = {};

    if (params?.page) {
      queryParams.page = params.page - 1; // Spring Boot Pageable sử dụng 0-index
    }
    if (params?.pageSize) {
      queryParams.size = params.pageSize;
    }
    if (params?.search) {
      queryParams.keyword = params.search;
    }
    if (params?.status) {
      queryParams.status = params.status;
    }
    if (params?.categoryId) {
      queryParams.categoryId = params.categoryId;
    }
    if (params?.sortBy) {
      const order = params.sortOrder === "descend" ? "desc" : "asc";
      queryParams.sort = `${params.sortBy},${order}`;
    }

    const res = await apiClient.get<
      unknown,
      ApiResponseWrapper<SpringPage<Product>> | SpringPage<Product>
    >("/products", { params: queryParams });

    const pageData =
      res && typeof res === "object" && "data" in res && res.data
        ? res.data
        : (res as SpringPage<Product>);

    const items: Product[] =
      pageData?.content ||
      pageData?.items ||
      (Array.isArray(pageData) ? (pageData as Product[]) : []);
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

  getProductById: async (id: number): Promise<Product> => {
    const res = await apiClient.get<
      unknown,
      ApiResponseWrapper<Product> | Product
    >(`/products/${id}`);

    if (res && typeof res === "object" && "data" in res && res.data) {
      return res.data;
    }
    return res as Product;
  },

  createProduct: (
    data: CreateProductInput,
  ): Promise<ApiResponseWrapper<Product>> => {
    return apiClient.post<unknown, ApiResponseWrapper<Product>>(
      "/products",
      data,
    );
  },

  updateProduct: (
    id: number,
    data: UpdateProductInput,
  ): Promise<ApiResponseWrapper<Product>> => {
    return apiClient.put<unknown, ApiResponseWrapper<Product>>(
      `/products/${id}`,
      data,
    );
  },

  deleteProduct: (id: number): Promise<ApiResponseWrapper<void>> => {
    return apiClient.delete<unknown, ApiResponseWrapper<void>>(
      `/products/${id}`,
    );
  },
};
