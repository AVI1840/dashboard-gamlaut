import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadarComparisonChart } from "@/components/dashboard/charts/RadarComparisonChart";
import { useSnapshotData, getMuniProfile } from "@/hooks/useSnapshotData";
import {
  formatNumber,
  benefitTypes,
} from "@/data/welfareData";

const NATIONAL_AVERAGE_ID = "__national__";

export default function ComparePage() {
  const { municipalities, benefitData, loading } = useSnapshotData();
  const [selectedMunicipality1, setSelectedMunicipality1] = useState<string>("");
  const [selectedMunicipality2, setSelectedMunicipality2] = useState<string>(NATIONAL_AVERAGE_ID);

  // Set default selection once data loads
  if (municipalities.length > 0 && !selectedMunicipality1) {
    setSelectedMunicipality1(municipalities[0].id);
  }

  const municipality1 = municipalities.find((m) => m.id === selectedMunicipality1);
  const municipality2 = selectedMunicipality2 !== NATIONAL_AVERAGE_ID
    ? municipalities.find((m) => m.id === selectedMunicipality2)
    : null;

  const profile1 = selectedMunicipality1 ? getMuniProfile(benefitData, selectedMunicipality1) : [];
  const profile2 = selectedMunicipality2 !== NATIONAL_AVERAGE_ID
    ? getMuniProfile(benefitData, selectedMunicipality2)
    : null;

  const comparisonName = municipality2 ? municipality2.name : "ממוצע ארצי";

  // Display name with (מ.א.) suffix for regional councils
  const displayName = (m: typeof municipalities[0]) =>
    m.entityType === "מועצה אזורית" ? `${m.name} (מ.א.)` : m.name;

  const comparisonData = profile1.map((item1) => {
    const item2 = profile2?.find((p) => p.benefit.id === item1.benefit.id);
    return {
      benefit: item1.benefit,
      data1: item1.data,
      data2: item2?.data || null,
    };
  }).sort((a, b) => b.data1.recipientPercent - a.data1.recipientPercent);

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
          <Link to="/" className="hover:text-foreground transition-colors">
            סקירה כללית
          </Link>
          <span>/</span>
          <span className="text-foreground">השוואת רשויות</span>
        </div>
        <h1 className="text-2xl font-bold text-foreground">השוואת רשויות</h1>
        <p className="text-muted-foreground mt-1">
          בחר שתי רשויות מקומיות להשוואה, או השווה רשות לממוצע הארצי
        </p>
      </div>

      {/* Municipality Selectors */}
      <div className="dashboard-card p-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2">רשות מקומית א׳</label>
            <Select value={selectedMunicipality1} onValueChange={setSelectedMunicipality1}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="בחר רשות..." />
              </SelectTrigger>
              <SelectContent>
                {municipalities.map((muni) => (
                  <SelectItem
                    key={muni.id}
                    value={muni.id}
                    disabled={muni.id === selectedMunicipality2}
                  >
                    {displayName(muni)} - {muni.branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">רשות מקומית ב׳ / ממוצע ארצי</label>
            <Select value={selectedMunicipality2} onValueChange={setSelectedMunicipality2}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="בחר רשות..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={NATIONAL_AVERAGE_ID}>
                  📊 ממוצע ארצי
                </SelectItem>
                {municipalities.map((muni) => (
                  <SelectItem
                    key={muni.id}
                    value={muni.id}
                    disabled={muni.id === selectedMunicipality1}
                  >
                    {displayName(muni)} - {muni.branch}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {municipality1 && (
        <>
          {/* Municipalities Info Cards */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="dashboard-card p-6 border-r-4 border-r-primary">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  א׳
                </span>
                <h3 className="text-lg font-semibold">
                  {municipality1.name}
                  {municipality1.entityType === "מועצה אזורית" && (
                    <span className="mr-1.5 text-sm text-violet-600">(מ.א.)</span>
                  )}
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">אוכלוסייה</p>
                  <p className="font-bold text-lg">{formatNumber(municipality1.population)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">סניף</p>
                  <p className="font-bold text-lg">{municipality1.branch}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">אשכול</p>
                  <p className="font-medium">{municipality1.cluster ?? "ללא"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">סוג</p>
                  <p className="font-medium">{municipality1.entityType}</p>
                </div>
              </div>
            </div>

            <div className="dashboard-card p-6 border-r-4 border-r-secondary">
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm font-bold">
                  ב׳
                </span>
                <h3 className="text-lg font-semibold">{comparisonName}</h3>
              </div>
              {municipality2 ? (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">אוכלוסייה</p>
                    <p className="font-bold text-lg">{formatNumber(municipality2.population)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">סניף</p>
                    <p className="font-bold text-lg">{municipality2.branch}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">אשכול</p>
                    <p className="font-medium">{municipality2.cluster ?? "ללא"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">סוג</p>
                    <p className="font-medium">{municipality2.entityType}</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">אוכלוסייה</p>
                    <p className="font-bold text-lg">9,746,456</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">רשויות</p>
                    <p className="font-bold text-lg">340</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-muted-foreground">תיאור</p>
                    <p className="font-medium">ממוצע ארצי של כל הרשויות המקומיות בישראל</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Radar Chart */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-2">השוואת פרופיל גמלאות</h3>
            <p className="text-sm text-muted-foreground mb-4">
              השוואת שיעורי מקבלים בכל סוגי הגמלאות בין {municipality1.name} ל{comparisonName}
            </p>
            <RadarComparisonChart
              municipalityName={municipality1.name}
              municipalityData={profile1}
              comparisonName={comparisonName}
              comparisonData={profile2}
            />
          </div>

          {/* Benefits Comparison Table */}
          <div className="dashboard-card p-6">
            <h3 className="text-lg font-semibold mb-4">פירוט השוואה לפי סוג גמלה</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">סוג גמלה</th>
                    <th className="text-right py-3 px-4 font-medium text-primary">{municipality1.name} (%)</th>
                    <th className="text-right py-3 px-4 font-medium text-secondary-foreground">{comparisonName} (%)</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">הפרש</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonData.map((item) => {
                    const percent1 = item.data1.recipientPercent;
                    const percent2 = item.data2?.recipientPercent || (item.benefit.nationalRatePer1000 / 10);
                    const diff = percent1 - percent2;
                    return (
                      <tr key={item.benefit.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{item.benefit.icon}</span>
                            <span className="font-medium">{item.benefit.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-bold text-primary text-lg">{percent1.toFixed(1)}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium text-lg">{percent2.toFixed(1)}%</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`font-bold ${diff > 0 ? 'text-destructive' : 'text-primary'}`}>
                            {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Comparison Summary */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="dashboard-card p-6">
              <h4 className="font-semibold mb-3 text-destructive">
                {municipality1.name} - אחוז גבוה יותר
              </h4>
              <div className="space-y-2">
                {comparisonData
                  .filter((item) => {
                    const percent2 = item.data2?.recipientPercent || (item.benefit.nationalRatePer1000 / 10);
                    return item.data1.recipientPercent > percent2;
                  })
                  .slice(0, 5)
                  .map((item) => {
                    const percent2 = item.data2?.recipientPercent || (item.benefit.nationalRatePer1000 / 10);
                    const diff = item.data1.recipientPercent - percent2;
                    return (
                      <div key={item.benefit.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="flex items-center gap-2">
                          <span>{item.benefit.icon}</span>
                          <span>{item.benefit.name}</span>
                        </span>
                        <span className="font-bold text-destructive">+{diff.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                {comparisonData.filter((item) => {
                  const percent2 = item.data2?.recipientPercent || (item.benefit.nationalRatePer1000 / 10);
                  return item.data1.recipientPercent > percent2;
                }).length === 0 && (
                  <p className="text-muted-foreground text-sm">אין גמלאות גבוהות יותר</p>
                )}
              </div>
            </div>

            <div className="dashboard-card p-6">
              <h4 className="font-semibold mb-3 text-primary">
                {comparisonName} - אחוז גבוה יותר
              </h4>
              <div className="space-y-2">
                {comparisonData
                  .filter((item) => {
                    const percent2 = item.data2?.recipientPercent || (item.benefit.nationalRatePer1000 / 10);
                    return item.data1.recipientPercent < percent2;
                  })
                  .slice(0, 5)
                  .map((item) => {
                    const percent2 = item.data2?.recipientPercent || (item.benefit.nationalRatePer1000 / 10);
                    const diff = item.data1.recipientPercent - percent2;
                    return (
                      <div key={item.benefit.id} className="flex items-center justify-between py-2 border-b last:border-0">
                        <span className="flex items-center gap-2">
                          <span>{item.benefit.icon}</span>
                          <span>{item.benefit.name}</span>
                        </span>
                        <span className="font-bold text-primary">{diff.toFixed(1)}%</span>
                      </div>
                    );
                  })}
                {comparisonData.filter((item) => {
                  const percent2 = item.data2?.recipientPercent || (item.benefit.nationalRatePer1000 / 10);
                  return item.data1.recipientPercent < percent2;
                }).length === 0 && (
                  <p className="text-muted-foreground text-sm">אין גמלאות נמוכות יותר</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
