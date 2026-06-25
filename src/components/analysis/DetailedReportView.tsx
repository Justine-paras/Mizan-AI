"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface DetailedReportViewProps {
  reportText: string;
}

export default function DetailedReportView({ reportText }: DetailedReportViewProps) {
  if (!reportText) return null;

  // Simple, robust line-by-line custom markdown-like parser to render clean structured HTML.
  // This avoids pull-in libraries while giving full control over high-fidelity styling.
  const lines = reportText.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let tableHeader: string[] = [];
  let tableRows: string[][] = [];
  let isInTable = false;

  let listItems: string[] = [];
  let isInList = false;

  // Helper to flush current table buffer
  const flushTable = (key: number) => {
    if (tableRows.length > 0 || tableHeader.length > 0) {
      renderedElements.push(
        <div key={`table-${key}`} className="overflow-x-auto my-5 border border-border rounded-lg bg-bg-surface/50">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-border/80 bg-bg-elevated/40">
                {tableHeader.map((h, i) => (
                  <th key={i} className="px-4 py-3 font-semibold text-text-primary">
                    {parseInlineStyles(h)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={cn(
                    "border-b border-border/40 hover:bg-white/[0.02] transition-colors",
                    rowIndex === tableRows.length - 1 && "border-b-0"
                  )}
                >
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className="px-4 py-2.5 text-text-secondary">
                      {parseInlineStyles(cell)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeader = [];
      tableRows = [];
    }
    isInTable = false;
  };

  // Helper to flush list buffer
  const flushList = (key: number) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={`list-${key}`} className="space-y-2 my-4 pl-1">
          {listItems.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-text-secondary leading-relaxed">
              <span className="w-1.5 h-1.5 rounded-full bg-accent mt-2 flex-shrink-0" />
              <span>{parseInlineStyles(item)}</span>
            </li>
          ))}
        </ul>
      );
      listItems = [];
    }
    isInList = false;
  };

  // Inline formatter for bold, badges, risks
  function parseInlineStyles(text: string): React.ReactNode {
    const raw = text.trim();
    if (!raw) return "";

    // Replace emoji indicators with colored spans
    let parts: React.ReactNode[] = [];
    
    // Parse bold tags **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;
    let lastIndex = 0;
    let id = 0;

    // A helper to push and wrap text with badge color checks
    const pushTextSegment = (str: string) => {
      if (!str) return;

      // Handle risk emoji flags
      if (str.includes("🔴 High Risk") || str.includes("High Risk 🔴")) {
        parts.push(
          <span key={`badge-${id++}`} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-2xs font-semibold bg-critical/15 border border-critical/20 text-critical my-0.5">
            🔴 High Risk
          </span>
        );
        return;
      }
      if (str.includes("🟠 Medium Risk") || str.includes("Medium Risk 🟠")) {
        parts.push(
          <span key={`badge-${id++}`} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-2xs font-semibold bg-warning/15 border border-warning/20 text-warning my-0.5">
            🟠 Medium Risk
          </span>
        );
        return;
      }
      if (str.includes("🟡 Low Risk") || str.includes("Low Risk 🟡")) {
        parts.push(
          <span key={`badge-${id++}`} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-2xs font-semibold bg-success/15 border border-success/20 text-success my-0.5">
            🟡 Low Risk
          </span>
        );
        return;
      }

      // Check for specific cross-check fail alerts
      if (str.includes("❌ Mismatch")) {
        const textOnly = str.replace("❌ Mismatch", "");
        parts.push(
          <span key={`mismatch-${id++}`} className="inline-flex items-center gap-1 text-critical font-medium">
            ❌ Mismatch {textOnly}
          </span>
        );
        return;
      }

      if (str.includes("✅")) {
        parts.push(
          <span key={`pass-${id++}`} className="inline-flex items-center gap-1 text-success font-medium">
            {str}
          </span>
        );
        return;
      }

      parts.push(str);
    };

    while ((match = boldRegex.exec(raw)) !== null) {
      if (match.index > lastIndex) {
        pushTextSegment(raw.substring(lastIndex, match.index));
      }
      parts.push(
        <strong key={`bold-${id++}`} className="font-semibold text-text-primary">
          {match[1]}
        </strong>
      );
      lastIndex = boldRegex.lastIndex;
    }

    if (lastIndex < raw.length) {
      pushTextSegment(raw.substring(lastIndex));
    }

    return <>{parts.length > 0 ? parts : raw}</>;
  }

  for (let idx = 0; idx < lines.length; idx++) {
    const rawLine = lines[idx];
    const trimmed = rawLine.trim();

    // 1. Process Tables
    if (trimmed.startsWith("|")) {
      if (isInList) flushList(idx);
      isInTable = true;

      // Split cell contents
      const cells = trimmed
        .split("|")
        .slice(1, -1)
        .map((c) => c.trim());

      // Skip separator rows (e.g. |---|---|)
      const isSeparator = cells.every((c) => c.match(/^:-*-?:*$/) || c.match(/^-+$/));
      if (isSeparator) {
        continue;
      }

      if (tableHeader.length === 0) {
        tableHeader = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else {
      if (isInTable) {
        flushTable(idx);
      }
    }

    // 2. Process Lists
    if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
      isInList = true;
      const content = trimmed.substring(1).trim();
      listItems.push(content);
      continue;
    } else {
      if (isInList) {
        flushList(idx);
      }
    }

    // 3. Process Headings
    if (trimmed.startsWith("#")) {
      const level = (trimmed.match(/^#+/) || ["#"])[0].length;
      const titleText = trimmed.replace(/^#+\s*/, "");
      
      // Determine heading style based on level
      if (level === 1) {
        renderedElements.push(
          <h2 key={idx} className="text-lg font-bold text-text-primary tracking-tight mt-8 mb-4 border-b border-border pb-2">
            {parseInlineStyles(titleText)}
          </h2>
        );
      } else if (level === 2) {
        renderedElements.push(
          <h3 key={idx} className="text-md font-semibold text-text-primary tracking-tight mt-6 mb-3">
            {parseInlineStyles(titleText)}
          </h3>
        );
      } else {
        renderedElements.push(
          <h4 key={idx} className="text-sm font-medium text-text-primary mt-4 mb-2">
            {parseInlineStyles(titleText)}
          </h4>
        );
      }
      continue;
    }

    // Process structured numbered sections (e.g. 1. Document Summary)
    if (trimmed.match(/^\d+\.\s/)) {
      renderedElements.push(
        <h2 key={idx} className="text-sm font-bold text-text-primary tracking-tight mt-7 mb-3 border-b border-border/30 pb-2.5 flex items-center gap-2 uppercase">
          <span className="w-1 h-3.5 bg-accent rounded-sm flex-shrink-0" />
          {parseInlineStyles(trimmed)}
        </h2>
      );
      continue;
    }

    // 4. Regular Paragraphs
    if (trimmed) {
      renderedElements.push(
        <p key={idx} className="text-sm text-text-secondary leading-relaxed mb-4">
          {parseInlineStyles(trimmed)}
        </p>
      );
    }
  }

  // Final flush for remaining elements
  if (isInTable) flushTable(lines.length);
  if (isInList) flushList(lines.length);

  return (
    <div className="card bg-bg-surface/30 border border-border/85 px-6 py-6 rounded-lg space-y-4">
      <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-2">
        <div>
          <h3 className="text-xs font-bold text-text-primary tracking-wider uppercase">
            Official Tax Compliance Audit Trail
          </h3>
          <p className="text-2xs text-text-tertiary mt-0.5">
            Strict regulatory audit mapped under UAE Federal Decree-Law No. 8 of 2017
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/15 px-2 py-0.5 rounded">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="text-[10px] font-semibold text-accent tracking-wider uppercase">
            FTA Compliant Engine
          </span>
        </div>
      </div>
      
      <div className="space-y-2 mt-4 prose prose-invert max-w-none">
        {renderedElements}
      </div>
    </div>
  );
}
