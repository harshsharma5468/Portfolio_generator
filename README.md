# ⚡ Portfoklio – AI Portfolio Generator

> Drop your resume PDF. Get a personalized developer portfolio in under 60 seconds.

Powered by **LLaMA-4 Maverick** via [OpenRouter](https://openrouter.ai). Parses your resume, infers skills, projects, and narrative, and renders a beautiful portfolio with 3 templates.

---

## ✨ Features

- 📄 PDF resume upload with drag & drop
- 🤖 LLaMA-4 Maverick extracts skills, projects, experience, education
- 🎨 3 templates: **Dark**, **Light**, **Minimal**
- ⬇️ Download portfolio as PDF
- ⚡ End-to-end in under 60 seconds

---

## 🗂 Project Structure

```
portfoklio/
├── backend/          # Node.js + Express API
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/         # React app
    ├── src/
    │   ├── App.js
    │   ├── pages/
    │   │   ├── UploadPage.js
    │   │   └── PortfolioPage.js
    │   └── templates/
    │       ├── DarkTemplate.js
    │       ├── LightTemplate.js
    │       └── MinimalTemplate.js
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
3. Choose a template
4. Click **Generate Portfolio**
5. Download as PDF or share the link

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
