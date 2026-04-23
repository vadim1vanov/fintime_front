import { useEffect, useState } from "react";
import { useParams, NavLink, useNavigate } from "react-router-dom";
import {
  getAccountById,
  getTransactions,
  income,
  expense,
  closeAccount,
  restoreAccount
} from "../../api/api";
import AccountNav from "./AccountNav";
import React from "react";
import {
  LuArrowUpFromLine,
  LuArrowRightLeft,
  LuLock
} from "react-icons/lu";
import { RiDeleteBinLine } from "react-icons/ri";
import { RxReset } from "react-icons/rx";
import {
  PiWalletBold,
  PiArrowUpRightBold,
  PiArrowDownRightBold,
  PiArrowsLeftRightBold,
  PiPlusBold
} from "react-icons/pi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faRubleSign,
  faEuroSign,
  faYenSign,
  faPoundSign
} from "@fortawesome/free-solid-svg-icons";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import {
  FaMoneyBillWave,
  FaCoins,
  FaBriefcase,
  FaChartLine,
  FaUniversity,
  FaGift,
  FaUndo,
  FaPercent,
  FaHome,
  FaShoppingBag,
  FaPlusCircle,
  FaQuestionCircle
} from "react-icons/fa";
import ConfirmModal from "../Modal/ConfirmModal";
import TransactionModal from "../Modal/TransactionModal";

import styles from "./AccountView.module.css";

export default function AccountView() {
  const { id } = useParams();
  const navigate = useNavigate();
const getCurrencySymbol = (currency) => {
  switch (currency) {
    case "RUB": return "₽";
    case "USD": return "$";
    case "EUR": return "€";
    case "JPY": return "¥";
    case "CNY": return "¥";
    case "GBP": return "£";
    default: return "$";
  }
};
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

  useEffect(() => {
    loadData();
  }, [id]);

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

  if (loading) return <div style={{ opacity: 0 }}>Загрузка…</div>;
  if (!account) return <div>Счёт не найден</div>;

  const isClosed = account.status !== "active";
  const balance = Number(account.balance);

  return (
    <div className={styles.container}>

      <div className={styles.balanceCard}>



        {/* ACCOUNT CARD */}
        <div className={styles.accountCard}>
          <div className={styles.icon}>
            <img
              src={getCurrencyFlag(account.currency)}
              alt={account.currency}
              className={account.currency === "USD" ? styles.flagUs : styles.flag}
            />
          </div>

          <div className={styles.accountNameBlock}>
            <h3 className={styles.title}>{account.account_name}</h3>
          </div>

          <div className={`${styles.statusAccount} ${isClosed ? styles.closedStatus : styles.activeStatus}`}>
            {isClosed ? "Закрыт" : "Активен"}
          </div>

          <div className={styles.balanceBlock}>
            <div className={styles.balanceLabel}>Баланс</div>
            <div className={styles.balanceValue}>
              {balance < 0 && <span>-</span>}
              <span className={styles.amount}>
                {Math.abs(balance).toLocaleString("ru-RU", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })}
              </span>
              <FontAwesomeIcon
                icon={getCurrencyIcon(account.currency)}
                className={styles.currencyIcon}
              />
            </div>
          </div>

          <div className={styles.btnsAccount}>
            {!isClosed && (
              <>
                <button onClick={() => setModal({type:"income"})} className={`${styles.actionBtn} ${styles.deposit}`}>
                  <PiPlusBold /> Пополнить
                </button>

                <button onClick={() => setModal({type:"expense"})} className={`${styles.actionBtn} ${styles.withdraw}`}>
                  <LuArrowUpFromLine /> Снять
                </button>

                <button onClick={() => setModal({type:"transfer"})} className={`${styles.actionBtn} ${styles.transferBtn}`}>
                  <LuArrowRightLeft /> Перевести
                </button>

                <button onClick={() => setModal({type:"close"})} className={`${styles.actionBtn} ${styles.closeBtn}`}>
                  <LuLock /> Закрыть
                </button>

                <button onClick={() => setModal({type:"delete"})} className={`${styles.actionBtn} ${styles.deleteBtn}`}>
                  <RiDeleteBinLine /> Удалить
                </button>
              </>
            )}

            {isClosed && (
              <button onClick={() => setModal({type:"restore"})} className={`${styles.actionBtn} ${styles.restore}`}>
                <RxReset /> Восстановить
              </button>
            )}
          </div>
        </div>
      </div>

      {/* TRANSACTIONS PREVIEW (ТОЛЬКО 7) */}
      <div className={styles.content}>
        <section className={styles.txCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.txTitle}>
              Транзакции <span>(последние)</span>
            </h2>

            <button
              className={styles.allTransactionsBtn}
              onClick={() => navigate(`/accounts/${id}/transactions`)}
            >
              Показать все
            </button>
          </div>

          {transactions.length === 0 ? (
            <div className={styles.empty}>Нет операций по счёту</div>
          ) : (
            <div className={styles.txList}>
              {transactions
                .slice(-13)
                .reverse()
                .map(tx => (
                  <div key={tx.id} className={styles.txItem}>
                    <div className={styles.txLeft}>
                      <div className={styles.txLayout}>
                                                <span
                          className={styles.categoryIconSmall}
                          style={{
                            backgroundColor: getCategoryBgColor(tx.category_name),
                            marginRight: "6px"
                          }}
                        >
                          {React.cloneElement(
                            getCategoryIcon(tx.category_name),
                            { color: getCategoryColor(tx.category_name), size: 18 })
                          }
                        </span>

                      </div>
                      <div className={styles.txDate}>
                                            <div className={styles.txType}>
                      

                      {tx.transaction_type === "INCOME" && "Пополнение"}
                      {tx.transaction_type === "EXPENSE" && "Списание"}
                      {tx.transaction_type === "TRANSFER" && "Перевод"}
                    </div>
                        {tx.created_at
                          ? new Date(tx.created_at).toLocaleString("ru-RU")
                          : "—"}
                      </div>
                    </div>

<div
  className={`${styles.txAmount} ${
    tx.transaction_type === "INCOME" ? styles.plus : styles.minus
  }`}
>
  {tx.transaction_type === "INCOME" ? "+" : "-"}

  <span className={styles.amount}>
    {Number(tx.amount).toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}
    <span className={styles.currencyIconView}>
      {getCurrencySymbol(account.currency)}
    </span>
  </span>
</div>
                  </div>
                ))}
            </div>
          )}
        </section>

        <div className={styles.rightPlaceholder}>
          <div className={styles.rightTopPlaceholder}>
          <div className={styles.incomeTotalInfo}>

          </div>
          <div className={styles.expenseTotalInfo}>

          </div>
          </div>
          <div className={styles.rightBottomPlaceholder}>

          </div>
        </div>
      </div>

      {/* MODALS */}
      {modal?.type==="close" && (
        <ConfirmModal
          title="Закрыть счёт"
          text={`Закрыть "${account.account_name}"?`}
          onCancel={()=>setModal(null)}
          onConfirm={()=>{closeAccount(account.id).then(loadData); setModal(null);}}
        />
      )}

      {modal?.type==="restore" && (
        <ConfirmModal
          title="Восстановить счёт"
          text={`Восстановить "${account.account_name}"?`}
          onCancel={()=>setModal(null)}
          onConfirm={()=>{restoreAccount(account.id).then(loadData); setModal(null);}}
        />
      )}

      {modal?.type==="income" && (
        <TransactionModal
          title="Пополнение"
          currency={account.currency}
          onCancel={()=>setModal(null)}
          onSubmit={(data)=>{income(account.id,data).then(loadData); setModal(null);}}
        />
      )}

      {modal?.type==="expense" && (
        <TransactionModal
          title="Списание"
          currency={account.currency}
          onCancel={()=>setModal(null)}
          onSubmit={(data)=>{expense(account.id,data).then(loadData); setModal(null);}}
        />
      )}
    </div>
  );
}



