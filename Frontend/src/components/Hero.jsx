import { useState, useEffect } from "react";
import { MoveDown, Sparkles } from "lucide-react";
import { personalInfo } from "../data/portfolioData";

export function Hero() {
  const [localTime, setLocalTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = new Intl.DateTimeFormat("en-US", {
          timeZone: personalInfo.timezone || personalInfo.timeZone || "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        }).format(now);
        setLocalTime(formatted);
      } catch (e) {
        setLocalTime(new Date().toLocaleTimeString());
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section id="top" data-hero className="hero section-pad">
      <div className="hero-grain" />

      {/* Live availability & location badge */}
      <div className="hero-status-bar">
        <div className="status-badge" data-cursor-hover>
          <span className="status-dot-pulse" />
          <span className="status-text">{personalInfo.status}</span>
        </div>
        
        {localTime && (
          <div className="location-badge">
            <span>{personalInfo.location}</span>
            <span className="location-divider">•</span>
            <span className="location-time">{localTime}</span>
          </div>
        )}
      </div>

      <div className="hero-inner">
        <div data-hero-title className="hero-title">
          <span>SOFTWARE</span>
          <span>ENGINEER</span>
        </div>

        <div data-hero-photo className="hero-photo" data-cursor-hover>
          <div className="hero-photo-shine" />
          <img
            src="/images/profile.png"
            alt={`${personalInfo.name} portrait`}
            onError={(e) => {
              // Fallback placeholder if profile.png is not found or fails to render
              e.currentTarget.style.display = "none";
              e.currentTarget.parentElement.classList.add("has-fallback");
            }}
          />
          <div className="hero-photo-fallback">
            <Sparkles size={32} />
            <span>{personalInfo.name.split(" ").map(n => n[0]).join("")}</span>
          </div>
        </div>

        <div className="hero-star hero-star-left">✦</div>
        <div className="hero-star hero-star-right">✦</div>

        <div data-hero-meta className="hero-meta">
          <span>©2026</span>
          <span>/{personalInfo.tagline.toUpperCase()}</span>
        </div>
      </div>

      <a href="#about" className="scroll-hint" aria-label="Scroll down to About section" data-cursor-hover>
        <MoveDown size={18} />
      </a>
    </section>
  );
}
