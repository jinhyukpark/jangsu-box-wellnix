import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "../storage";
import { insertAdminSchema, insertProductSchema } from "@shared/schema";
import { requireAdmin } from "../middleware";

const router = Router();

router.get("/api/admin/admins", requireAdmin, async (req: Request, res: Response) => {
  const admins = await storage.getAllAdmins();
  res.json(admins.map(a => ({ ...a, password: undefined })));
});

router.post("/api/admin/admins", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = insertAdminSchema.parse({
      ...rest,
      password: hashedPassword,
    });
    const admin = await storage.createAdmin(data);
    res.json({ ...admin, password: undefined });
  } catch (error) {
    console.error("Admin creation error:", error);
    res.status(400).json({ error: "관리자 등록에 실패했습니다" });
  }
});

router.put("/api/admin/admins/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { password, ...rest } = req.body;
    const updateData: any = { ...rest };
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }
    const admin = await storage.updateAdmin(parseInt(req.params.id), updateData);
    res.json({ ...admin, password: undefined });
  } catch (error) {
    res.status(400).json({ error: "관리자 정보 수정에 실패했습니다" });
  }
});

router.delete("/api/admin/admins/:id", requireAdmin, async (req: Request, res: Response) => {
  const currentAdminId = req.session.adminId;
  if (currentAdminId === parseInt(req.params.id)) {
    return res.status(400).json({ error: "자신의 계정은 삭제할 수 없습니다" });
  }
  await storage.deleteAdmin(parseInt(req.params.id));
  res.json({ success: true });
});

router.get("/api/admin/dashboard/stats", requireAdmin, async (req: Request, res: Response) => {
  try {
    const [members, products, orders, subscriptions] = await Promise.all([
      storage.getAllMembers(),
      storage.getAllProducts(),
      storage.getAllOrders(),
      storage.getAllSubscriptions(),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayOrders = orders.filter(o => new Date(o.createdAt!) >= today);
    const todaySales = todayOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

    const activeSubscriptions = subscriptions.filter(s => s.status === "active");

    res.json({
      totalMembers: members.length,
      totalProducts: products.length,
      todayOrders: todayOrders.length,
      todaySales,
      activeSubscriptions: activeSubscriptions.length,
      pendingOrders: orders.filter(o => o.status === "pending").length,
    });
  } catch (error) {
    res.status(500).json({ error: "대시보드 통계를 가져오는데 실패했습니다" });
  }
});

router.post("/api/admin/products", requireAdmin, async (req: Request, res: Response) => {
  try {
    if (!req.body.name || !req.body.price) {
      return res.status(400).json({ error: "상품명과 가격은 필수입니다" });
    }
    let description = req.body.description || null;
    if (!description && req.body.descriptionMarkdown) {
      description = req.body.descriptionMarkdown.replace(/[#*`\[\]]/g, '').substring(0, 500);
    }
    const productData = {
      name: req.body.name,
      shortDescription: req.body.shortDescription || null,
      description: description,
      descriptionMarkdown: req.body.descriptionMarkdown || null,
      categoryId: req.body.categoryId || null,
      price: req.body.price,
      originalPrice: req.body.originalPrice || null,
      image: req.body.image || null,
      images: req.body.images || [],
      stock: req.body.stock || 0,
      status: req.body.status || "active",
      isFeatured: req.body.isFeatured || false,
      origin: req.body.origin || "국내산",
      manufacturer: req.body.manufacturer || "웰닉스(주)",
      expirationInfo: req.body.expirationInfo || "별도 표시",
      storageMethod: req.body.storageMethod || "직사광선을 피해 서늘한 곳에 보관",
      shippingInfo: req.body.shippingInfo || null,
      refundInfo: req.body.refundInfo || null,
    };
    const product = await storage.createProduct(productData);
    res.json(product);
  } catch (error) {
    console.error("Product creation error:", error);
    res.status(400).json({ error: "상품 등록에 실패했습니다" });
  }
});

router.put("/api/admin/products/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    console.log("=== Product Update Request ===");
    console.log("Product ID:", req.params.id);
    
    // Only allow these specific fields to be updated (no date fields, id, rating, reviewCount)
    const updateData: Record<string, any> = {};
    const allowedFields = [
      'name', 'shortDescription', 'description', 'descriptionMarkdown',
      'categoryId', 'price', 'originalPrice', 'image', 'images', 'stock',
      'status', 'isFeatured', 'origin', 'manufacturer', 'expirationInfo',
      'storageMethod', 'shippingInfo', 'refundInfo'
    ];
    
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
    
    // Convert numeric fields from strings
    if (typeof updateData.price === 'string') {
      updateData.price = parseInt(updateData.price) || 0;
    }
    if (typeof updateData.originalPrice === 'string') {
      updateData.originalPrice = updateData.originalPrice ? parseInt(updateData.originalPrice) : null;
    }
    if (typeof updateData.stock === 'string') {
      updateData.stock = parseInt(updateData.stock) || 0;
    }
    if (typeof updateData.categoryId === 'string') {
      updateData.categoryId = updateData.categoryId ? parseInt(updateData.categoryId) : null;
    }
    
    // Handle boolean conversion
    if (typeof updateData.isFeatured === 'string') {
      updateData.isFeatured = updateData.isFeatured === 'true';
    }
    
    // Auto-generate description from markdown if needed
    if (updateData.descriptionMarkdown && !updateData.description) {
      updateData.description = updateData.descriptionMarkdown.replace(/[#*`\[\]]/g, '').substring(0, 500);
    }
    
    console.log("Filtered Update Data:", JSON.stringify(updateData, null, 2));
    
    const product = await storage.updateProduct(parseInt(req.params.id), updateData);
    console.log("Update successful:", product?.id);
    res.json(product);
  } catch (error: any) {
    console.error("=== Product Update Error ===");
    console.error("Error message:", error?.message);
    res.status(400).json({ error: "상품 수정에 실패했습니다", details: error?.message });
  }
});

router.post("/api/admin/reviews/:id/reply", requireAdmin, async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { reply } = req.body;
    const review = await storage.updateReview(reviewId, {
      adminReply: reply,
      adminReplyAt: new Date(),
      adminReplyBy: req.session.adminId,
    });
    res.json(review);
  } catch (error) {
    console.error("Review reply error:", error);
    res.status(400).json({ error: "답변 등록에 실패했습니다" });
  }
});

// 리뷰 내용 수정
router.put("/api/admin/reviews/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { content } = req.body;
    const review = await storage.updateReview(reviewId, { content });
    res.json(review);
  } catch (error) {
    console.error("Review update error:", error);
    res.status(400).json({ error: "리뷰 수정에 실패했습니다" });
  }
});

