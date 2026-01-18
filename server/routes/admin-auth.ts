import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "../storage";

const router = Router();

router.post("/api/admin/auth/login", async (req: Request, res: Response) => {
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

router.post("/api/admin/auth/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "로그아웃에 실패했습니다" });
    }
    res.json({ success: true });
  });
});

router.get("/api/admin/auth/me", async (req: Request, res: Response) => {
  if (!req.session.adminId) {
    return res.json({ admin: null });
  }
  const admin = await storage.getAdmin(req.session.adminId);
  res.json({ admin: admin ? { ...admin, password: undefined } : null });
});

export default router;
