import { memo, useMemo, useState } from "react";
import { FlatDataRow } from "@/data/flatData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Search, ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TrendSparkline, TrendArrow } from "./TrendSparkline";

interface TrendTableProps {
  rows: FlatDataRow[];
}

type SortField =
  | "Municipality"
  | "Cluster"
  | "Rate_2023"
  | "Rate_2024"
  | "Rate_2025"
  | "Cumulative_Change_Pct"
  | "abs_change"
  | "Gap_from_Cluster_Pct"
  | "abs_gap";

type SortDir = "asc" | "desc";

function formatRate(v: number | null): string {
  if (v === null) return "—";
  return v.toFixed(1);
}

function formatChange(v: number | null): string {
  if (v === null) return "—";
  return (v > 0 ? "+" : "") + v.toFixed(1) + "%";
}

/** Color class for Cumulative_Change_Pct */
function changeColorClass(v: number | null): string {
  if (v === null) return "text-muted-foreground";
  if (v > 15) return "text-red-800 dark:text-red-400 font-bold";
  if (v > 5) return "text-orange-600 dark:text-orange-400 font-semibold";
  if (v < -15) return "text-blue-800 dark:text-blue-400 font-bold";
  if (v < -5) return "text-blue-600 dark:text-blue-300 font-semibold";
  return "text-muted-foreground";
}

/** Operational status display with color */
function statusDisplay(row: FlatDataRow): { label: string; colorClass: string } {
  if (row.Small_Pop_Flag || row.Gap_from_Cluster_Pct === null) {
    return { label: "⚪ מדגם קטן / ללא סיווג", colorClass: "text-muted-foreground" };
  }
  const status = row.Operational_Status?.trim() || "";
  if (status.includes("גבוה")) return { label: "🔴 גבוה מהאשכול", colorClass: "text-red-600 dark:text-red-400" };
  if (status.includes("נמוך")) return { label: "🔵 נמוך מהאשכול", colorClass: "text-blue-600 dark:text-blue-300" };
  return { label: "⚪ תואם אשכול", colorClass: "text-muted-foreground" };
}

/** Whether a row should receive emphasis highlighting */
function isEmphasized(row: FlatDataRow): boolean {
  if (row.Small_Pop_Flag) return false;
  const gapHigh = row.Gap_from_Cluster_Pct !== null && Math.abs(row.Gap_from_Cluster_Pct) > 15;
  const zHigh = row.Z_Score_Cluster !== null && Math.abs(row.Z_Score_Cluster) > 2;
  return gapHigh || zHigh;
}

function SortIcon({
  field,
  current,
  dir,
}: {
  field: SortField;
  current: SortField;
  dir: SortDir;
}) {
  if (field !== current)
    return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50 inline mr-1" />;
  return dir === "asc" ? (
    <ChevronUp className="h-3 w-3 text-primary inline mr-1" />
  ) : (
    <ChevronDown className="h-3 w-3 text-primary inline mr-1" />
  );
}

