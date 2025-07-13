import React from "react";
import "../../pages/spese/expensespage.css"

interface MonthlyTrendChartProps {
  data: { month: string; total: number }[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data.slice(-8).reverse(); // Inverti l'ordine qui per mostrare gli ultimi 8 mesi
  const max = Math.max(...chartData.map(d => d.total), 1);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {chartData.map(({ month, total }) => (
          <div
            key={month}
            style={{
              display: "grid",
              gridTemplateColumns: "48px 1fr 64px",
              alignItems: "center",
              gap: 8,
              fontFamily:
                'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
            }}
          >
            {/* Mese */}
            <span
              style={{
                fontSize: 13,
                color: "#222",
                letterSpacing: 0.4,
                textTransform: "uppercase",
              }}
            >
              {month.slice(5)}
            </span>

            {/* Barra */}
            <div
              style={{
                background: "#eee",
                height: 10,
                border: "1px solid #000",
                borderRadius: 3,
                width: `${Math.max(24, (total / max) * 240)}px`,
                minWidth: 24,
                transition: "width 0.3s",
              }}
            />

            {/* Valore */}
            <span
              style={{
                fontSize: 13,
                color: "#111",
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
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