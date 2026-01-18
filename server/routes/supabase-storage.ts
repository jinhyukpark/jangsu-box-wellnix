import type { Express, Request, Response } from "express";
import { supabaseStorageService } from "../supabaseStorage";

export function registerSupabaseStorageRoutes(app: Express): void {
  app.post("/api/uploads/request-url", async (req: Request, res: Response) => {
    try {
      const { name, contentType } = req.body;

      if (!name) {
        return res.status(400).json({
          error: "Missing required field: name",
        });
      }

      const { uploadUrl, objectPath } = await supabaseStorageService.getUploadUrl(
        name,
        contentType || "application/octet-stream"
      );

      res.json({
        uploadURL: uploadUrl,
        objectPath,
        metadata: { name, contentType },
      });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  app.get("/storage/:bucket/:path(*)", async (req: Request, res: Response) => {
    try {
      const { bucket, path } = req.params;
      const objectPath = `/storage/${bucket}/${path}`;
      
      const publicUrl = supabaseStorageService.getPublicUrl(objectPath);
      res.redirect(publicUrl);
    } catch (error) {
      console.error("Error serving object:", error);
      res.status(500).json({ error: "Failed to serve object" });
    }
  });
}
