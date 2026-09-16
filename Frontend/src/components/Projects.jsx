import { useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { Github } from "./Icons";
import { projects, personalInfo } from "../data/portfolioData";
import { ProjectMockup } from "./ProjectMockups";
import { ClapButton } from "./ClapButton";
import { ViewCounter } from "./ViewCounter";
import { useProjectStats } from "../hooks/useProjectStats";

export function Projects({ onSelectProject }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const { getProjectStat, getUserClapCount, clap, maxClaps } = useProjectStats();

  const categories = ["All", ...new Set(projects.map((p) => p.category))];

  const filteredProjects =
    activeCategory === "All"
      ? projects
      : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="work section-pad">
      {/* Featured Projects Header */}
      <div className="featured-projects-header" data-reveal>
        <div className="featured-projects-title-wrap">
          <h2 className="featured-projects-title">
            Featured<br />Projects
          </h2>
        </div>

        <a
          href={personalInfo.github || "https://github.com"}
          target="_blank"
          rel="noreferrer"
          className="view-all-work-btn"
          data-cursor-hover
        >
          <span>View All Work</span>
          <span className="arrow-box">
            <ArrowUpRight size={15} />
          </span>
        </a>
      </div>

      {/* Category Filter Pills */}
      <div className="category-filter" data-reveal>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`filter-pill ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
            data-cursor-hover
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 2-Column Projects Grid */}
      <div className="featured-projects-grid">
        {filteredProjects.map((project) => {
          const stat = getProjectStat(project.id);
          const userClaps = getUserClapCount(project.id);

          return (
            <article
              key={project.id || project.number}
              className="featured-project-card"
              data-reveal
            >
              {/* Top Container with colorful backdrop & UI Mockup */}
              <div
                className="project-mockup-container"
                style={{
                  background:
                    project.gradient ||
                    "linear-gradient(135deg, #2b2b36 0%, #15151c 100%)",
                }}
                onClick={() => onSelectProject?.(project)}
                data-cursor-hover
                title="Click to view full case study"
              >
                {/* Live Stats Header Badges */}
                <div className="project-card-stats-badges">
                  <ViewCounter views={stat.views} variant="card" />
                  <ClapButton
                    projectId={project.id}
                    totalClaps={stat.claps}
                    userClaps={userClaps}
                    maxClaps={maxClaps}
                    onClap={clap}
                    variant="card"
                  />
                </div>

                <div className="mockup-inner-wrapper">
                  <ProjectMockup project={project} />
                </div>

                <div className="mockup-hover-hint">
                  <span>View Case Study</span>
                </div>
              </div>

              {/* Bottom Info & Action Buttons */}
              <div className="featured-project-footer">
                <div
                  className="featured-project-info"
                  onClick={() => onSelectProject?.(project)}
                  data-cursor-hover
                >
                  <h3 className="featured-project-title">
                    {project.shortTitle || project.title}
                  </h3>
                  <span className="featured-project-subtitle">
                    {project.subtitle || project.category}
                  </span>
                </div>

                <div className="featured-project-actions">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="featured-action-pill"
                      data-cursor-hover
                      title="Open Live Preview"
                    >
                      <ExternalLink size={14} />
                      <span>Live Preview</span>
                    </a>
                  )}

                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="featured-action-pill"
                      data-cursor-hover
                      title="View GitHub Repository"
                    >
                      <Github size={14} />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Projects;

