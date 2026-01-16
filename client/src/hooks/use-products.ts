import { useQuery } from "@tanstack/react-query";
import type { Product, Category, SubscriptionPlan, Event } from "@shared/schema";

async function fetchProducts(categoryId?: number): Promise<Product[]> {
  const url = categoryId ? `/api/products?categoryId=${categoryId}` : "/api/products";
  const res = await fetch(url);
  if (!res.ok) throw new Error("상품을 불러오는데 실패했습니다");
  return res.json();
}

async function fetchFeaturedProducts(): Promise<Product[]> {
  const res = await fetch("/api/products/featured");
  if (!res.ok) throw new Error("추천 상품을 불러오는데 실패했습니다");
  return res.json();
}

async function fetchProduct(id: number): Promise<Product> {
  const res = await fetch(`/api/products/${id}`);
  if (!res.ok) throw new Error("상품을 찾을 수 없습니다");
  return res.json();
}

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch("/api/categories");
  if (!res.ok) throw new Error("카테고리를 불러오는데 실패했습니다");
  return res.json();
}

async function fetchSubscriptionPlans(): Promise<SubscriptionPlan[]> {
  const res = await fetch("/api/subscription-plans");
  if (!res.ok) throw new Error("구독 플랜을 불러오는데 실패했습니다");
  return res.json();
}

async function fetchEvents(): Promise<Event[]> {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("행사를 불러오는데 실패했습니다");
  return res.json();
}

async function fetchEvent(id: number): Promise<Event> {
  const res = await fetch(`/api/events/${id}`);
  if (!res.ok) throw new Error("행사를 찾을 수 없습니다");
  return res.json();
}

export function useProducts(categoryId?: number) {
  return useQuery({
    queryKey: ["products", categoryId],
    queryFn: () => fetchProducts(categoryId),
  });
}

export function useFeaturedProducts() {
  return useQuery({
    queryKey: ["products", "featured"],
    queryFn: fetchFeaturedProducts,
  });
}

export function useProduct(id: number) {
  return useQuery({
    queryKey: ["products", id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useSubscriptionPlans() {
  return useQuery({
    queryKey: ["subscription-plans"],
    queryFn: fetchSubscriptionPlans,
  });
}

export function useEvents() {
  return useQuery({
    queryKey: ["events"],
    queryFn: fetchEvents,
  });
}

export function useEvent(id: number) {
  return useQuery({
    queryKey: ["events", id],
    queryFn: () => fetchEvent(id),
    enabled: !!id,
  });
}
