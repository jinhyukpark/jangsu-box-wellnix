import { db } from "./db";
import { eq, and, desc, asc, sql, ilike, gte, lte } from "drizzle-orm";
import {
  type Member, type InsertMember, members,
  type Admin, type InsertAdmin, admins,
  type Category, type InsertCategory, categories,
  type Product, type InsertProduct, products,
  type SubscriptionPlan, type InsertSubscriptionPlan, subscriptionPlans,
  type Subscription, type InsertSubscription, subscriptions,
  type MonthlyBox, type InsertMonthlyBox, monthlyBoxes,
  type Event, type InsertEvent, events,
  type EventParticipant, type InsertEventParticipant, eventParticipants,
  type CartItem, type InsertCartItem, cartItems,
  type Order, type InsertOrder, orders,
  type OrderItem, type InsertOrderItem, orderItems,
  type Payment, type InsertPayment, payments,
  type Shipping, type InsertShipping, shipping,
  type Review, type InsertReview, reviews,
  type Wishlist, type InsertWishlist, wishlist,
  type Coupon, type InsertCoupon, coupons,
  type MemberCoupon, type InsertMemberCoupon, memberCoupons,
  type Notification, type InsertNotification, notifications,
  type Notice, type InsertNotice, notices,
  type Faq, type InsertFaq, faqs,
  type Inquiry, type InsertInquiry, inquiries,
  type Address, type InsertAddress, addresses,
  type SiteBranding, type InsertSiteBranding, siteBranding,
  type MainPageSettings, type InsertMainPageSettings, mainPageSettings,
  type Promotion, type InsertPromotion, promotions,
  type PromotionProduct, type InsertPromotionProduct, promotionProducts,
  type SubscriptionBanner, type InsertSubscriptionBanner, subscriptionBanners,
} from "@shared/schema";

export interface IStorage {
  // Members
  getMember(id: number): Promise<Member | undefined>;
  getMemberByEmail(email: string): Promise<Member | undefined>;
  createMember(member: InsertMember): Promise<Member>;
  updateMember(id: number, data: Partial<InsertMember>): Promise<Member | undefined>;
  getAllMembers(): Promise<Member[]>;
  getMembersWithOrders(): Promise<{ id: number }[]>;

  // Admins
  getAdmin(id: number): Promise<Admin | undefined>;
  getAdminByEmail(email: string): Promise<Admin | undefined>;
  createAdmin(admin: InsertAdmin): Promise<Admin>;
  updateAdmin(id: number, data: Partial<InsertAdmin>): Promise<Admin | undefined>;
  deleteAdmin(id: number): Promise<boolean>;
  getAllAdmins(): Promise<Admin[]>;

