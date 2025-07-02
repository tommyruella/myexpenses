import React from "react";

interface MonthlyTrendChartProps {
  data: { month: string; total: number }[];
}

// Minimal bar chart, Apple-style, coerente con il sito
export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data.slice(-8);
  const max = Math.max(...chartData.map(d => d.total), 1);
  return (
    <div style={{ width: "100%", maxWidth: 400, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {chartData.map(({ month, total }) => (
          <div key={month} style={{ display: "flex", alignItems: "center", gap: 14, minHeight: 22 }}>
            <span style={{ width: 38, fontSize: 13, color: "#181818", fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}>{month.slice(5)}</span>
            <div style={{
              border: "1px solid #181818",
              borderRadius: 99,
              height: 8,
              width: `${Math.max(16, (total / max) * 180)}px`,
              minWidth: 16,
              background: '#fff',
              transition: "width 0.3s",
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }} />
            <span style={{
              color: '#181818',
              fontWeight: 900,
              fontSize: 13,
              letterSpacing: -0.5,
              fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              marginLeft: 8,
              minWidth: 44,
              textAlign: 'right',
              display: 'inline-block'
            }}>
              €{total.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
