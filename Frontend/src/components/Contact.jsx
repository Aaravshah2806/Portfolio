import { useState } from "react";
import { Check } from "lucide-react";
import { Github, Instagram, Leetcode, Linkedin } from "./Icons";
import { personalInfo } from "../data/portfolioData";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle"); // 'idle' | 'submitting' | 'success' | 'error'

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setStatus("error");
      return;
    }

    setStatus("submitting");

    // Simulate sending with a smooth client-side success response
    setTimeout(() => {
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    }, 800);
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
                    Please fill out all fields before submitting.
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="contact-submit-btn"
                  data-cursor-hover
                >
                  {status === "submitting" ? "Sending..." : "Submit"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
