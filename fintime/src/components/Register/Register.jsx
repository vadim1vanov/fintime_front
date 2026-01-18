import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Register.module.css";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("username", username);
      formData.append("password", password);

      const response = await fetch("http://localhost:8080/create/user", {
        method: "POST",
        body: formData,
        credentials: "include"
      });

      if (!response.ok) throw new Error("Ошибка регистрации");

      setSuccess("Регистрация успешна. Вы вошли в систему.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.register}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h3 className={styles.title}>Регистрация в FinTime</h3>

        <input
          type="text"
          placeholder="Имя"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="text"
          placeholder="Фамилия"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="email"
          placeholder="Email"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className={styles.input}
        />

        <input
          type="password"
          placeholder="Пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className={styles.input}
        />

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}

        <button type="submit" disabled={loading} className={styles.btnPrimary}>
          {loading ? "Регистрация..." : "Зарегистрироваться"}
        </button>

        <div className={styles.loginWrapper}>
          <span>Уже есть аккаунт?</span>
          <Link to="/login" className={styles.btnCancel}>
            Войти
          </Link>
        </div>
                <div className={styles.homeLink}>
          <Link to="/">На главную</Link>
        </div>
      </form>
    </div>
  );
}
