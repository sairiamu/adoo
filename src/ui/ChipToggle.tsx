import React from "react";

interface ChipToggleProps {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

export const ChipToggle: React.FC<ChipToggleProps> = ({
  label,
  selected = false,
  onClick,
  className = "",
}) => {
  const style: React.CSSProperties = {
    backgroundColor: selected ? "var(--clay-inverse-bg)" : "var(--clay-raised-bg)",
    color: selected ? "var(--clay-inverse-text)" : "var(--clay-text)",
    boxShadow: selected ? "var(--clay-pressed)" : "var(--clay-flat)",
    borderRadius: "999px",
    padding: "8px 16px",
    fontWeight: 700,
    fontSize: "14px",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    transition: "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.18s ease",
  };

  return (
    <button
      style={style}
      onClick={onClick}
      className={`clay-focus hover:shadow-[var(--clay-raised)] active:scale-[0.97] ${className}`}
    >
      {label}
    </button>
  );
};
