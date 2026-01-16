import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import pg from "pg";
import {
  insertMemberSchema,
  insertProductSchema,
  insertCategorySchema,
  insertEventSchema,
  insertEventParticipantSchema,
  insertSubscriptionSchema,
  insertOrderSchema,
  insertOrderItemSchema,
  insertReviewSchema,
  insertInquirySchema,
  insertNoticeSchema,
  insertFaqSchema,
  insertAddressSchema,
  insertAdminSchema,
} from "@shared/schema";

const { Pool } = pg;

declare module "express-session" {
  interface SessionData {
    memberId?: number;
    adminId?: number;
  }
}

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WN${year}${month}${day}${random}`;
}

function generatePaymentNumber(): string {
  const now = new Date();
  const timestamp = now.getTime().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PAY${timestamp}${random}`;
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const PgSession = connectPgSimple(session);
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  app.use(
    session({
      store: new PgSession({
        pool,
        tableName: "sessions",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "wellnix-secret-key-2024",
      resave: false,
      saveUninitialized: false,
      cookie: {
        secure: false,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
      },
    })
  );

  const requireAuth = (req: Request, res: Response, next: Function) => {
    if (!req.session.memberId) {
      return res.status(401).json({ error: "로그인이 필요합니다" });
    }
    next();
  };

  const requireAdmin = (req: Request, res: Response, next: Function) => {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "관리자 권한이 필요합니다" });
    }
    next();
  };

  // ============================================================================
  // Auth Routes
  // ============================================================================

  app.post("/api/auth/register", async (req, res) => {
    try {
      const { email, password, name, phone, authProvider } = req.body;
      
      const existing = await storage.getMemberByEmail(email);
      if (existing) {
        return res.status(400).json({ error: "이미 가입된 이메일입니다" });
      }

      const hashedPassword = authProvider === "email" && password 
        ? await bcrypt.hash(password, 10) 
        : null;

      const member = await storage.createMember({
        email,
        password: hashedPassword,
        name,
        phone,
        authProvider: authProvider || "email",
        emailVerified: authProvider !== "email",
      });

      req.session.memberId = member.id;
      res.json({ success: true, member: { ...member, password: undefined } });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ error: "회원가입에 실패했습니다" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const member = await storage.getMemberByEmail(email);
      if (!member) {
        return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다" });
      }

      if (member.password) {
        const valid = await bcrypt.compare(password, member.password);
        if (!valid) {
          return res.status(401).json({ error: "이메일 또는 비밀번호가 올바르지 않습니다" });
        }
      }

      req.session.memberId = member.id;
      res.json({ success: true, member: { ...member, password: undefined } });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "로그인에 실패했습니다" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "로그아웃에 실패했습니다" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", async (req, res) => {
    if (!req.session.memberId) {
      return res.json({ member: null });
    }
    const member = await storage.getMember(req.session.memberId);
    res.json({ member: member ? { ...member, password: undefined } : null });
  });

  // ============================================================================
  // Admin Auth Routes
  // ============================================================================

  app.post("/api/admin/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const admin = await storage.getAdminByEmail(email);
      if (!admin) {
        return res.status(401).json({ error: "관리자 정보가 올바르지 않습니다" });
      }

      const valid = await bcrypt.compare(password, admin.password);
      if (!valid) {
        return res.status(401).json({ error: "관리자 정보가 올바르지 않습니다" });
      }

      await storage.updateAdmin(admin.id, { lastLogin: new Date() });
      req.session.adminId = admin.id;
      res.json({ success: true, admin: { ...admin, password: undefined } });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ error: "로그인에 실패했습니다" });
    }
  });

  app.post("/api/admin/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "로그아웃에 실패했습니다" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/admin/auth/me", async (req, res) => {
    if (!req.session.adminId) {
      return res.json({ admin: null });
    }
    const admin = await storage.getAdmin(req.session.adminId);
    res.json({ admin: admin ? { ...admin, password: undefined } : null });
  });

  // ============================================================================
  // Category Routes
  // ============================================================================

  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getAllCategories();
    res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const category = await storage.getCategory(parseInt(req.params.id));
    if (!category) {
      return res.status(404).json({ error: "카테고리를 찾을 수 없습니다" });
    }
    res.json(category);
  });

  app.post("/api/admin/categories", requireAdmin, async (req, res) => {
    try {
      const data = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(data);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "카테고리 생성에 실패했습니다" });
    }
  });

  app.put("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    try {
      const category = await storage.updateCategory(parseInt(req.params.id), req.body);
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: "카테고리 수정에 실패했습니다" });
    }
  });

  app.delete("/api/admin/categories/:id", requireAdmin, async (req, res) => {
    await storage.deleteCategory(parseInt(req.params.id));
    res.json({ success: true });
  });

  // ============================================================================
  // Product Routes
  // ============================================================================

  app.get("/api/products", async (req, res) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    const products = await storage.getAllProducts(categoryId);
    res.json(products);
  });

  app.get("/api/products/featured", async (req, res) => {
    const products = await storage.getFeaturedProducts();
    res.json(products);
  });

  app.get("/api/products/search", async (req, res) => {
    const query = req.query.q as string || "";
    const products = await storage.searchProducts(query);
    res.json(products);
  });

  app.get("/api/products/:id", async (req, res) => {
    const product = await storage.getProduct(parseInt(req.params.id));
    if (!product) {
      return res.status(404).json({ error: "상품을 찾을 수 없습니다" });
    }
    res.json(product);
  });

  app.post("/api/admin/products", requireAdmin, async (req, res) => {
    try {
      const data = insertProductSchema.parse(req.body);
      const product = await storage.createProduct(data);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "상품 생성에 실패했습니다" });
    }
  });

  app.put("/api/admin/products/:id", requireAdmin, async (req, res) => {
    try {
      const product = await storage.updateProduct(parseInt(req.params.id), req.body);
      res.json(product);
    } catch (error) {
      res.status(400).json({ error: "상품 수정에 실패했습니다" });
    }
  });

  app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
    await storage.deleteProduct(parseInt(req.params.id));
    res.json({ success: true });
  });

  // ============================================================================
  // Subscription Plan Routes
  // ============================================================================

  app.get("/api/subscription-plans", async (req, res) => {
    const plans = await storage.getAllSubscriptionPlans();
    res.json(plans);
  });

  app.get("/api/subscription-plans/:id", async (req, res) => {
    const plan = await storage.getSubscriptionPlan(parseInt(req.params.id));
    if (!plan) {
      return res.status(404).json({ error: "구독 플랜을 찾을 수 없습니다" });
    }
    res.json(plan);
  });

  // ============================================================================
  // Subscription Routes
  // ============================================================================

  app.get("/api/subscriptions", requireAuth, async (req, res) => {
    const subscriptions = await storage.getSubscriptionsByMember(req.session.memberId!);
    res.json(subscriptions);
  });

  app.post("/api/subscriptions", requireAuth, async (req, res) => {
    try {
      const data = insertSubscriptionSchema.parse({
        ...req.body,
        memberId: req.session.memberId,
      });
      const subscription = await storage.createSubscription(data);
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ error: "구독 신청에 실패했습니다" });
    }
  });

  app.put("/api/subscriptions/:id", requireAuth, async (req, res) => {
    try {
      const subscription = await storage.updateSubscription(parseInt(req.params.id), req.body);
      res.json(subscription);
    } catch (error) {
      res.status(400).json({ error: "구독 수정에 실패했습니다" });
    }
  });

  app.get("/api/admin/subscriptions", requireAdmin, async (req, res) => {
    const subscriptions = await storage.getAllSubscriptions();
    res.json(subscriptions);
  });

  // ============================================================================
  // Monthly Box Routes
  // ============================================================================

  app.get("/api/monthly-boxes", async (req, res) => {
    const boxes = await storage.getAllMonthlyBoxes();
    res.json(boxes);
  });

  // ============================================================================
  // Event Routes
  // ============================================================================

  app.get("/api/events", async (req, res) => {
    const events = await storage.getAllEvents();
    res.json(events);
  });

  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEvent(parseInt(req.params.id));
    if (!event) {
      return res.status(404).json({ error: "행사를 찾을 수 없습니다" });
    }
    res.json(event);
  });

  app.post("/api/events/:id/participate", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      const event = await storage.getEvent(eventId);
      
      if (!event) {
        return res.status(404).json({ error: "행사를 찾을 수 없습니다" });
      }

      if (event.maxParticipants && (event.currentParticipants || 0) >= event.maxParticipants) {
        return res.status(400).json({ error: "참가 인원이 마감되었습니다" });
      }

      const data = insertEventParticipantSchema.parse({
        ...req.body,
        eventId,
        memberId: req.session.memberId || null,
      });
      
      const participant = await storage.createEventParticipant(data);
      res.json(participant);
    } catch (error) {
      res.status(400).json({ error: "행사 참가 신청에 실패했습니다" });
    }
  });

  app.get("/api/admin/events/:id/participants", requireAdmin, async (req, res) => {
    const participants = await storage.getEventParticipants(parseInt(req.params.id));
    res.json(participants);
  });

  app.post("/api/admin/events", requireAdmin, async (req, res) => {
    try {
      const data = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(data);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "행사 생성에 실패했습니다" });
    }
  });

  app.put("/api/admin/events/:id", requireAdmin, async (req, res) => {
    try {
      const event = await storage.updateEvent(parseInt(req.params.id), req.body);
      res.json(event);
    } catch (error) {
      res.status(400).json({ error: "행사 수정에 실패했습니다" });
    }
  });

  app.delete("/api/admin/events/:id", requireAdmin, async (req, res) => {
    await storage.deleteEvent(parseInt(req.params.id));
    res.json({ success: true });
  });

  // ============================================================================
  // Cart Routes
  // ============================================================================

  app.get("/api/cart", requireAuth, async (req, res) => {
    const items = await storage.getCartItems(req.session.memberId!);
    res.json(items);
  });

  app.post("/api/cart", requireAuth, async (req, res) => {
    try {
      const item = await storage.addToCart({
        memberId: req.session.memberId!,
        productId: req.body.productId,
        quantity: req.body.quantity || 1,
        options: req.body.options,
      });
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "장바구니 추가에 실패했습니다" });
    }
  });

  app.put("/api/cart/:id", requireAuth, async (req, res) => {
    try {
      const item = await storage.updateCartItem(parseInt(req.params.id), req.body.quantity);
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "장바구니 수정에 실패했습니다" });
    }
  });

  app.delete("/api/cart/:id", requireAuth, async (req, res) => {
    await storage.removeFromCart(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.delete("/api/cart", requireAuth, async (req, res) => {
    await storage.clearCart(req.session.memberId!);
    res.json({ success: true });
  });

  // ============================================================================
  // Order Routes
  // ============================================================================

  app.get("/api/orders", requireAuth, async (req, res) => {
    const orders = await storage.getOrdersByMember(req.session.memberId!);
    res.json(orders);
  });

  app.get("/api/orders/:id", requireAuth, async (req, res) => {
    const order = await storage.getOrder(parseInt(req.params.id));
    if (!order || order.memberId !== req.session.memberId) {
      return res.status(404).json({ error: "주문을 찾을 수 없습니다" });
    }
    const items = await storage.getOrderItems(order.id);
    res.json({ ...order, items });
  });

  app.post("/api/orders", requireAuth, async (req, res) => {
    try {
      const orderNumber = generateOrderNumber();
      const data = insertOrderSchema.parse({
        ...req.body,
        memberId: req.session.memberId,
        orderNumber,
      });
      
      const order = await storage.createOrder(data);
      
      if (req.body.items && Array.isArray(req.body.items)) {
        for (const item of req.body.items) {
          await storage.createOrderItem({
            orderId: order.id,
            ...item,
          });
        }
      }

      await storage.clearCart(req.session.memberId!);
      res.json(order);
    } catch (error) {
      console.error("Order creation error:", error);
      res.status(400).json({ error: "주문 생성에 실패했습니다" });
    }
  });

  app.get("/api/admin/orders", requireAdmin, async (req, res) => {
    const orders = await storage.getAllOrders();
    res.json(orders);
  });

  app.put("/api/admin/orders/:id", requireAdmin, async (req, res) => {
    try {
      const order = await storage.updateOrder(parseInt(req.params.id), req.body);
      res.json(order);
    } catch (error) {
      res.status(400).json({ error: "주문 수정에 실패했습니다" });
    }
  });

  // ============================================================================
  // Payment Routes
  // ============================================================================

  app.get("/api/payments", requireAuth, async (req, res) => {
    const payments = await storage.getPaymentsByMember(req.session.memberId!);
    res.json(payments);
  });

  app.post("/api/payments", requireAuth, async (req, res) => {
    try {
      const paymentNumber = generatePaymentNumber();
      const payment = await storage.createPayment({
        ...req.body,
        memberId: req.session.memberId,
        paymentNumber,
      });
      res.json(payment);
    } catch (error) {
      res.status(400).json({ error: "결제 처리에 실패했습니다" });
    }
  });

  app.get("/api/admin/payments", requireAdmin, async (req, res) => {
    const payments = await storage.getAllPayments();
    res.json(payments);
  });

  // ============================================================================
  // Shipping Routes
  // ============================================================================

  app.get("/api/shipping/:orderId", requireAuth, async (req, res) => {
    const shipping = await storage.getShipping(parseInt(req.params.orderId));
    res.json(shipping);
  });

  app.get("/api/admin/shipping", requireAdmin, async (req, res) => {
    const shipping = await storage.getAllShipping();
    res.json(shipping);
  });

  app.put("/api/admin/shipping/:id", requireAdmin, async (req, res) => {
    try {
      const shipping = await storage.updateShipping(parseInt(req.params.id), req.body);
      res.json(shipping);
    } catch (error) {
      res.status(400).json({ error: "배송 정보 수정에 실패했습니다" });
    }
  });

  // ============================================================================
  // Review Routes
  // ============================================================================

  app.get("/api/products/:id/reviews", async (req, res) => {
    const reviews = await storage.getReviewsByProduct(parseInt(req.params.id));
    res.json(reviews);
  });

  app.get("/api/reviews", requireAuth, async (req, res) => {
    const reviews = await storage.getReviewsByMember(req.session.memberId!);
    res.json(reviews);
  });

  app.post("/api/reviews", requireAuth, async (req, res) => {
    try {
      const data = insertReviewSchema.parse({
        ...req.body,
        memberId: req.session.memberId,
      });
      const review = await storage.createReview(data);
      res.json(review);
    } catch (error) {
      res.status(400).json({ error: "리뷰 작성에 실패했습니다" });
    }
  });

  app.put("/api/reviews/:id", requireAuth, async (req, res) => {
    try {
      const review = await storage.updateReview(parseInt(req.params.id), req.body);
      res.json(review);
    } catch (error) {
      res.status(400).json({ error: "리뷰 수정에 실패했습니다" });
    }
  });

  app.delete("/api/reviews/:id", requireAuth, async (req, res) => {
    await storage.deleteReview(parseInt(req.params.id));
    res.json({ success: true });
  });

  // ============================================================================
  // Wishlist Routes
  // ============================================================================

  app.get("/api/wishlist", requireAuth, async (req, res) => {
    const wishlist = await storage.getWishlist(req.session.memberId!);
    res.json(wishlist);
  });

  app.post("/api/wishlist", requireAuth, async (req, res) => {
    try {
      const item = await storage.addToWishlist({
        memberId: req.session.memberId!,
        productId: req.body.productId,
      });
      res.json(item);
    } catch (error) {
      res.status(400).json({ error: "찜 추가에 실패했습니다" });
    }
  });

  app.delete("/api/wishlist/:productId", requireAuth, async (req, res) => {
    await storage.removeFromWishlist(req.session.memberId!, parseInt(req.params.productId));
    res.json({ success: true });
  });

  app.get("/api/wishlist/:productId/check", requireAuth, async (req, res) => {
    const isWished = await storage.isInWishlist(req.session.memberId!, parseInt(req.params.productId));
    res.json({ isWished });
  });

  // ============================================================================
  // Notification Routes
  // ============================================================================

  app.get("/api/notifications", requireAuth, async (req, res) => {
    const notifications = await storage.getNotifications(req.session.memberId!);
    res.json(notifications);
  });

  app.put("/api/notifications/:id/read", requireAuth, async (req, res) => {
    await storage.markNotificationRead(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.put("/api/notifications/read-all", requireAuth, async (req, res) => {
    await storage.markAllNotificationsRead(req.session.memberId!);
    res.json({ success: true });
  });

  // ============================================================================
  // Notice Routes
  // ============================================================================

  app.get("/api/notices", async (req, res) => {
    const notices = await storage.getAllNotices();
    res.json(notices);
  });

  app.get("/api/notices/:id", async (req, res) => {
    const notice = await storage.getNotice(parseInt(req.params.id));
    if (!notice) {
      return res.status(404).json({ error: "공지사항을 찾을 수 없습니다" });
    }
    res.json(notice);
  });

  app.post("/api/admin/notices", requireAdmin, async (req, res) => {
    try {
      const data = insertNoticeSchema.parse(req.body);
      const notice = await storage.createNotice(data);
      res.json(notice);
    } catch (error) {
      res.status(400).json({ error: "공지사항 생성에 실패했습니다" });
    }
  });

  app.put("/api/admin/notices/:id", requireAdmin, async (req, res) => {
    try {
      const notice = await storage.updateNotice(parseInt(req.params.id), req.body);
      res.json(notice);
    } catch (error) {
      res.status(400).json({ error: "공지사항 수정에 실패했습니다" });
    }
  });

  app.delete("/api/admin/notices/:id", requireAdmin, async (req, res) => {
    await storage.deleteNotice(parseInt(req.params.id));
    res.json({ success: true });
  });

  // ============================================================================
  // FAQ Routes
  // ============================================================================

  app.get("/api/faqs", async (req, res) => {
    const faqs = await storage.getAllFaqs();
    res.json(faqs);
  });

  app.post("/api/admin/faqs", requireAdmin, async (req, res) => {
    try {
      const data = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(data);
      res.json(faq);
    } catch (error) {
      res.status(400).json({ error: "FAQ 생성에 실패했습니다" });
    }
  });

  app.put("/api/admin/faqs/:id", requireAdmin, async (req, res) => {
    try {
      const faq = await storage.updateFaq(parseInt(req.params.id), req.body);
      res.json(faq);
    } catch (error) {
      res.status(400).json({ error: "FAQ 수정에 실패했습니다" });
    }
  });

  app.delete("/api/admin/faqs/:id", requireAdmin, async (req, res) => {
    await storage.deleteFaq(parseInt(req.params.id));
    res.json({ success: true });
  });

  // ============================================================================
  // Inquiry Routes
  // ============================================================================

  app.get("/api/inquiries", requireAuth, async (req, res) => {
    const inquiries = await storage.getInquiriesByMember(req.session.memberId!);
    res.json(inquiries);
  });

  app.post("/api/inquiries", requireAuth, async (req, res) => {
    try {
      const data = insertInquirySchema.parse({
        ...req.body,
        memberId: req.session.memberId,
      });
      const inquiry = await storage.createInquiry(data);
      res.json(inquiry);
    } catch (error) {
      res.status(400).json({ error: "문의 등록에 실패했습니다" });
    }
  });

  app.get("/api/admin/inquiries", requireAdmin, async (req, res) => {
    const inquiries = await storage.getAllInquiries();
    res.json(inquiries);
  });

  app.put("/api/admin/inquiries/:id", requireAdmin, async (req, res) => {
    try {
      const inquiry = await storage.updateInquiry(parseInt(req.params.id), {
        ...req.body,
        answeredBy: req.session.adminId,
        answeredAt: new Date(),
        status: "answered",
      });
      res.json(inquiry);
    } catch (error) {
      res.status(400).json({ error: "문의 답변에 실패했습니다" });
    }
  });

  // ============================================================================
  // Address Routes
  // ============================================================================

  app.get("/api/addresses", requireAuth, async (req, res) => {
    const addresses = await storage.getAddresses(req.session.memberId!);
    res.json(addresses);
  });

  app.post("/api/addresses", requireAuth, async (req, res) => {
    try {
      const data = insertAddressSchema.parse({
        ...req.body,
        memberId: req.session.memberId,
      });
      const address = await storage.createAddress(data);
      res.json(address);
    } catch (error) {
      res.status(400).json({ error: "배송지 등록에 실패했습니다" });
    }
  });

  app.put("/api/addresses/:id", requireAuth, async (req, res) => {
    try {
      const address = await storage.updateAddress(parseInt(req.params.id), req.body);
      res.json(address);
    } catch (error) {
      res.status(400).json({ error: "배송지 수정에 실패했습니다" });
    }
  });

  app.delete("/api/addresses/:id", requireAuth, async (req, res) => {
    await storage.deleteAddress(parseInt(req.params.id));
    res.json({ success: true });
  });

  app.put("/api/addresses/:id/default", requireAuth, async (req, res) => {
    await storage.setDefaultAddress(req.session.memberId!, parseInt(req.params.id));
    res.json({ success: true });
  });

  // ============================================================================
  // Admin Member Routes
  // ============================================================================

  app.get("/api/admin/members", requireAdmin, async (req, res) => {
    const members = await storage.getAllMembers();
    res.json(members.map(m => ({ ...m, password: undefined })));
  });

  app.get("/api/admin/members/:id", requireAdmin, async (req, res) => {
    const member = await storage.getMember(parseInt(req.params.id));
    if (!member) {
      return res.status(404).json({ error: "회원을 찾을 수 없습니다" });
    }
    res.json({ ...member, password: undefined });
  });

  app.put("/api/admin/members/:id", requireAdmin, async (req, res) => {
    try {
      const member = await storage.updateMember(parseInt(req.params.id), req.body);
      res.json({ ...member, password: undefined });
    } catch (error) {
      res.status(400).json({ error: "회원 정보 수정에 실패했습니다" });
    }
  });

  // ============================================================================
  // Admin Routes
  // ============================================================================

  app.get("/api/admin/admins", requireAdmin, async (req, res) => {
    const admins = await storage.getAllAdmins();
    res.json(admins.map(a => ({ ...a, password: undefined })));
  });

  app.post("/api/admin/admins", requireAdmin, async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const data = insertAdminSchema.parse({
        ...req.body,
        password: hashedPassword,
      });
      const admin = await storage.createAdmin(data);
      res.json({ ...admin, password: undefined });
    } catch (error) {
      res.status(400).json({ error: "관리자 생성에 실패했습니다" });
    }
  });

  app.put("/api/admin/admins/:id", requireAdmin, async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      const admin = await storage.updateAdmin(parseInt(req.params.id), updateData);
      res.json({ ...admin, password: undefined });
    } catch (error) {
      res.status(400).json({ error: "관리자 정보 수정에 실패했습니다" });
    }
  });

  // ============================================================================
  // Member Profile Routes
  // ============================================================================

  app.get("/api/profile", requireAuth, async (req, res) => {
    const member = await storage.getMember(req.session.memberId!);
    res.json({ ...member, password: undefined });
  });

  app.put("/api/profile", requireAuth, async (req, res) => {
    try {
      const updateData = { ...req.body };
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }
      const member = await storage.updateMember(req.session.memberId!, updateData);
      res.json({ ...member, password: undefined });
    } catch (error) {
      res.status(400).json({ error: "프로필 수정에 실패했습니다" });
    }
  });

  // ============================================================================
  // Coupon Routes
  // ============================================================================

  app.get("/api/coupons", requireAuth, async (req, res) => {
    const coupons = await storage.getMemberCoupons(req.session.memberId!);
    res.json(coupons);
  });

  app.post("/api/coupons/apply", requireAuth, async (req, res) => {
    try {
      const coupon = await storage.getCouponByCode(req.body.code);
      if (!coupon) {
        return res.status(404).json({ error: "유효하지 않은 쿠폰 코드입니다" });
      }
      
      const now = new Date();
      if (now < coupon.validFrom || now > coupon.validTo) {
        return res.status(400).json({ error: "사용 기간이 아닙니다" });
      }

      if (!coupon.isActive) {
        return res.status(400).json({ error: "사용할 수 없는 쿠폰입니다" });
      }

      const memberCoupon = await storage.addMemberCoupon({
        memberId: req.session.memberId!,
        couponId: coupon.id,
      });

      res.json({ coupon, memberCoupon });
    } catch (error) {
      res.status(400).json({ error: "쿠폰 등록에 실패했습니다" });
    }
  });

  app.get("/api/admin/coupons", requireAdmin, async (req, res) => {
    const coupons = await storage.getAllCoupons();
    res.json(coupons);
  });

  return httpServer;
}
