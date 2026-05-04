import styles from "./ModernTemplate.module.css";

export default function ModernTemplate({ data }) {
  const { name, title, summary, email, github, linkedin, skills = [], projects = [], experience = [], education = [] } = data;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <h1>{name}</h1>
          <p className={styles.title}>{title}</p>
        </div>
        <div className={styles.links}>
          {email && <a href={`mailto:${email}`}>{email}</a>}
          {github && <a href={github.startsWith("http") ? github : `https://github.com/${github}`} target="_blank" rel="noreferrer">GitHub</a>}
          {linkedin && <a href={linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>}
        </div>
      </header>

      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {skills.length > 0 && (
            <div>
              <h2>Skills</h2>
              <div className={styles.skills}>
                {skills.map((s, i) => <span key={i} className={styles.skill}>{s}</span>)}
              </div>
            </div>
          )}
          {education.length > 0 && (
            <div>
              <h2>Education</h2>
              {education.map((e, i) => (
                <div key={i} className={styles.eduItem}>
                  <strong>{e.degree}</strong>
                  <span>{e.institution}</span>
                  <span className={styles.year}>{e.year}</span>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Main */}
        <main className={styles.main}>
          {summary && <p className={styles.summary}>{summary}</p>}

          {projects.length > 0 && (
            <section>
              <h2>Projects</h2>
              <div className={styles.grid}>
                {projects.map((p, i) => (
                  <div key={i} className={styles.card}>
                    <div className={styles.cardTop}>
                      <h3>{p.name}</h3>
                      <div className={styles.cardLinks}>
                        {p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                        {p.live && <a href={p.live} target="_blank" rel="noreferrer">Live ↗</a>}
                      </div>
                    </div>
                    <p>{p.description}</p>
                    <div className={styles.techRow}>
                      {(p.tech || []).map((t, j) => <span key={j} className={styles.tech}>{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {experience.length > 0 && (
            <section>
              <h2>Experience</h2>
              {experience.map((e, i) => (
                <div key={i} className={styles.expItem}>
                  <div className={styles.expHeader}>
                    <strong>{e.role}</strong>
                    <span>@ {e.company}</span>
                    <span className={styles.duration}>{e.duration}</span>
                  </div>
                  <ul>{(e.points || []).map((pt, j) => <li key={j}>{pt}</li>)}</ul>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
