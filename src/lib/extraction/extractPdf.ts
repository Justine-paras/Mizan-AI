import { getDefaultSupabaseServer } from "@/lib/supabase/server";
import { SupabaseClient } from "@supabase/supabase-js";

export interface ExtractedDocument {
  base64: string;
  mimeType: string;
  fileName: string;
}

/**
 * Download a file from Supabase Storage URL and convert it into a base64 buffer structure for Gemini.
 * @param url - Supabase Storage URL of the document
 * @param supabaseClient - Supabase client to use for downloading the document
 * @returns Extracted document structure with base64 data
 */
export async function extractPdf(url: string, supabaseClient: SupabaseClient = getDefaultSupabaseServer()): Promise<ExtractedDocument> {
  // Extract storage path from the public URL
  // E.g. https://.../storage/v1/object/public/documents/invoice/uuid-filename.pdf
  const parts = url.split("/documents/");
  if (parts.length < 2) {
    throw new Error(`Invalid Supabase storage URL structure: ${url}`);
  }
  const storagePath = decodeURIComponent(parts[1]);
  let fileName = storagePath.split("/").pop() || "document";
  // Clean UUID prefix (e.g. "uuid-filename.pdf" -> "filename.pdf")
  fileName = fileName.replace(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}-/i, "");

  // Download file from Supabase Storage
  const { data, error } = await supabaseClient.storage
    .from("documents")
    .download(storagePath);

  if (error || !data) {
    throw new Error(`Failed to download file from Storage: ${error?.message || "No data returned"}`);
  }

  // Convert arrayBuffer to base64
  const arrayBuffer = await data.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  // Determine mimeType
  const ext = fileName.split(".").pop()?.toLowerCase();
  const mimeType = ext === "csv" ? "text/csv" : "application/pdf";

  return {
    base64,
    mimeType,
    fileName,
  };
}
