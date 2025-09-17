import React from "react";
import styles from "./PieChart.module.css";
import "../../pages/expenses/expensespage.css"

interface PieChartProps {
  percent: number; // 0-100
  label: string;
  size?: number; // pixels
  thickness?: number; // stroke width in px
  color?: string; // foreground color
  bgColor?: string; // background circle color
  animate?: boolean;
}

const clamp = (v: number, a = 0, b = 100) => Math.max(a, Math.min(b, v));

const PieChart: React.FC<PieChartProps> = ({ percent, label, size = 72, thickness = 7, color = '#181818', bgColor = '#ececec', animate = true }) => {
  const value = clamp(percent, 0, 100);
  const r = 24; // radius in SVG coordinate space
  const c = 2 * Math.PI * r;
  const offset = c * (1 - value / 100);

  const cssVars: Record<string, string> = {
    '--pie-size': `${size}px`,
    '--pie-color': color,
    '--pie-bg': bgColor,
    '--pie-thickness': `${thickness}px`,
  };

  return (
    <div className={styles.root} style={cssVars as React.CSSProperties} role="group" aria-label={`${label} ${Math.round(value)} percento`}>
      <div className={styles.svgWrapper}>
        <svg width={size} height={size} viewBox="0 0 70 70" aria-hidden="true">
          <circle
            className={styles.circleBg}
            cx={35}
            cy={35}
            r={r}
            fill="none"
            strokeWidth={thickness}
          />
          <circle
            className={styles.circleFg}
            cx={35}
            cy={35}
            r={r}
            fill="none"
            strokeWidth={thickness}
            strokeDasharray={c}
            strokeDashoffset={offset}
            style={{ transition: animate ? undefined : 'none' }}
          />
        </svg>
        <span className={styles.percentLabel} aria-hidden>{Math.round(value)}%</span>
      </div>
      <span className={styles.caption}>{label}</span>
    </div>
  );
};

export default PieChart;