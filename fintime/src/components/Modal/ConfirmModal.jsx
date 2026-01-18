import styles from "./Modal.module.css";
import { FaTimes } from "react-icons/fa";

export default function ConfirmModal({ title, text, onConfirm, onCancel }) {
  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onCancel}>
          <FaTimes size={18} />
        </button>

        <div className={styles.modalBody}>
          <h2 className={styles.modalTitle}>{title}</h2>
          <p className={styles.modalText}>{text}</p>
        </div>

        <div className={styles.modalFooter}>
          <button className={`${styles.btn} ${styles.btnCancel}`} onClick={onCancel}>
            Отмена
          </button>
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={onConfirm}>
            Подтвердить
          </button>
        </div>
      </div>
    </div>
  );
}