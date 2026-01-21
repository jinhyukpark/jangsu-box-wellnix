import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Admin } from "@shared/schema";
import { apiClient } from "@/lib/api-client";

interface AdminAuthResponse {
  admin: Admin | null;
}

interface AdminLoginResponse {
  success: boolean;
  admin: Admin;
}

export function useAdminAuth() {
  return useQuery<AdminAuthResponse>({
    queryKey: ["admin", "auth"],
    queryFn: async () => {
      return apiClient.get<AdminAuthResponse>("/admin/auth/me");
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation<AdminLoginResponse, Error, { email: string; password: string }>({
    mutationFn: async (credentials) => {
      return apiClient.post<AdminLoginResponse>("/admin/auth/login", credentials);
    },
    onSuccess: (data) => {
      // 로그인 성공 시 즉시 캐시 업데이트 (깜빡임 방지)
      queryClient.setQueryData<AdminAuthResponse>(["admin", "auth"], { admin: data.admin });
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error>({
    mutationFn: async () => {
      return apiClient.post<{ success: boolean }>("/admin/auth/logout");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "auth"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}
