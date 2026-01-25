import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./Tooltip.module.css";

export default function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const wrapperRef = useRef(null);
  const tooltipRef = useRef(null);

  const updatePosition = () => {
    if (!wrapperRef.current || !tooltipRef.current) return;

    const rect = wrapperRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    let left = rect.right + 8; // стандартно справа с отступом
    let top = rect.top + rect.height / 2 - tooltipHeight / 2;

    // проверяем, не выходит ли tooltip за правую границу
    if (left + tooltipWidth > viewportWidth) {
      left = viewportWidth - tooltipWidth - 80; // сдвигаем к границе
    }

    // проверяем верхнюю и нижнюю границы экрана
    if (top < 8) top = 8; // не выходим за верх
    if (top + tooltipHeight > viewportHeight - 8) top = viewportHeight - tooltipHeight - 8; // не выходим за низ

    setCoords({ top, left });
  };

  useEffect(() => {
    if (visible) updatePosition();
    const handleResize = () => visible && updatePosition();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [visible]);

  return (
    <>
      <div
        ref={wrapperRef}
        className={styles.wrapper}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            className={`${styles.tooltip} ${styles.right}`} // всегда справа
            style={{
              position: "fixed",
              top: coords.top,
              left: coords.left,
              zIndex: 9999,
            }}
          >
            {text}
          </div>,
          document.body
        )}
    </>
  );
}
