import styles from "./CorporateTemplate.module.css";

const gh = (u) => u?.startsWith("http") ? u : `https://github.com/${u}`;
const li = (u) => u?.startsWith("http") ? u : `https://linkedin.com/in/${u}`;

export default function CorporateTemplate({ data }) {
  const { name, title, summary, email, github, linkedin, skills = [], projects = [], experience = [], education = [] } = data;
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.nameBlock}>
          <h1>{name}</h1>
          <p className={styles.title}>{title}</p>
        </div>
        <div className={styles.contact}>
          {email && <span>✉ {email}</span>}
          {github && <a href={gh(github)} target="_blank" rel="noreferrer">⌥ GitHub</a>}
          {linkedin && <a href={li(linkedin)} target="_blank" rel="noreferrer">in LinkedIn</a>}
        </div>
      </header>

      <div className={styles.body}>
        {summary && (
          <section className={styles.section}>
            <h2>Professional Summary</h2>
            <p className={styles.summary}>{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className={styles.section}>
            <h2>Professional Experience</h2>
            {experience.map((e, i) => (
              <div key={i} className={styles.expItem}>
                <div className={styles.expHeader}>
                  <div>
                    <strong>{e.role}</strong>
                    <span className={styles.company}>{e.company}</span>
                  </div>
                  <span className={styles.duration}>{e.duration}</span>
                </div>
                <ul>{(e.points || []).map((pt, j) => <li key={j}>{pt}</li>)}</ul>
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section className={styles.section}>
            <h2>Key Projects</h2>
            {projects.map((p, i) => (
              <div key={i} className={styles.projectItem}>
                <div className={styles.projectHeader}>
                  <strong>{p.name}</strong>
                  <span className={styles.techInline}>{(p.tech || []).join(", ")}</span>
                </div>
                <p>{p.description}</p>
                <div className={styles.projectLinks}>
                  {p.github && <a href={p.github} target="_blank" rel="noreferrer">Repository</a>}
                  {p.live && <a href={p.live} target="_blank" rel="noreferrer">Live Demo</a>}
                </div>
              </div>
            ))}
          </section>
        )}

        <div className={styles.twoCol}>
          {skills.length > 0 && (
            <section className={styles.section}>
              <h2>Technical Skills</h2>
              <div className={styles.skills}>
                {skills.map((s, i) => <span key={i} className={styles.skill}>{s}</span>)}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className={styles.section}>
              <h2>Education</h2>
              {education.map((e, i) => (
                <div key={i} className={styles.eduItem}>
                  <strong>{e.degree}</strong>
                  <span>{e.institution}</span>
                  <span className={styles.year}>{e.year}</span>
                </div>
              ))}
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
