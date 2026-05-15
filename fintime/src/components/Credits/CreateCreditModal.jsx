import { useState, useMemo, useRef, useEffect } from "react";
import styles from "./CreateCreditModal.module.css";
import { IoIosArrowDown } from "react-icons/io";
import { getAccounts } from "../../api/api";
import { createCredit } from "../../api/api";
export default function CreateCreditModal({ onClose, onSubmit }) {
  /* ================= STATE ================= */
  const [amount, setAmount] = useState(1000000);
  const [rate, setRate] = useState(10);
  const [term, setTerm] = useState("24");
  const [termType, setTermType] = useState("months");
  const [purpose, setPurpose] = useState("");
const [accounts, setAccounts] = useState([]);
const [accountId, setAccountId] = useState("");
const [startDate, setStartDate] = useState("");
  const STEP = 50000;

  /* ================= REFS ================= */
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  /* ================= FORMAT ================= */
  const formatNumber = (num) => num.toLocaleString("ru-RU");
  const parseNumber = (value) => Number(value.replace(/\s/g, ""));

  /* ================= AMOUNT ================= */
  const handleAmountInput = (e) => {
    let raw = parseNumber(e.target.value);

    if (isNaN(raw)) return;

    if (raw < 0) raw = 0;
    if (raw > 100_000_000_000) raw = 100_000_000_000;

    setAmount(raw);
  };

  const changeAmount = (dir) => {
    setAmount((prev) => {
      let next = prev + dir * STEP;
      if (next < 0) next = 0;
      if (next > 100_000_000_000) next = 100_000_000_000;
      return next;
    });
  };

  const startHold = (dir) => {
    changeAmount(dir);

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);

    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        changeAmount(dir);
      }, 90);
    }, 400);
  };
useEffect(() => {
  const loadAccounts = async () => {
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch (e) {
      console.error("Ошибка загрузки счетов", e);
    }
  };

  loadAccounts();
}, []);
  const stopHold = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  /* ================= TERM ================= */
  const handleTermChange = (e) => {
    let val = e.target.value.replace(/\D/g, "");
    setTerm(val);
  };

  const termNumber = Number(term) || 0;
  const termInMonths =
    termType === "years" ? termNumber * 12 : termNumber;

  /* ================= CALC ================= */
  const monthlyPayment = useMemo(() => {
    if (!amount || !rate || !termInMonths) return 0;

    const r = rate / 100 / 12;

    if (r === 0) return Math.round(amount / termInMonths);

    const p =
      amount *
      (r * Math.pow(1 + r, termInMonths)) /
      (Math.pow(1 + r, termInMonths) - 1);

    return Math.round(p);
  }, [amount, rate, termInMonths]);

  const totalPayment = monthlyPayment * termInMonths;
  const overpayment = totalPayment - amount;

  /* ================= SUBMIT ================= */
const handleSubmit = async () => {
  if (!accountId) {
    alert("Выберите счёт");
    return;
  }

  try {
    await createCredit(accountId, {
      account_id: Number(accountId),
      purpose,
      principal_amount: amount,
      interest_rate: rate,
      term_months: termInMonths,
      start_date: startDate ? new Date(startDate).toISOString() : null,
    });

    alert("Кредит создан");

    onClose(); // закрываем модалку
  } catch (e) {
    console.error("Ошибка создания кредита:", e);
    alert("Ошибка создания кредита");
  }
};

  /* ================= VISUAL ================= */
  const totalVisual = amount + overpayment;
  const principalPercent =
    totalVisual > 0 ? (amount / totalVisual) * 100 : 100;
  const overpaymentPercent = 100 - principalPercent;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          ✕
        </button>

        <h2 className={styles.modalTitle}>Новый кредит</h2>

        <div className={styles.content}>
          {/* LEFT */}
          <div className={styles.left}>
            <label className={styles.label}>Счёт</label>

<div className={styles.selectWrapper}>
  <select
    className={styles.selectAccount}
    value={accountId}
    onChange={(e) => setAccountId(e.target.value)}
  >
    <option value="">Выберите счёт</option>

    {accounts.map((acc) => (
      <option key={acc.id} value={acc.id}>
        {acc.account_name} ({acc.currency})
      </option>
    ))}
  </select>

  <IoIosArrowDown className={styles.selectArrow} />
</div>
            <label className={styles.label}>Сумма кредита</label>

            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button
                className={styles.stepBtn}
                onMouseDown={() => startHold(-1)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={() => startHold(-1)}
                onTouchEnd={stopHold}
              >
                −
              </button>

              <input
                className={styles.input}
                value={formatNumber(amount)}
                onChange={handleAmountInput}
              />

              <button
                className={styles.stepBtn}
                onMouseDown={() => startHold(1)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={() => startHold(1)}
                onTouchEnd={stopHold}
              >
                +
              </button>
            </div>

            <label className={styles.label}>Ставка</label>
            <input
              className={styles.input}
              type="number"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
            />

            <label className={styles.label}>Срок</label>

            <div style={{ display: "flex", gap: 10 }}>
              <input
                className={styles.input}
                value={term}
                onChange={handleTermChange}
              />

              {/* SELECT С КАСТОМ СТРЕЛКОЙ */}
              <div className={styles.selectWrapper}>
                <select
                  className={styles.select}
                  value={termType}
                  onChange={(e) => setTermType(e.target.value)}
                >
                  <option value="months">Месяцев</option>
                  <option value="years">Лет</option>
                </select>

                <IoIosArrowDown className={styles.selectArrow} />
              </div>
            </div>
<label className={styles.label}>Дата начала выплат</label>

<input
  className={styles.input}
  type="date"
  value={startDate}
  onChange={(e) => setStartDate(e.target.value)}
/>
            <label className={styles.label}>Цель</label>
            <input
              className={styles.input}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            />
          </div>

          {/* RIGHT */}
          <div className={styles.right}>
            <div className={styles.calcCard}>
              <div className={styles.calcTitle}>Расчёт платежа</div>

              <div className={styles.mainPayment}>
                {formatNumber(monthlyPayment)} ₽
              </div>

              <div className={styles.subText}>ежемесячный платёж</div>

              <div className={styles.calcRows}>
                <div className={styles.calcRow}>
                  <div className={styles.calcLeftRow}>
                    <div className={styles.principalFlag}></div>
                    <span>Сумма</span>

                  </div>
                  <b>{formatNumber(amount)} ₽</b>
                </div>

                <div className={styles.calcRow}>
                  <div className={styles.calcLeftRow}>
                    <div className={styles.overpaymentFlag}></div>
                    <span>Переплата</span>

                  </div>
                  <b>{formatNumber(overpayment)} ₽</b>
                </div>

                <div className={styles.calcRow}>
                  <span>Итого</span>
                  <b>{formatNumber(totalPayment)} ₽</b>
                </div>
              </div>

              <div className={styles.visualBarContainer}>
                <div className={styles.visualBar}>
                  <div
                    className={styles.principalBar}
                    style={{ width: `${principalPercent}%` }}
                  />
                  <div
                    className={styles.overpaymentBar}
                    style={{ width: `${overpaymentPercent}%` }}
                  />
                </div>

                <div className={styles.visualLabels}>
                  <span>Кредит</span>
                  <span>Переплата</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button onClick={onClose} className={styles.btnCancel}>
            Отмена
          </button>

          <button onClick={handleSubmit} className={styles.btnPrimary}>
            Создать
          </button>
        </div>
      </div>
    </div>
  );
}