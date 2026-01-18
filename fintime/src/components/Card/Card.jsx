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
  onRestore,
  onClick
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
    <div
  className={`${styles.card} ${isClosed ? styles.closed : ""}`}
  onClick={onClick}
>

      
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
        <div className={styles.icon}>
          <span className={styles.flag}>
            {getCurrencyFlag(account.currency)}
          </span>
        </div>



          <div>
            <h3 className={styles.title}>
              {account.accountName || account.account_name}
            </h3>
            <span className={styles.currency}>{account.currency}</span>
          </div>
        </div>

        <button className={styles.deleteBtn} onClick={onDelete}>
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
          <button className={styles.deposit} onClick={onIncome}>
            Пополнить
          </button>

          <button className={styles.withdraw} onClick={onExpense}>
            Снять
          </button>

          <div className={styles.menuWrapper} ref={menuRef}>
          <button
            className={`${styles.menuBtn} ${menuOpen ? styles.active : ""}`}
            onClick={() => setMenuOpen(prev => !prev)}
          >
            <FaEllipsisV />
          </button>


            {menuOpen && (
              <div className={styles.menu}>
                <button onClick={onClose} title="Закрыть">
                  <FaLock />
                </button>
                <button title="Редактировать">
                  <FaEdit />
                </button>
                <button title="Перевод">
                  <FaExchangeAlt />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RESTORE */}
      {isClosed && (
        <button className={styles.restore} onClick={onRestore}>
          Восстановить счёт
        </button>
      )}
    </div>
  );
}
