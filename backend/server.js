require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");

const app = express();

app.use(cors({ origin: process.env.ALLOWED_ORIGIN || "http://localhost:3000" }));
app.use(express.json({ limit: "1mb" }));

// ── Rate limiter ─────────────────────────────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function rateLimit(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress;
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, start: now };
  if (now - entry.start > RATE_WINDOW_MS) { entry.count = 0; entry.start = now; }
  entry.count += 1;
  rateLimitMap.set(ip, entry);
  if (entry.count > RATE_LIMIT) return res.status(429).json({ error: "Too many requests. Please wait 15 minutes." });
  next();
}

// ── File upload ──────────────────────────────────────────────────────────────
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter(_, file, cb) {
    if (file.mimetype !== "application/pdf") return cb(new Error("Only PDF files are accepted."));
    cb(null, true);
  },
});

// ── Helpers ──────────────────────────────────────────────────────────────────
const sanitize = (text) => text.replace(/\0/g, "").slice(0, 15000);

async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

async function callAI(prompt) {
  const response = await axios.post(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      model: "meta-llama/llama-4-maverick",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.ALLOWED_ORIGIN || "http://localhost:3000",
        "X-Title": "Portfoklio",
      },
      timeout: 60000,
    }
  );
  const content = response.data.choices[0].message.content;
  try { return JSON.parse(content); } catch { throw new Error("AI returned invalid JSON. Please try again."); }
}

// ── Portfolio generation (with optional job targeting) ───────────────────────
async function generatePortfolioData(resumeText, jobRole, jobDescription) {
  const safeText = sanitize(resumeText);
  const jobContext = jobRole
    ? `\n\nTarget Job Role: ${jobRole}${jobDescription ? `\nJob Description:\n${sanitize(jobDescription)}` : ""}\n\nIMPORTANT: Tailor the summary, highlight relevant skills first, and emphasise experience/projects most relevant to this role.`
    : "";

  const prompt = `You are an expert resume parser and career coach. Extract structured portfolio data from the resume below and return ONLY valid JSON with this exact structure:
{
  "name": "Full Name",
  "title": "Professional Title",
  "summary": "2-3 sentence professional summary",
  "email": "email@example.com",
  "github": "github_username_or_url",
  "linkedin": "linkedin_url",
  "skills": ["skill1", "skill2"],
  "projects": [{"name":"","description":"","tech":[],"github":"","live":""}],
  "experience": [{"company":"","role":"","duration":"","points":[]}],
  "education": [{"institution":"","degree":"","year":""}]
}
${jobContext}

Resume:
${safeText}`;

  const parsed = await callAI(prompt);
  if (!parsed.name || typeof parsed.name !== "string") {
    throw new Error("Could not extract name from resume. Ensure the PDF contains readable text.");
  }
  return parsed;
}

// ── ATS analysis ─────────────────────────────────────────────────────────────
async function analyseATS(resumeText, jobRole, jobDescription) {
  const safeText = sanitize(resumeText);
  const jobCtx = jobRole
    ? `Target Role: ${jobRole}${jobDescription ? `\nJob Description:\n${sanitize(jobDescription)}` : ""}`
    : "No specific role provided — analyse for general ATS compatibility.";

  const prompt = `You are an expert ATS (Applicant Tracking System) analyst and career coach. Analyse the resume below against the target role and return ONLY valid JSON:
{
  "score": 78,
  "grade": "B+",
  "summary": "One sentence overall verdict",
  "strengths": ["strength 1", "strength 2"],
  "issues": [
    {"severity": "high", "title": "Issue title", "detail": "Explanation and fix"}
  ],
  "missingKeywords": ["keyword1", "keyword2"],
  "suggestions": ["Actionable suggestion 1", "Actionable suggestion 2"],
  "sections": {
    "formatting": {"score": 80, "comment": "..."},
    "keywords": {"score": 60, "comment": "..."},
    "experience": {"score": 75, "comment": "..."},
    "skills": {"score": 85, "comment": "..."},
    "education": {"score": 90, "comment": "..."}
  }
}

Rules:
- score is 0-100 integer
- grade is A+/A/B+/B/C+/C/D
- severity is "high", "medium", or "low"
- missingKeywords are keywords from the job description NOT found in the resume
- Be specific and actionable, not generic

${jobCtx}

Resume:
${safeText}`;

  const parsed = await callAI(prompt);
  if (typeof parsed.score !== "number") throw new Error("ATS analysis failed. Please try again.");
  return parsed;
}

// ── Routes ───────────────────────────────────────────────────────────────────
app.post("/api/generate", rateLimit, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });
    if (!process.env.OPENROUTER_API_KEY) return res.status(500).json({ error: "Server is missing API key configuration." });

    const resumeText = await extractTextFromPDF(req.file.buffer);
    if (!resumeText.trim()) return res.status(422).json({ error: "Could not extract text from PDF. Ensure it is not a scanned image." });
    if (resumeText.trim().length < 100) return res.status(422).json({ error: "PDF has too little text. Please upload a proper resume." });

    const { jobRole = "", jobDescription = "" } = req.body;
    const portfolioData = await generatePortfolioData(resumeText, jobRole.trim(), jobDescription.trim());
    res.json({ success: true, data: portfolioData });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || err.message || "Failed to generate portfolio.";
    console.error(`[${new Date().toISOString()}] /api/generate error:`, message);
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
  }
});

app.post("/api/ats", rateLimit, upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded." });
    if (!process.env.OPENROUTER_API_KEY) return res.status(500).json({ error: "Server is missing API key configuration." });

    const resumeText = await extractTextFromPDF(req.file.buffer);
    if (!resumeText.trim()) return res.status(422).json({ error: "Could not extract text from PDF." });

    const { jobRole = "", jobDescription = "" } = req.body;
    const atsData = await analyseATS(resumeText, jobRole.trim(), jobDescription.trim());
    res.json({ success: true, data: atsData });
  } catch (err) {
    const status = err.response?.status || 500;
    const message = err.response?.data?.error?.message || err.message || "ATS analysis failed.";
    console.error(`[${new Date().toISOString()}] /api/ats error:`, message);
    res.status(status >= 400 && status < 600 ? status : 500).json({ error: message });
  }
});

app.get("/health", (_, res) => res.json({ status: "ok", timestamp: new Date().toISOString() }));

app.use((err, req, res, _next) => {
  if (err instanceof multer.MulterError || err.message === "Only PDF files are accepted.") {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(500).json({ error: "Internal server error." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
