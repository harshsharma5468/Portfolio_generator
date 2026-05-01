import { useRef, useState } from "react";
import templates from "../templates";
import styles from "./PortfolioPage.module.css";

const STORAGE_KEY = "pf_template";

export default function PortfolioPage({ data, template: initial, onBack }) {
  const [selected, setSelected] = useState(
    () => localStorage.getItem(STORAGE_KEY) || initial || "modern"
  );
  const portfolioRef = useRef();

  const select = (key) => {
    setSelected(key);
    localStorage.setItem(STORAGE_KEY, key);
  };

  const handleDownload = async () => {
    const { default: html2canvas } = await import("html2canvas");
    const { jsPDF } = await import("jspdf");
    const canvas = await html2canvas(portfolioRef.current, { scale: 2, useCORS: true });
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const w = pdf.internal.pageSize.getWidth();
    pdf.addImage(imgData, "PNG", 0, 0, w, (canvas.height * w) / canvas.width);
    pdf.save(`${data.name || "portfolio"}.pdf`);
  };

  const Template = templates[selected].component;

  return (
    <div className={styles.wrapper}>
      <div className={styles.toolbar}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>

        <div className={styles.switcher}>
          {Object.entries(templates).map(([key, { label, colors }]) => (
            <button
              key={key}
              className={`${styles.tBtn} ${selected === key ? styles.active : ""}`}
              onClick={() => select(key)}
              title={templates[key].description}
            >
              <span
                className={styles.dot}
                style={{ background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` }}
              />
              {label}
            </button>
          ))}
        </div>

        <button className={styles.downloadBtn} onClick={handleDownload}>⬇ Download PDF</button>
      </div>

      <div className={styles.preview} ref={portfolioRef}>
        <Template data={data} />
      </div>
    </div>
  );
}
