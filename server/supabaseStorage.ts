import { createClient } from "@supabase/supabase-js";
import { randomUUID } from "crypto";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

const BUCKET_NAME = "wellnix-images";

export class SupabaseStorageService {
  async getUploadUrl(fileName: string, contentType: string): Promise<{ uploadUrl: string; objectPath: string }> {
    const objectId = randomUUID();
    const extension = fileName.split('.').pop() || '';
    const objectName = extension ? `${objectId}.${extension}` : objectId;
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUploadUrl(`uploads/${objectName}`, { upsert: false });

    if (error) {
      throw new Error(`Failed to create upload URL: ${error.message}`);
    }

    return {
      uploadUrl: data.signedUrl,
      objectPath: `/storage/${BUCKET_NAME}/uploads/${objectName}`,
    };
  }

  getPublicUrl(objectPath: string): string {
    const path = objectPath.replace(`/storage/${BUCKET_NAME}/`, '');
    const { data } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(path);
    return data.publicUrl;
  }

  async downloadObject(objectPath: string): Promise<{ data: Blob; contentType: string }> {
    const path = objectPath.replace(`/storage/${BUCKET_NAME}/`, '').replace('/storage/', '');
    
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .download(path);

    if (error) {
      throw new Error(`Failed to download object: ${error.message}`);
    }

    return {
      data,
      contentType: data.type || 'application/octet-stream',
    };
  }

  async deleteObject(objectPath: string): Promise<void> {
    const path = objectPath.replace(`/storage/${BUCKET_NAME}/`, '').replace('/storage/', '');
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      throw new Error(`Failed to delete object: ${error.message}`);
    }
  }
}

export const supabaseStorageService = new SupabaseStorageService();
