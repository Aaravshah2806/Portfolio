import { ArrowUpRight } from "lucide-react";
import { thoughts } from "../data/portfolioData";

export function Thoughts({ onSelectThought }) {
  return (
    <section id="thoughts" className="thoughts section-pad">
      <div className="section-heading">
        <div className="section-label">/THOUGHTS</div>
        <p data-reveal>
          Notes on product, design, software engineering and building things that scale.
        </p>
      </div>

      <div className="thought-list">
        {thoughts.map((thought) => (
          <article
            key={thought.id || thought.title}
            className="thought"
            data-reveal
            onClick={() => onSelectThought(thought)}
            data-cursor-hover
            data-cursor-text="READ"
          >
            <div className="thought-meta">
              {thought.readTime && (
                <span className="thought-read-time">• {thought.readTime}</span>
              )}
            </div>

            <h3 className="thought-title">{thought.title}</h3>

            <button
              type="button"
              className="thought-arrow-btn"
              aria-label={`Read ${thought.title}`}
            >
              <ArrowUpRight size={20} />
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
