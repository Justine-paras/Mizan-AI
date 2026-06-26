import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { extractPdf } from "@/lib/extraction/extractPdf";
import { analyzeDocumentsWithGemini } from "@/lib/gemini/client";
import { runComplianceRules } from "@/lib/compliance/rules";

// GET /api/analyze?id=...
// Retrieve analysis record by ID (runs on server to bypass client RLS issues)
// If no ID is provided, lists all analyses with document name and created_at timestamps.
export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      const { data, error } = await supabase
        .from("analyses")
        .select(`
          id,
          score,
          risk,
          summary,
          document_id,
          documents (
            name,
            created_at
          )
        `);

      if (error) {
        console.error("Error listing analyses:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      const list = (data || []).map((item: any) => ({
        id: item.id,
        score: item.score,
        risk: item.risk,
        summary: item.summary,
        documentName: item.documents?.name || "Unnamed Document",
        createdAt: item.documents?.created_at || new Date().toISOString()
      }));

      // Sort by date descending
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      return NextResponse.json(list);
    }

    const { data, error } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", id);

    if (error) {
      console.error("Error querying analyses in GET:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: "Analysis report not found in database" }, { status: 404 });
    }

    return NextResponse.json(data[0]);
  } catch (error: any) {
    console.error("GET Analyze API error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}

// POST /api/analyze
// Phase 3: Extract PDF text → send to Gemini → run compliance rules → save analysis to DB.
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const customGeminiKey = request.headers.get("x-gemini-api-key");
    
    const body = await request.json();
    const { documentIds } = body;

    if (!documentIds || !Array.isArray(documentIds) || documentIds.length === 0) {
      return NextResponse.json({ error: "No documentIds provided" }, { status: 400 });
    }

    // 1. Fetch document metadata from database
    const { data: docs, error: fetchDocsError } = await supabase
      .from("documents")
      .select("*")
      .in("id", documentIds);

    if (fetchDocsError) {
      console.error("Error fetching documents from DB:", fetchDocsError);
      return NextResponse.json({ error: `Failed to retrieve documents: ${fetchDocsError.message}` }, { status: 500 });
    }

    if (!docs || docs.length === 0) {
      return NextResponse.json({ error: "No matching documents found in database" }, { status: 404 });
    }

    // 2. Download files from storage and prepare base64 buffers
    const extractedDocs = [];
    for (const doc of docs) {
      try {
        console.log(`Downloading and processing document: ${doc.name} (URL: ${doc.url})`);
        const extracted = await extractPdf(doc.url, supabase);
        extractedDocs.push(extracted);
      } catch (err: any) {
        console.error(`Failed to process document ${doc.name}:`, err);
        return NextResponse.json({ error: `Failed to download file ${doc.name}: ${err.message}` }, { status: 500 });
      }
    }

    // 3. Send documents to Gemini 1.5/2.5 Flash
    console.log("Analyzing processed documents with Gemini...");
    let geminiResult;
    try {
      geminiResult = await analyzeDocumentsWithGemini(extractedDocs, customGeminiKey);
    } catch (err: any) {
      console.error("Gemini analysis error:", err);
      return NextResponse.json({ error: `AI analysis failed: ${err.message}` }, { status: 502 });
    }

    // 4. Run rules engine to normalize results
    console.log("Normalizing analysis results with rule engine...");
    const finalizedReport = await runComplianceRules({ geminiOutput: geminiResult });

    // 5. Save the finalized report into the analyses database table
    const analysisId = crypto.randomUUID();
    const primaryDocId = docs[0]?.id || null;

    const { error: insertError } = await supabase
      .from("analyses")
      .insert({
        id: analysisId,
        document_id: primaryDocId,
        score: finalizedReport.score,
        risk: finalizedReport.risk,
        issues: finalizedReport.issues,
        summary: finalizedReport.summary,
      });

    if (insertError) {
      console.error("Database insert error in analyses table:", insertError);
      return NextResponse.json({ error: `Failed to save analysis report: ${insertError.message}` }, { status: 500 });
    }

    console.log(`Analysis complete! Saved record ID: ${analysisId}`);

    return NextResponse.json({
      analysisId,
      success: true
    });
  } catch (error: any) {
    console.error("Analyze route handler error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
