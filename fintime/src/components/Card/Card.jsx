import { useState, useRef, useEffect } from "react";
import { FaTimes, FaLock, FaEdit, FaExchangeAlt, FaEllipsisV } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDollarSign,
  faRubleSign,
  faEuroSign,
  faYenSign,
  faPoundSign
} from "@fortawesome/free-solid-svg-icons";
import styles from "./Card.module.css";

export default function Card({
  account,
  onDelete,
  onIncome,
  onExpense,
  onClose,
  onRestore
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isClosed = account.status !== "active";

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

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`${styles.card} ${isClosed ? styles.closed : ""}`}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.icon}>
            <span className={styles.flag}>{getCurrencyFlag(account.currency)}</span>
          </div>
          <div>
            <h3 className={styles.title}>
              {account.accountName || account.account_name}
            </h3>
            <span className={styles.currency}>{account.currency}</span>
          </div>
        </div>

        <button
          className={styles.deleteBtn}
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Удалить"
        >
          <FaTimes />
        </button>
      </div>

      {/* BALANCE */}
      <div className={styles.balanceBlock}>
        <div className={styles.balanceLabel}>Баланс</div>
        <div className={styles.balance}>
          {Number(account.balance) < 0 && <span className={styles.minus}>-</span>}
          <span className={styles.currencyIcon}>
            <FontAwesomeIcon
              icon={getCurrencyIcon(account.currency)}
              style={{ width: "auto" }} // <-- локально убираем фиксированную ширину
            />
          </span>

          <span className={styles.amount}>
            {Math.abs(Number(account.balance)).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
        </div>
      </div>

      {/* ACTIONS */}
      {!isClosed && (
        <div className={styles.actions}>
          <button
            className={styles.deposit}
            onClick={(e) => { e.stopPropagation(); onIncome(); }}
          >
            Пополнить
          </button>
          <button
            className={styles.withdraw}
            onClick={(e) => { e.stopPropagation(); onExpense(); }}
          >
            Снять
          </button>

{/* Меню троеточия */}
<div className={styles.menuWrapper} ref={menuRef}>
  <button
    className={`${styles.menuBtn} ${menuOpen ? styles.active : ""}`}
    onClick={(e) => { 
      e.stopPropagation(); // <-- останавливаем всплытие
      setMenuOpen((prev) => !prev); 
    }}
  >
    <FaEllipsisV />
  </button>
  {menuOpen && (
    <div className={styles.menu}>
      <button
        onClick={(e) => { 
          e.stopPropagation(); // <-- останавливаем переход
          onClose(); 
          setMenuOpen(false);
        }}
        title="Закрыть"
      >
        <FaLock />
      </button>
      <button
        onClick={(e) => { 
          e.stopPropagation(); 
          // здесь будет твой edit action
          setMenuOpen(false);
        }}
        title="Редактировать"
      >
        <FaEdit />
      </button>
      <button
        onClick={(e) => { 
          e.stopPropagation(); 
          // здесь будет твой transfer action
          setMenuOpen(false);
        }}
        title="Перевод"
      >
        <FaExchangeAlt />
      </button>
    </div>
  )}
</div>

        </div>
      )}

      {/* RESTORE */}
      {isClosed && (
        <button
          className={styles.restore}
          onClick={(e) => { e.stopPropagation(); onRestore(); }}
        >
          Восстановить счёт
        </button>
      )}
    </div>
  );
}
