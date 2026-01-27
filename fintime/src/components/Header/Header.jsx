import { useContext, useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Header.module.css";

import {
  FaWallet,
  FaChartLine,
  FaExchangeAlt,
  FaPercent,
  FaCog,
  FaQuestionCircle,
  FaSignOutAlt,
  FaSignInAlt,
  FaThList,
  FaUserCircle,
  FaAngleDown
} from "react-icons/fa";
import { LuSettings } from "react-icons/lu";
import { LuCircleHelp } from "react-icons/lu";
import { FiUsers, FiUser  } from "react-icons/fi";
import { LuLogOut } from "react-icons/lu";
import { FiSettings } from "react-icons/fi";
export default function Header() {
  const { isAuth, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const userRef = useRef(null);

  // временные данные пользователя (потом заменишь из бэка)
  const user = {
    name: "Иван",
    surname: "Иванов",
    email: "ivanov@mail.com"
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (userRef.current && !userRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className={styles.header}>

      {/* ЛЕВЫЙ БЛОК */}
      <div className={styles.leftBlock}>
        <div className={styles.logoBlock}>
          <div className={styles.logo}>FinTime</div>
          <span className={styles.logoBottom}>Finance accounting</span>
        </div>

        {isAuth && (
          <nav className={styles.nav}>

            <NavLink to="/accounts" className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }>
              <FaWallet />
              <span>Счета</span>
              <FaAngleDown className={styles.arrow} />
            </NavLink>

            <NavLink to="/reports" className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }>
              <FaThList />
              <span>Отчёты</span>
              <FaAngleDown className={styles.arrow} />
            </NavLink>

            <NavLink to="/analytics" className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }>
              <FaChartLine />
              <span>Аналитика</span>
              <FaAngleDown className={styles.arrow} />
            </NavLink>

            <NavLink to="/transactions" className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }>
              <FaExchangeAlt />
              <span>Транзакции</span>
              <FaAngleDown className={styles.arrow} />
            </NavLink>

            <NavLink to="/credits" className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }>
              <FaPercent />
              <span>Кредиты</span>
              <FaAngleDown className={styles.arrow} />
            </NavLink>

          </nav>
        )}
      </div>

      {/* ПРАВЫЙ БЛОК */}
      <div className={styles.userBlock} ref={userRef}>
        {isAuth ? (
          <div
            className={styles.avatar}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {user.name[0]}
          </div>
        ) : (
          <NavLink to="/login" className={styles.loginBtn}>
            <FaSignInAlt />
            Войти
          </NavLink>
        )}

        {isAuth && menuOpen && (
          <div className={styles.dropdown}>

            {/* USER INFO */}
            <div className={styles.userInfo}>
              <div className={styles.userAvatarLarge}>
                {user.name[0]}
              </div>

              <div className={styles.userText}>
                <div className={styles.userName}>
                  {user.name} {user.surname}
                </div>
                <div className={styles.userEmail}>
                  {user.email}
                </div>
              </div>
            </div>

            <div className={styles.dropdownDivider}></div>

            <NavLink to="/profile" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
              <FiUser />
              <span>Личный кабинет</span>
            </NavLink>

            <NavLink to="/settings" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
              <LuSettings />
              <span>Настройки</span>
            </NavLink>

            <NavLink to="/help" className={styles.dropdownItem} onClick={() => setMenuOpen(false)}>
              <LuCircleHelp />
              <span>Помощь</span>
            </NavLink>
            <div className={styles.dropdownDivider}></div>

            <button
              className={styles.dropdownItem}
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
            >
              <FiUsers />
              <span>Сменить аккаунт</span>
            </button>
            <button
              className={styles.dropdownItem}
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
            >
              <LuLogOut />
              <span>Выйти</span>
            </button>

          </div>
        )}
      </div>

    </header>
  );
}
