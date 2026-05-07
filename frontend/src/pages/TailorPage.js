import styles from "./TailorPage.module.css";

function exportWord(data) {
  const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const expRows = (data.experience || []).map(e => `
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${esc(e.role)} — ${esc(e.company)} (${esc(e.duration)})</w:t></w:r></w:p>
    ${(e.points || []).map(p => `<w:p><w:pPr><w:ind w:left="360"/></w:pPr><w:r><w:t>• ${esc(p)}</w:t></w:r></w:p>`).join("")}
  `).join("");

  const projRows = (data.projects || []).map(p => `
    <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>${esc(p.name)}</w:t></w:r><w:r><w:t xml:space="preserve"> — ${esc(p.description)}</w:t></w:r></w:p>
  `).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
<w:body>
  <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="36"/></w:rPr><w:t>${esc(data.name)}</w:t></w:r></w:p>
  <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:t>${esc(data.title)}</w:t></w:r></w:p>
  <w:p><w:r><w:t xml:space="preserve"> </w:t></w:r></w:p>
  <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Summary</w:t></w:r></w:p>
  <w:p><w:r><w:t>${esc(data.summary)}</w:t></w:r></w:p>
  <w:p><w:r><w:t xml:space="preserve"> </w:t></w:r></w:p>
  <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Skills</w:t></w:r></w:p>
  <w:p><w:r><w:t>${esc((data.skills || []).join(" • "))}</w:t></w:r></w:p>
  <w:p><w:r><w:t xml:space="preserve"> </w:t></w:r></w:p>
  <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Experience</w:t></w:r></w:p>
  ${expRows}
  <w:p><w:r><w:t xml:space="preserve"> </w:t></w:r></w:p>
  <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Projects</w:t></w:r></w:p>
  ${projRows}
  <w:p><w:r><w:t xml:space="preserve"> </w:t></w:r></w:p>
  <w:p><w:r><w:rPr><w:b/></w:rPr><w:t>Education</w:t></w:r></w:p>
  ${(data.education || []).map(e => `<w:p><w:r><w:t>${esc(e.degree)} — ${esc(e.institution)} (${esc(e.year)})</w:t></w:r></w:p>`).join("")}
</w:body>
</w:document>`;

  // Minimal .docx = ZIP with [Content_Types].xml + word/document.xml
  const contentTypes = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const rels = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  // Build ZIP manually using fflate-style raw bytes (no external dep needed — use Blob trick)
  // We'll use the simpler approach: data URI with XML content as RTF fallback isn't great,
  // so we use the MSWord HTML trick which opens correctly in Word.
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word">
<head><meta charset="utf-8"><title>Tailored Resume</title>
<style>
  body { font-family: Calibri, sans-serif; font-size: 11pt; margin: 2cm; }
  h1 { font-size: 18pt; text-align: center; margin-bottom: 2px; }
  .title { text-align: center; color: #555; margin-bottom: 12px; }
  h2 { font-size: 12pt; border-bottom: 1px solid #333; margin-top: 14px; margin-bottom: 4px; }
  .exp-header { font-weight: bold; }
  ul { margin: 2px 0 8px 20px; padding: 0; }
  li { margin-bottom: 2px; }
  .skills { margin-bottom: 8px; }
  .proj { margin-bottom: 6px; }
  .proj strong { display: inline; }
</style>
</head>
<body>
<h1>${esc(data.name)}</h1>
<p class="title">${esc(data.title)}</p>
<h2>Summary</h2>
<p>${esc(data.summary)}</p>
<h2>Skills</h2>
<p class="skills">${esc((data.skills || []).join(" • "))}</p>
<h2>Experience</h2>
${(data.experience || []).map(e => `
  <p class="exp-header">${esc(e.role)} — ${esc(e.company)} <span style="font-weight:normal;color:#555">(${esc(e.duration)})</span></p>
  <ul>${(e.points || []).map(p => `<li>${esc(p)}</li>`).join("")}</ul>
`).join("")}
<h2>Projects</h2>
${(data.projects || []).map(p => `
  <p class="proj"><strong>${esc(p.name)}</strong> — ${esc(p.description)}${p.tech?.length ? ` <em>(${esc(p.tech.join(", "))})</em>` : ""}</p>
`).join("")}
<h2>Education</h2>
${(data.education || []).map(e => `<p>${esc(e.degree)} — ${esc(e.institution)} (${esc(e.year)})</p>`).join("")}
</body></html>`;

  const blob = new Blob([html], { type: "application/msword" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(data.name || "resume").replace(/\s+/g, "_")}_tailored.doc`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function TailorPage({ data, jobRole, onBack }) {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.back} onClick={onBack}>← Back</button>
        <h1 className={styles.title}>✂️ Tailored Resume</h1>
        {jobRole && <p className={styles.role}>Tailored for: <strong>{jobRole}</strong></p>}
        <button className={styles.exportBtn} onClick={() => exportWord(data)}>
          📄 Export Word (.doc)
        </button>
      </div>

      <div className={styles.resume}>
        <div className={styles.nameBlock}>
          <h2>{data.name}</h2>
          <p className={styles.jobTitle}>{data.title}</p>
        </div>

        <section>
          <h3 className={styles.sectionHead}>Summary</h3>
          <p className={styles.summary}>{data.summary}</p>
        </section>

        <section>
          <h3 className={styles.sectionHead}>Skills</h3>
          <div className={styles.skills}>
            {(data.skills || []).map((s, i) => <span key={i} className={styles.skill}>{s}</span>)}
          </div>
        </section>

        <section>
          <h3 className={styles.sectionHead}>Experience</h3>
          {(data.experience || []).map((e, i) => (
            <div key={i} className={styles.expBlock}>
              <p className={styles.expHeader}>
                <strong>{e.role}</strong> — {e.company}
                <span className={styles.duration}> · {e.duration}</span>
              </p>
              <ul>
                {(e.points || []).map((p, j) => <li key={j}>{p}</li>)}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h3 className={styles.sectionHead}>Projects</h3>
          {(data.projects || []).map((p, i) => (
            <div key={i} className={styles.projBlock}>
              <strong>{p.name}</strong>
              {p.tech?.length > 0 && <span className={styles.tech}> · {p.tech.join(", ")}</span>}
              <p>{p.description}</p>
            </div>
          ))}
        </section>

        <section>
          <h3 className={styles.sectionHead}>Education</h3>
          {(data.education || []).map((e, i) => (
            <p key={i}><strong>{e.degree}</strong> — {e.institution} ({e.year})</p>
          ))}
        </section>

        {data.keywords_used?.length > 0 && (
          <section className={styles.keywordsSection}>
            <h3 className={styles.sectionHead}>Keywords Embedded</h3>
            <div className={styles.skills}>
              {data.keywords_used.map((k, i) => <span key={i} className={styles.keyword}>{k}</span>)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
