import os, json, re
from fastapi import FastAPI, File, UploadFile, Form, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import httpx
import pdfplumber
import io
from collections import defaultdict
import time
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Portfoklio API (Python)")

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOWED_ORIGIN],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Rate limiter ──────────────────────────────────────────────────────────────
_rate_store: dict[str, dict] = defaultdict(lambda: {"count": 0, "start": time.time()})
RATE_LIMIT = 10
RATE_WINDOW = 15 * 60

def check_rate(ip: str):
    entry = _rate_store[ip]
    now = time.time()
    if now - entry["start"] > RATE_WINDOW:
        entry["count"] = 0
        entry["start"] = now
    entry["count"] += 1
    if entry["count"] > RATE_LIMIT:
        raise HTTPException(status_code=429, detail="Too many requests. Please wait 15 minutes.")

# ── Helpers ───────────────────────────────────────────────────────────────────
def sanitize(text: str) -> str:
    return text.replace("\x00", "")[:15000]

def extract_text(pdf_bytes: bytes) -> str:
    with pdfplumber.open(io.BytesIO(pdf_bytes)) as pdf:
        return "\n".join(page.extract_text() or "" for page in pdf.pages)

async def call_ai(prompt: str) -> dict:
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Server is missing API key configuration.")
    async with httpx.AsyncClient(timeout=60) as client:
        r = await client.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": ALLOWED_ORIGIN,
                "X-Title": "Portfoklio",
            },
            json={
                "model": "meta-llama/llama-4-maverick",
                "messages": [{"role": "user", "content": prompt}],
                "response_format": {"type": "json_object"},
            },
        )
    r.raise_for_status()
    content = r.json()["choices"][0]["message"]["content"]
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI returned invalid JSON. Please try again.")

# ── Portfolio generation ──────────────────────────────────────────────────────
async def generate_portfolio(resume_text: str, job_role: str, job_description: str) -> dict:
    safe = sanitize(resume_text)
    job_ctx = ""
    if job_role:
        job_ctx = f"\n\nTarget Job Role: {job_role}"
        if job_description:
            job_ctx += f"\nJob Description:\n{sanitize(job_description)}"
        job_ctx += "\n\nIMPORTANT: Tailor the summary, highlight relevant skills first, and emphasise experience/projects most relevant to this role."

    prompt = f"""You are an expert resume parser and career coach. Extract structured portfolio data from the resume below and return ONLY valid JSON with this exact structure:
{{
  "name": "Full Name",
  "title": "Professional Title",
  "summary": "2-3 sentence professional summary",
  "email": "email@example.com",
  "github": "github_username_or_url",
  "linkedin": "linkedin_url",
  "skills": ["skill1", "skill2"],
  "projects": [{{"name":"","description":"","tech":[],"github":"","live":""}}],
  "experience": [{{"company":"","role":"","duration":"","points":[]}}],
  "education": [{{"institution":"","degree":"","year":""}}]
}}
{job_ctx}

Resume:
{safe}"""

    parsed = await call_ai(prompt)
    if not parsed.get("name") or not isinstance(parsed["name"], str):
        raise HTTPException(status_code=422, detail="Could not extract name from resume. Ensure the PDF contains readable text.")
    return parsed

# ── ATS analysis ──────────────────────────────────────────────────────────────
async def analyse_ats(resume_text: str, job_role: str, job_description: str) -> dict:
    safe = sanitize(resume_text)
    job_ctx = f"Target Role: {job_role}" if job_role else "No specific role provided — analyse for general ATS compatibility."
    if job_role and job_description:
        job_ctx += f"\nJob Description:\n{sanitize(job_description)}"

    prompt = f"""You are an expert ATS analyst and career coach. Analyse the resume below and return ONLY valid JSON:
{{
  "score": 78,
  "grade": "B+",
  "summary": "One sentence overall verdict",
  "strengths": ["strength 1"],
  "issues": [{{"severity": "high", "title": "Issue title", "detail": "Explanation and fix"}}],
  "missingKeywords": ["keyword1"],
  "suggestions": ["Actionable suggestion 1"],
  "sections": {{
    "formatting": {{"score": 80, "comment": "..."}},
    "keywords": {{"score": 60, "comment": "..."}},
    "experience": {{"score": 75, "comment": "..."}},
    "skills": {{"score": 85, "comment": "..."}},
    "education": {{"score": 90, "comment": "..."}}
  }}
}}

Rules: score is 0-100 integer, grade is A+/A/B+/B/C+/C/D, severity is high/medium/low.

{job_ctx}

Resume:
{safe}"""

    parsed = await call_ai(prompt)
    if not isinstance(parsed.get("score"), (int, float)):
        raise HTTPException(status_code=500, detail="ATS analysis failed. Please try again.")
    return parsed

