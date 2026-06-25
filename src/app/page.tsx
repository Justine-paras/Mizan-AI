"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/Spinner";

// ─── Inline SVG Icons ────────────────────────────────────────────────────────

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 8h11M9 3.5l4.5 4.5-4.5 4.5" />
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

function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 1.5L2.5 4v4c0 3 2.5 5.5 5.5 6 3-0.5 5.5-3 5.5-6V4L8 1.5z" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 2.5h11a1 1 0 011 1v7a1 1 0 01-1 1H5.5l-3 2.5V3.5a1 1 0 011-1z" />
    </svg>
  );
}

function FileIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.5 1.5H4a1 1 0 00-1 1v11a1 1 0 001 1h8a1 1 0 001-1V5l-3.5-3.5z" />
      <path d="M9.5 1.5V5H13.5" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="6" width="10" height="8.5" rx="2" />
      <path d="M4.5 6V4.5a3.5 3.5 0 017 0V6" />
    </svg>
  );
}

function BrainIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v12M6 12h12M7.5 7.5l9 9M7.5 16.5l9-9" />
    </svg>
  );
}

function SparklesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.5 5.5l2.8 2.8M15.7 15.7l2.8 2.8M5.5 18.5l2.8-2.8M15.7 8.3l2.8-2.8" />
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

// ─── Preview Screens Mockups ───────────────────────────────────────────────────

function UploadPreview() {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5 animate-scale-in">
      <div className="border border-dashed border-border rounded-lg p-5 flex items-center justify-center gap-4 bg-white/[0.01] mb-5">
        <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
          <UploadCloudIcon className="w-4 h-4 text-accent" />
        </div>
        <div className="text-left">
          <p className="text-xs font-semibold text-text-primary">Drop financial documents</p>
          <p className="text-[10px] text-text-tertiary">PDF or CSV formats</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-accent/20 bg-accent/5 rounded-lg p-3 text-left">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-semibold text-text-primary">Invoices</span>
            <span className="text-[8px] font-semibold text-success uppercase">Uploaded</span>
          </div>
          <p className="text-[9px] text-text-tertiary truncate">uae_tax_invoice.pdf</p>
        </div>
        <div className="border border-border rounded-lg p-3 text-left">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-semibold text-text-secondary">Expenses</span>
            <span className="text-[8px] font-semibold text-text-disabled uppercase">Required</span>
          </div>
          <button className="text-[9px] text-accent font-medium mt-1">Add CSV +</button>
        </div>
      </div>
    </div>
  );
}

function AnalysisPreview() {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-6 text-center animate-scale-in flex flex-col items-center justify-center gap-5">
      <div className="relative">
        <svg width="60" height="60" className="rotate-[-90deg]">
          <circle cx="30" cy="30" r="26" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
          <circle cx="30" cy="30" r="26" fill="none" stroke="#7C5CFF" strokeWidth="3" strokeDasharray={2*Math.PI*26} strokeDashoffset={2*Math.PI*26*0.3} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-semibold text-text-primary">70%</span>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-[200px] text-left">
        <div className="flex items-center gap-2 text-[10px] text-success">
          <CheckIcon className="w-3 h-3" />
          <span>Extracting financial data...</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-text-primary font-medium">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>Running VAT compliance checks...</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-text-disabled">
          <div className="w-1.5 h-1.5 rounded-full bg-border" />
          <span>Cross-referencing payments...</span>
        </div>
      </div>
    </div>
  );
}

function ChatPreview() {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5 text-left flex flex-col gap-3 h-[210px] justify-between animate-scale-in">
      <div className="flex flex-col gap-3 overflow-y-auto pr-1">
        <div className="bg-bg-elevated border border-border rounded-lg p-2.5 max-w-[85%] self-start">
          <p className="text-[10px] text-accent font-semibold mb-0.5">MIZAN Copilot</p>
          <p className="text-[11px] text-text-secondary leading-relaxed">
            Your Q2 expense sheet contains standard claims for dining. Under Article 53, VAT on hospitality/entertainment is non-recoverable.
          </p>
        </div>
        <div className="bg-accent/15 border border-accent/20 rounded-lg p-2.5 max-w-[85%] self-end">
          <p className="text-[11px] text-text-primary font-medium leading-relaxed">
            Why is entertainment VAT excluded from input recovery?
          </p>
        </div>
      </div>
      <div className="border border-border rounded-lg px-2.5 py-1.5 bg-bg-elevated flex items-center justify-between">
        <span className="text-[10px] text-text-tertiary">Ask your copilot a question...</span>
        <div className="w-5 h-5 rounded bg-accent/20 flex items-center justify-center text-accent text-xs">⏎</div>
      </div>
    </div>
  );
}

