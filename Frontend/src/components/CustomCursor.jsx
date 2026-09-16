import { useEffect, useState, useRef } from "react";

export function CustomCursor() {
    const cursorRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [cursorText, setCursorText] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        // Only enable on desktop pointer devices
        const checkEnabled = () => {
        const isTouch =
            window.matchMedia("(pointer: coarse)").matches ||
            window.matchMedia("(hover: none)").matches ||
            window.innerWidth < 992;
        setIsEnabled(!isTouch);
        };

        checkEnabled();
        window.addEventListener("resize", checkEnabled);

        return () => {
        window.removeEventListener("resize", checkEnabled);
        };
    }, []);

    useEffect(() => {
        if (!isEnabled) return;

        const cursor = cursorRef.current;
        if (!cursor) return;

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;
        let rafId;

        const onMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) setIsVisible(true);

        const target = e.target.closest("[data-cursor-hover], [data-cursor-text], a, button");
        if (target) {
            setIsHovered(true);
            const text = target.getAttribute("data-cursor-text");
            setCursorText(text || "");
        } else {
            setIsHovered(false);
            setCursorText("");
        }
        };

        const onMouseLeave = () => {
        setIsVisible(false);
        };

        const loop = () => {
        cursorX += (mouseX - cursorX) * 0.18;
        cursorY += (mouseY - cursorY) * 0.18;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        rafId = requestAnimationFrame(loop);
        };

        window.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseleave", onMouseLeave);
        rafId = requestAnimationFrame(loop);

        return () => {
        window.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseleave", onMouseLeave);
        cancelAnimationFrame(rafId);
        };
    }, [isEnabled, isVisible]);

    if (!isEnabled) return null;

    return (
        <div
        ref={cursorRef}
        className={`custom-cursor ${isHovered ? "is-hovered" : ""} ${
            cursorText ? "has-text" : ""
        } ${isVisible ? "is-visible" : ""}`}
        style={{ pointerEvents: "none", userSelect: "none" }}
        >
        {cursorText && (
            <span className="cursor-label" style={{ pointerEvents: "none" }}>
            {cursorText}
            </span>
        )}
        </div>
    );
}
