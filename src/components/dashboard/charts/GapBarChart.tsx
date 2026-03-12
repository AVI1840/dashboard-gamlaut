import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
interface GapBarChartProps {
  data: Array<{ municipality: { name: string }; data: { recipientPercent: number; recipients?: number } }>;
  maxBars?: number;
}

export function GapBarChart({ data, maxBars = 20 }: GapBarChartProps) {
  // Sort by recipientPercent descending and take top N
  const sortedData = [...data]
    .sort((a, b) => b.data.recipientPercent - a.data.recipientPercent)
    .slice(0, maxBars);

  const chartData = sortedData.map((item) => ({
    name: item.municipality.name,
    percent: item.data.recipientPercent,
    recipients: item.data.recipients ?? 0,
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3 text-sm">
          <p className="font-semibold mb-1">{data.name}</p>
          <p className="text-muted-foreground">
            אחוז מקבלים: <span className="font-bold text-destructive">
              {data.percent.toFixed(1)}%
            </span>
          </p>
          <p className="text-muted-foreground">
            מספר מקבלים: <span className="font-medium">{data.recipients.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
          <XAxis
            type="number"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            tickFormatter={(value) => `${value}%`}
            domain={[0, 'auto']}
          />
          <YAxis
            type="category"
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
            width={95}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "hsl(var(--muted))" }} />
          <Bar dataKey="percent" radius={[0, 4, 4, 0]} fill="hsl(var(--destructive))" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
