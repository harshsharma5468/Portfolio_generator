import { useState, useRef } from "react";
import axios from "axios";
import templates from "../templates";
import Toast, { useToast } from "../components/Toast";
import Skeleton from "../components/Skeleton";
import styles from "./UploadPage.module.css";

const STORAGE_KEY = "pf_template";

export default function UploadPage({ onGenerated, onATS, onTailor, onJDAnalyze }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingATS, setLoadingATS] = useState(false);
  const [loadingTailor, setLoadingTailor] = useState(false);
  const [loadingJD, setLoadingJD] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const [selected, setSelected] = useState(() => localStorage.getItem(STORAGE_KEY) || "modern");
  const [jobRole, setJobRole] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [showJD, setShowJD] = useState(false);
  const inputRef = useRef();
  const { toasts, show } = useToast();

  const handleFile = (f) => {
    if (f?.type === "application/pdf") { setFile(f); setError(""); show(`📄 ${f.name} selected`, "success"); }
    else { setError("Please upload a PDF file."); show("Only PDF files are accepted.", "error"); }
  };

  const select = (key) => { setSelected(key); localStorage.setItem(STORAGE_KEY, key); };

  const buildForm = () => {
    const form = new FormData();
    form.append("resume", file);
    if (jobRole.trim()) form.append("jobRole", jobRole.trim());
    if (jobDescription.trim()) form.append("jobDescription", jobDescription.trim());
    return form;
  };

  const handleSubmit = async () => {
    if (!file) { setError("Please select a PDF resume."); show("No file selected.", "error"); return; }
    setLoading(true); setError("");
    show("Generating your portfolio…", "info");
    try {
      const { data } = await axios.post("/api/generate", buildForm());
      show("Portfolio generated!", "success");
      onGenerated(data.data, selected);
    } catch (e) {
      const msg = e.response?.data?.error || "Failed to generate. Check your API key.";
      setError(msg); show(msg, "error");
    } finally { setLoading(false); }
  };

  const handleATS = async () => {
    if (!file) { setError("Please select a PDF resume."); show("No file selected.", "error"); return; }
    setLoadingATS(true); setError("");
    show("Running ATS analysis…", "info");
    try {
      const { data } = await axios.post("/api/ats", buildForm());
      show("ATS analysis complete!", "success");
      onATS(data.data, jobRole);
    } catch (e) {
      const msg = e.response?.data?.error || "ATS analysis failed.";
      setError(msg); show(msg, "error");
    } finally { setLoadingATS(false); }
  };

  const handleTailor = async () => {
    if (!file) { setError("Please select a PDF resume."); show("No file selected.", "error"); return; }
    if (!jobDescription.trim()) { setError("Paste a job description to tailor your resume."); show("Job description required.", "error"); return; }
    setLoadingTailor(true); setError("");
    show("Tailoring your resume…", "info");
    try {
      const { data } = await axios.post("/api/tailor", buildForm());
      show("Resume tailored!", "success");
      onTailor(data.data, jobRole);
    } catch (e) {
      const msg = e.response?.data?.error || "Tailoring failed.";
      setError(msg); show(msg, "error");
    } finally { setLoadingTailor(false); }
  };

  const handleJDAnalyze = async () => {
    if (!file) { setError("Please select a PDF resume."); show("No file selected.", "error"); return; }
    if (!jobDescription.trim()) { setError("Paste a job description to analyse."); show("Job description required.", "error"); return; }
    setLoadingJD(true); setError("");
    show("Analysing job description…", "info");
    try {
      const { data } = await axios.post("/api/analyze-jd", buildForm());
      show("JD analysis complete!", "success");
      onJDAnalyze(data.data, jobRole);
    } catch (e) {
      const msg = e.response?.data?.error || "JD analysis failed.";
      setError(msg); show(msg, "error");
    } finally { setLoadingJD(false); }
  };

  if (loading || loadingATS || loadingTailor || loadingJD) {
    return (
      <div className={styles.page}>
        <div className={styles.hero}><h1 className={styles.logo}>⚡ Portfoklio</h1></div>
        <Skeleton />
        <Toast toasts={toasts} />
      </div>
    );
  }

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
          {file ? <p className={styles.fileName}>📄 {file.name}</p> : (
            <><p className={styles.dropIcon}>📂</p><p>Drag & drop your resume PDF here</p><p className={styles.sub}>or click to browse</p></>
          )}
        </div>

        {/* Job targeting */}
        <div className={styles.jobSection}>
          <p className={styles.templateLabel}>Target Job Role <span className={styles.optional}>(optional — improves results)</span></p>
          <input
            className={styles.jobInput}
            type="text"
            placeholder="e.g. AI/ML Engineer, Frontend Developer, Data Scientist"
            value={jobRole}
            maxLength={100}
            onChange={(e) => {
              const val = e.target.value;
              // If user pastes something long (>100 chars), move it to the JD textarea
              if (val.length > 100) {
                setJobDescription(val);
                setJobRole("");
                setShowJD(true);
                show("Moved to job description field.", "info");
              } else {
                setJobRole(val);
              }
            }}
          />
          <button className={styles.toggleJD} onClick={() => setShowJD(!showJD)}>
            {showJD ? "▲ Hide" : "▼ Paste"} job description
          </button>
          {showJD && (
            <textarea
              className={styles.jdTextarea}
              placeholder="Paste the full job description here for best ATS matching…"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={5}
            />
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
                <div className={styles.cardPreview} style={{ background: `linear-gradient(135deg, ${colors[0]} 0%, ${colors[1]} 100%)` }}>
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

        <button className={styles.generateBtn} onClick={handleSubmit} disabled={loading || loadingATS || loadingTailor || loadingJD}>
          ✨ Generate Portfolio
        </button>
        <button className={styles.atsBtn} onClick={handleATS} disabled={loading || loadingATS || loadingTailor || loadingJD}>
          🎯 Check ATS Score
        </button>
        <button className={styles.tailorBtn} onClick={handleTailor} disabled={loading || loadingATS || loadingTailor || loadingJD}>
          ✂️ Tailor Resume
        </button>
        <button className={styles.jdBtn} onClick={handleJDAnalyze} disabled={loading || loadingATS || loadingTailor || loadingJD}>
          🔍 Analyze Job Description
        </button>
      </div>

      <p className={styles.powered}>Powered by LLaMA-4 Maverick via OpenRouter</p>
      <Toast toasts={toasts} />
    </div>
  );
}
