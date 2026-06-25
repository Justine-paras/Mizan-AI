"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Spinner from "@/components/ui/Spinner";

interface AnalysisPageProps {
  params: { id: string };
}

// Simulated analysis progress steps
const STEPS = [
  "Reading document…",
  "Extracting financial data…",
  "Running compliance checks…",
  "Scoring your return…",
  "Finalizing report…",
];

export default function AnalysisPage({ params }: AnalysisPageProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // TODO: Replace with real /api/analyze polling in Phase 3
    const interval = setInterval(() => {
      setStep((s) => {
        const next = Math.min(s + 1, STEPS.length - 1);
        setProgress(Math.round(((next + 1) / STEPS.length) * 100));
        if (next === STEPS.length - 1) {
          clearInterval(interval);
          setTimeout(() => router.push(`/dashboard/${params.id}`), 1000);
        }
        return next;
      });
    }, 900);
    return () => clearInterval(interval);
  }, [params.id, router]);

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center h-full gap-10 px-8 animate-fade-in">
        {/* Score ring placeholder / spinner */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full border-2 border-accent/20 flex items-center justify-center">
            <Spinner size="lg" />
          </div>
          <div className="absolute inset-0 rounded-full animate-pulse-ring opacity-50"
            style={{ background: "radial-gradient(circle, rgba(124,92,255,0.12) 0%, transparent 70%)" }}
          />
        </div>

        <div className="text-center max-w-xs">
          <h1 className="text-lg font-semibold text-text-primary tracking-tight mb-2">
            Analyzing your document
          </h1>
          <p className="text-sm text-text-secondary animate-fade-in" key={step}>
            {STEPS[step]}
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-64">
          <div className="w-full h-[3px] bg-white/6 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-text-tertiary text-right mt-2 tabular-nums">{progress}%</p>
        </div>
      </div>
    </AppShell>
  );
}
