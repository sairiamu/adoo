import React from "react";

interface TabsProps {
  tabs: string[];
  activeTab: string;
  onChange: (tab: string) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onChange }) => {
  const containerStyle: React.CSSProperties = {
    backgroundColor: "var(--clay-surface)",
    boxShadow: "var(--clay-pressed)",
    borderRadius: "999px",
    padding: "4px",
    display: "inline-flex",
    gap: "4px",
  };

  return (
    <div style={containerStyle}>
      {tabs.map((tab) => {
        const isActive = tab === activeTab;
        const tabStyle: React.CSSProperties = {
          backgroundColor: isActive ? "var(--clay-inverse-bg)" : "transparent",
          color: isActive ? "var(--clay-inverse-text)" : "var(--clay-text)",
          boxShadow: isActive ? "var(--clay-pressed)" : "none",
          borderRadius: "999px",
          padding: "8px 16px",
          fontWeight: 700,
          fontSize: "14px",
          border: "none",
          cursor: "pointer",
          transition: "all 0.18s cubic-bezier(0.2, 0.8, 0.2, 1)",
        };

        return (
          <button
            key={tab}
            style={tabStyle}
            onClick={() => onChange(tab)}
            className="clay-focus"
          >
            {tab}
          </button>
        );
      })}
    </div>
  );
};
