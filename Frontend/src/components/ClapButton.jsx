import { useState, useRef } from "react";
import { Sparkles } from "lucide-react";

// Medium-style Clap icon SVG with lively palms/fingers
function ClapIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M7 11v6a3 3 0 0 0 3 3h4a6 6 0 0 0 6-6V9a2 2 0 0 0-2-2h-1" />
      <path d="M14 7V4a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7" />
      <path d="M10 7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v6" />
      <path d="M6 10.5a2 2 0 0 0-2-2 2 2 0 0 0-2 2v2a8 8 0 0 0 8 8h1" />
    </svg>
  );
}

export function ClapButton({
  projectId,
  totalClaps = 0,
  userClaps = 0,
  maxClaps = 50,
  onClap,
  variant = "card", // "card" | "modal"
  className = "",
}) {
  const [bursts, setBursts] = useState([]);
  const [isPressing, setIsPressing] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const nextBurstId = useRef(0);
  const tooltipTimeoutRef = useRef(null);

  const handleClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (userClaps >= maxClaps) {
      triggerTooltip();
      return;
    }

    const res = onClap?.(projectId, 1);
    if (!res || !res.success) return;

    // Trigger floating +1 burst particle
    const burstId = nextBurstId.current++;
    const randomAngle = ((burstId % 7) - 3) * 6; // -18deg to +18deg fan
    const randomDistance = 44 + (burstId % 5) * 4; // 44px to 60px upward

    const newBurst = {
      id: burstId,
      count: `+1`,
      angle: randomAngle,
      distance: randomDistance,
    };

    setBursts((prev) => [...prev.slice(-6), newBurst]); // Keep max 7 active particles

    // Remove particle after animation completes
    setTimeout(() => {
      setBursts((prev) => prev.filter((b) => b.id !== burstId));
    }, 850);

    // Trigger scale bounce
    setIsPressing(true);
    setTimeout(() => setIsPressing(false), 200);

    triggerTooltip();
  };

  const triggerTooltip = () => {
    setShowTooltip(true);
    if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 1800);
  };

  const hasClapped = userClaps > 0;
  const isMax = userClaps >= maxClaps;

  // Format large numbers (e.g. 1.2k)
  const formattedTotal =
    totalClaps >= 1000
      ? `${(totalClaps / 1000).toFixed(1)}k`
      : totalClaps.toLocaleString();

  if (variant === "card") {
    return (
      <div className={`clap-btn-wrapper card-variant ${className}`}>
        {/* Floating Particles */}
        <div className="clap-burst-container">
          {bursts.map((burst) => (
            <span
              key={burst.id}
              className="clap-floating-badge"
              style={{
                "--burst-angle": `${burst.angle}deg`,
                "--burst-distance": `${burst.distance}px`,
              }}
            >
              {burst.count}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={handleClick}
          className={`clap-pill-btn ${hasClapped ? "has-clapped" : ""} ${
            isPressing ? "is-pressing" : ""
          } ${isMax ? "is-max" : ""}`}
          title={
            isMax
              ? `Max claps reached (${maxClaps}/${maxClaps})`
              : `Applaud this project (${userClaps}/${maxClaps} by you)`
          }
          aria-label={`Clap for this project. Current total: ${totalClaps}`}
          data-cursor-hover
        >
          <span className="clap-icon-holder">
            <ClapIcon size={14} className="clap-icon-svg" />
          </span>
          <span className="clap-count-text">{formattedTotal}</span>
        </button>
      </div>
    );
  }

  // Modal / Deep-Dive Variant: Rich interactive clap station
  return (
    <div className={`clap-btn-wrapper modal-variant ${className}`}>
      {/* Floating Particles */}
      <div className="clap-burst-container">
        {bursts.map((burst) => (
          <span
            key={burst.id}
            className="clap-floating-badge modal-burst"
            style={{
              "--burst-angle": `${burst.angle}deg`,
              "--burst-distance": `${burst.distance}px`,
            }}
          >
            {burst.count}
          </span>
        ))}
      </div>

      {/* Interactive Tooltip Bubble */}
      {showTooltip && (
        <div className="clap-tooltip-bubble" role="status">
          {isMax ? (
            <span>🎉 Max {maxClaps} claps given! Thanks!</span>
          ) : (
            <span>
              👏 You gave <strong>{userClaps}</strong> {userClaps === 1 ? "clap" : "claps"}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={handleClick}
        className={`clap-modal-btn ${hasClapped ? "has-clapped" : ""} ${
          isPressing ? "is-pressing" : ""
        } ${isMax ? "is-max" : ""}`}
        aria-label={`Applaud project. Total claps: ${totalClaps}`}
        data-cursor-hover
      >
        <div className="clap-modal-icon-wrap">
          <ClapIcon size={20} className="clap-modal-svg" />
          {hasClapped && <Sparkles size={12} className="clap-sparkle-badge" />}
        </div>

        <div className="clap-modal-info">
          <span className="clap-modal-label">
            {hasClapped ? "Applauded" : "Applaud Project"}
          </span>
          <span className="clap-modal-total">
            {formattedTotal} <span className="clap-total-suffix">claps</span>
          </span>
        </div>
      </button>
    </div>
  );
}
