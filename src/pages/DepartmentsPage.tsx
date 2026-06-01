import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, TrendingUp, Eye, Users } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { loadFlatData, FlatDataRow, getBranches } from "@/data/flatData";
import { benefitTypes, formatNumber } from "@/data/welfareData";
import { getVisitSummary, trackVisit } from "@/data/visitTracker";
import { useBranchFilter } from "@/context/BranchFilterContext";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const benefitIdToCsvType: Record<string, string> = {
  "old-age": "זקנה",
  disability: "נכות",
  nursing: "סיעוד",
  "income-support": "הבטחת_הכנסה",
  unemployment: "אבטלה",
  "child-support": "ילדים",
  "disabled-child": "ילד_נכה",
  mobility: "ניידות",
  alimony: "מזונות",
  "work-disability": "נכות_מעבודה",
  "work-injury": "דמי_פגיעה",
};

interface DepartmentSummary {
  benefitType: string;
  benefitName: string;
  benefitIcon: string;
  benefitId: string;
  totalRecipients: number;
  avgRate: number;
  avgGap: number;
  criticalMunis: number; // municipalities with |gap| > 30%
  topGapMuni: string;
  topGapValue: number;
  topGapBranch: string;
  bottomGapMuni: string;
  bottomGapValue: number;
}

