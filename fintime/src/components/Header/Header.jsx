import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import styles from "./Header.module.css";

export default function Header() {
  const { isAuth, logout } = useContext(AuthContext);

  return (
    <header className={styles.header}>
      <h3>FinTime</h3>
      <nav className={styles.nav}>
        
        {isAuth ? (
          <>
          
            <button onClick={logout}>Выйти</button>
          </>
        ) : (
          <>
            <Link to="/login">Войти</Link>
            <Link to="/register">Зарегистрироваться</Link>
          </>
        )}
      </nav>
    </header>
  );
}
