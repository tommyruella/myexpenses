import React from "react";

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
}

export default function ExpensesList({ spese, onExpenseClick }: ExpensesListProps) {
  return (
    <ul className="expenses-list expenses-list-mobile-margin">
      {spese.length === 0 && <li>No expenses found.</li>}
      {[...spese].sort((a, b) => b.data_spesa.localeCompare(a.data_spesa)).map((spesa) => (
        <li
          key={spesa.id}
          className="expense-item"
          onClick={() => onExpenseClick && onExpenseClick(spesa)}
          style={onExpenseClick ? { cursor: 'pointer' } : {}}
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
  );
}
