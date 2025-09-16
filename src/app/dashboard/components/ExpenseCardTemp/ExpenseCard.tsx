import React, { useState } from "react";
import styles from "./ExpenseCard.module.css";
import { FaTrash } from "react-icons/fa";

export interface Expense {
  id: string | number;
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface ExpenseCardProps {
  expense: Expense;
  onClick?: (expense: Expense) => void;
  onRemove?: (expense: Expense) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onClick, onRemove }) => {
  const [removing, setRemoving] = useState(false);

  return (
    <div
      className={styles["expense-card"]}
      onClick={() => onClick && onClick(expense)}
      style={{ position: 'relative', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '32px 24px 24px 24px', maxWidth: 420, minWidth: 0 }}
    >
      <div className={styles["expense-card-header"]} style={{ alignItems: 'center', marginBottom: 12 }}>
        <div className={styles["expense-card-amount"]} style={{ fontSize: 32, letterSpacing: -1, fontWeight: 800, minWidth: 0 }}>€ {expense.amount.toFixed(2)}</div>
        {onRemove && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              onClick={async e => {
                e.stopPropagation();
                if (removing) return;
                const ok = window.confirm('Sei sicuro di voler eliminare questa spesa?');
                if (!ok) return;
                try {
                  setRemoving(true);
                  await onRemove(expense);
                } finally {
                  setRemoving(false);
                }
              }}
              className={styles["expense-card-remove"]}
              aria-label="Rimuovi"
              style={{ background: 'none', border: 'none', color: '#fecaca', borderRadius: 6, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', marginLeft: 12 }}
              disabled={removing}
            >
              <FaTrash size={18} style={{ marginRight: 0 }} />
            </button>
          </div>
        )}
      </div>
      <div className={styles["expense-card-desc"]} style={{ fontSize: 17, fontWeight: 600, marginBottom: 6, overflowWrap: 'break-word' }}>{expense.description}</div>
      <div className={styles["expense-card-meta"]} style={{ fontSize: 12, color: '#888', fontWeight: 500, minWidth: 0 }}>
        {expense.category} • {new Date(expense.date).toISOString().slice(0, 10)}
      </div>
    </div>
  );
};

export default ExpenseCard;
