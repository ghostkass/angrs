import { createClient } from "@supabase/supabase-js";

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    "Les variables d'environnement SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requises.",
  );
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

export const STORAGE_BUCKET = "angrs-uploads";
