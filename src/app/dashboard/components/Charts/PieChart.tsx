import React from "react";
import "../../pages/spese/expensespage.css"

interface PieChartProps {
  percent: number; // 0-100
  label: string;
}

const PieChart: React.FC<PieChartProps> = ({ percent, label }) => {
  const r = 24;
  const c = 2 * Math.PI * r;
  const value = Math.max(0, Math.min(percent, 100));
  // Inizio dall'alto: -Math.PI/2
  const offset = c * (1 - value / 100);
  const rotation = -90; // gradi
  const color = '#181818';

  return (
    <div>
      <div style={{ position: 'relative', width: 70, height: 70, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}>
        <svg width={70} height={70} viewBox="0 0 70 70" style={{ transform: `rotate(${rotation}deg)` }}>
          <circle
            cx={35}
            cy={35}
            r={r}
            fill="none"
            stroke="#ececec"
            strokeWidth={7}
          />
          <circle
            cx={35}
            cy={35}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth={7}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(.4,2,.6,1)' }}
          />
        </svg>
        <span style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 500, fontSize: 14, color: color, pointerEvents: 'none', fontFamily: 'Inter, ui-sans-serif' }}>{Math.round(percent)}%</span>
      </div>
      <span style={{ fontSize: 13, fontWeight: 700, color: '#181818', marginTop: 8, letterSpacing: 0 }}>{label}</span>
    </div>
  );
};

export default PieChart;
