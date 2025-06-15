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
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2 className="modal-title">Aggiungi Spesa / Entrata</h2>
        <form onSubmit={onSubmit} className="modal-form" autoComplete="off">
          <input
            type="text"
            placeholder="Descrizione"
            value={form.descrizione}
            onChange={e => setForm(f => ({ ...f, descrizione: e.target.value }))}
            required
            maxLength={40}
            autoFocus
            className="modal-input"
          />
          <input
            type="number"
            placeholder="Importo (€)"
            value={form.importo}
            onChange={e => setForm(f => ({ ...f, importo: e.target.value }))}
            required
            min={0.01}
            step={0.01}
            className="modal-input"
            inputMode="decimal"
          />
          <input
            type="date"
            value={form.data_spesa}
            onChange={e => setForm(f => ({ ...f, data_spesa: e.target.value }))}
            required
            className="modal-input"
          />
          <select
            value={form.categoria}
            onChange={e => setForm(f => ({ ...f, categoria: e.target.value }))}
            className="modal-input"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={form.tipo}
            onChange={e => setForm(f => ({ ...f, tipo: e.target.value as "USCITA" | "ENTRATA" }))}
            className="modal-input"
          >
            <option value="USCITA">Uscita</option>
            <option value="ENTRATA">Entrata</option>
          </select>
          <button
            type="submit"
            disabled={loading}
            className="modal-submit"
          >
            Aggiungi
          </button>
        </form>
        <button className="modal-close" onClick={onClose} aria-label="Chiudi">×</button>
      </div>
    </div>
  );
};

export default AddExpenseModal;
