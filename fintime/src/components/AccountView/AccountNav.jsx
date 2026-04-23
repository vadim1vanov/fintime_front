import { NavLink } from "react-router-dom";
import { Link } from "react-router-dom"; // ✅ Добавь Link

import {
  PiWalletBold,
  PiArrowUpRightBold,
  PiArrowDownRightBold,
  PiArrowsLeftRightBold
} from "react-icons/pi";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import { LuArrowUpRight,  LuArrowDownRight, LuGrid2X2Plus,LuWalletMinimal, LuArrowRightLeft, LuHistory } from "react-icons/lu";
import { BiTransferAlt } from "react-icons/bi";
import styles from "./AccountView.module.css";

export default function AccountNav({ id }) {
  return (
    <div className={styles.navHeader}>
      <Link to="/accounts" className={styles.navBtn}>
        <LuGrid2X2Plus /> Все счета
      </Link>

      <NavLink to={`/accounts/${id}`} end className={({isActive}) => `${styles.navBtn} ${isActive ? styles.activeTab : ""}`}>
        <LuWalletMinimal /> Данные счёта
      </NavLink>

      <NavLink to={`/accounts/${id}/transactions`} className={({isActive}) => `${styles.navBtn} ${isActive ? styles.activeTab : ""}`}>
        < LuHistory /> Все транзакции
      </NavLink>

      <NavLink to={`/accounts/${id}/income`} className={({isActive}) => `${styles.navBtn} ${isActive ? styles.activeTab : ""}`}>
        <LuArrowUpRight/> Доходы
      </NavLink>

      <NavLink to={`/accounts/${id}/expense`} className={({isActive}) => `${styles.navBtn} ${isActive ? styles.activeTab : ""}`}>
        <LuArrowDownRight /> Расходы
      </NavLink>
            <NavLink to={`/accounts/${id}/transfer`} className={({isActive}) => `${styles.navBtn} ${isActive ? styles.activeTab : ""}`}>
        <LuArrowRightLeft  /> Переводы
      </NavLink>
    </div>
  );
}