"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import MessageBubble from "./MessageBubble";
import Spinner from "@/components/ui/Spinner";
import type { Message } from "@/types";

interface ChatWindowProps {
  messages: Message[];
  loading?: boolean;
}

export default function ChatWindow({ messages, loading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto py-6 space-y-1 min-h-0">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-8">
          <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center">
            <svg viewBox="0 0 16 16" fill="none" className="w-4.5 h-4.5 text-accent" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 1.5L2.5 5v4c0 2.5 2 4.5 5.5 5.5 3.5-1 5.5-3 5.5-5.5V5L8 1.5z" />
            </svg>
          </div>
          <p className="text-sm text-text-secondary">
            Ask about your VAT compliance, invoices, or FTA obligations.
          </p>
        </div>
      ) : (
        messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            role={msg.role}
            content={msg.content}
            isLast={i === messages.length - 1}
          />
        ))
      )}

      {/* Typing indicator */}
      {loading && (
        <div className="flex items-center gap-3 px-1 py-2 animate-fade-in">
          <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
            <Spinner size="xs" />
          </div>
          <p className="text-xs text-text-tertiary">TaxPilot is thinking…</p>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
