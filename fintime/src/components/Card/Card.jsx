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

  const isClosed = account.status !== "active";

  // Закрытие меню при клике вне него
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (type) => {
    setMenuOpen(false);
    if (type === "edit") {
      alert("Редактировать"); // вызов редактирования
    } else if (type === "transfer") {
      alert("Перевод"); // вызов перевода
    }
  };

  return (
    <div className={`${styles.card} ${isClosed ? styles.closed : ""}`}>
      {/* HEADER */}
      <div className={styles.cardHeader}>
        <div className={`${styles.iconContainer} ${styles[account.currency]}`}>
          <FontAwesomeIcon icon={getCurrencyIcon(account.currency)} />
        </div>

        <div className={styles.headerInfo}>
          <h3 className={styles.accountName}>
            {account.accountName || account.account_name}
          </h3>
          <span className={`${styles.currencyBadge} ${styles[account.currency]}`}>
            {account.currency}
          </span>
        </div>

        <button className={styles.btnDelete} onClick={onDelete}>
          <FaTimes />
        </button>
      </div>

      {/* BALANCE */}
      <div className={`${styles.balance} ${styles[account.currency]}`}>
        <span className={styles.amount}>
          {Number(account.balance).toLocaleString("ru-RU", {
            minimumFractionDigits: 2
          })}
          <span className={styles.currencySymbol}>
            <FontAwesomeIcon icon={getCurrencyIcon(account.currency)} />
          </span>
        </span>
      </div>

      {/* ACTIONS */}
      {!isClosed && (
        <div className={styles.actions}>
          {/* Пополнить и Снять — одна линия */}
          <div className={styles.mainActions}>
            <button className={`${styles.btnDeposit} ${styles.deposit}`} onClick={onIncome}>
              Пополнить
            </button>
            <button className={`${styles.btnWithdraw} ${styles.withdraw}`} onClick={onExpense}>
              Снять
            </button>
          </div>

          {/* Вертикальное меню справа */}
          <div className={styles.actionsWrapper} ref={menuRef}>
            <button
              className={styles.btnMainActions}
              onClick={() => setMenuOpen(prev => !prev)}
            >
              <FaEllipsisV />
            </button>

          {menuOpen && (
            <div
              className={`${styles.verticalMenu} ${styles.verticalMenuOpen}`}
            >
              <button className={styles.navButton} title="Перевод" onClick={() => handleAction("transfer")}>
                <FaExchangeAlt />
              </button>
              <button className={styles.navButton} title="Редактировать" onClick={() => handleAction("edit")}>
                <FaEdit />
              </button>
              <button className={styles.navButton} title="Закрыть счёт" onClick={onClose}>
                <FaLock />
              </button>
            </div>
          )}

          </div>
        </div>
      )}

      {/* Восстановление закрытого счёта */}
      {isClosed && (
        <button 
          className={`${styles.btnRestore} ${styles.fullWidth}`} 
          onClick={onRestore}
        >
          Восстановить
        </button>
      )}
    </div>
  );
}
