  import { useEffect, useState } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import {
    getAccountById,
    getTransactions,
    income,
    expense,
    closeAccount,
    restoreAccount
  } from "../../api/api";
import { NavLink } from "react-router-dom";
import { LuArrowUpFromLine } from "react-icons/lu";
  import {
    FaArrowLeft,
    FaPlus,
    FaMinus,
    FaLock,
    FaUndo
  } from "react-icons/fa";
import { LiaExchangeAltSolid } from "react-icons/lia";
import { LuArrowRightLeft } from "react-icons/lu";
import { LiaLockSolid } from "react-icons/lia";
import { LuWallet } from "react-icons/lu";
import { LiaUploadSolid } from "react-icons/lia";
  import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
  import {
    faDollarSign,
    faRubleSign,
    faEuroSign,
    faYenSign,
    faPoundSign
  } from "@fortawesome/free-solid-svg-icons";
import { LiaWalletSolid } from "react-icons/lia";
import { LuLock } from "react-icons/lu";
  import ConfirmModal from "../Modal/ConfirmModal";
  import TransactionModal from "../Modal/TransactionModal";
  import styles from "./AccountView.module.css";

  export default function AccountView() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [account, setAccount] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [modal, setModal] = useState(null);
    const [loading, setLoading] = useState(true);
  

    const loadData = async () => {
      setLoading(true);
      const acc = await getAccountById(id);
      const txs = await getTransactions(id);

      setAccount(acc);
      setTransactions(Array.isArray(txs) ? txs : []);
      setLoading(false);
    };
    const getCurrencyFlag = (currency) => {
      switch (currency) {
        case "RUB": return "/flags/ru.svg";
        case "USD": return "/flags/us.svg";
        case "EUR": return "/flags/eu.svg";
        case "JPY": return "/flags/jp.svg";
        case "CNY": return "/flags/cn.svg";
        case "GBP": return "/flags/gb.svg";
        default: return "💰";
      }
    };

    useEffect(() => {
      loadData();
    }, [id]);

    if (loading) return <div className={styles.loading} style={{opacity:"0"}}>Загрузка…</div>;
    if (!account) return <div className={styles.error}>Счёт не найден</div>;

    const isClosed = account.status !== "active";
    const balance = Number(account.balance);

    const getCurrencyIcon = (currency) => {
      switch (currency) {
        case "RUB": return faRubleSign;
        case "USD": return faDollarSign;
        case "EUR": return faEuroSign;
        case "JPY": return faYenSign;
        case "GBP": return faPoundSign;
        default: return faDollarSign;
      }
    };

    const formatAmount = (amount) =>
      Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
      <div className={styles.container}>
        {/* HEADER */}
        <div className={styles.header}>
          <div className={styles.navHeader}>

          


<div className={styles.rightNavItems}>
  <NavLink
    to="/account"
    className={({ isActive }) =>
      `${styles.navBtn} ${isActive ? styles.activeTab : ""}`
    }
  >
    Все счета
  </NavLink>

  {id && (
    <>

      <NavLink
        to={`/accounts/${id}`}
        className={({ isActive }) =>
          `${styles.navBtn} ${isActive ? styles.activeTab : ""}`
        }
      >
        Данные счёта
      </NavLink>

      <NavLink
        to={`/accounts/${id}/transactions`}
        className={({ isActive }) =>
          `${styles.navBtn} ${isActive ? styles.activeTab : ""}`
        }
      >
        Все транзакции
      </NavLink>

      <NavLink
        to={`/accounts/${id}/income`}
        className={({ isActive }) =>
          `${styles.navBtn} ${isActive ? styles.activeTab : ""}`
        }
      >
        Доходы
      </NavLink>

      <NavLink
        to={`/accounts/${id}/expense`}
        className={({ isActive }) =>
          `${styles.navBtn} ${isActive ? styles.activeTab : ""}`
        }
      >
        Расходы
      </NavLink>
    </>
  )}
</div>
          
          </div>

  <div className={styles.balanceCard}>
    <div className={styles.accountCard}>
    <div className={styles.accountTitle}>
      <div className={styles.headerLeft}>
      <div className={styles.icon}>
            <img
  src={getCurrencyFlag(account.currency)}
  alt={account.currency}
  className={`${!(account.currency === "USD") ? styles.flag :  styles.flagUs}`}
