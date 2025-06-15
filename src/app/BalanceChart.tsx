import React from "react";

interface ChartPoint {
  date: string;
  saldo: number;
}

interface BalanceChartProps {
  data: ChartPoint[];
}

const BalanceChart: React.FC<BalanceChartProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  // Normalizza i dati per lo spazio SVG
  const width = 420;
  const height = 140;
  const padding = 24;
  const minSaldo = Math.min(...data.map(d => d.saldo));
  const maxSaldo = Math.max(...data.map(d => d.saldo));
  const saldoRange = maxSaldo - minSaldo || 1;

  // Calcola i punti
  const points = data.map((d, i) => {
    const x = padding + (i * (width - 2 * padding)) / (data.length - 1 || 1);
    const y = height - padding - ((d.saldo - minSaldo) * (height - 2 * padding)) / saldoRange;
    return `${x},${y}`;
  }).join(" ");

  // Area sotto la linea
  const area = [
    `${padding},${height - padding}`,
    ...data.map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (data.length - 1 || 1);
      const y = height - padding - ((d.saldo - minSaldo) * (height - 2 * padding)) / saldoRange;
      return `${x},${y}`;
    }),
    `${width - padding},${height - padding}`
  ].join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ display: 'block' }}>
      <polygon points={area} fill="#181818" opacity={0.07} />
      <polyline
        fill="none"
        stroke="#181818"
        strokeWidth={1}
        points={points}
      />
    </svg>
  );
};

export default BalanceChart;
