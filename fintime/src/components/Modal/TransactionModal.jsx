import { useState } from "react";
import styles from "./Modal.module.css";
import { FaTimes } from "react-icons/fa";

export default function TransactionModal({ title, onSubmit, onCancel }) {
  const [amount, setAmount] = useState("");

  const submit = (e) => {
    e.preventDefault();
    onSubmit({ amount: Number(amount) });
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel}>
          <FaTimes size={18} />
        </button>

        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <form className={styles.modalForm} onSubmit={submit}>
            <label className={styles.label}>Сумма</label>
            <input
              type="number"
              step="0.01"
              required
              className={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <div className={styles.modalFooter}>
              <button type="button" className={`${styles.btn} ${styles.btnCancel}`} onClick={onCancel}>
                Отмена
              </button>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`}>
                Подтвердить
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
