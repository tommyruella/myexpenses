"use client";
import React, { useEffect, useState } from "react";
import AddExpenseModal from "./dashboard/components/AddExpenseModal";
import BalanceChart from "./BalanceChart";
import PieChart from "./PieChart";
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
  const [modalOpen, setModalOpen] = useState(false);

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
        <div className="dashboard-title marquee">
          <div className="marquee-inner">
            <span>TommyTegamino&apos;s tracker_</span>
            <span>TommyTegamino&apos;s tracker_</span>
            <span>TommyTegamino&apos;s tracker_</span>
            <span>TommyTegamino&apos;s tracker_</span>
            <span>TommyTegamino&apos;s tracker_</span>
            <span>TommyTegamino&apos;s tracker_</span>
            <span>TommyTegamino&apos;s tracker_</span>
            <span>TommyTegamino&apos;s tracker_</span>
          </div>
        </div>
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
              <span className="in-label">in</span>
              <span className="in-value">+€{entrate.toFixed(2)}</span>
            </div>
            <div className="out-block">
              <span className="out-label">out</span>
              <span className="out-value">-€{uscite.toFixed(2)}</span>
            </div>
          </div>
        </section>
        {/* Seconda riga: spese recenti | grafici */}
        <main className="dashboard-main-row">
          <div className="expenses-list-block">
            <div className="section-title">last expenses</div>
            <ul className="expenses-list">
              {[...spese].sort((a, b) => b.data_spesa.localeCompare(a.data_spesa)).slice(0, 5).map((spesa) => (
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
            <div className="balance-chart-container">
              <BalanceChart data={chartData} />
            </div>
            <div className="piecharts-row">
              {CATEGORIES.map(cat => {
                const uscitaTotale = spese.filter(s => s.tipo === 'USCITA').reduce((acc, s) => acc + s.importo, 0);
                const catTotale = spese.filter(s => s.tipo === 'USCITA' && s.categoria === cat).reduce((acc, s) => acc + s.importo, 0);
                const percent = uscitaTotale > 0 ? (catTotale / uscitaTotale) * 100 : 0;
                return (
                  <PieChart key={cat} percent={percent} label={cat} />
                );
              })}
            </div>
          </div>
        </main>
      </div>
      <button className="floating-add-btn" onClick={() => setModalOpen(true)}>
        + Aggiungi spesa
      </button>
      <AddExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        form={form}
        setForm={setForm}
        loading={loading}
        categories={CATEGORIES}
      />
      {/* Footer minimal */}
      <footer className="dashboard-footer">
        <span>© {new Date().getFullYear()} Spese Minimal</span>
      </footer>
    </div>
  );
}
