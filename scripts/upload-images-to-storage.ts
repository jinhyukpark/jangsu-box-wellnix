import { Storage } from "@google-cloud/storage";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

const REPLIT_SIDECAR_ENDPOINT = "http://127.0.0.1:1106";

const storage = new Storage({
  credentials: {
    audience: "replit",
    subject_token_type: "access_token",
    token_url: `${REPLIT_SIDECAR_ENDPOINT}/token`,
    type: "external_account",
    credential_source: {
      url: `${REPLIT_SIDECAR_ENDPOINT}/credential`,
      format: {
        type: "json",
        subject_token_field_name: "access_token",
      },
    },
    universe_domain: "googleapis.com",
  },
  projectId: "",
});

async function uploadImages() {
  const privateDir = process.env.PRIVATE_OBJECT_DIR;
  if (!privateDir) {
    console.error("PRIVATE_OBJECT_DIR not set");
    process.exit(1);
  }

  const parts = privateDir.split("/").filter(Boolean);
  const bucketName = parts[0];
  const baseDir = parts.slice(1).join("/");
  
  console.log("Bucket:", bucketName);
  console.log("Base dir:", baseDir);

  const bucket = storage.bucket(bucketName);
  const imagesDir = path.join(process.cwd(), "attached_assets/generated_images");
  
  if (!fs.existsSync(imagesDir)) {
    console.error("Images directory not found:", imagesDir);
    process.exit(1);
  }

  const files = fs.readdirSync(imagesDir).filter(f => f.endsWith(".png") || f.endsWith(".jpg") || f.endsWith(".jpeg"));
  
  console.log(`Found ${files.length} images to upload`);

  const uploadResults: { filename: string; objectPath: string }[] = [];

  for (const filename of files) {
    const localPath = path.join(imagesDir, filename);
    const objectId = randomUUID();
    const objectName = `${baseDir}/public/${objectId}`;
    
    console.log(`Uploading ${filename} to ${objectName}...`);
    
    try {
      await bucket.upload(localPath, {
        destination: objectName,
        metadata: {
          contentType: filename.endsWith(".png") ? "image/png" : "image/jpeg",
        },
      });
      
      const objectPath = `/objects/public/${objectId}`;
      uploadResults.push({ filename, objectPath });
      console.log(`  -> ${objectPath}`);
    } catch (err) {
      console.error(`  Failed to upload ${filename}:`, err);
    }
  }

  console.log("\n=== Upload Results ===");
  console.log(JSON.stringify(uploadResults, null, 2));
  
  fs.writeFileSync("scripts/uploaded-images.json", JSON.stringify(uploadResults, null, 2));
  console.log("\nResults saved to scripts/uploaded-images.json");
}

uploadImages().catch(console.error);
