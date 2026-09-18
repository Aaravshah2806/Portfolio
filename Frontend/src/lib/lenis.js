import Lenis from "lenis";

let activeLenis = null;

export function getLenis() {
  return activeLenis;
}

/**
 * Smoothly scroll to an element or section without updating the browser URL with a hash.
 * @param {string|HTMLElement|number} target - Element, selector (#contact, contact), or scroll position
 * @param {number} [offset=-60] - Offset from the top in pixels (to account for fixed headers)
 */
export function scrollToSection(target, offset = -60) {
  if (typeof window === "undefined") return;

  // Handle top / home
  if (target === "top" || target === "#top" || target === 0) {
    if (activeLenis) {
      activeLenis.scrollTo(0, { duration: 1.1 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    return;
  }

  let element = null;
  if (typeof target === "string") {
    const cleanId = target.replace(/^#/, "");
    element = document.getElementById(cleanId) || document.querySelector(target.startsWith("#") ? target : `#${target}`);
  } else if (target instanceof HTMLElement) {
    element = target;
  }

  if (element) {
    if (activeLenis) {
      activeLenis.scrollTo(element, { offset, duration: 1.15 });
    } else {
      const topPos = element.getBoundingClientRect().top + window.pageYOffset + offset;
      window.scrollTo({ top: topPos, behavior: "smooth" });
    }
  }

  // Remove any #hash from the address bar to keep a clean URL
  if (window.location.hash) {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }
}

export function createSmoothScroll() {
  const isTouchDevice =
    typeof window !== "undefined" &&
    (window.matchMedia("(pointer: coarse)").matches ||
      "ontouchstart" in window ||
      navigator.maxTouchPoints > 0);

  const lenis = new Lenis({
    duration: isTouchDevice ? 1.0 : 1.15,
    smoothWheel: true,
    syncTouch: false,
    wheelMultiplier: 0.85,
    touchMultiplier: 1.5,
    infinite: false,
    prevent: (node) => {
      if (!node || typeof node.closest !== "function") return false;
      return Boolean(
        node.closest(
          "[data-lenis-prevent], [data-lenis-prevent-wheel], .chat-panel, .chat-messages, .chat-suggestions-bar, .modal-backdrop, .modal-content, .modal-scroll-area, .cv-scroll-area, .nav-dropdown"
        )
      );
    },
  });

  activeLenis = lenis;
  if (typeof window !== "undefined") {
    window.__lenis = lenis;
  }

  let frameId;

  function raf(time) {
    lenis.raf(time);
    frameId = requestAnimationFrame(raf);
  }

  frameId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(frameId);
    lenis.destroy();
    activeLenis = null;
    if (typeof window !== "undefined") {
      delete window.__lenis;
    }
  };
}
