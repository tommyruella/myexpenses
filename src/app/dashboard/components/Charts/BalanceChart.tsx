import React from "react";

export interface BalanceChartData {
  date: string;
  saldo: number;
}

interface BalanceChartProps {
  data: BalanceChartData[];
  showAxes?: boolean;
  scale?: number;
}

export default function BalanceChart({ data, showAxes = false, scale = 1 }: BalanceChartProps) {
  const width = 400;
  const height = 180;
  const padding = 24;
  const saldoVals = data.map(d => d.saldo);
  const minSaldo = Math.min(...saldoVals);
  const maxSaldo = Math.max(...saldoVals);
  const range = maxSaldo - minSaldo || 1;
  // Responsive: su mobile svg fluido e centrato
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 600;
  // SVG sempre fluido, viewBox fisso, width 100% su desktop/mobile
  const svgWidth = 420;
  const svgHeight = 180;
  const svgStyle = { width: '100%', height: isMobile ? 140 : 180, display: 'block', maxWidth: '100vw' };
  const w = svgWidth * scale;
  const h = svgHeight * scale;
  const pad = padding * scale;
  // Calcolo punti: l'ultimo punto arriva esattamente a w-pad (bordo destro visibile)
  const pts = data.length === 1
    ? [{ x: w / 2, y: h / 2 }]
    : data.map((d, i) => {
        const x = pad + i * ((w - 2 * pad) / (data.length - 1));
        const y = h - pad - ((d.saldo - minSaldo) / range) * (h - 2 * pad);
        return { x, y };
      });
  const line = pts.map(p => `${p.x},${p.y}`).join(' ');
  const area = [
    `${pts[0].x},${h - pad}`,
    ...pts.map(p => `${p.x},${p.y}`),
    `${pts[pts.length - 1].x},${h - pad}`
  ].join(' ');
  return (
    <svg
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      style={svgStyle}
      preserveAspectRatio="xMidYMid meet"
    >
      {showAxes && (
        <>
          <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#181818" strokeWidth={1.5} opacity={0.5} />
          <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#181818" strokeWidth={1.5} opacity={0.5} />
        </>
      )}
      <polygon points={area} fill="#181818" opacity={0.08} />
      <polyline
        fill="none"
        stroke="#181818"
        strokeWidth={scale === 1 ? 2 : 3}
        points={line}
        style={{ filter: 'blur(0.2px)' }}
      />
    </svg>
  );
}
