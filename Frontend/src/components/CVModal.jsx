import { useEffect, useState } from "react";
import { X, Download, ExternalLink, FileText, Eye } from "lucide-react";

const PDF_URL = "/Aarav_Shah_Resume.pdf";
const PDF_FILENAME = "Aarav_Shah_Resume.pdf";

export function CVModal({ onClose }) {
  const [isMobile, setIsMobile] = useState(false);
  const [pdfLoaded, setPdfLoaded] = useState(false);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    // Detect mobile / tablet where native PDF embedding often fails
    const checkMobile = () => {
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      const isSmallScreen = window.innerWidth <= 768;
      setIsMobile(isTouchDevice && isSmallScreen);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", checkMobile);
    };
  }, [onClose]);

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = PDF_URL;
    link.download = PDF_FILENAME;
    link.click();
  };

  const handleOpenNewTab = () => {
    window.open(PDF_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <div
      className="modal-backdrop cv-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Resume PDF viewer"
      data-lenis-prevent
    >
      <div
        className="modal-content cv-modal-content"
        onClick={(e) => e.stopPropagation()}
        data-lenis-prevent
      >
        {/* Toolbar */}
        <div className="cv-toolbar">
          <div className="cv-toolbar-left">
            <span className="cv-status-dot" />
            <span className="cv-toolbar-title">Resume — {PDF_FILENAME}</span>
          </div>

          <div className="cv-toolbar-actions">
            <button
              onClick={handleOpenNewTab}
              className="cv-btn-secondary"
              title="Open in new tab (fullscreen)"
              data-cursor-hover
            >
              <ExternalLink size={15} />
              <span className="cv-btn-label">Full Screen</span>
            </button>

            <button
              onClick={handleDownload}
              className="cv-btn-primary"
              title="Download Resume PDF"
              data-cursor-hover
            >
              <Download size={15} />
              <span className="cv-btn-label">Download</span>
            </button>

            <button
              className="modal-close-btn cv-close-btn"
              onClick={onClose}
              aria-label="Close resume viewer"
              data-cursor-hover
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* PDF Viewer Area */}
        <div className="cv-scroll-area cv-pdf-viewer-area" data-lenis-prevent>
          {isMobile ? (
            /* Mobile fallback: show action cards since most mobile browsers
               don't render embedded PDFs inline */
            <div className="cv-mobile-fallback">
              <div className="cv-mobile-icon-wrapper">
                <FileText size={56} strokeWidth={1.2} />
              </div>
              <h3 className="cv-mobile-title">Aarav Shah — Resume</h3>
              <p className="cv-mobile-desc">
                PDF preview isn&apos;t available on this device. Use the options
                below to view or download the resume.
              </p>

              <div className="cv-mobile-actions">
                <button
                  onClick={handleOpenNewTab}
                  className="cv-mobile-btn cv-mobile-btn-primary"
                  data-cursor-hover
                >
                  <Eye size={18} />
                  <span>View Resume</span>
                </button>

                <button
                  onClick={handleDownload}
                  className="cv-mobile-btn cv-mobile-btn-secondary"
                  data-cursor-hover
                >
                  <Download size={18} />
                  <span>Download PDF</span>
                </button>
              </div>
            </div>
          ) : (
            /* Desktop / Tablet landscape: embed PDF directly */
            <>
              {/* Loading indicator while PDF loads */}
              {!pdfLoaded && !pdfError && (
                <div className="cv-pdf-loading">
                  <div className="cv-pdf-spinner" />
                  <span>Loading resume…</span>
                </div>
              )}

              {/* Error fallback */}
              {pdfError && (
                <div className="cv-mobile-fallback">
                  <div className="cv-mobile-icon-wrapper">
                    <FileText size={56} strokeWidth={1.2} />
                  </div>
                  <h3 className="cv-mobile-title">Unable to load preview</h3>
                  <p className="cv-mobile-desc">
                    Your browser couldn&apos;t render the PDF inline. Use the
                    buttons below instead.
                  </p>
                  <div className="cv-mobile-actions">
                    <button
                      onClick={handleOpenNewTab}
                      className="cv-mobile-btn cv-mobile-btn-primary"
                      data-cursor-hover
                    >
                      <Eye size={18} />
                      <span>View Resume</span>
                    </button>
                    <button
                      onClick={handleDownload}
                      className="cv-mobile-btn cv-mobile-btn-secondary"
                      data-cursor-hover
                    >
                      <Download size={18} />
                      <span>Download PDF</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Primary embed: <object> with <iframe> fallback inside */}
              <object
                data={`${PDF_URL}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                type="application/pdf"
                className="cv-pdf-embed"
                style={{
                  opacity: pdfLoaded ? 1 : 0,
                  position: pdfLoaded ? "relative" : "absolute",
                }}
                onLoad={() => setPdfLoaded(true)}
                aria-label="Resume PDF document"
              >
                {/* Fallback iframe for browsers where <object> fails */}
                <iframe
                  src={`${PDF_URL}#toolbar=1&navpanes=0&scrollbar=1&view=FitH`}
                  className="cv-pdf-embed"
                  title="Resume PDF"
                  onLoad={() => setPdfLoaded(true)}
                  onError={() => setPdfError(true)}
                  style={{
                    opacity: pdfLoaded ? 1 : 0,
                    position: pdfLoaded ? "relative" : "absolute",
                  }}
                />
              </object>

              {/* Timeout-based error detection since <object> doesn't fire onerror reliably */}
              <PdfLoadTimeout
                loaded={pdfLoaded}
                onTimeout={() => setPdfError(true)}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** After 6s, if the PDF still hasn't loaded, show the error fallback */
function PdfLoadTimeout({ loaded, onTimeout }) {
  useEffect(() => {
    if (loaded) return;
    const timer = setTimeout(() => {
      if (!loaded) onTimeout();
    }, 6000);
    return () => clearTimeout(timer);
  }, [loaded, onTimeout]);
  return null;
}