export default function DepartmentsPage() {
  const [allRows, setAllRows] = useState<FlatDataRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedBranch } = useBranchFilter();
  const [visitSummary, setVisitSummary] = useState(getVisitSummary());
  const [expandedDept, setExpandedDept] = useState<string | null>(null);
  const [gapDirection, setGapDirection] = useState<"top" | "bottom">("top");

  useEffect(() => {
    trackVisit(selectedBranch, "/departments");
    setVisitSummary(getVisitSummary());
  }, [selectedBranch]);

  useEffect(() => {
    loadFlatData().then((rows) => {
      setAllRows(rows);
      setLoading(false);
    });
  }, []);

  const departments = useMemo((): DepartmentSummary[] => {
    if (!allRows.length) return [];

    const rows = selectedBranch
      ? allRows.filter((r) => r.Branch === selectedBranch)
      : allRows;

    return benefitTypes.map((bt) => {
      const csvType = benefitIdToCsvType[bt.id];
      const btRows = rows.filter((r) => r.Benefit_Type === csvType);

      // Total recipients (rate * pop / 1000)
      let totalRecipients = 0;
      const rateRows = btRows.filter((r) => r.Rate_2025 !== null && r.Pop_2025 !== null);
      for (const r of rateRows) {
        totalRecipients += Math.round((r.Rate_2025! * (r.Pop_2025 ?? 0)) / 1000);
      }

      // Average rate
      const avgRate = rateRows.length > 0
        ? rateRows.reduce((s, r) => s + r.Rate_2025!, 0) / rateRows.length / 10
        : 0;

      // Gap analysis
      const gapRows = btRows.filter((r) => r.Gap_from_Cluster_Pct !== null);
      const avgGap = gapRows.length > 0
        ? gapRows.reduce((s, r) => s + Math.abs(r.Gap_from_Cluster_Pct!), 0) / gapRows.length
        : 0;

      // Critical municipalities (|gap| > 30%)
      const criticalMunis = new Set(
        gapRows.filter((r) => Math.abs(r.Gap_from_Cluster_Pct!) > 30).map((r) => r.Municipality)
      ).size;

      // Top gap (highest positive = above cluster average)
      let topGapMuni = "";
      let topGapValue = 0;
      let topGapBranch = "";
      for (const r of gapRows) {
        if (r.Gap_from_Cluster_Pct! > topGapValue) {
          topGapValue = r.Gap_from_Cluster_Pct!;
          topGapMuni = r.Municipality;
          topGapBranch = r.Branch;
        }
      }

      // Bottom gap (lowest negative = below cluster average)
      let bottomGapMuni = "";
      let bottomGapValue = 0;
      for (const r of gapRows) {
        if (r.Gap_from_Cluster_Pct! < bottomGapValue) {
          bottomGapValue = r.Gap_from_Cluster_Pct!;
          bottomGapMuni = r.Municipality;
        }
      }

      return {
        benefitType: csvType,
        benefitName: bt.name,
        benefitIcon: bt.icon,
        benefitId: bt.id,
        totalRecipients,
        avgRate,
        avgGap,
        criticalMunis,
        topGapMuni,
        topGapValue,
        topGapBranch,
        bottomGapMuni,
        bottomGapValue,
      };
    }).sort((a, b) => b.avgGap - a.avgGap);
  }, [allRows, selectedBranch]);

  const totalCritical = departments.reduce((s, d) => s + d.criticalMunis, 0);
  const overallAvgGap = departments.length > 0
    ? departments.reduce((s, d) => s + d.avgGap, 0) / departments.length
    : 0;
  const worstDept = departments[0];

  // Top/Bottom 10 gaps for expanded department
  const topBottomGaps = useMemo(() => {
    if (!expandedDept || !allRows.length) return [];
    const rows = selectedBranch
      ? allRows.filter((r) => r.Branch === selectedBranch)
      : allRows;
    const btRows = rows.filter((r) => r.Benefit_Type === expandedDept && r.Gap_from_Cluster_Pct !== null);
    
    const sorted = [...btRows].sort((a, b) => {
      if (gapDirection === "top") return (b.Gap_from_Cluster_Pct ?? 0) - (a.Gap_from_Cluster_Pct ?? 0);
      return (a.Gap_from_Cluster_Pct ?? 0) - (b.Gap_from_Cluster_Pct ?? 0);
    });
    
    return sorted.slice(0, 10).map((r) => ({
      name: r.Municipality,
      branch: r.Branch,
      cluster: r.Cluster,
      pop: r.Pop_2025 ?? 0,
      rate: (r.Rate_2025 ?? 0) / 10,
      gap: r.Gap_from_Cluster_Pct ?? 0,
      status: r.Operational_Status,
    }));
  }, [allRows, expandedDept, gapDirection, selectedBranch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <span className="animate-pulse">טוען נתונים...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">סקירה כללית</Link>
          <span>/</span>
          <span className="text-foreground">מבט אגפי</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">מבט אגפי — פערים לפי סוג גמלה</h1>
        <p className="text-muted-foreground mt-1">
          {selectedBranch
            ? `סניף ${selectedBranch} — איפה הפערים הגדולים בכל אגף`
            : "כל הסניפים — איפה הפערים הגדולים בכל אגף והיכן דרוש תיקון"}
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="אגפים בניתוח"
          value={departments.length}
          subtitle="סוגי גמלאות"
          icon={Users}
          variant="primary"
        />
        <KPICard
          title="ממוצע פער כולל"
          value={`${overallAvgGap.toFixed(1)}%`}
          subtitle="ערך מוחלט ממוצע מאשכול"
          icon={TrendingUp}
          variant="warning"
        />
        <KPICard
          title="רשויות קריטיות"
          value={totalCritical}
          subtitle="פער מעל 30% (כל האגפים)"
          icon={AlertTriangle}
          variant="destructive"
        />
        <KPICard
          title="כניסות החודש"
          value={visitSummary.currentMonth.total}
          subtitle={`סה״כ: ${visitSummary.allTime.total}`}
          icon={Eye}
          variant="success"
        />
      </div>

      {/* Department cards */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {departments.map((dept) => (
          <Link
            key={dept.benefitId}
            to={`/benefit/${dept.benefitId}`}
            className="dashboard-card p-5 space-y-4 hover:border-primary/30 hover:-translate-y-0.5 transition-all"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{dept.benefitIcon}</span>
                <div>
                  <h3 className="font-semibold text-foreground">{dept.benefitName}</h3>
                  <p className="text-xs text-muted-foreground">
                    {formatNumber(dept.totalRecipients)} מקבלים • ממוצע {dept.avgRate.toFixed(1)}%
                  </p>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-bold",
                dept.avgGap > 25 ? "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400" :
                dept.avgGap > 15 ? "bg-orange-100 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400" :
                "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400"
              )}>
                {dept.avgGap.toFixed(1)}%
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t">
              <div>
                <p className="text-xs text-muted-foreground">רשויות קריטיות</p>
                <p className={cn(
                  "text-lg font-bold",
                  dept.criticalMunis > 5 ? "text-red-600" : dept.criticalMunis > 0 ? "text-orange-600" : "text-green-600"
                )}>
                  {dept.criticalMunis}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">פער מקסימלי</p>
                <p className="text-lg font-bold text-red-600">
                  {dept.topGapValue.toFixed(0)}%
                </p>
              </div>
            </div>

            {/* Worst municipality */}
            {dept.topGapMuni && (
              <div className="bg-red-50 dark:bg-red-950/20 rounded-lg p-3 border border-red-200 dark:border-red-900/40">
                <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">⚠️ דורש תיקון</p>
                <p className="text-sm font-semibold text-red-800 dark:text-red-300">
                  {dept.topGapMuni}
                  {dept.topGapBranch && <span className="text-xs font-normal text-red-500 mr-1">({dept.topGapBranch})</span>}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  פער +{dept.topGapValue.toFixed(1)}% מממוצע האשכול
                </p>
              </div>
            )}
          </Link>
        ))}
      </div>

      {/* Summary table */}
      <div className="dashboard-card p-6">
        <h2 className="text-lg font-semibold mb-4">סיכום — כל האגפים</h2>
        <div className="rounded-lg border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-right min-w-[50px]">#</TableHead>
                  <TableHead className="text-right min-w-[130px]">אגף (גמלה)</TableHead>
                  <TableHead className="text-right">מקבלים</TableHead>
                  <TableHead className="text-right">ממוצע שיעור</TableHead>
                  <TableHead className="text-right font-bold text-destructive">ממוצע פער</TableHead>
                  <TableHead className="text-right">קריטיות</TableHead>
                  <TableHead className="text-right min-w-[120px]">רשות עם פער מקסימלי ↑</TableHead>
                  <TableHead className="text-right min-w-[120px]">רשות עם פער מינימלי ↓</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {departments.map((dept, idx) => (
                  <TableRow
                    key={dept.benefitId}
                    className={cn(
                      idx % 2 === 0 ? "bg-background" : "bg-muted/30",
                      dept.avgGap > 25 && "bg-red-50/50 dark:bg-red-950/10"
                    )}
                  >
                    <TableCell className="py-2 text-sm text-muted-foreground font-mono">{idx + 1}</TableCell>
                    <TableCell className="py-2 font-medium">
                      <Link to={`/benefit/${dept.benefitId}`} className="hover:text-primary transition-colors">
                        {dept.benefitIcon} {dept.benefitName}
                      </Link>
                    </TableCell>
                    <TableCell className="py-2 text-sm tabular-nums">{formatNumber(dept.totalRecipients)}</TableCell>
                    <TableCell className="py-2 text-sm">{dept.avgRate.toFixed(1)}%</TableCell>
                    <TableCell className="py-2">
                      <span className={cn(
                        "font-bold",
                        dept.avgGap > 25 ? "text-red-600" : dept.avgGap > 15 ? "text-orange-600" : "text-green-600"
                      )}>
                        {dept.avgGap.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="py-2">
                      {dept.criticalMunis > 0 ? (
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-red-600">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          {dept.criticalMunis}
                        </span>
                      ) : (
                        <span className="text-sm text-green-600">✓</span>
                      )}
                    </TableCell>
                    <TableCell className="py-2 text-sm">
                      <span className="text-red-600 font-medium">{dept.topGapMuni}</span>
                      <span className="text-xs text-red-400 mr-1">(+{dept.topGapValue.toFixed(0)}%)</span>
                    </TableCell>
                    <TableCell className="py-2 text-sm">
                      <span className="text-blue-600 font-medium">{dept.bottomGapMuni}</span>
                      <span className="text-xs text-blue-400 mr-1">({dept.bottomGapValue.toFixed(0)}%)</span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Top/Bottom 10 Gaps per Department */}
      <div className="dashboard-card p-6">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <h2 className="text-lg font-semibold">10 רשויות עם הפער הגדול/הקטן ביותר</h2>
          <div className="flex items-center gap-3">
            <Select value={expandedDept || "__none__"} onValueChange={(v) => setExpandedDept(v === "__none__" ? null : v)}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder="בחר גמלה..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">בחר גמלה...</SelectItem>
                {benefitTypes.map((bt) => (
                  <SelectItem key={bt.id} value={benefitIdToCsvType[bt.id]}>
                    {bt.icon} {bt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Tabs value={gapDirection} onValueChange={(v) => setGapDirection(v as "top" | "bottom")}>
              <TabsList className="h-9">
                <TabsTrigger value="top" className="text-xs">⬆️ למעלה</TabsTrigger>
                <TabsTrigger value="bottom" className="text-xs">⬇️ למטה</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {!expandedDept && (
          <p className="text-sm text-muted-foreground text-center py-8">בחר סוג גמלה כדי לראות את 10 הרשויות עם הפער הגדול/הקטן ביותר</p>
        )}

        {expandedDept && topBottomGaps.length > 0 && (
          <div className="rounded-lg border bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="text-right w-10">#</TableHead>
                  <TableHead className="text-right min-w-[120px]">רשות</TableHead>
                  <TableHead className="text-right">סניף</TableHead>
                  <TableHead className="text-right">אשכול</TableHead>
                  <TableHead className="text-right">אוכלוסייה</TableHead>
                  <TableHead className="text-right">שיעור</TableHead>
                  <TableHead className="text-right font-bold">פער מאשכול</TableHead>
                  <TableHead className="text-right">סטטוס</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topBottomGaps.map((row, idx) => (
                  <TableRow key={row.name + idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/30"}>
                    <TableCell className="py-2 text-sm text-muted-foreground font-mono">{idx + 1}</TableCell>
                    <TableCell className="py-2 font-medium">{row.name}</TableCell>
                    <TableCell className="py-2 text-sm text-muted-foreground">{row.branch}</TableCell>
                    <TableCell className="py-2 text-sm">{row.cluster ?? "—"}</TableCell>
                    <TableCell className="py-2 text-sm tabular-nums">{formatNumber(row.pop)}</TableCell>
                    <TableCell className="py-2 text-sm">{row.rate.toFixed(1)}%</TableCell>
                    <TableCell className="py-2">
                      <span className={cn(
                        "font-bold",
                        row.gap > 20 ? "text-red-600" : row.gap > 0 ? "text-orange-500" : "text-blue-600"
                      )}>
                        {row.gap > 0 ? "+" : ""}{row.gap.toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell className="py-2 text-xs">{row.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Visit stats by branch */}
      <div className="dashboard-card p-6">
        <h2 className="text-lg font-semibold mb-4">כניסות החודש לפי אזור</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(visitSummary.currentMonth.byBranch)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 9)
            .map(([branch, count]) => (
              <div key={branch} className="flex items-center justify-between p-3 rounded-lg border bg-muted/30">
                <span className="text-sm font-medium">{branch === "all" ? "כל הסניפים" : branch}</span>
                <span className="text-sm font-bold text-primary">{count}</span>
              </div>
            ))}
          {Object.keys(visitSummary.currentMonth.byBranch).length === 0 && (
            <p className="text-sm text-muted-foreground col-span-full text-center py-4">
              אין נתוני כניסות עדיין החודש
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
