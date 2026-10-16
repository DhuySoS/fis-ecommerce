export type ProductStatus = "ACTIVE" | "INACTIVE";

export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
  categoryId?: number | null;
  categoryName?: string | null;
  categoryCode?: string | null;
  managedByUserId?: number | null;
  managedByUsername?: string | null;
}

export interface ProductQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: ProductStatus;
  categoryId?: number;
  sortBy?: "name" | "price";
  sortOrder?: "ascend" | "descend";
}

export interface CreateProductInput {
  name: string;
  price: number;
  stock: number;
  status: ProductStatus;
  categoryId?: number | null;
}

export type UpdateProductInput = Partial<CreateProductInput>;

export interface ProductListResponse {
  items: Product[];
  total: number;
  page: number;
  pageSize: number;
}
