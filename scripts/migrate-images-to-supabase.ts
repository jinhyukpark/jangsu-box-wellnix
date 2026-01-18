import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
const BUCKET_NAME = "_public";

async function uploadFile(filePath: string, targetPath: string) {
  const fileBuffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  
  const contentTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp'
  };
  
  const contentType = contentTypes[ext] || 'application/octet-stream';
  
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(targetPath, fileBuffer, {
      contentType,
      upsert: true
    });
    
  if (error) {
    console.error(`Failed to upload ${filePath}: ${error.message}`);
    return null;
  }
  
  console.log(`Uploaded: ${filePath} -> ${targetPath}`);
  return data.path;
}

async function migrateImages() {
  const sourceDir = "attached_assets/generated_images";
  const targetDir = "images";
  
  if (!fs.existsSync(sourceDir)) {
    console.log("Source directory not found");
    return;
  }
  
  const files = fs.readdirSync(sourceDir).filter(f => 
    ['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(path.extname(f).toLowerCase())
  );
  
  console.log(`Found ${files.length} images to migrate`);
  
  for (const file of files) {
    const sourcePath = path.join(sourceDir, file);
    const targetPath = `${targetDir}/${file}`;
    await uploadFile(sourcePath, targetPath);
  }
  
  console.log("Migration complete!");
}

migrateImages().catch(console.error);
