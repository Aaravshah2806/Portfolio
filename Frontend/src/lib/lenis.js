import Lenis from "lenis";

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

  let frameId;

  function raf(time) {
    lenis.raf(time);
    frameId = requestAnimationFrame(raf);
  }

  frameId = requestAnimationFrame(raf);

  return () => {
    cancelAnimationFrame(frameId);
    lenis.destroy();
  };
}
