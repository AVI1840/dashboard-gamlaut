import { cn } from "@/lib/utils";
import { getGapSeverity } from "@/data/welfareData";

interface GapBadgeProps {
  gapPercentage: number;
  showValue?: boolean;
  size?: "sm" | "md" | "lg";
}

export function GapBadge({
  gapPercentage,
  showValue = true,
  size = "md",
}: GapBadgeProps) {
  const severity = getGapSeverity(Math.abs(gapPercentage));
  const isPositive = gapPercentage > 0;

  const sizeStyles = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-1 text-sm",
    lg: "px-3 py-1.5 text-base",
  };

  const severityStyles = {
    high: isPositive
      ? "bg-destructive/10 text-destructive border-destructive/20"
      : "bg-success/10 text-success border-success/20",
    medium: isPositive
      ? "bg-warning/10 text-warning border-warning/20"
      : "bg-success/10 text-success border-success/20",
    low: "bg-success/10 text-success border-success/20",
  };

  const labels = {
    high: isPositive ? "פער גבוה" : "מתחת לממוצע",
    medium: isPositive ? "פער בינוני" : "קרוב לממוצע",
    low: "פער נמוך",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        sizeStyles[size],
        severityStyles[severity]
      )}
    >
      {showValue && (
        <span className="font-semibold">
          {gapPercentage > 0 ? "+" : ""}
          {gapPercentage.toFixed(1)}%
        </span>
      )}
      <span className="text-current/70">{labels[severity]}</span>
    </span>
  );
}
