import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ExtractedDocument } from "../extraction/extractPdf";

export const gemini = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `
You are a VAT Compliance & Tax Analysis AI specialized in interpreting financial documents (invoices, expense files, bank statements, and VAT returns) under UAE Federal Tax Authority (FTA) regulations.

🎯 Primary Objective
Perform strict, data-grounded tax analysis using ONLY:
1. The uploaded documents provided by the user
2. Official UAE FTA VAT regulations and definitions
3. Explicit calculations derived from the data

You must prioritize accuracy over completeness or speed.

📌 Hard Rules (NON-NEGOTIABLE)
1. No Hallucination Rule
   NEVER assume missing data.
   If a value is not found in documents, explicitly state: "Not found in provided documents"
   Do NOT estimate unless explicitly instructed.

2. Document-First Reasoning
   Before giving any conclusion, scan ALL uploaded documents fully and extract and list relevant fields:
   - Invoice numbers, VAT amounts, Taxable supplies, Expense categories, Payment dates, Vendor details
   You MUST show an "Extracted Evidence Table" in the detailed report before conclusions.

3. Step-by-Step Audit Logic
   All conclusions must follow:
   - Data Extraction -> Classification -> FTA Rule Mapping -> Computation -> Final Assessment

4. UAE FTA Compliance Requirement
   All interpretations must align with UAE VAT Law (Federal Decree-Law No. 8 of 2017), Input/Output VAT rules, Valid tax invoice requirements, Deductibility rules, and the standard rate (5%) unless zero-rated/exempt.
   If uncertain, say: "Requires manual verification under FTA guidelines"

5. Strict Calculation Integrity
   Show formulas for VAT calculations. Recalculate totals independently.
   Cross-check bank vs invoice vs VAT return data.
   Flag mismatches explicitly (e.g. "Invoice VAT = AED 100, Expected VAT @5% = AED 95 -> Mismatch").

6. Discrepancy & Risk Detection
   Flag: Missing invoices, Duplicate invoices, Incorrect VAT rates, Unmatched bank payments, Unsupported input VAT claims, Timing mismatches.
   Label risks as HIGH / MEDIUM / LOW.

7. Output Format (MANDATORY)
   Your detailed_report must follow this 7-part markdown structure:
   1. Document Summary
   2. Extracted Evidence Table
   3. VAT Classification Breakdown
   4. Calculations
   5. Compliance Check (FTA Rules Mapping)
   6. Issues & Risk Flags
   7. Final Verdict

8. Truthfulness Constraint
   If insufficient data, return this exact string for detailed_report: "Insufficient data to produce a compliant VAT conclusion under FTA standards."

9. JSON Safety Rules (CRITICAL)
   - The entire response MUST be valid, complete, well-formed JSON.
   - ALL strings must be properly terminated with a closing double-quote.
   - Escape ALL double-quotes inside string values as \\".
   - Escape ALL newlines inside string values as \\n.
   - Do NOT include raw control characters inside JSON strings.
   - If running low on output space, end the detailed_report string with "..." and close all JSON brackets properly. NEVER leave a string unterminated.

10. Output Length Constraint (CRITICAL - READ THIS)
    Keep detailed_report UNDER 500 words. Use compact markdown tables for data. No verbose prose.
    The summary field must be 2-3 sentences maximum.
    Each issue description must be 1-2 sentences maximum.
    SHORT OUTPUT IS MANDATORY to prevent JSON truncation errors.
`;

const schema = {
  type: "object",
  properties: {
    score: {
      type: "integer",
      description: "Compliance rating out of 100. Start at 100 and deduct 15 points per high-severity issue, 8 per medium, 3 per low."
    },
    risk: {
      type: "string",
      description: "Risk categorization based on score: 'low' (85+), 'medium' (60-84), or 'high' (<60)"
    },
    summary: {
      type: "string",
      description: "Concise 2-3 sentence executive summary of the compliance health."
    },
    detailed_report: {
      type: "string",
      description: "The full compliance report following the mandatory 7-part format. Keep under 500 words. If insufficient data: 'Insufficient data to produce a compliant VAT conclusion under FTA standards.'"
    },
    issues: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string", description: "Short title of the compliance gap" },
          severity: { type: "string", description: "'low', 'medium', or 'high'" },
          description: { type: "string", description: "1-2 sentence detail of the issue, referencing document specifics." },
          recommendation: { type: "string", description: "Actionable fix to resolve the compliance risk." }
        },
        required: ["title", "severity", "description", "recommendation"]
      }
    }
  },
  required: ["score", "risk", "summary", "detailed_report", "issues"]
};

/**
 * Robust JSON repair for truncated Gemini responses.
 * Tries clean parse first, then falls back to field-by-field regex extraction.
 */
