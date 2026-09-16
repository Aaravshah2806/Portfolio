import { experience } from "../data/portfolioData";
import { Briefcase } from "lucide-react";

export function Experience() {
  return (
    <section id="experience" className="experience section-pad">
      <div className="section-heading">
        <div className="section-label">/EXPERIENCE</div>
        <h2 data-reveal>Career milestones & leadership.</h2>
      </div>

      <div className="experience-list">
        {experience.map((item, index) => (
          <div key={index} className="experience-item" data-reveal data-cursor-hover>
            <div className="experience-period">
              <span className="experience-period-badge">{item.period}</span>
            </div>

            <div className="experience-content">
              <div className="experience-header">
                <h3 className="experience-role">{item.role}</h3>
                <span className="experience-company">@ {item.company}</span>
              </div>
              <p className="experience-description">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
