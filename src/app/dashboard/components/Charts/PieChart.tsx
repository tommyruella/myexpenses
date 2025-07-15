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
  const offset = c * (1 - value / 100);
  const rotation = -90;
  const color = '#181818';

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      width: 80,
      margin: '0 auto',
    }}>
      <div style={{
        position: 'relative',
        width: 70,
        height: 70,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
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
        <span style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontWeight: 500,
          fontSize: 14,
          color: color,
          pointerEvents: 'none',
          fontFamily: 'Inter, ui-sans-serif, monospace',
        }}>
          {Math.round(percent)}%
        </span>
      </div>
      <span style={{
        fontSize: 13,
        fontWeight: 600,
        color: '#181818',
        marginTop: 8,
        letterSpacing: 0,
        textAlign: 'center',
        maxWidth: 70,
        lineHeight: 1.2,
      }}>
        {label}
      </span>
    </div>
  );
};

export default PieChart;