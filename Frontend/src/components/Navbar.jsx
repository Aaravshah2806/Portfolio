import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { personalInfo } from "../data/portfolioData";

const NAV_LINKS = [
  { label: "About Me", href: "#about" },
  { label: "Projects", href: "#work" },
  { label: "Certificates", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const [activeLink, setActiveLink] = useState("");

  const wrapRef = useRef(null);
  const innerRef = useRef(null);
  const toggleRef = useRef(null);

  const close = useCallback(() => setIsOpen(false), []);

  /* Measure the dropdown height accurately */
  const measure = useCallback(() => {
    if (innerRef.current) {
      const h = innerRef.current.scrollHeight || innerRef.current.offsetHeight;
      setDropdownHeight(Math.max(h, 230));
    }
  }, []);

  useLayoutEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  useEffect(() => {
    if (isOpen) {
      measure();
    }
  }, [isOpen, measure]);

  /* Scroll-based pill shrink */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section tracking */
  useEffect(() => {
    const sections = NAV_LINKS.map(l => l.href.replace("#", ""));
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) setActiveLink("#" + e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => { if (e.key === "Escape") { close(); toggleRef.current?.focus(); } };
    const onPointerDown = (e) => { if (!wrapRef.current?.contains(e.target)) close(); };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("scroll", close, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("scroll", close);
    };
  }, [isOpen, close]);

  const handleToggle = () => { measure(); setIsOpen(prev => !prev); };

  return (
    <header className="nav-wrap" ref={wrapRef}>
      <nav
        className="nav"
        data-open={isOpen}
        data-scrolled={scrolled}
        aria-label="Main Navigation"
      >
        {/* ── Top row: brand | desktop-links | actions ── */}
        <div className="nav-bar">
          <div className="nav-row">
            {/* Brand */}
            <a href="#top" className="nav-brand" onClick={close} data-cursor-hover>
              {personalInfo.name}
            </a>

            {/* Desktop horizontal links */}
            <ul className="nav-desktop-links" role="list">
              {NAV_LINKS.map(link => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`nav-desktop-link${activeLink === link.href ? " active" : ""}`}
                    data-cursor-hover
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            {/* Actions */}
            <div className="nav-actions">
              {/* Mobile menu toggle button */}
              <button
                type="button"
                ref={toggleRef}
                className="nav-toggle"
                data-open={isOpen}
                onClick={handleToggle}
                aria-expanded={isOpen}
                aria-controls="nav-dropdown"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                data-cursor-hover
              >
                <span className="nav-toggle-line" />
                <span className="nav-toggle-line" />
                <span className="nav-toggle-line" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile dropdown ── */}
        <div
          className="nav-dropdown"
          id="nav-dropdown"
          data-lenis-prevent
          style={{ height: isOpen ? `${dropdownHeight}px` : 0 }}
          aria-hidden={!isOpen}
        >
          <div className="nav-dropdown-inner" ref={innerRef}>
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                className={`nav-link${activeLink === link.href ? " active" : ""}`}
                onClick={close}
                tabIndex={isOpen ? 0 : -1}
                style={{ transitionDelay: isOpen ? `${0.06 * (i + 1)}s` : "0s" }}
                data-cursor-hover
              >
                <span className="nav-link-label">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
