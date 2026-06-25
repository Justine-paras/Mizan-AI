import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0–100
  label?: string;
  variant?: "default" | "success" | "warning" | "critical";
  showValue?: boolean;
  className?: string;
}

const trackColors = {
  default:  "bg-accent",
  success:  "bg-success",
  warning:  "bg-warning",
  critical: "bg-critical",
};

export default function ProgressBar({
  value,
  label,
  variant = "default",
  showValue = false,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-text-secondary">{label}</span>}
          {showValue && (
            <span className="text-xs text-text-tertiary tabular-nums">{clamped}%</span>
          )}
        </div>
      )}
      <div
        className="w-full h-1 bg-white/6 rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            trackColors[variant]
          )}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
