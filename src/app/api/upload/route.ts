import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";

// POST /api/upload
// Phase 2: Receive file → store in Supabase Storage → create document record.
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const slotId = formData.get("slotId") as string | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!slotId) {
      return NextResponse.json({ error: "No slotId provided" }, { status: 400 });
    }

    // Validate size (max 20MB)
    const maxSizeBytes = 20 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      return NextResponse.json({ error: "File size exceeds 20 MB limit" }, { status: 400 });
    }

    // Validate type (PDF or CSV)
    const filename = file.name.toLowerCase();
    const ext = filename.split(".").pop();
    if (ext !== "pdf" && ext !== "csv") {
      return NextResponse.json({ error: "Invalid file type. Only PDF and CSV are allowed." }, { status: 400 });
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const bucketName = "documents";

    // Attempt to create the bucket (fails gracefully if it already exists)
    await supabase.storage.createBucket(bucketName, {
      public: true,
    });

    // Create a unique file path
    const fileId = crypto.randomUUID();
    const storagePath = `${slotId}/${fileId}-${file.name}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, fileBuffer, {
        contentType: file.type || (ext === "pdf" ? "application/pdf" : "text/csv"),
        upsert: true,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return NextResponse.json({ error: `Storage upload failed: ${uploadError.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    const fileUrl = urlData.publicUrl;

    // Create a database record in documents table
    // Columns: id, name, url, created_at
    const docId = crypto.randomUUID();
    const { error: dbError } = await supabase
      .from("documents")
      .insert({
        id: docId,
        name: file.name,
        url: fileUrl,
        created_at: new Date().toISOString(),
      });

    if (dbError) {
      console.error("Database insert error:", dbError);
      return NextResponse.json({ error: `Database insert failed: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      documentId: docId,
      fileName: file.name,
      fileUrl: fileUrl,
      slotId: slotId,
    });
  } catch (error: any) {
    console.error("Server upload error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
