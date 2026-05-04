import { useState, useEffect } from "react";
import styles from "./Toast.module.css";

export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = "info") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  return { toasts, show };
}

export default function Toast({ toasts }) {
  return (
    <div className={styles.container}>
      {toasts.map((t) => (
        <div key={t.id} className={`${styles.toast} ${styles[t.type]}`}>
          {t.type === "success" && "✅ "}
          {t.type === "error" && "❌ "}
          {t.type === "info" && "ℹ️ "}
          {t.message}
        </div>
      ))}
    </div>
  );
}
