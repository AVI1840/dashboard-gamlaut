import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { BenefitType, BenefitData } from "@/data/welfareData";

interface RadarComparisonChartProps {
  municipalityName: string;
  municipalityData: Array<{ benefit: BenefitType; data: BenefitData }>;
  comparisonName?: string;
  comparisonData?: Array<{ benefit: BenefitType; data: BenefitData }> | null;
}

export function RadarComparisonChart({
  municipalityName,
  municipalityData,
  comparisonName = "ממוצע ארצי",
  comparisonData = null,
}: RadarComparisonChartProps) {
  // Normalize data to 0-100 scale for better visualization
  const chartData = municipalityData.map((item) => {
    const comparisonItem = comparisonData?.find((c) => c.benefit.id === item.benefit.id);
    const comparisonRate = comparisonItem?.data.ratePer1000 || item.benefit.nationalRatePer1000;
    
    // Use max of both values as reference for normalization
    const maxRate = Math.max(item.data.ratePer1000, comparisonRate, item.benefit.nationalRatePer1000);
    const normalizedMunicipality = maxRate > 0 ? (item.data.ratePer1000 / maxRate) * 100 : 0;
    const normalizedComparison = maxRate > 0 ? (comparisonRate / maxRate) * 100 : 0;
    
    return {
      benefit: item.benefit.name.length > 12 
        ? item.benefit.name.substring(0, 10) + "..." 
        : item.benefit.name,
      fullName: item.benefit.name,
      municipality: normalizedMunicipality,
      comparison: normalizedComparison,
      municipalityActual: item.data.ratePer1000,
      comparisonActual: comparisonRate,
      gap: ((item.data.ratePer1000 - comparisonRate) / comparisonRate) * 100,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length && payload[0].payload) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-2">{data.fullName}</p>
          <div className="space-y-1">
            <p className="text-primary">
              {municipalityName}: <span className="font-medium">{data.municipalityActual.toFixed(2)}</span>
            </p>
            <p className="text-muted-foreground">
              {comparisonName}: <span className="font-medium">{data.comparisonActual.toFixed(2)}</span>
            </p>
            <p className={data.gap > 0 ? "text-destructive" : "text-success"}>
              הפרש: <span className="font-medium">{data.gap > 0 ? "+" : ""}{data.gap.toFixed(1)}%</span>
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis
            dataKey="benefit"
            tick={{ fill: "hsl(var(--foreground))", fontSize: 11 }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            tickCount={5}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name={comparisonName}
            dataKey="comparison"
            stroke="hsl(var(--muted-foreground))"
            fill="hsl(var(--muted))"
            fillOpacity={0.3}
            strokeWidth={2}
            strokeDasharray="5 5"
          />
          <Radar
            name={municipalityName}
            dataKey="municipality"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.4}
            strokeWidth={2}
          />
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            iconType="circle"
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
