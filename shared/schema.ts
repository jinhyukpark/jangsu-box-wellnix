import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// ============================================================================
// 회원 관리 (Members)
// ============================================================================

export const members = pgTable("members", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password"),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  authProvider: varchar("auth_provider", { length: 20 }).default("email"),
  status: varchar("status", { length: 20 }).default("active"),
  membershipLevel: varchar("membership_level", { length: 20 }).default("일반"),
  mileage: integer("mileage").default(0),
  profileImage: text("profile_image"),
  emailVerified: boolean("email_verified").default(false),
  emailVerifyToken: text("email_verify_token"),
  emailVerifyExpires: timestamp("email_verify_expires"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMemberSchema = createInsertSchema(members).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMember = z.infer<typeof insertMemberSchema>;
export type Member = typeof members.$inferSelect;

// ============================================================================
// 관리자 (Admins)
// ============================================================================

export const admins = pgTable("admins", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: text("password").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  role: varchar("role", { length: 50 }).notNull().default("일반 관리자"),
  status: varchar("status", { length: 20 }).default("active"),
  permissions: jsonb("permissions").$type<string[]>().default([]),
  lastLogin: timestamp("last_login"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAdminSchema = createInsertSchema(admins).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAdmin = z.infer<typeof insertAdminSchema>;
export type Admin = typeof admins.$inferSelect;

// ============================================================================
// 상품 카테고리 (Categories)
// ============================================================================

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  image: text("image"),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCategorySchema = createInsertSchema(categories).omit({
  id: true,
  createdAt: true,
});

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categories.$inferSelect;

// ============================================================================
// 상품 (Products)
// ============================================================================

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  shortDescription: text("short_description"),
  description: text("description"),
  descriptionMarkdown: text("description_markdown"),
  categoryId: integer("category_id").references(() => categories.id),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  image: text("image"),
  images: jsonb("images").$type<string[]>().default([]),
  stock: integer("stock").default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").default(0),
  status: varchar("status", { length: 20 }).default("active"),
  isFeatured: boolean("is_featured").default(false),
  origin: varchar("origin", { length: 100 }).default("국내산"),
  manufacturer: varchar("manufacturer", { length: 100 }).default("웰닉스(주)"),
  expirationInfo: varchar("expiration_info", { length: 255 }).default("별도 표시"),
  storageMethod: text("storage_method").default("직사광선을 피해 서늘한 곳에 보관"),
  shippingInfo: text("shipping_info"),
  refundInfo: text("refund_info"),
  // 배송 설정
  dawnDeliveryEnabled: boolean("dawn_delivery_enabled").default(false),
  dawnDeliveryDays: integer("dawn_delivery_days").default(2),
  regularDeliveryEnabled: boolean("regular_delivery_enabled").default(true),
  regularDeliveryDays: integer("regular_delivery_days").default(3),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof products.$inferSelect;

// ============================================================================
// 장수박스 구독 플랜 (Subscription Plans)
// ============================================================================

export const subscriptionPlans = pgTable("subscription_plans", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 50 }).notNull().unique(),
  price: integer("price").notNull(),
  originalPrice: integer("original_price"),
  description: text("description"),
  features: jsonb("features").$type<string[]>().default([]),
  isPopular: boolean("is_popular").default(false),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertSubscriptionPlanSchema = createInsertSchema(subscriptionPlans).omit({
  id: true,
  createdAt: true,
});

export type InsertSubscriptionPlan = z.infer<typeof insertSubscriptionPlanSchema>;
export type SubscriptionPlan = typeof subscriptionPlans.$inferSelect;

// ============================================================================
// 장수박스 구독 (Subscriptions)
// ============================================================================

export const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  planId: integer("plan_id").references(() => subscriptionPlans.id).notNull(),
  status: varchar("status", { length: 20 }).default("active"),
  startDate: timestamp("start_date").notNull(),
  nextDeliveryDate: timestamp("next_delivery_date"),
  deliveryDay: integer("delivery_day").default(15),
  recipientName: varchar("recipient_name", { length: 100 }),
  recipientPhone: varchar("recipient_phone", { length: 20 }),
  recipientAddress: text("recipient_address"),
  message: text("message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSubscriptionSchema = createInsertSchema(subscriptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSubscription = z.infer<typeof insertSubscriptionSchema>;
export type Subscription = typeof subscriptions.$inferSelect;

// ============================================================================
// 월별 박스 테마 (Monthly Boxes)
// ============================================================================

export const monthlyBoxes = pgTable("monthly_boxes", {
  id: serial("id").primaryKey(),
  month: varchar("month", { length: 10 }).notNull(),
  year: integer("year").notNull(),
  theme: varchar("theme", { length: 200 }).notNull(),
  highlight: varchar("highlight", { length: 200 }),
  image: text("image"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMonthlyBoxSchema = createInsertSchema(monthlyBoxes).omit({
  id: true,
  createdAt: true,
});

export type InsertMonthlyBox = z.infer<typeof insertMonthlyBoxSchema>;
export type MonthlyBox = typeof monthlyBoxes.$inferSelect;

// ============================================================================
// 행사 (Events)
// ============================================================================

export const events = pgTable("events", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  endDate: timestamp("end_date"),
  time: varchar("time", { length: 50 }),
  location: varchar("location", { length: 255 }),
  detailedAddress: text("detailed_address"),
  locationType: varchar("location_type", { length: 20 }).default("offline"),
  image: text("image"),
  tag: varchar("tag", { length: 50 }),
  category: varchar("category", { length: 50 }),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  status: varchar("status", { length: 20 }).default("recruiting"),
  programSchedule: jsonb("program_schedule").$type<{time: string; description: string}[]>(),
  benefits: jsonb("benefits").$type<{icon: string; title: string; description: string}[]>(),
  promotions: jsonb("promotions").$type<{title: string; description: string}[]>(),
  organizerInfo: jsonb("organizer_info").$type<{company: string; contact: string; phone: string; email: string}>(),
  notices: jsonb("notices").$type<string[]>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertEventSchema = createInsertSchema(events).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// ============================================================================
// 행사 참가 (Event Participants)
// ============================================================================

export const eventParticipants = pgTable("event_participants", {
  id: serial("id").primaryKey(),
  eventId: integer("event_id").references(() => events.id).notNull(),
  memberId: integer("member_id").references(() => members.id),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  status: varchar("status", { length: 20 }).default("applied"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEventParticipantSchema = createInsertSchema(eventParticipants).omit({
  id: true,
  createdAt: true,
});

export type InsertEventParticipant = z.infer<typeof insertEventParticipantSchema>;
export type EventParticipant = typeof eventParticipants.$inferSelect;

// ============================================================================
// 장바구니 (Cart)
// ============================================================================

export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  quantity: integer("quantity").default(1),
  options: jsonb("options"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCartItemSchema = createInsertSchema(cartItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type CartItem = typeof cartItems.$inferSelect;

// ============================================================================
// 주문 (Orders)
// ============================================================================

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  totalAmount: integer("total_amount").notNull(),
  discountAmount: integer("discount_amount").default(0),
  shippingFee: integer("shipping_fee").default(0),
  finalAmount: integer("final_amount").notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  recipientName: varchar("recipient_name", { length: 100 }).notNull(),
  recipientPhone: varchar("recipient_phone", { length: 20 }).notNull(),
  recipientAddress: text("recipient_address").notNull(),
  recipientMessage: text("recipient_message"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;

// ============================================================================
// 주문 상품 (Order Items)
// ============================================================================

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  productId: integer("product_id").references(() => products.id),
  productName: varchar("product_name", { length: 255 }).notNull(),
  productImage: text("product_image"),
  price: integer("price").notNull(),
  quantity: integer("quantity").notNull(),
  options: jsonb("options"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertOrderItemSchema = createInsertSchema(orderItems).omit({
  id: true,
  createdAt: true,
});

export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;
export type OrderItem = typeof orderItems.$inferSelect;

// ============================================================================
// 결제 (Payments)
// ============================================================================

export const payments = pgTable("payments", {
  id: serial("id").primaryKey(),
  paymentNumber: varchar("payment_number", { length: 50 }).notNull().unique(),
  orderId: integer("order_id").references(() => orders.id),
  subscriptionId: integer("subscription_id").references(() => subscriptions.id),
  memberId: integer("member_id").references(() => members.id).notNull(),
  amount: integer("amount").notNull(),
  method: varchar("method", { length: 50 }).notNull(),
  status: varchar("status", { length: 20 }).default("pending"),
  paidAt: timestamp("paid_at"),
  refundedAt: timestamp("refunded_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
});

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

// ============================================================================
// 배송 (Shipping)
// ============================================================================

export const shipping = pgTable("shipping", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id").references(() => orders.id).notNull(),
  trackingNumber: varchar("tracking_number", { length: 100 }),
  carrier: varchar("carrier", { length: 50 }),
  status: varchar("status", { length: 20 }).default("preparing"),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertShippingSchema = createInsertSchema(shipping).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertShipping = z.infer<typeof insertShippingSchema>;
export type Shipping = typeof shipping.$inferSelect;

// ============================================================================
// 리뷰 (Reviews)
// ============================================================================

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  productId: integer("product_id").references(() => products.id),
  orderItemId: integer("order_item_id").references(() => orderItems.id),
  rating: integer("rating").notNull(),
  content: text("content").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  videos: jsonb("videos").$type<string[]>().default([]),
  adminReply: text("admin_reply"),
  adminReplyAt: timestamp("admin_reply_at"),
  adminReplyBy: integer("admin_reply_by").references(() => admins.id),
  isVisible: boolean("is_visible").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

// ============================================================================
// 위시리스트 (Wishlist)
// ============================================================================

export const wishlist = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertWishlistSchema = createInsertSchema(wishlist).omit({
  id: true,
  createdAt: true,
});

export type InsertWishlist = z.infer<typeof insertWishlistSchema>;
export type Wishlist = typeof wishlist.$inferSelect;

// ============================================================================
// 최근 본 상품 (Recent Products)
// ============================================================================

export const recentProducts = pgTable("recent_products", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  productId: integer("product_id").references(() => products.id).notNull(),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

export const insertRecentProductSchema = createInsertSchema(recentProducts).omit({
  id: true,
  viewedAt: true,
});

export type InsertRecentProduct = z.infer<typeof insertRecentProductSchema>;
export type RecentProduct = typeof recentProducts.$inferSelect;

// ============================================================================
// 쿠폰 (Coupons)
// ============================================================================

export const coupons = pgTable("coupons", {
  id: serial("id").primaryKey(),
  code: varchar("code", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  discountType: varchar("discount_type", { length: 20 }).notNull(),
  discountValue: integer("discount_value").notNull(),
  minOrderAmount: integer("min_order_amount").default(0),
  maxDiscountAmount: integer("max_discount_amount"),
  validFrom: timestamp("valid_from").notNull(),
  validTo: timestamp("valid_to").notNull(),
  usageLimit: integer("usage_limit"),
  usedCount: integer("used_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCouponSchema = createInsertSchema(coupons).omit({
  id: true,
  createdAt: true,
});

export type InsertCoupon = z.infer<typeof insertCouponSchema>;
export type Coupon = typeof coupons.$inferSelect;

// ============================================================================
// 회원 쿠폰 (Member Coupons)
// ============================================================================

export const memberCoupons = pgTable("member_coupons", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  couponId: integer("coupon_id").references(() => coupons.id).notNull(),
  isUsed: boolean("is_used").default(false),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertMemberCouponSchema = createInsertSchema(memberCoupons).omit({
  id: true,
  createdAt: true,
});

export type InsertMemberCoupon = z.infer<typeof insertMemberCouponSchema>;
export type MemberCoupon = typeof memberCoupons.$inferSelect;

// ============================================================================
// 알림 (Notifications)
// ============================================================================

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content"),
  link: text("link"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

// ============================================================================
// 공지사항 (Notices)
// ============================================================================

export const notices = pgTable("notices", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 50 }).default("일반"),
  isImportant: boolean("is_important").default(false),
  viewCount: integer("view_count").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertNoticeSchema = createInsertSchema(notices).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNotice = z.infer<typeof insertNoticeSchema>;
export type Notice = typeof notices.$inferSelect;

// ============================================================================
// FAQ
// ============================================================================

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 50 }).notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  displayOrder: integer("display_order").default(0),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type Faq = typeof faqs.$inferSelect;

// ============================================================================
// 1:1 문의 (Inquiries)
// ============================================================================

export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  subject: varchar("subject", { length: 255 }).notNull(),
  content: text("content").notNull(),
  images: jsonb("images").$type<string[]>().default([]),
  status: varchar("status", { length: 20 }).default("pending"),
  answer: text("answer"),
  answeredBy: integer("answered_by").references(() => admins.id),
  answeredAt: timestamp("answered_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

// ============================================================================
// 배송지 (Addresses)
// ============================================================================

export const addresses = pgTable("addresses", {
  id: serial("id").primaryKey(),
  memberId: integer("member_id").references(() => members.id).notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  recipientName: varchar("recipient_name", { length: 100 }).notNull(),
  recipientPhone: varchar("recipient_phone", { length: 20 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }),
  address: text("address").notNull(),
  addressDetail: text("address_detail"),
  isDefault: boolean("is_default").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAddressSchema = createInsertSchema(addresses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAddress = z.infer<typeof insertAddressSchema>;
export type Address = typeof addresses.$inferSelect;

// ============================================================================
// 세션 (Sessions) - 로그인 상태 관리
// ============================================================================

export const sessions = pgTable("sessions", {
  sid: varchar("sid", { length: 255 }).primaryKey(),
  sess: jsonb("sess").notNull(),
  expire: timestamp("expire").notNull(),
});

// ============================================================================
// 사이트 브랜딩 설정 (Site Branding)
// ============================================================================

export const siteBranding = pgTable("site_branding", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 50 }).notNull().unique(), // hero, banner1, banner2, banner3
  title: varchar("title", { length: 255 }),
  subtitle: text("subtitle"),
  image: text("image"),
  backgroundColor: varchar("background_color", { length: 20 }).default("#ffffff"),
  textColor: varchar("text_color", { length: 20 }).default("#000000"),
  linkUrl: text("link_url"),
  linkText: varchar("link_text", { length: 100 }),
  isActive: boolean("is_active").default(true),
  displayOrder: integer("display_order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSiteBrandingSchema = createInsertSchema(siteBranding).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSiteBranding = z.infer<typeof insertSiteBrandingSchema>;
export type SiteBranding = typeof siteBranding.$inferSelect;

// ============================================================================
// 메인 페이지 설정 (Main Page Settings)
// ============================================================================

export const mainPageSettings = pgTable("main_page_settings", {
  id: serial("id").primaryKey(),
  
  // 베스트 상품 설정
  bestProductsCriteria: varchar("best_products_criteria", { length: 20 }).default("sales"), // "sales" | "manual"
  bestProductsManualIds: jsonb("best_products_manual_ids").$type<number[]>().default([]),
  bestProductsLimit: integer("best_products_limit").default(6),
  
  // 중간 광고 배너 설정
  adBannerImage: text("ad_banner_image"),
  adBannerLink: text("ad_banner_link"),
  adBannerEnabled: boolean("ad_banner_enabled").default(true),
  
  // 신상품 설정
  newProductsCriteria: varchar("new_products_criteria", { length: 20 }).default("recent"), // "recent" | "manual"
  newProductsManualIds: jsonb("new_products_manual_ids").$type<number[]>().default([]),
  newProductsLimit: integer("new_products_limit").default(6),
  newProductsDaysThreshold: integer("new_products_days_threshold").default(30),
  
  // 건강 행사 설정
  eventsCriteria: varchar("events_criteria", { length: 20 }).default("active"), // "active" | "manual"
  eventsManualIds: jsonb("events_manual_ids").$type<number[]>().default([]),
  eventsLimit: integer("events_limit").default(4),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertMainPageSettingsSchema = createInsertSchema(mainPageSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertMainPageSettings = z.infer<typeof insertMainPageSettingsSchema>;
export type MainPageSettings = typeof mainPageSettings.$inferSelect;

// ============================================================================
// Relations
// ============================================================================

export const membersRelations = relations(members, ({ many }) => ({
  subscriptions: many(subscriptions),
  orders: many(orders),
  reviews: many(reviews),
  cartItems: many(cartItems),
  wishlist: many(wishlist),
  notifications: many(notifications),
  inquiries: many(inquiries),
  addresses: many(addresses),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  reviews: many(reviews),
  cartItems: many(cartItems),
  wishlist: many(wishlist),
}));

export const ordersRelations = relations(orders, ({ one, many }) => ({
  member: one(members, {
    fields: [orders.memberId],
    references: [members.id],
  }),
  items: many(orderItems),
  payment: many(payments),
  shipping: many(shipping),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  member: one(members, {
    fields: [subscriptions.memberId],
    references: [members.id],
  }),
  plan: one(subscriptionPlans, {
    fields: [subscriptions.planId],
    references: [subscriptionPlans.id],
  }),
}));

export const eventsRelations = relations(events, ({ many }) => ({
  participants: many(eventParticipants),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({ one }) => ({
  event: one(events, {
    fields: [eventParticipants.eventId],
    references: [events.id],
  }),
  member: one(members, {
    fields: [eventParticipants.memberId],
    references: [members.id],
  }),
}));
