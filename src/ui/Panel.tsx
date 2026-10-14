import React from "react";

interface PanelProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

export const Panel: React.FC<PanelProps> = ({ children, title, className = "", style }) => {
  const panelStyle: React.CSSProperties = {
    backgroundColor: "var(--clay-raised-bg)",
    boxShadow: "var(--clay-raised)",
    borderRadius: "28px", // lg radius per spec for panels
    padding: "24px",
    ...style,
  };

  return (
    <div style={panelStyle} className={`flex flex-col gap-4 ${className}`}>
      {title && <h3 className="text-xl font-extrabold">{title}</h3>}
      {children}
    </div>
  );
};
