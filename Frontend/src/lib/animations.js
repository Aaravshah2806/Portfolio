import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Prevent scroll jumps on mobile when URL address bar appears/disappears
ScrollTrigger.config({ ignoreMobileResize: true });

export function setupAnimations(root) {
  const ctx = gsap.context(() => {
    const isMobile = window.innerWidth < 768;

    const hero = document.querySelector("[data-hero]");
    const heroTitle = document.querySelector("[data-hero-title]");
    const heroPhoto = document.querySelector("[data-hero-photo]");
    const heroMeta = document.querySelector("[data-hero-meta]");
    const about = document.querySelector("#about");
    const aboutKicker = document.querySelector(".about-kicker");
    const aboutCopy = document.querySelector(".about-copy");

    if (hero && heroTitle && heroPhoto) {
      gsap.set(heroTitle, {
        opacity: 1,
        visibility: "visible",
        transformOrigin: "50% 50%",
      });

      gsap.set(heroPhoto, {
        transformPerspective: 1200,
        rotateY: -18,
        rotateX: 6,
        x: 0,
        y: 0,
        scale: 1,
      });

      const heroStart = hero.offsetTop;
      const heroHeight = hero.offsetHeight;
      const aboutTop = about ? about.offsetTop : heroHeight;
      const photoTargetX = isMobile ? 0 : Math.min(260, Math.max(110, (window.innerWidth - 1100) * 0.18));
      const photoTargetY = isMobile ? 120 : Math.max(140, aboutTop - heroStart - heroHeight * 0.42 + 100);

      gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: isMobile ? 0.8 : 1.2,
          pin: false,
        },
      })
        .to(
          heroTitle,
          {
            scale: isMobile ? 0.72 : 0.42,
            yPercent: isMobile ? -10 : -52,
            opacity: 0.95,
            ease: "none",
          },
          0
        )
        .to(
          heroPhoto,
          {
            x: photoTargetX,
            y: photoTargetY,
            scale: isMobile ? 1.25 : 1.7,
            rotateY: 0,
            rotateX: 0,
            ease: "none",
          },
          0
        )
        .to(
          heroMeta,
          {
            yPercent: isMobile ? 20 : 36,
            opacity: 0,
            ease: "none",
          },
          0
        );

      if (aboutKicker && aboutCopy) {
        gsap.set([aboutKicker, aboutCopy], { opacity: 0, y: 24 });
        gsap.to([aboutKicker, aboutCopy], {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: about,
            start: "top 70%",
            end: "top 28%",
            scrub: 0.6,
          },
        });
      }
    }

    // Generic reveal-up elements
    gsap.utils.toArray("[data-reveal]").forEach((el) => {
      gsap.fromTo(
        el,
        { y: isMobile ? 24 : 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 92%",
            once: true,
          },
        }
      );
    });

    // Intro statement: subtle scale + blur
    gsap.utils.toArray("[data-intro-word]").forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0.12, y: 16, filter: "blur(4px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 0.7,
          delay: Math.min(i * 0.03, 0.6),
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            once: true,
          },
        }
      );
    });

    // Certifications: sticky card stacking
    gsap.utils.toArray("[data-certification-card]").forEach((card, index, cards) => {
      if (index === cards.length - 1) return;

      gsap.to(card, {
        scale: 0.94,
        opacity: 0.5,
        filter: "blur(3px)",
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top top+=80",
          end: "bottom top+=80",
          scrub: true,
        },
      });
    });

    // Project media: subtle scale parallax (works with aspect-ratio sizing)
    gsap.utils.toArray("[data-parallax]").forEach((image) => {
      gsap.fromTo(
        image,
        { scale: 1.12 },
        {
          scale: 1.0,
          ease: "none",
          scrollTrigger: {
            trigger: image.closest("[data-project]") || image,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    });

    // ponytail: removed [data-project] reveal — conflicts with sticky stacking

    // Testimonials: reveal each card on scroll
    const cards = document.querySelectorAll(".testimonial-window .testimonial");
    if (cards.length) {
      gsap.fromTo(
        cards,
        { y: 20, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".testimonial-window",
            start: "top 85%",
          },
        }
      );
    }

    // Footer headline movement
    const footerTitle = document.querySelector("[data-footer-title]");
    if (footerTitle) {
      gsap.fromTo(
        footerTitle,
        { yPercent: 12, scale: 0.94 },
        {
          yPercent: -6,
          scale: 1,
          ease: "none",
          scrollTrigger: {
            trigger: footerTitle,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        }
      );
    }

    ScrollTrigger.refresh();
  }, root);

  return () => ctx.revert();
}
