import { useState, useEffect } from "react";
import { X, ExternalLink, Maximize2, Minimize2, Sparkles, CheckCircle2 } from "lucide-react";
import { Github } from "./Icons";
import { ClapButton } from "./ClapButton";
import { ViewCounter } from "./ViewCounter";
import { useProjectStats } from "../hooks/useProjectStats";

export function ProjectModal({ project, onClose }) {
  const [isZoomed, setIsZoomed] = useState(false);
  const { getProjectStat, getUserClapCount, recordView, clap, maxClaps } =
    useProjectStats();

  useEffect(() => {
    if (!project) return;

    // Record verified unique view per session
    recordView(project.id);

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isZoomed) {
          setIsZoomed(false);
        } else {
          onClose();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose, recordView, isZoomed]);

  if (!project) return null;

  const stat = getProjectStat(project.id);
  const userClaps = getUserClapCount(project.id);
  const projectUrl = `${project.id}.app/overview`;

  return (
    <>
      <div
        className="modal-backdrop"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="modal-content project-modal-content"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
            data-cursor-hover
          >
            <X size={20} />
          </button>

          <div className="modal-scroll-area">
            {/* Header with Title & Metadata */}
            <div className="modal-header">
              <div className="modal-meta-row">
                <span
                  className="modal-category"
                  style={{ color: project.accentColor || "var(--accent)" }}
                >
                  {project.category}
                </span>
                <span className="modal-year">{project.year || "2026"}</span>
                {project.client && (
                  <span className="modal-client">• {project.client}</span>
                )}
                {/* Live View Count Badge */}
                <ViewCounter views={stat.views} variant="modal" />
              </div>

              <h2 className="modal-title">{project.title}</h2>
              <p className="modal-tagline">
                {project.tagline || project.description}
              </p>

              <div className="modal-actions-top">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-button"
                    data-cursor-hover
                  >
                    <span>Live Preview</span>
                    <ExternalLink size={16} />
                  </a>
                )}

                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pill-button-secondary"
                    data-cursor-hover
                  >
                    <Github size={16} />
                    <span>View Repository</span>
                  </a>
                )}

                {/* Medium-style Applause Button */}
                <ClapButton
                  projectId={project.id}
                  totalClaps={stat.claps}
                  userClaps={userClaps}
                  maxClaps={maxClaps}
                  onClap={clap}
                  variant="modal"
                />
              </div>
            </div>

            {/* Impeccable Ambient Showcase Frame */}
            <div
              className="modal-media-showcase"
              style={{
                background:
                  project.gradient ||
                  "linear-gradient(135deg, #181824 0%, #0c0c14 100%)",
              }}
            >
              <div
                className="modal-ambient-glow"
                style={{
                  background: project.accentColor || "rgba(255, 255, 255, 0.15)",
                }}
              />

              <div className="modal-window-frame">
                <div className="modal-window-bar">
                  <div className="modal-window-dots">
                    <span className="w-dot dot-red" />
                    <span className="w-dot dot-yellow" />
                    <span className="w-dot dot-green" />
                  </div>
                  <div className="modal-window-url">
                    <span className="url-lock">🔒</span>
                    <span className="url-text">{projectUrl}</span>
                  </div>
                  <button
                    className="modal-zoom-toggle"
                    onClick={() => setIsZoomed(true)}
                    title="Expand Fullscreen Screenshot"
                    data-cursor-hover
                  >
                    <Maximize2 size={13} />
                    <span>Zoom</span>
                  </button>
                </div>

                <div
                  className="modal-window-content"
                  onClick={() => setIsZoomed(true)}
                  data-cursor-hover
                  title="Click to view full-resolution screenshot"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="modal-showcase-image"
                    loading="lazy"
                  />
                  <div className="modal-img-overlay-hint">
                    <Maximize2 size={18} />
                    <span>Click for Full View</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Metrics Grid */}
            {project.metrics && project.metrics.length > 0 && (
              <div className="modal-metrics-grid">
                {project.metrics.map((metric, i) => (
                  <div key={i} className="modal-metric-card">
                    <span
                      className="metric-val"
                      style={{ color: project.accentColor || "var(--accent)" }}
                    >
                      {metric.value}
                    </span>
                    <span className="metric-lbl">{metric.label}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Detailed Body & Architecture */}
            <div className="modal-body-grid">
              <div className="modal-deepdive">
                <h3>
                  <Sparkles size={16} className="deepdive-icon" />
                  Overview & Engineering Architecture
                </h3>
                <p>{project.description}</p>

                {project.challenges && (
                  <div className="deepdive-section-box">
                    <h4>The Challenge</h4>
                    <p>{project.challenges}</p>
                  </div>
                )}

                {project.solution && (
                  <div className="deepdive-section-box highlight">
                    <h4>The Solution & Delivery</h4>
                    <p>{project.solution}</p>
                  </div>
                )}

                {/* End of Deepdive Applause Station */}
                <div className="modal-applause-station">
                  <div className="applause-station-copy">
                    <h4>Enjoyed this project?</h4>
                    <p>Clap to support this build and share feedback!</p>
                  </div>
                  <ClapButton
                    projectId={project.id}
                    totalClaps={stat.claps}
                    userClaps={userClaps}
                    maxClaps={maxClaps}
                    onClap={clap}
                    variant="modal"
                  />
                </div>
              </div>

              {/* Sidebar Metadata */}
              <div className="modal-sidebar">
                <div className="sidebar-block">
                  <span className="sidebar-label">Role</span>
                  <span className="sidebar-value">
                    {project.role || "Lead Developer"}
                  </span>
                </div>

                <div className="sidebar-block">
                  <span className="sidebar-label">Category</span>
                  <span className="sidebar-value">{project.category}</span>
                </div>

                {project.client && (
                  <div className="sidebar-block">
                    <span className="sidebar-label">Event / Client</span>
                    <span className="sidebar-value">{project.client}</span>
                  </div>
                )}

                <div className="sidebar-block">
                  <span className="sidebar-label">Technologies & Stack</span>
                  <div className="modal-tech-tags">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="tech-badge"
                        style={{
                          borderColor: project.accentColor
                            ? `${project.accentColor}35`
                            : undefined,
                        }}
                      >
                        <CheckCircle2 size={11} className="tech-badge-check" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isZoomed && (
        <div
          className="modal-lightbox-backdrop"
          onClick={() => setIsZoomed(false)}
        >
          <button
            className="lightbox-close-btn"
            onClick={() => setIsZoomed(false)}
            aria-label="Close fullscreen image"
            data-cursor-hover
          >
            <Minimize2 size={22} />
          </button>
          <div
            className="lightbox-img-wrapper"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={project.image}
              alt={project.title}
              className="lightbox-img"
            />
            <div className="lightbox-caption">
              <span>{project.title}</span>
              <span className="lightbox-sub">{project.subtitle}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

