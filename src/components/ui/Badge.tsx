import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "accent" | "success" | "warning" | "critical" | "outline";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default:  "bg-white/5 text-text-secondary border-transparent",
  accent:   "bg-accent/10 text-accent border-accent/20",
  success:  "bg-success/10 text-success border-success/20",
  warning:  "bg-warning/10 text-warning border-warning/20",
  critical: "bg-critical/10 text-critical border-critical/20",
  outline:  "bg-transparent text-text-secondary border-border-strong",
};

const dotStyles: Record<BadgeVariant, string> = {
  default:  "bg-text-disabled",
  accent:   "bg-accent",
  success:  "bg-success",
  warning:  "bg-warning",
  critical: "bg-critical",
  outline:  "bg-text-tertiary",
};

export default function Badge({
  label,
  variant = "default",
  dot = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5",
        "text-xs font-medium tracking-wide",
        "px-2 py-0.5 rounded-[5px] border",
        "whitespace-nowrap",
        variantStyles[variant],
        className
      )}
    >
      {dot && (
        <span
          className={cn("w-1.5 h-1.5 rounded-full flex-shrink-0", dotStyles[variant])}
        />
      )}
      {label}
    </span>
  );
}
