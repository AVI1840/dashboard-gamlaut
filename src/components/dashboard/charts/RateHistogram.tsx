import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { BenefitType } from "@/data/welfareData";

interface RateHistogramProps {
  data: Array<{ municipality: { name: string }; data: { ratePer1000: number } }>;
  benefitType: BenefitType;
}

export function RateHistogram({ data, benefitType }: RateHistogramProps) {
  // Create histogram bins
  const rates = data.map((d) => d.data.ratePer1000);
  const minRate = Math.min(...rates);
  const maxRate = Math.max(...rates);
  const binCount = 15;
  const binSize = (maxRate - minRate) / binCount;

  const bins = Array.from({ length: binCount }, (_, i) => {
    const start = minRate + i * binSize;
    const end = start + binSize;
    const count = data.filter(
      (d) => d.data.ratePer1000 >= start && d.data.ratePer1000 < end
    ).length;
    
    const isAboveAverage = (start + end) / 2 > benefitType.nationalRatePer1000;
    
    return {
      range: `${start.toFixed(0)}-${end.toFixed(0)}`,
      start,
      end,
      count,
      fill: isAboveAverage ? "hsl(var(--destructive))" : "hsl(var(--success))",
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-1">טווח: {data.range}</p>
          <p className="text-muted-foreground">
            רשויות: <span className="font-medium">{data.count}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bins} margin={{ top: 10, right: 30, left: 10, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            dataKey="range"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            height={60}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            label={{
              value: "מספר רשויות",
              angle: -90,
              position: "insideLeft",
              fill: "hsl(var(--muted-foreground))",
              fontSize: 12,
            }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {bins.map((entry, index) => (
              <Bar key={`bar-${index}`} dataKey="count" fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
