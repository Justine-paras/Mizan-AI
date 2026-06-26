"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Issue } from "@/types";

interface FindingsListProps {
  findings: Issue[];
}

const severityConfig = {
  high:   { color: "text-critical", bg: "bg-critical/10", border: "border-critical/20", label: "High" },
  medium: { color: "text-warning",  bg: "bg-warning/10",  border: "border-warning/20",  label: "Medium" },
  low:    { color: "text-success",  bg: "bg-success/10",  border: "border-success/20",  label: "Low" },
};

function FindingRow({ finding, index }: { finding: Issue; index: number }) {
  const [open, setOpen] = useState(false);
  const cfg = severityConfig[finding.severity];

  return (
    <div
      className={cn(
        "border border-border rounded-lg overflow-hidden",
        "transition-all duration-200",
        open ? "bg-bg-elevated" : "bg-bg-surface hover:bg-bg-elevated"
      )}
      style={{ animationDelay: `${index * 40}ms` }}
    >
      {/* Row header */}
      <button
        className="w-full flex items-center gap-4 px-5 py-4 text-left cursor-pointer"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {/* Severity pill */}
        <span
          className={cn(
            "flex-shrink-0 text-2xs font-medium px-2 py-0.5 rounded-[4px] border",
            cfg.bg, cfg.border, cfg.color
          )}
        >
          {cfg.label}
        </span>

        {/* Title */}
        <span className="flex-1 text-sm font-medium text-text-primary truncate">
          {finding.title}
        </span>

        {/* Chevron */}
        <svg
          viewBox="0 0 16 16"
          fill="none"
          className={cn(
            "w-4 h-4 text-text-tertiary flex-shrink-0 transition-transform duration-200",
            open && "rotate-180"
          )}
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M4 6l4 4 4-4" />
        </svg>
      </button>

      {/* Expanded body */}
      {open && (
        <div className="px-5 pb-5 pt-0 border-t border-border animate-slide-up">
          <p className="text-sm text-text-secondary leading-relaxed mt-3 mb-3">
            {finding.description}
          </p>
          {finding.recommendation && (
            <div className="flex gap-2.5 bg-bg-surface border border-border rounded-md px-4 py-3">
              <div className="w-1 rounded-full bg-accent flex-shrink-0 self-stretch" />
              <p className="text-xs text-text-secondary leading-relaxed">
                <span className="text-text-primary font-medium">Recommendation: </span>
                {finding.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FindingsList({ findings = [] }: FindingsListProps) {
  const safeFindings = Array.isArray(findings) ? findings : [];

  const sorted = [...safeFindings].sort((a, b) => {
    const order = { high: 0, medium: 1, low: 2 };
    const aOrder = order[a?.severity || "medium"] ?? 1;
    const bOrder = order[b?.severity || "medium"] ?? 1;
    return aOrder - bOrder;
  });

  return (
    <div className="flex flex-col gap-2 animate-slide-up">
      <div className="flex items-center justify-between mb-2">
        <p className="t-subheading">Findings</p>
        <p className="t-caption">{safeFindings.length} total</p>
      </div>
      {safeFindings.length > 0 ? (
        sorted.map((f, i) => (
          <FindingRow key={i} finding={f} index={i} />
        ))
      ) : (
        <div className="border border-border bg-bg-surface/50 rounded-xl p-8 text-center flex flex-col items-center justify-center gap-3">
          <span className="text-2xl">🎉</span>
          <div>
            <h4 className="text-xs font-semibold text-text-primary">No Compliance Findings</h4>
            <p className="text-[10px] text-text-secondary mt-1 leading-relaxed max-w-xs">
              No compliance issues or tax calculation risks were identified in this audit. All files matched FTA criteria perfectly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
