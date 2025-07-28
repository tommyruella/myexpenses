import React, { useState } from "react";
import styles from "./ExpenseCard.module.css";
import { FaTrash } from "react-icons/fa";
import SliderConfirm from "../Modal/SliderConfirm";

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
  const [showSlider, setShowSlider] = useState(false);
  const [removing, setRemoving] = useState(false);

  return (
    <div
      className={styles["expense-card"]}
      onClick={() => onClick && onClick(expense)}
      style={{ position: 'relative', borderRadius: 10, boxShadow: '0 2px 10px rgba(0,0,0,0.08)', padding: '32px 24px 24px 24px', maxWidth: 420, minWidth: 0 }}
    >
      <div className={styles["expense-card-header"]} style={{ alignItems: 'center', marginBottom: 12 }}>
        <div className={styles["expense-card-amount"]} style={{ fontSize: 32, letterSpacing: -1, fontWeight: 800 }}>€ {expense.amount.toFixed(2)}</div>
        {onRemove && (
          <button
            onClick={e => {
              e.stopPropagation();
              setShowSlider((v) => !v);
            }}
            className={styles["expense-card-remove"]}
            aria-label="Rimuovi"
            style={{ background: 'none', border: 'none', color: '#e00', borderRadius: 6, padding: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, cursor: 'pointer', marginLeft: 12 }}
            disabled={removing}
          >
            <FaTrash size={18} style={{ marginRight: 0 }} />
          </button>
        )}
      </div>
      <div className={styles["expense-card-desc"]} style={{ fontSize: 17, fontWeight: 600, marginBottom: 6 }}>{expense.description}</div>
      <div className={styles["expense-card-meta"]} style={{ fontSize: 12, color: '#888', fontWeight: 500 }}>
        {expense.category} • {new Date(expense.date).toISOString().slice(0, 10)}
      </div>
      {showSlider && onRemove && (
        <SliderConfirm
          onConfirm={async () => {
            setRemoving(true);
            await onRemove(expense);
            setRemoving(false);
            setShowSlider(false);
          }}
          disabled={removing}
        />
      )}
    </div>
  );
};

export default ExpenseCard;
