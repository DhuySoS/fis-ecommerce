export interface CategoryUser {
  id: number;
  username: string;
  fullName?: string;
  email?: string;
  role: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
  description?: string;
  managedBy?: CategoryUser | null;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategorySummary {
  id: number;
  name: string;
  code: string;
  managedByUserId?: number | null;
  managedByUsername?: string | null;
}

export interface CategoryQueryParams {
  page?: number;
  pageSize?: number;
  keyword?: string;
  managedByUserId?: number;
  sortBy?: "id" | "name" | "code";
  sortOrder?: "ascend" | "descend";
}

export interface CreateCategoryInput {
  name: string;
  code: string;
  description?: string;
  managedByUserId?: number | null;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;

export interface CategoryListResponse {
  items: Category[];
  total: number;
  page: number;
  pageSize: number;
}
