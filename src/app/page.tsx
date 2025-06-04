"use client";
import React, { useEffect, useState } from "react";

const CATEGORIE = ["CIBO", "MEZZI", "GYM", "OTHERS"];

interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
  tipo: "USCITA" | "ENTRATA";
}

function getSaldoIniziale() {
  return 1000;
}

function calcolaSaldo(spese: Spesa[]) {
  let saldo = getSaldoIniziale();
  for (const s of spese) {
    saldo += s.tipo === "ENTRATA" ? Number(s.importo) : -Number(s.importo);
  }
  return saldo;
}

function getStats(spese: Spesa[]) {
  const totali: Record<string, number> = {};
  for (const cat of CATEGORIE) totali[cat] = 0;
  let entrate = 0,
    uscite = 0;
  for (const s of spese) {
    if (s.tipo === "USCITA") {
      totali[s.categoria] += Number(s.importo);
      uscite += Number(s.importo);
    } else {
      entrate += Number(s.importo);
    }
  }
  return { totali, entrate, uscite };
}

export default function Home() {
  const [spese, setSpese] = useState<Spesa[]>([]);
  const [form, setForm] = useState({
    descrizione: "",
    importo: "",
    data_spesa: "",
    categoria: CATEGORIE[0],
    tipo: "USCITA" as "USCITA" | "ENTRATA",
  });
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);

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
      } else if (data && data.error) {
        setSpese([]);
        alert("Errore API: " + data.error);
      } else {
        setSpese([]);
        alert("Errore sconosciuto nella risposta API");
      }
    } catch (err) {
      setSpese([]);
      alert("Errore di rete o server: " + (err as Error).message);
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
    setForm({ descrizione: "", importo: "", data_spesa: "", categoria: CATEGORIE[0], tipo: "USCITA" });
    setModal(false);
    fetchSpese();
  }

  async function handleDelete(id: number) {
    setLoading(true);
    await fetch(`/api/spese/${id}`, { method: "DELETE" });
    fetchSpese();
  }

  const saldo = calcolaSaldo(spese);
  const stats = getStats(spese);

  return (
    <div style={{ minHeight: "100vh", background: "#f7f8fa", fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,sans-serif" }}>
      {/* Hero Section */}
      <div style={{ padding: 32, textAlign: "center", background: "#fff", borderBottom: "1px solid #eee" }}>
        <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 8 }}>Il tuo Conto</h1>
        <div style={{ fontSize: 48, fontWeight: 700, color: saldo >= 0 ? "#007aff" : "#ff3b30", marginBottom: 8 }}>{saldo.toFixed(2)} €</div>
        <div style={{ color: "#888", fontSize: 16 }}>Saldo iniziale: 1000 €</div>
      </div>

      {/* Statistiche */}
      <div style={{ display: "flex", justifyContent: "center", gap: 32, margin: "32px 0" }}>
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px #0001", padding: 20, minWidth: 120 }}>
          <div style={{ color: "#888", fontSize: 14 }}>Entrate</div>
          <div style={{ color: "#2ecc40", fontWeight: 600, fontSize: 22 }}>{stats.entrate.toFixed(2)} €</div>
        </div>
        <div style={{ background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px #0001", padding: 20, minWidth: 120 }}>
          <div style={{ color: "#888", fontSize: 14 }}>Uscite</div>
          <div style={{ color: "#ff3b30", fontWeight: 600, fontSize: 22 }}>{stats.uscite.toFixed(2)} €</div>
        </div>
      </div>

      {/* Grafico a barre minimal per categoria */}
      <div style={{ maxWidth: 420, margin: "0 auto 32px auto", background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px #0001", padding: 24 }}>
        <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Spese per categoria</h3>
        {CATEGORIE.map(cat => (
          <div key={cat} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 15 }}>
              <span>{cat}</span>
              <span>{stats.totali[cat].toFixed(2)} €</span>
            </div>
            <div style={{ height: 8, background: "#f1f2f6", borderRadius: 4, marginTop: 4 }}>
              <div style={{ width: `${stats.totali[cat] / (stats.uscite || 1) * 100}%`, background: "#007aff", height: 8, borderRadius: 4, transition: "width .3s" }} />
            </div>
          </div>
        ))}
      </div>

      {/* Lista spese */}
      <div style={{ maxWidth: 420, margin: "0 auto 80px auto", background: "#fff", borderRadius: 12, boxShadow: "0 1px 4px #0001", padding: 24 }}>
        <h3 style={{ fontWeight: 600, fontSize: 18, marginBottom: 16 }}>Movimenti</h3>
        <ul style={{ padding: 0, listStyle: "none", margin: 0 }}>
          {spese.map((spesa) => (
            <li
              key={spesa.id}
              onClick={() => setActiveId(spesa.id)}
              style={{
                marginBottom: 10,
                border: activeId === spesa.id ? "2px solid #007aff" : "1px solid #e5e5ea",
                borderRadius: 12,
                background: activeId === spesa.id ? "#eaf1fe" : "#fff",
                boxShadow: activeId === spesa.id ? "0 2px 8px #007aff22" : "0 1px 2px #0001",
                padding: 16,
                cursor: "pointer",
                transition: "all .18s",
                display: "flex",
                flexDirection: "column",
                gap: 2
              }}
            >
              <span style={{ fontWeight: 600, fontSize: 16 }}>{spesa.descrizione}</span>
              <span style={{ color: spesa.tipo === "ENTRATA" ? "#2ecc40" : "#222", fontSize: 15 }}>{spesa.tipo === "ENTRATA" ? "+" : "-"}{spesa.importo} €</span>
              <span style={{ fontSize: 13, color: "#888" }}>{spesa.data_spesa} | {spesa.categoria}</span>
              {activeId === spesa.id && (
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(spesa.id); }}
                  disabled={loading}
                  style={{
                    marginTop: 10,
                    background: "#ff3b30",
                    color: "white",
                    border: 0,
                    borderRadius: 6,
                    padding: "6px 18px",
                    fontWeight: 500,
                    fontSize: 15,
                    boxShadow: "0 1px 2px #0001",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background .2s"
                  }}
                >
                  Elimina
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setModal(true)}
        style={{
          position: "fixed",
          right: 24,
          bottom: 24,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#007aff",
          color: "#fff",
          fontSize: 36,
          border: 0,
          boxShadow: "0 2px 8px #007aff44",
          cursor: "pointer",
          zIndex: 1000
        }}
        aria-label="Aggiungi movimento"
      >
        +
      </button>

      {/* Modal inserimento */}
      {modal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "#0007", zIndex: 2000,
          display: "flex", alignItems: "center", justifyContent: "center"
        }} onClick={() => setModal(false)}>
          <form
            onClick={e => e.stopPropagation()}
            onSubmit={handleSubmit}
            style={{ background: "#fff", borderRadius: 16, padding: 32, minWidth: 320, boxShadow: "0 4px 24px #0002", display: "flex", flexDirection: "column", gap: 16 }}
          >
            <h2 style={{ textAlign: "center", fontWeight: 600, fontSize: 22, marginBottom: 8 }}>Nuovo movimento</h2>
            <input
              placeholder="Descrizione"
              value={form.descrizione}
              onChange={e => setForm(f => ({ ...f, descrizione: e.target.value }))}
              required
              style={{ border: "1px solid #e5e5ea", borderRadius: 8, padding: "10px 14px", fontSize: 16, background: "#fff", outline: "none", transition: "border .2s", boxShadow: "0 1px 2px #0001" }}
            />
            <input
              type="number"
              placeholder="Importo"
              value={form.importo}
              onChange={e => setForm(f => ({ ...f, importo: e.target.value }))}
              required
              style={{ border: "1px solid #e5e5ea", borderRadius: 8, padding: "10px 14px", fontSize: 16, background: "#fff", outline: "none", transition: "border .2s", boxShadow: "0 1px 2px #0001" }}
            />
            <input
              type="date"
              value={form.data_spesa}
              onChange={e => setForm(f => ({ ...f, data_spesa: e.target.value }))}
              required
              style={{ border: "1px solid #e5e5ea", borderRadius: 8, padding: "10px 14px", fontSize: 16, background: "#fff", outline: "none", transition: "border .2s", boxShadow: "0 1px 2px #0001" }}
            />
            <select
              value={form.categoria}
              onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
              required
              style={{ border: "1px solid #e5e5ea", borderRadius: 8, padding: "10px 14px", fontSize: 16, background: "#fff", outline: "none", transition: "border .2s", boxShadow: "0 1px 2px #0001" }}
            >
              {CATEGORIE.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={form.tipo}
              onChange={e => setForm(f => ({ ...f, tipo: e.target.value as "USCITA" | "ENTRATA" }))}
              style={{ border: "1px solid #e5e5ea", borderRadius: 8, padding: "10px 14px", fontSize: 16, background: "#fff", outline: "none", transition: "border .2s", boxShadow: "0 1px 2px #0001" }}
            >
              <option value="USCITA">Uscita</option>
              <option value="ENTRATA">Entrata</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              style={{ background: "#007aff", color: "#fff", border: 0, borderRadius: 8, padding: "12px 0", fontWeight: 600, fontSize: 16, boxShadow: "0 1px 2px #0001", cursor: loading ? "not-allowed" : "pointer", transition: "background .2s" }}
            >
              Salva
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
