import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

export const Select: React.FC<SelectProps> = ({ label, children, className = "", style, ...props }) => {
  const selectStyle: React.CSSProperties = {
    backgroundColor: "var(--clay-raised-bg)",
    boxShadow: "var(--clay-raised)",
    borderRadius: "12px",
    padding: "10px 16px",
    fontSize: "16px",
    color: "var(--clay-text)",
    border: "none",
    outline: "none",
    width: "100%",
    minHeight: "36px",
    cursor: "pointer",
    ...style,
  };

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && <label className="text-sm font-bold text-[var(--clay-muted)]">{label}</label>}
      <select style={selectStyle} className={`clay-focus ${className}`} {...props}>
        {children}
      </select>
    </div>
  );
};
