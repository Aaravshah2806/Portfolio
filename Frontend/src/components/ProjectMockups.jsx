/* Reusable sleek macOS/browser window frame for portfolio cards */
function BrowserFrame({ url, badge, badgeColor, children }) {
  return (
    <div className="mockup-window-frame">
      <div className="mockup-window-bar">
        <div className="mockup-window-dots">
          <span className="w-dot dot-red" />
          <span className="w-dot dot-yellow" />
          <span className="w-dot dot-green" />
        </div>
        <div className="mockup-window-url">
          <span className="url-lock">🔒</span>
          <span className="url-text">{url}</span>
        </div>
        {badge && (
          <span
            className="mockup-window-badge"
            style={{ borderColor: badgeColor ? `${badgeColor}40` : undefined, color: badgeColor || undefined }}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="mockup-window-viewport">
        {children}
      </div>
    </div>
  );
}

/* 1. Dreamcatcher Mockup (AI Guidance Hackathon Project) */
export function DreamcatcherMockup() {
  return (
    <div className="mockup-screen mockup-dreamcatcher-showcase">
      <BrowserFrame url="dreamcatcher.ai/guidance" badge="🏆 Hackathon Track Winner" badgeColor="#ea580c">
        <img
          src="/images/DreamCatcher.png"
          alt="DreamCatcher AI Career Guidance Platform"
          className="dreamcatcher-preview-image"
          loading="lazy"
        />
      </BrowserFrame>
    </div>
  );
}

/* 2. GameBoy WebOS Mockup (Retro 8-Bit Operating System) */
export function GameboyMockup() {
  return (
    <div className="mockup-screen mockup-gameboy-showcase">
      <BrowserFrame url="gameboy-os.dev/web" badge="👾 60 FPS Retro WebOS" badgeColor="#00ffff">
        <img
          src="/images/GameBoy-WebOS.png"
          alt="GameBoy WebOS Retro Operating System"
          className="gameboy-preview-image"
          loading="lazy"
        />
      </BrowserFrame>
    </div>
  );
}

/* 3. GreenNova Mockup (AI Sustainability & EcoTech Ecosystem) */
export function GreenNovaMockup() {
  return (
    <div className="mockup-screen mockup-greenova-showcase">
      <BrowserFrame url="greenova.eco/extension" badge="🌱 Gemma 3:12B Live" badgeColor="#10b981">
        <img
          src="/images/Greenova.png"
          alt="GreenNova AI Sustainability Platform"
          className="greenova-preview-image"
          loading="lazy"
        />
      </BrowserFrame>
    </div>
  );
}

/* 4. VibeDocs Mockup (AI README & Doc Generator) */
export function VibeDocsMockup() {
  return (
    <div className="mockup-screen mockup-vibedocs-showcase">
      <BrowserFrame url="vibedocs.ai/readme-studio" badge="⚡ Vibe Score 92/100" badgeColor="#a855f7">
        <img
          src="/images/VibeDocs.png"
          alt="VibeDocs AI Documentation Studio"
          className="vibedocs-preview-image"
          loading="lazy"
        />
      </BrowserFrame>
    </div>
  );
}

/* 5. F1 Race Replay Mockup (Telemetry & Simulation) */
export function F1RaceReplayMockup() {
  return (
    <div className="mockup-screen mockup-f1-showcase">
      <BrowserFrame url="f1-replay.telemetry/live" badge="🏎️ 20Hz Telemetry" badgeColor="#f87171">
        <img
          src="/images/F1-race-replay.png"
          alt="F1 Race Replay & Telemetry Visualizer"
          className="f1-preview-image"
          loading="lazy"
        />
      </BrowserFrame>
    </div>
  );
}

/* 6. ZealFlow Mockup (Intelligent Workflow & Automation Engine) */
export function ZealFlowMockup() {
  return (
    <div className="mockup-screen mockup-zealflow-showcase">
      <BrowserFrame url="zealflow.io/pipelines" badge="⚡ 38ms Telemetry" badgeColor="#fb923c">
        <img
          src="/images/ZealFlow.png"
          alt="ZealFlow Intelligent Workflow Automation"
          className="zealflow-preview-image"
          loading="lazy"
        />
      </BrowserFrame>
    </div>
  );
}

/* Main Mockup Dispatcher */
export function ProjectMockup({ project }) {
  switch (project.id) {
    case "dreamcatcher":
      return <DreamcatcherMockup />;
    case "gameboy-webos":
    case "gameboy":
      return <GameboyMockup />;
    case "greenova":
    case "healflow":
      return <GreenNovaMockup />;
    case "vibedocs":
      return <VibeDocsMockup />;
    case "f1-race-replay":
    case "f1":
      return <F1RaceReplayMockup />;
    case "zealflow":
    case "slack-bot":
    case "jarvis":
      return <ZealFlowMockup />;
    default:
      return (
        <div className="mockup-screen mockup-generic">
          <BrowserFrame url={project.title ? `${project.id}.app` : "app.local"}>
            <img src={project.image} alt={project.title} loading="lazy" />
          </BrowserFrame>
        </div>
      );
  }
}
