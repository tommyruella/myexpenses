import React from "react";
import "../../pages/spese/expensespage.css"

interface MonthlyTrendChartProps {
  data: { month: string; total: number }[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data.slice(-8).reverse();
  const max = Math.max(...chartData.map(d => d.total), 1);

  return (
    <div>
      <div style={{ minWidth: "max-content", display: "flex", flexDirection: "column", gap: 14, marginTop: 14 }}>
        {chartData.map(({ month, total }) => (
          <div
            key={month}
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr 64px",
              alignItems: "center",
              gap: 8,
              fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {/* Valore - allineato a sinistra */}
            <span
              style={{
                fontSize: 13,
                color: "#222",
                letterSpacing: 0.4,
                textTransform: "uppercase",
                textAlign: "left",
              }}
            >
              {month.slice(5)}
            </span>

            {/* Barra - più corta */}
            <div
              style={{
                background: "#eee",
                height: 10,
                border: "1px solid #000",
                borderRadius: 2,
                width: `${Math.max(20, (total / max) * 180)}px`, // Barre più corte
                minWidth: 20,
              }}
            />

            <span
              style={{
                fontSize: 13,
                color: "#111",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
                fontFamily: "Menlo, Monaco, 'Courier New', monospace",
              }}
            >
              €{total.toFixed(2)}
            </span>      
          </div>
        ))}
      </div>
    </div>
  );
}