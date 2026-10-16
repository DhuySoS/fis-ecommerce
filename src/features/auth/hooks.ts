import { useMutation, useQuery } from "@tanstack/react-query";
import { authApi } from "./api";
import type { LoginRequest, RegisterRequest, SetPasswordRequest } from "./types";

export function useLogin() {
  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authApi.logout(),
  });
}

export function useMe(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ["users", "me"],
    queryFn: () => authApi.getMe(),
    enabled: options?.enabled,
  });
}

export function useVerifyActivationToken(token: string | null) {
  return useQuery({
    queryKey: ["auth", "activation", "verify", token],
    queryFn: () => authApi.verifyActivationToken(token!),
    enabled: Boolean(token),
    retry: false,
  });
}

export function useSetPasswordAndActivate() {
  return useMutation({
    mutationFn: (data: SetPasswordRequest) =>
      authApi.setPasswordAndActivate(data),
  });
}

