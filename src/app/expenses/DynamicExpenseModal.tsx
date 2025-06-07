import React, { useState } from "react";

const CATEGORIES = ["FOOD", "TRANSPORT", "FITNESS", "MISC"];

interface DynamicExpenseModalProps {
  form: {
    descrizione: string;
    importo: string;
    data_spesa: string;
    categoria: string;
    tipo: "USCITA" | "ENTRATA";
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function DynamicExpenseModal({ form, setForm, loading, onSubmit }: DynamicExpenseModalProps) {
  const [open, setOpen] = useState(false);

  // Blocca lo scroll sotto il modal
  React.useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div style={{ position: 'fixed', left: 16, bottom: 24, zIndex: 2002, display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'auto' }}>
      {/* Floating button */}
      <button
        aria-label={open ? "Chiudi" : "Aggiungi spesa"}
        onClick={() => setOpen(v => !v)}
        style={{
          width: 52,
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          background: '#fff',
          color: '#181818',
          border: '2px solid #181818',
          boxShadow: 'none',
          fontSize: 28,
          fontWeight: 800,
          cursor: 'pointer',
          outline: 'none',
          fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
        className="animate-glow focus-ring"
      >
        <span style={{ fontSize: 32, fontWeight: 900, lineHeight: 1, color: '#181818', fontFamily: 'inherit' }}>+</span>
      </button>
      {/* Modal animato */}
      {open && (
        <div
          aria-modal="true"
          role="dialog"
          tabIndex={-1}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 2000,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            background: "rgba(24,24,24,0.18)",
            pointerEvents: "auto",
          }}
          className="animate-fade-in"
          onClick={() => setOpen(false)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="animate-scale-in animate-slide-up"
            style={{
              background: "#fff",
              borderRadius: 22,
              boxShadow: "none",
              border: "2px solid #181818",
              padding: "32px 20px 24px 20px",
              minWidth: 0,
              width: "100%",
              maxWidth: 400,
              margin: "0 12px 32px 12px",
              position: "relative",
              fontFamily: 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
              color: '#181818',
              animation: 'scale-in 0.3s cubic-bezier(0.16,1,0.3,1), slide-up 0.4s cubic-bezier(0.16,1,0.3,1)',
            }}
          >
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 22, fontFamily: 'inherit', color: '#181818', textAlign: 'center' }}>nuova spesa</h2>
            <form
              onSubmit={e => {
                onSubmit(e);
                setOpen(false);
              }}
              style={{ display: "flex", flexDirection: "column", gap: 18 }}
            >
              <input
                type="text"
                placeholder="descrizione"
                value={form.descrizione}
                onChange={e => setForm((f: any) => ({ ...f, descrizione: e.target.value }))}
                required
                style={{ padding: 10, border: 0, borderBottom: "2px solid #181818", outline: "none", fontSize: 17, fontFamily: 'inherit', background: 'none', color: '#181818' }}
              />
              <input
                type="number"
                step="0.01"
                placeholder="importo"
                value={form.importo}
                onChange={e => setForm((f: any) => ({ ...f, importo: e.target.value }))}
                required
                style={{ padding: 10, border: 0, borderBottom: "2px solid #181818", outline: "none", fontSize: 17, fontFamily: 'inherit', background: 'none', color: '#181818' }}
              />
              <input
                type="date"
                value={form.data_spesa}
                onChange={e => setForm((f: any) => ({ ...f, data_spesa: e.target.value }))}
                required
                style={{ padding: 10, border: 0, borderBottom: "2px solid #181818", outline: "none", fontSize: 17, fontFamily: 'inherit', background: 'none', color: '#181818' }}
              />
              <select
                value={form.categoria}
                onChange={e => setForm((f: any) => ({ ...f, categoria: e.target.value }))}
                style={{ padding: 10, border: 0, borderBottom: "2px solid #181818", outline: "none", fontSize: 17, fontFamily: 'inherit', background: 'none', color: '#181818' }}
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <select
                value={form.tipo}
                onChange={e => setForm((f: any) => ({ ...f, tipo: e.target.value as "USCITA" | "ENTRATA" }))}
                style={{ padding: 10, border: 0, borderBottom: "2px solid #181818", outline: "none", fontSize: 17, fontFamily: 'inherit', background: 'none', color: '#181818' }}
              >
                <option value="USCITA">uscita</option>
                <option value="ENTRATA">entrata</option>
              </select>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: "#181818",
                  color: "#fff",
                  border: 0,
                  borderRadius: 6,
                  padding: "12px 0",
                  fontWeight: 600,
                  fontSize: 17,
                  marginTop: 10,
                  cursor: "pointer",
                  fontFamily: 'inherit',
                  letterSpacing: 0.5
                }}
              >
                salva
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  background: "none",
                  color: "#181818",
                  border: 0,
                  borderRadius: 6,
                  padding: "10px 0",
                  fontWeight: 500,
                  fontSize: 16,
                  cursor: "pointer",
                  fontFamily: 'inherit'
                }}
              >
                annulla
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
