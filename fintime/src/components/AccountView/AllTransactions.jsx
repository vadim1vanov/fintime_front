import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAccountById, getTransactions } from "../../api/api";
import AccountNav from "./AccountNav";
import { IoIosArrowDown } from "react-icons/io";
import { FiMoreHorizontal } from "react-icons/fi";
import styles from "./AccountView.module.css";
import { TbFileExport } from "react-icons/tb";
import { MdOutlineArrowForward } from "react-icons/md";
import React from "react";
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
export default function AllTransactions() {


  const { id } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
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
  // selected rows
  const [selectedRows, setSelectedRows] = useState([]);

  const toggleRow = (id) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const loadData = async () => {
    setLoading(true);
    const acc = await getAccountById(id);
    const txs = await getTransactions(id);
      const sortedTxs = Array.isArray(txs)
    ? [...txs].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    : [];
    setAccount(acc);
    setTransactions(sortedTxs);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  if (loading) return <div style={{ opacity: 0 }}>Загрузка…</div>;
  if (!account) return <div>Счёт не найден</div>;

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    const sorted = [...transactions].sort((a, b) => {
      let aValue, bValue;

      if (key === "created_at") {
        aValue = new Date(a.created_at);
        bValue = new Date(b.created_at);
      } else if (key === "amount") {
        const getSignedAmount = (tx) =>
          (tx.transaction_type === "INCOME" ? 1 : tx.transaction_type === "EXPENSE" ? -1 : 1) *
          Number(tx.amount);
        aValue = getSignedAmount(a);
        bValue = getSignedAmount(b);
      } else if (key === "transaction_type") {
        const order = { INCOME: 1, TRANSFER: 2, EXPENSE: 3 };
        aValue = order[a.transaction_type] || 99;
        bValue = order[b.transaction_type] || 99;
      } else if (key === "transaction_category") {
        aValue = a.transaction_category || "";
        bValue = b.transaction_category || "";
      }

      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      return 0;
    });

    setSortConfig({ key, direction });
    setTransactions(sorted);
    setCurrentPage(1);
  };

  const renderArrow = (key) => {
    const isActive = sortConfig.key === key;

    const baseStyle = {
      transition: "transform 0.15s ease",
      transformOrigin: "50% 50%",
      display: "inline-block",
    };

    if (!isActive) return <IoIosArrowDown style={baseStyle} />;

    return sortConfig.direction === "asc" ? (
      <IoIosArrowDown style={{ ...baseStyle, transform: "rotate(180deg)" }} />
    ) : (
      <IoIosArrowDown style={baseStyle} />
    );
  };

  const handleDownload = () => {
    alert("Функция скачивания пока не реализована");
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentTransactions = transactions.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(transactions.length / itemsPerPage);
const allSelected =
  transactions.length > 0 &&
  transactions.every(tx => selectedRows.includes(tx.id));

const toggleAll = () => {
  if (allSelected) {
    // снять ВСЁ
    setSelectedRows([]);
  } else {
    // выбрать ВСЁ (все страницы)
    setSelectedRows(transactions.map(tx => tx.id));
  }
};
  // 🔥 ТВОЯ ОРИГИНАЛЬНАЯ ПАГИНАЦИЯ БЕЗ ИЗМЕНЕНИЙ
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 4;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, currentPage + 2);

      if (end - start + 1 < maxVisible) {
        if (currentPage <= 3) {
          end = 4;
        } else {
          start = totalPages - 3;
        }
      } else if (start === 1) {
        end = 4;
      } else if (end === totalPages) {
        start = totalPages - 3;
      } else {
        start = currentPage - 1;
        end = currentPage + 1;
        if (end > totalPages - 1) end = totalPages - 1;
        if (start < 2) start = 2;
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className={styles.container}>
      <div className={styles.transactionsBlock}>

        <div className={styles.txHeaderCard}>
          <h2>Все транзакции по счёту "{account.account_name}"</h2>
          <button className={`${styles.actionBtn} ${styles.saveBtn}`} onClick={handleDownload}>
            <TbFileExport /> Экспорт в CSV
          </button>
        </div>

        <div className={styles.scoreTransaction}>
          Транзакций по счёту: {transactions.length}
        </div>

        {/* HEADER */}
        <div className={styles.txHeader}>
          <div className={styles.txCell}>
  <input
    type="checkbox"
    checked={allSelected}
    onChange={toggleAll}
  />
</div>

          <div
            className={`${styles.txCell} ${styles.thCell}`}
            onClick={() => handleSort("transaction_category")}
          >
            Категория {renderArrow("transaction_category")}
          </div>

          <div
            className={`${styles.txCell} ${styles.thCell}`}
            onClick={() => handleSort("transaction_type")}
          >
            Тип {renderArrow("transaction_type")}
          </div>

          <div
            className={`${styles.txCell} ${styles.thCell}`}
            onClick={() => handleSort("created_at")}
          >
            Дата {renderArrow("created_at")}
          </div>

          <div
            className={`${styles.txCell} ${styles.thCell}`}
            onClick={() => handleSort("amount")}
          >
            Сумма {renderArrow("amount")}
          </div>

          <div className={`${styles.txCell} ${styles.actionsCell}`}>
            Действия
          </div>
        </div>

        {/* ROWS */}
        <div className={styles.txContainer}>
          {currentTransactions.map((tx) => {
            const dateObj = tx.created_at ? new Date(tx.created_at) : null;
            const dateString = dateObj ? dateObj.toLocaleDateString("ru-RU") : "—";
            const timeString = dateObj
              ? dateObj.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" })
              : "";

            const isSelected = selectedRows.includes(tx.id);

            return (
              
              <div
                key={tx.id}
                className={`${styles.txItemTransaction} ${isSelected ? styles.selectedRow : ""}`}
                onClick={(e) => {
                  if (e.target.type === "checkbox") return;
                  if (e.target.closest("button")) return;
                  toggleRow(tx.id);
                }}
              >
                {/* checkbox */}
                <div className={styles.txCell}>
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleRow(tx.id)}
                  />
                </div>

              <div className={styles.txCell}>
                {tx.category_name ? (
                  <div className={styles.categoryRow}>
                  <div
                    className={styles.categoryIconSmall}
                    style={{ backgroundColor: getCategoryBgColor(tx.category_name) }}
                  >
                    {React.cloneElement(getCategoryIcon(tx.category_name), { color: getCategoryColor(tx.category_name)})}
                  </div>

                    <span>{tx.category_name}</span>
                  </div>
                ) : "—"}
              </div>

                <div className={styles.txCell}>
                  <span
                    className={
                      tx.transaction_type === "INCOME"
                        ? styles.incomeText
                        : tx.transaction_type === "EXPENSE"
                        ? styles.expenseText
                        : styles.transferText
                    }
                  >
                    <div className={
                                            tx.transaction_type === "INCOME"
                        ? styles.incomeFlag
                        : tx.transaction_type === "EXPENSE"
                        ? styles.expenseFlag
                        : styles.transferFlag
                    }></div>
                    {tx.transaction_type === "INCOME"
                      ? "Пополнение"
                      : tx.transaction_type === "EXPENSE"
                      ? "Списание"
                      : "Перевод"}
                  </span>
                </div>

                <div className={styles.txCell}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <div>{dateString}</div>
                    {timeString && (
                      <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                        {timeString}
                      </div>
                    )}
                  </div>
                </div>

<div
  className={`${styles.txCell} ${
    tx.transaction_type === "INCOME" ? styles.plus : styles.minus
  }`}
>
  {tx.transaction_type === "INCOME" ? "+" : "-"}

  <span className={styles.amount}>
    {Number(tx.amount).toLocaleString("ru-RU", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} <span className={styles.currencyIcn}>
    {getCurrencySymbol(account.currency)}
 </span>
  </span>


</div>
                <div className={styles.txCell}>
                  <button
                    className={styles.transactionActions}
                    onClick={() =>
                      alert(`Действия для транзакции ${tx.id}`)
                    }
                  >
                    <FiMoreHorizontal />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* 🔥 ТВОЯ ПАГИНАЦИЯ ВЕРНУТА 1:1 */}
        <div className={styles.paginationContainer}>
          <button
            className={`${styles.navPage} ${currentPage === 1 ? styles.disabled : ""}`}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Назад
          </button>

          <div className={styles.pagesList}>
            {!getPageNumbers().includes(1) && (
              <button
                className={currentPage === 1 ? styles.currPage : styles.otherPages}
                onClick={() => setCurrentPage(1)}
              >
                1
              </button>
            )}

            {getPageNumbers()[0] > 2 && <span className={styles.ellipsis}>…</span>}

            {getPageNumbers().map((page) => (
              <button
                key={page}
                className={currentPage === page ? styles.currPage : styles.otherPages}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            {getPageNumbers().slice(-1)[0] < totalPages - 1 && totalPages > 5 && (
              <span className={styles.ellipsis}>…</span>
            )}

            {totalPages > 1 && !getPageNumbers().includes(totalPages) && (
              <button
                className={currentPage === totalPages ? styles.currPage : styles.otherPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                {totalPages}
              </button>
            )}
          </div>

          <button
            className={`${styles.navPage} ${currentPage === totalPages ? styles.disabled : ""}`}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Вперед
          </button>
        </div>

      </div>
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
    case "Прочие доходы": return <FaQuestionCircle />;
    default: return <FaQuestionCircle />;
  }
};

const getCategoryColor = (name) => {
  switch (name) {
    case "Зарплата": return "#06c06f";
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