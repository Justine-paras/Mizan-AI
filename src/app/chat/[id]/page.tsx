"use client";

import AppShell from "@/components/layout/AppShell";
import ChatWindow from "@/components/chat/ChatWindow";
import ChatInput from "@/components/chat/ChatInput";
import { useState, useEffect } from "react";
import type { Message } from "@/types";
import { getSettingsHeaders } from "@/lib/settings";

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    analysis_id: "demo",
    role: "assistant",
    content:
      "I've reviewed your Q2 VAT return and financial statements. Your overall compliance score is 68/100 — there are a few issues I can help you address. What would you like to understand first?",
  },
];

interface ChatPageProps {
  params: { id: string };
}

export default function ChatPage({ params }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAnalysisGreeting() {
      try {
        const res = await fetch(`/api/analyze?id=${params.id}`, {
          headers: getSettingsHeaders(),
        });
        if (!res.ok) return;
        const data = await res.json();
        setMessages([
          {
            id: "greeting",
            analysis_id: params.id,
            role: "assistant",
            content: `Marhaba! I have loaded your UAE compliance analysis (Record: ${params.id.substring(0, 8)}...). Your current compliance score is ${data.score}/100 under a ${data.risk.toUpperCase()} risk classification. How can I help clarify any audit findings or UAE FTA regulations?`,
          },
        ]);
      } catch (err) {
        console.error("Failed to load greeting context:", err);
      }
    }
    loadAnalysisGreeting();
  }, [params.id]);

  async function handleSend(content: string) {
    const userMsg: Message = {
      id: String(Date.now()),
      analysis_id: params.id,
      role: "user",
      content,
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...getSettingsHeaders(),
        },
        body: JSON.stringify({
          analysisId: params.id,
          messages: updatedMessages,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to communicate with Tax Copilot.");
      }

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          analysis_id: params.id,
          role: "assistant",
          content: data.message,
        },
      ]);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages((prev) => [
        ...prev,
        {
          id: String(Date.now() + 1),
          analysis_id: params.id,
          role: "assistant",
          content: `⚠️ Error: ${err.message || "Failed to connect to Mizan Copilot."}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppShell>
      <div className="flex flex-col h-full max-w-3xl mx-auto px-8 animate-fade-in">
        {/* Header */}
        <div className="py-7 border-b border-border flex-shrink-0">
          <p className="t-label mb-1.5">Reference · REF-{params.id.slice(0, 8).toUpperCase()}</p>
          <h1 className="text-lg font-semibold text-text-primary tracking-tight">
            Tax Compliance Copilot
          </h1>
          <p className="text-xs text-text-tertiary mt-0.5">
            Ask anything about your VAT return, invoices, or compliance obligations.
          </p>
        </div>

        {/* Messages */}
        <ChatWindow messages={messages} loading={loading} />

        {/* Input */}
        <div className="py-5 flex-shrink-0">
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      </div>
    </AppShell>
  );
}
