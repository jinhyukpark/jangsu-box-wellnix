import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Member } from "@shared/schema";

type AuthMember = Omit<Member, "password">;

interface LoginData {
  email: string;
  password: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  authProvider?: string;
}

async function fetchCurrentUser(): Promise<AuthMember | null> {
  const res = await fetch("/api/auth/me", { credentials: "include" });
  if (!res.ok) return null;
  
  const text = await res.text();
  if (!text) return null;
  
  try {
    const data = JSON.parse(text);
    return data.member || null;
  } catch (e) {
    console.error("JSON 파싱 오류:", text);
    return null;
  }
}

async function login(data: LoginData): Promise<AuthMember> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  
  // 응답 본문 확인
  const text = await res.text();
  if (!text) {
    throw new Error("서버에서 응답이 없습니다. 잠시 후 다시 시도해주세요.");
  }
  
  let result;
  try {
    result = JSON.parse(text);
  } catch (e) {
    console.error("JSON 파싱 오류:", text);
    throw new Error("서버 응답을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.");
  }
  
  if (!res.ok) {
    throw new Error(result.error || result.message || "로그인에 실패했습니다");
  }
  
  if (!result.member) {
    throw new Error("로그인 정보를 받아올 수 없습니다.");
  }
  
  return result.member;
}

async function register(data: RegisterData): Promise<AuthMember> {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });
  
  // 응답 본문 확인
  const text = await res.text();
  if (!text) {
    throw new Error("서버에서 응답이 없습니다. 잠시 후 다시 시도해주세요.");
  }
  
  let result;
  try {
    result = JSON.parse(text);
  } catch (e) {
    console.error("JSON 파싱 오류:", text);
    throw new Error("서버 응답을 처리할 수 없습니다. 잠시 후 다시 시도해주세요.");
  }
  
  if (!res.ok) {
    throw new Error(result.error || result.message || "회원가입에 실패했습니다");
  }
  
  if (!result.member) {
    throw new Error("회원가입 정보를 받아올 수 없습니다.");
  }
  
  return result.member;
}

async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export function useAuth() {
  const queryClient = useQueryClient();

  const { data: user, isLoading, refetch } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: fetchCurrentUser,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (member) => {
      queryClient.setQueryData(["auth", "me"], member);
    },
  });

  const registerMutation = useMutation({
    mutationFn: register,
    onSuccess: (member) => {
      queryClient.setQueryData(["auth", "me"], member);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["auth", "me"], null);
      // 사용자 관련 쿼리만 무효화 (관리자 쿼리 영향 방지)
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    refetch,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
  };
}
