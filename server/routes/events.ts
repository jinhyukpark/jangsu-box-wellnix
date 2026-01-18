import { Router, Request, Response } from "express";
import { storage } from "../storage";
import { insertEventSchema, insertEventParticipantSchema } from "@shared/schema";
import { requireAdmin } from "../middleware";

const router = Router();

router.get("/api/events", async (req: Request, res: Response) => {
  const events = await storage.getAllEvents();
  res.json(events);
});

router.get("/api/events/:id", async (req: Request, res: Response) => {
  const event = await storage.getEvent(parseInt(req.params.id));
  if (!event) {
    return res.status(404).json({ error: "행사를 찾을 수 없습니다" });
  }
  res.json(event);
});

router.post("/api/events/:id/participate", async (req: Request, res: Response) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await storage.getEvent(eventId);
    
    if (!event) {
      return res.status(404).json({ error: "행사를 찾을 수 없습니다" });
    }

    if (event.maxParticipants && (event.currentParticipants || 0) >= event.maxParticipants) {
      return res.status(400).json({ error: "참가 인원이 마감되었습니다" });
    }

    const data = insertEventParticipantSchema.parse({
      ...req.body,
      eventId,
      memberId: req.session.memberId || null,
    });
    
    const participant = await storage.createEventParticipant(data);
    res.json(participant);
  } catch (error) {
    res.status(400).json({ error: "행사 참가 신청에 실패했습니다" });
  }
});

router.get("/api/admin/events/:id/participants", requireAdmin, async (req: Request, res: Response) => {
  const participants = await storage.getEventParticipants(parseInt(req.params.id));
  res.json(participants);
});

router.post("/api/admin/events", requireAdmin, async (req: Request, res: Response) => {
  try {
    const data = insertEventSchema.parse(req.body);
    const event = await storage.createEvent(data);
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: "행사 생성에 실패했습니다" });
  }
});

router.put("/api/admin/events/:id", requireAdmin, async (req: Request, res: Response) => {
  try {
    const event = await storage.updateEvent(parseInt(req.params.id), req.body);
    res.json(event);
  } catch (error) {
    res.status(400).json({ error: "행사 수정에 실패했습니다" });
  }
});

router.delete("/api/admin/events/:id", requireAdmin, async (req: Request, res: Response) => {
  await storage.deleteEvent(parseInt(req.params.id));
  res.json({ success: true });
});

export default router;
