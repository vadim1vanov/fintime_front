import styles from "./Modal.module.css";

export default function ConfirmModal({ title, text, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>{title}</div>
        <div className={styles.text}>{text}</div>

        <div className={styles.footer}>
          <button
            className={`${styles.btn} ${styles.btnCancel}`}
            onClick={onCancel}
          >
            Отмена
          </button>

          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={onConfirm}
          >
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}
