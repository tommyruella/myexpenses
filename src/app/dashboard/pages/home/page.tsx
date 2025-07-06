"use client";
import React, { useEffect, useState } from "react";
import AddExpenseModal from "../../components/Modal/AddExpenseModal";
import BalanceChart from "../../components/Charts/BalanceChart";
// import PieChart from "../../components/Charts/PieChart";
import "./homepage.css";
import "../../components/FloatingMenu/floatingmenu.css";
import Navbar from "../../components/navbar/Navbar";
import FloatingMenu from "../../components/FloatingMenu/FloatingMenu";

interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
  tipo: "USCITA" | "ENTRATA";
}

const CATEGORIES = ["HANGOUT","CLOTH", "FOOD", "TRANSPORT", "TRAVEL", "OTHERS"];

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
        setSpese(data.map((s: Spesa) => ({ ...s, importo: Number((s as Spesa).importo) })));
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

  // async function handleDelete(id: number) {
  //   setLoading(true);
  //   await fetch(`/api/spese/${id}`, { method: "DELETE" });
  //   fetchSpese();
  // }

  // Mappa tutte le spese con categoria 'GYM' su 'OTHERS'
  const speseNormalizzate = spese.map(s =>
    s.categoria === 'GYM' ? { ...s, categoria: 'OTHERS' } : s
  );

  // Calcolo saldo, entrate, uscite
  let saldo = 1200;
  for (const s of speseNormalizzate) {
    if (s.tipo === "ENTRATA") {
      saldo += s.importo;
    } else {
      saldo -= s.importo;
    }
  }

  // Calcolo storico saldo per il grafico (ordinato per data crescente)
  const sortedSpese = [...speseNormalizzate].sort((a, b) => a.data_spesa.localeCompare(b.data_spesa));
  let runningSaldo = 1200;
  const saldoHistory = sortedSpese.map(s => {
    runningSaldo += s.tipo === "ENTRATA" ? s.importo : -s.importo;
    return { date: s.data_spesa, saldo: runningSaldo };
  });
  // Se non ci sono spese, mostra almeno un punto
  const chartData = saldoHistory.length > 0 ? saldoHistory : [{ date: new Date().toISOString().slice(0, 10), saldo: 1200 }];

  // Calcolo entrate e uscite mese corrente e precedente (logica ricreata da zero)
  const now = new Date();
  const padMonth = (m: number) => (m < 10 ? '0' + m : '' + m);
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const currentMonth = `${year}-${padMonth(month)}`;
  // Gestione mese precedente (anche cambio anno)
  let prevYear = year;
  let prevMonthNum = month - 1;
  if (prevMonthNum === 0) {
    prevMonthNum = 12;
    prevYear = year - 1;
  }
  const prevMonth = `${prevYear}-${padMonth(prevMonthNum)}`;

  let entrateMese = 0;
  let usciteMese = 0;
  let entrateMesePrec = 0;
  let usciteMesePrec = 0;

  for (const s of speseNormalizzate) {
    // Normalizza la data in formato YYYY-MM
    let spesaMonth = '';
    if (typeof s.data_spesa === 'string' && s.data_spesa.length >= 7) {
      spesaMonth = s.data_spesa.slice(0, 7);
    } else {
      // fallback: prova a parsare la data
      const d = new Date(s.data_spesa);
      if (!isNaN(d.getTime())) {
        spesaMonth = `${d.getFullYear()}-${padMonth(d.getMonth() + 1)}`;
      }
    }
    // DEBUG: log per ogni spesa
    console.log('[DEBUG] Spesa:', s, 'spesaMonth:', spesaMonth, 'currentMonth:', currentMonth, 'prevMonth:', prevMonth);
    if (spesaMonth === currentMonth) {
      if (s.tipo === 'ENTRATA') {
        entrateMese += Number(s.importo);
      } else {
        usciteMese += Number(s.importo);
      }
    } else if (spesaMonth === prevMonth) {
      if (s.tipo === 'ENTRATA') {
        entrateMesePrec += Number(s.importo);
      } else {
        usciteMesePrec += Number(s.importo);
      }
    }
  }

  // Log finale dei risultati
  console.log('[DEBUG] entrateMese:', entrateMese, 'usciteMese:', usciteMese, 'entrateMesePrec:', entrateMesePrec, 'usciteMesePrec:', usciteMesePrec);
  // Calcolo percentuali rispetto al mese precedente
  const entratePerc = entrateMesePrec === 0 ? null : ((entrateMese - entrateMesePrec) / entrateMesePrec) * 100;
  const uscitePerc = usciteMesePrec === 0 ? null : ((usciteMese - usciteMesePrec) / usciteMesePrec) * 100;

  return (
    <>
      <Navbar />
      <div className="dashboard-root">
        <div className="dashboard-grid">
          {/* Prima riga: saldo + entrate/uscite */}
          <section className="dashboard-balance-row">
            <div className="balance-block">
              <span className="balance-label">current balance</span>
              <span className="balance-value">€{saldo.toFixed(2)}</span>
            </div>
            <div className="inout-blocks">
              <div className="single-inout-block">
                <span className="inout-label">in</span>
                <div className="inout-value">
                  +€{entrateMese.toFixed(2)}
                  {/* Solo desktop: percentuale inline */}
                <div className="percentage-inout">
                    {entratePerc !== null && (
                      <span className={"perc-" + (entratePerc >= 0 ? "positive" : "negative")} style={{ fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        {(entratePerc ?? 0) > 0 && <span className="arrow-positive" style={{fontSize:18, lineHeight:1}}>&uarr;</span>}
                        {(entratePerc ?? 0) < 0 && <span className="arrow-negative" style={{fontSize:18, lineHeight:1}}>&darr;</span>}
                        {entratePerc !== null ? (entratePerc >= 0 ? '+' : '') + entratePerc.toFixed(1) + '%' : ''}
                      </span>
                    )}
                </div>
                </div>
              </div>
              <div className="single-inout-block">
                <span className="inout-label" style={{color: "gray"}}>out</span>
                <span className="inout-value" style={{color: "gray"}}>
                  -€{usciteMese.toFixed(2)}
                  {/* Solo desktop: percentuale inline */}
                  <span className="percentage-inout">
                    {uscitePerc !== null && (
                      <span className={"perc-" + (uscitePerc >= 0 ? "negative" : "positive")} style={{ fontSize: 15, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                        {(uscitePerc ?? 0) > 0 && <span className="arrow-negative" style={{fontSize:18, lineHeight:1}}>&uarr;</span>}
                        {(uscitePerc ?? 0) < 0 && <span className="arrow-positive" style={{fontSize:18, lineHeight:1}}>&darr;</span>}
                        {uscitePerc !== null ? (uscitePerc >= 0 ? '+' : '') + uscitePerc.toFixed(1) + '%' : ''}
                      </span>
                    )}
                  </span>
                </span>
              </div>
            </div>
          </section>
          {/* Seconda riga: spese recenti | grafici */}
          <main className="dashboard-main-row">
            <div className="expenses-list-block">
              <div className="section-title">
                last expenses
                <a href="/dashboard/pages/spese" aria-label="Go to all expenses" style={{display:'inline-flex',alignItems:'center',marginLeft:6, color:'#181818', textDecoration:'none', transition:'color 0.18s'}}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" style={{transform:'rotate(45deg)'}}>
                    <path d="M12 19V5"/>
                    <path d="M5 12l7-7 7 7"/>
                  </svg>
                </a>
              </div>
              <ul className="expenses-list">
                {[...speseNormalizzate].sort((a, b) => b.data_spesa.localeCompare(a.data_spesa)).slice(0, 5).map((spesa) => (
                  <li key={spesa.id} className="expense-item">
                    <span className="expense-desc">{spesa.descrizione}</span>
                    <span className="expense-cat">{spesa.categoria}</span>
                    <span className={spesa.tipo === 'USCITA' ? 'expense-amount out' : 'expense-amount in'}>
                      {spesa.tipo === 'USCITA' ? '-' : '+'}€{spesa.importo.toFixed(2)}
                    </span>
                    <span className="expense-date">{spesa.data_spesa}</span>
                    {/* Pulsante elimina rimosso dalla homepage */}
                  </li>
                ))}
              </ul>
            </div>
            <div className="chart-block">
              <div className="section-title">balance chart</div>
              <div className="balance-chart-container">
                <BalanceChart data={chartData} />
              </div>
              {/* PieChart rimossi dalla home */}
            </div>
          </main>
        </div>
        <AddExpenseModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          loading={loading}
          categories={CATEGORIES}
        />
        <FloatingMenu onAddClick={() => setModalOpen(true)} />
      </div>
    </>
  );
}
