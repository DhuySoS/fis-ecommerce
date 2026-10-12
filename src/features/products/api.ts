import { apiClient } from "@/lib/api-client";
import {
  CreateProductInput,
  Product,
  ProductListResponse,
  ProductQueryParams,
  UpdateProductInput,
} from "./types";

export const productsApi = {
  getProducts: (params?: ProductQueryParams): Promise<ProductListResponse> => {
    return apiClient.get("/products", { params });
  },

  getProductById: (id: number): Promise<Product> => {
    return apiClient.get(`/products/${id}`);
  },

  createProduct: (data: CreateProductInput): Promise<Product> => {
    return apiClient.post("/products", data);
  },

  updateProduct: (id: number, data: UpdateProductInput): Promise<Product> => {
    return apiClient.put(`/products/${id}`, data);
  },

  deleteProduct: (id: number): Promise<{ success: boolean; message?: string }> => {
    return apiClient.delete(`/products/${id}`);
  },
};
