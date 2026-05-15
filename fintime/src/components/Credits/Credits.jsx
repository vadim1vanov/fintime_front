import { useEffect, useState } from "react";
import { getCredits, getAccounts,   deleteCredit} from "../../api/api";
import styles from "./Credits.module.css";

import CreateCreditModal from "./CreateCreditModal";
import PayCreditModal from "./PayCreditModal";
import PayoffCreditModal from "./PayOffCreditModal";

export default function Credits() {
  const [credits, setCredits] = useState([]);
  const [accountsMap, setAccountsMap] = useState({});

  const [loading, setLoading] = useState(true);

  const [payModal, setPayModal] = useState(null);
  const [payoffModal, setPayoffModal] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);

    try {
      const [creditsData, accountsData] = await Promise.all([
        getCredits(),
        getAccounts()
      ]);

      setCredits(Array.isArray(creditsData) ? creditsData : []);

      const map = {};

      accountsData.forEach((acc) => {
        map[acc.id] = acc;
      });

      setAccountsMap(map);

    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return styles.active;

      case "paid_off":
        return styles.paidOff;

      case "overdue":
        return styles.overdue;

      default:
        return styles.default;
    }
  };

  const calculateMonthlyPayment = (
    principal,
    rate,
    months
  ) => {
    const monthlyRate = rate / 100 / 12;

    if (!monthlyRate) {
      return principal / months;
    }

    const annuity =
      (monthlyRate *
        Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);

    return principal * annuity;
  };

  const calculateTotalAmount = (
    principal,
    rate,
    months
  ) => {
    return (
      calculateMonthlyPayment(
        principal,
        rate,
        months
      ) * months
    );
  };

  const calculateOverpayment = (
    principal,
    rate,
    months
  ) => {
    return (
      calculateTotalAmount(
        principal,
        rate,
        months
      ) - principal
    );
  };
const handleDelete = async (creditId) => {
  const confirmed = window.confirm(
    "Удалить кредит?"
  );

  if (!confirmed) return;

  try {
    await deleteCredit(creditId);

    setCredits((prev) =>
      prev.filter((c) => c.id !== creditId)
    );
  } catch (e) {
    console.error(e);
    alert("Ошибка удаления");
  }
};

  if (loading) {
    return (
      <div className={styles.loading}>
        Загрузка...
      </div>
    );
  }

  return (
    <div className={styles.container}>

      <div className={styles.header}>

        <div>
          <h2 className={styles.title}>
            Кредиты
          </h2>

          <p className={styles.subtitle}>
            Управление кредитами и платежами
          </p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => setModalOpen(true)}
        >
          + Новый кредит
        </button>

      </div>

      {credits.length === 0 ? (
        <div className={styles.empty}>
          Кредитов нет
        </div>
      ) : (
        <div className={styles.grid}>

          {credits.map((c) => {

            const progress = Number(c.progress || 0);
let progressColor = "#0077ff";

if (progress >= 100) progressColor = "#22c55e";   // зелёный (paid off)
else if (progress >= 75) progressColor = "#d2ff6a"; // жёлтый (почти)
else if (progress < 25) progressColor = "#ef4444";  // красный (опасно)
else if (progress >= 25) progressColor = "#eeb830";
            return (
              <div
                key={c.id}
                className={styles.card}
              >

                {/* TOP */}

                <div className={styles.top}>

                  <div className={styles.topLeft}>

                    <div className={styles.creditTitle}>
                      {c.purpose || "Кредит"}
                    </div>

                    <div className={styles.accountName}>
                      {
                        accountsMap[c.account_id]
                          ?.account_name || "Счёт"
                      }
                    </div>

                  </div>

                  <div
                    className={`${styles.status} ${getStatusClass(
                      c.status
                    )}`}
                  >
                    {c.status === "ACTIVE"
                      ? "В процессе"
                      : c.status === "PAID_OFF"
                      ? "Уплачен"
                      : c.status}
                  </div>

                </div>

                {/* MAIN */}

                <div className={styles.mainSection}>

                  {/* LEFT */}

                  <div className={styles.balanceSide}>

                    <span className={styles.balanceLabel}>
                      Остаток долга
                    </span>

                    <div className={styles.balanceValue}>
                      {Number(
                        c.remaining_balance || 0
                      ).toLocaleString("ru-RU")} ₽
                    </div>

                    <div className={styles.totalAmount}>
                      из{" "}
                      {calculateTotalAmount(
                        Number(c.principal_amount),
                        Number(c.interest_rate),
                        Number(c.term_months)
                      ).toLocaleString("ru-RU", {
                        maximumFractionDigits: 0
                      })} ₽
                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className={styles.circleWrap}>

                    <div
                      className={styles.progressCircle}
style={{
  background: `conic-gradient(
    ${progressColor} ${progress}%,
    #edf2f7 ${progress}%
  )`
}}
                    >

                      <div className={styles.circleInner}>

                        <div className={styles.circlePercent}>
                          {progress}%
                        </div>

                        <div className={styles.circleText}>
                          погашено
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* STATS */}

                <div className={styles.stats}>

                  <div className={styles.statCard}>
                    <span>Платёж / мес</span>

                    <b>
                      {calculateMonthlyPayment(
                        Number(c.principal_amount),
                        Number(c.interest_rate),
                        Number(c.term_months)
                      ).toLocaleString("ru-RU", {
                        maximumFractionDigits: 0
                      })} ₽
                    </b>
                  </div>

                  <div className={styles.statCard}>
                    <span>Ставка</span>

                    <b>
                      {c.interest_rate}%
                    </b>
                  </div>

                  <div className={styles.statCard}>
                    <span>Переплата</span>

                    <b>
                      {calculateOverpayment(
                        Number(c.principal_amount),
                        Number(c.interest_rate),
                        Number(c.term_months)
                      ).toLocaleString("ru-RU", {
                        maximumFractionDigits: 0
                      })} ₽
                    </b>
                  </div>

                  <div className={styles.statCard}>
                    <span>Срок</span>

                    <b>
                      {c.term_months} мес
                    </b>
                  </div>

                </div>

                {/* BUTTONS */}

                <div className={styles.actions}>

                  <button
                    className={styles.secondaryBtn}
                  >
                    Детали
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(c.id)}
                  >
                    Удалить
                  </button>

                  <button
                    className={styles.darkBtn}
                    onClick={() => setPayModal(c)}
                  >
                    Пополнить
                  </button>

                  <button
                    className={styles.primaryBtn}
                    onClick={() => setPayoffModal(c)}
                  >
                    Погасить
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {modalOpen && (
        <CreateCreditModal
          onClose={() => setModalOpen(false)}
          onSubmit={() => {
            setModalOpen(false);
            load();
          }}
        />
      )}

      {payModal && (
        <PayCreditModal
          credit={payModal}
          onClose={() => setPayModal(null)}
          onSuccess={load}
        />
      )}

      {payoffModal && (
        <PayoffCreditModal
          credit={payoffModal}
          onClose={() => setPayoffModal(null)}
          onSuccess={load}
        />
      )}

    </div>
  );
}