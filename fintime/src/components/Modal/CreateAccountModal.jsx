import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import { HiX } from "react-icons/hi";
import styles from "./CreateAccountModal.module.css";

export default function CreateAccountModal({ onCancel, onSubmit }) {
  const [form, setForm] = useState({
    account_name: "",
    currency: "RUB",
    balance: "",
    description: "",
  });

  const getCurrencyFlag = (currency) => {
  switch (currency) {
    case "RUB": return "/flags/ru.svg";
    case "USD": return "/flags/us.svg";
    case "EUR": return "/flags/eu.svg";
    case "JPY": return "/flags/jp.svg";
    case "CNY": return "/flags/cn.svg";
    case "GBP": return "/flags/gb.svg";
    default: return "/flags/us.svg";
  }
};

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!form.account_name.trim()) {
      alert("Введите название счёта");
      return;
    }

    onSubmit({
      ...form,
      balance: Number(form.balance || 0),
    });
  };

  const currencySymbols = {
    USD: "$",
    EUR: "€",
    RUB: "₽",
    GBP: "£",
    JPY: "¥",
    CNY: "¥",
  };

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <button className={styles.closeBtn} onClick={onCancel}>
          <HiX />
        </button>

        <div className={styles.topGradient}></div>

        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconBlock}>
              <span>{currencySymbols[form.currency]}</span>
            </div>

            <div>
              <h2 className={styles.title}>Новый счёт</h2>
              <p className={styles.subtitle}>
                Создайте счёт для хранения и управления средствами
              </p>
            </div>
          </div>
        </div>

        <div className={styles.content}>
          {/* LEFT */}
          <div className={styles.left}>
            <div className={styles.field}>
              <label className={styles.label}>Название счёта</label>

              <input
                className={styles.input}
                placeholder="Например: Основной счёт"
                value={form.account_name}
                onChange={(e) =>
                  handleChange("account_name", e.target.value)
                }
              />
            </div>

            <div className={styles.row}>
              <div className={styles.field}>
                <label className={styles.label}>Валюта</label>

                <div className={styles.selectWrapper}>
                  <select
                    className={styles.select}
                    value={form.currency}
                    onChange={(e) =>
                      handleChange("currency", e.target.value)
                    }
                  >
                    <option value="RUB">RUB — Ruble</option>
                    <option value="USD">USD — Dollar</option>
                    <option value="EUR">EUR — Euro</option>
                    
                    <option value="GBP">GBP — Pound</option>
                    <option value="JPY">JPY — Yen</option>
                    <option value="CNY">CNY — Yuan</option>
                  </select>

                  <IoIosArrowDown className={styles.selectArrow} />
                </div>
              </div>


            </div>

            <div className={styles.field}>
              <label className={styles.label}>Начальный баланс</label>

              <div className={styles.balanceInputWrapper}>
                <input
                  className={styles.input}
                  type="number"
                  placeholder="0"
                  value={form.balance}
                  onChange={(e) =>
                    handleChange("balance", e.target.value)
                  }
                />

                <div className={styles.currencyBadge}>
                  {form.currency}
                </div>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Описание</label>

              <textarea
                className={styles.textarea}
                placeholder="Дополнительная информация о счёте"
                value={form.description}
                onChange={(e) =>
                  handleChange("description", e.target.value)
                }
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
  <div className={styles.previewCard}>
  <div className={styles.previewHeader}>
    <div className={styles.leftHeader}>
    <div className={styles.previewIcon}>
      <img
src={getCurrencyFlag(form.currency)}
alt={form.currency}
className={
  form.currency === "USD"
    ? styles.flagUs
    : form.currency === "CNY"
    ? styles.flagChina
    : styles.flag
}
      />
    </div>
    <div>
            <div className={styles.previewName}>
        {form.account_name || "Название счёта"}
      </div>
            <div className={styles.previewCurrency}>
        {form.currency}</div>
      </div>
</div>
    <div>

 <div className={styles.previewStatus}>
    Активен
  </div>

    </div>
  </div>

  <div className={styles.previewBalanceBlock}>
    <div className={styles.previewBalanceLabel}>
      Баланс
    </div>

    <div className={styles.previewBalance}>

           {Math.abs(Number(form.balance)).toLocaleString("ru-RU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })  || 0.00 }
    </div>
  </div>

 

</div>

            <div className={styles.infoCard}>
              <div className={styles.infoTitle}>
                Что можно делать
              </div>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  • Пополнять и снимать средства
                </div>

                <div className={styles.infoItem}>
                  • Делать переводы между счетами
                </div>

                <div className={styles.infoItem}>
                  • Отслеживать транзакции
                </div>

                <div className={styles.infoItem}>
                  • Использовать счёт для кредитов и вкладов
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button
            className={styles.cancelBtn}
            onClick={onCancel}
          >
            Отмена
          </button>

          <button
            className={styles.createBtn}
            onClick={handleSubmit}
          >
            Создать счёт
          </button>
        </div>
      </div>
    </div>
  );
}