"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import ScoreCard from "@/components/analysis/ScoreCard";
import FindingsList from "@/components/analysis/FindingsList";
import DetailedReportView from "@/components/analysis/DetailedReportView";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import { getSettingsHeaders, getLocalStorageSettings, AppSettings } from "@/lib/settings";
import type { Analysis, Issue } from "@/types";

interface DashboardPageProps {
  params: { id: string };
}

export default function DashboardPage({ params }: DashboardPageProps) {
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serverStatus, setServerStatus] = useState<{
    geminiConfigured: boolean;
    supabaseConfigured: boolean;
    isLocalDev: boolean;
  } | null>(null);
  const [clientSettings, setClientSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setClientSettings(getLocalStorageSettings());
    }

    async function checkStatus() {
      try {
        const res = await fetch("/api/settings/status");
        if (res.ok) {
          const data = await res.json();
          setServerStatus(data);
        }
      } catch (err) {
        console.warn("Failed to fetch settings status:", err);
      }
    }
    checkStatus();

    async function fetchAnalysis() {
      try {
        const res = await fetch(`/api/analyze?id=${params.id}`, {
          headers: getSettingsHeaders(),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || "Analysis record not found.");
        }
        const data = await res.json();

        setAnalysis(data as Analysis);
      } catch (err: any) {
        console.error("Dashboard loading error:", err);
        setError(err.message || "Failed to load compliance details");
      } finally {
        setLoading(false);
      }
    }

    fetchAnalysis();
  }, [params.id]);

  const isGeminiConfigured = !!(serverStatus?.geminiConfigured || clientSettings?.geminiApiKey);
  const isSupabaseConfigured = !!(
    serverStatus?.supabaseConfigured || 
    (clientSettings?.supabaseUrl && clientSettings?.supabaseAnonKey && clientSettings?.supabaseServiceRoleKey)
  );
  const isConfigured = isGeminiConfigured && isSupabaseConfigured;

  if (loading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Spinner size="lg" />
          <p className="text-sm text-text-secondary">Retrieving audit results...</p>
        </div>
      </AppShell>
    );
  }

  if (error || !analysis) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-4">
          <div className="w-12 h-12 rounded-full bg-error/10 border border-error/25 flex items-center justify-center text-error text-lg font-bold mb-2">
            ✕
          </div>
          <p className="text-sm font-semibold text-text-primary">Load Failed</p>
          <p className="text-xs text-text-secondary max-w-xs leading-relaxed">
            {error || "We couldn't locate this analysis report in our databases."}
          </p>
        </div>
      </AppShell>
    );
  }

  // Parse summary JSON
  let shortSummary = "";
  let detailedReport = "";
  try {
    const parsed = JSON.parse(analysis.summary);
    shortSummary = parsed.short || "";
    detailedReport = parsed.detailed || "";
  } catch (e) {
    shortSummary = analysis.summary;
    detailedReport = "";
  }

  return (
    <AppShell>
      <div className="px-8 py-8 max-w-5xl mx-auto animate-fade-in">
        {/* Page header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="t-label mb-2">Reference · REF-{params.id.slice(0, 8).toUpperCase()}</p>
            <h1 className="t-display">Compliance Review</h1>
            <p className="t-body mt-1 max-w-lg">{shortSummary}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-1">
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/"}>
              ← Landing Page
            </Button>
            <Button variant="ghost" size="sm" onClick={() => window.location.href = "/upload"}>
              Re-analyze
            </Button>
            <Button variant="primary" size="sm" onClick={() => window.location.href = `/report/${analysis.id}`}>
              Export report →
            </Button>
          </div>
        </div>

        {/* Setup Warning Banner */}
        {serverStatus !== null && !isConfigured && (
          <div className="mb-6 p-4 rounded-xl border bg-critical/10 border-critical/20 text-critical text-xs flex gap-3 animate-slide-up">
            <span className="text-sm mt-0.5">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-text-primary mb-1">Configuration Overrides Inactive</p>
              <p className="text-text-secondary leading-relaxed mb-2.5">
                Some connection keys are not configured. To export reports, analyze new files, or run interactive chat features correctly, configure your Gemini API Key and Supabase environment variables.
                {!isGeminiConfigured && !isSupabaseConfigured && " Both Gemini and Supabase settings are currently missing."}
                {!isGeminiConfigured && isSupabaseConfigured && " Gemini API Key is missing."}
                {isGeminiConfigured && !isSupabaseConfigured && " Supabase database configuration is missing."}
              </p>
              <Link
                href="/settings"
                className="inline-flex items-center gap-1 text-accent hover:underline font-semibold transition-colors"
              >
                Configure Settings →
              </Link>
            </div>
          </div>
        )}

        {/* Grid and detailed report list */}
        <div className="space-y-6">
          {/* Score + findings grid */}
          <div className="grid grid-cols-[280px_1fr] gap-5 animate-slide-up" style={{ animationDelay: "40ms" }}>
            <ScoreCard
              score={analysis.score}
              risk={analysis.risk}
              issueCount={analysis.issues.length}
            />
            <FindingsList findings={analysis.issues as Issue[]} />
          </div>

          {/* Detailed Compliance Audit Section */}
          {detailedReport && (
            <div className="animate-slide-up" style={{ animationDelay: "80ms" }}>
              <DetailedReportView reportText={detailedReport} />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
