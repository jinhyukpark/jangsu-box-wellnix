import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

async function listContents() {
  // List all buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.error("Error listing buckets:", bucketsError.message);
    return;
  }
  
  console.log("Available buckets:", buckets?.map(b => `${b.name} (public: ${b.public})`).join(", "));
  
  // Check _public bucket
  const { data: publicFiles, error: publicError } = await supabase.storage
    .from("_public")
    .list("images", { limit: 5 });
    
  console.log("\n_public/images files:", publicFiles?.length || 0, "files");
  if (publicFiles?.length) {
    console.log("Sample:", publicFiles.slice(0, 3).map(f => f.name).join(", "));
  }
  
  // Check _public root
  const { data: publicRoot } = await supabase.storage
    .from("_public")
    .list("", { limit: 10 });
    
  console.log("\n_public root folders:", publicRoot?.map(f => f.name).join(", "));
}

listContents().catch(console.error);
