import React, { useState } from "react";
import { useTheme } from "./ThemeContext";
import { Button } from "./Button";
import { IconButton } from "./IconButton";
import { ChipToggle } from "./ChipToggle";
import { Input } from "./Input";
import { Slider } from "./Slider";
import { Select } from "./Select";
import { Panel } from "./Panel";
import { Card } from "./Card";
import { Tooltip } from "./Tooltip";
import { Tabs } from "./Tabs";
import { Play, Settings } from "./icons";

export const UIKit: React.FC<{ onBackToEditor?: () => void }> = ({ onBackToEditor }) => {
  const { theme, toggleTheme } = useTheme();
  const [inputValue, setInputValue] = useState("");
  const [sliderValue, setSliderValue] = useState(50);
  const [selectValue, selectSet] = useState("option1");
  const [chipSelected, setChipSelected] = useState(false);
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="min-h-screen p-8 flex flex-col gap-10" style={{ backgroundColor: "var(--clay-surface)", color: "var(--clay-text)" }}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Adoo Claymorphism UI Kit</h1>
          <p className="text-sm text-[var(--clay-muted)] mt-1">
            Current Theme: <span className="font-bold uppercase">{theme}</span> | Using strictly the clay grayscale ramp.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          {onBackToEditor && (
            <Button variant="flat" onClick={onBackToEditor}>
              Back to Video Preview
            </Button>
          )}
          <Button onClick={toggleTheme}>
            Toggle Theme ({theme === "light" ? "Dark" : "Light"})
          </Button>
        </div>
      </div>

      {/* Tabs Showcase */}
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Tabs</h2>
        <Tabs tabs={["Overview", "Components", "Theme & Tokens", "Accessibility"]} activeTab={activeTab} onChange={setActiveTab} />
      </div>

      {/* Grid of Components */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Buttons */}
        <Panel title="Buttons & Actions">
          <div className="flex flex-wrap gap-4 items-center">
            <Button>Raised Button</Button>
            <Button variant="flat">Flat Button</Button>
            <Button variant="pressed">Pressed State</Button>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <IconButton aria-label="Play">
              <Play size={18} />
            </IconButton>
            <IconButton aria-label="Settings" active>
              <Settings size={18} />
            </IconButton>
            <Tooltip content="Tooltip helper text">
              <Button>Hover for Tooltip</Button>
            </Tooltip>
          </div>
        </Panel>

        {/* Chips & Toggles */}
        <Panel title="Chips & Toggles">
          <div className="flex flex-wrap gap-4 items-center">
            <ChipToggle label="Normal Chip" />
            <ChipToggle label="Selected Chip" selected={chipSelected} onClick={() => setChipSelected(!chipSelected)} />
          </div>
        </Panel>

        {/* Form Controls */}
        <Panel title="Form Inputs">
          <Input label="Text Input" placeholder="Type something..." value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
          <Select label="Select Dropdown" value={selectValue} onChange={(e) => selectSet(e.target.value)}>
            <option value="option1">Option One</option>
            <option value="option2">Option Two</option>
            <option value="option3">Option Three</option>
          </Select>
        </Panel>

        {/* Sliders */}
        <Panel title="Sliders & Ranges">
          <Slider label="Opacity / Volume" value={sliderValue} onChange={setSliderValue} />
        </Panel>

        {/* Cards */}
        <Panel title="Cards">
          <div className="flex flex-col gap-4">
            <Card>
              <h4 className="font-extrabold text-base">Interactive Card</h4>
              <p className="text-sm text-[var(--clay-muted)] mt-1">Hover over this card to experience the raised clay lift shadow effect.</p>
            </Card>
            <Card onClick={() => alert("Card clicked!")}>
              <h4 className="font-extrabold text-base">Clickable Card</h4>
              <p className="text-sm text-[var(--clay-muted)] mt-1">Click me to trigger an action.</p>
            </Card>
          </div>
        </Panel>

        {/* Color Ramp Inspection */}
        <Panel title="Clay Ramp Palette">
          <div className="grid grid-cols-2 gap-2 text-xs font-mono font-bold">
            <div className="p-2 rounded bg-[var(--clay-50)] text-[var(--clay-950)]">50: #F3F2F2</div>
            <div className="p-2 rounded bg-[var(--clay-100)] text-[var(--clay-950)]">100: #E6E5E5</div>
            <div className="p-2 rounded bg-[var(--clay-200)] text-[var(--clay-950)]">200: #D3D2D2</div>
            <div className="p-2 rounded bg-[var(--clay-300)] text-[var(--clay-950)]">300: #BDBCBC</div>
            <div className="p-2 rounded bg-[var(--clay-400)] text-[var(--clay-950)]">400: #A3A2A2</div>
            <div className="p-2 rounded bg-[var(--clay-500)] text-white">500: #878686</div>
            <div className="p-2 rounded bg-[var(--clay-600)] text-white">600: #6B6A6A</div>
            <div className="p-2 rounded bg-[var(--clay-700)] text-white">700: #4F4E4E</div>
            <div className="p-2 rounded bg-[var(--clay-800)] text-white">800: #353434</div>
            <div className="p-2 rounded bg-[var(--clay-900)] text-white">900: #1E1D1D</div>
            <div className="p-2 rounded bg-[var(--clay-950)] text-white col-span-2">950: #0D0C0C</div>
          </div>
        </Panel>

      </div>
    </div>
  );
};
