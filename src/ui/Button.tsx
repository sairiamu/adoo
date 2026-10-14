import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "raised" | "flat" | "pressed";
  active?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "raised",
  active = false,
  className = "",
  style,
  ...props
}) => {
  let shadowStyle = "var(--clay-raised)";
  if (active || variant === "pressed") {
    shadowStyle = "var(--clay-pressed)";
  } else if (variant === "flat") {
    shadowStyle = "var(--clay-flat)";
  }

  const defaultStyle: React.CSSProperties = {
    backgroundColor: "var(--clay-raised-bg)",
    boxShadow: shadowStyle,
    borderRadius: "18px",
    padding: "10px 20px",
    fontWeight: 700,
    fontSize: "16px",
    color: "var(--clay-text)",
    border: "none",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    transition: "transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
    minHeight: "36px",
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
