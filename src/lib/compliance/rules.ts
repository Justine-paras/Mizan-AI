import type { Analysis, Issue } from "@/types";

interface RuleInput {
  geminiOutput: {
    score: number;
    risk: string;
    summary: string;
    detailed_report: string;
    issues: Issue[];
  };
}

/**
 * Standardize and validate Gemini VAT compliance analysis output against business rules.
 * @param input - Structured Gemini response
 * @returns Standardized compliance score, risk level, and issues list
 */
export async function runComplianceRules(
  input: RuleInput
): Promise<Pick<Analysis, "score" | "risk" | "issues" | "summary">> {
  const { geminiOutput } = input;

  // Enforce score boundary: [0, 100]
  let score = Math.max(0, Math.min(100, Number(geminiOutput.score) || 100));

  // Determine risk level deterministically based on score
  let risk: "low" | "medium" | "high" = "low";
  if (score < 60) {
    risk = "high";
  } else if (score < 85) {
    risk = "medium";
  }

  // Format and validate the issues list
  const issues: Issue[] = (geminiOutput.issues || []).map((issue: any) => {
    let severity: "low" | "medium" | "high" = "medium";
    const rawSev = String(issue.severity).toLowerCase();
    if (rawSev === "high") {
      severity = "high";
    } else if (rawSev === "low") {
      severity = "low";
    }

    return {
      title: issue.title || "Compliance Observation",
      severity,
      description: issue.description || "Unspecified compliance flag.",
      recommendation: issue.recommendation || "Ensure details conform to FTA regulations.",
    };
  });

  // Package both short summary and detailed report inside the summary column
  const summaryObj = {
    short: geminiOutput.summary || "No compliance observations recorded.",
    detailed: geminiOutput.detailed_report || "Insufficient data to produce a compliant VAT conclusion under FTA standards."
  };

  return {
    score,
    risk,
    summary: JSON.stringify(summaryObj),
    issues,
  };
}
