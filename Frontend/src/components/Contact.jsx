import { useState } from "react";
import { Check, AlertCircle, Loader2 } from "lucide-react";
import { Github, Instagram, Leetcode, Linkedin } from "./Icons";
import { personalInfo } from "../data/portfolioData";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    botcheck: "",
  });

  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setErrorMessage("Please fill out all required fields before submitting.");
      setStatus("error");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      setStatus("error");
      return;
    }

    // Bot honeypot: silently reject bot submissions without network calls
    if (formData.botcheck) {
      setStatus("success");
      setFormData({ name: "", email: "", message: "", botcheck: "" });
      return;
    }

    setStatus("submitting");

    try {
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      const recipientEmail = personalInfo.email || "shahaarav2806@gmail.com";
      let response;

      if (accessKey && accessKey.trim() !== "") {
        // Priority 1: Web3Forms API
        response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            access_key: accessKey.trim(),
            name,
            email,
            message,
            from_name: `${name} via Portfolio`,
            subject: `Portfolio Inquiry from ${name}`,
            botcheck: formData.botcheck || "",
          }),
        });
      } else {
        // Priority 2: FormSubmit API direct to recipient email (zero configuration required)
        response = await fetch(`https://formsubmit.co/ajax/${recipientEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            message,
            _subject: `Portfolio Inquiry from ${name}`,
            _template: "table",
            _captcha: "false",
          }),
        });
      }

      const result = await response.json().catch(() => ({}));

      if (response.ok && (result.success === true || result.success === "true")) {
        setStatus("success");
        setFormData({
          name: "",
          email: "",
          message: "",
          botcheck: "",
        });
      } else {
        const errorDetail =
          result.message ||
          "Could not send your message right now. Please try again or email directly.";
        setErrorMessage(errorDetail);
        setStatus("error");
      }
    } catch {
      setErrorMessage(
        "Network error occurred. Please check your connection or email directly."
      );
      setStatus("error");
    }
  };

  const socials = [
    { name: "GitHub", icon: Github, href: personalInfo.github || "https://github.com" },
    { name: "Instagram", icon: Instagram, href: personalInfo.instagram || "https://instagram.com" },
    { name: "LeetCode", icon: Leetcode, href: personalInfo.leetcode || "https://leetcode.com" },
    { name: "LinkedIn", icon: Linkedin, href: personalInfo.linkedin || "https://linkedin.com" },
  ];

  return (
    <section id="contact" className="contact section-pad">
      <div className="contact-container">
        {/* Left Column: Heading, Subtitle & Social Icons */}
        <div className="contact-left" data-reveal>
          <div className="contact-intro">
            <h2 className="contact-hero-title">
              Let&apos;s talk.
            </h2>
            <p className="contact-hero-subtitle">
              Have a project or need help? Fill out the form, and we&apos;ll get back to you soon.
            </p>
          </div>

          <div className="contact-social-tiles">
            {socials.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="social-tile"
                  aria-label={social.name}
                  title={social.name}
                  data-cursor-hover
                >
                  <Icon size={20} />
                </a>
              );
            })}
          </div>
        </div>

        {/* Right Column: Dark Form Card */}
        <div className="contact-right" data-reveal>
          <div className="contact-card">
            {status === "success" ? (
              <div className="form-success-card-modern">
                <div className="success-icon-wrap-modern">
                  <Check size={28} />
                </div>
                <h4 className="success-title">Message Sent!</h4>
                <p className="success-desc">
                  Thanks for reaching out. We&apos;ll get back to you shortly.
                </p>
                <button
                  type="button"
                  className="contact-submit-btn"
                  onClick={() => setStatus("idle")}
                  data-cursor-hover
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="framer-contact-form" onSubmit={handleSubmit}>
                {/* Honeypot field for bot protection - hidden from humans */}
                <input
                  type="text"
                  name="botcheck"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData.botcheck}
                  onChange={(e) => setFormData({ ...formData, botcheck: e.target.value })}
                  style={{ display: "none" }}
                  aria-hidden="true"
                />

                <div className="form-group">
                  <label htmlFor="contact-name">Name</label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-email">Email</label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="contact-project">Your Project</label>
                  <textarea
                    id="contact-project"
                    required
                    rows="4"
                    placeholder="Tell us about your project"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>

                {status === "error" && (
                  <div className="form-error-banner-modern">
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                      <AlertCircle size={16} />
                      <span>{errorMessage || "Please fill out all fields before submitting."}</span>
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.85, marginTop: "6px" }}>
                      Or email directly at{" "}
                      <a
                        href={`mailto:${personalInfo.email || "shahaarav2806@gmail.com"}?subject=Project Inquiry&body=Hi Aarav,%0D%0A%0D%0A`}
                        style={{ color: "#ffffff", textDecoration: "underline" }}
                      >
                        {personalInfo.email || "shahaarav2806@gmail.com"}
                      </a>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="contact-submit-btn"
                  data-cursor-hover
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={18} className="contact-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Submit</span>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
