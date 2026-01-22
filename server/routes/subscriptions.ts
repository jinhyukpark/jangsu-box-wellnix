import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertSubscriptionSchema, insertSubscriptionPlanSchema, insertSubscriptionBannerSchema } from "@shared/schema";
import { requireAuth, requireAdmin } from "../middleware";
import { z } from "zod";

const router = Router();

router.get("/api/subscription-plans", async (req: Request, res: Response) => {
  const plans = await storage.getAllSubscriptionPlans();
  res.json(plans);
});

router.get("/api/subscription-plans/:id", async (req: Request, res: Response) => {
  const plan = await storage.getSubscriptionPlan(parseInt(req.params.id));
  if (!plan) {
    return res.status(404).json({ error: "구독 플랜을 찾을 수 없습니다" });
  }
  res.json(plan);
});

router.get("/api/subscriptions", requireAuth, async (req: Request, res: Response) => {
  const subscriptions = await storage.getSubscriptionsByMember(req.session.memberId!);
  res.json(subscriptions);
});

router.post("/api/subscriptions", requireAuth, async (req: Request, res: Response) => {
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

router.put("/api/subscriptions/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const subscription = await storage.updateSubscription(parseInt(req.params.id), req.body);
    res.json(subscription);
  } catch (error) {
    res.status(400).json({ error: "구독 수정에 실패했습니다" });
  }
});

router.get("/api/admin/subscriptions", requireAdmin, async (req: Request, res: Response) => {
  const subscriptions = await storage.getAllSubscriptions();
  res.json(subscriptions);
});

// ============================================================================
// 관리자 플랜 관리 API
// ============================================================================

router.get("/api/admin/subscription-plans", requireAdmin, async (req: Request, res: Response) => {
  const plans = await storage.getAllSubscriptionPlansAdmin();
  res.json(plans);
});

router.post("/api/admin/subscription-plans", requireAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = insertSubscriptionPlanSchema.parse(req.body);
    const plan = await storage.createSubscriptionPlan(validatedData);
    res.json(plan);
  } catch (error) {
    console.error("Create plan error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "입력 데이터가 올바르지 않습니다", details: error.errors });
    }
    res.status(400).json({ error: "플랜 등록에 실패했습니다" });
  }
});

router.put("/api/admin/subscription-plans/reorder", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: "orders 배열이 필요합니다" });
    }
    await storage.updateSubscriptionPlanOrders(orders);
    res.json({ success: true });
  } catch (error) {
    console.error("Reorder plans error:", error);
    res.status(400).json({ error: "플랜 순서 변경에 실패했습니다" });
  }
});

router.put("/api/admin/subscription-plans/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = insertSubscriptionPlanSchema.partial().parse(req.body);
    const plan = await storage.updateSubscriptionPlan(parseInt(req.params.id), validatedData);
    res.json(plan);
  } catch (error) {
    console.error("Update plan error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "입력 데이터가 올바르지 않습니다", details: error.errors });
    }
    res.status(400).json({ error: "플랜 수정에 실패했습니다" });
  }
});

router.delete("/api/admin/subscription-plans/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    await storage.deleteSubscriptionPlan(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error("Delete plan error:", error);
    res.status(400).json({ error: "플랜 삭제에 실패했습니다" });
  }
});

router.get("/api/monthly-boxes", async (req: Request, res: Response) => {
  const boxes = await storage.getAllMonthlyBoxes();
  res.json(boxes);
});

// ============================================================================
// 장수박스 배너 이미지 API (Subscription Banners)
// ============================================================================

// Public - 활성화된 배너만 가져오기
router.get("/api/subscription-banners", async (req: Request, res: Response) => {
  try {
    const banners = await storage.getActiveSubscriptionBanners();
    res.json(banners);
  } catch (error) {
    console.error("Get subscription banners error:", error);
    res.status(500).json({ error: "배너를 불러올 수 없습니다" });
  }
});

// Admin - 모든 배너 가져오기
router.get("/api/admin/subscription-banners", requireAdmin, async (req: Request, res: Response) => {
  try {
    const banners = await storage.getAllSubscriptionBanners();
    res.json(banners);
  } catch (error) {
    console.error("Get admin subscription banners error:", error);
    res.status(500).json({ error: "배너를 불러올 수 없습니다" });
  }
});

// Admin - 배너 생성
router.post("/api/admin/subscription-banners", requireAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = insertSubscriptionBannerSchema.parse(req.body);
    const banner = await storage.createSubscriptionBanner(validatedData);
    res.json(banner);
  } catch (error) {
    console.error("Create subscription banner error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "입력 데이터가 올바르지 않습니다", details: error.errors });
    }
    res.status(400).json({ error: "배너 등록에 실패했습니다" });
  }
});

// Admin - 배너 수정
router.put("/api/admin/subscription-banners/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const validatedData = insertSubscriptionBannerSchema.partial().parse(req.body);
    const banner = await storage.updateSubscriptionBanner(parseInt(req.params.id), validatedData);
    if (!banner) {
      return res.status(404).json({ error: "배너를 찾을 수 없습니다" });
    }
    res.json(banner);
  } catch (error) {
    console.error("Update subscription banner error:", error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: "입력 데이터가 올바르지 않습니다", details: error.errors });
    }
    res.status(400).json({ error: "배너 수정에 실패했습니다" });
  }
});

// Admin - 배너 순서 변경
router.put("/api/admin/subscription-banners/reorder", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    if (!Array.isArray(orders)) {
      return res.status(400).json({ error: "orders 배열이 필요합니다" });
    }
    await storage.reorderSubscriptionBanners(orders);
    res.json({ success: true });
  } catch (error) {
    console.error("Reorder subscription banners error:", error);
    res.status(400).json({ error: "배너 순서 변경에 실패했습니다" });
  }
});

// Admin - 배너 삭제
router.delete("/api/admin/subscription-banners/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    await storage.deleteSubscriptionBanner(parseInt(req.params.id));
    res.json({ success: true });
  } catch (error) {
    console.error("Delete subscription banner error:", error);
    res.status(400).json({ error: "배너 삭제에 실패했습니다" });
  }
});

export default router;
