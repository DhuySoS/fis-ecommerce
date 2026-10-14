import { apiClient } from "@/lib/api-client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  UserResponse,
} from "./types";

interface ApiResponseWrapper<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await apiClient.post<
      unknown,
      ApiResponseWrapper<LoginResponse> | LoginResponse
    >("/auth/login", data);

    if (res && "data" in res && res.data) {
      return res.data;
    }
    return res as LoginResponse;
  },

  register: async (data: RegisterRequest): Promise<UserResponse> => {
    const res = await apiClient.post<
      unknown,
      ApiResponseWrapper<UserResponse> | UserResponse
    >("/auth/register", data);

    if (res && "data" in res && res.data) {
      return res.data;
    }
    return res as UserResponse;
  },

  logout: async (): Promise<void> => {
    return apiClient.post("/auth/logout");
  },
};
