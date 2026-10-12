import { apiClient } from "@/lib/api-client";
import {
  CreateCustomerInput,
  Customer,
  CustomerListResponse,
  CustomerQueryParams,
  UpdateCustomerInput,
} from "./types";

export const customersApi = {
  getCustomers: (params?: CustomerQueryParams): Promise<CustomerListResponse> => {
    return apiClient.get("/customers", { params });
  },

  getCustomerById: (id: number): Promise<Customer> => {
    return apiClient.get(`/customers/${id}`);
  },

  createCustomer: (data: CreateCustomerInput): Promise<Customer> => {
    return apiClient.post("/customers", data);
  },

  updateCustomer: (id: number, data: UpdateCustomerInput): Promise<Customer> => {
    return apiClient.put(`/customers/${id}`, data);
  },

  deleteCustomer: (id: number): Promise<{ success: boolean; message?: string }> => {
    return apiClient.delete(`/customers/${id}`);
  },
};
