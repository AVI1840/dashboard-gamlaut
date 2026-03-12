import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { BenefitType, getGapColor } from "@/data/welfareData";

interface PopulationScatterChartProps {
  data: Array<{ municipality: { name: string; population: number }; data: { ratePer1000: number; gapPercentage: number } }>;
  benefitType: BenefitType;
}

export function PopulationScatterChart({ data, benefitType }: PopulationScatterChartProps) {
  const chartData = data.map((item) => ({
    name: item.municipality.name,
    population: item.municipality.population,
    rate: item.data.ratePer1000,
    gap: item.data.gapPercentage,
    fill: getGapColor(item.data.gapPercentage),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-2">{data.name}</p>
          <div className="space-y-1">
            <p className="text-muted-foreground">
              אוכלוסייה: <span className="font-medium">{data.population.toLocaleString("he-IL")}</span>
            </p>
            <p className="text-muted-foreground">
              שיעור ל-1000: <span className="font-medium">{data.rate.toFixed(2)}</span>
            </p>
            <p className="text-muted-foreground">
              פער: <span className="font-medium" style={{ color: data.fill }}>
                {data.gap > 0 ? "+" : ""}{data.gap.toFixed(1)}%
              </span>
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
        <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 60 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            dataKey="population"
            name="אוכלוסייה"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
            label={{
              value: "אוכלוסייה",
              position: "bottom",
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
          />
          <YAxis
            type="number"
            dataKey="rate"
            name="שיעור ל-1000"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            label={{
              value: "שיעור ל-1000",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine
            y={benefitType.nationalRatePer1000}
            stroke="hsl(var(--primary))"
            strokeDasharray="5 5"
            label={{
              value: `ממוצע ארצי: ${benefitType.nationalRatePer1000.toFixed(1)}`,
              position: "right",
              fill: "hsl(var(--primary))",
              fontSize: 11,
            }}
          />
          <Scatter data={chartData} />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}
