import { useState } from "react";
import styles from "./PayCreditModal.module.css";
import { payCreditDebt } from "../../api/api";

export default function PayCreditModal({
  credit,
  onClose,
  onSuccess
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
  const value = Number(amount);

  if (!value || value <= 0) {
    
    return;
  }

  try {
    setLoading(true);

    const res = await payCreditDebt(credit.id, {
      amount: value,
      description: "Частичное погашение кредита"
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || "Ошибка оплаты");
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
          Пополнение кредита
        </h2>

        <div className={styles.infoCard}>
          <div className={styles.row}>
            <span>Кредит</span>
            <b>{credit.purpose}</b>
          </div>

          <div className={styles.row}>
            <span>Остаток</span>
            <b>
              {Number(
                credit.remaining_balance || 0
              ).toLocaleString("ru-RU")} ₽
            </b>
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Сумма платежа
          </label>

          <input
            className={styles.input}
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Введите сумму"
          />
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={onClose}
          >
            Отмена
          </button>

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            Оплатить
          </button>
        </div>
      </div>
    </div>
  );
}