import styles from "./CoralTemplate.module.css";

const gh = (u) => u?.startsWith("http") ? u : `https://github.com/${u}`;
const li = (u) => u?.startsWith("http") ? u : `https://linkedin.com/in/${u}`;

export default function CoralTemplate({ data }) {
  const { name, title, summary, email, github, linkedin, skills = [], projects = [], experience = [], education = [] } = data;
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={styles.nameSection}>
          <h1 className={styles.name}>{name}</h1>
          <p className={styles.title}>{title}</p>
        </div>
        <div className={styles.contactSection}>
          {email && <span className={styles.contact}>{email}</span>}
          {github && <a href={gh(github)} target="_blank" rel="noreferrer" className={styles.contact}>GitHub</a>}
          {linkedin && <a href={li(linkedin)} target="_blank" rel="noreferrer" className={styles.contact}>LinkedIn</a>}
        </div>
      </header>

      <div className={styles.body}>
        {summary && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleText}>Professional Summary</span>
            </h2>
            <p className={styles.summaryText}>{summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleText}>Experience</span>
            </h2>
            {experience.map((e, i) => (
              <div key={i} className={styles.entry}>
                <div className={styles.entryHeader}>
                  <h3 className={styles.entryTitle}>{e.role}</h3>
                  <span className={styles.date}>{e.duration}</span>
                </div>
                <p className={styles.company}>{e.company}</p>
                <ul className={styles.bullets}>
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
            <h2 className={styles.sectionTitle}>
              <span className={styles.titleText}>Projects</span>
            </h2>
            {projects.map((p, i) => (
              <div key={i} className={styles.entry}>
                <div className={styles.projectHeader}>
                  <h3 className={styles.projectTitle}>{p.name}</h3>
                  {p.tech && <span className={styles.tech}>{p.tech.slice(0, 2).join(", ")}</span>}
                </div>
                <p className={styles.projectDesc}>{p.description}</p>
              </div>
            ))}
          </section>
        )}

        <div className={styles.twoCol}>
          {skills.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleText}>Skills</span>
              </h2>
              <div className={styles.skillsList}>
                {skills.map((s, i) => (
                  <span key={i} className={styles.skill}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {education.length > 0 && (
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>
                <span className={styles.titleText}>Education</span>
              </h2>
              {education.map((e, i) => (
                <div key={i} className={styles.entry}>
                  <h3 className={styles.eduTitle}>{e.degree}</h3>
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