function ReportPreview() {
  return (
    <div className="rounded-xl border border-border bg-bg-surface p-5 text-left animate-scale-in">
      <div className="flex items-center justify-between border-b border-border pb-3 mb-3">
        <div>
          <p className="text-[8px] font-semibold text-text-tertiary uppercase">Federal Tax Authority Format</p>
          <p className="text-xs font-bold text-text-primary">Compliance Audit Report</p>
        </div>
        <div className="px-2 py-0.5 rounded bg-warning/10 border border-warning/25 text-[8px] font-semibold text-warning">MEDIUM RISK</div>
      </div>
      <div className="flex flex-col gap-2 mb-4">
        <div className="flex justify-between items-center text-[10px] border-b border-border-subtle pb-1">
          <span className="text-text-tertiary">TRN Registration Check</span>
          <span className="text-success font-medium">PASS</span>
        </div>
        <div className="flex justify-between items-center text-[10px] border-b border-border-subtle pb-1">
          <span className="text-text-tertiary">Input VAT Recoverability</span>
          <span className="text-critical font-medium">1 ALERT</span>
        </div>
        <div className="flex justify-between items-center text-[10px]">
          <span className="text-text-tertiary">Bank Reconciliation Summary</span>
          <span className="text-warning font-medium">FLAGGED</span>
        </div>
      </div>
      <button className="w-full py-1.5 bg-accent hover:bg-[#6b4ee8] text-white rounded text-[10px] font-semibold transition-all duration-150 shadow-[0_1px_4px_rgba(124,92,255,0.2)]">
        Export Audit-Ready PDF
      </button>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────

export default function HomePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"upload" | "analysis" | "chat" | "report">("upload");
  const [latestAnalysisId, setLatestAnalysisId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const id = localStorage.getItem("latest_analysis_id");
      if (id) setLatestAnalysisId(id);
    }
  }, []);

  const handleStartAnalysis = () => {
    router.push("/upload");
  };

  const handleOpenDashboard = () => {
    if (latestAnalysisId) {
      router.push(`/dashboard/${latestAnalysisId}`);
    } else {
      router.push("/upload");
    }
  };

  return (
    <div className="min-h-screen bg-bg-base text-text-primary selection:bg-accent/30 selection:text-white font-sans overflow-x-hidden">
      
      <header className="fixed top-0 left-0 right-0 h-16 border-b border-border bg-bg-base/80 backdrop-blur-md z-50 flex items-center justify-between px-8 max-w-6xl mx-auto relative">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold tracking-wider text-text-primary">
            MIZAN <span className="text-text-tertiary">|</span> <span className="font-light">ميزان</span>
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-text-secondary absolute left-1/2 -translate-x-1/2">
          <a href="#product" className="hover:text-text-primary transition-colors">Product</a>
          <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-text-primary transition-colors">Demo</a>
          <a href="#trust" className="hover:text-text-primary transition-colors">About</a>
        </nav>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleStartAnalysis}
            className="px-4 h-8 rounded bg-accent hover:bg-[#6b4ee8] text-white text-xs font-semibold shadow-[0_1px_4px_rgba(124,92,255,0.2)] transition-all"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Spacer for fixed nav */}
      <div className="h-16" />

      {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
      <section id="product" className="relative pt-20 pb-28 px-6 max-w-5xl mx-auto text-center overflow-hidden flex flex-col items-center">
        {/* Ambient background glow */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px] -z-10" />

        <div className="animate-fade-in flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent text-[11px] font-semibold tracking-wider uppercase mb-6">
            <SparklesIcon className="w-3.5 h-3.5 animate-pulse" />
            AI-Powered Tax Compliance
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-text-primary max-w-3xl leading-[1.1] mb-6">
            Stop compliance issues before they become expensive.
          </h1>

          <p className="text-base md:text-lg text-text-secondary max-w-2xl leading-relaxed mb-10">
            Upload financial records, detect compliance risk, and understand your business through an AI finance copilot built for UAE SMEs.
          </p>

          <div className="flex items-center gap-4 mb-20">
            <button 
              onClick={handleStartAnalysis}
              className="inline-flex items-center gap-2 px-6 h-12 bg-accent hover:bg-[#6b4ee8] text-white rounded-lg text-sm font-semibold shadow-[0_2px_12px_rgba(124,92,255,0.3)] transition-all duration-200"
            >
              Start Analysis
              <ArrowRightIcon className="w-4 h-4" />
            </button>
            <a 
              href="#how-it-works"
              className="inline-flex items-center justify-center px-6 h-12 rounded-lg border border-border hover:border-border-strong text-sm font-semibold text-text-secondary transition-all"
            >
              Watch Demo
            </a>
          </div>
        </div>

        {/* Abstract Product Flow Visualization */}
        <div className="w-full max-w-4xl border border-border bg-bg-surface/50 rounded-xl p-8 backdrop-blur-sm relative animate-slide-up" style={{ animationDelay: "80ms" }}>
          {/* Grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] rounded-xl -z-10" />

          <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-widest text-center mb-8">
            Integrated Data Analysis Pipeline
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
            {/* Box 1: Ingestion */}
            <div className="flex flex-col items-center w-36 p-4 rounded-xl border border-border bg-bg-base/80 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
              <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center mb-3">
                <FileIcon className="w-5 h-5 text-text-secondary" />
              </div>
              <p className="text-xs font-semibold text-text-primary">1. Documents</p>
              <p className="text-[10px] text-text-tertiary mt-1">PDF & CSV Files</p>
            </div>

            {/* Link 1 */}
            <div className="hidden md:flex flex-col items-center justify-center flex-1 h-px border-t border-dashed border-border relative">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping absolute" />
            </div>

            {/* Box 2: Analysis */}
            <div className="flex flex-col items-center w-36 p-4 rounded-xl border border-border bg-bg-base/80 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
              <div className="w-10 h-10 rounded-lg bg-accent/5 border border-accent/15 flex items-center justify-center mb-3">
                <Spinner size="sm" />
              </div>
              <p className="text-xs font-semibold text-text-primary">2. Analysis</p>
              <p className="text-[10px] text-text-tertiary mt-1">Data Cross-Check</p>
            </div>

            {/* Link 2 */}
            <div className="hidden md:flex flex-col items-center justify-center flex-1 h-px border-t border-dashed border-border relative">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping absolute" />
            </div>

            {/* Box 3: Copilot */}
            <div className="flex flex-col items-center w-36 p-4 rounded-xl border border-border bg-bg-base/80 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
              <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center mb-3">
                <BrainIcon className="w-5 h-5 text-text-secondary" />
              </div>
              <p className="text-xs font-semibold text-text-primary">3. AI Insights</p>
              <p className="text-[10px] text-text-tertiary mt-1">FTA Rule Mapping</p>
            </div>

            {/* Link 3 */}
            <div className="hidden md:flex flex-col items-center justify-center flex-1 h-px border-t border-dashed border-border relative">
              <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping absolute" />
            </div>

            {/* Box 4: Report */}
            <div className="flex flex-col items-center w-36 p-4 rounded-xl border border-accent/20 bg-accent/5 shadow-[0_1px_3px_rgba(0,0,0,0.3)]">
              <div className="w-10 h-10 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center mb-3">
                <ShieldIcon className="w-5 h-5 text-accent" />
              </div>
              <p className="text-xs font-semibold text-text-primary">4. Audit Report</p>
              <p className="text-[10px] text-text-tertiary mt-1">Compliant Export</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: PROBLEM ─────────────────────────────────────────── */}
      <section className="border-t border-border bg-bg-surface/20 py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-5/12 text-left">
            <p className="t-subheading mb-3">The Compliance Gap</p>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-5 leading-tight">
              Businesses discover compliance problems too late.
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              Traditional tax reviews happen post-filing or during final auditor inspections. By then, invoicing mistakes, illegal VAT claims, and missing documentation have already created audit exposure and penalty liability.
            </p>
          </div>

          <div className="md:w-7/12 w-full grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* The Traditional Way */}
            <div className="border border-border bg-bg-surface/50 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-critical/40" />
              <p className="text-[10px] font-bold text-critical tracking-wider uppercase mb-4">Traditional Flow</p>
              
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-border bg-white/[0.02] flex items-center justify-center text-[9px] text-text-tertiary">1</div>
                  <span className="text-xs text-text-secondary">Financial Activity</span>
                </div>
                <div className="w-px h-3 bg-border ml-2.5" />
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-border bg-white/[0.02] flex items-center justify-center text-[9px] text-text-tertiary">2</div>
                  <span className="text-xs text-text-secondary">Manual Quarter-End Review</span>
                </div>
                <div className="w-px h-3 bg-border ml-2.5" />
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-critical/20 bg-critical/5 flex items-center justify-center text-[9px] text-critical font-bold">!</div>
                  <span className="text-xs text-text-primary font-medium">Late Penalty Detection</span>
                </div>
                <div className="w-px h-3 bg-border ml-2.5" />
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-critical/20 flex items-center justify-center text-[10px] text-critical">✕</div>
                  <span className="text-xs text-critical font-bold">Costly Tax Penalties</span>
                </div>
              </div>
            </div>

            {/* The Mizan Way */}
            <div className="border border-accent/20 bg-accent/5 rounded-xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-accent" />
              <p className="text-[10px] font-bold text-accent tracking-wider uppercase mb-4">MIZAN Pipeline</p>
              
              <div className="flex flex-col gap-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-accent/20 bg-accent/5 flex items-center justify-center text-[9px] text-accent font-bold">✓</div>
                  <span className="text-xs text-text-primary font-medium">Real-time Activity Ingestion</span>
                </div>
                <div className="w-px h-3 bg-accent/20 ml-2.5" />
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-accent/20 bg-accent/5 flex items-center justify-center text-[9px] text-accent font-bold">✓</div>
                  <span className="text-xs text-text-primary font-medium">Continuous AI Audit Check</span>
                </div>
                <div className="w-px h-3 bg-accent/20 ml-2.5" />
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-accent/20 bg-accent/5 flex items-center justify-center text-[9px] text-accent font-bold">✓</div>
                  <span className="text-xs text-text-primary font-medium">Early Risk Alerts</span>
                </div>
                <div className="w-px h-3 bg-accent/20 ml-2.5" />
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center text-[10px] text-accent font-bold">✓</div>
                  <span className="text-xs text-accent font-bold">Audit-Ready Adjustments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: HOW IT WORKS ────────────────────────────────────── */}
      <section id="how-it-works" className="border-t border-border py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="t-subheading mb-3">Audit Readiness</p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-16">
            Four steps to audit readiness.
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            {/* Step 1 */}
            <div className="border border-border bg-bg-surface/40 hover:bg-bg-surface/70 hover:border-border-strong rounded-xl p-6 transition-all duration-200">
              <span className="text-2xs font-semibold text-text-disabled uppercase">Step 01</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center mt-3 mb-5">
                <UploadCloudIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Upload Files</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Drag-and-drop your company invoices, bank records, and expense spreadsheets into matching slots.
              </p>
            </div>

            {/* Step 2 */}
            <div className="border border-border bg-bg-surface/40 hover:bg-bg-surface/70 hover:border-border-strong rounded-xl p-6 transition-all duration-200">
              <span className="text-2xs font-semibold text-text-disabled uppercase">Step 02</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center mt-3 mb-5">
                <ShieldIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Audit Check</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Gemini extracts the values and runs compliance calculations to match payments and locate invalid tax codes.
              </p>
            </div>

            {/* Step 3 */}
            <div className="border border-border bg-bg-surface/40 hover:bg-bg-surface/70 hover:border-border-strong rounded-xl p-6 transition-all duration-200">
              <span className="text-2xs font-semibold text-text-disabled uppercase">Step 03</span>
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-border flex items-center justify-center mt-3 mb-5">
                <ChatIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Ask AI Copilot</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Converse with your copilot. Clarify why specific transactions were flagged and get remediation instructions.
              </p>
            </div>

            {/* Step 4 */}
            <div className="border border-border bg-bg-surface/40 hover:bg-bg-surface/70 hover:border-border-strong rounded-xl p-6 transition-all duration-200">
              <span className="text-2xs font-semibold text-text-disabled uppercase">Step 04</span>
              <div className="w-8 h-8 rounded-lg bg-accent/5 border border-accent/15 flex items-center justify-center mt-3 mb-5">
                <FileIcon className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary mb-2">Export Summary</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Generate dynamic compliance reports that display audit trails and findings categorized by severity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 4: PRODUCT PREVIEW ─────────────────────────────────── */}
      <section className="border-t border-border bg-bg-surface/10 py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="t-subheading mb-3">Interactive Workspace</p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-12">
            A complete compliance cockpit.
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Tabs Header Column */}
            <div className="lg:col-span-4 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
              <button
                onClick={() => setActiveTab("upload")}
                className={`flex-1 text-left px-5 py-4 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 min-w-[120px] ${
                  activeTab === "upload"
                    ? "bg-accent/5 border-accent/30 text-accent shadow-[0_2px_8px_rgba(124,92,255,0.08)]"
                    : "bg-transparent border-border text-text-secondary hover:border-border-strong"
                }`}
              >
                1. Upload Screen
              </button>
              <button
                onClick={() => setActiveTab("analysis")}
                className={`flex-1 text-left px-5 py-4 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 min-w-[120px] ${
                  activeTab === "analysis"
                    ? "bg-accent/5 border-accent/30 text-accent shadow-[0_2px_8px_rgba(124,92,255,0.08)]"
                    : "bg-transparent border-border text-text-secondary hover:border-border-strong"
                }`}
              >
                2. Real-time Analysis
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`flex-1 text-left px-5 py-4 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 min-w-[120px] ${
                  activeTab === "chat"
                    ? "bg-accent/5 border-accent/30 text-accent shadow-[0_2px_8px_rgba(124,92,255,0.08)]"
                    : "bg-transparent border-border text-text-secondary hover:border-border-strong"
                }`}
              >
                3. Copilot Dialogue
              </button>
              <button
                onClick={() => setActiveTab("report")}
                className={`flex-1 text-left px-5 py-4 rounded-xl border text-xs font-semibold tracking-wide transition-all duration-200 min-w-[120px] ${
                  activeTab === "report"
                    ? "bg-accent/5 border-accent/30 text-accent shadow-[0_2px_8px_rgba(124,92,255,0.08)]"
                    : "bg-transparent border-border text-text-secondary hover:border-border-strong"
                }`}
              >
                4. Compliance Report
              </button>
            </div>

            {/* Display Column */}
            <div className="lg:col-span-8 flex flex-col justify-center border border-border bg-bg-surface/30 rounded-2xl p-6 relative">
              {/* Glow backing */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/5 rounded-full blur-[80px] -z-10" />

              {activeTab === "upload" && <UploadPreview />}
              {activeTab === "analysis" && <AnalysisPreview />}
              {activeTab === "chat" && <ChatPreview />}
              {activeTab === "report" && <ReportPreview />}
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FEATURES ────────────────────────────────────────── */}
      <section id="features" className="border-t border-border py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="t-subheading mb-3">Capabilities</p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-16">
            Intelligent features for compliance.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Feature 1 */}
            <div className="border border-border bg-bg-surface/40 rounded-xl p-6 text-left">
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-border flex items-center justify-center mb-4">
                <UploadCloudIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <h3 className="text-xs font-semibold text-text-primary mb-2">AI Document Understanding</h3>
              <p className="text-2xs text-text-secondary leading-relaxed">
                Ingest invoices, bank transcripts, and journals without mapping. Multimodal OCR reads scanned receipts and layouts natively.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="border border-border bg-bg-surface/40 rounded-xl p-6 text-left">
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-border flex items-center justify-center mb-4">
                <ShieldIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <h3 className="text-xs font-semibold text-text-primary mb-2">Compliance Monitoring</h3>
              <p className="text-2xs text-text-secondary leading-relaxed">
                Automated scanning for correct 15-digit TRNs, tax rates, transaction calculations, and supplier legitimacy.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="border border-border bg-bg-surface/40 rounded-xl p-6 text-left">
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-border flex items-center justify-center mb-4">
                <BrainIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <h3 className="text-xs font-semibold text-text-primary mb-2">Financial Copilot</h3>
              <p className="text-2xs text-text-secondary leading-relaxed">
                Explain complex tax codes in plain language. Ask Mizan why an item was flagged and get step-by-step resolution advice.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="border border-border bg-bg-surface/40 rounded-xl p-6 text-left">
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-border flex items-center justify-center mb-4">
                <SparklesIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <h3 className="text-xs font-semibold text-text-primary mb-2">Risk Insights</h3>
              <p className="text-2xs text-text-secondary leading-relaxed">
                Isolate exposure prior to audit. Highlight recovery exceptions such as hospitality, company cars, or entertainment claims.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="border border-border bg-bg-surface/40 rounded-xl p-6 text-left">
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-border flex items-center justify-center mb-4">
                <CheckIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <h3 className="text-xs font-semibold text-text-primary mb-2">Explainability</h3>
              <p className="text-2xs text-text-secondary leading-relaxed">
                Clear reasoning for every recommendation, directly linking compliance observations to applicable FTA regulations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="border border-accent/20 bg-accent/5 rounded-xl p-6 text-left">
              <div className="w-8 h-8 rounded bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                <FileIcon className="w-4 h-4 text-accent" />
              </div>
              <h3 className="text-xs font-semibold text-text-primary mb-2">Report Generation</h3>
              <p className="text-2xs text-text-secondary leading-relaxed">
                Compile dynamic compliance summaries to share with internal finance managers, auditors, or leadership.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 6: TRUST ───────────────────────────────────────────── */}
      <section id="trust" className="border-t border-border bg-bg-surface/10 py-24 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-12 items-center">
          <div className="md:w-5/12 text-left">
            <p className="t-subheading mb-3">Enterprise Standard</p>
            <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-5 leading-tight">
              Built for financial confidence.
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              We design our models and systems to act as a secure, transparent layer on top of your financial processes.
            </p>
          </div>

          <div className="md:w-7/12 w-full flex flex-col gap-4 text-left">
            {/* Pillar 1 */}
            <div className="border border-border bg-bg-surface/50 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-border flex items-center justify-center flex-shrink-0">
                <LockIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text-primary mb-1">Private by Default</h3>
                <p className="text-2xs text-text-secondary leading-relaxed">
                  Your business uploads are isolated in secure databases. We do not use financial records to train public AI models.
                </p>
              </div>
            </div>

            {/* Pillar 2 */}
            <div className="border border-border bg-bg-surface/50 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-border flex items-center justify-center flex-shrink-0">
                <ShieldIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text-primary mb-1">Explainable Outputs</h3>
                <p className="text-2xs text-text-secondary leading-relaxed">
                  Every alert references concrete regulatory sections or calculation mismatches, so you can trace AI findings to FTA laws.
                </p>
              </div>
            </div>

            {/* Pillar 3 */}
            <div className="border border-border bg-bg-surface/50 rounded-xl p-5 flex items-start gap-4">
              <div className="w-8 h-8 rounded bg-white/[0.03] border border-border flex items-center justify-center flex-shrink-0">
                <BrainIcon className="w-4 h-4 text-text-secondary" />
              </div>
              <div>
                <h3 className="text-xs font-semibold text-text-primary mb-1">Human-Readable Insights</h3>
                <p className="text-2xs text-text-secondary leading-relaxed">
                  No complex tax jargon. Mizan translates audit checks into clear actions for founders, executives, and directors.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 7: FINAL CTA & FOOTER ─────────────────────────────── */}
      <section className="border-t border-border py-28 px-6 text-center relative overflow-hidden flex flex-col items-center">
        {/* Ambient bottom glow */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-accent/5 rounded-full blur-[90px] -z-10" />

        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-text-primary mb-4 max-w-lg">
          Know your risk before someone else does.
        </h2>
        
        <p className="text-sm text-text-secondary max-w-md leading-relaxed mb-10">
          Upload your compliance files now and check your tax readiness rating in seconds.
        </p>

        <div className="flex items-center gap-4 mb-28">
          <button 
            onClick={handleStartAnalysis}
            className="inline-flex items-center gap-2 px-6 h-12 bg-accent hover:bg-[#6b4ee8] text-white rounded-lg text-sm font-semibold shadow-[0_2px_12px_rgba(124,92,255,0.3)] transition-all duration-200"
          >
            Start Analysis
            <ArrowRightIcon className="w-4 h-4" />
          </button>
          <a 
            href="#how-it-works"
            className="inline-flex items-center justify-center px-6 h-12 rounded-lg border border-border hover:border-border-strong text-sm font-semibold text-text-secondary transition-all"
          >
            View Demo
          </a>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-5xl border-t border-border pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left">
            <span className="text-xs font-semibold tracking-wider text-text-primary">
              MIZAN <span className="text-text-tertiary">|</span> <span className="font-light">ميزان</span>
            </span>
            <p className="text-[10px] text-text-tertiary mt-1">AI Finance Copilot for UAE SMEs</p>
          </div>
          
          <div className="flex gap-8 text-[11px] text-text-tertiary font-medium">
            <a href="#product" className="hover:text-text-primary transition-colors">Product</a>
            <a href="#features" className="hover:text-text-primary transition-colors">Features</a>
            <a href="#trust" className="hover:text-text-primary transition-colors">Privacy</a>
            <a href="https://tax.gov.ae" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">FTA Portal</a>
          </div>
          
          <p className="text-[10px] text-text-disabled">© 2026 MIZAN. All rights reserved.</p>
        </footer>
      </section>

    </div>
  );
}
