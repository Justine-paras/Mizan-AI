import Badge from "@/components/ui/Badge";

type Risk = "low" | "medium" | "high";

interface RiskBadgeProps {
  risk: Risk;
  dot?: boolean;
}

const riskVariants: Record<Risk, { label: string; variant: "success" | "warning" | "critical" }> = {
  low:    { label: "Low risk",    variant: "success"  },
  medium: { label: "Medium risk", variant: "warning"  },
  high:   { label: "High risk",   variant: "critical" },
};

export default function RiskBadge({ risk, dot = true }: RiskBadgeProps) {
  const { label, variant } = riskVariants[risk];
  return <Badge label={label} variant={variant} dot={dot} />;
}
