import { useEffect } from "react";
import { X, Download, Printer, Mail, MapPin, ExternalLink, Award, Code2, Briefcase, GraduationCap, Trophy } from "lucide-react";
import { Github, Linkedin } from "./Icons";
import { personalInfo, techStack, certifications, projects } from "../data/portfolioData";

export function CVModal({ onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // If a PDF file exists in public/cv.pdf, download it; otherwise trigger print/save as PDF
    const link = document.createElement("a");
    link.href = "/cv.pdf";
    link.download = "Aarav_Shah_CV.pdf";
    // Check if the file exists or fallback to print
    fetch("/cv.pdf", { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          link.click();
        } else {
          window.print();
        }
      })
      .catch(() => {
        window.print();
      });
  };

  return (
    <div className="modal-backdrop cv-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="modal-content cv-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Top Header / Action Bar */}
        <div className="cv-toolbar">
          <div className="cv-toolbar-left">
            <span className="cv-status-dot" />
            <span className="cv-toolbar-title">Curriculum Vitae — Preview</span>
          </div>

          <div className="cv-toolbar-actions">
            <button
              onClick={handlePrint}
              className="cv-btn-secondary"
              title="Print CV or Save to PDF"
              data-cursor-hover
            >
              <Printer size={15} />
              <span>Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="cv-btn-primary"
              title="Download CV"
              data-cursor-hover
            >
              <Download size={15} />
              <span>Download CV</span>
            </button>

            <button 
              className="modal-close-btn cv-close-btn" 
              onClick={onClose} 
              aria-label="Close CV preview"
              data-cursor-hover
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Printable CV Sheet */}
        <div className="modal-scroll-area cv-scroll-area">
          <div className="cv-paper" id="cv-printable-area">
            {/* Header / Intro */}
            <header className="cv-header">
              <div className="cv-title-group">
                <h1 className="cv-name">{personalInfo.name}</h1>
                <p className="cv-headline">{personalInfo.role}</p>
                <p className="cv-tagline">{personalInfo.tagline}</p>
              </div>

              <div className="cv-contact-meta">
                <div className="cv-meta-item">
                  <Mail size={14} />
                  <a href={`mailto:${personalInfo.email}`}>{personalInfo.email}</a>
                </div>
                <div className="cv-meta-item">
                  <MapPin size={14} />
                  <span>{personalInfo.location}</span>
                </div>
                <div className="cv-meta-item">
                  <Linkedin size={14} />
                  <a href={personalInfo.linkedin} target="_blank" rel="noreferrer">
                    linkedin.com/in/aaravshahce
                  </a>
                </div>
                <div className="cv-meta-item">
                  <Github size={14} />
                  <a href={personalInfo.github} target="_blank" rel="noreferrer">
                    github.com/Aaravshah2806
                  </a>
                </div>
              </div>
            </header>

            <hr className="cv-divider" />

            {/* Summary */}
            <section className="cv-section">
              <h2 className="cv-section-title">
                <span className="cv-section-num">01</span>
                Profile Summary
              </h2>
              <p className="cv-summary-text">
                {personalInfo.statement}
              </p>
            </section>

            {/* Education */}
            <section className="cv-section">
              <h2 className="cv-section-title">
                <span className="cv-section-num">02</span>
                Education
              </h2>
              <div className="cv-entry">
                <div className="cv-entry-head">
                  <div>
                    <h3 className="cv-entry-title">Bachelor of Technology in Computer Science & Engineering</h3>
                    <span className="cv-entry-sub">University Engineering Institute • Mumbai, India</span>
                  </div>
                  <span className="cv-entry-date">2023 — 2027 (Expected)</span>
                </div>
                <p className="cv-entry-desc">
                  Core coursework: Data Structures & Algorithms, Database Management Systems (DBMS), Operating Systems, Computer Networks, Object-Oriented Programming, and Software Engineering.
                </p>
              </div>
            </section>

            {/* Technical Skills */}
            <section className="cv-section">
              <h2 className="cv-section-title">
                <span className="cv-section-num">03</span>
                Technical Skills & Tools
              </h2>
              <div className="cv-skills-grid">
                <div className="cv-skill-category">
                  <span className="cv-skill-label">Languages & Core:</span>
                  <div className="cv-tags">
                    {["Python", "JavaScript (ES6+)", "SQL", "C/C++", "HTML5/CSS3"].map((s) => (
                      <span key={s} className="cv-tag">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="cv-skill-category">
                  <span className="cv-skill-label">Frontend & UI:</span>
                  <div className="cv-tags">
                    {["React", "Vite", "Tailwind CSS", "GSAP ScrollTrigger", "Responsive Design", "Figma"].map((s) => (
                      <span key={s} className="cv-tag">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="cv-skill-category">
                  <span className="cv-skill-label">Backend & Database:</span>
                  <div className="cv-tags">
                    {["PostgreSQL", "MongoDB", "Supabase", "REST APIs", "Node.js Basics"].map((s) => (
                      <span key={s} className="cv-tag">{s}</span>
                    ))}
                  </div>
                </div>

                <div className="cv-skill-category">
                  <span className="cv-skill-label">DevOps & Tools:</span>
                  <div className="cv-tags">
                    {["Docker", "Git & GitHub", "Linux", "AWS (Basic Services)", "Vercel"].map((s) => (
                      <span key={s} className="cv-tag">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Selected Projects */}
            <section className="cv-section">
              <h2 className="cv-section-title">
                <span className="cv-section-num">04</span>
                Featured Projects
              </h2>
              <div className="cv-projects-list">
                {projects.map((proj) => (
                  <div key={proj.id} className="cv-entry">
                    <div className="cv-entry-head">
                      <div>
                        <h3 className="cv-entry-title">{proj.title}</h3>
                        <span className="cv-entry-sub">{proj.role} • {proj.category}</span>
                      </div>
                      <span className="cv-entry-date">{proj.year}</span>
                    </div>
                    <p className="cv-entry-desc">{proj.description}</p>
                    <div className="cv-tags">
                      {proj.tags?.map((t) => (
                        <span key={t} className="cv-tag cv-tag-sm">{t}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Hackathons & Achievements */}
            <section className="cv-section">
              <h2 className="cv-section-title">
                <span className="cv-section-num">05</span>
                Hackathons & Achievements
              </h2>
              <div className="cv-achievements-list">
                <div className="cv-entry">
                  <div className="cv-entry-head">
                    <div>
                      <h3 className="cv-entry-title">HackHatch Hackathon — E-Cell, IIT Delhi</h3>
                      <span className="cv-entry-sub">National Level Finalist • Top 100 of 1000+ Teams</span>
                    </div>
                    <span className="cv-entry-date">2024</span>
                  </div>
                  <p className="cv-entry-desc">
                    Ranked in the top 10% nationally in product engineering and rapid prototyping under high pressure.
                  </p>
                </div>

                <div className="cv-entry">
                  <div className="cv-entry-head">
                    <div>
                      <h3 className="cv-entry-title">Hackathon Winner & Active Competitor</h3>
                      <span className="cv-entry-sub">1x Winner • 10+ Hackathons Participated</span>
                    </div>
                    <span className="cv-entry-date">2023 — Present</span>
                  </div>
                  <p className="cv-entry-desc">
                    Demonstrated rapid execution, full-stack product development, and strong team collaboration in intensive sprint environments.
                  </p>
                </div>
              </div>
            </section>

            {/* Certifications */}
            <section className="cv-section">
              <h2 className="cv-section-title">
                <span className="cv-section-num">06</span>
                Certifications & Accreditations
              </h2>
              <div className="cv-certs-grid">
                {certifications.map((cert) => (
                  <div key={cert.number} className="cv-cert-card">
                    <span className="cv-cert-issuer">{cert.issuer} ({cert.issued})</span>
                    <h4 className="cv-cert-title">{cert.title}</h4>
                    <p className="cv-cert-desc">{cert.description}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Footer Bottom in CV */}
            <div className="cv-footer-stamp">
              <span>{personalInfo.name} — Curriculum Vitae</span>
              <span>Available for Internship & Full-time Roles</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
