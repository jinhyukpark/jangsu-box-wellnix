import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "../storage";

const router = Router();

router.post("/api/auth/register", async (req: Request, res: Response) => {
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

router.post("/api/auth/login", async (req: Request, res: Response) => {
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

router.post("/api/auth/logout", (req: Request, res: Response) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "로그아웃에 실패했습니다" });
    }
    res.json({ success: true });
  });
});

router.get("/api/auth/me", async (req: Request, res: Response) => {
  if (!req.session.memberId) {
    return res.json({ member: null });
  }
  const member = await storage.getMember(req.session.memberId);
  res.json({ member: member ? { ...member, password: undefined } : null });
});

export default router;
