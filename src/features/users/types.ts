export type UserRole = "ADMIN" | "PRODUCT_OWNER" | "CUSTOMER";

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING_ACTIVATION";

export interface UserItem {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  customerId?: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface RoleUpdateRequest {
  role: UserRole;
}

export interface UserStatusUpdateRequest {
  status: UserStatus;
}

export interface UserQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole | "ALL";
  status?: UserStatus | "ALL";
}
