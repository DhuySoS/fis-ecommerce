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

export interface UserProfileResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  status?: string;
  customerId?: number;
}

export interface ActivationVerifyResponse {
  valid: boolean;
  message: string;
  username?: string;
  email?: string;
  name?: string;
}

export interface SetPasswordRequest {
  token: string;
  newPassword: string;
}

