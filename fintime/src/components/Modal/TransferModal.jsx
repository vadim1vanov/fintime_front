import { useState, useRef, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import styles from "./Modal.module.css";
import {
  faDollarSign,
  faRubleSign,
  faEuroSign,
  faYenSign,
  faPoundSign
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function TransferModal({
  title,
  fromAccount,
  accounts = [],
  onSubmit,
  onCancel
}) {
  const [toAccount, setToAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Закрытие при клике вне дропдауна
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (acc) => {
    setToAccount(acc);
    setDropdownOpen(false);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!toAccount || !amount) return;

    onSubmit({
      toAccountId: toAccount.id,
      amount: Number(amount)
    });
  };
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

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel}>
          <FaTimes size={18} />
        </button>

        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <form className={styles.modalForm} onSubmit={submit}>
            <label className={styles.label}>Счёт-отправитель</label>
            <input
              className={styles.input}
              value={fromAccount.account_name}
              readOnly
            />

            <label className={styles.label}>Счёт-получатель</label>
            <div className={styles.dropdownWrapper} ref={dropdownRef}>
              <div
                className={styles.dropdownSelected}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {toAccount ? `${toAccount.account_name} (${toAccount.currency})` : "Выберите счёт"}
              </div>
              {dropdownOpen && (
                <ul className={styles.dropdownList}>
                  {accounts
                    .filter(acc => acc.id !== fromAccount.id)
                    .map((acc) => (
                      <li
                        key={acc.id}
                        className={styles.dropdownItem}
                        onClick={() => handleSelect(acc)}
                      >
                        
                        {acc.account_name}: {" "}  
                        <span>{acc.balance} <FontAwesomeIcon
              icon={getCurrencyIcon(acc.currency)}
              style={{ width: "auto", fontSize: "14px"}} // <-- локально убираем фиксированную ширину
            /> </span>           
                      </li>
                    ))}
                </ul>
              )}
            </div>

            <label className={styles.label}>Сумма</label>
            <input
              type="number"
              step="0.01"
              className={styles.input}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />

            <div className={styles.modalFooter}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnCancel}`}
                onClick={onCancel}
              >
                Отмена
              </button>
              <button
                type="submit"
                className={`${styles.btn} ${styles.btnPrimary}`}
              >
                Перевести
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
