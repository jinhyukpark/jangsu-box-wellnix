/**
 * API Response & Request Types for Spring Boot Backend Integration
 * 웰닉스 이커머스 플랫폼 API 타입 정의
 */

// ============================================================================
// Common Types
// ============================================================================

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ============================================================================
// Product Types
// ============================================================================

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviewCount: number;
  stock?: number;
  status?: 'active' | 'inactive' | 'soldout';
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilterParams extends PaginationParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

// ============================================================================
// Subscription Types (장수박스)
// ============================================================================

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  popular: boolean;
}

export interface Subscription {
  id: string;
  memberId: string;
  memberName: string;
  planId: string;
  planName: string;
  startDate: string;
  nextDeliveryDate: string;
  status: 'active' | 'paused' | 'cancelled';
  amount: number;
}

export interface MonthlyBox {
  id: string;
  month: string;
  theme: string;
  highlight: string;
  image: string;
}

// ============================================================================
// Member Types
// ============================================================================

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
  status: 'active' | 'dormant' | 'withdrawn';
  subscription?: string;
  address?: string;
}

export interface MemberHistory {
  orders: Order[];
  reviews: Review[];
  events: EventParticipation[];
}

// ============================================================================
// Order & Payment Types
// ============================================================================

export interface Order {
  id: string;
  memberId: string;
  memberName?: string;
  product: string;
  productId?: string;
  date: string;
  amount: number;
  status: 'pending' | 'paid' | 'shipping' | 'delivered' | 'cancelled';
}

export interface Payment {
  id: string;
  memberId: string;
  memberName: string;
  amount: number;
  method: 'card' | 'transfer' | 'virtual_account';
  status: 'completed' | 'pending' | 'failed' | 'refunded';
  date: string;
}

// ============================================================================
// Shipping Types
// ============================================================================

export interface Shipping {
  id: string;
  orderId?: string;
  memberId: string;
  memberName: string;
  address: string;
  status: 'preparing' | 'shipping' | 'delivered';
  trackingNo?: string;
  date: string;
}

// ============================================================================
// Review Types
// ============================================================================

export interface Review {
  id: number;
  productId: string | null;
  productName: string;
  productImage: string;
  rating: number;
  date: string;
  content: string;
  options?: string;
  memberId?: string;
  memberName?: string;
}

export interface ReviewCreateRequest {
  productId: string;
  rating: number;
  content: string;
  options?: string;
}

// ============================================================================
// Event Types
// ============================================================================

export interface Event {
  id: string;
  title: string;
  date: string;
  time?: string;
  location: string;
  participants: number;
  maxParticipants: number;
  status: 'recruiting' | 'closed' | 'cancelled';
  image?: string;
  tag?: string;
  description: string;
  participantList?: EventParticipant[];
}

export interface EventParticipant {
  id?: string;
  name: string;
  phone: string;
  status: 'applied' | 'confirmed' | 'cancelled';
}

export interface EventParticipation {
  eventId: string;
  title: string;
  date: string;
  status: 'applied' | 'confirmed' | 'attended' | 'cancelled';
}

// ============================================================================
// Inquiry Types
// ============================================================================

export interface Inquiry {
  id: string;
  memberId: string;
  memberName: string;
  subject: string;
  category: 'product' | 'shipping' | 'payment' | 'subscription' | 'exchange' | 'etc';
  status: 'pending' | 'in_progress' | 'answered';
  date: string;
  content?: string;
  answer?: string;
  answeredAt?: string;
}

export interface InquiryCreateRequest {
  subject: string;
  category: string;
  content: string;
}

// ============================================================================
// FAQ Types
// ============================================================================

export interface FAQ {
  id: number;
  category: string;
  question: string;
  answer?: string;
  status: 'published' | 'hidden';
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQCreateRequest {
  category: string;
  question: string;
  answer: string;
  status?: 'published' | 'hidden';
}

// ============================================================================
// Notice Types
// ============================================================================

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'event' | 'system' | 'update';
  important: boolean;
  views: number;
  createdAt: string;
  updatedAt?: string;
}

// ============================================================================
// Admin Types
// ============================================================================

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin?: string;
  permissions: string[];
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminCreateRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  permissions: string[];
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalMembers: number;
  activeSubscriptions: number;
  todaySales?: number;
  todayOrders?: number;
}
