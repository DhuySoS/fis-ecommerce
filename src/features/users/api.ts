import { apiClient } from "@/lib/api-client";
import type {
  RoleUpdateRequest,
  UserItem,
  UserRole,
  UserStatus,
  UserStatusUpdateRequest,
} from "./types";

interface ApiResponseWrapper<T> {
  success?: boolean;
  message?: string;
  data?: T;
  code?: string;
}

export const usersApi = {
  getUsers: async (): Promise<UserItem[]> => {
    const res = await apiClient.get<
      unknown,
      ApiResponseWrapper<UserItem[]> | UserItem[]
    >("/users");

    if (res && typeof res === "object" && "data" in res && Array.isArray(res.data)) {
      return res.data;
    }
    if (Array.isArray(res)) {
      return res;
    }
    return [];
  },

  updateRole: async (
    id: number,
    role: UserRole,
  ): Promise<ApiResponseWrapper<UserItem>> => {
    const payload: RoleUpdateRequest = { role };
    const res = await apiClient.patch<
      unknown,
      ApiResponseWrapper<UserItem>
    >(`/users/${id}/role`, payload);

    return res;
  },

  updateStatus: async (
    id: number,
    status: UserStatus,
  ): Promise<ApiResponseWrapper<UserItem>> => {
    const payload: UserStatusUpdateRequest = { status };
    const res = await apiClient.patch<
      unknown,
      ApiResponseWrapper<UserItem>
    >(`/users/${id}/status`, payload);

    return res;
  },
};
