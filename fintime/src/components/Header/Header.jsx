import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Header.module.css";
import { FaSignOutAlt, FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function Header() {
  const { isAuth, logout } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      {/* LOGO */}
      <div className={styles.logoBlock}>
        <div className={styles.logo}>FinTime</div>
        <span className={styles.subtitle}>Finance Accounting</span>
      </div>

      {/* NAV */}
      <nav className={styles.nav}>
        {isAuth ? (
          <button className={styles.logoutBtn} onClick={logout}>
            <FaSignOutAlt />
            Выйти
          </button>
        ) : (
          <>
            <Link to="/login" className={styles.link}>
              <FaSignInAlt />
              Войти
            </Link>

            <Link to="/register" className={styles.primaryLink}>
              <FaUserPlus />
              Регистрация
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
