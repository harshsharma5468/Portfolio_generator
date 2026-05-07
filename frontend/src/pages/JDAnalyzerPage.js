import styles from "./JDAnalyzerPage.module.css";

const DIFF_COLOR = { easy: "#15803d", medium: "#b45309", hard: "#dc2626" };
const DIFF_BG   = { easy: "#f0fdf4", medium: "#fffbeb", hard: "#fef2f2" };

function FitRing({ score }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 75 ? "#16a34a" : score >= 50 ? "#d97706" : "#dc2626";
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" aria-label={`Fit score ${score}`}>
      <circle cx="55" cy="55" r={r} fill="none" stroke="#e2e8f0" strokeWidth="10" />
      <circle
        cx="55" cy="55" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 55 55)"
      />
      <text x="55" y="52" textAnchor="middle" fontSize="20" fontWeight="800" fill={color}>{score}</text>
      <text x="55" y="68" textAnchor="middle" fontSize="10" fill="#94a3b8">/ 100</text>
    </svg>
  );
}

export default function JDAnalyzerPage({ data, jobRole, onBack }) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} onClick={onBack}>← Back</button>
        <h1 className={styles.title}>🔍 JD Analyzer</h1>
        {jobRole && <p className={styles.role}>Role: <strong>{jobRole}</strong></p>}
      </div>

      <div className={styles.grid}>
        {/* Fit score */}
        <div className={`${styles.card} ${styles.fitCard}`}>
          <FitRing score={data.fitScore ?? 0} />
          <div>
            <p className={styles.fitLabel}>Candidate Fit</p>
            <p className={styles.fitSummary}>{data.fitSummary}</p>
          </div>
        </div>

        {/* Must-have skills */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>✅ Must-Have Skills</h2>
          <div className={styles.pills}>
            {(data.mustHaveSkills || []).map((s, i) => (
              <span key={i} className={`${styles.pill} ${data.candidateHas?.includes(s) ? styles.pillHave : styles.pillMiss}`}>
                {data.candidateHas?.includes(s) ? "✓ " : "✗ "}{s}
              </span>
            ))}
          </div>
        </div>

        {/* Nice-to-have */}
        {data.niceToHaveSkills?.length > 0 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>💡 Nice-to-Have</h2>
            <div className={styles.pills}>
              {data.niceToHaveSkills.map((s, i) => (
                <span key={i} className={`${styles.pill} ${styles.pillNice}`}>{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Gaps */}
        {data.gaps?.length > 0 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>⚠️ Gaps to Address</h2>
            <ul className={styles.list}>
              {data.gaps.map((g, i) => <li key={i}>{g}</li>)}
            </ul>
          </div>
        )}

        {/* Quick wins */}
        {data.quickWins?.length > 0 && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>⚡ Quick Wins This Week</h2>
            <ol className={styles.list}>
              {data.quickWins.map((w, i) => <li key={i}>{w}</li>)}
            </ol>
          </div>
        )}

        {/* Project ideas */}
        {data.projectIdeas?.length > 0 && (
          <div className={`${styles.card} ${styles.fullWidth}`}>
            <h2 className={styles.cardTitle}>🚀 Project Ideas to Fill Gaps</h2>
            <div className={styles.projectGrid}>
              {data.projectIdeas.map((p, i) => (
                <div key={i} className={styles.projectCard}>
                  <div className={styles.projectTop}>
                    <strong>{p.title}</strong>
                    <span
                      className={styles.diff}
                      style={{ color: DIFF_COLOR[p.difficulty] || "#555", background: DIFF_BG[p.difficulty] || "#f5f5f5" }}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                  <p className={styles.projectDesc}>{p.description}</p>
                  {p.skills?.length > 0 && (
                    <div className={styles.pills} style={{ marginTop: 8 }}>
                      {p.skills.map((s, j) => <span key={j} className={`${styles.pill} ${styles.pillNice}`}>{s}</span>)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
