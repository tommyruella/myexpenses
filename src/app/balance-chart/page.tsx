"use client";

import React, { useEffect, useState } from "react";
import { BalanceChart } from "../components";
import { useRouter } from "next/navigation";
import { fetchSpese, computeChartData, Spesa } from "../../lib/balanceUtils";

export default function BalanceChartPage() {
  const [spese, setSpese] = useState<Spesa[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchSpese().then(data => {
      setSpese(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Inizializza il saldo a 1200
  const chartData = computeChartData(spese, 1200);
  const chartDataToShow = chartData.length > 0 ? chartData : [{ date: new Date().toISOString().slice(0, 10), saldo: 1200 }];

  return (
    <div style={{ minHeight: '100vh', width: '100vw', background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', position: 'relative' }}>
      <header style={{
        width: "100vw",
        padding: "32px 0 0 0",
        background: "none",
        textAlign: "center",
        position: "relative",
        height: 120,
        overflow: "hidden",
        margin: 0,
      }}>
        <h1 style={{
          fontSize: 110,
          fontWeight: 800,
          letterSpacing: -2,
          margin: 0,
          color: "#181818",
          fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
          position: "absolute",
          top: "-70px",
          left: "50%",
          transform: "translateX(-50%)",
          opacity: 1,
          whiteSpace: "nowrap",
          width: "120vw",
          minWidth: 900,
          pointerEvents: "none",
          userSelect: "none",
        }}>
          Tommy Tegamino&apos;s Stats
        </h1>
      </header>
      <button onClick={() => router.back()} style={{ position: 'absolute', top: 32, left: 32, fontSize: 28, background: 'none', border: 'none', color: '#181818', cursor: 'pointer' }}>&larr;</button>
      <h2 style={{ fontSize: 38, fontWeight: 800, letterSpacing: -1.5, color: '#181818', marginBottom: 32, marginTop: 120 }}>Balance Chart</h2>
      <div style={{ width: '70vw', maxWidth: 900, minWidth: 320 }}>
        {loading ? <div style={{fontSize: 22, color: '#bbb', textAlign: 'center'}}>Caricamento...</div> : <BalanceChart data={chartDataToShow} showAxes={true} scale={2} />}
      </div>
    </div>
  );
}
