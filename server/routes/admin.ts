import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "../storage";
import { insertAdminSchema } from "@shared/schema";
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

export default router;
