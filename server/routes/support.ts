import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertInquirySchema, insertNoticeSchema, insertFaqSchema } from "@shared/schema";
import { requireAuth, requireAdmin } from "../middleware";

const router = Router();

router.get("/api/inquiries", requireAuth, async (req: Request, res: Response) => {
  const inquiries = await storage.getInquiriesByMember(req.session.memberId!);
  res.json(inquiries);
});

router.post("/api/inquiries", requireAuth, async (req: Request, res: Response) => {
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

router.get("/api/admin/inquiries", requireAdmin, async (req: Request, res: Response) => {
  const inquiries = await storage.getAllInquiries();
  res.json(inquiries);
});

router.put("/api/admin/inquiries/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const inquiry = await storage.updateInquiry(parseInt(req.params.id), req.body);
    res.json(inquiry);
  } catch (error) {
    res.status(400).json({ error: "문의 수정에 실패했습니다" });
  }
});

router.get("/api/notices", async (req: Request, res: Response) => {
  const notices = await storage.getAllNotices();
  res.json(notices);
});

router.get("/api/notices/:id", async (req: Request, res: Response) => {
  const notice = await storage.getNotice(parseInt(req.params.id));
  if (!notice) {
    return res.status(404).json({ error: "공지를 찾을 수 없습니다" });
  }
  res.json(notice);
});

router.post("/api/admin/notices", requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = insertNoticeSchema.parse(req.body);
    const notice = await storage.createNotice(data);
    res.json(notice);
  } catch (error) {
    res.status(400).json({ error: "공지 등록에 실패했습니다" });
  }
});

router.put("/api/admin/notices/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const notice = await storage.updateNotice(parseInt(req.params.id), req.body);
    res.json(notice);
  } catch (error) {
    res.status(400).json({ error: "공지 수정에 실패했습니다" });
  }
});

router.delete("/api/admin/notices/:id", requireAdmin, async (req: Request, res: Response) => {
  await storage.deleteNotice(parseInt(req.params.id));
  res.json({ success: true });
});

router.get("/api/faqs", async (req: Request, res: Response) => {
  const faqs = await storage.getAllFaqs();
  res.json(faqs);
});

router.post("/api/admin/faqs", requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = insertFaqSchema.parse(req.body);
    const faq = await storage.createFaq(data);
    res.json(faq);
  } catch (error) {
    res.status(400).json({ error: "FAQ 등록에 실패했습니다" });
  }
});

router.put("/api/admin/faqs/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const faq = await storage.updateFaq(parseInt(req.params.id), req.body);
    res.json(faq);
  } catch (error) {
    res.status(400).json({ error: "FAQ 수정에 실패했습니다" });
  }
});

router.delete("/api/admin/faqs/:id", requireAdmin, async (req: Request, res: Response) => {
  await storage.deleteFaq(parseInt(req.params.id));
  res.json({ success: true });
});

export default router;
