"use client";
import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "../home/homepage.css"; // Importa lo stile della homepage per mantenere la coerenza

interface Spesa {
  id: number;
  descrizione: string;
  importo: number;
  data_spesa: string;
  categoria: string;
  tipo: "USCITA" | "ENTRATA";
}

interface ExpensesListProps {
  spese: Spesa[];
  onExpenseClick?: (spesa: Spesa) => void;
  pageSize?: number;
}

export default function ExpensesList({ spese, onExpenseClick, pageSize = 7 }: ExpensesListProps) {
  const [page, setPage] = useState(0);
  const sorted = [...spese].sort((a, b) => b.data_spesa.localeCompare(a.data_spesa));
  const totalPages = Math.ceil(sorted.length / pageSize);
  const start = page * pageSize;
  const visible = sorted.slice(start, start + pageSize);

  function prevPage() {
    setPage((p) => Math.max(0, p - 1));
  }
  function nextPage() {
    setPage((p) => Math.min(totalPages - 1, p + 1));
  }

  // Calcola il totale delle spese filtrate (ENTRATA/USCITA con segno)
  const totalFiltered = spese.reduce((acc, s) => acc + (s.tipo === 'USCITA' ? -s.importo : s.importo), 0);

  return (
    <div >
      <ul className="expenses-list" style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%' }}>
        {spese.length === 0 && <li>No expenses found.</li>}
        {visible.map((spesa) => (
          <li
            key={spesa.id}
            className="expense-item"
            onClick={() => onExpenseClick && onExpenseClick(spesa)}
            style={{
                      minWidth: 'unset',
                      width: '100%',
                      ...(onExpenseClick ? { cursor: 'pointer' } : {})
                    }}
          >
            <span className="expense-desc">{spesa.descrizione}</span>
            <span className="expense-cat">{spesa.categoria}</span>
            <span className={spesa.tipo === 'USCITA' ? 'expense-amount out' : 'expense-amount in'}>
              {spesa.tipo === 'USCITA' ? '-' : '+'}€{spesa.importo.toFixed(2)}
            </span>
            <span className="expense-date">{spesa.data_spesa}</span>
          </li>
        ))}
      </ul>
      <div className="expenses-pagination-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 20, width: '100%' }}>
        <span style={{ fontWeight: 600, fontSize: 16, color: '#222', minWidth: 120, textAlign: 'left' }}>
          TOTAL: <span style={{ color: totalFiltered < 0 ? '#fecaca' : '#a7f3d0' }}>{totalFiltered >= 0 ? '+' : ''}€{totalFiltered.toFixed(2)}</span>
        </span>
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={prevPage}
              disabled={page === 0}
              aria-label="Pagina precedente"
              className="expenses-pagination-arrow"
              style={{
                background: '#e0e0e0', color: '#181818', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, fontWeight: 900, cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
              }}
            >
              <FiChevronLeft size={22} />
            </button>
            <button
              onClick={nextPage}
              disabled={page === totalPages - 1}
              aria-label="Pagina successiva"
              className="expenses-pagination-arrow"
              style={{
                background: '#e0e0e0', color: '#181818', border: 'none', borderRadius: '50%', width: 36, height: 36, fontSize: 22, fontWeight: 900, cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page === totalPages - 1 ? 0.4 : 1, transition: 'opacity 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
              }}
            >
              <FiChevronRight size={22} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
