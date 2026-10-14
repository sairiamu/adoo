import React, { useState } from "react";

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [show, setShow] = useState(false);

  const tooltipStyle: React.CSSProperties = {
    backgroundColor: "var(--clay-inverse-bg)",
    color: "var(--clay-inverse-text)",
    boxShadow: "var(--clay-raised)",
    borderRadius: "12px",
    padding: "6px 12px",
    fontSize: "12px",
    fontWeight: 700,
    position: "absolute",
    bottom: "100%",
    left: "50%",
    transform: "translateX(-50%) translateY(-6px)",
    whiteSpace: "nowrap",
    zIndex: 50,
    pointerEvents: "none",
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && <div style={tooltipStyle}>{content}</div>}
    </div>
  );
};
