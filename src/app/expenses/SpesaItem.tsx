import React from "react";

interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
  tipo: "USCITA" | "ENTRATA";
}

interface SpesaItemProps {
  spesa: Spesa;
  onDelete: (id: number) => void;
  loading: boolean;
}

export default function SpesaItem({ spesa, onDelete, loading }: SpesaItemProps) {
  return (
    <li
      style={{
        background: "#fff",
        borderRadius: 6,
        marginBottom: 18,
        padding: 20,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        boxShadow: "none",
        border: spesa.tipo === "ENTRATA" ? "1.5px solidrgb(105, 172, 115)" : "1.5px solid #181818"
      }}
    >
      <div>
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 2, color: spesa.tipo === "ENTRATA" ? "#6adf7b" : "#181818" }}>{spesa.descrizione}</div>
        <div style={{ fontSize: 13, color: "#181818" }}>{spesa.data_spesa}   {spesa.categoria}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontWeight: 700, fontSize: 18, color: spesa.tipo === "ENTRATA" ? "#6adf7b" : '#181818', fontFamily: 'inherit' }}>
          {spesa.tipo === "ENTRATA" ? "+" : "-"}€{spesa.importo.toFixed(2)}
        </span>
        <button
          onClick={() => onDelete(spesa.id)}
          disabled={loading}
          style={{
            background: "none",
            border: "none",
            color: "#181818",
            fontWeight: 600,
            fontSize: 15,
            padding: "4px 0 4px 8px",
            cursor: "pointer",
            fontFamily: 'inherit',
            opacity: loading ? 0.5 : 1
          }}
        >
          x
        </button>
      </div>
    </li>
  );
}
