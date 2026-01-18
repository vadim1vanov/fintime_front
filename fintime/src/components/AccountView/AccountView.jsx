import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAccountById, getTransactions, income, expense, closeAccount, restoreAccount } from "../../api/api";
import { FaArrowLeft, FaPlus, FaMinus, FaLock, FaUndo, FaEdit, FaExchangeAlt } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faRubleSign,
  faEuroSign,
  faYenSign,
  faPoundSign
} from "@fortawesome/free-solid-svg-icons";
import ConfirmModal from "../Modal/ConfirmModal";
import TransactionModal from "../Modal/TransactionModal";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";
import styles from "./AccountView.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function AccountView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modal, setModal] = useState(null);

  const loadAccount = async () => {
    try {
      setError(null);
      const data = await getAccountById(id);
      setAccount(data);

      const txs = await getTransactions(id);
      setTransactions(Array.isArray(txs) ? txs : []);
    } catch (err) {
      console.error(err);
      setError("Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAccount();
  }, [id]);

  if (loading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!account) return <div className={styles.error}>Счёт не найден</div>;

  const getCurrencyIcon = (currency) => {
    switch (currency) {
      case "RUB": return faRubleSign;
      case "USD": return faDollarSign;
      case "EUR": return faEuroSign;
      case "JPY": return faYenSign;
      case "CNY": return faYenSign;
      case "GBP": return faPoundSign;
      default: return faDollarSign;
    }
  };

  const getCurrencyFlag = (currency) => {
    switch (currency) {
      case "RUB": return "🇷🇺";
      case "USD": return "🇺🇸";
      case "EUR": return "🇪🇺";
      case "JPY": return "🇯🇵";
      case "CNY": return "🇨🇳";
      case "GBP": return "🇬🇧";
      default: return "💰";
    }
  };

  const isClosed = account.status !== "active";
  const balance = Number(account.balance);
  const absBalance = Math.abs(balance);
  const formattedBalance = absBalance.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  // Данные для графика гистограммы (последние 7 транзакций)
  const chartLabels = transactions.slice(-7).map(tx => new Date(tx.created_at).toLocaleDateString());
  const chartData = transactions.slice(-7).map(tx => Number(tx.amount));

  const data = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Сумма',
        data: chartData,
        backgroundColor: '#10b981',
        borderRadius: 6,
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,0.05)' }, ticks: { stepSize: 50 } }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={() => navigate("/accounts")}>
          <FaArrowLeft /> Назад
        </button>
        <div className={styles.titleBlock}>
          <div className={styles.icon}>
            <span className={styles.flag}>{getCurrencyFlag(account.currency)}</span>
          </div>
          <h1 className={styles.title}>{account.account_name || "Без названия"}</h1>
          <span className={styles.currency}>{account.currency}</span>
          <span className={`${styles.status} ${isClosed ? styles.closedStatus : styles.activeStatus}`}>
            {isClosed ? "Закрыт" : "Активен"}
          </span>
        </div>
        <div className={styles.menu}>
          <button onClick={() => setModal({ type: "edit", acc: account })} title="Редактировать">
            <FaEdit />
          </button>
          <button onClick={() => setModal({ type: "transfer", acc: account })} title="Перевод">
            <FaExchangeAlt />
          </button>
        </div>
      </header>

      <section className={styles.balanceSection}>
        <div className={styles.balanceLabel}>Баланс</div>
        <div className={styles.balance}>
          {balance < 0 && <span className={styles.minus}>-</span>}
          <span className={styles.currencyIcon}>
            <FontAwesomeIcon icon={getCurrencyIcon(account.currency)} />
          </span>
          <span className={styles.amount}>{formattedBalance}</span>
        </div>
      </section>

      <section className={styles.actions}>
        {!isClosed && (
          <>
            <button className={styles.deposit} onClick={() => setModal({ type: "income", acc: account })}><FaPlus /></button>
            <button className={styles.withdraw} onClick={() => setModal({ type: "expense", acc: account })}><FaMinus /></button>
            <button className={styles.close} onClick={() => setModal({ type: "close", acc: account })}><FaLock /></button>
          </>
        )}
        {isClosed && (
          <button className={styles.restore} onClick={() => setModal({ type: "restore", acc: account })}><FaUndo /></button>
        )}
      </section>

      <section className={styles.transactions}>
        <h2>Последние транзакции</h2>
        <div className={styles.chartContainer}>
          <Bar data={data} options={options} />
        </div>
        <ul className={styles.txList}>
          {transactions.slice(-7).reverse().map(tx => (
            <li key={tx.id} className={styles.txItem}>
              <span className={styles.txDate}>{new Date(tx.created_at).toLocaleDateString()}</span>
              <span className={styles.txDesc}>{tx.description}</span>
              <span className={styles.txAmount}>{Number(tx.amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Модалки */}
      {modal?.type === "close" && <ConfirmModal title="Закрыть счёт" text={`Закрыть "${modal.acc.account_name}"?`} onCancel={() => setModal(null)} onConfirm={() => { closeAccount(modal.acc.id).then(loadAccount); setModal(null); }} />}
      {modal?.type === "restore" && <ConfirmModal title="Восстановить счёт" text={`Восстановить "${modal.acc.account_name}"?`} onCancel={() => setModal(null)} onConfirm={() => { restoreAccount(modal.acc.id).then(loadAccount); setModal(null); }} />}
      {modal?.type === "income" && <TransactionModal title="Пополнение счёта" onCancel={() => setModal(null)} onSubmit={(data) => { income(modal.acc.id, data).then(loadAccount); setModal(null); }} />}
      {modal?.type === "expense" && <TransactionModal title="Снятие со счёта" onCancel={() => setModal(null)} onSubmit={(data) => { expense(modal.acc.id, data).then(loadAccount); setModal(null); }} />}
    </div>
  );
}
