import { Request, Response, NextFunction } from "express";

declare module "express-session" {
  interface SessionData {
    memberId?: number;
    adminId?: number;
  }
}

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.memberId) {
    return res.status(401).json({ error: "로그인이 필요합니다" });
  }
  next();
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session.adminId) {
    return res.status(401).json({ error: "관리자 권한이 필요합니다" });
  }
  next();
};