  // Categories
  getCategory(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined>;
  deleteCategory(id: number): Promise<boolean>;
  getAllCategories(): Promise<Category[]>;

  // Products
  getProduct(id: number): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined>;
  deleteProduct(id: number): Promise<boolean>;
  getAllProducts(categoryId?: number): Promise<Product[]>;
  getAllProductsAdmin(categoryId?: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;

  // Subscription Plans
  getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined>;
  getAllSubscriptionPlans(): Promise<SubscriptionPlan[]>;
  getAllSubscriptionPlansAdmin(): Promise<SubscriptionPlan[]>;
  createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan>;
  updateSubscriptionPlan(id: number, data: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined>;
  deleteSubscriptionPlan(id: number): Promise<boolean>;
  updateSubscriptionPlanOrders(orders: { id: number; displayOrder: number }[]): Promise<void>;

  // Subscriptions
  getSubscription(id: number): Promise<Subscription | undefined>;
  getSubscriptionsByMember(memberId: number): Promise<Subscription[]>;
  createSubscription(subscription: InsertSubscription): Promise<Subscription>;
  updateSubscription(id: number, data: Partial<InsertSubscription>): Promise<Subscription | undefined>;
  getAllSubscriptions(): Promise<Subscription[]>;

  // Monthly Boxes
  getMonthlyBox(id: number): Promise<MonthlyBox | undefined>;
  getAllMonthlyBoxes(): Promise<MonthlyBox[]>;
  createMonthlyBox(box: InsertMonthlyBox): Promise<MonthlyBox>;

  // Events
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  getAllEvents(): Promise<Event[]>;

  // Event Participants
  getEventParticipants(eventId: number): Promise<EventParticipant[]>;
  createEventParticipant(participant: InsertEventParticipant): Promise<EventParticipant>;
  updateEventParticipant(id: number, data: Partial<InsertEventParticipant>): Promise<EventParticipant | undefined>;

  // Cart
  getCartItems(memberId: number): Promise<CartItem[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(memberId: number): Promise<boolean>;
  getAllCartItemsAdmin(startDate?: Date, endDate?: Date): Promise<any[]>;
  getCartStatsByMember(): Promise<any[]>;

  // Orders
  getOrder(id: number): Promise<Order | undefined>;
  getOrderByNumber(orderNumber: string): Promise<Order | undefined>;
  getOrdersByMember(memberId: number): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: number, data: Partial<InsertOrder>): Promise<Order | undefined>;
  getAllOrders(): Promise<Order[]>;

  // Order Items
  getOrderItems(orderId: number): Promise<OrderItem[]>;
  createOrderItem(item: InsertOrderItem): Promise<OrderItem>;

  // Payments
  getPayment(id: number): Promise<Payment | undefined>;
  getPaymentsByMember(memberId: number): Promise<Payment[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, data: Partial<InsertPayment>): Promise<Payment | undefined>;
  getAllPayments(): Promise<Payment[]>;

  // Shipping
  getShipping(orderId: number): Promise<Shipping | undefined>;
  createShipping(data: InsertShipping): Promise<Shipping>;
  updateShipping(id: number, data: Partial<InsertShipping>): Promise<Shipping | undefined>;
  getAllShipping(): Promise<Shipping[]>;

  // Reviews
  getReview(id: number): Promise<Review | undefined>;
  getReviewsByProduct(productId: number): Promise<Review[]>;
  getReviewsByMember(memberId: number): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  updateReview(id: number, data: Partial<InsertReview>): Promise<Review | undefined>;
  deleteReview(id: number): Promise<boolean>;

  // Wishlist
  getWishlist(memberId: number): Promise<Wishlist[]>;
  addToWishlist(data: InsertWishlist): Promise<Wishlist>;
  removeFromWishlist(memberId: number, productId: number): Promise<boolean>;
  isInWishlist(memberId: number, productId: number): Promise<boolean>;

  // Coupons
  getCoupon(id: number): Promise<Coupon | undefined>;
  getCouponByCode(code: string): Promise<Coupon | undefined>;
  getAllCoupons(): Promise<Coupon[]>;
  createCoupon(coupon: InsertCoupon): Promise<Coupon>;
  updateCoupon(id: number, data: Partial<InsertCoupon>): Promise<Coupon | undefined>;

  // Member Coupons
  getMemberCoupons(memberId: number): Promise<MemberCoupon[]>;
  addMemberCoupon(data: InsertMemberCoupon): Promise<MemberCoupon>;
  useMemberCoupon(id: number): Promise<MemberCoupon | undefined>;

  // Notifications
  getNotifications(memberId: number): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationRead(id: number): Promise<boolean>;
  markAllNotificationsRead(memberId: number): Promise<boolean>;
  getNotificationHistory(): Promise<{ date: string; title: string; content: string; sentCount: number; createdAt: string; targetType: string }[]>;

  // Notices
  getNotice(id: number): Promise<Notice | undefined>;
  getAllNotices(): Promise<Notice[]>;
  createNotice(notice: InsertNotice): Promise<Notice>;
  updateNotice(id: number, data: Partial<InsertNotice>): Promise<Notice | undefined>;
  deleteNotice(id: number): Promise<boolean>;

  // FAQs
  getFaq(id: number): Promise<Faq | undefined>;
  getAllFaqs(): Promise<Faq[]>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: number, data: Partial<InsertFaq>): Promise<Faq | undefined>;
  deleteFaq(id: number): Promise<boolean>;

  // Inquiries
  getInquiry(id: number): Promise<Inquiry | undefined>;
  getInquiriesByMember(memberId: number): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: number, data: Partial<InsertInquiry>): Promise<Inquiry | undefined>;
  getAllInquiries(): Promise<Inquiry[]>;

  // Addresses
  getAddresses(memberId: number): Promise<Address[]>;
  getAddress(id: number): Promise<Address | undefined>;
  createAddress(address: InsertAddress): Promise<Address>;
  updateAddress(id: number, data: Partial<InsertAddress>): Promise<Address | undefined>;
  deleteAddress(id: number): Promise<boolean>;
  setDefaultAddress(memberId: number, addressId: number): Promise<boolean>;

  // Site Branding
  getSiteBranding(key: string): Promise<SiteBranding | undefined>;
  getAllSiteBranding(): Promise<SiteBranding[]>;
  upsertSiteBranding(key: string, data: Partial<InsertSiteBranding>): Promise<SiteBranding>;

  // Main Page Settings
  getMainPageSettings(): Promise<MainPageSettings | undefined>;
  upsertMainPageSettings(data: Partial<InsertMainPageSettings>): Promise<MainPageSettings>;

  // Promotions (이벤트관)
  getPromotion(id: number): Promise<Promotion | undefined>;
  getPromotionBySlug(slug: string): Promise<Promotion | undefined>;
  getAllPromotions(): Promise<Promotion[]>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(id: number, data: Partial<InsertPromotion>): Promise<Promotion | undefined>;
  deletePromotion(id: number): Promise<boolean>;
  
  // Promotion Products
  getPromotionProducts(promotionId: number): Promise<PromotionProduct[]>;
  getPromotionWithProducts(id: number): Promise<{ promotion: Promotion; products: Product[] } | undefined>;
  setPromotionProducts(promotionId: number, productIds: number[]): Promise<void>;

  // Subscription Banners
  getSubscriptionBanner(id: number): Promise<SubscriptionBanner | undefined>;
  getAllSubscriptionBanners(): Promise<SubscriptionBanner[]>;
  getActiveSubscriptionBanners(): Promise<SubscriptionBanner[]>;
  createSubscriptionBanner(banner: InsertSubscriptionBanner): Promise<SubscriptionBanner>;
  updateSubscriptionBanner(id: number, data: Partial<InsertSubscriptionBanner>): Promise<SubscriptionBanner | undefined>;
  deleteSubscriptionBanner(id: number): Promise<boolean>;
  reorderSubscriptionBanners(orders: { id: number; displayOrder: number }[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Members
  async getMember(id: number): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.id, id));
    return member;
  }

