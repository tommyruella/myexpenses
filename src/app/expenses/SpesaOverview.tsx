import React from "react";

interface OverviewProps {
  spese: Array<{
    categoria: string;
    importo: number;
    tipo: "USCITA" | "ENTRATA";
  }>;
}

export default function SpesaOverview({ spese }: OverviewProps) {
  // Raggruppa per categoria e calcola totali
  const totals = spese.reduce((acc, s) => {
    if (!acc[s.categoria]) acc[s.categoria] = { entrata: 0, uscita: 0 };
    if (s.tipo === "ENTRATA") acc[s.categoria].entrata += s.importo;
    else acc[s.categoria].uscita += s.importo;
    return acc;
  }, {} as Record<string, { entrata: number; uscita: number }>);

  return (
    <div style={{
      display: 'flex',
      gap: 18,
      justifyContent: 'center',
      flexWrap: 'wrap',
      marginBottom: 24,
      padding: '12px 0',
      borderRadius: 14,
      background: '#f9fafb',
      boxShadow: '0 2px 12px 0 rgba(0,0,0,0.04)',
      fontFamily: 'inherit',
    }}>
      {Object.entries(totals).map(([cat, val]) => (
        <div key={cat} style={{ minWidth: 90, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>{cat}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#0fa' }}>+€{val.entrata.toFixed(2)}</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#f44' }}>-€{val.uscita.toFixed(2)}</div>
        </div>
      ))}
    </div>
  );
}
