import { testimonials } from "../data/portfolioData";

export function Testimonials() {
  return (
    <section id="testimonials" className="testimonials section-pad">
      <div className="section-label">/TESTIMONIALS</div>

      <div className="testimonial-window">
        <div className="testimonial-track">
          {testimonials.map((item) => (
            <article className="testimonial" key={item.name} data-cursor-hover>
              <p className="testimonial-quote">“{item.quote}”</p>
              
              <div className="testimonial-author">
                {item.avatar && (
                  <img 
                    src={item.avatar} 
                    alt={item.name} 
                    className="testimonial-avatar"
                    loading="lazy"
                  />
                )}
                <div>
                  <strong className="testimonial-name">{item.name}</strong>
                  <span className="testimonial-role">{item.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