/>
      </div>
      <div>
        <h3 className={styles.title}>{account.account_name}</h3>
        <span className={styles.currency}>{account.currency}</span>
      </div></div>
              <div className={styles.headerRight}>
                <div className={`${styles.statusAccount} ${isClosed ? styles.closedStatus : styles.activeStatus}`}>
                  {isClosed ? "Закрыт" : "Активен"}
                </div>
              </div>
    </div>

    <div className={styles.balanceLabel}>Баланс</div>
    <div className={styles.balanceValue}>
      {balance < 0 && <span >-</span>}
      <FontAwesomeIcon icon={getCurrencyIcon(account.currency)} className={styles.currencyIcon} style={{width:"auto"}} />
      <span className={styles.amount}>
        {Math.abs(balance).toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        })}
      </span>
    </div>

      <div className={styles.cardBalanceButtons}>
      {!isClosed && (
        <>
          <button onClick={() => setModal({ type: "income" })} className={styles.deposit}>
            <LuWallet  />
          </button>
  <div className={styles.actions}>

          <button onClick={() => setModal({ type: "expense" })} className={styles.withdraw}>
            <LuArrowUpFromLine  />
          </button>
                              <button onClick={() => setModal({ type: "transfer" })} className={styles.transferBtn}>
            <LuArrowRightLeft />
          </button>
          <button onClick={() => setModal({ type: "close" })} className={styles.closeBtn}>
            <LuLock/>
          </button>

          </div>
        </>
      )}
      {isClosed && (
        <button onClick={() => setModal({ type: "restore" })} className={styles.restore}>
          <FaUndo /> Восстановить
        </button>
      )}</div>
    </div>
  </div>
  </div>


        {/* CONTENT */}
        <div className={styles.content}>
          {/* TRANSACTIONS CARD */}
          <section className={styles.txCard}>
            <div className={styles.cardHeader}>
            <h2 className={styles.txTitle}>Транзакции <span>(последние)</span></h2>
            <button className={styles.allTransactionsBtn}>Показать все</button>
            </div>
            {transactions.length === 0 ? (
              <div className={styles.empty}>Нет операций по счёту</div>
            ) : (
              <div className={styles.txList}>
                {transactions.slice(-7).reverse().map(tx => (
                  <div key={tx.id} className={styles.txItem}>
                    <div className={styles.txLeft}>
                      <div className={styles.txType}>
                        {tx.transaction_type === "INCOME" && "Пополнение"}
                        {tx.transaction_type === "EXPENSE" && "Списание"}
                        {tx.transaction_type === "TRANSFER" && "Перевод"}
                      </div>
                      <div className={styles.txDate}>
                        {tx.created_at ? new Date(tx.created_at).toLocaleString("ru-RU") : "—"}
                      </div>
                    </div>
                    <div className={`${styles.txAmount} ${tx.transaction_type === "INCOME" ? styles.plus : styles.minus}`}>
                      {tx.transaction_type === "INCOME" ? "+" : "-"}
                      {Number(tx.amount).toLocaleString("ru-RU", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </section>

          {/* RIGHT PLACEHOLDER */}
          <div className={styles.rightPlaceholder}></div>
        </div>

        {/* MODALS */}
        {modal?.type === "close" && (
          <ConfirmModal
            title="Закрыть счёт"
            text={`Закрыть "${account.account_name}"?`}
            onCancel={() => setModal(null)}
            onConfirm={() => {
              closeAccount(account.id).then(loadData);
              setModal(null);
            }}
          />
        )}
        {modal?.type === "restore" && (
          <ConfirmModal
            title="Восстановить счёт"
            text={`Восстановить "${account.account_name}"?`}
            onCancel={() => setModal(null)}
            onConfirm={() => {
              restoreAccount(account.id).then(loadData);
              setModal(null);
            }}
          />
        )}
        {modal?.type === "income" && (
          <TransactionModal
            title="Пополнение"
            onCancel={() => setModal(null)}
            onSubmit={(data) => {
              income(account.id, data).then(loadData);
              setModal(null);
            }}
          />
        )}
        {modal?.type === "expense" && (
          <TransactionModal
            title="Списание"
            onCancel={() => setModal(null)}
            onSubmit={(data) => {
              expense(account.id, data).then(loadData);
              setModal(null);
            }}
          />
        )}
        
        
      </div>
    );
  }
