/**
 * Admin Page Types
 * 관리자 페이지에서 사용하는 타입 정의
 */

import type { Product, Category, Event, SubscriptionPlan, Member, Faq, Admin, Promotion } from "@shared/schema";

// ============================================================================
// Product Form Types
// ============================================================================

export interface ProductFormData {
  name: string;
  categoryId: number;
  price: number;
  originalPrice: number;
  stock: number;
  status: string;
  description: string;
  image: string;
}

export const initialProductForm: ProductFormData = {
  name: "",
  categoryId: 0,
  price: 0,
  originalPrice: 0,
  stock: 0,
  status: "active",
  description: "",
  image: ""
};

// ============================================================================
// Category Form Types
// ============================================================================

export interface CategoryFormData {
  name: string;
  slug: string;
  displayOrder: number;
  isActive: boolean;
  image: string;
}

export const initialCategoryForm: CategoryFormData = {
  name: "",
  slug: "",
  displayOrder: 0,
  isActive: true,
  image: ""
};

// ============================================================================
// FAQ Form Types
// ============================================================================

export interface FaqFormData {
  category: string;
  question: string;
  answer: string;
  isActive: boolean;
  displayOrder: number;
}

export const initialFaqForm: FaqFormData = {
  category: "",
  question: "",
  answer: "",
  isActive: true,
  displayOrder: 0
};

// ============================================================================
// Subscription Plan Form Types
// ============================================================================

export interface PlanFormData {
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  features: string[];
  isPopular: boolean;
  isActive: boolean;
}

export const initialPlanForm: PlanFormData = {
  name: "",
  slug: "",
  description: "",
  price: 0,
  originalPrice: 0,
  features: [],
  isPopular: false,
  isActive: true,
};

// ============================================================================
// Branding Types
// ============================================================================

export interface BrandingData {
  key: string;
  title?: string | null;
  subtitle?: string | null;
  image?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  linkUrl?: string | null;
  linkText?: string | null;
  isActive?: boolean;
  displayOrder?: number;
}

// ============================================================================
// Product Filter/Sort Types
// ============================================================================

export type ProductSortField = "createdAt" | "name" | "price" | "stock";
export type SortOrder = "asc" | "desc";

export interface ProductFilters {
  searchQuery: string;
  statusFilter: string;
  categoryFilter: string;
  sortField: ProductSortField;
  sortOrder: SortOrder;
}

export const initialProductFilters: ProductFilters = {
  searchQuery: "",
  statusFilter: "all",
  categoryFilter: "all",
  sortField: "createdAt",
  sortOrder: "desc"
};

// ============================================================================
// Event Detail Types (for modal display)
// ============================================================================

export interface EventParticipant {
  name: string;
  phone: string;
  status: string;
}

export interface EventDetail extends Event {
  participantList?: EventParticipant[];
}

// ============================================================================
// Member Detail Types (for modal display)
// ============================================================================

export interface MemberOrder {
  id: string;
  product: string;
  date: string;
  amount: number;
  status: string;
}

export interface MemberReview {
  id: number;
  product: string;
  rating: number;
  content: string;
  date: string;
}

export interface MemberEventHistory {
  title: string;
  date: string;
  status: string;
}

export interface MemberHistory {
  orders: MemberOrder[];
  reviews: MemberReview[];
  events: MemberEventHistory[];
}

// ============================================================================
// Re-export schema types for convenience
// ============================================================================

export type { Product, Category, Event, SubscriptionPlan, Member, Faq, Admin, Promotion };