// 리뷰 삭제
router.delete("/api/admin/reviews/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);
    await storage.deleteReview(reviewId);
    res.json({ success: true });
  } catch (error) {
    console.error("Review delete error:", error);
    res.status(400).json({ error: "리뷰 삭제에 실패했습니다" });
  }
});

// 답변 수정
router.put("/api/admin/reviews/:id/reply", requireAdmin, async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);
    const { reply } = req.body;
    const review = await storage.updateReview(reviewId, {
      adminReply: reply,
      adminReplyAt: new Date(),
      adminReplyBy: req.session.adminId,
    });
    res.json(review);
  } catch (error) {
    console.error("Reply update error:", error);
    res.status(400).json({ error: "답변 수정에 실패했습니다" });
  }
});

// 답변 삭제
router.delete("/api/admin/reviews/:id/reply", requireAdmin, async (req: Request, res: Response) => {
  try {
    const reviewId = parseInt(req.params.id);
    const review = await storage.updateReview(reviewId, {
      adminReply: null,
      adminReplyAt: null,
      adminReplyBy: null,
    });
    res.json(review);
  } catch (error) {
    console.error("Reply delete error:", error);
    res.status(400).json({ error: "답변 삭제에 실패했습니다" });
  }
});

// ============================================================================
// 사이트 브랜딩 관리
// ============================================================================

router.get("/api/admin/branding", requireAdmin, async (req: Request, res: Response) => {
  try {
    const items = await storage.getAllSiteBranding();
    res.json(items);
  } catch (error) {
    console.error("Get branding error:", error);
    res.status(500).json({ error: "브랜딩 정보를 불러올 수 없습니다" });
  }
});

router.get("/api/branding", async (req: Request, res: Response) => {
  try {
    const items = await storage.getAllSiteBranding();
    res.json(items);
  } catch (error) {
    console.error("Get branding error:", error);
    res.status(500).json({ error: "브랜딩 정보를 불러올 수 없습니다" });
  }
});

router.put("/api/admin/branding/:key", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { key } = req.params;
    const data = req.body;
    const item = await storage.upsertSiteBranding(key, data);
    res.json(item);
  } catch (error) {
    console.error("Update branding error:", error);
    res.status(400).json({ error: "브랜딩 정보 수정에 실패했습니다" });
  }
});

// ============================================================================
// 메인 페이지 설정 관리
// ============================================================================

