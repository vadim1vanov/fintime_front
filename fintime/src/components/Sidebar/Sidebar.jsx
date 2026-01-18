import { NavLink } from "react-router-dom";
import {
  FaUser,
  FaWallet,
  FaChartPie,
  FaChartLine,
  FaCog,
  FaQuestionCircle,
  FaHistory,
  FaCreditCard,
  FaExchangeAlt,
  FaBell
} from "react-icons/fa";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>


      <nav className={styles.menu}>
        <NavLink to="/profile" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <FaUser />
          <span>Личный кабинет</span>
        </NavLink>

        <NavLink to="/accounts" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <FaWallet />
          <span>Управление счетами</span>
        </NavLink>

        <NavLink to="/reports" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <FaChartPie />
          <span>Отчёты</span>
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <FaChartLine />
          <span>Аналитика</span>
        </NavLink>

        <NavLink to="/history" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <FaHistory />
          <span>История операций</span>
        </NavLink>

        <NavLink to="/payments" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <FaCreditCard />
          <span>Платежи</span>
        </NavLink>

        <NavLink to="/transfers" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <FaExchangeAlt />
          <span>Переводы</span>
        </NavLink>

        <NavLink to="/notifications" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <FaBell />
          <span>Уведомления</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <FaCog />
          <span>Настройки</span>
        </NavLink>

        <NavLink to="/help" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <FaQuestionCircle />
          <span>Помощь</span>
        </NavLink>
      </nav>
    </aside>
  );
}
