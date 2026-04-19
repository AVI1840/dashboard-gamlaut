import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building2, Users, BarChart3, AlertTriangle, ArrowUpDown, ChevronUp, ChevronDown, TrendingUp, TrendingDown } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { loadFlatData, FlatDataRow, getBranches } from "@/data/flatData";
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
  for (const bt of Object.values(benefitIdToCsvType)) {
    const btRows = branchRows.filter((r) => r.Benefit_Type === bt && r.Rate_2025 !== null);
    if (btRows.length > 0) {
      benefitAverages[bt] = btRows.reduce((s, r) => s + (r.Rate_2025! / 10), 0) / btRows.length;
    }
  }
  return { branch, totalPop, muniCount: munis.size, avgCluster, benefitAverages };
}

function computeNationalAverages(rows: FlatDataRow[]): Record<string, number> {
  const avgs: Record<string, number> = {};
  for (const bt of Object.values(benefitIdToCsvType)) {
    const btRows = rows.filter((r) => r.Benefit_Type === bt && r.Rate_2025 !== null);
    if (btRows.length > 0) {
      avgs[bt] = btRows.reduce((s, r) => s + (r.Rate_2025! / 10), 0) / btRows.length;
    }
  }
  return avgs;
}

interface MuniRow {
  name: string;
  entityType: string;
  cluster: number | null;
  pop: number;
  rate: number;
  branchAvg: number;
  gapFromBranch: number;
  gapFromCluster: number | null;
  status: string;
}

type SortField = "name" | "pop" | "rate" | "gapFromBranch" | "gapFromCluster";
type SortDir = "asc" | "desc";

function SortIcon({ field, current, dir }: { field: SortField; current: SortField; dir: SortDir }) {
  if (field !== current) return <ArrowUpDown className="h-3 w-3 text-muted-foreground/50 inline mr-1" />;
  return dir === "asc" ? <ChevronUp className="h-3 w-3 text-primary inline mr-1" /> : <ChevronDown className="h-3 w-3 text-primary inline mr-1" />;
}

