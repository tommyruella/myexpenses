"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";

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
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="list-inside list-decimal text-sm/6 text-center sm:text-left font-[family-name:var(--font-geist-mono)]">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] px-1 py-0.5 rounded font-[family-name:var(--font-geist-mono)] font-semibold">
              src/app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
      <div style={{ maxWidth: 500, margin: "2rem auto", fontFamily: "sans-serif" }}>
        <h1>Tracker Spese</h1>
        <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
          <input
            placeholder="Descrizione"
            value={form.descrizione}
            onChange={(e) =>
              setForm((f) => ({ ...f, descrizione: e.target.value }))
            }
            required
            style={{ marginRight: 8 }}
          />
          <input
            type="number"
            placeholder="Importo"
            value={form.importo}
            onChange={(e) =>
              setForm((f) => ({ ...f, importo: e.target.value }))
            }
            required
            style={{ marginRight: 8, width: 80 }}
          />
          <input
            type="date"
            value={form.data_spesa}
            onChange={(e) =>
              setForm((f) => ({ ...f, data_spesa: e.target.value }))
            }
            required
            style={{ marginRight: 8 }}
          />
          <input
            placeholder="Categoria"
            value={form.categoria}
            onChange={(e) =>
              setForm((f) => ({ ...f, categoria: e.target.value }))
            }
            required
            style={{ marginRight: 8 }}
          />
          <button type="submit" disabled={loading}>
            Aggiungi
          </button>
        </form>
        <h2>Spese</h2>
        {loading ? <p>Caricamento...</p> : null}
        <ul style={{ padding: 0, listStyle: "none" }}>
          {spese.map((spesa) => (
            <li
              key={spesa.id}
              style={{
                marginBottom: 12,
                borderBottom: "1px solid #eee",
                paddingBottom: 8,
              }}
            >
              <b>{spesa.descrizione}</b> - {spesa.importo}€
              <br />
              <small>
                {spesa.data_spesa} | {spesa.categoria}
              </small>
              <br />
              <button
                onClick={() => handleDelete(spesa.id)}
                disabled={loading}
                style={{ marginTop: 4 }}
              >
                Elimina
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
