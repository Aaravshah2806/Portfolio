import { techStack } from "../data/portfolioData";

export function TechMarquee() {
  const repeated = [...techStack, ...techStack, ...techStack];

  return (
    <div className="tech-marquee-wrap" aria-hidden="true">
      <div className="tech-marquee-track">
        {repeated.map((tech, index) => (
          <div key={`${tech}-${index}`} className="tech-item">
            <span className="tech-dot">✦</span>
            <span className="tech-name">{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
