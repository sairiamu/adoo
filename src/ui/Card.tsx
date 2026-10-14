import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, className = "", style, onClick }) => {
  const cardStyle: React.CSSProperties = {
    backgroundColor: "var(--clay-raised-bg)",
    boxShadow: "var(--clay-raised)",
    borderRadius: "18px", // md radius
    padding: "18px",
    cursor: onClick ? "pointer" : "default",
    transition: "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
    ...style,
  };

  return (
    <div
      style={cardStyle}
      onClick={onClick}
      className={`clay-focus ${onClick ? "hover:-translate-y-0.5 hover:shadow-[var(--clay-raised-hover)]" : ""} ${className}`}
    >
      {children}
    </div>
  );
};
