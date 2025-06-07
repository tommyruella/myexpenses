"use client";
import React, { useEffect, useState } from "react";
import { DynamicExpenseModal, SpeseList, BalanceCards, BalanceChart } from "./components";
import "./globals.css";

interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
  tipo: "USCITA" | "ENTRATA";
}

const CATEGORIES = ["FOOD", "TRANSPORT", "FITNESS", "MISC"];

export default function Home() {
  const [spese, setSpese] = useState<Spesa[]>([]);
  const [form, setForm] = useState({
    descrizione: "",
    importo: "",
    data_spesa: "",
    categoria: CATEGORIES[0],
    tipo: "USCITA" as "USCITA" | "ENTRATA",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSpese();
  }, []);

  async function fetchSpese() {
    setLoading(true);
    try {
      const res = await fetch("/api/spese");
      const data = await res.json();
      if (Array.isArray(data)) {
        setSpese(data);
      } else {
        setSpese([]);
      }
    } catch {
      setSpese([]);
    }
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/spese", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        descrizione: form.descrizione,
        importo: parseFloat(form.importo),
        data_spesa: form.data_spesa,
        categoria: form.categoria,
        tipo: form.tipo,
      }),
    });
    setForm({ descrizione: "", importo: "", data_spesa: "", categoria: CATEGORIES[0], tipo: "USCITA" });
    fetchSpese();
  }

  async function handleDelete(id: number) {
    setLoading(true);
    await fetch(`/api/spese/${id}`, { method: "DELETE" });
    fetchSpese();
  }

  // Calcolo saldo, entrate, uscite
  const saldo = spese.reduce((acc, s) => acc + (s.tipo === "ENTRATA" ? s.importo : -s.importo), 0);
  const entrate = spese.filter(s => s.tipo === "ENTRATA").reduce((acc, s) => acc + s.importo, 0);
  const uscite = spese.filter(s => s.tipo === "USCITA").reduce((acc, s) => acc + s.importo, 0);

  return (
    <div style={{
      minHeight: "100vh",
      width: "100vw",
      background: "#fff",
      fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      color: "#181818",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* Header decorativo */}
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
      {/* Balance + entrate/uscite in linea */}
      <BalanceCards saldo={saldo} entrate={entrate} uscite={uscite} />
      {/* Lista spese + grafico affiancati */}
      <main style={{
        width: '100vw',
        flex: 1,
        padding: '0 12px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        minHeight: 0,
        paddingLeft: 100,
        paddingRight: 100,
        gap: 48,
      }}>
        {/* Colonna spese */}
        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 32, marginBottom: 18 }}>
            <span style={{
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: -1.5,
              color: '#181818',
              fontFamily: 'inherit',
              lineHeight: 1.1,
              margin: 0,
              padding: 0,
              whiteSpace: 'nowrap',
            }}>
              last expenses
            </span>
          </div>
          <SpeseList spese={spese} onDelete={handleDelete} loading={loading} />
        </div>
        {/* Colonna grafico */}
        <div style={{ width: '50%', minWidth: 260, maxWidth: 420, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 32, marginBottom: 18 }}>
            <span style={{
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: -1.5,
              color: '#181818',
              fontFamily: 'inherit',
              lineHeight: 1.1,
              margin: 0,
              padding: 0,
              whiteSpace: 'nowrap',
            }}>
              balance chart
            </span>
          </div>
          <BalanceChart saldo={saldo} />
        </div>
      </main>
      <DynamicExpenseModal
        form={form}
        setForm={setForm}
        loading={loading}
        onSubmit={handleSubmit}
      />
      {/* Footer minimal */}
      <footer style={{
        width: '100vw',
        padding: '18px 0 12px 0',
        textAlign: 'center',
        color: '#bbb',
        fontSize: 14,
        letterSpacing: 0.2,
        fontWeight: 500,
        margin: 0,
      }}>
        <span>© {new Date().getFullYear()} Spese Minimal</span>
      </footer>
    </div>
  );
}
