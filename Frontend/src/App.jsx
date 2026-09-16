import { useEffect, useRef, useState } from "react";
import { Plus } from "lucide-react";
import { setupAnimations } from "./lib/animations";
import { createSmoothScroll } from "./lib/lenis";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Statement } from "./components/Statement";
import { TechMarquee } from "./components/TechMarquee";
import { Services } from "./components/Services";
import { Projects } from "./components/Projects";
import { ProjectModal } from "./components/ProjectModal";
import { ThoughtModal } from "./components/ThoughtModal";
import { CVModal } from "./components/CVModal";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { CustomCursor } from "./components/CustomCursor";
import AiAssistant from "./components/AiAssistant";

function App() {
  const root = useRef(null);

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedThought, setSelectedThought] = useState(null);
  const [showCVModal, setShowCVModal] = useState(false);

  useEffect(() => {
    document.documentElement.removeAttribute("data-theme");
    localStorage.removeItem("majd_portfolio_theme");

    const destroyLenis = createSmoothScroll();
    const destroyAnimations = setupAnimations(root.current);

    // Re-calculate GSAP triggers after fonts / images load
    const timer = setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 500);

    return () => {
      clearTimeout(timer);
      destroyAnimations?.();
      destroyLenis?.();
    };
  }, []);

  return (
    <div ref={root} className="site">
      <CustomCursor />

      <Navbar />

      <main>
        <Hero />
        <About onOpenCV={() => setShowCVModal(true)} />
        <Statement />
        <TechMarquee />
        <Projects onSelectProject={setSelectedProject} />
        <Services />
        <Contact />
      </main>

      <Footer />

      {/* Floating CTA Button */}
      <a className="floating-contact" href="#contact" data-cursor-hover>
        <Plus size={17} />
        <span>Let&apos;s talk</span>
      </a>

      {/* Interactive Case Study Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Interactive Thought Reader Modal */}
      {selectedThought && (
        <ThoughtModal
          thought={selectedThought}
          onClose={() => setSelectedThought(null)}
        />
      )}

      {/* Interactive CV Preview & Download Modal */}
      {showCVModal && (
        <CVModal
          onClose={() => setShowCVModal(false)}
        />
      )}

      {/* AI Mascot Assistant */}
      <AiAssistant />
    </div>
  );
}

export default App;
