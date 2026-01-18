import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertSubscriptionSchema } from "@shared/schema";
import { requireAuth, requireAdmin } from "../middleware";

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
    const plan = await storage.createSubscriptionPlan(req.body);
    res.json(plan);
  } catch (error) {
    console.error("Create plan error:", error);
    res.status(400).json({ error: "플랜 등록에 실패했습니다" });
  }
});

router.put("/api/admin/subscription-plans/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const plan = await storage.updateSubscriptionPlan(parseInt(req.params.id), req.body);
    res.json(plan);
  } catch (error) {
    console.error("Update plan error:", error);
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

export default router;
