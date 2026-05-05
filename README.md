# ⚡ Portfoklio – AI Portfolio Generator

> Drop your resume PDF. Get a personalized developer portfolio in under 60 seconds.

Powered by **LLaMA-4 Maverick** via [OpenRouter](https://openrouter.ai). Parses your resume, infers skills, projects, and narrative, and renders a beautiful portfolio with 4 templates.

---

## ✨ Features

- 📄 PDF resume upload with drag & drop
- 🤖 LLaMA-4 Maverick extracts skills, projects, experience, and education
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

## 🏗 Dual Backend

The same API is implemented in two stacks — swap between them by changing the proxy target in `docker-compose.yml`.

| Backend | Stack | Port | Docs |
|---------|-------|------|------|
| `backend/` | Node.js + Express | 5000 | — |
| `backend-py/` | Python + FastAPI | 5001 | `http://localhost:5001/docs` |

Both expose identical endpoints: `POST /api/generate`, `POST /api/ats`, `GET /health`.

---

## 🗂 Project Structure

```
portfoklio/
├── backend/                    # Node.js / Express backend
│   ├── server.js               # /api/generate, /api/ats, /health
│   ├── Dockerfile              # Node 18 Alpine
│   ├── package.json
│   └── .env.example
├── backend-py/                 # Python / FastAPI backend (identical API)
│   ├── main.py                 # /api/generate, /api/ats, /health
│   ├── Dockerfile              # Python 3.11 slim
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.js              # Shareable link decoder + ATS routing
│   │   ├── components/
│   │   │   ├── Toast.js        # Toast notification system
│   │   │   └── Skeleton.js     # AI loading skeleton screen
│   │   ├── pages/
│   │   │   ├── UploadPage.js   # Upload + template picker + job targeting
│   │   │   ├── PortfolioPage.js# Preview + share + download
│   │   │   └── ATSPage.js      # ATS score report UI
│   │   └── templates/
│   │       ├── index.js        # Template registry
│   │       ├── ModernTemplate.js
│   │       ├── MinimalTemplate.js
│   │       ├── CreativeTemplate.js
│   │       └── CorporateTemplate.js
│   ├── Dockerfile              # Multi-stage React build → nginx
│   ├── nginx.conf              # SPA routing + /api/ proxy to Node backend
│   ├── vercel.json             # SPA rewrites for Vercel
│   └── package.json
├── docker-compose.yml          # One command spins up all 3 services
├── render.yaml                 # Render deploy config (both backends)
└── README.md
```

---

## 🚀 Getting Started

### Option A — Docker (recommended)

Requires [Docker Desktop](https://www.docker.com/products/docker-desktop/).

```bash
git clone https://github.com/harshsharma5468/Portfolio_generator.git
cd Portfolio_generator

cp backend/.env.example backend/.env         # add your OpenRouter API key
cp backend-py/.env.example backend-py/.env   # add your OpenRouter API key

docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Node backend | http://localhost:5000 |
| FastAPI backend | http://localhost:5001 |
| FastAPI Swagger UI | http://localhost:5001/docs |

### Option B — Manual (Node backend)

**Prerequisites:** Node.js 18+

```bash
# Backend
cd backend
cp .env.example .env   # add OPENROUTER_API_KEY
npm install
npm run dev            # http://localhost:5000

# Frontend (new terminal)
cd frontend
npm install
npm start              # http://localhost:3000
```

### Option C — Manual (FastAPI backend)

**Prerequisites:** Python 3.11+

```bash
# Backend
cd backend-py
cp .env.example .env   # add OPENROUTER_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload --port 5001   # http://localhost:5001

# Frontend (new terminal)
cd frontend
npm install
npm start              # http://localhost:3000
```

---

## 🔑 Getting an OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up / log in → **Keys** → **Create Key**
3. Copy the key into `backend/.env` and/or `backend-py/.env`

```
OPENROUTER_API_KEY=sk-or-xxxxxxxxxxxxxxxx
```

The free tier includes enough credits to generate many portfolios.

---

## 📖 Usage

1. Open the app and upload your resume PDF (drag & drop or click)
2. *(Optional)* Enter a target job role and paste a job description for tailored output
3. Choose a template
4. Click **Generate Portfolio** to get your personalized portfolio — or **Check ATS Score** for a full ATS analysis
5. Download as PDF or click **Share** to copy a shareable URL

---

## 🎯 ATS Score Checker

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

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, CSS Modules |
| Node backend | Node.js, Express, pdf-parse, multer, axios |
| Python backend | FastAPI, pdfplumber, httpx, python-multipart |
| AI | LLaMA-4 Maverick via OpenRouter |
| PDF Export | html2canvas + jsPDF |
| Containerisation | Docker, Docker Compose |
| Deploy | Render (backends) + Vercel (frontend) |

---

## 🔒 Security & Reliability

### Both backends
- **Rate limiting** — 10 requests per IP per 15 minutes
- **PDF MIME validation** — rejects non-PDF uploads at the file filter level
- **Input sanitization** — strips null bytes, truncates resume text to 15,000 characters to prevent prompt injection and oversized payloads
- **Structured error responses** — all errors return `{ "error": "..." }` with correct HTTP status codes (400, 422, 429, 500)
- **API key guard** — returns 500 with a clear message if `OPENROUTER_API_KEY` is missing
- **Request timeout** — 60-second timeout on OpenRouter calls to prevent hanging connections
- **Health endpoint** — `GET /health` returns server status and timestamp

### Frontend
- **Toast notifications** — success / error / info toasts for every user action
- **Skeleton loading screen** — animated shimmer replaces the upload form while AI processes
- **Shareable link** — encodes portfolio data + template as a base64 URL param; restores the full portfolio instantly without re-uploading
- **Template persistence** — last-used template saved to `localStorage` and restored on next visit

---

## 🎨 Templates

| Template | Style |
|----------|-------|
| **Modern** | Two-column layout with dark sidebar, indigo accents |
| **Minimal** | Clean white, typography-driven, dot-separated skills |
| **Creative** | Dark background, purple gradients, animated skill pills |
| **Corporate** | Navy header, formal resume structure, achievement-focused |

---

## ☁️ Deploy

### Backends → Render

A `render.yaml` is included. Push to GitHub, connect the repo on [render.com](https://render.com), and Render will auto-detect and create both backend services.

Add `OPENROUTER_API_KEY` as an environment variable in the Render dashboard for each service.

### Frontend → Vercel

A `vercel.json` is included for SPA routing. Before deploying:

1. Update the backend proxy URL in `vercel.json` to your Render backend URL
2. Push to GitHub and import the repo on [vercel.com](https://vercel.com)

```bash
# Or deploy via CLI
npm i -g vercel
cd frontend
vercel --prod
```

---

## 📦 Build for Production (manual)

```bash
# Build frontend
cd frontend
npm run build
# Serve the build/ folder on Vercel, Netlify, or any static host

# Node backend — deploy to Railway, Render, or any Node.js host
# FastAPI backend — deploy to Render, Railway, or any Python host
```

---

## 🤝 Contributing

PRs welcome! Open an issue first for major changes.

---

## 📄 License

MIT