import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = "", style, ...props }) => {
  const inputStyle: React.CSSProperties = {
    backgroundColor: "var(--clay-surface)",
    boxShadow: "var(--clay-pressed)",
    borderRadius: "12px",
    padding: "10px 16px",
    fontSize: "16px",
    color: "var(--clay-text)",
    border: "none",
    outline: "none",
    width: "100%",
    minHeight: "36px",
    transition: "box-shadow 0.18s ease",
    ...style,
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-bold text-[var(--clay-muted)]">{label}</label>}
      <input
        style={inputStyle}
        className={`clay-focus ${className}`}
        {...props}
      />
    </div>
  );
};
