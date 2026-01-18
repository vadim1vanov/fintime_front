import { Outlet } from "react-router-dom";
import Header from "../Header/Header.jsx";
import Sidebar from "../Sidebar/Sidebar.jsx";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.rightSide}>
        <Header />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
