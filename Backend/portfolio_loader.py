import os
import json
import subprocess
from typing import Dict, Any, Optional

_CACHED_DATA: Optional[Dict[str, Any]] = None
_CACHED_MTIME: float = 0.0

def get_portfolio_data_path() -> str:
    """Finds the path to Frontend/src/data/portfolioData.js."""
    candidates = [
        os.path.join(os.path.dirname(__file__), "..", "Frontend", "src", "data", "portfolioData.js"),
        os.path.join(os.path.dirname(__file__), "Frontend", "src", "data", "portfolioData.js"),
        os.path.abspath("Frontend/src/data/portfolioData.js"),
        os.path.abspath("../Frontend/src/data/portfolioData.js"),
    ]
    for p in candidates:
        if os.path.exists(p):
            return os.path.abspath(p)
    return os.path.abspath(candidates[0])

def load_raw_portfolio_data() -> Dict[str, Any]:
    """Loads and converts portfolioData into a Python dictionary.
    First checks for a bundled portfolioData.json in the backend directory for fast,
    zero-dependency cloud deployment (e.g. Render). Falls back to Node.js subprocess
    if running in a dev monorepo without a JSON bundle.
    """
    global _CACHED_DATA, _CACHED_MTIME
    
    # 1. Primary path: Bundled portfolioData.json in backend directory
    json_candidates = [
        os.path.join(os.path.dirname(__file__), "portfolioData.json"),
        os.path.abspath("portfolioData.json"),
    ]
    for json_path in json_candidates:
        if os.path.exists(json_path):
            try:
                current_mtime = os.path.getmtime(json_path)
                if _CACHED_DATA is not None and current_mtime == _CACHED_MTIME:
                    return _CACHED_DATA
                with open(json_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    _CACHED_DATA = data
                    _CACHED_MTIME = current_mtime
                    return data
            except Exception as e:
                print(f"[portfolio_loader] Error reading {json_path}: {e}")

    # 2. Fallback: Dynamic Node.js module import from Frontend/src/data/portfolioData.js
    file_path = get_portfolio_data_path()
    if not os.path.exists(file_path):
        return _CACHED_DATA if _CACHED_DATA else {}

    current_mtime = os.path.getmtime(file_path)
    if _CACHED_DATA is not None and current_mtime == _CACHED_MTIME:
        return _CACHED_DATA

    try:
        from pathlib import Path
        file_uri = Path(file_path).resolve().as_uri()
        js_code = f"import('{file_uri}').then(d => process.stdout.write(JSON.stringify(d)))"
        result = subprocess.run(
            ["node", "--input-type=module", "-e", js_code],
            capture_output=True,
            text=True,
            encoding="utf-8",
            check=True,
            timeout=5
        )
        data = json.loads(result.stdout)
        _CACHED_DATA = data
        _CACHED_MTIME = current_mtime
        return data
    except Exception as e:
        print(f"[portfolio_loader] Subprocess load warning: {e}")

    if _CACHED_DATA:
        return _CACHED_DATA
    return {}

def build_dynamic_system_prompt() -> str:
    """Dynamically formats the system prompt using current portfolio data."""
    data = load_raw_portfolio_data()
    if not data:
        return """You are the personal AI Assistant for Aarav Shah's portfolio website.
Answer questions about Aarav Shah's skills, projects, and contact info accurately."""

    personal = data.get("personalInfo", {})
    name = personal.get("name", "Aarav Shah")
    role = personal.get("role", "Computer Science & Engineering Student")
    tagline = personal.get("tagline", "")
    email = personal.get("email", "shahaarav2806@gmail.com")
    linkedin = personal.get("linkedin", "https://www.linkedin.com/in/aaravshahce/")
    github = personal.get("github", "https://github.com/Aaravshah2806")
    location = personal.get("location", "Mumbai, India")
    bio_headline = personal.get("bioHeadline", "")
    bio_sub = personal.get("bioSub", "")
    statement = personal.get("statement", "")
    status = personal.get("status", "Available for Internship")

    # Format tech stack
    tech_stack = data.get("techStack", [])
    tech_str = ", ".join(tech_stack) if isinstance(tech_stack, list) else str(tech_stack)

    # Format projects
    projects = data.get("projects", [])
    project_sections = []
    for idx, p in enumerate(projects, 1):
        p_title = p.get("title", p.get("shortTitle", f"Project {idx}"))
        p_cat = p.get("category", "")
        p_year = p.get("year", "")
        p_tagline = p.get("tagline", "")
        p_desc = p.get("description", "")
        p_tags = ", ".join(p.get("tags", []))
        p_github = p.get("githubUrl", "")
        p_challenges = p.get("challenges", "")
        p_solution = p.get("solution", "")
        
        metrics_list = []
        for m in p.get("metrics", []):
            metrics_list.append(f"{m.get('label')}: {m.get('value')}")
        metrics_str = " | ".join(metrics_list) if metrics_list else "N/A"

        p_text = f"""- **{p_title}** ({p_year} | {p_cat}):
  • Tagline: {p_tagline}
  • Description: {p_desc}
  • Tech Stack: {p_tags}
  • Key Metrics: {metrics_str}
  • Problem / Challenge: {p_challenges}
  • Solution Architecture: {p_solution}
  • GitHub Repo: {p_github}"""
        project_sections.append(p_text)

    projects_formatted = "\n\n".join(project_sections)

    # Format certifications & hackathon achievements
    certs = data.get("certifications", [])
    cert_sections = []
    for c in certs:
        c_title = c.get("title", c.get("shortTitle", ""))
        c_issuer = c.get("issuer", "")
        c_year = c.get("issued", "")
        c_badge = c.get("badge", "")
        c_desc = c.get("description", "")
        cert_sections.append(f"- **{c_title}** ({c_year} | {c_issuer} | {c_badge}): {c_desc}")

    certs_formatted = "\n".join(cert_sections)

    # Format experience
    exp_list = data.get("experience", [])
    exp_sections = []
    for e in exp_list:
        e_role = e.get("role", "")
        e_comp = e.get("company", "")
        e_period = e.get("period", "")
        e_desc = e.get("description", "")
        exp_sections.append(f"- **{e_role} @ {e_comp}** ({e_period}): {e_desc}")
    exp_formatted = "\n".join(exp_sections) if exp_sections else "Full-stack developer & CS Engineering student."

    project_names = [p.get("shortTitle") or p.get("title") for p in projects if (p.get("shortTitle") or p.get("title"))]

    system_prompt = f"""You are the personal AI Assistant for {name}'s portfolio website.
Your mission is to represent {name} accurately, enthusiastically, and professionally to recruiters, engineering managers, clients, and visitors.

============================================================
KNOWLEDGE BASE ABOUT {name.upper()}:
============================================================
1. BIOGRAPHY & PERSONAL INFO:
- Full Name: {name}
- Role / Headline: {role}
- Tagline: "{tagline}"
- Location: {location}
- Status / Availability: {status}
- Contact Email: {email}
- LinkedIn: {linkedin}
- GitHub: {github}
- Bio: {bio_headline} {bio_sub}
- Core Philosophy / Statement: "{statement}"

2. TECHNICAL SKILLS & TOOLS:
- Core Stack: {tech_str}

3. FEATURED PROJECTS:
{projects_formatted}

4. CERTIFICATIONS, AWARDS & HACKATHONS:
{certs_formatted}

5. EXPERIENCE / ROLES:
{exp_formatted}

============================================================
CRITICAL GUARDRAIL & BEHAVIOR RULES (MANDATORY):
============================================================
1. STRICT SCOPE - {name.upper()} ONLY:
   You are EXCLUSIVELY an assistant for {name} and his portfolio. You must ONLY answer questions directly related to {name}, his technical skills, projects, hackathon achievements, certifications, education, experience, portfolio, or how to contact / hire him.

2. HANDLING OFF-TOPIC / UNRELATED QUESTIONS:
   If a user asks ANY question or gives a prompt that is NOT related to {name} (for example: general trivia, general math problems, writing random scripts/games, news, politics, weather, recipes):
   - You MUST REFUSE to answer the off-topic query.
   - Give a warm, polite, and clearly framed redirection explaining that you are {name}'s personal portfolio assistant and are dedicated specifically to answering questions about him.
   - Include 2 to 3 helpful suggested questions the user can ask about {name}.

3. FORMATTING RULES FOR THE CHAT WIDGET:
   - **DO NOT USE MARKDOWN TABLES** (no `| col | col |` syntax). Tables do NOT fit inside the mobile/desktop chat widget and look cluttered.
   - Present projects, skills, and answers using clean **bullet points**, **bold project titles**, and short readable paragraphs.
   - Example format for projects:
     • **Project Name** (*Year* | *Category*): Concise 1-2 sentence overview.
       - **Tech:** React, Python, FastAPI
       - **Highlights:** Hackathon Track Winner, 60 FPS, etc.
   - Keep responses crisp, mobile-friendly, well-spaced, and complete (never stop mid-sentence).
   - Only reference real projects listed in your knowledge base ({', '.join(project_names)}).
   - When asked for contact details, provide his email ({email}), LinkedIn, and GitHub links.
"""
    return system_prompt
