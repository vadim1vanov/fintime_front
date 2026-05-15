import { useEffect, useState } from "react";
import styles from "./Profile.module.css";
import { getCurrentUser, updateUser } from "../../api/api";

export default function Profile() {
  const [user, setUser] = useState(null);

  const [first_name, setfirst_name] = useState("");
  const [last_name, setlast_name] = useState("");
  const [username, setUsername] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await getCurrentUser();

      setUser(data);

      setfirst_name(data.first_name || "");
      setlast_name(data.last_name || "");
      setUsername(data.username || "");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    try {
      setSaving(true);

      await updateUser(user.id, {
        first_name: first_name,
        last_name: last_name,
        username
      });

      await loadUser();
    } catch (e) {
      console.error(e);
      alert("Ошибка сохранения");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  return (
    <div className={styles.page}>



      <div className={styles.card}>
        
        {/* LEFT */}
        <div className={styles.left}>
          <div className={styles.avatar}>
            {first_name?.[0]}
            {last_name?.[0]}
          </div>

          <div className={styles.userName}>
            {first_name} {last_name}
          </div>

          <div className={styles.userEmail}>
            {username}
          </div>

          <div className={styles.stats}>
            <div className={styles.infoCard}>
              <span>Счетов</span>
              <b>{user.countAccounts || 0}</b>
            </div>
{/* 
            <div className={styles.infoCard}>
              <span>ID пользователя</span>
              <b>#{user.id}</b>
            </div> */}
          </div>
        </div>

        {/* RIGHT */}
        <div className={styles.right}>
          <div className={styles.formGrid}>
            <div className={styles.group}>
              <label className={styles.label}>
                Имя
              </label>

              <input
                className={styles.input}
                value={first_name}
                onChange={(e) => setfirst_name(e.target.value)}
              />
            </div>

            <div className={styles.group}>
              <label className={styles.label}>
                Фамилия
              </label>

              <input
                className={styles.input}
                value={last_name}
                onChange={(e) => setlast_name(e.target.value)}
              />
            </div>

            <div className={`${styles.group} ${styles.groupFull}`}>
              <label className={styles.label}>
                Email
              </label>

              <input
                className={styles.input}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.actions}>
            <button
              onClick={handleSave}
              className={styles.saveBtn}
              disabled={saving}
            >
              {saving ? "Сохранение..." : "Сохранить изменения"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}