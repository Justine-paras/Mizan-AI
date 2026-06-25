"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AppShell from "@/components/layout/AppShell";
import Spinner from "@/components/ui/Spinner";
import { cn } from "@/lib/utils";
import { getSettingsHeaders, getLocalStorageSettings, AppSettings } from "@/lib/settings";

// ─── Types ────────────────────────────────────────────────────────────────────

type DocSlotId = "invoice" | "expense" | "bank" | "vat";
type SlotState = "empty" | "active" | "done";

interface DocSlot {
  id: DocSlotId;
  label: string;
  format: string;
  description: string;
  required: boolean;
  accept: string;
}

type UploadedFiles = Partial<Record<DocSlotId, File>>;
type PageState = "idle" | "dragging" | "analyzing" | "done";

// ─── Document slots definition ────────────────────────────────────────────────

const DOC_SLOTS: DocSlot[] = [
  {
    id: "invoice",
    label: "Invoices",
    format: "PDF",
    description:
      "Verify invoice details, VAT amounts, supplier information, and transaction evidence.",
    required: true,
    accept: ".pdf",
  },
  {
    id: "expense",
    label: "Expenses",
    format: "CSV",
    description:
      "Review business expenses, classifications, and input VAT recoverability.",
    required: true,
    accept: ".csv",
  },
  {
    id: "bank",
    label: "Bank Statements",
    format: "PDF",
    description:
      "Reconcile recorded transactions against actual payments and surface discrepancies.",
    required: true,
    accept: ".pdf",
  },
  {
    id: "vat",
    label: "VAT Returns",
    format: "PDF",
    description:
      "Compare filed VAT figures against underlying financial records for accuracy.",
    required: false,
    accept: ".pdf",
  },
];

// ─── Analysis steps ───────────────────────────────────────────────────────────

const ANALYSIS_STEPS = [
  "Reading documents…",
  "Extracting financial data…",
  "Running VAT compliance checks…",
  "Cross-referencing transactions…",
  "Generating findings report…",
];

// ─── Icons ────────────────────────────────────────────────────────────────────

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11.5 2H5a1 1 0 00-1 1v14a1 1 0 001 1h10a1 1 0 001-1V7.5L11.5 2z" />
      <path d="M11.5 2v5.5H17" />
      <path d="M7 11h6M7 14h4" />
    </svg>
  );
}

function TableIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="16" height="14" rx="2" />
      <path d="M2 8h16M8 8v9" />
    </svg>
  );
}

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v16l3-2 3 2 3-2 3 2V2H4z" />
      <path d="M8 7h4M8 11h4M8 9h2" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 2L3 5.5v5C3 14.5 6.5 18 10 19c3.5-1 7-4.5 7-8.5v-5L10 2z" />
      <path d="M7 10l2 2 4-4" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 8.5l3 3 7-7" />
    </svg>
  );
}

function UploadCloudIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V8M8 12l4-4 4 4" />
      <path d="M6.5 19A4.5 4.5 0 015 10.5a6 6 0 0114 0A4.5 4.5 0 0117.5 19" />
    </svg>
  );
}

const slotIcons: Record<DocSlotId, typeof FileIcon> = {
  invoice: ReceiptIcon,
  expense: TableIcon,
  bank:    FileIcon,
  vat:     ShieldIcon,
};

// ─── Document Card ────────────────────────────────────────────────────────────

interface DocCardProps {
  slot: DocSlot;
  file: File | undefined;
  onFile: (id: DocSlotId, file: File) => void;
  onRemove: (id: DocSlotId) => void;
  isAnalyzing: boolean;
  isUploading?: boolean;
}

