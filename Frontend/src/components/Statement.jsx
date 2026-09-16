import { TextEffect } from "./core/text-effect";
import { personalInfo } from "../data/portfolioData";

export function TextEffectPerWord({ children = personalInfo.statement, as = "h3", preset = "blur", className = "", ...props }) {
  return (
    <TextEffect per="word" as={as} preset={preset} className={className} {...props}>
      {children}
    </TextEffect>
  );
}

export function Statement() {
  return (
    <section className="statement section-pad">
      <div className="statement-inner">
        <TextEffect
          per="word"
          as="h3"
          preset="blur"
          viewport={{ once: false, amount: 0.2 }}
          className="statement-quote-text"
        >
          {personalInfo.statement}
        </TextEffect>
      </div>
    </section>
  );
}

