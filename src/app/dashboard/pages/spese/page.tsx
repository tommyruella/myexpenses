"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/navbar/Navbar";
import "../../../globals.css";
import ExpensesList from "./ExpensesList";
import FloatingMenu from "../../components/FloatingMenu/FloatingMenu";
import "../../components/FloatingMenu/floatingmenu.css";
import AddExpenseModal from "../../components/Modal/AddExpenseModal";
import ExpenseCard from "../../components/ExpenseCard";
import Modal from "../../components/Modal/Modal";

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
        <ExpensesList
          spese={filteredSpese}
          onExpenseClick={setSelectedExpense}
        />
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
