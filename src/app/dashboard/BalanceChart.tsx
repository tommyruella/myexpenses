import React from "react";

interface BalanceChartProps {
  saldo: number;
}

// Placeholder minimal chart: sostituibile con una vera chart in futuro
export default function BalanceChart({ saldo }: BalanceChartProps) {
  // In futuro: passare i dati storici come prop, qui mock per esempio
  const mockData = [
    { date: '2025-06-01', saldo: 1200 },
    { date: '2025-06-02', saldo: 1100 },
    { date: '2025-06-03', saldo: 1300 },
    { date: '2025-06-04', saldo: 900 },
    { date: '2025-06-05', saldo: 950 },
    { date: '2025-06-06', saldo: 1000 },
    { date: '2025-06-07', saldo: saldo },
  ];

  // Calcolo i punti per la linea
  const width = 320;
  const height = 120;
  const padding = 24;
  const saldoVals = mockData.map(d => d.saldo);
  const minSaldo = Math.min(...saldoVals);
  const maxSaldo = Math.max(...saldoVals);
  const range = maxSaldo - minSaldo || 1;
  const points = mockData.map((d, i) => {
    const x = padding + i * ((width - 2 * padding) / (mockData.length - 1));
    const y = height - padding - ((d.saldo - minSaldo) / range) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div style={{
      width: '100%',
      height: 180,
      background: '#fff',
      border: '1.5px solid #181818', // bordo nero sottile
      borderRadius: 6,
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: 18,
      boxSizing: 'border-box',
      fontFamily: 'inherit',
      marginLeft: 0,
    }}>
      <svg width={width} height={height} style={{ width: '100%', height: '120px', display: 'block' }}>
        {/* Linea saldo */}
        <polyline
          fill="none"
          stroke="#181818"
          strokeWidth="3"
          points={points}
        />
        {/* Cerchi per i punti */}
        {mockData.map((d, i) => {
          const x = padding + i * ((width - 2 * padding) / (mockData.length - 1));
          const y = height - padding - ((d.saldo - minSaldo) / range) * (height - 2 * padding);
          return <circle key={i} cx={x} cy={y} r={4} fill="#181818" />;
        })}
      </svg>
    </div>
  );
}
