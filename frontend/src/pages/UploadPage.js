import { useState, useRef } from "react";
import axios from "axios";
import templates from "../templates";
import styles from "./UploadPage.module.css";

const STORAGE_KEY = "pf_template";

export default function UploadPage({ onGenerated }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const [selected, setSelected] = useState(
    () => localStorage.getItem(STORAGE_KEY) || "modern"
  );
  const inputRef = useRef();

  const handleFile = (f) => {
    if (f?.type === "application/pdf") { setFile(f); setError(""); }
    else setError("Please upload a PDF file.");
  };

  const select = (key) => {
    setSelected(key);
    localStorage.setItem(STORAGE_KEY, key);
  };

  const handleSubmit = async () => {
    if (!file) return setError("Please select a PDF resume.");
    setLoading(true); setError("");
    try {
      const form = new FormData();
      form.append("resume", file);
      const { data } = await axios.post("/api/generate", form);
      onGenerated(data.data, selected);
    } catch (e) {
      setError(e.response?.data?.error || "Failed to generate. Check your API key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.logo}>⚡ Portfoklio</h1>
        <p className={styles.tagline}>Drop your resume. Get a portfolio in 60 seconds.</p>
      </div>

      <div className={styles.card}>
        {/* Drop zone */}
        <div
          className={`${styles.dropzone} ${drag ? styles.dragOver : ""}`}
          onClick={() => inputRef.current.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => { e.preventDefault(); setDrag(false); handleFile(e.dataTransfer.files[0]); }}
        >
          <input ref={inputRef} type="file" accept=".pdf" hidden onChange={(e) => handleFile(e.target.files[0])} />
          {file ? (
            <p className={styles.fileName}>📄 {file.name}</p>
          ) : (
            <>
              <p className={styles.dropIcon}>📂</p>
              <p>Drag & drop your resume PDF here</p>
              <p className={styles.sub}>or click to browse</p>
            </>
          )}
        </div>

        {/* Template cards */}
        <div>
          <p className={styles.templateLabel}>Choose a template</p>
          <div className={styles.templateGrid}>
            {Object.entries(templates).map(([key, { label, description, colors }]) => (
              <button
                key={key}
                className={`${styles.templateCard} ${selected === key ? styles.activeCard : ""}`}
                onClick={() => select(key)}
              >
                <div
                  className={styles.cardPreview}
                  style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)` }}
                >
                  <div className={styles.previewLines}>
                    <div style={{ background: colors[2] || "#fff", opacity: 0.6 }} />
                    <div style={{ background: colors[2] || "#fff", opacity: 0.3, width: "70%" }} />
                    <div style={{ background: colors[2] || "#fff", opacity: 0.2, width: "85%" }} />
                  </div>
                </div>
                <div className={styles.cardInfo}>
                  <strong>{label}</strong>
                  <span>{description}</span>
                </div>
                {selected === key && <span className={styles.check}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button className={styles.generateBtn} onClick={handleSubmit} disabled={loading}>
          {loading ? "⏳ Generating..." : "✨ Generate Portfolio"}
        </button>
      </div>

      <p className={styles.powered}>Powered by LLaMA-4 Maverick via OpenRouter</p>
    </div>
  );
}
