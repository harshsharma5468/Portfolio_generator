import styles from "./CreativeTemplate.module.css";

export default function CreativeTemplate({ data }) {
  const { name, title, summary, email, github, linkedin, skills = [], projects = [], experience = [], education = [] } = data;

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <p className={styles.hey}>👋 Hey, I'm</p>
        <h1>{name}</h1>
        <p className={styles.title}>{title}</p>
        {summary && <p className={styles.summary}>{summary}</p>}
        <div className={styles.links}>
          {email && <a href={`mailto:${email}`}>{email}</a>}
          {github && <a href={github.startsWith("http") ? github : `https://github.com/${github}`} target="_blank" rel="noreferrer">GitHub</a>}
          {linkedin && <a href={linkedin.startsWith("http") ? linkedin : `https://linkedin.com/in/${linkedin}`} target="_blank" rel="noreferrer">LinkedIn</a>}
        </div>
      </header>

      <main className={styles.main}>
        {skills.length > 0 && (
          <section className={styles.section}>
            <h2><span>⚡</span> Skills</h2>
            <div className={styles.skills}>
              {skills.map((s, i) => <span key={i} className={styles.skill} style={{ animationDelay: `${i * 0.05}s` }}>{s}</span>)}
            </div>
          </section>
        )}

        {projects.length > 0 && (
          <section className={styles.section}>
            <h2><span>🚀</span> Projects</h2>
            <div className={styles.grid}>
              {projects.map((p, i) => (
                <div key={i} className={styles.card}>
                  <div className={styles.cardNum}>0{i + 1}</div>
                  <h3>{p.name}</h3>
                  <p>{p.description}</p>
                  <div className={styles.techRow}>
                    {(p.tech || []).map((t, j) => <span key={j} className={styles.tech}>{t}</span>)}
                  </div>
                  <div className={styles.cardLinks}>
                    {p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub ↗</a>}
                    {p.live && <a href={p.live} target="_blank" rel="noreferrer">Live ↗</a>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {experience.length > 0 && (
          <section className={styles.section}>
            <h2><span>💼</span> Experience</h2>
            {experience.map((e, i) => (
              <div key={i} className={styles.expItem}>
                <div className={styles.expDot} />
                <div>
                  <div className={styles.expHeader}>
                    <strong>{e.role}</strong>
                    <span>@ {e.company}</span>
                    <span className={styles.duration}>{e.duration}</span>
                  </div>
                  <ul>{(e.points || []).map((pt, j) => <li key={j}>{pt}</li>)}</ul>
                </div>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className={styles.section}>
            <h2><span>🎓</span> Education</h2>
            {education.map((e, i) => (
              <div key={i} className={styles.eduItem}>
                <strong>{e.degree}</strong>
                <span>{e.institution} · {e.year}</span>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
