import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, Users, BarChart3, AlertTriangle, ArrowUpDown, ChevronUp, ChevronDown, TrendingUp, TrendingDown, Check, ChevronsUpDown } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { loadFlatData, FlatDataRow, getBranches } from "@/data/flatData";
import { useBranchFilter } from "@/context/BranchFilterContext";
import { benefitTypes, formatNumber } from "@/data/welfareData";

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

const allCsvTypes = Object.values(benefitIdToCsvType);

function csvTypeToLabel(csvType: string): string {
  const bt = benefitTypes.find((b) => benefitIdToCsvType[b.id] === csvType);
  return bt ? bt.name : csvType;
}
function csvTypeToIcon(csvType: string): string {
  const bt = benefitTypes.find((b) => benefitIdToCsvType[b.id] === csvType);
  return bt ? bt.icon : "";
}


interface BranchStats {
  branch: string;
  totalPop: number;
  muniCount: number;
  avgCluster: number;
  benefitAverages: Record<string, number>;
}

function computeBranchStats(rows: FlatDataRow[], branch: string): BranchStats {
  const branchRows = rows.filter((r) => r.Branch === branch);
  const munis = new Map<string, { pop: number; cluster: number | null }>();
  for (const r of branchRows) {
    if (!munis.has(r.Municipality)) {
      munis.set(r.Municipality, { pop: r.Pop_2025 ?? 0, cluster: r.Cluster });
    }
  }
  const totalPop = Array.from(munis.values()).reduce((s, m) => s + m.pop, 0);
  const clusters = Array.from(munis.values()).filter((m) => m.cluster !== null).map((m) => m.cluster!);
  const avgCluster = clusters.length > 0 ? clusters.reduce((s, c) => s + c, 0) / clusters.length : 0;
  const benefitAverages: Record<string, number> = {};
  for (const bt of allCsvTypes) {
    const btRows = branchRows.filter((r) => r.Benefit_Type === bt && r.Rate_2025 !== null);
    if (btRows.length > 0) {
      benefitAverages[bt] = btRows.reduce((s, r) => s + (r.Rate_2025! / 10), 0) / btRows.length;
    }
  }
  return { branch, totalPop, muniCount: munis.size, avgCluster, benefitAverages };
}

function computeNationalAverages(rows: FlatDataRow[]): Record<string, number> {
  const avgs: Record<string, number> = {};
  for (const bt of allCsvTypes) {
    const btRows = rows.filter((r) => r.Benefit_Type === bt && r.Rate_2025 !== null);
    if (btRows.length > 0) {
      avgs[bt] = btRows.reduce((s, r) => s + (r.Rate_2025! / 10), 0) / btRows.length;
    }
  }
  return avgs;
}

interface MuniMultiRow {
  name: string;
  entityType: string;
  cluster: number | null;
  pop: number;
  rates: Record<string, number>;
  gapsFromBranch: Record<string, number>;
  gapsFromCluster: Record<string, number | null>;
  statuses: Record<string, string>;
  avgRate: number;
  avgGapFromBranch: number;
}

type SortField = "name" | "pop" | "avgRate" | "avgGapFromBranch";
type SortDir = "asc" | "desc";

function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
  if (field !== current) return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50 inline mr-1" />;
  return dir === "asc" ? <ChevronUp className="h-3 w-3 text-primary inline mr-1" /> : <ChevronDown className="h-3 w-3 text-primary inline mr-1" />;
}

