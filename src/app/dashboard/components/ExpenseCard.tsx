import React from "react";
import styles from "./ExpenseCard.module.css";

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

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="5.5" y="8" width="1.5" height="6" rx="0.75" fill="#e00"/>
    <rect x="9.25" y="8" width="1.5" height="6" rx="0.75" fill="#e00"/>
    <rect x="13" y="8" width="1.5" height="6" rx="0.75" fill="#e00"/>
    <rect x="4" y="4" width="12" height="2" rx="1" fill="#e00"/>
    <rect x="7" y="2" width="6" height="2" rx="1" fill="#e00"/>
    <rect x="2" y="6" width="16" height="1.5" rx="0.75" fill="#e00"/>
  </svg>
);

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onClick, onRemove }) => {
  return (
    <div
      className={styles["expense-card"]}
      onClick={() => onClick && onClick(expense)}
      style={{ position: 'relative' }}
    >
      {onRemove && (
        <button
          onClick={e => {
            e.stopPropagation();
            onRemove(expense);
          }}
          className={styles["expense-card-remove"]}
          aria-label="Rimuovi"
        >
          <span className={styles["expense-card-remove-icon"]}><TrashIcon /></span>
          <span className={styles["expense-card-remove-label"]}>Rimuovi</span>
        </button>
      )}
      <div className={styles["expense-card-amount"]}>
        € {expense.amount.toFixed(2)}
      </div>
      <div className={styles["expense-card-desc"]}>
        {expense.description}
      </div>
      <div className={styles["expense-card-meta"]}>
        {expense.category} • {new Date(expense.date).toLocaleDateString()}
      </div>
    </div>
  );
};

export default ExpenseCard;
