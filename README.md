# ⚡ Portfoklio – AI Portfolio Generator

> Drop your resume PDF. Get a personalized developer portfolio in under 60 seconds.

Powered by **LLaMA-4 Maverick** via [OpenRouter](https://openrouter.ai). Parses your resume, infers skills, projects, and narrative, and renders a beautiful portfolio with 4 templates.

---

## ✨ Features

- 📄 PDF resume upload with drag & drop
- 🤖 LLaMA-4 Maverick extracts skills, projects, experience, education
- 🎨 4 templates: **Modern**, **Minimal**, **Creative**, **Corporate**
- 🎯 **ATS Score Checker** — analyse your resume against a job role with a detailed score report
- 💼 **Job targeting** — enter a target role and paste a job description to tailor your portfolio and ATS analysis
- 📊 **ATS Score Report** — circular score ring, section breakdown bars, strengths, issues (with severity), missing keywords, and actionable suggestions
- ⬇️ Download portfolio as PDF
- 🔗 Shareable link — share your portfolio with a single URL
- 🔔 Toast notifications for every action
- ⏳ Skeleton loading screen while AI processes your resume
- 🛡️ Rate limiting, input sanitization, and structured error handling
- ⚡ End-to-end in under 60 seconds

---

## 🗂 Project Structure

```
portfoklio/
├── backend/
│   ├── server.js          # Express API with rate limiting, sanitization & ATS endpoint
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.js                    # Shareable link decoder on load + ATS routing
    │   ├── components/
    │   │   ├── Toast.js              # Toast notification system
    │   │   ├── Toast.module.css
    │   │   ├── Skeleton.js           # AI loading skeleton screen
    │   │   └── Skeleton.module.css
    │   ├── pages/
    │   │   ├── UploadPage.js         # Upload + template picker + job targeting
    │   │   ├── UploadPage.module.css
    │   │   ├── PortfolioPage.js      # Preview + share + download
    │   │   ├── PortfolioPage.module.css
    │   │   ├── ATSPage.js            # ATS score report UI
    │   │   └── ATSPage.module.css
    │   └── templates/
    │       ├── index.js              # Template registry
    │       ├── ModernTemplate.js     # Two-column sidebar layout
    │       ├── MinimalTemplate.js    # Whitespace-first typography
    │       ├── CreativeTemplate.js   # Bold dark animated layout
    │       └── CorporateTemplate.js  # Formal resume-style layout
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- An [OpenRouter](https://openrouter.ai) API key (free tier works)

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/portfoklio.git
cd portfoklio
```

### 2. Set up the backend

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your OpenRouter API key:

```
PORT=5000
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxx
ALLOWED_ORIGIN=http://localhost:3000
```

Install dependencies and start:

```bash
npm install
npm run dev
```

Backend runs at `http://localhost:5000`

### 3. Set up the frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

Frontend runs at `http://localhost:3000`

### 4. Use it

1. Open `http://localhost:3000`
2. Upload your resume PDF
3. *(Optional)* Enter a target job role and paste a job description
4. Choose a template
5. Click **Generate Portfolio** — or click **Check ATS Score** for a detailed ATS report
6. Download as PDF or click **Share** to copy a shareable link

---

## 🎯 ATS Score Checker

Click **Check ATS Score** on the upload page to get a full ATS analysis:

| Section | What it shows |
|---------|--------------|
| **Score ring** | 0–100 score with colour-coded grade (A+ → D) |
| **Section breakdown** | Per-section scores: formatting, keywords, experience, skills, education |
| **Strengths** | What your resume does well |
| **Issues** | Problems flagged as high / medium / low severity with fix suggestions |
| **Missing keywords** | Keywords from the job description not found in your resume |
| **Suggestions** | Ordered list of actionable improvements |

Providing a job role and job description gives the most accurate results.

---

## 🔑 Getting an OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up / log in
3. Navigate to **Keys** → **Create Key**
4. Copy the key into `backend/.env`

The free tier includes enough credits to generate many portfolios.

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, CSS Modules |
| Backend | Node.js, Express |
| PDF Parsing | pdf-parse |
| AI | LLaMA-4 Maverick via OpenRouter |
| PDF Export | html2canvas + jsPDF |

---

## 🔒 Security & Reliability

### Backend
- **Rate limiting** — 10 requests per IP per 15 minutes (in-memory, no Redis required)
- **PDF MIME validation** — multer rejects non-PDF uploads at the file filter level
- **Input sanitization** — strips null bytes, truncates resume text to 15,000 characters to prevent prompt injection and oversized payloads
- **Structured error responses** — all errors return `{ error: "..." }` with correct HTTP status codes (400, 422, 429, 500)
- **API key guard** — returns 500 with a clear message if `OPENROUTER_API_KEY` is missing
- **Axios timeout** — 60-second timeout on OpenRouter requests to prevent hanging connections
- **Multer error handler** — dedicated Express error middleware catches multer errors cleanly
- **Health endpoint** — `GET /health` returns server status and timestamp

### Frontend
- **Toast notifications** — success / error / info toasts for every user action
- **Skeleton loading screen** — animated shimmer skeleton replaces the upload form while AI is processing
- **Shareable link** — the Share button encodes portfolio data + template as a base64 URL param; opening the link restores the full portfolio instantly without re-uploading
- **Template persistence** — last-used template is saved to `localStorage` and restored on next visit

---

## 🎨 Templates

| Template | Style |
|----------|-------|
| **Modern** | Two-column layout with dark sidebar, indigo accents |
| **Minimal** | Clean white, typography-driven, dot-separated skills |
| **Creative** | Dark background, purple gradients, animated skill pills |
| **Corporate** | Navy header, formal resume structure, achievement-focused |

---

## 📦 Build for Production

```bash
# Build frontend
cd frontend
npm run build

# Serve the build folder with any static host (Vercel, Netlify, etc.)
# Deploy backend to Railway, Render, or any Node.js host
```

---

## 🤝 Contributing

PRs welcome! Open an issue first for major changes.

---

## 📄 License

MIT