export default function BranchAnalysisPage() {
  const [allRows, setAllRows] = useState<FlatDataRow[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const { selectedBranch: globalBranch, setSelectedBranch: setGlobalBranch } = useBranchFilter();
  const [selectedBranch, setSelectedBranchLocal] = useState("");
  const [compareBranch, setCompareBranch] = useState("");
  const [selectedBenefits, setSelectedBenefits] = useState<Set<string>>(new Set(allCsvTypes));
  const [sortField, setSortField] = useState<SortField>("avgGapFromBranch");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loading, setLoading] = useState(true);
  const [benefitPopoverOpen, setBenefitPopoverOpen] = useState(false);

  const setSelectedBranch = (branch: string) => {
    setSelectedBranchLocal(branch);
    setGlobalBranch(branch);
  };

  useEffect(() => {
    loadFlatData().then((rows) => {
      setAllRows(rows);
      const b = getBranches(rows);
      setBranches(b);
      const initial = globalBranch && b.includes(globalBranch) ? globalBranch : b[0] || "";
      setSelectedBranchLocal(initial);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (globalBranch && branches.includes(globalBranch) && globalBranch !== selectedBranch) {
      setSelectedBranchLocal(globalBranch);
    }
  }, [globalBranch, branches]);

  const toggleBenefit = (bt: string) => {
    setSelectedBenefits((prev) => {
      const next = new Set(prev);
      if (next.has(bt)) next.delete(bt); else next.add(bt);
      return next;
    });
  };
  const toggleAll = () => {
    if (selectedBenefits.size === allCsvTypes.length) setSelectedBenefits(new Set());
    else setSelectedBenefits(new Set(allCsvTypes));
  };

  const nationalAvgs = useMemo(() => computeNationalAverages(allRows), [allRows]);
  const branchStats = useMemo(() => selectedBranch ? computeBranchStats(allRows, selectedBranch) : null, [allRows, selectedBranch]);
  const compareStats = useMemo(() => compareBranch && compareBranch !== "__none__" ? computeBranchStats(allRows, compareBranch) : null, [allRows, compareBranch]);

  const activeBenefits = useMemo(() => Array.from(selectedBenefits), [selectedBenefits]);

  const muniRows = useMemo((): MuniMultiRow[] => {
    if (!selectedBranch || !branchStats || activeBenefits.length === 0) return [];
    const branchRows = allRows.filter((r) => r.Branch === selectedBranch && selectedBenefits.has(r.Benefit_Type));
    const muniMap = new Map<string, MuniMultiRow>();

    for (const r of branchRows) {
      if (!muniMap.has(r.Municipality)) {
        muniMap.set(r.Municipality, {
          name: r.Municipality, entityType: r.Entity_Type, cluster: r.Cluster,
          pop: r.Pop_2025 ?? 0, rates: {}, gapsFromBranch: {}, gapsFromCluster: {}, statuses: {},
          avgRate: 0, avgGapFromBranch: 0,
        });
      }
      const m = muniMap.get(r.Municipality)!;
      const rate = r.Rate_2025 !== null ? r.Rate_2025 / 10 : (r.Rate_2024 !== null ? r.Rate_2024 / 10 : 0);
      const branchAvg = branchStats.benefitAverages[r.Benefit_Type] ?? 0;
      m.rates[r.Benefit_Type] = rate;
      m.gapsFromBranch[r.Benefit_Type] = branchAvg > 0 ? ((rate - branchAvg) / branchAvg) * 100 : 0;
      m.gapsFromCluster[r.Benefit_Type] = r.Gap_from_Cluster_Pct;
      m.statuses[r.Benefit_Type] = r.Operational_Status || "";
    }

    for (const m of muniMap.values()) {
      const rateVals = Object.values(m.rates);
      const gapVals = Object.values(m.gapsFromBranch);
      m.avgRate = rateVals.length > 0 ? rateVals.reduce((s, v) => s + v, 0) / rateVals.length : 0;
      m.avgGapFromBranch = gapVals.length > 0 ? gapVals.reduce((s, v) => s + v, 0) / gapVals.length : 0;
    }
    return Array.from(muniMap.values());
  }, [allRows, selectedBranch, branchStats, activeBenefits, selectedBenefits]);

  const sortedMunis = useMemo(() => {
    return [...muniRows].sort((a, b) => {
      let av: number | string, bv: number | string;
      switch (sortField) {
        case "name": av = a.name; bv = b.name; break;
        case "pop": av = a.pop; bv = b.pop; break;
        case "avgRate": av = a.avgRate; bv = b.avgRate; break;
        case "avgGapFromBranch": av = Math.abs(a.avgGapFromBranch); bv = Math.abs(b.avgGapFromBranch); break;
        default: return 0;
      }
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string, "he") : (bv as string).localeCompare(av, "he");
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [muniRows, sortField, sortDir]);

  const outliers = useMemo(() => {
    const high = muniRows.filter((m) => m.avgGapFromBranch > 20).sort((a, b) => b.avgGapFromBranch - a.avgGapFromBranch).slice(0, 5);
    const low = muniRows.filter((m) => m.avgGapFromBranch < -20).sort((a, b) => a.avgGapFromBranch - b.avgGapFromBranch).slice(0, 5);
    return { high, low };
  }, [muniRows]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir(field === "name" ? "asc" : "desc"); }
  };

  const benefitCountLabel = selectedBenefits.size === allCsvTypes.length ? "כל הגמלאות" :
    selectedBenefits.size === 0 ? "בחר גמלאות..." :
    selectedBenefits.size === 1 ? csvTypeToLabel(activeBenefits[0]) :
    selectedBenefits.size + " גמלאות נבחרו";

  if (loading) {
    return <div className="flex items-center justify-center py-16 text-muted-foreground"><span className="animate-pulse">טוען נתונים...</span></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">סקירה כללית</Link>
          <span>/</span>
          <span className="text-foreground">ניתוח סניפים</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">ניתוח סניפים</h1>
        <p className="text-muted-foreground mt-1">השוואת רשויות בתוך הסניף, זיהוי חריגות, והשוואה בין סניפים</p>
      </div>

      {/* Selectors */}
      <div className="dashboard-card p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-2">סניף</label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger><SelectValue placeholder="בחר סניף..." /></SelectTrigger>
              <SelectContent>{branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">סוגי גמלאות</label>
            <Popover open={benefitPopoverOpen} onOpenChange={setBenefitPopoverOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between text-right font-normal">
                  {benefitCountLabel}
                  <ChevronsUpDown className="h-4 w-4 opacity-50 mr-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-2" align="start">
                <div className="space-y-1">
                  <button onClick={toggleAll} className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-muted text-sm font-medium">
                    <Checkbox checked={selectedBenefits.size === allCsvTypes.length} />
                    <span>בחר הכל</span>
                  </button>
                  <div className="border-t my-1" />
                  {benefitTypes.map((bt) => {
                    const csvType = benefitIdToCsvType[bt.id];
                    return (
                      <button key={bt.id} onClick={() => toggleBenefit(csvType)} className="flex items-center gap-2 w-full px-2 py-1.5 rounded hover:bg-muted text-sm">
                        <Checkbox checked={selectedBenefits.has(csvType)} />
                        <span>{bt.icon} {bt.name}</span>
                      </button>
                    );
                  })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">השוואה לסניף</label>
            <Select value={compareBranch} onValueChange={setCompareBranch}>
              <SelectTrigger><SelectValue placeholder="בחר סניף להשוואה..." /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">ללא השוואה</SelectItem>
                {branches.filter((b) => b !== selectedBranch).map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {branchStats && (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard title="רשויות בסניף" value={branchStats.muniCount} subtitle={"סניף " + selectedBranch} icon={Building2} variant="primary" />
            <KPICard title="אוכלוסייה" value={formatNumber(branchStats.totalPop)} subtitle="תושבים בסניף" icon={Users} variant="default" />
            <KPICard title="גמלאות בניתוח" value={activeBenefits.length} subtitle={"מתוך " + allCsvTypes.length + " סוגים"} icon={BarChart3} variant="success" />
            <KPICard title="ממוצע אשכול" value={branchStats.avgCluster.toFixed(1)} subtitle="אשכול סוציו-אקונומי" variant="warning" />
          </div>

          {compareStats && compareBranch !== "__none__" && (
            <div className="dashboard-card p-6">
              <h3 className="text-lg font-semibold mb-4">{"השוואה: " + selectedBranch + " מול " + compareBranch}</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead><tr className="border-b">
                    <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">גמלה</th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-primary">{selectedBranch}</th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-violet-600">{compareBranch}</th>
                    <th className="text-right py-2 px-3 text-sm font-medium">ארצי</th>
                    <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">הפרש</th>
                  </tr></thead>
                  <tbody>
                    {benefitTypes.filter((bt) => selectedBenefits.has(benefitIdToCsvType[bt.id])).map((bt) => {
                      const csvType = benefitIdToCsvType[bt.id];
                      const v1 = branchStats.benefitAverages[csvType] ?? 0;
                      const v2 = compareStats.benefitAverages[csvType] ?? 0;
                      const nat = nationalAvgs[csvType] ?? 0;
                      const diff = v1 - v2;
                      return (
                        <tr key={bt.id} className="border-b hover:bg-muted/50">
                          <td className="py-2 px-3 text-sm">{bt.icon} {bt.name}</td>
                          <td className="py-2 px-3 text-sm font-bold text-primary">{v1.toFixed(1)}%</td>
                          <td className="py-2 px-3 text-sm font-bold text-violet-600">{v2.toFixed(1)}%</td>
                          <td className="py-2 px-3 text-sm text-muted-foreground">{nat.toFixed(1)}%</td>
                          <td className={cn("py-2 px-3 text-sm font-bold", diff > 0 ? "text-red-600" : diff < 0 ? "text-blue-600" : "text-muted-foreground")}>
                            {diff > 0 ? "+" : ""}{diff.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <Tabs defaultValue="table" className="space-y-4">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="table">טבלת רשויות</TabsTrigger>
              <TabsTrigger value="outliers">חריגות</TabsTrigger>
            </TabsList>
            <TabsContent value="table">
              <div className="dashboard-card p-6">
                <h3 className="text-lg font-semibold mb-2">{"רשויות בסניף " + selectedBranch}</h3>
                <p className="text-sm text-muted-foreground mb-4">{benefitCountLabel}</p>
                <div className="rounded-lg border bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="text-right sticky right-0 bg-muted/50 z-10 min-w-[100px]">
                            <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs" onClick={() => handleSort("name")}>רשות <SortIcon field="name" current={sortField} dir={sortDir} /></Button>
                          </TableHead>
                          <TableHead className="text-right">אשכול</TableHead>
                          <TableHead className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs" onClick={() => handleSort("pop")}>אוכלוסייה <SortIcon field="pop" current={sortField} dir={sortDir} /></Button>
                          </TableHead>
                          {activeBenefits.map((bt) => (
                            <TableHead key={bt} className="text-right text-xs min-w-[80px]">{csvTypeToIcon(bt)} {csvTypeToLabel(bt)}</TableHead>
                          ))}
                          {activeBenefits.length > 1 && (
                            <React.Fragment>
                              <TableHead className="text-right">
                                <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs font-bold text-primary" onClick={() => handleSort("avgRate")}>ממוצע <SortIcon field="avgRate" current={sortField} dir={sortDir} /></Button>
                              </TableHead>
                              <TableHead className="text-right">
                                <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs" onClick={() => handleSort("avgGapFromBranch")}>פער ממוצע <SortIcon field="avgGapFromBranch" current={sortField} dir={sortDir} /></Button>
                              </TableHead>
                            </React.Fragment>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedMunis.map((m, idx) => {
                          const isOutlier = Math.abs(m.avgGapFromBranch) > 20;
                          return (
                            <TableRow key={m.name} className={cn(isOutlier ? "bg-amber-50/60 dark:bg-amber-950/20" : idx % 2 === 0 ? "bg-background" : "bg-muted/30")}>
                              <TableCell className={cn("py-2 font-medium sticky right-0 z-10", isOutlier ? "bg-amber-50/60 dark:bg-amber-950/20" : idx % 2 === 0 ? "bg-background" : "bg-muted/30")}>
                                {isOutlier && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 mb-0.5" />}
                                {m.name}
                                {m.entityType === "מועצה אזורית" && <span className="mr-1.5 inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900/40 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-300">מ.א.</span>}
                              </TableCell>
                              <TableCell className="py-2 text-sm text-muted-foreground">{m.cluster ?? "—"}</TableCell>
                              <TableCell className="py-2 text-sm">{formatNumber(m.pop)}</TableCell>
                              {activeBenefits.map((bt) => {
                                const rate = m.rates[bt];
                                const gap = m.gapsFromBranch[bt];
                                return (
                                  <TableCell key={bt} className="py-2 text-sm tabular-nums">
                                    {rate !== undefined ? <span className={cn("font-semibold", gap > 15 ? "text-red-600" : gap < -15 ? "text-blue-600" : "")}>{rate.toFixed(1)}%</span> : "—"}
                                  </TableCell>
                                );
                              })}
                              {activeBenefits.length > 1 && (
                                <React.Fragment>
                                  <TableCell className="py-2 text-sm font-bold">{m.avgRate.toFixed(1)}%</TableCell>
                                  <TableCell className={cn("py-2 text-sm font-semibold", m.avgGapFromBranch > 15 ? "text-red-600" : m.avgGapFromBranch < -15 ? "text-blue-600" : "text-muted-foreground")}>
                                    {m.avgGapFromBranch > 0 ? "+" : ""}{m.avgGapFromBranch.toFixed(1)}%
                                  </TableCell>
                                </React.Fragment>
                              )}
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-left">{sortedMunis.length + " רשויות בסניף"}</p>
              </div>
            </TabsContent>

            <TabsContent value="outliers">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="dashboard-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-600">חריגה כלפי מעלה</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">רשויות עם אחוז מקבלים גבוה משמעותית מממוצע הסניף</p>
                  {outliers.high.length > 0 ? (
                    <div className="space-y-3">
                      {outliers.high.map((m) => (
                        <div key={m.name} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div>
                            <span className="font-medium">{m.name}</span>
                            {m.entityType === "מועצה אזורית" && <span className="text-xs text-violet-600 mr-1"> (מ.א.)</span>}
                            <span className="text-xs text-muted-foreground mr-2">{" אשכול " + (m.cluster ?? "—")}</span>
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-red-600 text-lg">{m.avgRate.toFixed(1)}%</span>
                            <span className="text-xs text-red-500 mr-2">{"+" + m.avgGapFromBranch.toFixed(0) + "%"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-muted-foreground text-sm">אין חריגות משמעותיות</p>}
                </div>
                <div className="dashboard-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-600">חריגה כלפי מטה</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">רשויות עם אחוז מקבלים נמוך משמעותית מממוצע הסניף</p>
                  {outliers.low.length > 0 ? (
                    <div className="space-y-3">
                      {outliers.low.map((m) => (
                        <div key={m.name} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div>
                            <span className="font-medium">{m.name}</span>
                            {m.entityType === "מועצה אזורית" && <span className="text-xs text-violet-600 mr-1"> (מ.א.)</span>}
                            <span className="text-xs text-muted-foreground mr-2">{" אשכול " + (m.cluster ?? "—")}</span>
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-blue-600 text-lg">{m.avgRate.toFixed(1)}%</span>
                            <span className="text-xs text-blue-500 mr-2">{m.avgGapFromBranch.toFixed(0) + "%"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-muted-foreground text-sm">אין חריגות משמעותיות</p>}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
