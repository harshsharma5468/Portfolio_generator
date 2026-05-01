import styles from "./MinimalTemplate.module.css";

const gh = (u) => u?.startsWith("http") ? u : `https://github.com/${u}`;
const li = (u) => u?.startsWith("http") ? u : `https://linkedin.com/in/${u}`;

export default function MinimalTemplate({ data }) {
  const { name, title, summary, email, github, linkedin, skills = [], projects = [], experience = [], education = [] } = data;
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <h1>{name}</h1>
            <p className={styles.title}>{title}</p>
          </div>
          <div className={styles.links}>
            {email && <a href={`mailto:${email}`}>{email}</a>}
            {github && <a href={gh(github)} target="_blank" rel="noreferrer">GitHub</a>}
            {linkedin && <a href={li(linkedin)} target="_blank" rel="noreferrer">LinkedIn</a>}
          </div>
        </header>

        {summary && <p className={styles.summary}>{summary}</p>}

        {skills.length > 0 && (
          <section className={styles.section}>
            <h2>Skills</h2>
            <p className={styles.skillsLine}>{skills.join(" · ")}</p>
          </section>
        )}

        {projects.length > 0 && (
          <section className={styles.section}>
            <h2>Projects</h2>
            {projects.map((p, i) => (
              <div key={i} className={styles.item}>
                <div className={styles.itemHeader}>
                  <strong>{p.name}</strong>
                  <span className={styles.meta}>
                    {p.github && <a href={p.github} target="_blank" rel="noreferrer">GitHub</a>}
                    {p.live && <a href={p.live} target="_blank" rel="noreferrer">Live</a>}
                  </span>
                </div>
                <p>{p.description}</p>
                {p.tech?.length > 0 && <p className={styles.techLine}>{p.tech.join(", ")}</p>}
              </div>
            ))}
          </section>
        )}

        {experience.length > 0 && (
          <section className={styles.section}>
            <h2>Experience</h2>
            {experience.map((e, i) => (
              <div key={i} className={styles.item}>
                <div className={styles.itemHeader}>
                  <strong>{e.role}</strong> — {e.company}
                  <span className={styles.meta}>{e.duration}</span>
                </div>
                <ul>{(e.points || []).map((pt, j) => <li key={j}>{pt}</li>)}</ul>
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className={styles.section}>
            <h2>Education</h2>
            {education.map((e, i) => (
              <div key={i} className={styles.item}>
                <div className={styles.itemHeader}>
                  <strong>{e.degree}</strong>
                  <span className={styles.meta}>{e.institution} · {e.year}</span>
                </div>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
