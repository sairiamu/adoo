import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const IconButton: React.FC<IconButtonProps> = ({
  children,
  active = false,
  className = "",
  style,
  ...props
}) => {
  const defaultStyle: React.CSSProperties = {
    backgroundColor: "var(--clay-raised-bg)",
    boxShadow: active ? "var(--clay-pressed)" : "var(--clay-raised)",
    borderRadius: "999px",
    width: "40px",
    height: "40px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "var(--clay-text)",
    border: "none",
    cursor: "pointer",
    transition: "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
    ...style,
  };

  return (
    <button
      style={defaultStyle}
      className={`clay-focus hover:-translate-y-0.5 active:scale-[0.97] active:shadow-[var(--clay-pressed)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