export const TrendTable = memo(function TrendTable({ rows }: TrendTableProps) {
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("abs_gap");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "Municipality" || field === "Cluster" ? "asc" : "desc");
    }
  };

  const displayed = useMemo(() => {
    const term = search.trim();
    const filtered = term
      ? rows.filter((r) => r.Municipality.includes(term))
      : rows;

    return [...filtered].sort((a, b) => {
      let av: string | number | null;
      let bv: string | number | null;
      switch (sortField) {
        case "Municipality":
          av = a.Municipality; bv = b.Municipality; break;
        case "Cluster":
          av = a.Cluster; bv = b.Cluster; break;
        case "Rate_2023":
          av = a.Rate_2023; bv = b.Rate_2023; break;
        case "Rate_2024":
          av = a.Rate_2024; bv = b.Rate_2024; break;
        case "Rate_2025":
          av = a.Rate_2025; bv = b.Rate_2025; break;
        case "Cumulative_Change_Pct":
          av = a.Cumulative_Change_Pct; bv = b.Cumulative_Change_Pct; break;
        case "abs_change":
          av = a.Cumulative_Change_Pct !== null ? Math.abs(a.Cumulative_Change_Pct) : null;
          bv = b.Cumulative_Change_Pct !== null ? Math.abs(b.Cumulative_Change_Pct) : null;
          break;
        case "Gap_from_Cluster_Pct":
          av = a.Gap_from_Cluster_Pct; bv = b.Gap_from_Cluster_Pct; break;
        case "abs_gap":
          av = a.Gap_from_Cluster_Pct !== null ? Math.abs(a.Gap_from_Cluster_Pct) : null;
          bv = b.Gap_from_Cluster_Pct !== null ? Math.abs(b.Gap_from_Cluster_Pct) : null;
          break;
        default:
          return 0;
      }
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;

      if (typeof av === "string") {
        const cmp = (av as string).localeCompare(bv as string, "he");
        return sortDir === "asc" ? cmp : -cmp;
      }
      const cmp = (av as number) - (bv as number);
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [rows, search, sortField, sortDir]);

  const SH = ({ field, label }: { field: SortField; label: string }) => (
    <Button
      variant="ghost"
      size="sm"
      className="h-8 p-0 hover:bg-transparent text-xs whitespace-nowrap"
      onClick={() => handleSort(field)}
    >
      {label}
      <SortIcon field={field} current={sortField} dir={sortDir} />
    </Button>
  );

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative max-w-xs">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="חיפוש יישוב..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pr-10"
        />
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50 hover:bg-muted/50">
                <TableHead className="text-right sticky right-0 bg-muted/50 z-10 min-w-[120px]">
                  <SH field="Municipality" label="יישוב" />
                </TableHead>
                <TableHead className="text-right">
                  <SH field="Cluster" label="אשכול" />
                </TableHead>
                <TableHead className="text-right">
                  <SH field="Rate_2025" label="שיעור 2025" />
                </TableHead>
                <TableHead className="text-right">
                  <SH field="Gap_from_Cluster_Pct" label="פער מאשכול %" />
                </TableHead>
                <TableHead className="text-right">
                  <SH field="Cumulative_Change_Pct" label="שינוי מצטבר %" />
                </TableHead>
                <TableHead className="text-right min-w-[110px]">מגמה</TableHead>
                <TableHead className="text-right min-w-[140px]">סטטוס תפעולי</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.map((row, idx) => {
                const emphasized = isEmphasized(row);
                const { label: sLabel, colorClass: sColor } = statusDisplay(row);
                return (
                  <TableRow
                    key={`${row.Municipality}-${row.Benefit_Type}-${idx}`}
                    className={cn(
                      emphasized
                        ? "bg-amber-50/60 dark:bg-amber-950/20 hover:bg-amber-100/60 dark:hover:bg-amber-950/30"
                        : idx % 2 === 0
                        ? "bg-background"
                        : "bg-muted/30"
                    )}
                  >
                    <TableCell className={cn("py-2 font-medium sticky right-0 z-10", emphasized ? "bg-amber-50/60 dark:bg-amber-950/20" : idx % 2 === 0 ? "bg-background" : "bg-muted/30")}>
                      {emphasized && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 mb-0.5" />
                      )}
                      {row.Municipality}
                    </TableCell>
                    <TableCell className="py-2 text-muted-foreground text-sm">
                      {row.Cluster !== null ? row.Cluster : "ללא סיווג"}
                    </TableCell>
                    <TableCell className="py-2 text-sm font-semibold tabular-nums">
                      {formatRate(row.Rate_2025)}
                    </TableCell>
                    <TableCell className={cn("py-2 text-sm tabular-nums font-semibold", changeColorClass(row.Gap_from_Cluster_Pct))}>
                      {formatChange(row.Gap_from_Cluster_Pct)}
                    </TableCell>
                    <TableCell className={cn("py-2 text-sm tabular-nums", changeColorClass(row.Cumulative_Change_Pct))}>
                      {formatChange(row.Cumulative_Change_Pct)}
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-2">
                        <TrendSparkline
                          values={[row.Rate_2023, row.Rate_2024, row.Rate_2025]}
                          change={row.Cumulative_Change_Pct}
                        />
                        <TrendArrow change={row.Cumulative_Change_Pct} />
                      </div>
                    </TableCell>
                    <TableCell className={cn("py-2 text-sm", sColor)}>
                      {sLabel}
                    </TableCell>
                  </TableRow>
                );
              })}
              {displayed.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    לא נמצאו רשויות
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-left">
        מציג {displayed.length} רשויות
      </p>
    </div>
  );
});
