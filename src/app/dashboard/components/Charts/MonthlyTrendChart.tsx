import React from "react";

interface MonthlyTrendChartProps {
  data: { month: string; total: number }[];
}

// Minimal bar chart, Apple-style, coerente con il sito
export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data.slice(-8);
  const max = Math.max(...chartData.map(d => d.total), 1);
  // Grigio usato nella lista spese: #ececec
  return (
    <div style={{ width: "100%", maxWidth: 480, margin: "0 auto" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {chartData.map(({ month, total }) => (
          <div key={month} style={{ display: "flex", alignItems: "center", gap: 18, minHeight: 28 }}>
            <span style={{ width: 44, fontSize: 15, color: "#181818", fontWeight: 700, letterSpacing: 0.5, textTransform: 'uppercase', fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif' }}>{month.slice(5)}</span>
            <div style={{
              border: "1.5px solid #ececec",
              borderRadius: 7,
              height: 16,
              width: `${Math.max(32, (total / max) * 240)}px`,
              minWidth: 32,
              background: '#fff',
              transition: "width 0.3s",
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }} />
            <span style={{
              color: '#181818',
              fontWeight: 900,
              fontSize: 15,
              letterSpacing: -0.5,
              fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              marginLeft: 10,
              minWidth: 54,
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
