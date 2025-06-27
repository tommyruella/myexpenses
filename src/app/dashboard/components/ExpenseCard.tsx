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

const ExpenseCard: React.FC<ExpenseCardProps> = ({ expense, onClick, onRemove }) => {
  return (
    <div
      className={styles["expense-card"]}
      onClick={() => onClick && onClick(expense)}
      style={{ position: 'relative' }}
    >
      <div className={styles["expense-card-header"]}>
        <div className={styles["expense-card-amount"]}>€ {expense.amount.toFixed(2)}</div>
        {onRemove && (
          <button
            onClick={e => {
              e.stopPropagation();
              onRemove(expense);
            }}
            className={styles["expense-card-remove"]}
            aria-label="Rimuovi"
          >
            <span className={styles["expense-card-remove-icon"]}>
              <img src="/icons/trash.svg" alt="Rimuovi" width={20} height={20} />
            </span>
            <span className={styles["expense-card-remove-label"]}>Rimuovi</span>
          </button>
        )}
      </div>
      <div className={styles["expense-card-desc"]}>{expense.description}</div>
      <div className={styles["expense-card-meta"]}>
        {expense.category} • {new Date(expense.date).toISOString().slice(0, 10)}
      </div>
    </div>
  );
};

export default ExpenseCard;
