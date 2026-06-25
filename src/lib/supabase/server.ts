import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseUrl = rawUrl.replace(/\/rest\/v1\/?$/, "");

export const supabaseServer = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export function getSupabaseServer(request?: NextRequest | Headers): SupabaseClient {
  let url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  let key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (request) {
    const headers = request instanceof Headers ? request : request.headers;
    const customUrl = headers.get("x-supabase-url");
    const customKey = headers.get("x-supabase-service-role-key");
    if (customUrl) url = customUrl;
    if (customKey) key = customKey;
  }

  const cleanUrl = url.replace(/\/rest\/v1\/?$/, "");
  if (!cleanUrl || !key) {
    return supabaseServer;
  }

  return createClient(cleanUrl, key);
}


