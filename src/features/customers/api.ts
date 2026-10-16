import { apiClient } from "@/lib/api-client";
import {
  CreateCustomerInput,
  Customer,
  CustomerActionResponse,
  CustomerListResponse,
  CustomerQueryParams,
  UpdateCustomerInput,
} from "./types";

interface ApiResponseWrapper<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export const customersApi = {
  getCustomers: async (
    params?: CustomerQueryParams,
  ): Promise<CustomerListResponse> => {
    const res = await apiClient.get<
      unknown,
      ApiResponseWrapper<Customer[]> | Customer[]
    >("/customers", { params });

    let items: Customer[] = [];
    if (res && typeof res === "object" && "data" in res && Array.isArray(res.data)) {
      items = res.data;
    } else if (Array.isArray(res)) {
      items = res;
    }

    return {
      items,
      total: items.length,
      page: params?.page || 1,
      pageSize: params?.pageSize || items.length,
    };
  },

  getCustomerById: async (id: number): Promise<Customer> => {
    const res = await apiClient.get<
      unknown,
      ApiResponseWrapper<Customer> | Customer
    >(`/customers/${id}`);

    if (res && typeof res === "object" && "data" in res && res.data) {
      return res.data;
    }
    return res as Customer;
  },

  createCustomer: async (
    data: CreateCustomerInput,
  ): Promise<CustomerActionResponse<Customer>> => {
    const res = await apiClient.post<
      unknown,
      CustomerActionResponse<Customer>
    >("/customers", data);

    return res;
  },

  updateCustomer: async (
    id: number,
    data: UpdateCustomerInput,
  ): Promise<CustomerActionResponse<Customer>> => {
    const res = await apiClient.put<
      unknown,
      CustomerActionResponse<Customer>
    >(`/customers/${id}`, data);

    return res;
  },

  deleteCustomer: async (id: number): Promise<CustomerActionResponse<void>> => {
    const res = await apiClient.delete<unknown, CustomerActionResponse<void>>(
      `/customers/${id}`,
    );
    return res;
  },

  resendActivation: async (id: number): Promise<CustomerActionResponse<void>> => {
    const res = await apiClient.post<unknown, CustomerActionResponse<void>>(
      `/customers/${id}/resend-activation`,
    );
    return res;
  },
};
