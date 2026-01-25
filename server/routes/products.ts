import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertProductSchema, insertCategorySchema } from "@shared/schema";
import { requireAdmin } from "../middleware";

const router = Router();

router.get("/api/categories", async (req: Request, res: Response) => {
  const categories = await storage.getAllCategories();
  res.json(categories);
});

router.get("/api/categories/:id", async (req: Request, res: Response) => {
  const category = await storage.getCategory(parseInt(req.params.id));
  if (!category) {
    return res.status(404).json({ error: "카테고리를 찾을 수 없습니다" });
  }
  res.json(category);
});

router.post("/api/admin/categories", requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = insertCategorySchema.parse(req.body);
    const category = await storage.createCategory(data);
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: "카테고리 생성에 실패했습니다" });
  }
});

router.put("/api/admin/categories/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const category = await storage.updateCategory(parseInt(req.params.id), req.body);
    res.json(category);
  } catch (error) {
    res.status(400).json({ error: "카테고리 수정에 실패했습니다" });
  }
});

router.delete("/api/admin/categories/:id", requireAdmin, async (req: Request, res: Response) => {
  await storage.deleteCategory(parseInt(req.params.id));
  res.json({ success: true });
});

router.get("/api/products", async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
  const products = await storage.getAllProducts(categoryId);
  res.json(products);
});

router.get("/api/products/featured", async (req: Request, res: Response) => {
  const products = await storage.getFeaturedProducts();
  res.json(products);
});

router.get("/api/products/search", async (req: Request, res: Response) => {
  const query = req.query.q as string || "";
  const products = await storage.searchProducts(query);
  res.json(products);
});

router.get("/api/products/:id", async (req: Request, res: Response) => {
  const product = await storage.getProduct(parseInt(req.params.id));
  if (!product) {
    return res.status(404).json({ error: "상품을 찾을 수 없습니다" });
  }
  res.json(product);
});

router.get("/api/admin/products", requireAdmin, async (req: Request, res: Response) => {
  const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
  const products = await storage.getAllProductsAdmin(categoryId);
  res.json(products);
});

router.post("/api/admin/products", requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = insertProductSchema.parse(req.body);
    const product = await storage.createProduct(data);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "상품 생성에 실패했습니다" });
  }
});

router.put("/api/admin/products/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const product = await storage.updateProduct(parseInt(req.params.id), req.body);
    res.json(product);
  } catch (error) {
    res.status(400).json({ error: "상품 수정에 실패했습니다" });
  }
});

router.delete("/api/admin/products/:id", requireAdmin, async (req: Request, res: Response) => {
  await storage.deleteProduct(parseInt(req.params.id));
  res.json({ success: true });
});

router.post("/api/admin/products/bulk-delete", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "삭제할 상품을 선택해주세요" });
    }
    await storage.deleteProductsBulk(ids);
    res.json({ success: true, deletedCount: ids.length });
  } catch (error) {
    console.error("Bulk delete error:", error);
    res.status(500).json({ error: "상품 삭제에 실패했습니다" });
  }
});

router.post("/api/admin/products/bulk-status", requireAdmin, async (req: Request, res: Response) => {
  try {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "변경할 상품을 선택해주세요" });
    }
    if (!status || !["active", "inactive", "soldout"].includes(status)) {
      return res.status(400).json({ error: "유효한 상태를 선택해주세요" });
    }
    await storage.updateProductsStatusBulk(ids, status);
    res.json({ success: true, updatedCount: ids.length });
  } catch (error) {
    console.error("Bulk status update error:", error);
    res.status(500).json({ error: "상품 상태 변경에 실패했습니다" });
  }
});

export default router;
