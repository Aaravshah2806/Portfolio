import { ArrowUpRight, FileText } from "lucide-react";
import { personalInfo } from "../data/portfolioData";

export function About({ onOpenCV }) {
  return (
    <>
      <section id="about" className="about section-pad">
        <div className="section-label">/ABOUT ME</div>

        <div className="about-grid">
          <div className="about-kicker" data-reveal>
            <span>Hey!</span>
          </div>

          <div className="about-copy">
            <p data-reveal className="about-lead">
              {personalInfo.bioHeadline}
            </p>

            <p data-reveal className="about-sub">
              {personalInfo.bioSub}
            </p>

            {/* Key Stats Grid */}
            <div className="stats-grid" data-reveal>
              {personalInfo.stats.map((stat, idx) => (
                <div key={idx} className="stat-card" data-cursor-hover>
                  <span className="stat-value">{stat.value}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              ))}
            </div>

            <div className="about-actions" data-reveal>
              <a href="#contact" className="pill-button" data-cursor-hover>
                <span>Get Started</span>
                <ArrowUpRight size={16} />
              </a>

              <button 
                type="button"
                onClick={onOpenCV} 
                className="pill-button-secondary"
                data-cursor-hover
              >
                <FileText size={16} />
                <span>Preview CV</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
