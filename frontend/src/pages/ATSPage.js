import styles from "./ATSPage.module.css";

const GRADE_COLOR = { "A+": "#16a34a", A: "#22c55e", "B+": "#84cc16", B: "#eab308", "C+": "#f97316", C: "#ef4444", D: "#dc2626" };
const SEV_COLOR = { high: "#ef4444", medium: "#f97316", low: "#eab308" };

function ScoreRing({ score }) {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#1f2937" strokeWidth="12" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke={color} strokeWidth="12"
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 70 70)"
        style={{ transition: "stroke-dasharray 1s ease" }}
      />
      <text x="70" y="65" textAnchor="middle" fill={color} fontSize="28" fontWeight="800">{score}</text>
      <text x="70" y="85" textAnchor="middle" fill="#6b7280" fontSize="12">/100</text>
    </svg>
  );
}

function SectionBar({ label, score }) {
  const color = score >= 80 ? "#22c55e" : score >= 60 ? "#eab308" : "#ef4444";
  return (
    <div className={styles.barRow}>
      <span className={styles.barLabel}>{label}</span>
      <div className={styles.barTrack}>
        <div className={styles.barFill} style={{ width: `${score}%`, background: color }} />
      </div>
      <span className={styles.barScore} style={{ color }}>{score}</span>
    </div>
  );
}

export default function ATSPage({ data, jobRole, onBack }) {
  const { score, grade, summary, strengths = [], issues = [], missingKeywords = [], suggestions = [], sections = {} } = data;

  return (
    <div className={styles.page}>
      <div className={styles.toolbar}>
        <button className={styles.backBtn} onClick={onBack}>← Back</button>
        <h2 className={styles.heading}>ATS Score Report {jobRole && <span className={styles.role}>— {jobRole}</span>}</h2>
      </div>

      <div className={styles.body}>
        {/* Score hero */}
        <div className={styles.scoreCard}>
          <ScoreRing score={score} />
          <div>
            <div className={styles.grade} style={{ color: GRADE_COLOR[grade] || "#e5e7eb" }}>{grade}</div>
            <p className={styles.verdict}>{summary}</p>
          </div>
        </div>

        {/* Section breakdown */}
        {Object.keys(sections).length > 0 && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>📊 Section Breakdown</h3>
            {Object.entries(sections).map(([key, val]) => (
              <div key={key}>
                <SectionBar label={key.charAt(0).toUpperCase() + key.slice(1)} score={val.score} />
                {val.comment && <p className={styles.barComment}>{val.comment}</p>}
              </div>
            ))}
          </div>
        )}

        <div className={styles.twoCol}>
          {/* Strengths */}
          {strengths.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>✅ Strengths</h3>
              <ul className={styles.list}>
                {strengths.map((s, i) => <li key={i} className={styles.strengthItem}>{s}</li>)}
              </ul>
            </div>
          )}

          {/* Missing keywords */}
          {missingKeywords.length > 0 && (
            <div className={styles.card}>
              <h3 className={styles.cardTitle}>🔍 Missing Keywords</h3>
              <div className={styles.keywords}>
                {missingKeywords.map((k, i) => <span key={i} className={styles.keyword}>{k}</span>)}
              </div>
            </div>
          )}
        </div>

        {/* Issues */}
        {issues.length > 0 && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>⚠️ Issues Found</h3>
            <div className={styles.issues}>
              {issues.map((issue, i) => (
                <div key={i} className={styles.issue}>
                  <div className={styles.issueHeader}>
                    <span className={styles.severity} style={{ background: SEV_COLOR[issue.severity] + "22", color: SEV_COLOR[issue.severity] }}>
                      {issue.severity}
                    </span>
                    <strong>{issue.title}</strong>
                  </div>
                  <p className={styles.issueDetail}>{issue.detail}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>💡 Suggestions to Improve</h3>
            <ol className={styles.suggestions}>
              {suggestions.map((s, i) => <li key={i}>{s}</li>)}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}
