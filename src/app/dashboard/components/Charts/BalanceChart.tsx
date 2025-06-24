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
  const w = width * scale;
  const h = height * scale;
  const pad = padding * scale;
  const pts = data.map((d, i) => {
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
    <svg width={w} height={h} style={{ width: '100%', height: scale === 1 ? 180 : 100, display: 'block' }}>
      {showAxes && (
        <>
          <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="#181818" strokeWidth={1.5} opacity={0.5} />
          <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="#181818" strokeWidth={1.5} opacity={0.5} />
        </>
      )}
      {/* Area sotto la linea, più trasparente */}
      <polygon points={area} fill="#181818" opacity={0.08} />
      {/* Linea saldo, più sottile e smooth */}
      <polyline
        fill="none"
        stroke="#181818"
        strokeWidth={scale === 1 ? 2 : 3}
        points={line}
        style={{ filter: 'blur(0.2px)' }}
      />
      {/* Niente pallini, solo linea */}
      {/*
      {pts.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={scale === 1 ? 2 : 4} fill="#181818" opacity={0.25} />
      ))}
      */}
    </svg>
  );
}
