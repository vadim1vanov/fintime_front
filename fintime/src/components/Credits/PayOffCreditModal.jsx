import { useState } from "react";
import styles from "./PayCreditModal.module.css";
import { payOffCredit } from "../../api/api";

export default function PayoffCreditModal({
  credit,
  onClose,
  onSuccess
}) {
  const [loading, setLoading] = useState(false);

  const handlePayoff = async () => {
    try {
      setLoading(true);

      const transactionDto = {
        amount: credit.remaining_balance,
        description: "Полное погашение кредита",
      };

      const res = await payOffCredit(credit.id, transactionDto);

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Ошибка погашения");
      }

     
      onSuccess();
      onClose();
    } catch (e) {
      console.error(e);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles.closeBtn}
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className={styles.title}>
          Полное погашение
        </h2>

        <div className={styles.card}>
          <div className={styles.amount}>
            {Number(credit.remaining_balance || 0).toLocaleString("ru-RU")} ₽
          </div>
          <div className={styles.sub}>
            будет списано со счёта
          </div>
        </div>

        <div className={styles.warning}> 
          После полного погашения остаток кредита станет 0 ₽
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Отмена
          </button>
          <button
            className={styles.payBtn}
            onClick={handlePayoff}
            disabled={loading}
          >
            {loading ? "Погашение..." : "Погасить"}
          </button>
        </div>
      </div>
    </div>
  );
}