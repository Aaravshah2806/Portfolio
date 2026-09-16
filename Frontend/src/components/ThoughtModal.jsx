import { useEffect } from "react";
import { X, Clock, Calendar, BookOpen } from "lucide-react";

export function ThoughtModal({ thought, onClose }) {
    useEffect(() => {
        if (!thought) return;

        const handleKeyDown = (e) => {
        if (e.key === "Escape") onClose();
        };

        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
        };
    }, [thought, onClose]);

    if (!thought) return null;

    return (
        <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
        <div 
            className="modal-content thought-modal-content"
            onClick={(e) => e.stopPropagation()}
        >
            <button 
            className="modal-close-btn" 
            onClick={onClose} 
            aria-label="Close article"
            data-cursor-hover
            >
            <X size={20} />
            </button>

            <div className="modal-scroll-area">
            <div className="modal-header">
                <div className="thought-meta-badges">
                <span className="thought-meta-item">
                    <Calendar size={14} />
                    {thought.date}
                </span>
                {thought.readTime && (
                    <span className="thought-meta-item">
                    <Clock size={14} />
                    {thought.readTime}
                    </span>
                )}
                </div>

                <h2 className="thought-modal-title">{thought.title}</h2>
                {thought.summary && <p className="thought-modal-lead">{thought.summary}</p>}
            </div>

            <div className="thought-modal-body">
                {thought.content ? (
                thought.content.map((paragraph, index) => (
                    <p key={index} className="thought-paragraph">
                    {paragraph}
                    </p>
                ))
                ) : (
                <p>{thought.summary || "Full article coming soon."}</p>
                )}
            </div>
            </div>
        </div>
        </div>
    );
}
