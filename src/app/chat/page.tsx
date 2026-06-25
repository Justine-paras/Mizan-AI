"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";
import Spinner from "@/components/ui/Spinner";

export default function ChatIndexPage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const latestId = localStorage.getItem("latest_analysis_id");
      if (latestId) {
        router.replace(`/chat/${latestId}`);
      } else {
        router.replace("/upload");
      }
    }
  }, [router]);

  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Spinner size="lg" />
        <p className="text-sm text-text-secondary">Routing to active copilot...</p>
      </div>
    </AppShell>
  );
}
