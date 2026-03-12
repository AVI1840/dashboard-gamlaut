import { useParams, Link } from "react-router-dom";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard } from "@/components/dashboard/KPICard";
import { MunicipalityTable } from "@/components/dashboard/MunicipalityTable";
import { GapBarChart } from "@/components/dashboard/charts/GapBarChart";
import { PopulationScatterChart } from "@/components/dashboard/charts/PopulationScatterChart";
import { RateHistogram } from "@/components/dashboard/charts/RateHistogram";
import { TrendPanel } from "@/components/dashboard/TrendPanel";
import { useViewMode } from "@/context/ViewModeContext";
import { useSnapshotData, getTopByGap, getAllWithData } from "@/hooks/useSnapshotData";
import { getBenefitTypeById, formatNumber } from "@/data/welfareData";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const benefitIdToCsvType: Record<string, string> = {
  "old-age": "זקנה",
  "disability": "נכות",
  "nursing": "סיעוד",
  "income-support": "הבטחת_הכנסה",
  "unemployment": "אבטלה",
  "child-support": "ילדים",
  "disabled-child": "ילד_נכה",
  "mobility": "ניידות",
  "alimony": "מזונות",
};

export default function BenefitAnalysisPage() {
  const { benefitId } = useParams<{ benefitId: string }>();
  const { viewMode } = useViewMode();
  const benefit = getBenefitTypeById(benefitId || "");
  const { municipalities, benefitData, loading } = useSnapshotData();

  if (!benefit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold mb-2">גמלה לא נמצאה</h2>
        <p className="text-muted-foreground mb-4">סוג הגמלה המבוקש אינו קיים במערכת</p>
        <Button asChild>
          <Link to="/"><ArrowRight className="ml-2 h-4 w-4" />חזרה לדף הבית</Link>
        </Button>
      </div>
    );
  }

  const csvBenefitType = benefitIdToCsvType[benefit.id];

  if (viewMode === "trend_23_25") {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-foreground transition-colors">סקירה כללית</Link>
            <span>/</span>
            <span className="text-foreground">{benefit.name} - מגמות</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{benefit.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{benefit.name} - מגמות דצמבר 2023-2025</h1>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          </div>
        </div>
        <TrendPanel initialBenefitType={csvBenefitType} />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <span className="animate-pulse">טוען נתונים...</span>
      </div>
    );
  }

  const allData = getAllWithData(benefitData, municipalities, benefit.id);
  const topByGap = getTopByGap(benefitData, municipalities, benefit.id, 20);
  const avgRecipientPercent = allData.length > 0
    ? allData.reduce((sum, item) => sum + item.data.recipientPercent, 0) / allData.length : 0;
  const highRecipientCount = allData.filter((d) => d.data.recipientPercent > 5).length;
  const isOldAge = benefit.id === "old-age";

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">סקירה כללית</Link>
          <span>/</span>
          <span className="text-foreground">{benefit.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{benefit.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {benefit.name}
              {isOldAge && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="h-5 w-5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="bottom" className="max-w-xs text-right">
                    <p>שיעור מקבלי קצבת זקנה בלבד (ללא שאירים) מתוך אוכלוסיית 65+</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </h1>
            <p className="text-muted-foreground">{benefit.description}</p>
            <p className="text-xs text-muted-foreground mt-1">נתונים: דצמבר 2023 | דצמבר 2024 | דצמבר 2025</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard title="אחוז מקבלים ארצי" value={`${'$'}{(benefit.nationalRatePer1000 / 10).toFixed(1)}%`} subtitle={`מתוך ${'$'}{benefit.targetPopulation}`} variant="primary" />
        <KPICard title="מקבלים ארציים" value={formatNumber(benefit.nationalRecipients)} subtitle="סה״כ מקבלי גמלה" variant="default" />
        <KPICard title="אחוז ממוצע ברשויות" value={`${'$'}{avgRecipientPercent.toFixed(1)}%`} subtitle={`ממוצע ${'$'}{allData.length} רשויות`} variant={avgRecipientPercent > 5 ? "destructive" : "success"} />
        <KPICard title="רשויות מעל 5%" value={highRecipientCount} subtitle="רשויות עם אחוז גבוה" variant="warning" />
      </div>

      <Tabs defaultValue="table" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="bar">גרף עמודות</TabsTrigger>
          <TabsTrigger value="scatter">פיזור</TabsTrigger>
          <TabsTrigger value="histogram">התפלגות</TabsTrigger>
          <TabsTrigger value="table">טבלה מלאה</TabsTrigger>
        </TabsList>
        <TabsContent value="bar">
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-2">20 הרשויות עם אחוז המקבלים הגבוה ביותר</h3>
            <GapBarChart data={allData} maxBars={20} />
          </div>
        </TabsContent>
        <TabsContent value="scatter">
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-2">אוכלוסייה מול שיעור מקבלים</h3>
            <PopulationScatterChart data={allData} benefitType={benefit} />
          </div>
        </TabsContent>
        <TabsContent value="histogram">
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-2">התפלגות שיעורי מקבלים</h3>
            <RateHistogram data={allData} benefitType={benefit} />
          </div>
        </TabsContent>
        <TabsContent value="table">
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-4">כל הרשויות המקומיות</h3>
            <MunicipalityTable data={allData} showSearch={true} />
          </div>
        </TabsContent>
      </Tabs>

      <div className="dashboard-card p-6">
        <h3 className="text-lg font-semibold mb-4">טבלת סיכום - 10 הראשונות</h3>
        <MunicipalityTable data={topByGap.slice(0, 10)} showSearch={false} />
      </div>
    </div>
  );
}