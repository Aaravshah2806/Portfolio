import { useEffect } from "react";
import { X, Download, Printer, ExternalLink, FileText } from "lucide-react";

export function CVModal({ onClose }) {
  const resumePdfPath = "/Aarav_Shah_Resume.pdf";
  const resumeDownloadName = "Aarav_Shah_Resume.pdf";

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
    const win = window.open(resumePdfPath, "_blank");
    if (win) {
      win.focus();
    } else {
      window.print();
    }
  };

  return (
    <div 
      className="modal-backdrop cv-modal-backdrop" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true" 
      data-lenis-prevent
    >
      <div 
        className="modal-content cv-modal-content"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Top Header / Action Bar */}
        <div className="cv-toolbar">
          <div className="cv-toolbar-left">
            <span className="cv-status-dot" />
            <span className="cv-toolbar-title">Aarav_Shah_Resume.pdf</span>
          </div>

          <div className="cv-toolbar-actions">
            {/* Open in New Tab for full native browser experience */}
            <a
              href={resumePdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className="cv-btn-secondary"
              title="Open PDF in fullscreen tab"
              data-cursor-hover
            >
              <ExternalLink size={14} />
              <span className="cv-btn-label-desktop">Open Fullscreen</span>
            </a>

            {/* Print button */}
            <button
              type="button"
              onClick={handlePrint}
              className="cv-btn-secondary"
              title="Print Resume"
              data-cursor-hover
            >
              <Printer size={14} />
              <span className="cv-btn-label-desktop">Print</span>
            </button>

            {/* Native Direct Download */}
            <a
              href={resumePdfPath}
              download={resumeDownloadName}
              className="cv-btn-primary"
              title="Download Resume (Aarav_Shah_Resume.pdf)"
              data-cursor-hover
            >
              <Download size={14} />
              <span>Download PDF</span>
            </a>

            <button 
              type="button"
              className="modal-close-btn cv-close-btn" 
              onClick={onClose} 
              aria-label="Close Resume modal"
              data-cursor-hover
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Dedicated PDF Viewport */}
        <div className="cv-pdf-viewport" data-lenis-prevent>
          <object
            data={`${resumePdfPath}#view=FitH`}
            type="application/pdf"
            className="cv-pdf-frame"
            title="Aarav Shah Resume PDF"
          >
            <iframe
              src={`${resumePdfPath}#view=FitH`}
              className="cv-pdf-frame"
              title="Aarav Shah Resume PDF Frame"
            >
              <div className="cv-pdf-fallback">
                <FileText size={42} />
                <p>Your browser does not support embedding PDFs directly.</p>
                <div className="cv-fallback-actions">
                  <a
                    href={resumePdfPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="cv-btn-secondary"
                  >
                    <ExternalLink size={14} />
                    <span>Open PDF in New Window</span>
                  </a>
                  <a
                    href={resumePdfPath}
                    download={resumeDownloadName}
                    className="cv-btn-primary"
                  >
                    <Download size={14} />
                    <span>Download Resume</span>
                  </a>
                </div>
              </div>
            </iframe>
          </object>
        </div>
      </div>
    </div>
  );
}
