export type CustomerStatus = "ACTIVE" | "INACTIVE";

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  status: CustomerStatus;
}

export interface CustomerQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
}

export interface CreateCustomerInput {
  name: string;
  email: string;
  phone?: string;
  status?: CustomerStatus;
}

export type UpdateCustomerInput = Partial<CreateCustomerInput>;

export interface CustomerListResponse {
  items: Customer[];
  total: number;
  page: number;
  pageSize: number;
}
