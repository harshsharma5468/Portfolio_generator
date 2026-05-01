import { useEffect, useRef } from "react";
import styles from "./CreativeTemplate.module.css";

const gh = (u) => u?.startsWith("http") ? u : `https://github.com/${u}`;
const li = (u) => u?.startsWith("http") ? u : `https://linkedin.com/in/${u}`;

function FadeIn({ children, delay = 0 }) {
  const ref = useRef();
  useEffect(() => {
    const el = ref.current;
    el.style.opacity = 0;
    el.style.transform = "translateY(24px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      el.style.opacity = 1;
      el.style.transform = "translateY(0)";
    }, delay);
    return () => clearTimeout(t);
  }, [delay]);
  return <div ref={ref}>{children}</div>;
}

export default function CreativeTemplate({ data }) {
  const { name, title, summary, email, github, linkedin, skills = [], projects = [], experience = [], education = [] } = data;
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <FadeIn delay={0}>
          <p className={styles.hey}>Hey, I'm</p>
          <h1>{name}</h1>
          <p className={styles.title}>{title}</p>
        </FadeIn>
        <FadeIn delay={200}>
          <p className={styles.summary}>{summary}</p>
          <div className={styles.links}>
            {email && <a href={`mailto:${email}`}>{email}</a>}
            {github && <a href={gh(github)} target="_blank" rel="noreferrer">GitHub ↗</a>}
            {linkedin && <a href={li(linkedin)} target="_blank" rel="noreferrer">LinkedIn ↗</a>}
          </div>
        </FadeIn>
      </header>

      <main className={styles.main}>
        {skills.length > 0 && (
          <FadeIn delay={300}>
            <section className={styles.section}>
              <h2><span>🛠</span> What I Work With</h2>
              <div className={styles.skills}>
                {skills.map((s, i) => <span key={i} className={styles.skill} style={{ animationDelay: `${i * 40}ms` }}>{s}</span>)}
              </div>
            </section>
          </FadeIn>
        )}

        {projects.length > 0 && (
          <FadeIn delay={400}>
            <section className={styles.section}>
              <h2><span>🚀</span> Things I've Built</h2>
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
          </FadeIn>
        )}

        {experience.length > 0 && (
          <FadeIn delay={500}>
            <section className={styles.section}>
              <h2><span>💼</span> Where I've Worked</h2>
              {experience.map((e, i) => (
                <div key={i} className={styles.expItem}>
                  <div className={styles.expDot} />
                  <div>
                    <div className={styles.expHeader}>
                      <strong>{e.role}</strong> <span>@ {e.company}</span>
                      <span className={styles.duration}>{e.duration}</span>
                    </div>
                    <ul>{(e.points || []).map((pt, j) => <li key={j}>{pt}</li>)}</ul>
                  </div>
                </div>
              ))}
            </section>
          </FadeIn>
        )}

        {education.length > 0 && (
          <FadeIn delay={600}>
            <section className={styles.section}>
              <h2><span>🎓</span> Education</h2>
              {education.map((e, i) => (
                <div key={i} className={styles.eduItem}>
                  <strong>{e.degree}</strong>
                  <span>{e.institution} · {e.year}</span>
                </div>
              ))}
            </section>
          </FadeIn>
        )}
      </main>
    </div>
  );
}
