import { NavLink } from "react-router-dom";
import { FaUser, FaWallet, FaChartPie, FaChartLine, FaCog, FaQuestionCircle, FaHistory, FaCreditCard, FaExchangeAlt, FaBell } from "react-icons/fa";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sideMenu}>
      <nav>
        <NavLink to="/profile" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
          <FaUser />
          Личный кабинет
        </NavLink>

        <NavLink to="/accounts" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
          <FaWallet />
          Управление счетами
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
          <FaChartPie />
          Отчёты
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
          <FaChartLine />
          Аналитика
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
          <FaCog />
          Настройки
        </NavLink>

        <NavLink to="/help" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
          <FaQuestionCircle />
          Помощь
        </NavLink>

        <NavLink to="/history" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
          <FaHistory />
          История операций
        </NavLink>

        <NavLink to="/payments" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
          <FaCreditCard />
          Платежи
        </NavLink>

        <NavLink to="/transfers" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
          <FaExchangeAlt />
          Переводы
        </NavLink>

        <NavLink to="/notifications" className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}>
          <FaBell />
          Уведомления
        </NavLink>
      </nav>
    </aside>
  );
}
