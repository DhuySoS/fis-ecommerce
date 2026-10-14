import { apiClient } from "@/lib/api-client";
import {
  CreateProductInput,
  Product,
  ProductListResponse,
  ProductQueryParams,
  UpdateProductInput,
} from "./types";

export const productsApi = {
  getProducts: async (params?: ProductQueryParams): Promise<ProductListResponse> => {
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
    if (params?.sortBy) {
      const order = params.sortOrder === "descend" ? "desc" : "asc";
      queryParams.sort = `${params.sortBy},${order}`;
    }

    const res: any = await apiClient.get("/products", { params: queryParams });
    const pageData = res?.data || res;
    const items: Product[] = pageData?.content || pageData?.items || (Array.isArray(pageData) ? pageData : []);
    const total: number = pageData?.totalElements ?? pageData?.total ?? items.length;
    const page: number =
      (pageData?.pageNumber !== undefined ? pageData.pageNumber + 1 : pageData?.page) ?? (params?.page || 1);
    const pageSize: number = pageData?.pageSize ?? pageData?.size ?? (params?.pageSize || 20);

    return {
      items,
      total,
      page,
      pageSize,
    };
  },

  getProductById: (id: number): Promise<any> => {
    return apiClient.get(`/products/${id}`);
  },

  createProduct: (data: CreateProductInput): Promise<any> => {
    return apiClient.post("/products", data);
  },

  updateProduct: (id: number, data: UpdateProductInput): Promise<any> => {
    return apiClient.put(`/products/${id}`, data);
  },

  deleteProduct: (id: number): Promise<any> => {
    return apiClient.delete(`/products/${id}`);
  },
};
