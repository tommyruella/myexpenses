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
    <div style={{
      maxWidth: 420,
      margin: "40px auto",
      fontFamily: "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,sans-serif",
      background: "#f9f9fa",
      borderRadius: 18,
      boxShadow: "0 4px 24px 0 #0001",
      padding: 32,
      border: "1px solid #e5e5ea"
    }}>
      <h1 style={{ textAlign: "center", fontWeight: 700, fontSize: 28, letterSpacing: -1, color: "#222", marginBottom: 24 }}>Tracker Spese</h1>
      <form onSubmit={handleSubmit} style={{ marginBottom: 28, display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Descrizione"
          value={form.descrizione}
          onChange={e => setForm(f => ({ ...f, descrizione: e.target.value }))}
          required
          style={{
            border: "1px solid #e5e5ea",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 16,
            background: "#fff",
            outline: "none",
            transition: "border .2s",
            boxShadow: "0 1px 2px #0001"
          }}
        />
        <input
          type="number"
          placeholder="Importo"
          value={form.importo}
          onChange={e => setForm(f => ({ ...f, importo: e.target.value }))}
          required
          style={{
            border: "1px solid #e5e5ea",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 16,
            background: "#fff",
            outline: "none",
            transition: "border .2s",
            boxShadow: "0 1px 2px #0001"
          }}
        />
        <input
          type="date"
          value={form.data_spesa}
          onChange={e => setForm(f => ({ ...f, data_spesa: e.target.value }))}
          required
          style={{
            border: "1px solid #e5e5ea",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 16,
            background: "#fff",
            outline: "none",
            transition: "border .2s",
            boxShadow: "0 1px 2px #0001"
          }}
        />
        <input
          placeholder="Categoria"
          value={form.categoria}
          onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
          required
          style={{
            border: "1px solid #e5e5ea",
            borderRadius: 8,
            padding: "10px 14px",
            fontSize: 16,
            background: "#fff",
            outline: "none",
            transition: "border .2s",
            boxShadow: "0 1px 2px #0001"
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            background: "#007aff",
            color: "#fff",
            border: 0,
            borderRadius: 8,
            padding: "12px 0",
            fontWeight: 600,
            fontSize: 16,
            boxShadow: "0 1px 2px #0001",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background .2s"
          }}
        >
          Aggiungi
        </button>
      </form>
      <h2 style={{ textAlign: "center", fontWeight: 600, fontSize: 20, color: "#222", marginBottom: 12 }}>Spese</h2>
      {loading ? <p style={{ textAlign: "center", color: "#888" }}>Caricamento...</p> : null}
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
            <span style={{ color: "#222", fontSize: 15 }}>{spesa.importo} €</span>
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
  );
}
