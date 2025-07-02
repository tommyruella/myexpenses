"use client";
import PieChart from "../../components/Charts/PieChart";

// Calcolo percentuali per PieChart (solo USCITA)
const CATEGORIES = ["HANGOUT","CLOTH", "FOOD", "TRANSPORT", "TRAVEL", "OTHERS"];
function getPieData(spese: Spesa[]) {
  const uscitaTotale = spese.reduce((acc: number, s: Spesa) => s.tipo === 'USCITA' ? acc + s.importo : acc, 0);
  return CATEGORIES.map(cat => {
    const catTotale = spese.reduce((acc: number, s: Spesa) => (s.tipo === 'USCITA' && s.categoria === cat) ? acc + s.importo : acc, 0);
    const percent = uscitaTotale > 0 ? (catTotale / uscitaTotale) * 100 : 0;
    return { cat, percent };
  });
}
// ...existing code...
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import "../../../globals.css";
import ExpensesList from "./ExpensesList";
import FloatingMenu from "../../components/FloatingMenu/FloatingMenu";
import "../../components/FloatingMenu/floatingmenu.css";
import AddExpenseModal from "../../components/Modal/AddExpenseModal";
import ExpenseCard from "../../components/ExpenseCard";
import MonthlyTrendChart from "../../components/Charts/MonthlyTrendChart";

interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
  tipo: "USCITA" | "ENTRATA";
}

export default function SpesePage() {
  const [spese, setSpese] = useState<Spesa[]>([]);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    descrizione: "",
    importo: "",
    data_spesa: "",
    categoria: "OTHERS",
    tipo: "USCITA" as "USCITA" | "ENTRATA",
  });
  const [loading, setLoading] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<Spesa | null>(null);

  useEffect(() => {
    fetchSpese();
  }, []);

  async function fetchSpese() {
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
    setForm({ descrizione: "", importo: "", data_spesa: "", categoria: "OTHERS", tipo: "USCITA" });
    setModalOpen(false);
    fetchSpese();
  }

  // Calcolo trend mensile (ultimi 6 mesi)
  const monthlyTotals: { [month: string]: number } = {};
  spese.forEach(s => {
    if (s.tipo === "USCITA") {
      const month = s.data_spesa.slice(0, 7); // YYYY-MM
      monthlyTotals[month] = (monthlyTotals[month] || 0) + s.importo;
    }
  });
  const monthlyTrend = Object.entries(monthlyTotals)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, total]) => ({ month, total }));

  // Applica ricerca e filtri
  const filteredSpese = spese.filter((s) => {
    const matchesSearch =
      search === "" ||
      s.descrizione.toLowerCase().includes(search.toLowerCase()) ||
      s.categoria.toLowerCase().includes(search.toLowerCase());
    const matchesCat = filterCat === "" || s.categoria === filterCat;
    const matchesType = filterType === "" || s.tipo === filterType;
    return matchesSearch && matchesCat && matchesType;
  });

  // Mostra SEMPRE la lista spese, e sopra la card centrata se selezionata
  return (
    <>
      <Navbar />
      <div
        className="spese-page-root"
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "32px 0 0 0",
          minHeight: "80vh",
          position: 'relative',
        }}
      >
        {/* Desktop: lista spese full width, trend sotto; Mobile: layout colonna */}
        <div className="expenses-fullsize-layout">
          {/* Filtri rimossi da qui, ora sono solo sotto il titolo */}
          <div className="expenses-list-col-full">
            <div className="balance-block" style={{marginBottom: 8, marginLeft: 0}}>
              <span className="balance-label" style={{fontSize: 52, fontWeight: 900, color: '#181818', marginBottom: 5, letterSpacing: 0, textTransform: 'none'}}>
                details
              </span>
            </div>
            <div className="filters-bar">
              <input
                type="text"
                placeholder="Cerca descrizione o categoria..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="filter-search-input"
              />
              <div className="filters-row-below">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-type-select"
                >
                  <option value="">Tutte le tipologie</option>
                  <option value="USCITA">USCITA</option>
                  <option value="ENTRATA">ENTRATA</option>
                </select>
                <select
                  value={filterCat}
                  onChange={(e) => setFilterCat(e.target.value)}
                  className="filter-cat-select"
                >
                  <option value="">Tutte le categorie</option>
                  {[...new Set(spese.map((s) => s.categoria))].map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  className="filter-extra-select"
                  onChange={e => {
                    const v = e.target.value;
                    if (v === "asc") {
                      setSpese([...spese].sort((a, b) => a.importo - b.importo));
                    } else if (v === "desc") {
                      setSpese([...spese].sort((a, b) => b.importo - a.importo));
                    } else {
                      fetchSpese();
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">Ordina per valore</option>
                  <option value="asc">Dal più basso</option>
                  <option value="desc">Dal più alto</option>
                </select>
              </div>
            </div>
            <ExpensesList
              spese={filteredSpese}
              onExpenseClick={setSelectedExpense}
              pageSize={7}
            />
          </div>
          <div className="trend-pie-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: 32
          }}>
            <div style={{minWidth: 260, width: '100%'}}>
              <div style={{ fontWeight: 900, fontSize: 52, marginBottom: 22, color: '#181818', letterSpacing: 0, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif', textTransform: 'none', textAlign: 'left' }}>
                trend
              </div>
              <MonthlyTrendChart data={monthlyTrend} />
            </div>
            <div style={{minWidth: 260, width: '100%'}}>
              <div style={{ fontWeight: 900, fontSize: 52, marginBottom: 22, color: '#181818', letterSpacing: 0, fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif', textTransform: 'none', textAlign: 'left' }}>
                pie charts
              </div>
              <div className="piecharts-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
                justifyItems: 'center',
                alignItems: 'start',
                width: '100%'
              }}>
                {getPieData(spese).map(({cat, percent}) => (
                  <PieChart key={cat} percent={percent} label={cat} />
                ))}
              </div>
            </div>
          </div>
        </div>
        <AddExpenseModal
          open={modalOpen && !selectedExpense}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          form={form}
          setForm={setForm}
          loading={loading}
          categories={["HANGOUT","CLOTH", "FOOD", "TRANSPORT", "TRAVEL", "OTHERS"]}
        />
        {selectedExpense && (
          <React.Fragment>
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0,0,0,0.10)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onClick={() => setSelectedExpense(null)}
            >
              <div style={{ position: 'relative' }} onClick={e => e.stopPropagation()}>
                <ExpenseCard
                  expense={{
                    id: selectedExpense.id,
                    amount: selectedExpense.importo,
                    description: selectedExpense.descrizione,
                    date: selectedExpense.data_spesa,
                    category: selectedExpense.categoria,
                  }}
                  onRemove={() => {
                    fetch(`/api/spese/${selectedExpense.id}`, { method: 'DELETE' })
                      .then(() => fetchSpese());
                    setSelectedExpense(null);
                  }}
                />
              </div>
            </div>
          </React.Fragment>
        )}
        <FloatingMenu onAddClick={() => setModalOpen(true)} />
      </div>
    </>
  );
}
