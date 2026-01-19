import { Router } from "express";
import { storage } from "../storage";
import { requireAdmin } from "../middleware";
import { insertPromotionSchema } from "@shared/schema";

const router = Router();

router.get("/api/promotions", async (req, res) => {
  try {
    const promotions = await storage.getAllPromotions();
    res.json(promotions);
  } catch (error) {
    console.error("Failed to get promotions:", error);
    res.status(500).json({ error: "Failed to get promotions" });
  }
});

router.get("/api/promotions/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      const promotion = await storage.getPromotionBySlug(req.params.id);
      if (!promotion) {
        return res.status(404).json({ error: "Promotion not found" });
      }
      const promoWithProducts = await storage.getPromotionWithProducts(promotion.id);
      return res.json(promoWithProducts);
    }
    
    const promoWithProducts = await storage.getPromotionWithProducts(id);
    if (!promoWithProducts) {
      return res.status(404).json({ error: "Promotion not found" });
    }
    res.json(promoWithProducts);
  } catch (error) {
    console.error("Failed to get promotion:", error);
    res.status(500).json({ error: "Failed to get promotion" });
  }
});

router.post("/api/admin/promotions", requireAdmin, async (req, res) => {
  try {
    const data = insertPromotionSchema.parse(req.body);
    const promotion = await storage.createPromotion(data);
    res.status(201).json(promotion);
  } catch (error) {
    console.error("Failed to create promotion:", error);
    res.status(500).json({ error: "Failed to create promotion" });
  }
});

router.put("/api/admin/promotions/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const promotion = await storage.updatePromotion(id, req.body);
    if (!promotion) {
      return res.status(404).json({ error: "Promotion not found" });
    }
    res.json(promotion);
  } catch (error) {
    console.error("Failed to update promotion:", error);
    res.status(500).json({ error: "Failed to update promotion" });
  }
});

router.delete("/api/admin/promotions/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await storage.deletePromotion(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Failed to delete promotion:", error);
    res.status(500).json({ error: "Failed to delete promotion" });
  }
});

router.put("/api/admin/promotions/:id/products", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { productIds } = req.body;
    
    if (!Array.isArray(productIds)) {
      return res.status(400).json({ error: "productIds must be an array" });
    }
    
    await storage.setPromotionProducts(id, productIds);
    const promoWithProducts = await storage.getPromotionWithProducts(id);
    res.json(promoWithProducts);
  } catch (error) {
    console.error("Failed to update promotion products:", error);
    res.status(500).json({ error: "Failed to update promotion products" });
  }
});

export default router;
