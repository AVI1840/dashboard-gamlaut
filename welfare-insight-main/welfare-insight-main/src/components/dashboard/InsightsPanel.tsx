import { useMemo } from "react";
import { FlatDataRow } from "@/data/flatData";
import { TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface InsightsPanelProps {
  rows: FlatDataRow[];
}

interface InsightItem {
  icon: React.ReactNode;
  text: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
}

export function InsightsPanel({ rows }: InsightsPanelProps) {
  const insights = useMemo<InsightItem[]>(() => {
    // Filter out small-pop rows for insights
    const valid = rows.filter((r) => !r.Small_Pop_Flag);
    const withGap = valid.filter((r) => r.Gap_from_Cluster_Pct !== null);
    const withChange = valid.filter((r) => r.Cumulative_Change_Pct !== null);

    if (withGap.length === 0 && withChange.length === 0) return [];

    const result: InsightItem[] = [];

    // 1. Largest positive gap from cluster
    if (withGap.length > 0) {
      const top = withGap.reduce((a, b) =>
        (b.Gap_from_Cluster_Pct ?? -Infinity) > (a.Gap_from_Cluster_Pct ?? -Infinity) ? b : a
      );
      const val = top.Gap_from_Cluster_Pct!;
      if (val > 0) {
        result.push({
          icon: <TrendingUp className="h-4 w-4 flex-shrink-0" />,
          text: `הפער הגבוה ביותר מהאשכול: ${top.Municipality} (+${val.toFixed(1)}%)`,
          colorClass: "text-red-700 dark:text-red-400",
          bgClass: "bg-red-50 dark:bg-red-950/30",
          borderClass: "border-red-200 dark:border-red-800",
        });
      }
    }

    // 2. Largest negative gap from cluster
    if (withGap.length > 0) {
      const bottom = withGap.reduce((a, b) =>
        (b.Gap_from_Cluster_Pct ?? Infinity) < (a.Gap_from_Cluster_Pct ?? Infinity) ? b : a
      );
      const val = bottom.Gap_from_Cluster_Pct!;
      if (val < 0) {
        result.push({
          icon: <TrendingDown className="h-4 w-4 flex-shrink-0" />,
          text: `הנמוך ביותר מהאשכול: ${bottom.Municipality} (${val.toFixed(1)}%)`,
          colorClass: "text-blue-700 dark:text-blue-400",
          bgClass: "bg-blue-50 dark:bg-blue-950/30",
          borderClass: "border-blue-200 dark:border-blue-800",
        });
      }
    }

    // 3. Fastest 3-year change
    if (withChange.length > 0) {
      const fastest = withChange.reduce((a, b) =>
        Math.abs(b.Cumulative_Change_Pct ?? 0) > Math.abs(a.Cumulative_Change_Pct ?? 0) ? b : a
      );
      const val = fastest.Cumulative_Change_Pct!;
      result.push({
        icon: <AlertTriangle className="h-4 w-4 flex-shrink-0" />,
        text: `השינוי המצטבר הגדול ביותר: ${fastest.Municipality} (${val > 0 ? "+" : ""}${val.toFixed(1)}%)`,
        colorClass: "text-amber-700 dark:text-amber-400",
        bgClass: "bg-amber-50 dark:bg-amber-950/30",
        borderClass: "border-amber-200 dark:border-amber-800",
      });
    }

    return result;
  }, [rows]);

  if (insights.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        תובנות אוטומטיות
      </p>
      <div className="grid gap-2 sm:grid-cols-3">
        {insights.map((item, i) => (
          <div
            key={i}
            className={`flex items-start gap-2.5 rounded-lg border px-3 py-2.5 text-sm font-medium leading-snug ${item.bgClass} ${item.borderClass} ${item.colorClass}`}
          >
            {item.icon}
            <span className="text-right">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
