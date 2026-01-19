import { Router } from "express";
import { storage } from "../storage";
import { insertPopularKeywordSchema } from "@shared/schema";

const router = Router();

router.get("/api/search/popular-keywords", async (_req, res) => {
  try {
    const keywords = await storage.getActivePopularKeywords();
    res.json(keywords);
  } catch (error) {
    console.error("Error fetching popular keywords:", error);
    res.status(500).json({ error: "Failed to fetch popular keywords" });
  }
});

router.get("/api/search/recent", async (req, res) => {
  try {
    if (!req.session.memberId) {
      return res.json([]);
    }
    const searches = await storage.getRecentSearches(req.session.memberId);
    res.json(searches);
  } catch (error) {
    console.error("Error fetching recent searches:", error);
    res.status(500).json({ error: "Failed to fetch recent searches" });
  }
});

router.post("/api/search/recent", async (req, res) => {
  try {
    if (!req.session.memberId) {
      return res.status(401).json({ error: "로그인이 필요합니다" });
    }
    const { keyword } = req.body;
    if (!keyword || typeof keyword !== "string") {
      return res.status(400).json({ error: "검색어가 필요합니다" });
    }
    const search = await storage.addRecentSearch(req.session.memberId, keyword.trim());
    res.json(search);
  } catch (error) {
    console.error("Error adding recent search:", error);
    res.status(500).json({ error: "Failed to add recent search" });
  }
});

router.delete("/api/search/recent/:keyword", async (req, res) => {
  try {
    if (!req.session.memberId) {
      return res.status(401).json({ error: "로그인이 필요합니다" });
    }
    const keyword = decodeURIComponent(req.params.keyword);
    await storage.deleteRecentSearch(req.session.memberId, keyword);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting recent search:", error);
    res.status(500).json({ error: "Failed to delete recent search" });
  }
});

router.delete("/api/search/recent", async (req, res) => {
  try {
    if (!req.session.memberId) {
      return res.status(401).json({ error: "로그인이 필요합니다" });
    }
    await storage.clearRecentSearches(req.session.memberId);
    res.json({ success: true });
  } catch (error) {
    console.error("Error clearing recent searches:", error);
    res.status(500).json({ error: "Failed to clear recent searches" });
  }
});

router.get("/api/admin/popular-keywords", async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "관리자 권한이 필요합니다" });
    }
    const keywords = await storage.getAllPopularKeywords();
    res.json(keywords);
  } catch (error) {
    console.error("Error fetching all popular keywords:", error);
    res.status(500).json({ error: "Failed to fetch popular keywords" });
  }
});

router.post("/api/admin/popular-keywords", async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "관리자 권한이 필요합니다" });
    }
    const parsed = insertPopularKeywordSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: "잘못된 요청 데이터입니다" });
    }
    const keyword = await storage.createPopularKeyword(parsed.data);
    res.json(keyword);
  } catch (error) {
    console.error("Error creating popular keyword:", error);
    res.status(500).json({ error: "Failed to create popular keyword" });
  }
});

router.patch("/api/admin/popular-keywords/:id", async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "관리자 권한이 필요합니다" });
    }
    const id = parseInt(req.params.id);
    const keyword = await storage.updatePopularKeyword(id, req.body);
    if (!keyword) {
      return res.status(404).json({ error: "인기 검색어를 찾을 수 없습니다" });
    }
    res.json(keyword);
  } catch (error) {
    console.error("Error updating popular keyword:", error);
    res.status(500).json({ error: "Failed to update popular keyword" });
  }
});

router.delete("/api/admin/popular-keywords/:id", async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "관리자 권한이 필요합니다" });
    }
    const id = parseInt(req.params.id);
    await storage.deletePopularKeyword(id);
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting popular keyword:", error);
    res.status(500).json({ error: "Failed to delete popular keyword" });
  }
});

router.post("/api/admin/popular-keywords/reorder", async (req, res) => {
  try {
    if (!req.session.adminId) {
      return res.status(401).json({ error: "관리자 권한이 필요합니다" });
    }
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: "잘못된 요청 데이터입니다" });
    }
    await storage.reorderPopularKeywords(orderedIds);
    res.json({ success: true });
  } catch (error) {
    console.error("Error reordering popular keywords:", error);
    res.status(500).json({ error: "Failed to reorder popular keywords" });
  }
});

export default router;
