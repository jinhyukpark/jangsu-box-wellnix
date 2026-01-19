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

router.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: "이메일을 입력해주세요" });
    }

    const member = await storage.getMemberByEmail(email);
    
    // Always return success to prevent email enumeration attacks
    // In production, send actual password reset email here
    if (member) {
      // TODO: Integrate email service to send actual reset link
      // For now, log the request
      console.log(`Password reset requested for: ${email}`);
    }
    
    res.json({ 
      success: true, 
      message: "해당 이메일로 비밀번호 재설정 링크를 보냈습니다. 이메일을 확인해주세요." 
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "잠시 후 다시 시도해주세요" });
  }
});

export default router;
