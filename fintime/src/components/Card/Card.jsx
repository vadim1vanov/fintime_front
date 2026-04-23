import { useState, useRef, useEffect } from "react";
import { 
  FaTrashAlt, 
  FaLock, 
  FaEllipsisV, 
  FaSyncAlt,
  FaPlus,
  FaPen,
  FaExchangeAlt,
  FaMinus
} from "react-icons/fa";
import Tooltip from "../Tooltip/Tooltip";
import { FiTrash2 } from "react-icons/fi";
import { FiCheck } from "react-icons/fi";
import { HiX } from "react-icons/hi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PiLockKeyBold , PiArrowsClockwiseBold, PiTrashBold, PiCurrencyDollarSimpleBold } from "react-icons/pi";
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
  onRestore,
  onTransfer
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isClosed = account.status !== "active";

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
            <img
  src={getCurrencyFlag(account.currency)}
  alt={account.currency}
  className={`${account.currency === "USD" ? styles.flagUs : account.currency=== "CNY" ?  styles.flagChina : styles.flag }`}
/>
          </div>
          <div>
            <h3 className={styles.title}>
              {account.accountName || account.account_name}
            </h3>
            <span className={styles.currency}>{account.currency}</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={`${styles.statusAccount} ${isClosed ? styles.closedStatus : styles.activeStatus}`}>
             {isClosed ? "Закрыт" : "Активен"} 
            
          </div>
        </div>

      </div>

<div className={styles.balanceBlock}>
        <div className={styles.balanceLabel}>Баланс</div>
        <div className={styles.balance}>
          {Number(account.balance) < 0 && <span>-</span>}

          <span className={styles.amount}>
            {Math.abs(Number(account.balance)).toLocaleString("ru-RU", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            })}
          </span>
          
          {/* Текстовый символ валюты */}
          <span className={styles.currencyIcon}>
            {getCurrencySymbol(account.currency)}
          </span>

          {!isClosed && (
            <>
              <button
                className={styles.lockBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                  setMenuOpen(false);
                }}
              >
                <Tooltip text="Закрыть">
                  <PiLockKeyBold />
                </Tooltip>
              </button>

              <button
                className={styles.refreshBtn}
                onClick={(e) => { 
                  e.stopPropagation(); 
                }}
              >
                <Tooltip text="Баланс в другой валюте">
                  <PiCurrencyDollarSimpleBold />
                </Tooltip>
              </button>
            </>
          )}

          <button
            className={styles.deleteBtn}
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
          >
            <Tooltip text="Удалить">
              <PiTrashBold />
            </Tooltip>
          </button>
        </div>
      </div>

      {/* ACTIONS */}
      {!isClosed && (
        <div className={styles.actions}>
          <button
            className={styles.deposit}
            onClick={(e) => { e.stopPropagation(); onIncome(); }}
          >
            <FaPlus />
            Пополнить
          </button>
          <button
            className={styles.withdraw}
            onClick={(e) => { e.stopPropagation(); onExpense(); }}
          >
            <FaMinus />
            Снять
          </button>

      <button
        className={styles.transferBtn}
        onClick={(e) => { e.stopPropagation(); onTransfer(); }}
        title="Перевод"
      >
        <FaExchangeAlt />
        Перевод
      </button>


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
