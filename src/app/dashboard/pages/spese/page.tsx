"use client";
import React, { useState } from "react";
import { SpeseProvider, useSpese } from "../../context/SpeseContext";
import Navbar from "../../components/navbar/Navbar";
import FiltersBar from "./FiltersBar";
import ExpensesList from "./ExpensesList";
import FloatingMenu from "../../components/FloatingMenu/FloatingMenu";
import AddExpenseModal from "../../components/Modal/AddExpenseModal";
import ExpenseCard from "../../components/ExpenseCard";
import MonthlyTrendChart from "../../components/Charts/MonthlyTrendChart";
import PieChart from "../../components/Charts/PieChart";
import "../../components/FloatingMenu/floatingmenu.css";
import "./expenses.module.css";


import type { Spesa } from "../../context/SpeseContext";

const CATEGORIES = ["HANGOUT", "CLOTH", "FOOD", "TRANSPORT", "TRAVEL", "EARNINGS", "OTHERS"];

function getPieData(spese: Spesa[]) {
  const uscitaTotale = spese.reduce(
    (acc, s) => (s.tipo === "USCITA" ? acc + s.importo : acc),
    0
  );
  // Escludi la categoria EARNINGS dai pie chart
  return CATEGORIES.filter(cat => cat !== "EARNINGS").map((cat) => {
    const catTotale = spese.reduce(
      (acc, s) => (s.tipo === "USCITA" && s.categoria === cat ? acc + s.importo : acc),
      0
    );
    const percent = uscitaTotale > 0 ? (catTotale / uscitaTotale) * 100 : 0;
    return { cat, percent };
  });
}


function SpesePageInner() {
  const { spese, loading, fetchSpese } = useSpese();
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("");
  const [filterType, setFilterType] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState<{
    descrizione: string;
    importo: string;
    data_spesa: string;
    categoria: string;
    tipo: "USCITA" | "ENTRATA";
  }>({
    descrizione: "",
    importo: "",
    data_spesa: "",
    categoria: "OTHERS",
    tipo: "USCITA",
  });
  const [selectedExpense, setSelectedExpense] = useState<Spesa | null>(null);
  const [sortOrder, setSortOrder] = useState("");

  React.useEffect(() => {
    if (filterType === "ENTRATA") {
      setFilterCat("OTHERS");
    }
  }, [filterType]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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


  // Normalizza le categorie (GYM -> OTHERS) come in home
  const speseNormalizzate = spese.map((s: Spesa) =>
    s.categoria === 'GYM' ? { ...s, categoria: 'OTHERS' } : s
  );

  const monthlyTotals: { [month: string]: number } = {};
  speseNormalizzate.forEach((s: Spesa) => {
    if (s.tipo === "USCITA") {
      const month = s.data_spesa.slice(0, 7);
      monthlyTotals[month] = (monthlyTotals[month] || 0) + s.importo;
    }
  });
  const monthlyTrend = Object.entries(monthlyTotals)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-6)
    .map(([month, total]) => ({ month, total }));

  let filteredSpese = speseNormalizzate;
  if (search.trim() !== "") {
    filteredSpese = speseNormalizzate.filter((s: Spesa) =>
      s.descrizione.toLowerCase().includes(search.toLowerCase())
    );
  } else {
    filteredSpese = speseNormalizzate.filter((s: Spesa) => {
      const matchesCat = filterCat === "" || s.categoria === filterCat;
      const matchesType = filterType === "" || s.tipo === filterType;
      return matchesCat && matchesType;
    });
  }

  let sortedSpese = filteredSpese;
  if (sortOrder === "asc") sortedSpese = [...filteredSpese].sort((a, b) => a.importo - b.importo);
  else if (sortOrder === "desc") sortedSpese = [...filteredSpese].sort((a, b) => b.importo - a.importo);

  return (
    <>
      <Navbar />
      <div style={{
        width: "100%",
        maxWidth: "min(90vw)",
        justifyContent: "center",
        margin: "0 auto",
        padding: "32px 0 0 0",
        minHeight: "80vh",
      }}>
        <div className="expenses-fullsize-layout">
          <div className="expenses-list-col-full">
            <div style={{ marginBottom: 8 }}>
              <span className="balance-label" style={{ fontSize: 52, fontWeight: 900, color: "#181818" }}>
                details
              </span>
            </div>
            <FiltersBar
              search={search}
              setSearch={setSearch}
              filterCat={filterCat}
              setFilterCat={setFilterCat}
              filterType={filterType}
              setFilterType={setFilterType}
              categories={CATEGORIES}
              sortOrder={sortOrder}
              setSortOrder={setSortOrder}
            />
            <ExpensesList spese={sortedSpese} onExpenseClick={setSelectedExpense} pageSize={7} />
          </div>

          <div className="trend-pie-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 32,
            alignItems: 'flex-start',
            justifyContent: 'center',
            marginTop: 14
          }}>
            <div style={{ minWidth: 260 }}>
              <div style={{ fontWeight: 900, fontSize: 52, marginBottom: 22, color: '#181818' }}>trend</div>
              <MonthlyTrendChart data={monthlyTrend} />
            </div>
            <div style={{ minWidth: 260 }}>
              <div style={{ fontWeight: 900, fontSize: 52, marginBottom: 22, color: '#181818' }}>pie charts</div>
              <div className="piecharts-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 12,
              }}>
                {getPieData(spese).map(({ cat, percent }) => (
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
          categories={CATEGORIES}
        />

        {selectedExpense && (
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
            <div style={{ position: 'relative' }} onClick={(e) => e.stopPropagation()}>
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
        )}

        {/* FloatingMenu sempre in fondo alla pagina, sopra ogni overlay/modal */}
        <FloatingMenu onAddClick={() => setModalOpen(true)} />
      </div>
    </>
  );
}

export default function SpesePage() {
  return (
    <SpeseProvider>
      <SpesePageInner />
    </SpeseProvider>
  );
}