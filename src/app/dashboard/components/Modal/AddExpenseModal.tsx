import React from "react";

interface AddExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  form: {
    descrizione: string;
    importo: string;
    data_spesa: string;
    categoria: string;
    tipo: "USCITA" | "ENTRATA";
  };
  setForm: React.Dispatch<React.SetStateAction<{
    descrizione: string;
    importo: string;
    data_spesa: string;
    categoria: string;
    tipo: "USCITA" | "ENTRATA";
  }>>;
  loading: boolean;
  categories: string[];
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ open, onClose, onSubmit, form, setForm, loading, categories }) => {
  React.useEffect(() => {
    if (open && !form.data_spesa) {
      const today = new Date().toISOString().slice(0, 10);
      setForm(f => ({ ...f, data_spesa: today }));
    }
    // eslint-disable-next-line
  }, [open]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(245,245,247,0.82)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s', cursor: 'pointer'
    }} onClick={onClose}>
      <div className="modal-content" style={{ position: 'relative', padding: 0, maxWidth: 400, width: '92vw', borderRadius: 18, boxShadow: '0 8px 32px rgba(0,0,0,0.13)', background: '#fff', cursor: 'auto', overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close" style={{ position: 'absolute', top: 18, right: 22, background: 'none', border: 'none', color: '#181818', fontSize: 32, fontWeight: 700, cursor: 'pointer', lineHeight: 1, opacity: 0.7, transition: 'opacity 0.18s' }}>&times;</button>
        <div style={{ padding: '38px 28px 28px 28px', display: 'flex', flexDirection: 'column', gap: 28 }}>
          <h2 style={{ fontFamily: 'Inter, ui-sans-serif', fontWeight: 900, fontSize: 30, letterSpacing: -1, color: '#181818', margin: 0, textAlign: 'left', lineHeight: 1.1 }}>Add <span style={{ color: '#888', fontWeight: 400, fontSize: 20 }}>Expense / Income</span></h2>
          <form onSubmit={onSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <label style={{ fontWeight: 700, fontSize: 15, color: '#181818', marginBottom: 2 }}>Amount (€)
              <input
                type="number"
                placeholder="Amount (€)"
                value={form.importo}
                onChange={e => {
                  const value = e.target.value;
                  if (value === '' || parseFloat(value) >= 0) setForm(f => ({ ...f, importo: value }));
                }}
                required
                min={0.01}
                step={0.01}
                inputMode="decimal"
                style={{ fontSize: 18, fontWeight: 500, border: 'none', borderBottom: '2px solid #eee', background: 'transparent', color: '#181818', padding: '8px 0', marginTop: 2, outline: 'none', width: '100%', transition: 'border-color 0.18s' }}
              />
            </label>
            <label style={{ fontWeight: 700, fontSize: 15, color: '#181818', marginBottom: 2 }}>Description
              <input
                type="text"
                placeholder="Description"
                value={form.descrizione}
                onChange={e => setForm(f => ({ ...f, descrizione: e.target.value }))}
                required
                maxLength={40}
                autoFocus
                style={{ fontSize: 18, fontWeight: 500, border: 'none', borderBottom: '2px solid #eee', background: 'transparent', color: '#181818', padding: '8px 0', marginTop: 2, outline: 'none', width: '100%', transition: 'border-color 0.18s' }}
              />
            </label>
            <label style={{ fontWeight: 700, fontSize: 15, color: '#181818', marginBottom: 2 }}>Date
              <input
                type="date"
                value={form.data_spesa}
                onChange={e => setForm(f => ({ ...f, data_spesa: e.target.value }))}
                required
                style={{ fontSize: 18, fontWeight: 500, border: 'none', borderBottom: '2px solid #eee', background: 'transparent', color: '#181818', padding: '8px 0', marginTop: 2, outline: 'none', width: '100%', transition: 'border-color 0.18s' }}
              />
            </label>
            <label style={{ fontWeight: 700, fontSize: 15, color: '#181818', marginBottom: 2 }}>Category
              <select
                value={form.categoria}
                onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
                style={{ fontSize: 18, fontWeight: 500, border: 'none', borderBottom: '2px solid #eee', background: 'transparent', color: '#181818', padding: '8px 0', marginTop: 2, outline: 'none', width: '100%', transition: 'border-color 0.18s' }}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>
            <label style={{ fontWeight: 700, fontSize: 15, color: '#181818', marginBottom: 2 }}>Type
              <select
                value={form.tipo}
                onChange={e => setForm(f => ({ ...f, tipo: e.target.value as "USCITA" | "ENTRATA" }))}
                style={{ fontSize: 18, fontWeight: 500, border: 'none', borderBottom: '2px solid #eee', background: 'transparent', color: '#181818', padding: '8px 0', marginTop: 2, outline: 'none', width: '100%', transition: 'border-color 0.18s' }}
              >
                <option value="USCITA">Expense</option>
                <option value="ENTRATA">Income</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{ fontSize: 20, fontWeight: 900, padding: '14px 0', borderRadius: 8, border: 'none', background: '#181818', color: '#fff', cursor: loading ? 'not-allowed' : 'pointer', marginTop: 18, letterSpacing: 1, transition: 'opacity 0.2s, background 0.18s', opacity: loading ? 0.5 : 1, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
            >
              Add
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddExpenseModal;
