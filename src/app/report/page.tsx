"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Button from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface HistoryItem {
  id: string;
  ref: string;
  date: string;
  fileName: string;
}

export default function ReportIndexPage() {
  const router = useRouter();
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("mizan_analysis_history");
        if (raw) {
          setHistoryList(JSON.parse(raw));
        }
      } catch (e) {
        console.warn("Failed to load history list for reports:", e);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  return (
    <AppShell>
      <div className="px-8 py-10 max-w-5xl mx-auto animate-fade-in">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="t-display">Report Archive</h1>
          <p className="t-body mt-1 max-w-lg">
            Access and manage all generated tax compliance audit documents and official FTA compliance files.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2.5">
            <div className="w-6 h-6 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
            <p className="text-xs text-text-tertiary">Loading archives...</p>
          </div>
        ) : historyList.length === 0 ? (
          /* Empty state */
          <div className="card bg-bg-surface/30 border border-border border-dashed p-10 text-center flex flex-col items-center justify-center gap-4 my-10 max-w-xl mx-auto rounded-lg">
            <div className="w-10 h-10 rounded-lg bg-border flex items-center justify-center text-text-tertiary">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary tracking-tight">No Reports Compiled</h3>
              <p className="text-xs text-text-tertiary mt-1.5 max-w-xs leading-relaxed">
                You haven't run any tax compliance analyses yet. Upload business files first to prepare your reports.
              </p>
            </div>
            <Button variant="primary" size="sm" onClick={() => router.push("/upload")}>
              Run compliance check
            </Button>
          </div>
        ) : (
          /* Reports Table */
          <div className="border border-border/80 rounded-lg overflow-hidden bg-bg-surface/30 animate-slide-up">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-border/80 bg-bg-elevated/40">
                  <th className="px-5 py-3.5 font-semibold text-text-primary uppercase tracking-wider">Reference Code</th>
                  <th className="px-5 py-3.5 font-semibold text-text-primary uppercase tracking-wider">Primary Invoice / Document</th>
                  <th className="px-5 py-3.5 font-semibold text-text-primary uppercase tracking-wider">Audit Date</th>
                  <th className="px-5 py-3.5 text-right font-semibold text-text-primary uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {historyList.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={cn(
                      "border-b border-border/40 hover:bg-white/[0.02] transition-colors cursor-pointer",
                      idx === historyList.length - 1 && "border-b-0"
                    )}
                    onClick={() => router.push(`/report/${item.id}`)}
                  >
                    <td className="px-5 py-4 font-bold text-accent">
                      {item.ref}
                    </td>
                    <td className="px-5 py-4 text-text-secondary truncate max-w-[280px] font-medium">
                      {item.fileName}
                    </td>
                    <td className="px-5 py-4 text-text-tertiary">
                      {item.date}
                    </td>
                    <td className="px-5 py-4 text-right font-semibold text-text-primary">
                      <span className="text-accent hover:underline">View PDF Report →</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppShell>
  );
}