const getCategoryIcon = (name) => {
  switch (name) {
    case "Зарплата": return <FaMoneyBillWave />;
    case "Премия": return <FaCoins />;
    case "Фриланс": return <FaBriefcase />;
    case "Бизнес": return <FaChartLine />;
    case "Инвестиции": return <FaChartLine />;
    case "Дивиденды": return <FaPercent />;
    case "Проценты по вкладам": return <FaUniversity />;
    case "Аренда": return <FaHome />;
    case "Подарки": return <FaGift />;
    case "Возвраты": return <FaUndo />;
    case "Кэшбэк": return <FaShoppingBag />;
    case "Продажа": return <FaPlusCircle />;
    case "Подработка": return <FaBriefcase />;
    case "Стипендия": return <FaUniversity />;
    default: return <FaQuestionCircle />;
  }
};

const getCategoryColor = (name) => {
  switch (name) {
    case "Зарплата": return "#2ad58b";
    case "Премия": return "#d49401";
    case "Фриланс": return "#1575c3";
    case "Бизнес": return "#0059ff";
    case "Инвестиции": return "#ec771d";
    case "Дивиденды": return "#6e1dd1";
    case "Проценты по вкладам": return "#0771b8";
    case "Аренда": return "#0197cd";
    case "Подарки": return "#ef714b";
    case "Возвраты": return "#f05452";
    case "Кэшбэк": return "#e1a448";
    case "Продажа": return "#53bced";
    case "Подработка": return "#9625ac";
    case "Стипендия": return "#64a200";
    default: return "#868686";
  }
};

const getCategoryBgColor = (name) => {
  switch (name) {
    case "Зарплата": return "#e6fff4";
    case "Премия": return "#ffeebf";
    case "Фриланс": return "#d7edff";
    case "Бизнес": return "#d5e4ff";
    case "Инвестиции": return "#ffebdd";
    case "Дивиденды": return "#eee0ff";
    case "Проценты по вкладам": return "#dbf1ff";
    case "Аренда": return "#d9fff7";
    case "Подарки": return "#ffe0d7";
    case "Возвраты": return "#ffdad9";
    case "Кэшбэк": return "#ffedd2";
    case "Продажа": return "#def5ff";
    case "Подработка": return "#efe3ff";
    case "Стипендия": return "#f6ffd0";
    default: return "#eeeeee";
  }
};