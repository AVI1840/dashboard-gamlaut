import { memo } from "react";
import { FlatDataRow } from "@/data/flatData";
import { TrendArrow } from "./TrendSparkline";
import { cn } from "@/lib/utils";

interface ExtremeShiftsWidgetProps {
  increases: FlatDataRow[];
  decreases: FlatDataRow[];
}

function ShiftRow({ row, type }: { row: FlatDataRow; type: "up" | "down" }) {
  const change = row.Cumulative_Change_Pct;
  const changeStr =
    change !== null
      ? (change > 0 ? "+" : "") + change.toFixed(1) + "%"
      : "—";

  return (
    <div className="flex items-center justify-between py-2 border-b last:border-0">
      <div className="flex items-center gap-2">
        <TrendArrow change={change} />
        <span className="font-medium text-sm">{row.Municipality}</span>
        {row.Cluster !== null && (
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
            אשכול {row.Cluster}
          </span>
        )}
      </div>
      <span
        className={cn(
          "font-bold text-sm tabular-nums",
          type === "up" ? "text-gap-high" : "text-primary"
        )}
      >
        {changeStr}
      </span>
    </div>
  );
}

export const ExtremeShiftsWidget = memo(function ExtremeShiftsWidget({
  increases,
  decreases,
}: ExtremeShiftsWidgetProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Top increases */}
      <div className="dashboard-card p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-lg bg-destructive/10 flex items-center justify-center">
            <span className="text-gap-high font-bold text-sm">↑</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">עליות חריגות</h3>
            <p className="text-xs text-muted-foreground">שינוי מצטבר גבוה ביותר</p>
          </div>
        </div>
        <div>
          {increases.length === 0 && (
            <p className="text-sm text-muted-foreground">אין נתונים</p>
          )}
          {increases.map((row, i) => (
            <ShiftRow key={`inc-${i}`} row={row} type="up" />
          ))}
        </div>
      </div>

      {/* Top decreases */}
      <div className="dashboard-card p-5">
        <div className="flex items-center gap-2 mb-3">
      <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary font-bold text-sm">↓</span>
          </div>
          <div>
            <h3 className="font-semibold text-sm">ירידות חריגות</h3>
            <p className="text-xs text-muted-foreground">שינוי מצטבר נמוך ביותר</p>
          </div>
        </div>
        <div>
          {decreases.length === 0 && (
            <p className="text-sm text-muted-foreground">אין נתונים</p>
          )}
          {decreases.map((row, i) => (
            <ShiftRow key={`dec-${i}`} row={row} type="down" />
          ))}
        </div>
      </div>
    </div>
  );
});
