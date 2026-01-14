import { useState } from "react";
import styles from "./Modal.module.css";

export default function TransactionModal({ title, onSubmit, onCancel }) {
  const [amount, setAmount] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ amount: Number(amount) });
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <form
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
      >
        <div className={styles.header}>{title}</div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Сумма</label>
          <input
            className={styles.input}
            type="number"
            step="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className={styles.footer}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={onCancel}
          >
            Отмена
          </button>

          <button
            type="submit"
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            Подтвердить
          </button>
        </div>
      </form>
    </div>
  );
}
