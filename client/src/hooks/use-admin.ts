import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { 
  Product, Category, Member, Subscription, SubscriptionPlan,
  Event, Inquiry, Faq, Admin, Notice
} from "@shared/schema";

async function fetchWithAuth(url: string, options?: RequestInit) {
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "요청 실패" }));
    throw new Error(error.message || "요청 실패");
  }
  return res.json();
}

export function useAdminProducts() {
  return useQuery<Product[]>({
    queryKey: ["admin", "products"],
    queryFn: () => fetchWithAuth("/api/admin/products"),
  });
}

export function useAdminCategories() {
  return useQuery<Category[]>({
    queryKey: ["admin", "categories"],
    queryFn: () => fetchWithAuth("/api/categories"),
  });
}

export function useAdminMembers() {
  return useQuery<Member[]>({
    queryKey: ["admin", "members"],
    queryFn: () => fetchWithAuth("/api/admin/members"),
  });
}

export function useAdminSubscriptions() {
  return useQuery<(Subscription & { member?: Member; plan?: SubscriptionPlan })[]>({
    queryKey: ["admin", "subscriptions"],
    queryFn: () => fetchWithAuth("/api/admin/subscriptions"),
  });
}

export function useAdminSubscriptionPlans() {
  return useQuery<SubscriptionPlan[]>({
    queryKey: ["admin", "subscription-plans"],
    queryFn: () => fetchWithAuth("/api/admin/subscription-plans"),
  });
}

export function useCreateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<SubscriptionPlan>) => 
      fetchWithAuth("/api/admin/subscription-plans", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "subscription-plans"] }),
  });
}

export function useUpdateSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<SubscriptionPlan> & { id: number }) => 
      fetchWithAuth(`/api/admin/subscription-plans/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "subscription-plans"] }),
  });
}

export function useDeleteSubscriptionPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      fetchWithAuth(`/api/admin/subscription-plans/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "subscription-plans"] }),
  });
}

export function useReorderSubscriptionPlans() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orders: { id: number; displayOrder: number }[]) =>
      fetchWithAuth("/api/admin/subscription-plans/reorder", { method: "PUT", body: JSON.stringify({ orders }) }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "subscription-plans"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscription-plans"] });
    },
  });
}

export function useAdminEvents() {
  return useQuery<Event[]>({
    queryKey: ["admin", "events"],
    queryFn: () => fetchWithAuth("/api/events"),
  });
}

export function useAdminInquiries() {
  return useQuery<(Inquiry & { member?: Member })[]>({
    queryKey: ["admin", "inquiries"],
    queryFn: () => fetchWithAuth("/api/admin/inquiries"),
  });
}

export function useAdminFaqs() {
  return useQuery<Faq[]>({
    queryKey: ["admin", "faqs"],
    queryFn: () => fetchWithAuth("/api/faqs"),
  });
}

export function useAdminNotices() {
  return useQuery<Notice[]>({
    queryKey: ["admin", "notices"],
    queryFn: () => fetchWithAuth("/api/notices"),
  });
}

export function useAdminList() {
  return useQuery<Admin[]>({
    queryKey: ["admin", "admins"],
    queryFn: () => fetchWithAuth("/api/admin/admins"),
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Product>) => 
      fetchWithAuth("/api/products", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Product> & { id: number }) => 
      fetchWithAuth(`/api/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      fetchWithAuth(`/api/products/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "products"] }),
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Category>) => 
      fetchWithAuth("/api/admin/categories", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Category> & { id: number }) => 
      fetchWithAuth(`/api/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      fetchWithAuth(`/api/admin/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "categories"] }),
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Event>) => 
      fetchWithAuth("/api/admin/events", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "events"] }),
  });
}

export function useUpdateEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Event> & { id: number }) => 
      fetchWithAuth(`/api/admin/events/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "events"] }),
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      fetchWithAuth(`/api/admin/events/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "events"] }),
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Faq>) => 
      fetchWithAuth("/api/admin/faqs", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] }),
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Faq> & { id: number }) => 
      fetchWithAuth(`/api/admin/faqs/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] }),
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      fetchWithAuth(`/api/admin/faqs/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "faqs"] }),
  });
}

export function useReplyInquiry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reply }: { id: number; reply: string }) => 
      fetchWithAuth(`/api/inquiries/${id}/reply`, { method: "POST", body: JSON.stringify({ reply }) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] }),
  });
}

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Admin>) => 
      fetchWithAuth("/api/admin/admins", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "admins"] }),
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Admin> & { id: number }) => 
      fetchWithAuth(`/api/admin/admins/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "admins"] }),
  });
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => 
      fetchWithAuth(`/api/admin/admins/${id}`, { method: "DELETE" }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "admins"] }),
  });
}

export function useDashboardStats() {
  return useQuery({
    queryKey: ["admin", "dashboard"],
    queryFn: () => fetchWithAuth("/api/admin/dashboard"),
  });
}

export interface MainPageSettings {
  id?: number;
  heroImage: string | null;
  heroLink: string | null;
  heroEnabled: boolean;
  bestProductsCriteria: "sales" | "manual";
  bestProductsManualIds: number[];
  bestProductsLimit: number;
  adBannerImage: string | null;
  adBannerLink: string | null;
  adBannerEnabled: boolean;
  newProductsCriteria: "recent" | "manual";
  newProductsManualIds: number[];
  newProductsLimit: number;
  newProductsDaysThreshold: number;
  eventsCriteria: "active" | "manual";
  eventsManualIds: number[];
  eventsLimit: number;
}

export function useMainPageSettings() {
  return useQuery<MainPageSettings>({
    queryKey: ["admin", "main-page-settings"],
    queryFn: () => fetchWithAuth("/api/admin/main-page-settings"),
  });
}

export function useUpdateMainPageSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<MainPageSettings>) =>
      fetchWithAuth("/api/admin/main-page-settings", { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => {
      // 관리자 캐시와 사용자 캐시 모두 무효화
      queryClient.invalidateQueries({ queryKey: ["admin", "main-page-settings"] });
      queryClient.invalidateQueries({ queryKey: ["/api/main-page-settings"] });
    },
  });
}
