import React, { useState } from "react";
import { useTheme, Button, IconButton, Panel, Tabs, Input, Slider, Select, useParams, useNavigate } from "../ui";
import { Undo2, Redo2, Download, Sun, Moon, ArrowLeft, Image as ImageIcon, Video, Type, Square, Sliders, Search, Plus, Play } from "../ui/icons";
import { Player } from "@remotion/player";
import { ProjectComp } from "../remotion/ProjectComp";
import { ProjectSchema, Project } from "../schema";
import sampleJson from "../../templates/sample.json";

export const EditorShell: React.FC = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const [project] = useState<Project>(() => {
    if (projectId && projectId !== "sample-project") {
      const saved = localStorage.getItem(`adoo-project-${projectId}`);
      if (saved) {
        try {
          return ProjectSchema.parse(JSON.parse(saved));
        } catch { /* fallback */ }
      }
    }
    return ProjectSchema.parse(sampleJson);
  });

  const [leftTab, setLeftTab] = useState<"Library" | "Layers">("Library");
  const [searchQuery, setSearchQuery] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);

  const leftWidth = 280;
  const rightWidth = 300;
  const bottomHeight = 200;

  const totalFrames = project.scenes.reduce(
    (acc, scene) => acc + scene.durationInFrames,
    0
  );

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col" style={{ backgroundColor: "var(--clay-surface)", color: "var(--clay-text)" }}>
      {/* 1. Top Bar */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-[var(--clay-200)] bg-[var(--clay-raised-bg)] shadow-[var(--clay-flat)] z-10">
        <div className="flex items-center gap-4">
          <IconButton onClick={() => navigate("/")} title="Back to Home">
            <ArrowLeft size={18} />
          </IconButton>
          <input
            type="text"
            defaultValue={project.meta.name}
            className="font-extrabold text-lg bg-transparent border-none outline-none px-2 py-1 rounded hover:bg-[var(--clay-surface)] focus:bg-[var(--clay-surface)] focus:shadow-[var(--clay-pressed)] transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <IconButton title="Undo"><Undo2 size={18} /></IconButton>
          <IconButton title="Redo"><Redo2 size={18} /></IconButton>
          <div className="h-6 w-[1px] bg-[var(--clay-300)] mx-1" />
          <Button variant="flat" onClick={() => alert("Export queued (placeholder)")}>
            <Download size={18} /> Export
          </Button>
          <Button onClick={toggleTheme}>
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
        </div>
      </div>

      {/* 2. Main Workspace Layout with Floating Slabs and Gaps (12-16px) */}
      <div className="flex-1 flex p-4 gap-4 overflow-hidden">

        {/* Left Panel (Library / Layers) */}
        <div style={{ width: `${leftWidth}px` }} className="flex flex-col gap-4">
          <Panel className="flex-1 p-4 overflow-hidden flex flex-col gap-4">
            <Tabs tabs={["Library", "Layers"]} activeTab={leftTab} onChange={(t) => setLeftTab(t as any)} />

            {leftTab === "Library" ? (
              <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3 text-[var(--clay-muted)]" />
                  <Input
                    placeholder="Search assets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: "36px" }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="h-24 rounded-xl bg-[var(--clay-surface)] shadow-[var(--clay-pressed)] flex flex-col items-center justify-center text-xs text-[var(--clay-muted)] gap-1 cursor-pointer hover:text-[var(--clay-text)]">
                    <ImageIcon size={20} />
                    <span>Sample Image</span>
                  </div>
                  <div className="h-24 rounded-xl bg-[var(--clay-surface)] shadow-[var(--clay-pressed)] flex flex-col items-center justify-center text-xs text-[var(--clay-muted)] gap-1 cursor-pointer hover:text-[var(--clay-text)]">
                    <Video size={20} />
                    <span>Sample Video</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-2 flex-1 overflow-y-auto">
                <div className="text-xs font-bold text-[var(--clay-muted)] uppercase tracking-wider mb-1">Scene Elements</div>
                {project.scenes[0]?.elements.map((el, idx) => (
                  <div
                    key={el.id}
                    className="p-3 rounded-xl bg-[var(--clay-surface)] shadow-[var(--clay-flat)] flex items-center justify-between text-sm font-bold cursor-pointer hover:shadow-[var(--clay-raised)] transition-all"
                  >
                    <span className="flex items-center gap-2">
                      {el.type === "text" && <Type size={16} />}
                      {el.type === "shape" && <Square size={16} />}
                      {el.type === "image" && <ImageIcon size={16} />}
                      {el.name || `${el.type} ${idx + 1}`}
                    </span>
                    <span className="text-xs text-[var(--clay-muted)]">{el.durationInFrames}f</span>
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>

        {/* Center Canvas Area + Bottom Timeline */}
        <div className="flex-1 flex flex-col gap-4 overflow-hidden">
          {/* Canvas / Preview Slab */}
          <Panel className="flex-1 flex items-center justify-center relative overflow-hidden bg-[var(--clay-raised-bg)]">
            <div className="absolute top-4 left-4 flex gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[var(--clay-surface)] shadow-[var(--clay-pressed)] text-[var(--clay-muted)]">
                {project.meta.width} x {project.meta.height} px
              </span>
            </div>

            <div className="shadow-2xl rounded-2xl overflow-hidden border border-[var(--clay-300)] bg-black">
              <Player
                component={ProjectComp}
                inputProps={{ project }}
                durationInFrames={Math.max(totalFrames, 1)}
                fps={project.meta.fps}
                compositionWidth={project.meta.width}
                compositionHeight={project.meta.height}
                style={{
                  width: "320px",
                  height: "568px",
                }}
                controls
                autoPlay
                loop
              />
            </div>
          </Panel>

          {/* Bottom Timeline Slab */}
          <Panel style={{ height: `${bottomHeight}px` }} className="p-4 flex flex-col gap-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <IconButton onClick={() => setIsPlaying(!isPlaying)}>
                  <Play size={16} />
                </IconButton>
                <span className="text-sm font-bold">Timeline (30 fps)</span>
              </div>
              <div className="flex gap-2">
                <Button variant="flat" style={{ padding: "4px 10px", fontSize: "12px" }}>
                  <Plus size={14} /> Add Scene
                </Button>
              </div>
            </div>

            {/* Timeline Tracks Header / Ruler */}
            <div className="h-8 rounded-lg bg-[var(--clay-surface)] shadow-[var(--clay-pressed)] px-4 flex items-center text-xs text-[var(--clay-muted)]">
              <span>00:00</span>
              <span className="ml-auto">00:05</span>
            </div>

            {/* Scene Blocks & Elements */}
            <div className="flex-1 flex gap-2 overflow-x-auto overflow-y-hidden p-1">
              {project.scenes.map((scene, sIdx) => (
                <div
                  key={scene.id}
                  className="h-full rounded-xl bg-[var(--clay-surface)] shadow-[var(--clay-flat)] p-3 flex flex-col justify-between min-w-[220px] border-l-4 border-blue-500"
                >
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span>{scene.name || `Scene ${sIdx + 1}`}</span>
                    <span className="text-[var(--clay-muted)]">{scene.durationInFrames} frames</span>
                  </div>
                  <div className="flex gap-1">
                    {scene.elements.map((el) => (
                      <div
                        key={el.id}
                        className="h-8 px-2 rounded-lg bg-[var(--clay-raised-bg)] shadow-[var(--clay-raised)] text-[10px] font-bold flex items-center truncate"
                        title={el.name}
                      >
                        {el.name}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Right Properties Panel */}
        <div style={{ width: `${rightWidth}px` }} className="flex flex-col gap-4">
          <Panel className="flex-1 p-5 overflow-y-auto flex flex-col gap-5">
            <h3 className="text-lg font-extrabold flex items-center gap-2">
              <Sliders size={18} /> Properties
            </h3>

            <div className="flex flex-col gap-4">
              <Input label="Element Name" defaultValue="Main Title" />
              <div className="grid grid-cols-2 gap-3">
                <Input label="X Pos" defaultValue="120" />
                <Input label="Y Pos" defaultValue="250" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input label="Width" defaultValue="840" />
                <Input label="Height" defaultValue="200" />
              </div>
              <Slider label="Opacity" value={100} onChange={() => {}} />
              <Select label="Blend Mode">
                <option>Normal</option>
                <option>Multiply</option>
                <option>Overlay</option>
              </Select>
            </div>
          </Panel>
        </div>

      </div>
    </div>
  );
};
