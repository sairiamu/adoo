import React from "react";

interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
  label?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  label,
}) => {
  const percentage = ((value - min) / (max - min)) * 100;

  const trackStyle: React.CSSProperties = {
    backgroundColor: "var(--clay-surface)",
    boxShadow: "var(--clay-pressed)",
    borderRadius: "999px",
    height: "12px",
    position: "relative",
    width: "100%",
    cursor: "pointer",
  };

  const fillStyle: React.CSSProperties = {
    backgroundColor: "var(--clay-text)",
    borderRadius: "999px",
    height: "100%",
    width: `${percentage}%`,
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      {label && (
        <div className="flex justify-between text-sm font-bold text-[var(--clay-muted)]">
          <span>{label}</span>
          <span>{value}</span>
        </div>
      )}
      <div style={trackStyle} className="clay-focus">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div style={fillStyle} />
      </div>
    </div>
  );
};
