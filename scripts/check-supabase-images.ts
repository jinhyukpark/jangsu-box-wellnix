import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function checkImages() {
  // List files in the bucket
  const { data, error } = await supabase.storage
    .from("_public")
    .list("images", { limit: 10 });
    
  if (error) {
    console.error("Error listing files:", error.message);
    return;
  }
  
  console.log("Files in _public/images:", data?.map(f => f.name).join(", "));
  
  // Get public URL for first file
  if (data && data.length > 0) {
    const { data: urlData } = supabase.storage
      .from("_public")
      .getPublicUrl(`images/${data[0].name}`);
    console.log("\nPublic URL example:", urlData.publicUrl);
    
    // Test the URL
    const response = await fetch(urlData.publicUrl, { method: "HEAD" });
    console.log("URL status:", response.status);
  }
}

checkImages().catch(console.error);