function DocCard({ slot, file, onFile, onRemove, isAnalyzing, isUploading }: DocCardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const Icon = slotIcons[slot.id];

  const handleFile = (f: File) => {
    onFile(slot.id, f);
  };

  const state: SlotState = file ? "done" : hover ? "active" : "empty";

  return (
    <div
      className={cn(
        "relative rounded-xl border transition-all duration-200 overflow-hidden",
        "bg-bg-surface",
        state === "done"
          ? "border-accent/30 shadow-[0_0_0_1px_rgba(124,92,255,0.15)]"
          : state === "active"
          ? "border-accent/40 bg-bg-elevated"
          : "border-border hover:border-border-strong"
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onDragOver={(e) => { e.preventDefault(); setHover(true); }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        const f = e.dataTransfer.files?.[0];
        if (f) handleFile(f);
      }}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className={cn(
              "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200",
              state === "done"
                ? "bg-accent/10 border border-accent/20"
                : "bg-bg-elevated border border-border"
            )}>
              <Icon className={cn(
                "w-4 h-4 transition-colors duration-200",
                state === "done" ? "text-accent" : "text-text-tertiary"
              )} />
            </div>

            {/* Title + format */}
            <div>
              <p className="text-sm font-semibold text-text-primary leading-tight tracking-tight">
                {slot.label}
              </p>
              <p className="text-[11px] font-medium text-text-disabled mt-0.5 tracking-wider uppercase">
                {slot.format}
              </p>
            </div>
          </div>

          {/* Badge */}
          {isUploading ? (
            <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
              <Spinner size="xs" />
              <span className="text-[11px] font-semibold text-accent tracking-wider uppercase animate-pulse">Uploading</span>
            </div>
          ) : state === "done" ? (
            <div className="flex items-center gap-1.5 flex-shrink-0 mt-0.5">
              <div className="w-4 h-4 rounded-full bg-success/10 border border-success/25 flex items-center justify-center">
                <CheckIcon className="w-2.5 h-2.5 text-success" />
              </div>
              <span className="text-[11px] font-semibold text-success tracking-wider uppercase">Uploaded</span>
            </div>
          ) : (
            <span className={cn(
              "text-[10px] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded-[3px] flex-shrink-0 mt-0.5",
              slot.required
                ? "text-text-secondary bg-white/[0.06] border border-white/10"
                : "text-text-disabled bg-transparent border border-white/[0.04]"
            )}>
              {slot.required ? "Required" : "Optional"}
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-[13px] text-text-tertiary leading-[1.65] mb-5">
          {slot.description}
        </p>

        {/* File info or CTA */}
        {isUploading ? (
          <div className="w-full flex items-center justify-center gap-2 py-2 border border-border bg-bg-elevated rounded-lg text-xs font-medium text-text-disabled">
            <Spinner size="xs" />
            Uploading file...
          </div>
        ) : file ? (
          <div className="flex items-center justify-between gap-2 bg-bg-elevated rounded-lg px-3 py-2 border border-border">
            <p className="text-xs text-text-secondary truncate flex-1">{file.name}</p>
            {!isAnalyzing && (
              <button
                onClick={() => onRemove(slot.id)}
                className="text-text-disabled hover:text-text-tertiary transition-colors flex-shrink-0 text-xs"
                aria-label="Remove file"
              >
                ✕
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isAnalyzing}
            className={cn(
              "w-full flex items-center justify-center gap-1.5",
              "text-xs font-medium rounded-lg py-2 border",
              "transition-all duration-150",
              "disabled:opacity-40 disabled:cursor-not-allowed",
              hover
                ? "bg-accent/10 border-accent/30 text-accent"
                : "bg-transparent border-border text-text-tertiary hover:border-accent/30 hover:text-accent hover:bg-accent/5"
            )}
          >
            <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M6 2v8M2 6h8" />
            </svg>
            Add {slot.format}
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={slot.accept}
        className="sr-only"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
    </div>
  );
}

// ─── Main dropzone ────────────────────────────────────────────────────────────

interface MainDropZoneProps {
  isDragging: boolean;
  onDragEnter: () => void;
  onDragLeave: () => void;
  onDrop: (file: File) => void;
  onBrowse: () => void;
  fileCount: number;
}

function MainDropZone({ isDragging, onDragEnter, onDragLeave, onDrop, onBrowse, fileCount }: MainDropZoneProps) {
  return (
    <div
      className={cn(
        "w-full rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer",
        "flex items-center justify-center gap-8 py-9 px-10",
        isDragging
          ? "border-accent bg-accent/5 scale-[1.005]"
          : "border-border hover:border-accent/30 hover:bg-white/[0.012]"
      )}
      onClick={onBrowse}
      onDragOver={(e) => { e.preventDefault(); onDragEnter(); }}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={(e) => {
        e.preventDefault();
        onDragLeave();
        const f = e.dataTransfer.files?.[0];
        if (f) onDrop(f);
      }}
    >
      {/* Upload icon */}
      <div className={cn(
        "w-11 h-11 rounded-xl border flex items-center justify-center flex-shrink-0 transition-all duration-300",
        isDragging
          ? "bg-accent/10 border-accent/30 scale-110"
          : "bg-bg-elevated border-border"
      )}>
        <UploadCloudIcon className={cn(
          "w-5 h-5 transition-colors duration-300",
          isDragging ? "text-accent" : "text-text-tertiary"
        )} />
      </div>

      {/* Text block */}
      <div>
        <p className="text-sm font-semibold text-text-primary tracking-tight mb-0.5">
          {isDragging ? "Release to add" : "Drop financial documents"}
        </p>
        <p className="text-[13px] text-text-tertiary">
          or{" "}
          <span className="text-accent underline underline-offset-2 decoration-accent/30">
            browse files
          </span>
        </p>
      </div>

      {/* Divider */}
      <div className="h-8 w-px bg-border flex-shrink-0" />

      {/* Formats + status */}
      <div className="flex-shrink-0">
        {fileCount > 0 ? (
          <div className="flex items-center gap-1.5 text-xs text-success">
            <CheckIcon className="w-3 h-3" />
            <span className="font-medium">{fileCount} of {4} added</span>
          </div>
        ) : (
          <p className="text-[11px] font-medium text-text-disabled tracking-wider uppercase">
            PDF · CSV
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Analyzing state ──────────────────────────────────────────────────────────

function AnalyzingView({ step, progress }: { step: number; progress: number }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-10 animate-fade-in">
      {/* Arc spinner */}
      <div className="relative">
        <svg width="80" height="80" className="rotate-[-90deg]">
          <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
          <circle
            cx="40" cy="40" r="34" fill="none"
            stroke="#7C5CFF" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 34}
            strokeDashoffset={2 * Math.PI * 34 * (1 - progress / 100)}
            style={{ transition: "stroke-dashoffset 0.7s cubic-bezier(0.4,0,0.2,1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold tabular-nums text-text-primary">{progress}%</span>
        </div>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-semibold text-text-primary tracking-tight mb-2">
          Analyzing documents…
        </h2>
        <p className="text-sm text-text-secondary animate-fade-in" key={step}>
          {ANALYSIS_STEPS[step]}
        </p>
      </div>

      <div className="flex flex-col gap-2 w-64">
        {ANALYSIS_STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2.5">
            <div className={cn(
              "w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300",
              i < step
                ? "bg-success/10 border-success/30"
                : i === step
                ? "bg-accent/10 border-accent/30"
                : "bg-transparent border-border"
            )}>
              {i < step && <CheckIcon className="w-2.5 h-2.5 text-success" />}
              {i === step && <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />}
            </div>
            <p className={cn(
              "text-xs transition-colors duration-300",
              i < step ? "text-success" : i === step ? "text-text-primary" : "text-text-disabled"
            )}>
              {s}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UploadPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<PageState>("idle");
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFiles>({});
  const [documentIds, setDocumentIds] = useState<Partial<Record<DocSlotId, string>>>({});
  const [uploadingSlots, setUploadingSlots] = useState<Partial<Record<DocSlotId, boolean>>>({});
  const [analyzeStep, setAnalyzeStep] = useState(0);
  const [analyzeProgress, setAnalyzeProgress] = useState(0);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [showAssign, setShowAssign] = useState(false);
  const globalInputRef = useRef<HTMLInputElement>(null);

  interface HistoryItem {
    id: string;
    ref: string;
    date: string;
    fileName: string;
  }
  const [historyList, setHistoryList] = useState<HistoryItem[]>([]);
  const [serverStatus, setServerStatus] = useState<{
    geminiConfigured: boolean;
    supabaseConfigured: boolean;
    isLocalDev: boolean;
  } | null>(null);
  const [clientSettings, setClientSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const raw = localStorage.getItem("mizan_analysis_history");
        if (raw) {
          setHistoryList(JSON.parse(raw));
        }
      } catch (e) {
        console.warn("Failed to load history list:", e);
      }
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
  }, []);

  const isGeminiConfigured = !!(serverStatus?.geminiConfigured || clientSettings?.geminiApiKey);
  const isSupabaseConfigured = !!(
    serverStatus?.supabaseConfigured || 
    (clientSettings?.supabaseUrl && clientSettings?.supabaseAnonKey && clientSettings?.supabaseServiceRoleKey)
  );
  const isConfigured = isGeminiConfigured && isSupabaseConfigured;

  const fileCount = Object.keys(files).length;
  const canAnalyze = fileCount > 0 && !Object.values(uploadingSlots).some(Boolean);

  const performUpload = async (slotId: DocSlotId, file: File) => {
    setUploadingSlots(prev => ({ ...prev, [slotId]: true }));
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("slotId", slotId);

      const res = await fetch("/api/upload", {
        method: "POST",
        headers: getSettingsHeaders(),
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Upload failed");
      }

      const data = await res.json();
      
      setFiles(prev => ({ ...prev, [slotId]: file }));
      setDocumentIds(prev => ({ ...prev, [slotId]: data.documentId }));
    } catch (err: any) {
      console.error(`Error uploading to slot ${slotId}:`, err);
      alert(`Failed to upload ${file.name}: ${err.message}`);
    } finally {
      setUploadingSlots(prev => ({ ...prev, [slotId]: false }));
    }
  };

  // Assign a dropped/browsed file to the first empty matching slot
  const assignFile = useCallback(async (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    // Try to auto-assign by extension
    let targetSlotId: DocSlotId | null = null;
    for (const slot of DOC_SLOTS) {
      if (!files[slot.id] && !uploadingSlots[slot.id]) {
        const slotExt = slot.accept.replace(".", "");
        if (ext === slotExt) {
          targetSlotId = slot.id;
          break;
        }
      }
    }
    // No match — assign to first empty slot
    if (!targetSlotId) {
      for (const slot of DOC_SLOTS) {
        if (!files[slot.id] && !uploadingSlots[slot.id]) {
          targetSlotId = slot.id;
          break;
        }
      }
    }

    if (targetSlotId) {
      await performUpload(targetSlotId, file);
    }
  }, [files, uploadingSlots]);

  const handleDrop = useCallback((file: File) => {
    assignFile(file);
  }, [assignFile]);

  const handleSlotFile = useCallback(async (id: DocSlotId, file: File) => {
    await performUpload(id, file);
  }, []);

  const handleRemove = useCallback((id: DocSlotId) => {
    setFiles(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
    setDocumentIds(prev => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const handleAnalyze = async () => {
    try {
      setPageState("analyzing");
      
      const ids = Object.values(documentIds).filter(Boolean);
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...getSettingsHeaders()
        },
        body: JSON.stringify({ documentIds: ids }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to start analysis");
      }

      const data = await res.json();
      const analysisId = data.analysisId;

      // Save to localStorage so sidebar navigation works
      if (typeof window !== "undefined") {
        localStorage.setItem("latest_analysis_id", analysisId);

        try {
          const mainFileName = files.invoice?.name || Object.values(files)[0]?.name || "Financial Documents";
          const histItem = {
            id: analysisId,
            ref: `REF-${analysisId.slice(0, 8).toUpperCase()}`,
            date: new Date().toLocaleDateString("en-US", { 
              month: "short", 
              day: "numeric", 
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            }),
            fileName: mainFileName
          };
          const rawHist = localStorage.getItem("mizan_analysis_history");
          const history = rawHist ? JSON.parse(rawHist) : [];
          // Prepend and limit to 5 items
          const updatedHistory = [histItem, ...history.filter((h: any) => h.id !== analysisId)].slice(0, 5);
          localStorage.setItem("mizan_analysis_history", JSON.stringify(updatedHistory));
        } catch (e) {
          console.warn("Failed to save analysis history:", e);
        }
      }

      // Redirect to /analysis/[id]
      router.push(`/analysis/${analysisId}`);
    } catch (err: any) {
      console.error("Analysis trigger error:", err);
      alert(`Analysis failed: ${err.message}`);
      setPageState("idle");
    }
  };

  const isAnalyzing = pageState === "analyzing" || pageState === "done";

  return (
    <AppShell>
      <div className="min-h-full px-8 py-10 max-w-[900px] mx-auto">

        {isAnalyzing ? (
          <AnalyzingView step={analyzeStep} progress={analyzeProgress} />
        ) : (
          <>
            {/* ── Page header ────────────────────────────────────── */}
            <div className="mb-10 animate-fade-in">
              <h1
                className="text-3xl font-semibold tracking-tight text-text-primary mb-3"
                style={{ letterSpacing: "-0.02em" }}
              >
                Upload your financial documents
              </h1>
              <p className="text-base text-text-secondary leading-relaxed max-w-2xl">
                Upload the records required to analyze compliance risk and prepare
                your business for tax review.
              </p>
            </div>

            {/* Setup Warning Banner */}
            {serverStatus !== null && !isConfigured && (
              <div className="mb-6 p-4 rounded-xl border bg-critical/10 border-critical/20 text-critical text-xs flex gap-3 animate-slide-up">
                <span className="text-sm mt-0.5">⚠️</span>
                <div className="flex-1">
                  <p className="font-semibold text-text-primary mb-1">Configuration Required</p>
                  <p className="text-text-secondary leading-relaxed mb-2.5">
                    To analyze compliance and execute checks, you must configure Gemini API keys and Supabase database credentials.
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

            {/* ── Main dropzone ───────────────────────────────────── */}
            <div className="mb-6 animate-slide-up" style={{ animationDelay: "40ms" }}>
              <MainDropZone
                isDragging={isDragging}
                onDragEnter={() => setIsDragging(true)}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onBrowse={() => globalInputRef.current?.click()}
                fileCount={fileCount}
              />
              <input
                ref={globalInputRef}
                type="file"
                accept=".pdf,.csv"
                className="sr-only"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) assignFile(f);
                  e.target.value = "";
                }}
              />
            </div>

            {/* ── Document cards ──────────────────────────────────── */}
            <div
              className="grid grid-cols-2 gap-3 mb-8 animate-slide-up"
              style={{ animationDelay: "80ms" }}
            >
              {DOC_SLOTS.map((slot) => (
                <DocCard
                  key={slot.id}
                  slot={slot}
                  file={files[slot.id]}
                  isUploading={uploadingSlots[slot.id]}
                  onFile={handleSlotFile}
                  onRemove={handleRemove}
                  isAnalyzing={isAnalyzing}
                />
              ))}
            </div>

            {/* ── Why MIZAN requests these records ────────────────── */}
            <div
              className="rounded-xl border border-border bg-bg-surface px-6 py-5 mb-8 animate-slide-up"
              style={{ animationDelay: "120ms" }}
            >
              <div className="flex gap-4 items-start">
                <div className="w-7 h-7 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg viewBox="0 0 16 16" fill="none" className="w-3 h-3 text-accent" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="8" cy="8" r="6" />
                    <path d="M8 7v4M8 5.5v.25" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-[13px] font-semibold text-text-primary mb-1.5 tracking-tight">
                    Why MIZAN requests these records
                  </h3>
                  <p className="text-[13px] text-text-tertiary leading-[1.65]">
                    We cross-reference invoices, expenses, payments, and VAT reporting
                    to surface compliance risks before review.
                  </p>
                </div>
              </div>
            </div>

            {/* ── Progress summary + Footer + CTA ─────────────────── */}
            <div
              className="animate-fade-in"
              style={{ animationDelay: "160ms" }}
            >
              {/* Document progress summary */}
              <div className="flex items-center gap-3 mb-5 pb-5 border-b border-border">
                <p className="text-[11px] font-semibold text-text-disabled tracking-widest uppercase mr-1">
                  {fileCount} of 4 ready
                </p>
                {DOC_SLOTS.map((slot) => {
                  const uploaded = !!files[slot.id];
                  return (
                    <div
                      key={slot.id}
                      className={cn(
                        "flex items-center gap-1.5 text-xs transition-all duration-300",
                        uploaded ? "text-success" : slot.required ? "text-text-disabled" : "text-text-disabled opacity-50"
                      )}
                    >
                      <div className={cn(
                        "w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-300",
                        uploaded
                          ? "bg-success/10 border-success/30"
                          : "border-border"
                      )}>
                        {uploaded
                          ? <CheckIcon className="w-2 h-2 text-success" />
                          : <div className={cn("w-1 h-1 rounded-full", slot.required ? "bg-text-disabled" : "bg-border")} />
                        }
                      </div>
                      <span className="text-[11px] font-medium">{slot.label}</span>
                    </div>
                  );
                })}
              </div>

              {/* Footer row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <p className="text-[12px] text-text-disabled">
                    Supported formats:{" "}
                    <span className="text-text-tertiary">PDF · CSV</span>
                  </p>
                  <span className="text-border">·</span>
                  <p className="text-[12px] text-text-disabled">
                    Files are private and used only for analysis.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {fileCount > 0 && (
                    <button
                      onClick={() => {
                        setFiles({});
                        setDocumentIds({});
                        setUploadingSlots({});
                      }}
                      className={cn(
                        "inline-flex items-center gap-1.5 px-4 h-10 rounded-lg",
                        "text-sm font-semibold border border-border bg-bg-surface text-text-secondary hover:bg-bg-elevated",
                        "transition-all duration-200 active:scale-[0.98]"
                      )}
                    >
                      Reset Slots
                    </button>
                  )}

                  <button
                    onClick={handleAnalyze}
                    disabled={!canAnalyze || !isConfigured}
                    className={cn(
                      "inline-flex items-center gap-2 px-5 h-10 rounded-lg",
                      "text-sm font-semibold transition-all duration-200",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-bg-base",
                      (canAnalyze && isConfigured)
                        ? [
                            "bg-accent text-white",
                            "hover:bg-[#6B4EE8] active:scale-[0.98] active:bg-[#5A3FD6]",
                            "shadow-[0_1px_8px_rgba(124,92,255,0.3)]",
                            "hover:shadow-[0_2px_16px_rgba(124,92,255,0.4)]",
                          ]
                        : "bg-bg-elevated text-text-disabled border border-border cursor-not-allowed opacity-60"
                    )}
                  >
                    Analyze Compliance
                    <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1.5 6h9M6 2l4 4-4 4" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* History Table */}
            {historyList.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border animate-slide-up" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xs font-bold text-text-primary tracking-wider uppercase">
                      Recent Compliance Audits
                    </h2>
                    <p className="text-2xs text-text-tertiary mt-0.5">
                      Quickly access and view your previous audit results and reports.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm("Are you sure you want to clear your audit history?")) {
                        localStorage.removeItem("mizan_analysis_history");
                        setHistoryList([]);
                      }
                    }}
                    className="text-2xs text-text-disabled hover:text-critical font-semibold uppercase tracking-wider transition-colors duration-200"
                  >
                    Clear History
                  </button>
                </div>

                <div className="border border-border/80 rounded-lg overflow-hidden bg-bg-surface/30">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border/80 bg-bg-elevated/40">
                        <th className="px-4 py-3 font-semibold text-text-primary uppercase tracking-wider">Reference</th>
                        <th className="px-4 py-3 font-semibold text-text-primary uppercase tracking-wider">Primary Document</th>
                        <th className="px-4 py-3 font-semibold text-text-primary uppercase tracking-wider">Date & Time</th>
                        <th className="px-4 py-3 text-right font-semibold text-text-primary uppercase tracking-wider">Action</th>
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
                          onClick={() => router.push(`/dashboard/${item.id}`)}
                        >
                          <td className="px-4 py-3.5 font-bold text-accent">
                            {item.ref}
                          </td>
                          <td className="px-4 py-3.5 text-text-secondary truncate max-w-[200px]">
                            {item.fileName}
                          </td>
                          <td className="px-4 py-3.5 text-text-tertiary">
                            {item.date}
                          </td>
                          <td className="px-4 py-3.5 text-right font-medium text-text-primary">
                            <span className="text-accent hover:underline">View Audit →</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
