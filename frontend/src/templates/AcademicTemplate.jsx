import styles from "./AcademicTemplate.module.css";

const gh = (u) => u?.startsWith("http") ? u : `https://github.com/${u}`;
const li = (u) => u?.startsWith("http") ? u : `https://linkedin.com/in/${u}`;

export default function AcademicTemplate({ data }) {
  const { name, title, summary, email, github, linkedin, skills = [], projects = [], experience = [], education = [] } = data;
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.name}>{name}</h1>
        <p className={styles.title}>{title}</p>
        <div className={styles.contactInfo}>
          {email && <span>{email}</span>}
          {github && <a href={gh(github)} target="_blank" rel="noreferrer">github.com/{github}</a>}
          {linkedin && <a href={li(linkedin)} target="_blank" rel="noreferrer">linkedin.com/in/{linkedin}</a>}
        </div>
      </header>

      {summary && (
        <section className={styles.section}>
          <h2 className={styles.heading}>SUMMARY</h2>
          <p className={styles.text}>{summary}</p>
        </section>
      )}

      {experience.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>PROFESSIONAL EXPERIENCE</h2>
          {experience.map((e, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>{e.role}</h3>
                <span className={styles.period}>{e.duration}</span>
              </div>
              <p className={styles.organization}>{e.company}</p>
              <ul className={styles.list}>
                {(e.points || []).map((pt, j) => (
                  <li key={j}>{pt}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>RESEARCH & PROJECTS</h2>
          {projects.map((p, i) => (
            <div key={i} className={styles.entry}>
              <h3 className={styles.projectTitle}>{p.name}</h3>
              <p className={styles.projectDesc}>{p.description}</p>
              {p.tech && (
                <p className={styles.keywords}>
                  <strong>Technologies:</strong> {p.tech.join(" • ")}
                </p>
              )}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>EDUCATION</h2>
          {education.map((e, i) => (
            <div key={i} className={styles.entry}>
              <div className={styles.entryHeader}>
                <h3 className={styles.entryTitle}>{e.degree}</h3>
                <span className={styles.period}>{e.year}</span>
              </div>
              <p className={styles.organization}>{e.institution}</p>
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.heading}>TECHNICAL COMPETENCIES</h2>
          <div className={styles.skillsList}>
            {skills.map((s, i) => (
              <span key={i} className={styles.skillItem}>{s}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
