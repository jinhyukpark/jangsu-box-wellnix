import { Router, Request, Response } from "express";
import bcrypt from "bcryptjs";
import { storage } from "../storage";
import { insertReviewSchema, insertAddressSchema } from "@shared/schema";
import { requireAuth, requireAdmin } from "../middleware";

const router = Router();

router.get("/api/products/:id/reviews", async (req: Request, res: Response) => {
  const productReviews = await storage.getReviewsByProduct(parseInt(req.params.id));
  const reviewsWithMember = await Promise.all(
    productReviews.map(async (review) => {
      const member = await storage.getMember(review.memberId);
      const memberName = member?.name ? 
        member.name.charAt(0) + "*" + member.name.slice(-1) : "익명";
      return {
        ...review,
        memberName,
      };
    })
  );
  res.json(reviewsWithMember);
});

router.get("/api/reviews", requireAuth, async (req: Request, res: Response) => {
  const reviews = await storage.getReviewsByMember(req.session.memberId!);
  res.json(reviews);
});

router.post("/api/reviews", requireAuth, async (req: Request, res: Response) => {
  try {
    const data = insertReviewSchema.parse({
      ...req.body,
      memberId: req.session.memberId,
    });
    const review = await storage.createReview(data);
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: "리뷰 작성에 실패했습니다" });
  }
});

router.put("/api/reviews/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const review = await storage.updateReview(parseInt(req.params.id), req.body);
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: "리뷰 수정에 실패했습니다" });
  }
});

router.delete("/api/reviews/:id", requireAuth, async (req: Request, res: Response) => {
  await storage.deleteReview(parseInt(req.params.id));
  res.json({ success: true });
});

router.get("/api/wishlist", requireAuth, async (req: Request, res: Response) => {
  const wishlist = await storage.getWishlist(req.session.memberId!);
  res.json(wishlist);
});

router.post("/api/wishlist", requireAuth, async (req: Request, res: Response) => {
  try {
    const item = await storage.addToWishlist({
      memberId: req.session.memberId!,
      productId: req.body.productId,
    });
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: "찜 추가에 실패했습니다" });
  }
});

router.delete("/api/wishlist/:productId", requireAuth, async (req: Request, res: Response) => {
  await storage.removeFromWishlist(req.session.memberId!, parseInt(req.params.productId));
  res.json({ success: true });
});

router.get("/api/wishlist/:productId/check", requireAuth, async (req: Request, res: Response) => {
  const isWished = await storage.isInWishlist(req.session.memberId!, parseInt(req.params.productId));
  res.json({ isWished });
});

router.get("/api/notifications", requireAuth, async (req: Request, res: Response) => {
  const notifications = await storage.getNotifications(req.session.memberId!);
  res.json(notifications);
});

router.put("/api/notifications/:id/read", requireAuth, async (req: Request, res: Response) => {
  await storage.markNotificationRead(parseInt(req.params.id));
  res.json({ success: true });
});

router.get("/api/addresses", requireAuth, async (req: Request, res: Response) => {
  const addresses = await storage.getAddresses(req.session.memberId!);
  res.json(addresses);
});

router.post("/api/addresses", requireAuth, async (req: Request, res: Response) => {
  try {
    const data = insertAddressSchema.parse({
      ...req.body,
      memberId: req.session.memberId,
    });
    const address = await storage.createAddress(data);
    res.json(address);
  } catch (error) {
    res.status(400).json({ error: "주소 추가에 실패했습니다" });
  }
});

router.put("/api/addresses/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const address = await storage.updateAddress(parseInt(req.params.id), req.body);
    res.json(address);
  } catch (error) {
    res.status(400).json({ error: "주소 수정에 실패했습니다" });
  }
});

router.delete("/api/addresses/:id", requireAuth, async (req: Request, res: Response) => {
  await storage.deleteAddress(parseInt(req.params.id));
  res.json({ success: true });
});

router.put("/api/addresses/:id/default", requireAuth, async (req: Request, res: Response) => {
  await storage.setDefaultAddress(req.session.memberId!, parseInt(req.params.id));
  res.json({ success: true });
});

router.put("/api/members/me", requireAuth, async (req: Request, res: Response) => {
  try {
    const member = await storage.updateMember(req.session.memberId!, req.body);
    res.json({ ...member, password: undefined });
  } catch (error) {
    res.status(400).json({ error: "회원정보 수정에 실패했습니다" });
  }
});

router.put("/api/members/me/password", requireAuth, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const member = await storage.getMember(req.session.memberId!);
    
    if (!member || !member.password) {
      return res.status(400).json({ error: "비밀번호 변경이 불가능합니다" });
    }

    const valid = await bcrypt.compare(currentPassword, member.password);
    if (!valid) {
      return res.status(400).json({ error: "현재 비밀번호가 올바르지 않습니다" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await storage.updateMember(req.session.memberId!, { password: hashedPassword });
    res.json({ success: true });
  } catch (error) {
    res.status(400).json({ error: "비밀번호 변경에 실패했습니다" });
  }
});

router.get("/api/admin/members", requireAdmin, async (req: Request, res: Response) => {
  const members = await storage.getAllMembers();
  res.json(members.map(m => ({ ...m, password: undefined })));
});

router.put("/api/admin/members/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const member = await storage.updateMember(parseInt(req.params.id), req.body);
    res.json({ ...member, password: undefined });
  } catch (error) {
    res.status(400).json({ error: "회원 정보 수정에 실패했습니다" });
  }
});

export default router;
