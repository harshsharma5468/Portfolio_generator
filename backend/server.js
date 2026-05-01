require("dotenv").config();
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdfParse = require("pdf-parse");
const axios = require("axios");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

async function extractTextFromPDF(buffer) {
  const data = await pdfParse(buffer);
  return data.text;
}

async function generatePortfolioData(resumeText) {
  const prompt = `You are an expert at parsing resumes. Extract structured portfolio data from the following resume text and return ONLY valid JSON with this exact structure:
{
  "name": "Full Name",
  "title": "Professional Title",
  "summary": "2-3 sentence professional summary",
  "email": "email@example.com",
  "github": "github_username_or_url",
  "linkedin": "linkedin_url",
  "skills": ["skill1", "skill2"],
  "projects": [
    {
      "name": "Project Name",
      "description": "What it does and tech used",
      "tech": ["tech1", "tech2"],
      "github": "repo_url_or_empty",
      "live": "live_url_or_empty"
    }
  ],
  "experience": [
    {
      "company": "Company Name",
      "role": "Job Title",
      "duration": "Jan 2022 - Present",
      "points": ["achievement 1", "achievement 2"]
    }
  ],
  "education": [
    {
      "institution": "University Name",
      "degree": "Degree and Field",
      "year": "2020"
    }
  ]
}

Resume text:
${resumeText}`;

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
        "HTTP-Referer": "http://localhost:3000",
        "X-Title": "Portfoklio",
      },
    }
  );

  const content = response.data.choices[0].message.content;
  return JSON.parse(content);
}

app.post("/api/generate", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No PDF file uploaded" });

    const resumeText = await extractTextFromPDF(req.file.buffer);
    if (!resumeText.trim()) return res.status(400).json({ error: "Could not extract text from PDF" });

    const portfolioData = await generatePortfolioData(resumeText);
    res.json({ success: true, data: portfolioData });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: err.message || "Failed to generate portfolio" });
  }
});

app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
