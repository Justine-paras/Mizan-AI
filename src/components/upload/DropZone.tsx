"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";

interface DropZoneProps {
  onFileSelected?: (file: File) => void;
}

type State = "idle" | "dragging" | "uploading" | "done" | "error";

export default function DropZone({ onFileSelected }: DropZoneProps) {
  const [state, setState] = useState<State>("idle");
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      const allowed = ["application/pdf", "text/csv",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.ms-excel"];

      if (!allowed.includes(file.type)) {
        setError("Unsupported file type. Upload a PDF, XLSX, or CSV.");
        setState("error");
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError("File exceeds 20 MB limit.");
        setState("error");
        return;
      }

      setError(null);
      setFileName(file.name);
      setState("uploading");
      onFileSelected?.(file);

      // TODO: POST to /api/upload in Phase 2
      await new Promise((r) => setTimeout(r, 1800));
      setState("done");
    },
    [onFileSelected]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setState("idle");
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  return (
    <div className="relative">
      <label
        htmlFor="file-upload"
        onDragOver={(e) => { e.preventDefault(); setState("dragging"); }}
        onDragLeave={() => setState("idle")}
        onDrop={onDrop}
        className={cn(
          "relative flex flex-col items-center justify-center",
          "w-full h-56 rounded-xl border-2 border-dashed cursor-pointer",
          "transition-all duration-200 group",
          state === "dragging"
            ? "border-accent bg-accent/5 scale-[1.01]"
            : state === "done"
            ? "border-success/40 bg-success/5"
            : state === "error"
            ? "border-critical/40 bg-critical/5"
            : "border-border-strong bg-bg-surface hover:border-accent/40 hover:bg-accent/[0.03]"
        )}
      >
        {/* Content */}
        {state === "uploading" ? (
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <Spinner size="md" />
            <p className="text-sm text-text-secondary">Uploading {fileName}…</p>
          </div>
        ) : state === "done" ? (
          <div className="flex flex-col items-center gap-3 animate-scale-in">
            <div className="w-10 h-10 rounded-full bg-success/10 border border-success/20 flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 text-success" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 8.5l3.5 3.5 6.5-7" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-text-primary">{fileName}</p>
              <p className="text-xs text-success mt-0.5">Uploaded — analysis starting…</p>
            </div>
          </div>
        ) : state === "error" ? (
          <div className="flex flex-col items-center gap-3 animate-fade-in">
            <div className="w-10 h-10 rounded-full bg-critical/10 border border-critical/20 flex items-center justify-center">
              <svg viewBox="0 0 16 16" fill="none" className="w-5 h-5 text-critical" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M8 5v4M8 11v.5" />
                <circle cx="8" cy="8" r="6" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-critical">{error}</p>
              <p className="text-xs text-text-tertiary mt-0.5">Try a different file</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            {/* Upload icon */}
            <div className={cn(
              "w-12 h-12 rounded-xl border flex items-center justify-center",
              "bg-bg-elevated border-border-strong",
              "group-hover:border-accent/30 group-hover:bg-accent/5 transition-all duration-200"
            )}>
              <svg viewBox="0 0 20 20" fill="none" className="w-5 h-5 text-text-tertiary group-hover:text-accent transition-colors duration-200" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13V3M6 7l4-4 4 4M4.5 14.5A3 3 0 005 20h10a3 3 0 00.5-5.5" />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-sm font-medium text-text-primary">
                {state === "dragging" ? "Drop to upload" : "Drop files here"}
              </p>
              <p className="text-xs text-text-tertiary mt-0.5">
                or{" "}
                <span className="text-accent underline underline-offset-2 decoration-accent/40">
                  browse your computer
                </span>
              </p>
            </div>
          </div>
        )}

        <input
          id="file-upload"
          type="file"
          accept=".pdf,.xlsx,.xls,.csv"
          className="sr-only"
          onChange={onInputChange}
          disabled={state === "uploading"}
        />
      </label>

      {/* Reset button when done or error */}
      {(state === "done" || state === "error") && (
        <Button
          variant="ghost"
          size="xs"
          className="absolute top-3 right-3"
          onClick={() => { setState("idle"); setFileName(null); setError(null); }}
        >
          Clear
        </Button>
      )}
    </div>
  );
}
