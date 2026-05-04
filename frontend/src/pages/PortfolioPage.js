import { useRef, useState, useEffect } from "react";
import templates from "../templates";
import Toast, { useToast } from "../components/Toast";
import styles from "./PortfolioPage.module.css";

const STORAGE_KEY = "pf_template";
const DATA_KEY = "pf_data";

export default function PortfolioPage({ data, template: initial, onBack }) {
  const [selected, setSelected] = useState(
    () => localStorage.getItem(STORAGE_KEY) || initial || "modern"
  );
  const portfolioRef = useRef();
  const { toasts, show } = useToast();

  // Persist data so shareable link can reload it
  useEffect(() => {
    try {
      localStorage.setItem(DATA_KEY, JSON.stringify(data));
    } catch {
      // storage full — ignore
    }
  }, [data]);

  const select = (key) => {
    setSelected(key);
    localStorage.setItem(STORAGE_KEY, key);
  };

  const handleDownload = async () => {
    show("Preparing PDF…", "info");
    try {
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(portfolioRef.current, { scale: 2, useCORS: true });
      const pdf = new jsPDF("p", "mm", "a4");
      const imgData = canvas.toDataURL("image/png");
      const w = pdf.internal.pageSize.getWidth();
      pdf.addImage(imgData, "PNG", 0, 0, w, (canvas.height * w) / canvas.width);
      pdf.save(`${data.name || "portfolio"}.pdf`);
      show("PDF downloaded!", "success");
    } catch {
      show("PDF export failed. Try again.", "error");
    }
  };

  const handleShare = () => {
    try {
      const encoded = btoa(encodeURIComponent(JSON.stringify({ data, template: selected })));
      const url = `${window.location.origin}${window.location.pathname}?share=${encoded}`;
      navigator.clipboard.writeText(url);
      show("Shareable link copied to clipboard!", "success");
    } catch {
      show("Could not copy link.", "error");
    }
  };

  const Template = templates[selected]?.component;

  if (!Template) return <p style={{ color: "white", padding: "2rem" }}>Template not found.</p>;

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

        <div className={styles.actions}>
          <button className={styles.shareBtn} onClick={handleShare}>🔗 Share</button>
          <button className={styles.downloadBtn} onClick={handleDownload}>⬇ Download PDF</button>
        </div>
      </div>

      <div className={styles.preview} ref={portfolioRef}>
        <Template data={data} />
      </div>

      <Toast toasts={toasts} />
    </div>
  );
}
