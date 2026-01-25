import { NavLink, useParams } from "react-router-dom";
import styles from "./AccountsNavBar.module.css";

export default function AccountsNavBar() {
  const { id } = useParams();

  return (
    <div className={styles.navHeaderWrapper}>
      <div className={styles.navHeader}>
        <div className={styles.rightNavItems}>
          <NavLink
            to="/accounts"
            end
            className={({ isActive }) =>
              `${styles.navBtn} ${isActive ? styles.activeTab : ""}`
            }
          >
            Все счета
          </NavLink>

          {id && (
            <>
              <NavLink
                to={`/accounts/${id}`}
                end
                className={({ isActive }) =>
                  `${styles.navBtn} ${isActive ? styles.activeTab : ""}`
                }
              >
                Счёт
              </NavLink>

              <NavLink
                to={`/accounts/${id}/transactions`}
                className={({ isActive }) =>
                  `${styles.navBtn} ${isActive ? styles.activeTab : ""}`
                }
              >
                Все транзакции
              </NavLink>

              <NavLink
                to={`/accounts/${id}/income`}
                className={({ isActive }) =>
                  `${styles.navBtn} ${isActive ? styles.activeTab : ""}`
                }
              >
                Доходы
              </NavLink>

              <NavLink
                to={`/accounts/${id}/expense`}
                className={({ isActive }) =>
                  `${styles.navBtn} ${isActive ? styles.activeTab : ""}`
                }
              >
                Расходы
              </NavLink>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
