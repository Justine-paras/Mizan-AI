"use client";

import AppShell from "@/components/layout/AppShell";
import ReportPreview from "@/components/report/ReportPreview";

interface ReportPageProps {
  params: { id: string };
}

export default function ReportPage({ params }: ReportPageProps) {
  return (
    <AppShell>
      <div className="px-8 py-8 max-w-4xl mx-auto animate-fade-in">
        <div className="mb-8">
          <p className="t-label mb-2">Reference · REF-{params.id.slice(0, 8).toUpperCase()}</p>
          <h1 className="t-display">Audit Report</h1>
          <p className="t-body mt-1 max-w-lg">
            Your compliance analysis exported as a structured audit document ready
            for internal review or advisor submission.
          </p>
        </div>
        <ReportPreview analysisId={params.id} />
      </div>
    </AppShell>
  );
}
