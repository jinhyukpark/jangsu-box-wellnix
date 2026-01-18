import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Admin } from "@shared/schema";

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
      const res = await fetch("/api/admin/auth/me", { credentials: "include" });
      if (!res.ok) {
        throw new Error("Failed to fetch admin auth");
      }
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useAdminLogin() {
  const queryClient = useQueryClient();
  
  return useMutation<AdminLoginResponse, Error, { email: string; password: string }>({
    mutationFn: async (credentials) => {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(credentials),
      });
      if (!res.ok) {
        const error = await res.json().catch(() => ({ error: "로그인 실패" }));
        throw new Error(error.error || "로그인에 실패했습니다");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "auth"] });
    },
  });
}

export function useAdminLogout() {
  const queryClient = useQueryClient();
  
  return useMutation<{ success: boolean }, Error>({
    mutationFn: async () => {
      const res = await fetch("/api/admin/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error("로그아웃 실패");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "auth"] });
      queryClient.invalidateQueries({ queryKey: ["admin"] });
    },
  });
}
