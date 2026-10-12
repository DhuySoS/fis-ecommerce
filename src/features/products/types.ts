export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
}

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ProductStatus;
  sortBy?: "name" | "price";
  sortOrder?: "ascend" | "descend";
}

export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}
