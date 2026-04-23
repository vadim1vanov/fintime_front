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
import { TbBuildingBank } from "react-icons/tb";

import { LuHistory } from "react-icons/lu";
import styles from "./Sidebar.module.css";
import { PiWalletBold, PiUserBold, PiChartDonutDuotone, PiChartBarDuotone,PiMoneyDuotone, PiBellRingingBold, PiArrowsDownUpFill,
  PiGearSixBold, PiQuestionBold, PiArrowsLeftRightBold, PiCalendar
 } from "react-icons/pi";
export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>


      <nav className={styles.menu}>
        <NavLink to="/profile" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <PiUserBold  />
          <span>Личный кабинет</span>
        </NavLink>

<NavLink
  to="/accounts"
  className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}
>
  <PiWalletBold />
  <span>Управление счетами</span>
  <span className={styles.badge}>3</span>
</NavLink>


        <NavLink to="/reports" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <PiChartDonutDuotone />
          <span>Отчёты</span>
        </NavLink>

        <NavLink to="/analytics" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <PiChartBarDuotone />
          <span>Аналитика</span>
        </NavLink>
                <NavLink to="/calendar" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <PiCalendar />
          <span>Календарь</span>
        </NavLink>
                <NavLink to="/payments" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <TbBuildingBank />
          <span>Кредиты</span>
        </NavLink>
        <NavLink to="/history" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <LuHistory />
          <span>История операций</span>
        </NavLink>






        <NavLink to="/notifications" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <PiBellRingingBold />
          <span>Уведомления</span>
        </NavLink>

        <NavLink to="/settings" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <PiGearSixBold />
          <span>Настройки</span>
        </NavLink>

        <NavLink to="/help" className={({ isActive }) => `${styles.item} ${isActive ? styles.active : ""}`}>
          <PiQuestionBold />
          <span>Помощь</span>
        </NavLink>
      </nav>
    </aside>
  );
}
