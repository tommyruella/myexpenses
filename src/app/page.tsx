"use client";
import React, { useEffect, useState } from "react";
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
  let saldo = 1200;
  let entrate = 0;
  let uscite = 0;
  for (const s of spese) {
    if (s.tipo === "ENTRATA") {
      saldo += s.importo;
      entrate += s.importo;
    } else {
      saldo -= s.importo;
      uscite += s.importo;
    }
  }

  // Calcolo storico saldo per il grafico (ordinato per data crescente)
  const sortedSpese = [...spese].sort((a, b) => a.data_spesa.localeCompare(b.data_spesa));
  let runningSaldo = 1200;
  const saldoHistory = sortedSpese.map(s => {
    runningSaldo += s.tipo === "ENTRATA" ? s.importo : -s.importo;
    return { date: s.data_spesa, saldo: runningSaldo };
  });
  // Se non ci sono spese, mostra almeno un punto
  const chartData = saldoHistory.length > 0 ? saldoHistory : [{ date: new Date().toISOString().slice(0, 10), saldo: 1200 }];

  return (
    <div className="dashboard-root">
      {/* Header decorativo */}
      <header className="dashboard-header">
        <h1 className="dashboard-title">Tommy Tegamino&apos;s Stats</h1>
      </header>
      {/* Griglia principale responsive */}
      <div className="dashboard-grid">
        {/* Prima riga: saldo + entrate/uscite */}
        <section className="dashboard-balance-row">
          <div className="balance-block">
            <span className="balance-label">current balance</span>
            <span className="balance-value">€{saldo.toFixed(2)}</span>
          </div>
          <div className="inout-blocks">
            <div className="in-block">
              <span className="in-value">+€{entrate.toFixed(2)}</span>
              <span className="in-label">Entrate</span>
            </div>
            <div className="out-block">
              <span className="out-value">-€{uscite.toFixed(2)}</span>
              <span className="out-label">Uscite</span>
            </div>
          </div>
        </section>
        {/* Seconda riga: spese recenti | grafici */}
        <main className="dashboard-main-row">
          <div className="expenses-list-block">
            <div className="section-title">last expenses</div>
            <ul className="expenses-list">
              {spese.map((spesa) => (
                <li key={spesa.id} className="expense-item">
                  <span className="expense-desc">{spesa.descrizione}</span>
                  <span className="expense-cat">{spesa.categoria}</span>
                  <span className={spesa.tipo === 'USCITA' ? 'expense-amount out' : 'expense-amount in'}>
                    {spesa.tipo === 'USCITA' ? '-' : '+'}€{spesa.importo.toFixed(2)}
                  </span>
                  <span className="expense-date">{spesa.data_spesa}</span>
                  <button
                    onClick={() => handleDelete(spesa.id)}
                    className="expense-delete"
                    disabled={loading}
                    aria-label="Elimina"
                  >×</button>
                </li>
              ))}
            </ul>
          </div>
          <div className="charts-block">
            <div className="section-title">balance chart</div>
            <div className="balance-chart-placeholder">(grafico saldo non disponibile)</div>
            <div className="piecharts-row">
              {CATEGORIES.map(cat => (
                <div key={cat} className="piechart-block">
                  {cat}
                  <span className="piechart-label">(non disp.)</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
      {/* Form aggiunta spesa minimal */}
      <form onSubmit={handleSubmit} className="expense-form">
        <input
          type="text"
          placeholder="Descrizione"
          value={form.descrizione}
          onChange={e => setForm(f => ({ ...f, descrizione: e.target.value }))}
          required
        />
        <input
          type="number"
          placeholder="Importo"
          value={form.importo}
          onChange={e => setForm(f => ({ ...f, importo: e.target.value }))}
          required
          min={0.01}
          step={0.01}
        />
        <input
          type="date"
          value={form.data_spesa}
          onChange={e => setForm(f => ({ ...f, data_spesa: e.target.value }))}
          required
        />
        <select
          value={form.categoria}
          onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
        >
          {CATEGORIES.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <select
          value={form.tipo}
          onChange={e => setForm(f => ({ ...f, tipo: e.target.value as "USCITA" | "ENTRATA" }))}
        >
          <option value="USCITA">Uscita</option>
          <option value="ENTRATA">Entrata</option>
        </select>
        <button
          type="submit"
          disabled={loading}
        >
          Aggiungi
        </button>
      </form>
      {/* Footer minimal */}
      <footer className="dashboard-footer">
        <span>© {new Date().getFullYear()} Spese Minimal</span>
      </footer>
    </div>
  );
}
