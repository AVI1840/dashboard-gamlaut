import { Users, TrendingUp, Building2, BarChart3 } from "lucide-react";
import { KPICard } from "@/components/dashboard/KPICard";
import { MunicipalityTable } from "@/components/dashboard/MunicipalityTable";
import { BenefitTypeCard } from "@/components/dashboard/BenefitTypeCard";
import { TrendPanel } from "@/components/dashboard/TrendPanel";
import { useViewMode } from "@/context/ViewModeContext";
import {
  nationalStats,
  benefitTypes,
  getTopMunicipalitiesByGap,
  formatNumber,
} from "@/data/welfareData";


export default function OverviewPage() {
  const { viewMode } = useViewMode();
  const topMunicipalitiesByDisability = getTopMunicipalitiesByGap("disability", 10);
  const totalRecipients = benefitTypes.reduce(
    (sum, b) => sum + b.nationalRecipients,
    0
  );

  // Trend mode – render the flat-data driven panel
  if (viewMode === "trend_23_25") {
    return (
      <div className="space-y-8 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground">מגמות 2023–2025</h1>
          <p className="text-muted-foreground mt-1">
            ניתוח שינויים מצטברים לפי יישוב וסוג גמלה
          </p>
        </div>
        <TrendPanel />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">סקירה כללית</h1>
        <p className="text-muted-foreground mt-1">
          ניתוח פערי גמלאות רווחה ברשויות המקומיות בישראל • עדכון: {nationalStats.lastUpdated}
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KPICard
          title="אוכלוסייה כוללת"
          value={formatNumber(nationalStats.totalPopulation)}
          subtitle="תושבים בישראל"
          icon={Users}
          variant="primary"
        />
        <KPICard
          title="רשויות מקומיות"
          value={formatNumber(nationalStats.totalMunicipalities)}
          subtitle="בניתוח"
          icon={Building2}
          variant="default"
        />
        <KPICard
          title="סה״כ מקבלי גמלאות"
          value={formatNumber(totalRecipients)}
          subtitle="בכל סוגי הגמלאות"
          icon={TrendingUp}
          variant="success"
        />
        <KPICard
          title="סוגי גמלאות"
          value={benefitTypes.length}
          subtitle="קטגוריות רווחה"
          icon={BarChart3}
          variant="warning"
        />
      </div>

      {/* Benefit Type Cards Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">גמלאות לפי סוג</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {benefitTypes.slice(0, 6).map((benefit) => (
            <BenefitTypeCard key={benefit.id} benefit={benefit} />
          ))}
        </div>
      </div>

      {/* Top Municipalities Table */}
      <div className="dashboard-card p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold">
            10 הרשויות עם הפער הגבוה ביותר
          </h2>
          <p className="text-sm text-muted-foreground">
            נכות כללית - פער מהממוצע הארצי
          </p>
        </div>
        <MunicipalityTable
          data={topMunicipalitiesByDisability}
          showSearch={false}
          maxRows={10}
        />
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="dashboard-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-destructive" />
            </div>
            <div>
              <h3 className="font-semibold">פער גבוה</h3>
              <p className="text-sm text-muted-foreground">מעל 50%</p>
            </div>
          </div>
          <p className="text-3xl font-bold">
            {topMunicipalitiesByDisability.filter((m) => m.data.gapPercentage > 50).length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">רשויות</p>
        </div>

        <div className="dashboard-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-warning" />
            </div>
            <div>
              <h3 className="font-semibold">פער בינוני</h3>
              <p className="text-sm text-muted-foreground">20-50%</p>
            </div>
          </div>
          <p className="text-3xl font-bold">
            {topMunicipalitiesByDisability.filter(
              (m) => m.data.gapPercentage >= 20 && m.data.gapPercentage <= 50
            ).length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">רשויות</p>
        </div>

        <div className="dashboard-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
              <div className="h-3 w-3 rounded-full bg-success" />
            </div>
            <div>
              <h3 className="font-semibold">פער נמוך</h3>
              <p className="text-sm text-muted-foreground">מתחת ל-20%</p>
            </div>
          </div>
          <p className="text-3xl font-bold">
            {topMunicipalitiesByDisability.filter((m) => m.data.gapPercentage < 20).length}
          </p>
          <p className="text-sm text-muted-foreground mt-1">רשויות</p>
        </div>
      </div>
    </div>
  );
}
