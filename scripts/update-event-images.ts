import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { db } from "../server/db";
import { events } from "../shared/schema";
import { eq } from "drizzle-orm";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const BUCKET_NAME = "_public";

const supabase = createClient(supabaseUrl, supabaseKey);

async function uploadImage(filePath: string): Promise<string | null> {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    const fileName = `events/${Date.now()}_${path.basename(filePath)}`;
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(`images/${fileName}`, fileBuffer, {
        contentType: "image/jpeg",
        upsert: true,
      });

    if (error) {
      console.error("Upload error:", error);
      return null;
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET_NAME}/images/${fileName}`;
    return publicUrl;
  } catch (err) {
    console.error("Error uploading:", err);
    return null;
  }
}

async function updateEventImages() {
  console.log("Starting image update...");

  const seminarImages = [
    "attached_assets/stock_images/health_seminar_confe_9664d3a8.jpg",
    "attached_assets/stock_images/health_seminar_confe_59919046.jpg",
    "attached_assets/stock_images/health_seminar_confe_84feb58f.jpg",
    "attached_assets/stock_images/health_seminar_confe_3b59e102.jpg",
  ];

  const ginsengImages = [
    "attached_assets/stock_images/korean_red_ginseng_t_b3e216e8.jpg",
    "attached_assets/stock_images/korean_red_ginseng_t_23ee6bf5.jpg",
    "attached_assets/stock_images/korean_red_ginseng_t_e18f7828.jpg",
    "attached_assets/stock_images/korean_red_ginseng_t_7b19be2b.jpg",
  ];

  const yogaImages = [
    "attached_assets/stock_images/senior_yoga_class_st_c6c466c9.jpg",
    "attached_assets/stock_images/senior_yoga_class_st_00a53d28.jpg",
    "attached_assets/stock_images/senior_yoga_class_st_3d353997.jpg",
    "attached_assets/stock_images/senior_yoga_class_st_61e24657.jpg",
  ];

  console.log("Uploading seminar images...");
  const seminarUrls: string[] = [];
  for (const img of seminarImages) {
    const url = await uploadImage(img);
    console.log(`Uploaded: ${url}`);
    if (url) seminarUrls.push(url);
  }

  console.log("Uploading ginseng images...");
  const ginsengUrls: string[] = [];
  for (const img of ginsengImages) {
    const url = await uploadImage(img);
    console.log(`Uploaded: ${url}`);
    if (url) ginsengUrls.push(url);
  }

  console.log("Uploading yoga images...");
  const yogaUrls: string[] = [];
  for (const img of yogaImages) {
    const url = await uploadImage(img);
    console.log(`Uploaded: ${url}`);
    if (url) yogaUrls.push(url);
  }

  console.log("\nUpdating event 1 with images...");
  console.log("Main image:", seminarUrls[0]);
  console.log("Additional images:", seminarUrls.slice(1));
  
  const result1 = await db.update(events).set({
    image: seminarUrls[0],
    images: seminarUrls.slice(1),
  }).where(eq(events.id, 1)).returning({ id: events.id, image: events.image });
  console.log("Event 1 result:", result1);

  console.log("\nUpdating event 2 with images...");
  const result2 = await db.update(events).set({
    image: ginsengUrls[0],
    images: ginsengUrls.slice(1),
  }).where(eq(events.id, 2)).returning({ id: events.id, image: events.image });
  console.log("Event 2 result:", result2);

  console.log("\nUpdating event 3 with images...");
  const result3 = await db.update(events).set({
    image: yogaUrls[0],
    images: yogaUrls.slice(1),
  }).where(eq(events.id, 3)).returning({ id: events.id, image: events.image });
  console.log("Event 3 result:", result3);

  console.log("\nEvent image update completed!");
}

updateEventImages()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Error:", err);
    process.exit(1);
  });
