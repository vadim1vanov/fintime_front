import { Outlet, useParams } from "react-router-dom";
import AccountNav from "./AccountNav";
import styles from "./AccountView.module.css";

export default function AccountLayout() {
  const { id } = useParams();

  return (
    <div className={styles.container}>
      <AccountNav id={id} />
      <Outlet />
    </div>
  );
}