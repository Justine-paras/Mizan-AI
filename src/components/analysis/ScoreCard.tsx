import { cn } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

interface ScoreCardProps {
  score: number;
  risk: "low" | "medium" | "high";
  issueCount: number;
}

const riskConfig = {
  low:    { label: "Low risk",    badge: "success" as const, color: "#22C55E", track: "#22C55E26" },
  medium: { label: "Medium risk", badge: "warning" as const, color: "#F59E0B", track: "#F59E0B26" },
  high:   { label: "High risk",   badge: "critical" as const, color: "#EF4444", track: "#EF444426" },
};

function ScoreRing({ score, color }: { score: number; color: string }) {
  const size = 140;
  const strokeWidth = 7;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse ring behind */}
      <div
        className="absolute rounded-full animate-pulse-ring"
        style={{
          width: size + 16,
          height: size + 16,
          background: `radial-gradient(circle, ${color}14 0%, transparent 70%)`,
        }}
      />

      <svg width={size} height={size} className="rotate-[-90deg]">
        {/* Track */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Arc */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 1s cubic-bezier(0.34,1.56,0.64,1)" }}
        />
      </svg>

      {/* Score text */}
      <div className="absolute flex flex-col items-center">
        <span
          className="text-4xl font-semibold tracking-tight tabular-nums"
          style={{ color }}
        >
          {score}
        </span>
        <span className="text-2xs text-text-tertiary mt-0.5 uppercase tracking-widest">
          score
        </span>
      </div>
    </div>
  );
}

export default function ScoreCard({ score, risk, issueCount }: ScoreCardProps) {
  const cfg = riskConfig[risk];

  return (
    <div className="card flex flex-col items-center text-center py-8 px-6 gap-5">
      <ScoreRing score={score} color={cfg.color} />

      <div>
        <Badge label={cfg.label} variant={cfg.badge} dot />
        <p className="text-xs text-text-tertiary mt-3 leading-relaxed">
          {issueCount} issue{issueCount !== 1 ? "s" : ""} found across your documents
        </p>
      </div>

      {/* Score guide */}
      <div className="w-full border-t border-border pt-4 space-y-2">
        {[
          { label: "85–100", desc: "Compliant",    color: "#22C55E" },
          { label: "60–84",  desc: "Minor gaps",   color: "#F59E0B" },
          { label: "0–59",   desc: "Action needed", color: "#EF4444" },
        ].map(({ label, desc, color }) => (
          <div key={label} className="flex items-center justify-between">
            <span
              className="text-2xs font-mono tabular-nums"
              style={{ color }}
            >
              {label}
            </span>
            <span className="text-2xs text-text-tertiary">{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
