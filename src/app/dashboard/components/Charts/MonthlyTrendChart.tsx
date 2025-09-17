import React from "react";
import styles from "./MonthlyTrendChart.module.css";
import "../../pages/expenses/expensespage.css"

interface MonthlyTrendChartProps {
  data: { month: string; total: number }[];
}

export default function MonthlyTrendChart({ data }: MonthlyTrendChartProps) {
  const chartData = data.slice(-8).reverse();
  const max = Math.max(...chartData.map(d => d.total), 1);

  return (
    <div>
      <div className={styles.list}>
        {chartData.map(({ month, total }) => {
          const widthPercent = Math.max(6, (total / max) * 100); // percentuale minima per visibilità (0-100)
          return (
            <div key={month} className={styles.row}>
              <span className={styles.month}>{month.slice(5)}</span>

              <div
                className={styles.bar}
                style={{ width: `${widthPercent}%` }}
              />

              <span className={styles.value}>€{total.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}