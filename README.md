# ⚡ Portfoklio – AI Portfolio Generator

> Drop your resume PDF. Get a personalized developer portfolio in under 60 seconds.

Powered by **LLaMA-4 Maverick** via [OpenRouter](https://openrouter.ai). Parses your resume, infers skills, projects, and narrative, and renders a beautiful portfolio with 4 templates.

<!-- Add screenshots here once deployed -->
<!-- ![Upload Page](docs/screenshot-upload.png) -->
<!-- ![Portfolio Preview](docs/screenshot-portfolio.png) -->
<!-- ![ATS Report](docs/screenshot-ats.png) -->

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
├── backend/               # Node.js / Express backend
│   ├── server.js
│   ├── Dockerfile
│   └── .env.example
├── backend-py/            # FastAPI / Python backend (same endpoints)
│   ├── main.py
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
├── frontend/              # React 18 frontend
│   ├── src/
│   │   ├── App.js
│   │   ├── components/    # Toast, Skeleton
│   │   ├── pages/         # UploadPage, PortfolioPage, ATSPage
│   │   └── templates/     # Modern, Minimal, Creative, Corporate
│   ├── Dockerfile
│   ├── nginx.conf
│   └── vercel.json
├── docker-compose.yml
└── render.yaml
```

---

## 🚀 Quick Start (Docker — recommended)

```bash
git clone https://github.com/harshsharma5468/Portfolio_generator.git
cd Portfolio_generator

# Copy and fill in your API key for both backends
cp backend/.env.example backend/.env
cp backend-py/.env.example backend-py/.env
# Edit both .env files and set OPENROUTER_API_KEY=sk-or-...

docker compose up --build
```

| Service | URL |
|---------|-----|
| Frontend | http://localhost:80 |
| Node.js API | http://localhost:5000 |
| FastAPI (Python) | http://localhost:5001 |
| FastAPI docs | http://localhost:5001/docs |

---

## 🛠 Manual Setup

### Prerequisites

- Node.js 18+ (for Node backend + frontend)
- Python 3.11+ (for FastAPI backend)
- An [OpenRouter](https://openrouter.ai) API key (free tier works)

### Node.js Backend

```bash
cd backend
cp .env.example .env   # add your OPENROUTER_API_KEY
npm install
npm run dev            # http://localhost:5000
```

### FastAPI Backend

```bash
cd backend-py
cp .env.example .env   # add your OPENROUTER_API_KEY
pip install -r requirements.txt
uvicorn main:app --reload --port 5001   # http://localhost:5001
# Interactive docs: http://localhost:5001/docs
```

### Frontend

```bash
cd frontend
npm install
npm start              # http://localhost:3000
```

---

## ☁️ Deploy

### Frontend → Vercel

1. Import the repo on [vercel.com](https://vercel.com)
2. Set **Root Directory** to `frontend`
3. Add env var: `REACT_APP_API_URL=https://your-backend.onrender.com`
4. Update `frontend/vercel.json` with your backend URL
5. Deploy

### Backend → Render

1. Connect repo on [render.com](https://render.com)
2. Render auto-detects `render.yaml` — two services will be created:
   - `portfoklio-node` (Node.js, port 5000)
   - `portfoklio-fastapi` (Python, port 5001)
3. Set `OPENROUTER_API_KEY` and `ALLOWED_ORIGIN` in each service's environment

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

---

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, CSS Modules |
| Backend (Node) | Node.js, Express, pdf-parse |
| Backend (Python) | FastAPI, pdfplumber, httpx |
| AI | LLaMA-4 Maverick via OpenRouter |
| PDF Export | html2canvas + jsPDF |
| Containerisation | Docker, Docker Compose |
| Deploy | Vercel (frontend), Render (backends) |

---

## 🔒 Security & Reliability

- **Rate limiting** — 10 requests per IP per 15 minutes
- **PDF MIME validation** — rejects non-PDF uploads
- **Input sanitization** — strips null bytes, truncates to 15,000 chars (prompt injection protection)
- **Structured error responses** — correct HTTP status codes (400, 422, 429, 500)
- **API key guard** — clear error if key is missing
- **60s timeout** on OpenRouter requests
- **Health endpoint** — `GET /health`

---

## 🎨 Templates

| Template | Style |
|----------|-------|
| **Modern** | Two-column layout with dark sidebar, indigo accents |
| **Minimal** | Clean white, typography-driven, dot-separated skills |
| **Creative** | Dark background, purple gradients, animated skill pills |
| **Corporate** | Navy header, formal resume structure, achievement-focused |

---

## 🔑 Getting an OpenRouter API Key

1. Go to [openrouter.ai](https://openrouter.ai)
2. Sign up / log in → **Keys** → **Create Key**
3. Copy into `backend/.env` and/or `backend-py/.env`

The free tier includes enough credits to generate many portfolios.

---

## 🤝 Contributing

PRs welcome! Open an issue first for major changes.

---

## 📄 License

MIT
