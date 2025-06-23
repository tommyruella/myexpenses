"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import "../globals.css";
import ExpensesList from "./ExpensesList";

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
        }}
      >
        <h1
          className="section-title all-expenses-mobile-margin"
          style={{
            fontSize: 38,
            marginBottom: 32,
            textAlign: "left",
          }}
        >
          All Expenses
        </h1>
        <div
          className="filters-row filters-mobile-margin"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 24,
            marginRight: 20,
          }}
        >
          <input
            type="text"
            placeholder="Search description or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="expense-input filter-search-input"
            style={{ minWidth: 180, flex: 2 }}
          />
          <select
            value={filterCat}
            onChange={(e) => setFilterCat(e.target.value)}
            className="expense-input filter-cat-select"
            style={{ minWidth: 120 }}
          >
            <option value="">All categories</option>
            {[...new Set(spese.map((s) => s.categoria))].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="expense-input filter-type-select"
            style={{ minWidth: 120 }}
          >
            <option value="">All types</option>
            <option value="USCITA">USCITA</option>
            <option value="ENTRATA">ENTRATA</option>
          </select>
        </div>
        <ExpensesList spese={filteredSpese} />
      </div>
    </>
  );
}
