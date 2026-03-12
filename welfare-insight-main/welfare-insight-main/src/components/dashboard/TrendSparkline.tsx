import React, { memo } from "react";

interface TrendSparklineProps {
  values: (number | null)[];
  width?: number;
  height?: number;
  change: number | null;
}

/**
 * SVG-only sparkline – no chart library.
 * Uses 3 year-points (2023, 2024, 2025).
 */
export const TrendSparkline = memo(function TrendSparkline({
  values,
  width = 56,
  height = 24,
  change,
}: TrendSparklineProps) {
  const valid = values.filter((v): v is number => v !== null);
  if (valid.length < 2) {
    return <span className="text-xs text-muted-foreground">—</span>;
  }

  const min = Math.min(...valid);
  const max = Math.max(...valid);
  const range = max - min || 1;

  const pts = values
    .map((v, i) => {
      if (v === null) return null;
      const x = (i / (values.length - 1)) * (width - 4) + 2;
      const y = height - 2 - ((v - min) / range) * (height - 4);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .filter(Boolean);

  // Color via strokeClass on foreignObject doesn't work in SVG;
  // we pass a CSS-var compatible stroke value
  const stroke = getSparklineStroke(change);

  return (
    <svg
      width={width}
      height={height}
      className="shrink-0"
      aria-hidden="true"
    >
      <polyline
        points={pts.join(" ")}
        fill="none"
        stroke={stroke}
        strokeWidth={1.8}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {pts.map((pt, i) => {
        if (!pt) return null;
        const [x, y] = pt.split(",").map(Number);
        return <circle key={i} cx={x} cy={y} r={1.5} fill={stroke} />;
      })}
    </svg>
  );
});

/** Arrow indicator for trend direction */
export function TrendArrow({ change }: { change: number | null }) {
  if (change === null)
    return <span className="text-muted-foreground text-xs">—</span>;
  if (change > 5)
    return <span className="text-gap-high font-bold text-base">↑</span>;
  if (change < -5)
    return <span className="text-primary font-bold text-base">↓</span>;
  return <span className="text-muted-foreground font-bold text-base">→</span>;
}

// Sparkline stroke colors – must be literal for SVG attribute
function getSparklineStroke(change: number | null): string {
  if (change === null) return "#9ca3af";
  if (change > 15) return "#7f1d1d"; // very high increase → very dark red
  if (change > 5) return "#c2410c";  // moderate increase → orange-red
  if (change < -15) return "#1e3a8a"; // very high decrease → very dark blue
  if (change < -5) return "#1d4ed8";  // moderate decrease → blue
  return "#6b7280"; // neutral
}
