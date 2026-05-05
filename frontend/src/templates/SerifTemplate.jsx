import styles from "./SerifTemplate.module.css";

const gh = (u) => u?.startsWith("http") ? u : `https://github.com/${u}`;
const li = (u) => u?.startsWith("http") ? u : `https://linkedin.com/in/${u}`;

export default function SerifTemplate({ data }) {
  const { name, title, summary, email, github, linkedin, skills = [], projects = [], experience = [], education = [] } = data;
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.title}>{title}</p>
          <div className={styles.contact}>
            {email && <span>{email}</span>}
            {github && <a href={gh(github)} target="_blank" rel="noreferrer">github.com/{github}</a>}
            {linkedin && <a href={li(linkedin)} target="_blank" rel="noreferrer">linkedin.com/in/{linkedin}</a>}
          </div>
        </div>
      </header>

      <div className={styles.container}>
        <div className={styles.leftCol}>
          {experience.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Experience</h2>
              {experience.map((e, i) => (
                <div key={i} className={styles.entry}>
                  <div className={styles.entryHeader}>
                    <h3 className={styles.role}>{e.role}</h3>
                    <span className={styles.period}>{e.duration}</span>
                  </div>
                  <p className={styles.company}>{e.company}</p>
                  <ul className={styles.list}>
                    {(e.points || []).slice(0, 3).map((pt, j) => (
                      <li key={j}>{pt}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>
          )}

          {projects.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Projects</h2>
              {projects.slice(0, 2).map((p, i) => (
                <div key={i} className={styles.entry}>
                  <h3 className={styles.role}>{p.name}</h3>
                  <p className={styles.description}>{p.description}</p>
                  {p.tech && (
                    <p className={styles.tech}>
                      <strong>Tech:</strong> {p.tech.join(", ")}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}
        </div>

        <div className={styles.rightCol}>
          {summary && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Summary</h2>
              <p className={styles.summary}>{summary}</p>
            </section>
          )}

          {education.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              {education.map((e, i) => (
                <div key={i} className={styles.entry}>
                  <h3 className={styles.degree}>{e.degree}</h3>
                  <p className={styles.school}>{e.institution}</p>
                  <span className={styles.year}>{e.year}</span>
                </div>
              ))}
            </section>
          )}

          {skills.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              <div className={styles.skillsContainer}>
                {skills.map((s, i) => (
                  <span key={i} className={styles.skillItem}>{s}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
