"use client";
import React, { useEffect, useState } from "react";

interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
}

export default function Home() {
  const [spese, setSpese] = useState<Spesa[]>([]);
  const [form, setForm] = useState({
    descrizione: "",
    importo: "",
    data_spesa: "",
    categoria: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSpese();
  }, []);

  async function fetchSpese() {
    setLoading(true);
    const res = await fetch("/api/spese");
    const data = await res.json();
    setSpese(data || []);
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
      }),
    });
    setForm({ descrizione: "", importo: "", data_spesa: "", categoria: "" });
    fetchSpese();
  }

  async function handleDelete(id: number) {
    setLoading(true);
    await fetch(`/api/spese/${id}`, { method: "DELETE" });
    fetchSpese();
  }

  return (
    <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center", marginBottom: 24 }}>Tracker Spese</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 24, display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        <input
          placeholder="Descrizione"
          value={form.descrizione}
          onChange={(e) => setForm((f) => ({ ...f, descrizione: e.target.value }))}
          required
          style={{ flex: 2, minWidth: 100 }}
        />
        <input
          type="number"
          placeholder="Importo"
          value={form.importo}
          onChange={(e) => setForm((f) => ({ ...f, importo: e.target.value }))}
          required
          style={{ width: 80 }}
        />
        <input
          type="date"
          value={form.data_spesa}
          onChange={(e) => setForm((f) => ({ ...f, data_spesa: e.target.value }))}
          required
        />
        <input
          placeholder="Categoria"
          value={form.categoria}
          onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
          required
          style={{ flex: 1, minWidth: 80 }}
        />
        <button type="submit" disabled={loading} style={{ minWidth: 90 }}>
          Aggiungi
        </button>
      </form>
      <h2 style={{ textAlign: "center", marginBottom: 12 }}>Spese</h2>
      {loading ? <p style={{ textAlign: "center" }}>Caricamento...</p> : null}
      <ul style={{ padding: 0, listStyle: "none" }}>
        {spese.map((spesa) => (
          <li
            key={spesa.id}
            style={{
              marginBottom: 12,
              borderBottom: "1px solid #eee",
              paddingBottom: 8,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              background: "#fafbfc",
              borderRadius: 6,
              padding: 12,
            }}
          >
            <span style={{ fontWeight: 600 }}>{spesa.descrizione}</span>
            <span style={{ color: "#444", fontSize: 15 }}>{spesa.importo} €</span>
            <span style={{ fontSize: 13, color: "#888" }}>{spesa.data_spesa} | {spesa.categoria}</span>
            <button
              onClick={() => handleDelete(spesa.id)}
              disabled={loading}
              style={{ marginTop: 6, background: "#e53e3e", color: "white", border: 0, borderRadius: 4, padding: "4px 12px", cursor: "pointer" }}
            >
              Elimina
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
