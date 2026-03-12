import { useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KPICard } from "@/components/dashboard/KPICard";
import { MunicipalityTable } from "@/components/dashboard/MunicipalityTable";
import { GapBarChart } from "@/components/dashboard/charts/GapBarChart";
import { PopulationScatterChart } from "@/components/dashboard/charts/PopulationScatterChart";
import { RateHistogram } from "@/components/dashboard/charts/RateHistogram";
import { TrendPanel } from "@/components/dashboard/TrendPanel";
import { useViewMode } from "@/context/ViewModeContext";
import {
  getBenefitTypeById,
  getTopMunicipalitiesByGap,
  benefitData,
  municipalities,
  formatNumber,
} from "@/data/welfareData";

// Map route benefit IDs to CSV Benefit_Type values
const benefitIdToCsvType: Record<string, string> = {
  "old-age": "זקנה",
  "disability": "נכות",
  "nursing": "סיעוד",
  "income-support": "הבטחת_הכנסה",
  "unemployment": "אבטלה",
  "child-support": "מזונות",
  "disabled-child": "ילד_נכה",
  "mobility": "ניידות",
  "alimony": "מזונות",
};

export default function BenefitAnalysisPage() {
  const { benefitId } = useParams<{ benefitId: string }>();
  const { viewMode } = useViewMode();
  const benefit = getBenefitTypeById(benefitId || "");

  if (!benefit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold mb-2">גמלה לא נמצאה</h2>
        <p className="text-muted-foreground mb-4">סוג הגמלה המבוקש אינו קיים במערכת</p>
        <Button asChild>
          <Link to="/">
            <ArrowRight className="ml-2 h-4 w-4" />
            חזרה לדף הבית
          </Link>
        </Button>
      </div>
    );
  }

  // Trend mode – show TrendPanel filtered to this benefit
  const csvBenefitType = benefitIdToCsvType[benefit.id];
  if (viewMode === "trend_23_25") {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link to="/" className="hover:text-foreground transition-colors">
              סקירה כללית
            </Link>
            <span>/</span>
            <span className="text-foreground">{benefit.name} – מגמות</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-4xl">{benefit.icon}</span>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{benefit.name} – מגמות 2023–2025</h1>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          </div>
        </div>
        <TrendPanel initialBenefitType={csvBenefitType} />
      </div>
    );
  }

  const benefitDataMap = benefitData[benefit.id];
  const allData = municipalities
    .map((muni) => ({
      municipality: muni,
      data: benefitDataMap[muni.id],
    }))
    .filter((item) => item.data);

  const topByGap = getTopMunicipalitiesByGap(benefit.id, 20);
  
  // Calculate average recipient percentage
  const avgRecipientPercent =
    allData.reduce((sum, item) => sum + item.data.recipientPercent, 0) / allData.length;
  const highRecipientCount = allData.filter((d) => d.data.recipientPercent > 5).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Link to="/" className="hover:text-foreground transition-colors">
            סקירה כללית
          </Link>
          <span>/</span>
          <span className="text-foreground">{benefit.name}</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl">{benefit.icon}</span>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{benefit.name}</h1>
            <p className="text-muted-foreground">{benefit.description}</p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="אחוז מקבלים ארצי"
          value={`${(benefit.nationalRatePer1000 / 10).toFixed(1)}%`}
          subtitle={`מתוך ${benefit.targetPopulation}`}
          variant="primary"
        />
        <KPICard
          title="מקבלים ארציים"
          value={formatNumber(benefit.nationalRecipients)}
          subtitle="סה״כ מקבלי גמלה"
          variant="default"
        />
        <KPICard
          title="אחוז ממוצע ברשויות"
          value={`${avgRecipientPercent.toFixed(1)}%`}
          subtitle="ממוצע כל הרשויות"
          variant={avgRecipientPercent > 5 ? "destructive" : "success"}
        />
        <KPICard
          title="רשויות מעל 5%"
          value={highRecipientCount}
          subtitle="רשויות עם אחוז גבוה"
          variant="warning"
        />
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="bar" className="space-y-4">
        <TabsList className="bg-muted/50">
          <TabsTrigger value="bar">גרף עמודות</TabsTrigger>
          <TabsTrigger value="scatter">פיזור</TabsTrigger>
          <TabsTrigger value="histogram">התפלגות</TabsTrigger>
          <TabsTrigger value="table">טבלה מלאה</TabsTrigger>
        </TabsList>

        <TabsContent value="bar" className="space-y-4">
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-2">
              20 הרשויות עם אחוז המקבלים הגבוה ביותר
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              אחוז מקבלי גמלה מתוך {benefit.targetPopulation} (ממוצע ארצי: {(benefit.nationalRatePer1000 / 10).toFixed(1)}%)
            </p>
            <GapBarChart data={allData} maxBars={20} />
          </div>
        </TabsContent>

        <TabsContent value="scatter" className="space-y-4">
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-2">
              אוכלוסייה מול שיעור מקבלים
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              כל נקודה מייצגת רשות מקומית • הקו המקווקו מציין את הממוצע הארצי
            </p>
            <PopulationScatterChart data={allData} benefitType={benefit} />
          </div>
        </TabsContent>

        <TabsContent value="histogram" className="space-y-4">
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-2">
              התפלגות שיעורי מקבלים
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              מספר רשויות לפי טווח שיעור ל-1000 תושבים
            </p>
            <RateHistogram data={allData} benefitType={benefit} />
          </div>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-4">
              כל הרשויות המקומיות
            </h3>
            <MunicipalityTable data={allData} showSearch={true} />
          </div>
        </TabsContent>
      </Tabs>

      {/* Summary Table */}
      <div className="dashboard-card p-6">
        <h3 className="text-lg font-semibold mb-4">טבלת סיכום - 10 הראשונות</h3>
        <MunicipalityTable data={topByGap.slice(0, 10)} showSearch={false} />
      </div>
    </div>
  );
}
