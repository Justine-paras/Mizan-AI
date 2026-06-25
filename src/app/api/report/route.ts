import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { generatePdf } from "@/lib/report/generatePdf";

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const { searchParams } = new URL(request.url);
    const analysisId = searchParams.get("analysisId");

    if (!analysisId) {
      return NextResponse.json({ error: "analysisId is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("reports")
      .select("*")
      .eq("analysis_id", analysisId);

    if (error) {
      console.error("Error querying reports table in GET:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ found: false });
    }

    return NextResponse.json({
      found: true,
      reportUrl: data[0].url,
    });
  } catch (error: any) {
    console.error("GET /api/report error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const body = await request.json();
    const { analysisId } = body;

    if (!analysisId) {
      return NextResponse.json({ error: "analysisId is required" }, { status: 400 });
    }

    // 1. Fetch analysis details from DB
    const { data: analysis, error: analysisErr } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", analysisId)
      .single();

    if (analysisErr || !analysis) {
      console.error("Error fetching analysis for report:", analysisErr);
      return NextResponse.json({ error: "Analysis record not found." }, { status: 404 });
    }

    // 2. Fetch associated document details
    const { data: document, error: docErr } = await supabase
      .from("documents")
      .select("*")
      .eq("id", analysis.document_id)
      .single();

    if (docErr || !document) {
      console.error("Error fetching document details for report:", docErr);
      return NextResponse.json({ error: "Associated document record not found." }, { status: 404 });
    }

    // 3. Compile the PDF audit report
    console.log(`Compiling PDF report for analysis: ${analysisId}`);
    let pdfBuffer: Buffer;
    try {
      pdfBuffer = await generatePdf({ document, analysis });
    } catch (compileErr: any) {
      console.error("PDF Compilation Error:", compileErr);
      return NextResponse.json({ error: `Failed to compile PDF: ${compileErr.message}` }, { status: 500 });
    }

    // 4. Upload PDF report to Supabase Storage bucket 'reports'
    const bucketName = "reports";
    try {
      await supabase.storage.createBucket(bucketName, {
        public: true,
      });
    } catch (bucketErr) {
      // Bucket might already exist, ignore error
    }

    const reportFileId = crypto.randomUUID();
    const storagePath = `${analysisId}/${reportFileId}-compliance-report.pdf`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(storagePath, pdfBuffer, {
        contentType: "application/pdf",
        upsert: true,
      });

    if (uploadError) {
      console.error("Supabase Storage report upload error:", uploadError);
      return NextResponse.json({ error: `Failed to upload PDF to storage: ${uploadError.message}` }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase
      .storage
      .from(bucketName)
      .getPublicUrl(storagePath);

    const reportUrl = urlData.publicUrl;

    // 5. Save the report record into database reports table
    const reportId = crypto.randomUUID();
    const { error: dbError } = await supabase
      .from("reports")
      .insert({
        id: reportId,
        analysis_id: analysisId,
        url: reportUrl,
      });

    if (dbError) {
      console.error("Database insert error in reports table:", dbError);
      return NextResponse.json({ error: `Failed to register report in DB: ${dbError.message}` }, { status: 500 });
    }

    return NextResponse.json({
      reportId,
      reportUrl,
      success: true,
    });
  } catch (error: any) {
    console.error("POST /api/report error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
