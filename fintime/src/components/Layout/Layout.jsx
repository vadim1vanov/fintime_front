import Header from "../Header/Header.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import styles from "./Layout.module.css";

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      {/* Сайдбар слева */}
      <Sidebar />

      {/* Правая колонка с Header и контентом */}
      <div className={styles.rightSide}>
        <Header />
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