function repairAndParseGeminiJson(raw: string): any {
  // 1. Try the clean parse first
  try {
    return JSON.parse(raw);
  } catch (_) {
    // Intentional — we'll attempt repair below
  }

  console.warn("Gemini response JSON was malformed — attempting field-level repair...");

  const extractString = (key: string): string => {
    const match = raw.match(new RegExp(`"${key}"\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)`, "s"));
    return match ? match[1].replace(/\\n/g, "\n").replace(/\\"/g, '"') : "";
  };

  const extractNumber = (key: string): number => {
    const match = raw.match(new RegExp(`"${key}"\\s*:\\s*(\\d+)`));
    return match ? parseInt(match[1], 10) : 70;
  };

  const extractIssues = (): any[] => {
    const startIdx = raw.indexOf('"issues"');
    if (startIdx === -1) return [];
    const arrStart = raw.indexOf("[", startIdx);
    if (arrStart === -1) return [];

    // Walk the array with bracket counting
    let depth = 0;
    let end = arrStart;
    for (let i = arrStart; i < raw.length; i++) {
      if (raw[i] === "[" || raw[i] === "{") depth++;
      else if (raw[i] === "]" || raw[i] === "}") {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }

    try {
      return JSON.parse(raw.slice(arrStart, end + 1));
    } catch (_) {
      // Array itself was truncated — pull whatever complete issue objects we can find
      const issues: any[] = [];
      const objRegex = /\{[^{}]*"title"\s*:\s*"[^"]+"\s*,[^{}]*"severity"\s*:\s*"(?:low|medium|high)"[^{}]*\}/g;
      let m;
      while ((m = objRegex.exec(raw)) !== null) {
        try { issues.push(JSON.parse(m[0])); } catch (_) { /* skip malformed */ }
      }
      return issues;
    }
  };

  const score = extractNumber("score");
  const riskRaw = extractString("risk").trim().toLowerCase();
  const risk = ["low", "medium", "high"].includes(riskRaw)
    ? riskRaw
    : (score < 60 ? "high" : score < 85 ? "medium" : "low");
  const summary = extractString("summary") || "Analysis completed with partial results due to response length constraints.";
  const detailed_report = extractString("detailed_report") || "The detailed report was partially generated. Re-run the analysis to obtain a complete breakdown.";
  const issues = extractIssues();

  console.warn(`Repaired JSON — score: ${score}, risk: ${risk}, issues recovered: ${issues.length}`);
  return { score, risk, summary, detailed_report, issues };
}

export async function analyzeDocumentsWithGemini(files: ExtractedDocument[], customApiKey?: string | null): Promise<any> {
  if (!files || files.length === 0) {
    throw new Error("No files provided for Gemini analysis");
  }

  const client = customApiKey ? new GoogleGenerativeAI(customApiKey) : gemini;

  // Valid model names for Gemini API v1beta — ordered by capability (best first)
  // gemini-2.x models require billing; gemini-1.5-flash/pro work on free tier
  const modelsToTry = [
    "gemini-2.5-flash",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash",
    "gemini-1.5-pro",
  ];
  let lastError: any = null;

  for (const modelName of modelsToTry) {
    try {
      console.log(`Attempting compliance analysis with model: ${modelName}`);
      const model = client.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
      });

      const parts = files.map(file => ({
        inlineData: {
          data: file.base64,
          mimeType: file.mimeType,
        }
      }));

      parts.push({
        text: `Perform a UAE VAT compliance audit on the attached documents: ${files.map(f => f.fileName).join(", ")}. Identify VAT calculation errors, missing TRNs, incorrect formats, or non-recoverable input tax claims (e.g. hospitality, entertainment, personal expenses). IMPORTANT: Keep your detailed_report under 500 words to prevent JSON truncation.`,
      } as any);

      const result = await model.generateContent({
        contents: [{ role: "user", parts }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema as any,
          temperature: 0.1,
          maxOutputTokens: 4096,
        }
      });

      const responseText = result.response.text();
      return repairAndParseGeminiJson(responseText);

    } catch (err: any) {
      console.warn(`Model ${modelName} failed:`, err.message || err);
      lastError = err;

      const errorMsg = String(err.message || "");

      // Retry on transient capacity/quota errors AND on model-not-found (404)
      // so that a deprecated model name doesn't abort the entire failover chain
      const shouldRetry =
        errorMsg.includes("503") ||
        errorMsg.includes("429") ||
        errorMsg.includes("404") ||
        errorMsg.includes("Quota") ||
        errorMsg.includes("limit") ||
        errorMsg.includes("high demand") ||
        errorMsg.includes("Service Unavailable") ||
        errorMsg.includes("overloaded") ||
        errorMsg.includes("not found") ||
        errorMsg.includes("Not Found") ||
        errorMsg.includes("is not supported") ||
        errorMsg.includes("not supported for generateContent");

      if (shouldRetry) {
        console.log(`Model ${modelName} unavailable — trying next in chain...`);
        continue;
      }

      // Hard errors (e.g. 400 invalid request, bad API key, auth) — stop immediately
      throw err;
    }
  }

  throw lastError || new Error("All Generative AI model attempts failed.");
}
