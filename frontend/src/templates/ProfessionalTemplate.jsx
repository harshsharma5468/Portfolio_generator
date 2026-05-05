import styles from "./ProfessionalTemplate.module.css";

const gh = (u) => u?.startsWith("http") ? u : `https://github.com/${u}`;
const li = (u) => u?.startsWith("http") ? u : `https://linkedin.com/in/${u}`;

export default function ProfessionalTemplate({ data }) {
  const { name, title, summary, email, github, linkedin, skills = [], projects = [], experience = [], education = [] } = data;
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.titleBlock}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.tagline}>{title}</p>
        </div>
        <div className={styles.contactBar}>
          {email && <span className={styles.contact}>{email}</span>}
          {github && <a href={gh(github)} target="_blank" rel="noreferrer" className={styles.contact}>GitHub</a>}
          {linkedin && <a href={li(linkedin)} target="_blank" rel="noreferrer" className={styles.contact}>LinkedIn</a>}
        </div>
      </header>

      {summary && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>About</h2>
          <p className={styles.summaryText}>{summary}</p>
        </section>
      )}

      <div className={styles.grid}>
        <div className={styles.left}>
          {experience.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Experience</h2>
              {experience.map((e, i) => (
                <div key={i} className={styles.item}>
                  <div className={styles.itemHeader}>
                    <h3>{e.role}</h3>
                    <span className={styles.date}>{e.duration}</span>
                  </div>
                  <p className={styles.company}>{e.company}</p>
                  <ul className={styles.bullets}>
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
                <div key={i} className={styles.item}>
                  <h3>{p.name}</h3>
                  <p className={styles.projectDesc}>{p.description}</p>
                  <div className={styles.tags}>
                    {(p.tech || []).slice(0, 4).map((t, j) => (
                      <span key={j} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          )}
        </div>

        <div className={styles.right}>
          {skills.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Skills</h2>
              <div className={styles.skillsGrid}>
                {skills.slice(0, 12).map((s, i) => (
                  <span key={i} className={styles.skillBadge}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>Education</h2>
              {education.map((e, i) => (
                <div key={i} className={styles.item}>
                  <h3>{e.degree}</h3>
                  <p className={styles.institution}>{e.institution}</p>
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
