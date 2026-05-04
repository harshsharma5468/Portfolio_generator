import styles from "./Skeleton.module.css";

export default function Skeleton() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={`${styles.block} ${styles.name}`} />
        <div className={`${styles.block} ${styles.title}`} />
        <div className={`${styles.block} ${styles.summary}`} />
      </div>
      <div className={styles.body}>
        <div className={styles.col}>
          {[80, 60, 90, 70].map((w, i) => (
            <div key={i} className={styles.block} style={{ width: `${w}%`, height: "14px", marginBottom: "8px" }} />
          ))}
        </div>
        <div className={styles.col}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.card}>
              <div className={`${styles.block} ${styles.cardTitle}`} />
              <div className={`${styles.block} ${styles.cardLine}`} />
              <div className={`${styles.block} ${styles.cardLine}`} style={{ width: "70%" }} />
            </div>
          ))}
        </div>
      </div>
      <p className={styles.hint}>⏳ Analysing your resume with AI…</p>
    </div>
  );
}