  async getMemberByEmail(email: string): Promise<Member | undefined> {
    const [member] = await db.select().from(members).where(eq(members.email, email));
    return member;
  }

  async createMember(member: InsertMember): Promise<Member> {
    const [created] = await db.insert(members).values(member).returning();
    return created;
  }

  async updateMember(id: number, data: Partial<InsertMember>): Promise<Member | undefined> {
    const [updated] = await db.update(members).set({ ...data, updatedAt: new Date() }).where(eq(members.id, id)).returning();
    return updated;
  }

  async getAllMembers(): Promise<Member[]> {
    return db.select().from(members).orderBy(desc(members.createdAt));
  }

  async getMembersWithOrders(): Promise<{ id: number }[]> {
    const result = await db
      .selectDistinct({ id: orders.memberId })
      .from(orders)
      .where(sql`${orders.memberId} IS NOT NULL`);
    return result.map(r => ({ id: r.id! }));
  }

  // Admins
  async getAdmin(id: number): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.id, id));
    return admin;
  }

  async getAdminByEmail(email: string): Promise<Admin | undefined> {
    const [admin] = await db.select().from(admins).where(eq(admins.email, email));
    return admin;
  }

  async createAdmin(admin: InsertAdmin): Promise<Admin> {
    const [created] = await db.insert(admins).values(admin).returning();
    return created;
  }

  async updateAdmin(id: number, data: Partial<InsertAdmin>): Promise<Admin | undefined> {
    const [updated] = await db.update(admins).set({ ...data, updatedAt: new Date() }).where(eq(admins.id, id)).returning();
    return updated;
  }

  async getAllAdmins(): Promise<Admin[]> {
    return db.select().from(admins).orderBy(desc(admins.createdAt));
  }

  async deleteAdmin(id: number): Promise<boolean> {
    const result = await db.delete(admins).where(eq(admins.id, id));
    return true;
  }

  // Categories
  async getCategory(id: number): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.id, id));
    return category;
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const [category] = await db.select().from(categories).where(eq(categories.slug, slug));
    return category;
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const [created] = await db.insert(categories).values(category).returning();
    return created;
  }

  async updateCategory(id: number, data: Partial<InsertCategory>): Promise<Category | undefined> {
    const [updated] = await db.update(categories).set(data).where(eq(categories.id, id)).returning();
    return updated;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const result = await db.delete(categories).where(eq(categories.id, id));
    return true;
  }

  async getAllCategories(): Promise<Category[]> {
    return db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.displayOrder));
  }

  // Products
  async getProduct(id: number): Promise<Product | undefined> {
    const [product] = await db.select().from(products).where(eq(products.id, id));
    return product;
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const [created] = await db.insert(products).values(product).returning();
    return created;
  }

  async updateProduct(id: number, data: Partial<InsertProduct>): Promise<Product | undefined> {
    // Remove fields that should not be updated
    const { id: _id, createdAt, updatedAt, rating, reviewCount, ...cleanData } = data as any;
    
    const updatePayload = { ...cleanData, updatedAt: new Date() };
    console.log("=== SQL Update Product ===");
    console.log("ID:", id);
    console.log("Clean data keys:", Object.keys(updatePayload));
    
    try {
      const [updated] = await db.update(products).set(updatePayload).where(eq(products.id, id)).returning();
      console.log("SQL Update Success:", updated?.id);
      return updated;
    } catch (error: any) {
      console.error("=== SQL Update Error ===");
      console.error("Error:", error?.message);
      throw error;
    }
  }

  async deleteProduct(id: number): Promise<boolean> {
    await db.delete(products).where(eq(products.id, id));
    return true;
  }

  async getAllProducts(categoryId?: number): Promise<Product[]> {
    if (categoryId) {
      return db.select().from(products).where(and(eq(products.categoryId, categoryId), eq(products.status, "active"))).orderBy(desc(products.createdAt));
    }
    return db.select().from(products).where(eq(products.status, "active")).orderBy(desc(products.createdAt));
  }

  async getAllProductsAdmin(categoryId?: number): Promise<Product[]> {
    if (categoryId) {
      return db.select().from(products).where(eq(products.categoryId, categoryId)).orderBy(desc(products.createdAt));
    }
    return db.select().from(products).orderBy(desc(products.createdAt));
  }

  async searchProducts(query: string): Promise<Product[]> {
    return db.select().from(products).where(and(ilike(products.name, `%${query}%`), eq(products.status, "active")));
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return db.select().from(products).where(and(eq(products.isFeatured, true), eq(products.status, "active"))).limit(10);
  }

  // Subscription Plans
  async getSubscriptionPlan(id: number): Promise<SubscriptionPlan | undefined> {
    const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return plan;
  }

  async getAllSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    return db.select().from(subscriptionPlans).where(eq(subscriptionPlans.isActive, true)).orderBy(asc(subscriptionPlans.displayOrder));
  }

  async getAllSubscriptionPlansAdmin(): Promise<SubscriptionPlan[]> {
    return db.select().from(subscriptionPlans).orderBy(asc(subscriptionPlans.displayOrder));
  }

  async updateSubscriptionPlanOrders(orders: { id: number; displayOrder: number }[]): Promise<void> {
    for (const order of orders) {
      await db.update(subscriptionPlans).set({ displayOrder: order.displayOrder }).where(eq(subscriptionPlans.id, order.id));
    }
  }

  async createSubscriptionPlan(plan: InsertSubscriptionPlan): Promise<SubscriptionPlan> {
    const [created] = await db.insert(subscriptionPlans).values(plan).returning();
    return created;
  }

  async updateSubscriptionPlan(id: number, data: Partial<InsertSubscriptionPlan>): Promise<SubscriptionPlan | undefined> {
    const [updated] = await db.update(subscriptionPlans).set(data).where(eq(subscriptionPlans.id, id)).returning();
    return updated;
  }

  async deleteSubscriptionPlan(id: number): Promise<boolean> {
    await db.delete(subscriptionPlans).where(eq(subscriptionPlans.id, id));
    return true;
  }

  // Subscriptions
  async getSubscription(id: number): Promise<Subscription | undefined> {
    const [subscription] = await db.select().from(subscriptions).where(eq(subscriptions.id, id));
    return subscription;
  }

  async getSubscriptionsByMember(memberId: number): Promise<Subscription[]> {
    return db.select().from(subscriptions).where(eq(subscriptions.memberId, memberId)).orderBy(desc(subscriptions.createdAt));
  }

  async createSubscription(subscription: InsertSubscription): Promise<Subscription> {
    const [created] = await db.insert(subscriptions).values(subscription).returning();
    return created;
  }

  async updateSubscription(id: number, data: Partial<InsertSubscription>): Promise<Subscription | undefined> {
    const [updated] = await db.update(subscriptions).set({ ...data, updatedAt: new Date() }).where(eq(subscriptions.id, id)).returning();
    return updated;
  }

  async getAllSubscriptions(): Promise<any[]> {
    const subs = await db.select().from(subscriptions).orderBy(desc(subscriptions.createdAt));
    const enriched = await Promise.all(subs.map(async (sub) => {
      const [member] = sub.memberId ? await db.select().from(members).where(eq(members.id, sub.memberId)) : [undefined];
      const [plan] = sub.planId ? await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, sub.planId)) : [undefined];
      return { ...sub, member, plan };
    }));
    return enriched;
  }

  // Monthly Boxes
  async getMonthlyBox(id: number): Promise<MonthlyBox | undefined> {
    const [box] = await db.select().from(monthlyBoxes).where(eq(monthlyBoxes.id, id));
    return box;
  }

  async getAllMonthlyBoxes(): Promise<MonthlyBox[]> {
    return db.select().from(monthlyBoxes).orderBy(desc(monthlyBoxes.year), asc(monthlyBoxes.month));
  }

  async createMonthlyBox(box: InsertMonthlyBox): Promise<MonthlyBox> {
    const [created] = await db.insert(monthlyBoxes).values(box).returning();
    return created;
  }

  // Events
  async getEvent(id: number): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event;
  }

  async createEvent(event: InsertEvent): Promise<Event> {
    const [created] = await db.insert(events).values(event).returning();
    return created;
  }

  async updateEvent(id: number, data: Partial<InsertEvent>): Promise<Event | undefined> {
    const [updated] = await db.update(events).set({ ...data, updatedAt: new Date() }).where(eq(events.id, id)).returning();
    return updated;
  }

  async deleteEvent(id: number): Promise<boolean> {
    await db.delete(events).where(eq(events.id, id));
    return true;
  }

  async getAllEvents(): Promise<Event[]> {
    return db.select().from(events).orderBy(desc(events.date));
  }

  // Event Participants
  async getEventParticipants(eventId: number): Promise<EventParticipant[]> {
    return db.select().from(eventParticipants).where(eq(eventParticipants.eventId, eventId)).orderBy(desc(eventParticipants.createdAt));
  }

  async createEventParticipant(participant: InsertEventParticipant): Promise<EventParticipant> {
    const [created] = await db.insert(eventParticipants).values(participant).returning();
    await db.update(events).set({ currentParticipants: sql`${events.currentParticipants} + 1` }).where(eq(events.id, participant.eventId));
    return created;
  }

  async updateEventParticipant(id: number, data: Partial<InsertEventParticipant>): Promise<EventParticipant | undefined> {
    const [updated] = await db.update(eventParticipants).set(data).where(eq(eventParticipants.id, id)).returning();
    return updated;
  }

  // Cart
  async getCartItems(memberId: number): Promise<CartItem[]> {
    return db.select().from(cartItems).where(eq(cartItems.memberId, memberId)).orderBy(desc(cartItems.createdAt));
  }

  async addToCart(item: InsertCartItem): Promise<CartItem> {
    const existing = await db.select().from(cartItems).where(and(eq(cartItems.memberId, item.memberId), eq(cartItems.productId, item.productId)));
    if (existing.length > 0) {
      const [updated] = await db.update(cartItems).set({ quantity: sql`${cartItems.quantity} + ${item.quantity || 1}`, updatedAt: new Date() }).where(eq(cartItems.id, existing[0].id)).returning();
      return updated;
    }
    const [created] = await db.insert(cartItems).values(item).returning();
    return created;
  }

  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const [updated] = await db.update(cartItems).set({ quantity, updatedAt: new Date() }).where(eq(cartItems.id, id)).returning();
    return updated;
  }

  async removeFromCart(id: number): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.id, id));
    return true;
  }

  async clearCart(memberId: number): Promise<boolean> {
    await db.delete(cartItems).where(eq(cartItems.memberId, memberId));
    return true;
  }

  async getAllCartItemsAdmin(startDate?: Date, endDate?: Date): Promise<any[]> {
    let query = db
      .select({
        id: cartItems.id,
        memberId: cartItems.memberId,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        memberName: members.name,
        memberEmail: members.email,
        productName: products.name,
        productPrice: products.price,
        productImage: products.image,
      })
      .from(cartItems)
      .leftJoin(members, eq(cartItems.memberId, members.id))
      .leftJoin(products, eq(cartItems.productId, products.id))
      .orderBy(desc(cartItems.createdAt));

    if (startDate && endDate) {
      return db
        .select({
          id: cartItems.id,
          memberId: cartItems.memberId,
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          createdAt: cartItems.createdAt,
          memberName: members.name,
          memberEmail: members.email,
          productName: products.name,
          productPrice: products.price,
          productImage: products.image,
        })
        .from(cartItems)
        .leftJoin(members, eq(cartItems.memberId, members.id))
        .leftJoin(products, eq(cartItems.productId, products.id))
        .where(and(gte(cartItems.createdAt, startDate), lte(cartItems.createdAt, endDate)))
        .orderBy(desc(cartItems.createdAt));
    }

    return query;
  }

  async getCartStatsByMember(): Promise<any[]> {
    const allCartItems = await db
      .select({
        memberId: cartItems.memberId,
        memberName: members.name,
        memberEmail: members.email,
        productId: cartItems.productId,
        quantity: cartItems.quantity,
        createdAt: cartItems.createdAt,
        productPrice: products.price,
      })
      .from(cartItems)
      .leftJoin(members, eq(cartItems.memberId, members.id))
      .leftJoin(products, eq(cartItems.productId, products.id));

    const allOrders = await db
      .select({
        memberId: orders.memberId,
        orderItems: orderItems,
      })
      .from(orders)
      .leftJoin(orderItems, eq(orders.id, orderItems.orderId));

    const memberStats: Record<number, any> = {};

    for (const item of allCartItems) {
      if (!item.memberId) continue;
      if (!memberStats[item.memberId]) {
        memberStats[item.memberId] = {
          memberId: item.memberId,
          memberName: item.memberName,
          memberEmail: item.memberEmail,
          cartItemCount: 0,
          cartTotalAmount: 0,
          purchasedCount: 0,
        };
      }
      memberStats[item.memberId].cartItemCount += item.quantity || 1;
      memberStats[item.memberId].cartTotalAmount += (item.productPrice || 0) * (item.quantity || 1);
    }

    return Object.values(memberStats);
  }

  // Orders
  async getOrder(id: number): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber));
    return order;
  }

  async getOrdersByMember(memberId: number): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.memberId, memberId)).orderBy(desc(orders.createdAt));
  }

  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders).values(order).returning();
    return created;
  }

  async updateOrder(id: number, data: Partial<InsertOrder>): Promise<Order | undefined> {
    const [updated] = await db.update(orders).set({ ...data, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
    return updated;
  }

  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders).orderBy(desc(orders.createdAt));
  }

  // Order Items
  async getOrderItems(orderId: number): Promise<OrderItem[]> {
    return db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  }

  async createOrderItem(item: InsertOrderItem): Promise<OrderItem> {
    const [created] = await db.insert(orderItems).values(item).returning();
    return created;
  }

  // Payments
  async getPayment(id: number): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async getPaymentsByMember(memberId: number): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.memberId, memberId)).orderBy(desc(payments.createdAt));
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [created] = await db.insert(payments).values(payment).returning();
    return created;
  }

  async updatePayment(id: number, data: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updated] = await db.update(payments).set(data).where(eq(payments.id, id)).returning();
    return updated;
  }

  async getAllPayments(): Promise<Payment[]> {
    return db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  // Shipping
  async getShipping(orderId: number): Promise<Shipping | undefined> {
    const [ship] = await db.select().from(shipping).where(eq(shipping.orderId, orderId));
    return ship;
  }

  async createShipping(data: InsertShipping): Promise<Shipping> {
    const [created] = await db.insert(shipping).values(data).returning();
    return created;
  }

  async updateShipping(id: number, data: Partial<InsertShipping>): Promise<Shipping | undefined> {
    const [updated] = await db.update(shipping).set({ ...data, updatedAt: new Date() }).where(eq(shipping.id, id)).returning();
    return updated;
  }

  async getAllShipping(): Promise<Shipping[]> {
    return db.select().from(shipping).orderBy(desc(shipping.createdAt));
  }

  // Reviews
  async getReview(id: number): Promise<Review | undefined> {
    const [review] = await db.select().from(reviews).where(eq(reviews.id, id));
    return review;
  }

  async getReviewsByProduct(productId: number): Promise<Review[]> {
    return db.select().from(reviews).where(and(eq(reviews.productId, productId), eq(reviews.isVisible, true))).orderBy(desc(reviews.createdAt));
  }

  async getReviewsByMember(memberId: number): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.memberId, memberId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    if (review.productId) {
      await db.update(products).set({ reviewCount: sql`${products.reviewCount} + 1` }).where(eq(products.id, review.productId));
    }
    return created;
  }

  async updateReview(id: number, data: Partial<InsertReview>): Promise<Review | undefined> {
    const [updated] = await db.update(reviews).set({ ...data, updatedAt: new Date() }).where(eq(reviews.id, id)).returning();
    return updated;
  }

  async deleteReview(id: number): Promise<boolean> {
    await db.delete(reviews).where(eq(reviews.id, id));
    return true;
  }

  // Wishlist
  async getWishlist(memberId: number): Promise<Wishlist[]> {
    return db.select().from(wishlist).where(eq(wishlist.memberId, memberId)).orderBy(desc(wishlist.createdAt));
  }

  async addToWishlist(data: InsertWishlist): Promise<Wishlist> {
    const existing = await db.select().from(wishlist).where(and(eq(wishlist.memberId, data.memberId), eq(wishlist.productId, data.productId)));
    if (existing.length > 0) {
      return existing[0];
    }
    const [created] = await db.insert(wishlist).values(data).returning();
    return created;
  }

  async removeFromWishlist(memberId: number, productId: number): Promise<boolean> {
    await db.delete(wishlist).where(and(eq(wishlist.memberId, memberId), eq(wishlist.productId, productId)));
    return true;
  }

  async isInWishlist(memberId: number, productId: number): Promise<boolean> {
    const result = await db.select().from(wishlist).where(and(eq(wishlist.memberId, memberId), eq(wishlist.productId, productId)));
    return result.length > 0;
  }

  // Coupons
  async getCoupon(id: number): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.id, id));
    return coupon;
  }

  async getCouponByCode(code: string): Promise<Coupon | undefined> {
    const [coupon] = await db.select().from(coupons).where(eq(coupons.code, code));
    return coupon;
  }

  async getAllCoupons(): Promise<Coupon[]> {
    return db.select().from(coupons).orderBy(desc(coupons.createdAt));
  }

  async createCoupon(coupon: InsertCoupon): Promise<Coupon> {
    const [created] = await db.insert(coupons).values(coupon).returning();
    return created;
  }

  async updateCoupon(id: number, data: Partial<InsertCoupon>): Promise<Coupon | undefined> {
    const [updated] = await db.update(coupons).set(data).where(eq(coupons.id, id)).returning();
    return updated;
  }

  // Member Coupons
  async getMemberCoupons(memberId: number): Promise<MemberCoupon[]> {
    return db.select().from(memberCoupons).where(eq(memberCoupons.memberId, memberId)).orderBy(desc(memberCoupons.createdAt));
  }

  async addMemberCoupon(data: InsertMemberCoupon): Promise<MemberCoupon> {
    const [created] = await db.insert(memberCoupons).values(data).returning();
    return created;
  }

  async useMemberCoupon(id: number): Promise<MemberCoupon | undefined> {
    const [updated] = await db.update(memberCoupons).set({ isUsed: true, usedAt: new Date() }).where(eq(memberCoupons.id, id)).returning();
    return updated;
  }

  // Notifications
  async getNotifications(memberId: number): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.memberId, memberId)).orderBy(desc(notifications.createdAt));
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }

  async markNotificationRead(id: number): Promise<boolean> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
    return true;
  }

  async markAllNotificationsRead(memberId: number): Promise<boolean> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.memberId, memberId));
    return true;
  }

  async getNotificationHistory(): Promise<{ date: string; title: string; content: string; sentCount: number; createdAt: string; targetType: string }[]> {
    // target_type 컬럼이 DB에 없을 수 있으므로 제외하고 조회
    const result = await db
      .select({
        date: sql<string>`DATE(${notifications.createdAt})`.as("date"),
        title: notifications.title,
        content: notifications.content,
        sentCount: sql<number>`count(*)`.as("sentCount"),
        maxCreatedAt: sql<string>`MAX(${notifications.createdAt})`.as("maxCreatedAt"),
      })
      .from(notifications)
      .where(eq(notifications.notificationType, "promotion"))
      .groupBy(sql`DATE(${notifications.createdAt})`, notifications.title, notifications.content)
      .orderBy(desc(sql`MAX(${notifications.createdAt})`));
    
    return result.map(r => ({
      date: r.date || '',
      title: r.title || '',
      content: r.content,
      sentCount: Number(r.sentCount),
      createdAt: r.maxCreatedAt || '',
      targetType: '', // target_type 컬럼이 없으므로 빈 문자열 반환
    }));
  }

  // Notices
  async getNotice(id: number): Promise<Notice | undefined> {
    const [notice] = await db.select().from(notices).where(eq(notices.id, id));
    return notice;
  }

  async getAllNotices(): Promise<Notice[]> {
    return db.select().from(notices).where(eq(notices.isActive, true)).orderBy(desc(notices.isImportant), desc(notices.createdAt));
  }

  async createNotice(notice: InsertNotice): Promise<Notice> {
    const [created] = await db.insert(notices).values(notice).returning();
    return created;
  }

  async updateNotice(id: number, data: Partial<InsertNotice>): Promise<Notice | undefined> {
    const [updated] = await db.update(notices).set({ ...data, updatedAt: new Date() }).where(eq(notices.id, id)).returning();
    return updated;
  }

  async deleteNotice(id: number): Promise<boolean> {
    await db.update(notices).set({ isActive: false }).where(eq(notices.id, id));
    return true;
  }

  // FAQs
  async getFaq(id: number): Promise<Faq | undefined> {
    const [faq] = await db.select().from(faqs).where(eq(faqs.id, id));
    return faq;
  }

  async getAllFaqs(): Promise<Faq[]> {
    return db.select().from(faqs).where(eq(faqs.isActive, true)).orderBy(asc(faqs.displayOrder));
  }

  async createFaq(faq: InsertFaq): Promise<Faq> {
    const [created] = await db.insert(faqs).values(faq).returning();
    return created;
  }

  async updateFaq(id: number, data: Partial<InsertFaq>): Promise<Faq | undefined> {
    const [updated] = await db.update(faqs).set({ ...data, updatedAt: new Date() }).where(eq(faqs.id, id)).returning();
    return updated;
  }

  async deleteFaq(id: number): Promise<boolean> {
    await db.update(faqs).set({ isActive: false }).where(eq(faqs.id, id));
    return true;
  }

  // Inquiries
  async getInquiry(id: number): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry;
  }

  async getInquiriesByMember(memberId: number): Promise<Inquiry[]> {
    return db.select().from(inquiries).where(eq(inquiries.memberId, memberId)).orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [created] = await db.insert(inquiries).values(inquiry).returning();
    return created;
  }

  async updateInquiry(id: number, data: Partial<InsertInquiry>): Promise<Inquiry | undefined> {
    const [updated] = await db.update(inquiries).set({ ...data, updatedAt: new Date() }).where(eq(inquiries.id, id)).returning();
    return updated;
  }

  async getAllInquiries(): Promise<Inquiry[]> {
    return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
  }

  // Addresses
  async getAddresses(memberId: number): Promise<Address[]> {
    return db.select().from(addresses).where(eq(addresses.memberId, memberId)).orderBy(desc(addresses.isDefault), desc(addresses.createdAt));
  }

  async getAddress(id: number): Promise<Address | undefined> {
    const [address] = await db.select().from(addresses).where(eq(addresses.id, id));
    return address;
  }

  async createAddress(address: InsertAddress): Promise<Address> {
    if (address.isDefault) {
      await db.update(addresses).set({ isDefault: false }).where(eq(addresses.memberId, address.memberId));
    }
    const [created] = await db.insert(addresses).values(address).returning();
    return created;
  }

  async updateAddress(id: number, data: Partial<InsertAddress>): Promise<Address | undefined> {
    const [updated] = await db.update(addresses).set({ ...data, updatedAt: new Date() }).where(eq(addresses.id, id)).returning();
    return updated;
  }

  async deleteAddress(id: number): Promise<boolean> {
    await db.delete(addresses).where(eq(addresses.id, id));
    return true;
  }

  async setDefaultAddress(memberId: number, addressId: number): Promise<boolean> {
    await db.update(addresses).set({ isDefault: false }).where(eq(addresses.memberId, memberId));
    await db.update(addresses).set({ isDefault: true }).where(eq(addresses.id, addressId));
    return true;
  }

  // Site Branding
  async getSiteBranding(key: string): Promise<SiteBranding | undefined> {
    const [item] = await db.select().from(siteBranding).where(eq(siteBranding.key, key));
    return item;
  }

  async getAllSiteBranding(): Promise<SiteBranding[]> {
    return db.select().from(siteBranding).orderBy(asc(siteBranding.displayOrder));
  }

  async upsertSiteBranding(key: string, data: Partial<InsertSiteBranding>): Promise<SiteBranding> {
    const existing = await this.getSiteBranding(key);
    // Remove timestamp fields from data to avoid type conflicts
    const { createdAt, updatedAt, id, ...cleanData } = data as any;
    
    if (existing) {
      const [updated] = await db.update(siteBranding)
        .set({ ...cleanData, updatedAt: new Date() })
        .where(eq(siteBranding.key, key))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(siteBranding)
        .values({ ...cleanData, key } as InsertSiteBranding)
        .returning();
      return created;
    }
  }

  // Main Page Settings
  async getMainPageSettings(): Promise<MainPageSettings | undefined> {
    // Order by id desc to get the most recent record in case of multiple rows
    const [settings] = await db.select().from(mainPageSettings).orderBy(desc(mainPageSettings.id)).limit(1);
    return settings;
  }

  async upsertMainPageSettings(data: Partial<InsertMainPageSettings>): Promise<MainPageSettings> {
    const existing = await this.getMainPageSettings();
    // Remove timestamp fields from data to avoid type conflicts
    const { createdAt, updatedAt, id, ...cleanData } = data as any;

    if (existing) {
      const [updated] = await db.update(mainPageSettings)
        .set({ ...cleanData, updatedAt: new Date() })
        .where(eq(mainPageSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(mainPageSettings)
        .values(cleanData as InsertMainPageSettings)
        .returning();
      return created;
    }
  }

  // Promotions (이벤트관)
  async getPromotion(id: number): Promise<Promotion | undefined> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.id, id));
    return promotion;
  }

  async getPromotionBySlug(slug: string): Promise<Promotion | undefined> {
    const [promotion] = await db.select().from(promotions).where(eq(promotions.slug, slug));
    return promotion;
  }

  async getAllPromotions(): Promise<Promotion[]> {
    return db.select().from(promotions).orderBy(asc(promotions.displayOrder));
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const [created] = await db.insert(promotions).values(promotion).returning();
    return created;
  }

  async updatePromotion(id: number, data: Partial<InsertPromotion>): Promise<Promotion | undefined> {
    const [updated] = await db.update(promotions).set({ ...data, updatedAt: new Date() }).where(eq(promotions.id, id)).returning();
    return updated;
  }

  async deletePromotion(id: number): Promise<boolean> {
    // First delete associated products
    await db.delete(promotionProducts).where(eq(promotionProducts.promotionId, id));
    await db.delete(promotions).where(eq(promotions.id, id));
    return true;
  }

  // Promotion Products
  async getPromotionProducts(promotionId: number): Promise<PromotionProduct[]> {
    return db.select().from(promotionProducts).where(eq(promotionProducts.promotionId, promotionId)).orderBy(asc(promotionProducts.displayOrder));
  }

  async getPromotionWithProducts(id: number): Promise<{ promotion: Promotion; products: Product[] } | undefined> {
    const promotion = await this.getPromotion(id);
    if (!promotion) return undefined;
    
    const promoProducts = await this.getPromotionProducts(id);
    const productList: Product[] = [];
    
    for (const pp of promoProducts) {
      const [product] = await db.select().from(products).where(eq(products.id, pp.productId));
      if (product) productList.push(product);
    }
    
    return { promotion, products: productList };
  }

  async setPromotionProducts(promotionId: number, productIds: number[]): Promise<void> {
    // Delete existing associations
    await db.delete(promotionProducts).where(eq(promotionProducts.promotionId, promotionId));

    // Insert new associations
    if (productIds.length > 0) {
      const values = productIds.map((productId, index) => ({
        promotionId,
        productId,
        displayOrder: index,
      }));
      await db.insert(promotionProducts).values(values);
    }
  }

  // Subscription Banners
  async getSubscriptionBanner(id: number): Promise<SubscriptionBanner | undefined> {
    const [banner] = await db.select().from(subscriptionBanners).where(eq(subscriptionBanners.id, id));
    return banner;
  }

  async getAllSubscriptionBanners(): Promise<SubscriptionBanner[]> {
    return db.select().from(subscriptionBanners).orderBy(asc(subscriptionBanners.displayOrder));
  }

  async getActiveSubscriptionBanners(): Promise<SubscriptionBanner[]> {
    return db.select().from(subscriptionBanners)
      .where(eq(subscriptionBanners.isActive, true))
      .orderBy(asc(subscriptionBanners.displayOrder));
  }

  async createSubscriptionBanner(banner: InsertSubscriptionBanner): Promise<SubscriptionBanner> {
    const [created] = await db.insert(subscriptionBanners).values(banner).returning();
    return created;
  }

  async updateSubscriptionBanner(id: number, data: Partial<InsertSubscriptionBanner>): Promise<SubscriptionBanner | undefined> {
    const [updated] = await db.update(subscriptionBanners)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(subscriptionBanners.id, id))
      .returning();
    return updated;
  }

  async deleteSubscriptionBanner(id: number): Promise<boolean> {
    await db.delete(subscriptionBanners).where(eq(subscriptionBanners.id, id));
    return true;
  }

  async reorderSubscriptionBanners(orders: { id: number; displayOrder: number }[]): Promise<void> {
    for (const { id, displayOrder } of orders) {
      await db.update(subscriptionBanners)
        .set({ displayOrder, updatedAt: new Date() })
        .where(eq(subscriptionBanners.id, id));
    }
  }
}

export const storage = new DatabaseStorage();
