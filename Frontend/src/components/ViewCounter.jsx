import { Eye } from "lucide-react";

export function ViewCounter({
  views = 0,
  variant = "card", // "card" | "modal"
  className = "",
}) {
  const formattedViews =
    views >= 1000 ? `${(views / 1000).toFixed(1)}k` : views.toLocaleString();

  if (variant === "card") {
    return (
      <div
        className={`view-counter-pill ${className}`}
        title={`${views.toLocaleString()} verified case study views`}
      >
        <Eye size={13} className="view-icon" />
        <span className="view-count-number">{formattedViews}</span>
      </div>
    );
  }

  // Modal variant with live indicator dot
  return (
    <div
      className={`view-counter-modal ${className}`}
      title={`${views.toLocaleString()} total views`}
    >
      <span className="live-view-indicator-dot" />
      <Eye size={14} className="view-icon" />
      <span className="view-count-text">
        <strong>{formattedViews}</strong> views
      </span>
    </div>
  );
}
