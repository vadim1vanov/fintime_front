import { useEffect, useMemo, useState } from "react";
import styles from "./CreateDepositModal.module.css";
import { createDeposit, getAccounts } from "../../api/api";
import { IoIosArrowDown } from "react-icons/io";

export default function CreateDepositModal({ onClose, onSubmit }) {

  const [accounts, setAccounts] = useState([]);

  const [depositName, setDepositName] = useState("");
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [termDays, setTermDays] = useState(365);

  const [currency, setCurrency] = useState(null);

  const [capitalizationFrequency, setCapitalizationFrequency] = useState("MONTHLY");
  const [replenishmentFrequency, setReplenishmentFrequency] = useState("NONE");
  const [termType, setTermType] = useState("FIXED");

  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const data = await getAccounts();
        setAccounts(data);

        if (data.length > 0) {
          setCurrency(data[0].currency);
        }

      } catch (e) {
        console.error(e);
      }
    };

    loadAccounts();
  }, []);

  // =========================
  // 🔥 КАПИТАЛИЗАЦИЯ
  // =========================
  const compoundingPerYear = (freq) => {
    switch (freq) {
      case "DAILY": return 365;
      case "WEEKLY": return 52;
      case "MONTHLY": return 12;
      case "HALF_YEARLY": return 2;
      case "YEARLY": return 1;
      case "NONE": return 1;
      default: return 1;
    }
  };

  const profit = useMemo(() => {

    const principal = amount;
    const annualRate = rate / 100;
    const years = termDays / 365;

    const n = compoundingPerYear(capitalizationFrequency);

    // 🔥 простые проценты
    if (capitalizationFrequency === "NONE") {
      return principal * annualRate * years;
    }

    // 🔥 сложные проценты
    return principal * Math.pow(1 + annualRate / n, n * years) - principal;

  }, [amount, rate, termDays, capitalizationFrequency]);

  const total = amount + profit;

  const handleSubmit = async () => {

    try {

      const startDate = new Date();
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + Number(termDays));

      const payload = {

        deposit_name: depositName,
        interest_rate: Number(rate),
        principal_amount: Number(amount),
        term_days: Number(termDays),

        start_date: startDate.toISOString().split("T")[0],
        end_date: endDate.toISOString().split("T")[0],

        status: "ACTIVE",

        // ⚠️ теперь это ID (как ты уже переделал DTO)
        currency_id: currency?.id || currency,

        created_at: new Date().toISOString(),

        replenishment_frequency: replenishmentFrequency,
        capitalization_frequency: capitalizationFrequency,
        deposit_term_type: termType,

        last_interest_accrual_date: startDate.toISOString().split("T")[0]
      };

      await createDeposit(payload);

      onSubmit();

    } catch (e) {
      console.error(e);
      alert("Ошибка создания вклада");
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

        <button className={styles.closeBtn} onClick={onClose}>✕</button>

        <h2 className={styles.modalTitle}>Новый вклад</h2>

        <div className={styles.content}>

          <div className={styles.left}>

            <label className={styles.label}>Название вклада</label>
            <input className={styles.input} value={depositName}
              onChange={(e) => setDepositName(e.target.value)} />

            <label className={styles.label}>Сумма</label>
            <input className={styles.input} type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))} />

            <label className={styles.label}>Ставка %</label>
            <input className={styles.input} type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))} />

            <label className={styles.label}>Срок (дней)</label>
            <input className={styles.input} type="number"
              value={termDays}
              onChange={(e) => setTermDays(Number(e.target.value))} />

            {/* TYPE */}
            <label className={styles.label}>Тип вклада</label>
            <div className={styles.selectWrapper}>
              <select className={styles.select}
                value={termType}
                onChange={(e) => setTermType(e.target.value)}>
                <option value="FIXED">Срочный</option>
                <option value="INDEFINITE">Бессрочный</option>
              </select>
              <IoIosArrowDown className={styles.selectArrow} />
            </div>

            {/* CAPITALIZATION */}
            <label className={styles.label}>Капитализация</label>
            <div className={styles.selectWrapper}>
              <select className={styles.select}
                value={capitalizationFrequency}
                onChange={(e) => setCapitalizationFrequency(e.target.value)}>

                <option value="NONE">Без капитализации</option>
                <option value="DAILY">Ежедневно</option>
                <option value="WEEKLY">Еженедельно</option>
                <option value="MONTHLY">Ежемесячно</option>
                <option value="HALF_YEARLY">Раз в полгода</option>
                <option value="YEARLY">Раз в год</option>

              </select>
              <IoIosArrowDown className={styles.selectArrow} />
            </div>

            {/* REPLENISH */}
            <label className={styles.label}>Пополнение</label>
            <div className={styles.selectWrapper}>
              <select className={styles.select}
                value={replenishmentFrequency}
                onChange={(e) => setReplenishmentFrequency(e.target.value)}>

                <option value="NONE">Без пополнения</option>
                <option value="MONTHLY">Ежемесячно</option>
                <option value="HALF_YEARLY">Раз в полгода</option>
                <option value="YEARLY">Раз в год</option>

              </select>
              <IoIosArrowDown className={styles.selectArrow} />
            </div>

          </div>

          {/* RIGHT */}
          <div className={styles.right}>

            <div className={styles.calcCard}>

              <div className={styles.calcTitle}>Доходность</div>

              <div className={styles.mainProfit}>
                +{profit.toLocaleString("ru-RU", { maximumFractionDigits: 0 })} ₽
              </div>

              <div className={styles.subText}>сложный процент</div>

              <div className={styles.calcRows}>

                <div className={styles.calcRow}>
                  <span>Сумма</span>
                  <b>{amount.toLocaleString("ru-RU")} ₽</b>
                </div>

                <div className={styles.calcRow}>
                  <span>Доход</span>
                  <b>+{profit.toLocaleString("ru-RU")} ₽</b>
                </div>

                <div className={styles.calcRow}>
                  <span>Итого</span>
                  <b>{total.toLocaleString("ru-RU")} ₽</b>
                </div>

              </div>

            </div>

          </div>

        </div>

        <div className={styles.modalFooter}>
          <button className={styles.btnCancel} onClick={onClose}>
            Отмена
          </button>

          <button className={styles.btnPrimary} onClick={handleSubmit}>
            Создать вклад
          </button>
        </div>

      </div>
    </div>
  );
}