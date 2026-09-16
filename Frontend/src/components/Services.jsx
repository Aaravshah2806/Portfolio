import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { certifications } from "../data/portfolioData";

export function Services() {
  const [selectedCredential, setSelectedCredential] = useState(null);

  useEffect(() => {
    if (!selectedCredential) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedCredential(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedCredential]);

  return (
    <section id="certifications" className="services section-pad">
      <div className="section-heading">
        <div className="section-label">/CERTIFICATIONS</div>
        <h2 className="certifications-title" data-reveal>
          Certifications
        </h2>
      </div>

      <div className="certification-grid">
        {certifications.map((certification) => (
          <article
            key={certification.number}
            className="credential-card"
            data-certification-card
            data-cursor-hover
          >
            <div
              className="credential-preview"
              style={{
                background: certification.image 
                  ? `linear-gradient(rgba(240, 240, 240, 0.6), rgba(240, 240, 240, 0.7)), url(${certification.image}) center/cover no-repeat` 
                  : certification.previewTone 
              }}
            >
              <div className="credential-sheet">
                <span className="credential-chip">{certification.badge}</span>
                <h3>{certification.shortTitle}</h3>
                <p>{certification.issuer}</p>
                <small>{certification.issued}</small>
              </div>
            </div>

            <div className="credential-card-body">
              <h3 className="credential-title">{certification.title}</h3>
              <p className="credential-description">{certification.description}</p>
            </div>

            <button
              type="button"
              className="credential-hover-button"
              onClick={() => setSelectedCredential(certification)}
              data-cursor-hover
            >
              View Credential
            </button>
          </article>
        ))}
      </div>

      {selectedCredential && (
        <div
          className="credential-modal-backdrop"
          onClick={() => setSelectedCredential(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="credential-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="modal-close-btn"
              onClick={() => setSelectedCredential(null)}
              aria-label="Close credential"
              data-cursor-hover
            >
              <X size={20} />
            </button>

            <div className="credential-modal-image-container">
              {selectedCredential.image ? (
                <img 
                  src={selectedCredential.image} 
                  alt={selectedCredential.title}
                  className="credential-full-image"
                />
              ) : (
                <div 
                  className="credential-full-image placeholder"
                  style={{ background: selectedCredential.previewTone }}
                >
                  <p>Image not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