# ── Routes ────────────────────────────────────────────────────────────────────
@app.post("/api/generate")
async def api_generate(
    request: Request,
    resume: UploadFile = File(...),
    jobRole: str = Form(""),
    jobDescription: str = Form(""),
):
    check_rate(request.client.host)
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
    pdf_bytes = await resume.read()
    if len(pdf_bytes) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")
    resume_text = extract_text(pdf_bytes)
    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from PDF. Ensure it is not a scanned image.")
    if len(resume_text.strip()) < 100:
        raise HTTPException(status_code=422, detail="PDF has too little text. Please upload a proper resume.")
    data = await generate_portfolio(resume_text, jobRole.strip(), jobDescription.strip())
    return {"success": True, "data": data}

@app.post("/api/ats")
async def api_ats(
    request: Request,
    resume: UploadFile = File(...),
    jobRole: str = Form(""),
    jobDescription: str = Form(""),
):
    check_rate(request.client.host)
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
    pdf_bytes = await resume.read()
    resume_text = extract_text(pdf_bytes)
    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from PDF.")
    data = await analyse_ats(resume_text, jobRole.strip(), jobDescription.strip())
    return {"success": True, "data": data}

@app.post("/api/tailor")
async def api_tailor(
    request: Request,
    resume: UploadFile = File(...),
    jobRole: str = Form(""),
    jobDescription: str = Form(""),
):
    check_rate(request.client.host)
    if not jobDescription.strip():
        raise HTTPException(status_code=400, detail="Job description is required for tailoring.")
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
    pdf_bytes = await resume.read()
    resume_text = extract_text(pdf_bytes)
    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from PDF.")

    safe_resume = sanitize(resume_text)
    safe_jd = sanitize(jobDescription)

    prompt = f"""You are an expert resume writer. Rewrite the resume below to be perfectly tailored for the job description provided. Return ONLY valid JSON:
{{
  "name": "Full Name",
  "title": "Job-targeted title",
  "summary": "2-3 sentence tailored summary using keywords from the JD",
  "skills": ["skill1", "skill2"],
  "experience": [{{"company":"","role":"","duration":"","points":["rewritten bullet using action verbs and JD keywords"]}}],
  "projects": [{{"name":"","description":"one-liner tailored to JD","tech":[]}}],
  "education": [{{"institution":"","degree":"","year":""}}],
  "keywords_used": ["keyword1", "keyword2"]
}}

Rules:
- Rewrite experience bullets to be impact-driven (start with action verbs, include metrics where possible)
- Naturally embed keywords from the job description
- Keep all facts truthful — only rephrase, never fabricate
- Prioritise skills and experience most relevant to the role

Target Role: {jobRole}
Job Description:
{safe_jd}

Resume:
{safe_resume}"""

    parsed = await call_ai(prompt)
    if not parsed.get("name") or not isinstance(parsed.get("experience"), list):
        raise HTTPException(status_code=500, detail="Tailoring failed. Please try again.")
    return {"success": True, "data": parsed}


@app.post("/api/analyze-jd")
async def api_analyze_jd(
    request: Request,
    resume: UploadFile = File(...),
    jobRole: str = Form(""),
    jobDescription: str = Form(""),
):
    check_rate(request.client.host)
    if not jobDescription.strip():
        raise HTTPException(status_code=400, detail="Job description is required for analysis.")
    if resume.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Only PDF files are accepted.")
    pdf_bytes = await resume.read()
    resume_text = extract_text(pdf_bytes)
    if not resume_text.strip():
        raise HTTPException(status_code=422, detail="Could not extract text from PDF.")

    safe_resume = sanitize(resume_text)
    safe_jd = sanitize(jobDescription)

    prompt = f"""You are an expert career coach and technical recruiter. Analyse the job description against the candidate's resume and return ONLY valid JSON:
{{
  "mustHaveSkills": ["skill1", "skill2"],
  "niceToHaveSkills": ["skill1"],
  "candidateHas": ["skill already in resume"],
  "gaps": ["missing skill or experience"],
  "projectIdeas": [{{"title":"Project name","description":"1-2 sentence idea that fills a gap","skills":["skill1"],"difficulty":"easy|medium|hard"}}],
  "fitScore": 72,
  "fitSummary": "One sentence on how well the candidate fits",
  "quickWins": ["Actionable thing to do this week to improve fit"]
}}

Rules:
- fitScore is 0-100 integer
- projectIdeas should be concrete, buildable in 1-2 weeks, and directly address gaps
- quickWins are specific actions (e.g. "Add a Redis caching layer to your existing project")

Target Role: {jobRole}
Job Description:
{safe_jd}

Candidate Resume:
{safe_resume}"""

    parsed = await call_ai(prompt)
    if not isinstance(parsed.get("mustHaveSkills"), list):
        raise HTTPException(status_code=500, detail="JD analysis failed. Please try again.")
    return {"success": True, "data": parsed}


@app.get("/health")
async def health():
    from datetime import datetime, timezone
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}
