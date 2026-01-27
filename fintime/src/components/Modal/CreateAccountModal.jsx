import { useState } from "react";
import styles from "./CreateAccountModal.module.css";

export default function CreateAccountModal({ onCancel, onSubmit }) {
  const [account_name, setAccountName] = useState("");
  const [currency, setCurrency] = useState("RUB");
  const [balance, setBalance] = useState("");

  const handleSubmit = () => {
    if (!account_name.trim()) return;

    onSubmit({
      account_name,
      currency,
      balance: balance === "" ? 0 : Number(balance)
    });
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <h2 className={styles.title}>Новый счёт</h2>

        {/* Название */}
        <div className={styles.field}>
          <label>Название счёта</label>
          <input
            type="text"
            placeholder="Например: Основной"
            value={account_name}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>

        {/* Валюта */}
        <div className={styles.field}>
          <label>Валюта</label>
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          >
            <option value="RUB">RUB ₽</option>
            <option value="USD">USD $</option>
            <option value="EUR">EUR €</option>
            <option value="GBP">GBP £</option>
            <option value="JPY">JPY ¥</option>
            <option value="CNY">CNY ¥</option>
          </select>
        </div>

        {/* Баланс */}
        <div className={styles.field}>
          <label>Начальный баланс</label>
          <input
            type="number"
            placeholder="0.00"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
          />
        </div>

        {/* Кнопки */}
        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onCancel}>
            Отмена
          </button>

          <button
            className={styles.create}
            onClick={handleSubmit}
            disabled={!account_name.trim()}
          >
            Создать
          </button>
        </div>

      </div>
    </div>
  );
}