export default function BranchAnalysisPage() {
  const [allRows, setAllRows] = useState<FlatDataRow[]>([]);
  const [branches, setBranches] = useState<string[]>([]);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [compareBranch, setCompareBranch] = useState("");
  const [selectedBenefit, setSelectedBenefit] = useState("נכות");
  const [sortField, setSortField] = useState<SortField>("gapFromBranch");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlatData().then((rows) => {
      setAllRows(rows);
      const b = getBranches(rows);
      setBranches(b);
      if (b.length > 0) setSelectedBranch(b[0]);
      setLoading(false);
    });
  }, []);

  const nationalAvgs = useMemo(() => computeNationalAverages(allRows), [allRows]);

  const branchStats = useMemo(() => {
    if (!selectedBranch) return null;
    return computeBranchStats(allRows, selectedBranch);
  }, [allRows, selectedBranch]);

  const compareStats = useMemo(() => {
    if (!compareBranch) return null;
    return computeBranchStats(allRows, compareBranch);
  }, [allRows, compareBranch]);

  const muniRows = useMemo((): MuniRow[] => {
    if (!selectedBranch || !branchStats) return [];
    const branchRows = allRows.filter((r) => r.Branch === selectedBranch && r.Benefit_Type === selectedBenefit);
    const branchAvg = branchStats.benefitAverages[selectedBenefit] ?? 0;

    return branchRows.map((r) => {
      const rate = r.Rate_2025 !== null ? r.Rate_2025 / 10 : (r.Rate_2024 !== null ? r.Rate_2024 / 10 : 0);
      return {
        name: r.Municipality,
        entityType: r.Entity_Type,
        cluster: r.Cluster,
        pop: r.Pop_2025 ?? 0,
        rate,
        branchAvg,
        gapFromBranch: branchAvg > 0 ? ((rate - branchAvg) / branchAvg) * 100 : 0,
        gapFromCluster: r.Gap_from_Cluster_Pct,
        status: r.Operational_Status || "",
      };
    });
  }, [allRows, selectedBranch, selectedBenefit, branchStats]);

  const sortedMunis = useMemo(() => {
    return [...muniRows].sort((a, b) => {
      let av: number | string | null, bv: number | string | null;
      switch (sortField) {
        case "name": av = a.name; bv = b.name; break;
        case "pop": av = a.pop; bv = b.pop; break;
        case "rate": av = a.rate; bv = b.rate; break;
        case "gapFromBranch": av = Math.abs(a.gapFromBranch); bv = Math.abs(b.gapFromBranch); break;
        case "gapFromCluster": av = a.gapFromCluster !== null ? Math.abs(a.gapFromCluster) : null; bv = b.gapFromCluster !== null ? Math.abs(b.gapFromCluster) : null; break;
        default: return 0;
      }
      if (av === null && bv === null) return 0;
      if (av === null) return 1;
      if (bv === null) return -1;
      if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv as string, "he") : (bv as string).localeCompare(av, "he");
      return sortDir === "asc" ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
  }, [muniRows, sortField, sortDir]);

  const outliers = useMemo(() => {
    const high = muniRows.filter((m) => m.gapFromBranch > 20).sort((a, b) => b.gapFromBranch - a.gapFromBranch).slice(0, 5);
    const low = muniRows.filter((m) => m.gapFromBranch < -20).sort((a, b) => a.gapFromBranch - b.gapFromBranch).slice(0, 5);
    return { high, low };
  }, [muniRows]);

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir((d) => d === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortDir(field === "name" ? "asc" : "desc"); }
  };

  const benefitLabel = benefitTypes.find((b) => benefitIdToCsvType[b.id] === selectedBenefit)?.name || selectedBenefit;

  if (loading) {
    return <div className="flex items-center justify-center py-16 text-muted-foreground"><span className="animate-pulse">טוען נתונים...</span></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">סקירה כללית</Link>
          <span>/</span>
          <span className="text-foreground">ניתוח סניפים</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">ניתוח סניפים</h1>
        <p className="text-muted-foreground mt-1">השוואת רשויות בתוך הסניף, זיהוי חריגות, והשוואה בין סניפים</p>
      </div>

      {/* Branch + Benefit selectors */}
      <div className="dashboard-card p-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium mb-2">סניף</label>
            <Select value={selectedBranch} onValueChange={setSelectedBranch}>
              <SelectTrigger><SelectValue placeholder="בחר סניף..." /></SelectTrigger>
              <SelectContent>
                {branches.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">סוג גמלה</label>
            <Select value={selectedBenefit} onValueChange={setSelectedBenefit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {benefitTypes.map((b) => (
                  <SelectItem key={b.id} value={benefitIdToCsvType[b.id]}>{b.icon} {b.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
          {/* KPI Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KPICard title="רשויות בסניף" value={branchStats.muniCount} subtitle={"סניף " + selectedBranch} icon={Building2} variant="primary" />
            <KPICard title="אוכלוסייה" value={formatNumber(branchStats.totalPop)} subtitle="תושבים בסניף" icon={Users} variant="default" />
            <KPICard
              title={"ממוצע סניפי — " + benefitLabel}
              value={(branchStats.benefitAverages[selectedBenefit] ?? 0).toFixed(1) + "%"}
              subtitle={"ארצי: " + (nationalAvgs[selectedBenefit] ?? 0).toFixed(1) + "%"}
              icon={BarChart3}
              variant={(branchStats.benefitAverages[selectedBenefit] ?? 0) > (nationalAvgs[selectedBenefit] ?? 0) * 1.1 ? "destructive" : "success"}
            />
            <KPICard title="ממוצע אשכול" value={branchStats.avgCluster.toFixed(1)} subtitle="אשכול סוציו-אקונומי" variant="warning" />
          </div>

          {/* Compare branch KPIs */}
          {compareStats && compareBranch && compareBranch !== "__none__" && (
            <div className="dashboard-card p-6">
              <h3 className="text-lg font-semibold mb-4">השוואה: {selectedBranch} מול {compareBranch}</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">גמלה</th>
                      <th className="text-right py-2 px-3 text-sm font-medium text-primary">{selectedBranch}</th>
                      <th className="text-right py-2 px-3 text-sm font-medium text-violet-600">{compareBranch}</th>
                      <th className="text-right py-2 px-3 text-sm font-medium">ארצי</th>
                      <th className="text-right py-2 px-3 text-sm font-medium text-muted-foreground">הפרש</th>
                    </tr>
                  </thead>
                  <tbody>
                    {benefitTypes.map((bt) => {
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

            {/* Municipalities Table */}
            <TabsContent value="table">
              <div className="dashboard-card p-6">
                <h3 className="text-lg font-semibold mb-2">רשויות בסניף {selectedBranch} — {benefitLabel}</h3>
                <p className="text-sm text-muted-foreground mb-4">ממוצע סניפי: {(branchStats.benefitAverages[selectedBenefit] ?? 0).toFixed(1)}% | ארצי: {(nationalAvgs[selectedBenefit] ?? 0).toFixed(1)}%</p>
                <div className="rounded-lg border bg-card overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50 hover:bg-muted/50">
                          <TableHead className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs" onClick={() => handleSort("name")}>
                              רשות <SortIcon field="name" current={sortField} dir={sortDir} />
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">אשכול</TableHead>
                          <TableHead className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs" onClick={() => handleSort("pop")}>
                              אוכלוסייה <SortIcon field="pop" current={sortField} dir={sortDir} />
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs font-bold text-primary" onClick={() => handleSort("rate")}>
                              אחוז מקבלים <SortIcon field="rate" current={sortField} dir={sortDir} />
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs" onClick={() => handleSort("gapFromBranch")}>
                              פער מסניף <SortIcon field="gapFromBranch" current={sortField} dir={sortDir} />
                            </Button>
                          </TableHead>
                          <TableHead className="text-right">
                            <Button variant="ghost" size="sm" className="h-8 p-0 hover:bg-transparent text-xs" onClick={() => handleSort("gapFromCluster")}>
                              פער מאשכול <SortIcon field="gapFromCluster" current={sortField} dir={sortDir} />
                            </Button>
                          </TableHead>
                          <TableHead className="text-right min-w-[120px]">סטטוס</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sortedMunis.map((m, idx) => {
                          const isOutlier = Math.abs(m.gapFromBranch) > 20;
                          return (
                            <TableRow key={m.name + idx} className={cn(
                              isOutlier ? "bg-amber-50/60 dark:bg-amber-950/20" : idx % 2 === 0 ? "bg-background" : "bg-muted/30"
                            )}>
                              <TableCell className="py-2 font-medium">
                                {isOutlier && <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 mb-0.5" />}
                                {m.name}
                                {m.entityType === "מועצה אזורית" && (
                                  <span className="mr-1.5 inline-flex items-center rounded-full bg-violet-100 dark:bg-violet-900/40 px-1.5 py-0.5 text-[10px] font-medium text-violet-700 dark:text-violet-300">מ.א.</span>
                                )}
                              </TableCell>
                              <TableCell className="py-2 text-sm text-muted-foreground">{m.cluster ?? "—"}</TableCell>
                              <TableCell className="py-2 text-sm">{formatNumber(m.pop)}</TableCell>
                              <TableCell className="py-2 text-sm font-bold">{m.rate.toFixed(1)}%</TableCell>
                              <TableCell className={cn("py-2 text-sm font-semibold",
                                m.gapFromBranch > 15 ? "text-red-600" : m.gapFromBranch < -15 ? "text-blue-600" : "text-muted-foreground"
                              )}>
                                {m.gapFromBranch > 0 ? "+" : ""}{m.gapFromBranch.toFixed(1)}%
                              </TableCell>
                              <TableCell className={cn("py-2 text-sm font-semibold",
                                (m.gapFromCluster ?? 0) > 15 ? "text-red-600" : (m.gapFromCluster ?? 0) < -15 ? "text-blue-600" : "text-muted-foreground"
                              )}>
                                {m.gapFromCluster !== null ? ((m.gapFromCluster > 0 ? "+" : "") + m.gapFromCluster.toFixed(1) + "%") : "—"}
                              </TableCell>
                              <TableCell className="py-2 text-xs">{m.status}</TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 text-left">{sortedMunis.length} רשויות בסניף</p>
              </div>
            </TabsContent>

            {/* Outliers Tab */}
            <TabsContent value="outliers">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="dashboard-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-5 w-5 text-red-600" />
                    <h3 className="text-lg font-semibold text-red-600">חריגה כלפי מעלה</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">רשויות עם אחוז מקבלים גבוה משמעותית מממוצע הסניף ({benefitLabel})</p>
                  {outliers.high.length > 0 ? (
                    <div className="space-y-3">
                      {outliers.high.map((m) => (
                        <div key={m.name} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div>
                            <span className="font-medium">{m.name}</span>
                            {m.entityType === "מועצה אזורית" && <span className="text-xs text-violet-600 mr-1">(מ.א.)</span>}
                            <span className="text-xs text-muted-foreground mr-2">אשכול {m.cluster ?? "—"}</span>
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-red-600 text-lg">{m.rate.toFixed(1)}%</span>
                            <span className="text-xs text-red-500 mr-2">+{m.gapFromBranch.toFixed(0)}% מהסניף</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">אין חריגות משמעותיות כלפי מעלה</p>
                  )}
                </div>

                <div className="dashboard-card p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingDown className="h-5 w-5 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-600">חריגה כלפי מטה</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">רשויות עם אחוז מקבלים נמוך משמעותית מממוצע הסניף ({benefitLabel})</p>
                  {outliers.low.length > 0 ? (
                    <div className="space-y-3">
                      {outliers.low.map((m) => (
                        <div key={m.name} className="flex items-center justify-between py-2 border-b last:border-0">
                          <div>
                            <span className="font-medium">{m.name}</span>
                            {m.entityType === "מועצה אזורית" && <span className="text-xs text-violet-600 mr-1">(מ.א.)</span>}
                            <span className="text-xs text-muted-foreground mr-2">אשכול {m.cluster ?? "—"}</span>
                          </div>
                          <div className="text-left">
                            <span className="font-bold text-blue-600 text-lg">{m.rate.toFixed(1)}%</span>
                            <span className="text-xs text-blue-500 mr-2">{m.gapFromBranch.toFixed(0)}% מהסניף</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-sm">אין חריגות משמעותיות כלפי מטה</p>
                  )}
                </div>
              </div>

              {/* Cluster outliers */}
              <div className="dashboard-card p-6 mt-6">
                <div className="flex items-center gap-2 mb-4">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <h3 className="text-lg font-semibold">חריגות מאשכול סוציו-אקונומי</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">רשויות שהאחוז שלהן חורג משמעותית מהממוצע של האשכול הסוציו-אקונומי שלהן</p>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-right py-2 px-3 text-sm font-medium">רשות</th>
                        <th className="text-right py-2 px-3 text-sm font-medium">אשכול</th>
                        <th className="text-right py-2 px-3 text-sm font-medium">אחוז מקבלים</th>
                        <th className="text-right py-2 px-3 text-sm font-medium">פער מאשכול</th>
                        <th className="text-right py-2 px-3 text-sm font-medium">סטטוס</th>
                      </tr>
                    </thead>
                    <tbody>
                      {muniRows
                        .filter((m) => m.gapFromCluster !== null && Math.abs(m.gapFromCluster) > 15)
                        .sort((a, b) => Math.abs(b.gapFromCluster!) - Math.abs(a.gapFromCluster!))
                        .map((m) => (
                          <tr key={m.name} className="border-b hover:bg-muted/50">
                            <td className="py-2 px-3 text-sm font-medium">{m.name}</td>
                            <td className="py-2 px-3 text-sm">{m.cluster}</td>
                            <td className="py-2 px-3 text-sm font-bold">{m.rate.toFixed(1)}%</td>
                            <td className={cn("py-2 px-3 text-sm font-bold",
                              m.gapFromCluster! > 0 ? "text-red-600" : "text-blue-600"
                            )}>
                              {m.gapFromCluster! > 0 ? "+" : ""}{m.gapFromCluster!.toFixed(1)}%
                            </td>
                            <td className="py-2 px-3 text-xs">{m.status}</td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
