import { create } from "zustand";
import {
  saveAuthTokens,
  clearAuthTokens,
  getAccessToken,
  getStoredUser,
  getCookie,
  setCookie,
} from "@/lib/token";
import { authApi } from "./api";
import type { LoginResponse } from "./types";

export interface AuthUser {
  username: string;
  role: string;
  customerId?: number;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;

  setAuth: (response: LoginResponse) => void;
  updateAccessToken: (accessToken: string, refreshToken?: string) => void;
  clearAuth: () => void;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => {
  const initialToken = typeof window !== "undefined" ? getAccessToken() : null;
  const initialUser = typeof window !== "undefined" ? getStoredUser() : null;

  // Đồng bộ cookie role nếu user đã đăng nhập nhưng cookie role chưa có
  if (
    typeof window !== "undefined" &&
    initialUser?.role &&
    !getCookie("role")
  ) {
    setCookie("role", initialUser.role);
  }

  return {
    user: initialUser,
    accessToken: initialToken,
    isAuthenticated: Boolean(initialToken),

    setAuth: (response: LoginResponse) => {
      const user: AuthUser = {
        username: response.username,
        role: response.role,
        customerId: response.customerId,
      };

      // LocalStorage lưu accessToken, user ({ username, role }) và role; Cookie lưu refreshToken
      saveAuthTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: {
          username: response.username,
          role: response.role,
        },
        role: response.role,
      });

      set({
        user,
        accessToken: response.accessToken,
        isAuthenticated: true,
      });
    },

    updateAccessToken: (accessToken: string, refreshToken?: string) => {
      const currentUser = get().user;
      saveAuthTokens({
        accessToken,
        refreshToken,
        user: currentUser
          ? { username: currentUser.username, role: currentUser.role }
          : undefined,
        role: currentUser?.role,
      });

      set({
        accessToken,
        isAuthenticated: true,
      });
    },

    clearAuth: () => {
      clearAuthTokens();
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    },

    logout: async () => {
      try {
        if (get().accessToken) {
          await authApi.logout();
        }
      } catch {
        // Bỏ qua lỗi nếu token đã hết hạn hoặc server bận
      } finally {
        get().clearAuth();
        if (typeof window !== "undefined") {
          window.location.replace("/login");
        }
      }
    },
  };
});
