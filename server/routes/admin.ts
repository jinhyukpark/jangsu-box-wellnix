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
    console.log("Request Body:", JSON.stringify(req.body, null, 2));
    
    const updateData: Record<string, any> = {};
    const fields = [
      'name', 'shortDescription', 'description', 'descriptionMarkdown',
      'categoryId', 'price', 'originalPrice', 'image', 'images', 'stock',
      'status', 'isFeatured', 'origin', 'manufacturer', 'expirationInfo',
      'storageMethod', 'shippingInfo', 'refundInfo'
    ];
    for (const field of fields) {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    }
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
    if (updateData.descriptionMarkdown && !updateData.description) {
      updateData.description = updateData.descriptionMarkdown.replace(/[#*`\[\]]/g, '').substring(0, 500);
    }
    
    console.log("Update Data:", JSON.stringify(updateData, null, 2));
    
    const product = await storage.updateProduct(parseInt(req.params.id), updateData);
    console.log("Update successful:", product?.id);
    res.json(product);
  } catch (error: any) {
    console.error("=== Product Update Error ===");
    console.error("Error name:", error?.name);
    console.error("Error message:", error?.message);
    console.error("Error stack:", error?.stack);
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

export default router;
