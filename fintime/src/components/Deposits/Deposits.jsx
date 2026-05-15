import { useEffect, useState } from "react";

import {
  getDeposits,
  deleteDeposit,
} from "../../api/api";

import styles from "./Deposits.module.css";

import CreateDepositModal from "./CreateDepositModal";

export default function Deposits() {

  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);

    try {
      const data = await getDeposits();

      setDeposits(Array.isArray(data) ? data : []);

    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Удалить вклад?"
    );

    if (!confirmed) return;

    try {
      await deleteDeposit(id);

      setDeposits((prev) =>
        prev.filter((d) => d.id !== id)
      );

    } catch (e) {
      console.error(e);
      alert("Ошибка удаления");
    }
  };

  const getDaysLeft = (endDate) => {
    const end = new Date(endDate);
    const now = new Date();

    const diff =
      Math.ceil(
        (end - now) / (1000 * 60 * 60 * 24)
      );

    return diff < 0 ? 0 : diff;
  };

  const calculateProfit = (
    principal,
    rate,
    days
  ) => {
    return (
      principal *
      (rate / 100) *
      (days / 365)
    );
  };

  const calculateTotal = (
    principal,
    rate,
    days
  ) => {
    return (
      principal +
      calculateProfit(
        principal,
        rate,
        days
      )
    );
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
            Вклады
          </h2>

          <p className={styles.subtitle}>
            Доходность и накопления
          </p>
        </div>

        <button
          className={styles.addBtn}
          onClick={() => setModalOpen(true)}
        >
          + Новый вклад
        </button>

      </div>

      {deposits.length === 0 ? (
        <div className={styles.empty}>
          Вкладов нет
        </div>
      ) : (
        <div className={styles.grid}>

          {deposits.map((d) => {

            const progress = (() => {

              const start =
                new Date(d.start_date);

              const end =
                new Date(d.end_date);

              const now =
                new Date();

              const total =
                end - start;

              const current =
                now - start;

              if (current <= 0) return 0;

              if (current >= total)
                return 100;

              return Math.round(
                (current / total) * 100
              );

            })();

            let progressColor = "#22c55e";

            if (progress >= 100)
              progressColor = "#ffd42a";

            return (
              <div
                key={d.id}
                className={styles.card}
              >

                {/* TOP */}

                <div className={styles.top}>

                  <div>

                    <div className={styles.depositTitle}>
                      {d.deposit_name}
                    </div>

                    <div className={styles.depositType}>
                      {d.deposit_term_type}
                    </div>

                  </div>

                  <div className={styles.status}>
                    {d.status}
                  </div>

                </div>

                {/* MAIN */}

                <div className={styles.mainSection}>

                  <div className={styles.balanceSide}>

                    <span className={styles.balanceLabel}>
                      Сумма вклада
                    </span>

                    <div className={styles.balanceValue}>
                      {Number(
                        d.principal_amount
                      ).toLocaleString("ru-RU")} ₽
                    </div>

                    <div className={styles.totalAmount}>
                      Доход:
                      {" "}
                      {calculateProfit(
                        Number(
                          d.principal_amount
                        ),
                        Number(
                          d.interest_rate
                        ),
                        Number(
                          d.term_days
                        )
                      ).toLocaleString(
                        "ru-RU",
                        {
                          maximumFractionDigits: 0
                        }
                      )} ₽
                    </div>

                  </div>

                  <div className={styles.circleWrap}>

                    <div
                      className={
                        styles.progressCircle
                      }
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
                          срока
                        </div>

                      </div>

                    </div>

                  </div>

                </div>

                {/* STATS */}

                <div className={styles.stats}>

                  <div className={styles.statCard}>
                    <span>Ставка</span>

                    <b>
                      {d.interest_rate}%
                    </b>
                  </div>

                  <div className={styles.statCard}>
                    <span>Срок</span>

                    <b>
                      {d.term_days} дн.
                    </b>
                  </div>

                  <div className={styles.statCard}>
                    <span>К получению</span>

                    <b>
                      {calculateTotal(
                        Number(
                          d.principal_amount
                        ),
                        Number(
                          d.interest_rate
                        ),
                        Number(
                          d.term_days
                        )
                      ).toLocaleString(
                        "ru-RU",
                        {
                          maximumFractionDigits: 0
                        }
                      )} ₽
                    </b>
                  </div>

                  <div className={styles.statCard}>
                    <span>Осталось</span>

                    <b>
                      {getDaysLeft(
                        d.end_date
                      )} дн.
                    </b>
                  </div>

                </div>

                {/* ACTIONS */}

                <div className={styles.actions}>

                  <button
                    className={styles.secondaryBtn}
                  >
                    Детали
                  </button>

                  <button
                    className={styles.deleteBtn}
                    onClick={() =>
                      handleDelete(d.id)
                    }
                  >
                    Удалить
                  </button>

                  <button
                    className={styles.primaryBtn}
                  >
                    Пополнить
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}

      {modalOpen && (
        <CreateDepositModal
          onClose={() =>
            setModalOpen(false)
          }
          onSubmit={() => {
            setModalOpen(false);
            load();
          }}
        />
      )}

    </div>
  );
}