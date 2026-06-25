"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn(
        "flex items-end gap-3 p-3",
        "bg-bg-surface border border-border rounded-xl",
        "focus-within:border-accent/40 transition-colors duration-200"
      )}
    >
      <textarea
        ref={textareaRef}
        rows={1}
        value={value}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder="Ask about your VAT return, invoices, or FTA rules…"
        className={cn(
          "flex-1 resize-none bg-transparent outline-none",
          "text-sm text-text-primary placeholder:text-text-disabled",
          "py-1.5 px-1 leading-relaxed",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "max-h-[140px] overflow-y-auto"
        )}
      />

      <button
        type="submit"
        disabled={disabled || !value.trim()}
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center",
          "transition-all duration-150",
          value.trim() && !disabled
            ? "bg-accent text-white hover:bg-[#6B4EE8] active:scale-95"
            : "bg-bg-elevated text-text-disabled cursor-not-allowed"
        )}
        aria-label="Send message"
      >
        <svg viewBox="0 0 16 16" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 8h12M8 3l5 5-5 5" />
        </svg>
      </button>
    </form>
  );
}
