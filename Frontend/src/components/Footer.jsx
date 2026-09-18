import { ArrowUp } from "lucide-react";
import { personalInfo } from "../data/portfolioData";
import { scrollToSection } from "../lib/lenis";

export function Footer() {
  const scrollToTop = () => {
    scrollToSection("top");
  };

  const firstName = personalInfo.name ? personalInfo.name.split(" ")[0].toUpperCase() : "AARAV";

  const quickLinks = [
    { label: "Home", href: "#top" },
    { label: "About Me", href: "#about" },
    { label: "Certifications", href: "#certifications" },
    { label: "Projects", href: "#work" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <footer className="footer">
      <div className="footer-top-grid">
        {/* Left Column: Headline */}
        <div className="footer-lead-col" data-reveal>
          <h2 className="footer-hero-headline">
            Scaling<br />
            Start-ups<br />
            for Growth.
          </h2>
        </div>

        {/* Middle Column: Quick Links Pills */}
        <div className="footer-links-col" data-reveal>
          <span className="footer-col-label">/Quick links</span>
          <div className="footer-pill-grid">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="footer-link-pill"
                data-cursor-hover
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right Column: Contact info */}
        <div className="footer-contact-col" data-reveal>
          <span className="footer-col-label">/Contact</span>
          <a
            href={`mailto:${personalInfo.email}`}
            className="footer-email-link"
            data-cursor-hover
          >
            {personalInfo.email}
          </a>
        </div>
      </div>

      {/* Giant First Name Watermark */}
      <div className="footer-watermark-wrap" aria-hidden="true">
        <span className="footer-watermark" data-footer-title>
          {firstName}
        </span>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="footer-copyright">
          <span>© {new Date().getFullYear()} {personalInfo.name}. All rights reserved.</span>
        </div>

        <button
          onClick={scrollToTop}
          className="scroll-top-btn"
          aria-label="Back to top"
          data-cursor-hover
        >
          <span>Back to top</span>
          <ArrowUp size={16} />
        </button>
      </div>
    </footer>
  );
}