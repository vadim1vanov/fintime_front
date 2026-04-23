import { useState, useEffect } from "react";
import styles from "./Modal.module.css";
import { FaTimes } from "react-icons/fa";
import { getIncomeCategories } from "../../api/api";

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

export default function TransactionModal({
  title,
  onSubmit,
  onCancel,
  currency = "RUB"
}) {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [openCategories, setOpenCategories] = useState(false);

  useEffect(() => {
    getIncomeCategories().then((data) => {
      setCategories(
        data.map((c) => ({
          id: c.id,
          category_name: c.category_name || c.categoryName
        }))
      );
    });
  }, []);

  // ===== FORMAT =====
  const formatNumber = (value) => {
    if (!value) return "";
    return Number(value).toLocaleString("ru-RU");
  };

  const parseNumber = (value) => value.replace(/\s/g, "");

  const handleAmountChange = (e) => {
    const raw = parseNumber(e.target.value);

    if (raw === "") {
      setAmount("");
      return;
    }

    if (/^\d+$/.test(raw)) {
      setAmount(raw);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!category) return;

    onSubmit({
      amount: Number(amount),
      description,
      category_name: category.category_name
    });
  };

  // ===== CURRENCY SYMBOL =====
  const getCurrencySymbol = (curr) => {
    switch (curr?.toUpperCase()) {
      case "RUB": return "₽";
      case "USD": return "$";
      case "EUR": return "€";
      case "GBP": return "£";
      case "JPY":
      case "CNY": return "¥";
      default: return curr || "₽";
    }
  };

  return (
    <div
      className={styles.overlay}
      onClick={() => {
        setOpenCategories(false);
        onCancel();
      }}
    >
      <div
        className={styles.modal}
        onClick={(e) => {
          e.stopPropagation();
          setOpenCategories(false);
        }}
      >
        <button className={styles.closeBtn} onClick={onCancel}>
          <FaTimes />
        </button>

        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>{title}</h2>

          <form className={styles.modalForm} onSubmit={submit}>
            {/* ===== AMOUNT ===== */}
            <label className={styles.label}>Сумма</label>

            <div className={styles.inputWrapper}>
              <input
                placeholder="0"
                type="text"
                inputMode="numeric"
                className={styles.input}
                value={formatNumber(amount)}
                onChange={handleAmountChange}
              />

              {amount && (
                <button
                  type="button"
                  className={styles.clearBtn}
                  onClick={() => setAmount("")}
                >
                  <FaTimes size={12} />
                </button>
              )}
            </div>

            {/* ===== HINTS ===== */}
            <div className={styles.amountHints}>
              {[100, 500, 1000, 2000, 5000, 10000, 100000].map((val) => {
                const isActive = Number(amount) === val;

                return (
                  <div
                    key={val}
                    className={`${styles.hint} ${
                      isActive ? styles.hintActive : ""
                    }`}
                    onClick={() => setAmount(val)}
                  >
                    <span className={styles.hintAmount}>
                      {val.toLocaleString("ru-RU")}
                    </span>
                    <span className={styles.hintCurrency}>
                      {getCurrencySymbol(currency)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ===== CATEGORY ===== */}
            <label className={styles.label}>Категория дохода</label>

            <div
              className={styles.categorySelectRow}
              onClick={(e) => {
                e.stopPropagation();
                setOpenCategories(true);
              }}
            >
              <div className={styles.categorySelectBtn}>
                Категория
              </div>

              <div className={styles.categorySelectedPreview}>
                {category ? (
                  <>
                    <span
                      className={styles.previewIcon}
                      style={{
                        backgroundColor: getCategoryColor(
                          category.category_name
                        )
                      }}
                    >
                      {getCategoryIcon(category.category_name)}
                    </span>

                    <span className={styles.previewText}>
                      {category.category_name}
                    </span>
                  </>
                ) : (
                  <span className={styles.placeholder}>
                    Не выбрана
                  </span>
                )}
              </div>
            </div>

            {/* ===== DESCRIPTION ===== */}
            <label className={styles.label}>Описание</label>
            <input
              className={styles.input}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <div className={styles.modalFooter}>
              <button type="submit" className={styles.btnPrimary}>
                Пополнить
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ===== CATEGORY WIDGET ===== */}
      <div
        className={`${styles.categoryWidget} ${
          openCategories ? styles.openWidget : ""
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.widgetHeader}>
          <h3>Категории</h3>

          <button
            className={styles.closeBtn}
            onClick={() => setOpenCategories(false)}
          >
            <FaTimes />
          </button>
        </div>

        <div className={styles.categoryGrid}>
          {categories.map((c) => {
            const isActive = category?.id === c.id;

            return (
              <div
                key={c.id}
                className={`${styles.categoryCard} ${
                  isActive ? styles.active : ""
                }`}
                onClick={() => {
                  setCategory(c);
                  setOpenCategories(false);
                }}
              >
                <div
                  className={styles.categoryIcon}
                  style={{
                    backgroundColor: getCategoryColor(c.category_name)
                  }}
                >
                  {getCategoryIcon(c.category_name)}
                </div>

                <div className={styles.category_name}>
                  {c.category_name}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ===== CATEGORY HELPERS ===== */

const getCategoryColor = (name) => {
  switch (name) {
    case "Зарплата": return "#beffe3";
    case "Премия": return "#c9ffcc";
    case "Фриланс": return "#a5d6ff";
    case "Бизнес": return "#91b8ff";
    case "Инвестиции": return "#ffb780";
    case "Дивиденды": return "#d2adff";
    case "Проценты по вкладам": return "#c5e8ff";
    case "Аренда": return "#baa79f";
    case "Подарки": return "#ffb59f";
    case "Возвраты": return "#ffa2a0";
    case "Кэшбэк": return "#ffdba4";
    case "Продажа": return "#c8e5f2";
    case "Подработка": return "#b6beec";
    case "Стипендия": return "#dce1c5";
    default: return "#c3c3c3";
  }
};

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