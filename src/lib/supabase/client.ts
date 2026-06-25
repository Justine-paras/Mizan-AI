import { createClient, SupabaseClient } from "@supabase/supabase-js";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "");

export const supabaseBrowser = createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function getSupabaseBrowser(): SupabaseClient {
  if (typeof window !== "undefined") {
    const customUrl = localStorage.getItem("mizan_settings_supabase_url");
    const customKey = localStorage.getItem("mizan_settings_supabase_anon_key");
    if (customUrl && customKey) {
      const cleanUrl = customUrl.replace(/\/rest\/v1\/?$/, "");
      return createClient(cleanUrl, customKey);
    }
  }
  return supabaseBrowser;
}


