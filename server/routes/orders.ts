import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertOrderSchema } from "@shared/schema";
import { requireAuth, requireAdmin } from "../middleware";

const router = Router();

function generateOrderNumber(): string {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `WN${year}${month}${day}${random}`;
}

function generatePaymentNumber(): string {
  const now = new Date();
  const timestamp = now.getTime().toString().slice(-8);
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `PAY${timestamp}${random}`;
}

router.get("/api/cart", requireAuth, async (req: Request, res: Response) => {
  const items = await storage.getCartItems(req.session.memberId!);
  res.json(items);
});

router.post("/api/cart", requireAuth, async (req: Request, res: Response) => {
  try {
    const { productId, quantity, options } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "상품 ID가 필요합니다" });
    }
    const item = await storage.addToCart({
      memberId: req.session.memberId!,
      productId: Number(productId),
      quantity: quantity || 1,
      options: options || null,
    });
    res.json(item);
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(400).json({ error: "장바구니 추가에 실패했습니다" });
  }
});

router.put("/api/cart/:id", requireAuth, async (req: Request, res: Response) => {
  try {
    const item = await storage.updateCartItem(parseInt(req.params.id), req.body.quantity);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: "장바구니 수정에 실패했습니다" });
  }
});

router.delete("/api/cart/:id", requireAuth, async (req: Request, res: Response) => {
  await storage.removeFromCart(parseInt(req.params.id));
  res.json({ success: true });
});

router.delete("/api/cart", requireAuth, async (req: Request, res: Response) => {
  await storage.clearCart(req.session.memberId!);
  res.json({ success: true });
});

router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  const orders = await storage.getOrdersByMember(req.session.memberId!);
  res.json(orders);
});

router.get("/api/orders/:id", requireAuth, async (req: Request, res: Response) => {
  const order = await storage.getOrder(parseInt(req.params.id));
  if (!order || order.memberId !== req.session.memberId) {
    return res.status(404).json({ error: "주문을 찾을 수 없습니다" });
  }
  const items = await storage.getOrderItems(order.id);
  res.json({ ...order, items });
});

router.post("/api/orders", requireAuth, async (req: Request, res: Response) => {
  try {
    const orderNumber = generateOrderNumber();
    const data = insertOrderSchema.parse({
      ...req.body,
      memberId: req.session.memberId,
      orderNumber,
    });
    
    const order = await storage.createOrder(data);
    
    if (req.body.items && Array.isArray(req.body.items)) {
      for (const item of req.body.items) {
        await storage.createOrderItem({
          orderId: order.id,
          ...item,
        });
      }
    }

    await storage.clearCart(req.session.memberId!);
    res.json(order);
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(400).json({ error: "주문 생성에 실패했습니다" });
  }
});

router.get("/api/admin/orders", requireAdmin, async (req: Request, res: Response) => {
  const orders = await storage.getAllOrders();
  res.json(orders);
});

router.put("/api/admin/orders/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const order = await storage.updateOrder(parseInt(req.params.id), req.body);
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: "주문 수정에 실패했습니다" });
  }
});

router.get("/api/payments", requireAuth, async (req: Request, res: Response) => {
  const payments = await storage.getPaymentsByMember(req.session.memberId!);
  res.json(payments);
});

router.post("/api/payments", requireAuth, async (req: Request, res: Response) => {
  try {
    const paymentNumber = generatePaymentNumber();
    const payment = await storage.createPayment({
      ...req.body,
      memberId: req.session.memberId,
      paymentNumber,
    });
    res.json(payment);
  } catch (error) {
    res.status(400).json({ error: "결제 처리에 실패했습니다" });
  }
});

router.get("/api/admin/payments", requireAdmin, async (req: Request, res: Response) => {
  const payments = await storage.getAllPayments();
  res.json(payments);
});

router.get("/api/shipping/:orderId", requireAuth, async (req: Request, res: Response) => {
  const shipping = await storage.getShipping(parseInt(req.params.orderId));
  res.json(shipping);
});

router.get("/api/admin/shipping", requireAdmin, async (req: Request, res: Response) => {
  const shipping = await storage.getAllShipping();
  res.json(shipping);
});

router.put("/api/admin/shipping/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const shipping = await storage.updateShipping(parseInt(req.params.id), req.body);
    res.json(shipping);
  } catch (error) {
    res.status(400).json({ error: "배송 정보 수정에 실패했습니다" });
  }
});

export default router;