router.get("/api/admin/main-page-settings", requireAdmin, async (req: Request, res: Response) => {
  try {
    const settings = await storage.getMainPageSettings();
    res.json(settings || {
      bestProductsCriteria: "sales",
      bestProductsManualIds: [],
      bestProductsLimit: 6,
      adBannerImage: null,
      adBannerLink: null,
      adBannerEnabled: true,
      newProductsCriteria: "recent",
      newProductsManualIds: [],
      newProductsLimit: 6,
      newProductsDaysThreshold: 30,
      eventsCriteria: "active",
      eventsManualIds: [],
      eventsLimit: 4,
    });
  } catch (error) {
    console.error("Get main page settings error:", error);
    res.status(500).json({ error: "메인 페이지 설정을 불러올 수 없습니다" });
  }
});

router.get("/api/main-page-settings", async (req: Request, res: Response) => {
  try {
    const settings = await storage.getMainPageSettings();
    res.json(settings || {
      bestProductsCriteria: "sales",
      bestProductsManualIds: [],
      bestProductsLimit: 6,
      adBannerImage: null,
      adBannerLink: null,
      adBannerEnabled: true,
      newProductsCriteria: "recent",
      newProductsManualIds: [],
      newProductsLimit: 6,
      newProductsDaysThreshold: 30,
      eventsCriteria: "active",
      eventsManualIds: [],
      eventsLimit: 4,
    });
  } catch (error) {
    console.error("Get main page settings error:", error);
    res.status(500).json({ error: "메인 페이지 설정을 불러올 수 없습니다" });
  }
});

router.put("/api/admin/main-page-settings", requireAdmin, async (req: Request, res: Response) => {
  try {
    const settings = await storage.upsertMainPageSettings(req.body);
    res.json(settings);
  } catch (error) {
    console.error("Update main page settings error:", error);
    res.status(400).json({ error: "메인 페이지 설정 수정에 실패했습니다" });
  }
});

// Admin Cart Management
router.get("/api/admin/cart", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;
    let start: Date | undefined;
    let end: Date | undefined;
    
    if (startDate && endDate) {
      start = new Date(startDate as string);
      end = new Date(endDate as string);
      end.setHours(23, 59, 59, 999);
    }
    
    const cartItems = await storage.getAllCartItemsAdmin(start, end);
    res.json(cartItems);
  } catch (error) {
    console.error("Admin cart fetch error:", error);
    res.status(500).json({ error: "장바구니 목록을 가져오는데 실패했습니다" });
  }
});

router.get("/api/admin/cart/stats", requireAdmin, async (req: Request, res: Response) => {
  try {
    const stats = await storage.getCartStatsByMember();
    res.json(stats);
  } catch (error) {
    console.error("Admin cart stats error:", error);
    res.status(500).json({ error: "장바구니 통계를 가져오는데 실패했습니다" });
  }
});

router.get("/api/admin/notifications/history", requireAdmin, async (req: Request, res: Response) => {
  try {
    const history = await storage.getNotificationHistory();
    res.json(history);
  } catch (error) {
    console.error("Admin notification history error:", error);
    res.status(500).json({ error: "알림 히스토리를 가져오는데 실패했습니다" });
  }
});

router.post("/api/admin/notifications/send", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { targetType, channels, title, content, memberIds } = req.body;
    
    let targetMembers: { id: number }[] = [];
    
    if (targetType === "all") {
      const allMembers = await storage.getAllMembers();
      targetMembers = allMembers.map(m => ({ id: m.id }));
    } else if (targetType === "purchased") {
      const purchasedMembers = await storage.getMembersWithOrders();
      targetMembers = purchasedMembers;
    } else if (targetType === "not_purchased") {
      const allMembers = await storage.getAllMembers();
      const purchasedMembers = await storage.getMembersWithOrders();
      const purchasedIds = new Set(purchasedMembers.map(m => m.id));
      targetMembers = allMembers.filter(m => !purchasedIds.has(m.id)).map(m => ({ id: m.id }));
    } else if (targetType === "select" && memberIds?.length > 0) {
      targetMembers = memberIds.map((id: number) => ({ id }));
    }

    let sentCount = 0;
    
    for (const member of targetMembers) {
      if (channels.app) {
        await storage.createNotification({
          memberId: member.id,
          title,
          content,
          notificationType: "promotion",
          targetType,
          isRead: false,
          link: null
        });
        sentCount++;
      }
    }

    res.json({ success: true, sentCount, channels });
  } catch (error) {
    console.error("Admin notification send error:", error);
    res.status(500).json({ error: "알림 발송에 실패했습니다" });
  }
});

export default router;
