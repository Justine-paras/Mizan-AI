import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/supabase/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServer(request);
    const customGeminiKey = request.headers.get("x-gemini-api-key");
    const geminiClient = customGeminiKey ? new GoogleGenerativeAI(customGeminiKey) : gemini;

    const { analysisId, messages } = await request.json();

    if (!analysisId) {
      return NextResponse.json({ error: "analysisId is required" }, { status: 400 });
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array is required" }, { status: 400 });
    }

    // 1. Fetch compliance analysis context from DB
    const { data: analysis, error: analysisErr } = await supabase
      .from("analyses")
      .select("*")
      .eq("id", analysisId)
      .single();

    if (analysisErr || !analysis) {
      console.error("Error fetching analysis for chat context:", analysisErr);
      return NextResponse.json({ error: "Analysis record not found." }, { status: 404 });
    }

    // 2. Parse out short/detailed summaries
    let shortSummary = "";
    let detailedReport = "";
    try {
      const parsed = JSON.parse(analysis.summary);
      shortSummary = parsed.short || "";
      detailedReport = parsed.detailed || "";
    } catch (e) {
      shortSummary = analysis.summary;
      detailedReport = analysis.summary;
    }

    const issuesListText = (analysis.issues || [])
      .map((iss: any, idx: number) => {
        return `${idx + 1}. [${iss.severity.toUpperCase()}] ${iss.title}: ${iss.description}\n   Recommendation: ${iss.recommendation || "N/A"}`;
      })
      .join("\n");

    // 3. Define the Copilot system prompt injected with audit context
    const systemInstruction = `
You are MIZAN's Tax Compliance Copilot, an AI assistant built for UAE SMEs.
You have access to the following compliance report details for the user's business documents:

ANALYSIS ID: ${analysis.id}
OVERALL COMPLIANCE SCORE: ${analysis.score}/100
RISK LEVEL: ${analysis.risk.toUpperCase()}

CONCISE COMPLIANCE SUMMARY:
${shortSummary}

DETAILED AUDIT REPORT:
${detailedReport}

SPECIFIC COMPLIANCE GAPS & ISSUES DETECTED:
${issuesListText || "No issues detected."}

CORE INSTRUCTIONS:
1. Provide helpful, expert compliance guidance specifically tailored to the audit details.
2. Back all explanations with the UAE VAT Law (Decree-Law No. 8 of 2017) and official FTA guidelines.
3. Be concise, executive-focused, and friendly but strictly professional.
4. If asked about items not covered in the audit report, answer generally but state: "This detail is not present in your uploaded documents. According to general FTA regulations..."
5. Do NOT hallucinate data or values. If they are not in the audit report or user query, do not assume them.
`;

    // 4. Map client message history to Gemini model roles ('user' and 'model')
    // We filter out any initial greeting/assistant messages so the history starts with a user message (Gemini rule).
    const rawHistory = messages.slice(0, -1); // all messages except the last one (which is the new prompt)
    const newPrompt = messages[messages.length - 1]?.content || "";

    const history: { role: "user" | "model"; parts: { text: string }[] }[] = [];
    let foundFirstUser = false;
    
    for (const msg of rawHistory) {
      if (msg.role === "user") {
        foundFirstUser = true;
      }
      if (foundFirstUser && (msg.role === "user" || msg.role === "assistant")) {
        history.push({
          role: msg.role === "assistant" ? "model" : "user",
          parts: [{ text: msg.content }]
        });
      }
    }

    // 5. Select model (with fallback chain)
    const modelsToTry = ["gemini-2.5-flash", "gemini-3.5-flash", "gemini-2.0-flash", "gemini-3.1-flash-lite", "gemini-2.0-flash-lite", "gemini-flash-latest"];
    let lastError: any = null;

    for (const modelName of modelsToTry) {
      try {
        const model = geminiClient.getGenerativeModel({
          model: modelName,
          systemInstruction,
        });

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(newPrompt);
        const responseText = result.response.text();

        return NextResponse.json({
          message: responseText
        });
      } catch (err: any) {
        console.warn(`Model ${modelName} failed in chat copilot:`, err.message || err);
        lastError = err;

        const errorMsg = String(err.message || "");
        const isTransient = errorMsg.includes("503") || 
                            errorMsg.includes("429") ||
                            errorMsg.includes("Quota") ||
                            errorMsg.includes("limit") ||
                            errorMsg.includes("high demand") || 
                            errorMsg.includes("Service Unavailable") ||
                            errorMsg.includes("overloaded");

        if (isTransient) {
          continue;
        }
        throw err;
      }
    }

    throw lastError || new Error("All generative models failed to respond.");
  } catch (error: any) {
    console.error("POST /api/chat error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}
