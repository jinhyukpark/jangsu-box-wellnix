import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  
  const publicBucket = buckets?.find(b => b.name === "_public");
  console.log("_public bucket info:", JSON.stringify(publicBucket, null, 2));
  
  // Try to get a signed URL as alternative
  const { data: files } = await supabase.storage.from("_public").list("images", { limit: 3 });
  console.log("\nFiles in images/:", files?.map(f => f.name));
  
  if (files && files.length > 0) {
    const testFile = `images/${files[0].name}`;
    
    // Get public URL
    const { data: publicUrl } = supabase.storage.from("_public").getPublicUrl(testFile);
    console.log("\nPublic URL:", publicUrl.publicUrl);
    
    // Test it
    const res = await fetch(publicUrl.publicUrl, { method: "HEAD" });
    console.log("Public URL status:", res.status);
  }
}

checkBucket().catch(console.error);
