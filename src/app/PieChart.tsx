import React from "react";

interface PieChartProps {
  percent: number; // 0-100
  label: string;
}

const PieChart: React.FC<PieChartProps> = ({ percent, label }) => {
  // Calcola l'arco
  const r = 32;
  const c = 2 * Math.PI * r;
  const value = Math.max(0, Math.min(percent, 100));
  const offset = c * (1 - value / 100);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 80 }}>
      <svg width={70} height={70} viewBox="0 0 70 70">
        <circle
          cx={35}
          cy={35}
          r={r}
          fill="none"
          stroke="#eee"
          strokeWidth={7}
        />
        <circle
          cx={35}
          cy={35}
          r={r}
          fill="none"
          stroke="#181818"
          strokeWidth={7}
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s' }}
        />
      </svg>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#181818', marginTop: 2 }}>{label}</span>
      <span style={{ fontSize: 13, color: '#888', marginTop: 0 }}>{Math.round(percent)}%</span>
    </div>
  );
};

export default PieChart;
