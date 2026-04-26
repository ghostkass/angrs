import { supabase, STORAGE_BUCKET } from "@/lib/supabase";

export async function saveUpload(file: File, folder: "photos" | "documents") {
  const bytes = Buffer.from(await file.arrayBuffer());
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const filename = `${Date.now()}-${safeName}`;
  const storagePath = `${folder}/${filename}`;

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(storagePath, bytes, {
      contentType: file.type || "application/octet-stream",
      upsert: false,
    });

  if (error) {
    throw new Error(`Echec de l'upload Supabase : ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(STORAGE_BUCKET)
    .getPublicUrl(storagePath);

  return {
    relativePath: urlData.publicUrl,
    size: bytes.length,
  };
}
