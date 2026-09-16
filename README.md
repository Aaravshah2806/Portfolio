# 🚀 Aarav Shah — Full-Stack & AI Engineering Portfolio

A modern, high-performance interactive developer portfolio featuring 3D ambient aesthetics, smooth inertial scrolling (Lenis + GSAP), an integrated AI Assistant powered by Groq & FastAPI, and custom interactive case studies for award-winning hackathon and production projects.

![Portfolio Preview](/Frontend/public/images/profile.png)

---

## 🌟 Featured Projects

1. **DreamCatcher** — *AI Guidance & Multilingual Career Platform*
   - **Track Winner** at Pragati 2.0 BUILD-itON Hackathon (TCET).
   - React, FastAPI, Python, AI Counseling Personas, Multilingual (Hindi & Marathi).
2. **GameBoy WebOS** — *Retro 8-Bit Handheld In-Browser Operating System*
   - Nostalgic 80s arcade UI with CSS3 3D perspective grids, pixel art window management, and retro mini-apps.
3. **GreenNova** — *AI Sustainability & Carbon Tracking Platform*
   - Manifest V3 Chrome Extension scoring e-commerce products (Amazon/Flipkart) with local Gemma 3:12B LLM inference via Ollama + Flutter cross-platform mobile app.
4. **VibeDocs** — *AI-Driven Documentation & README Studio*
   - Dynamic repository structure analysis, Vibe Score calculations, and one-click GitHub push.
5. **F1 Race Replay** — *High-Frequency Formula 1 Telemetry & Race Visualizer*
   - Ingests 20Hz FastF1 telemetry streams to simulate Grand Prix races with live delta charts, tyre degradation curves, and DRS tracking.
6. **ZealFlow** — *Intelligent Workflow & Task Automation Engine*
   - Asynchronous pipeline orchestration, webhook ingest triggers, and sub-45ms execution telemetry.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite 8
- **Styling**: Vanilla CSS, Tailwind CSS, Glassmorphism, CSS Custom Properties
- **Motion & 3D**: GSAP, Lenis Smooth Scroll, Spline 3D, Framer Motion
- **Icons**: Lucide React
- **Live Stats**: Supabase Realtime with resilient LocalStorage & BroadcastChannel fallbacks

### Backend
- **Framework**: Python FastAPI, Uvicorn
- **AI Engine**: Groq API (High-speed Llama 3 LLM inference)
- **Environment**: Pydantic, Python-Dotenv

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Aaravshah2806/Portfolio.git
cd Portfolio
```

### 2. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
The portfolio will start locally on `http://localhost:5173`.

### 3. Backend Setup (AI Assistant)
```bash
cd ../Backend
pip install -r requirements.txt
cp .env.example .env
# Add your GROQ_API_KEY inside .env
python main.py
```
Backend API will start at `http://localhost:8000`.

---

## 🚢 Deployment

- **Frontend**: One-click deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) pointing to the `Frontend` folder (`npm run build` -> `dist`).
- **Backend**: Deploy to [Render](https://render.com), [Railway](https://railway.app), or [Fly.io] pointing to the `Backend` directory.

---

## 📄 License
MIT © [Aarav Shah](https://github.com/Aaravshah2806)
