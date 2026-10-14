export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
  email: string;
  phone?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  customerId?: number;
  username: string;
  role: "ADMIN" | "PRODUCT_OWNER" | "CUSTOMER" | string;
}

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: string;
}
