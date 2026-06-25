import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  isLast?: boolean;
}

export default function MessageBubble({ role, content, isLast }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 px-1 py-1",
        isUser ? "flex-row-reverse" : "flex-row",
        isLast && "animate-slide-up"
      )}
    >
      {/* Avatar */}
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg viewBox="0 0 12 12" fill="none" className="w-3.5 h-3.5">
            <path d="M6 1L2 3.5v3c0 2 1.5 3.5 4 3.5s4-1.5 4-3.5v-3L6 1z" fill="#7C5CFF" fillOpacity="0.8" />
          </svg>
        </div>
      )}

      {/* Bubble */}
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-4 py-3",
          "text-sm leading-relaxed",
          isUser
            ? "bg-accent text-white rounded-tr-sm"
            : "bg-bg-elevated border border-border text-text-secondary rounded-tl-sm"
        )}
      >
        {content}
      </div>
    </div>
  );
}
