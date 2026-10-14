import React, { useState } from "react";
import { useTheme, Button, Panel, Card, Input, Select, useNavigate } from "../ui";
import { Film, Plus, Sun, Moon, Palette, Code, Clock, Trash2 } from "../ui/icons";
import { PROJECT_PRESETS, PresetName, createProjectFromPreset } from "../schema";

export const HomeScreen: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [projectName, setProjectName] = useState("My Video Project");
  const [selectedPreset, setSelectedPreset] = useState<PresetName>("reel");

  const [recentProjects, setRecentProjects] = useState<Array<{ id: string; name: string; updated: string; dimensions: string }>>(() => {
    const saved = localStorage.getItem("adoo-recent-projects");
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      { id: "sample-project", name: "Sample Video Project", updated: "Just now", dimensions: "1080x1920 (Reel)" }
    ];
  });

  const handleCreateProject = () => {
    const preset = PROJECT_PRESETS[selectedPreset];
    const newProj = createProjectFromPreset(selectedPreset, projectName);
    const projectId = `proj-${Date.now()}`;

    localStorage.setItem(`adoo-project-${projectId}`, JSON.stringify(newProj));

    const updated = [
      { id: projectId, name: projectName, updated: "Just now", dimensions: `${preset.width}x${preset.height} (${preset.name})` },
      ...recentProjects
    ];
    setRecentProjects(updated);
    localStorage.setItem("adoo-recent-projects", JSON.stringify(updated));

    navigate(`/editor/${projectId}`);
  };

  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = recentProjects.filter(p => p.id !== id);
    setRecentProjects(updated);
    localStorage.setItem("adoo-recent-projects", JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen p-8 flex flex-col gap-10" style={{ backgroundColor: "var(--clay-surface)", color: "var(--clay-text)" }}>
      {/* Top Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--clay-raised-bg)] shadow-[var(--clay-raised)] flex items-center justify-center font-extrabold text-xl">
            A
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight">Adoo Studio</h1>
            <p className="text-xs text-[var(--clay-muted)]">Claymorphism Video Creator</p>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <Button variant="flat" onClick={() => navigate("/json")}>
            <Code size={18} /> JSON Editor
          </Button>
          <Button variant="flat" onClick={() => navigate("/ui-kit")}>
            <Palette size={18} /> UI Kit
          </Button>
          <Button onClick={toggleTheme}>
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            <span>{theme === "light" ? "Dark" : "Light"}</span>
          </Button>
        </div>
      </div>

      {/* Hero Banner / New Project Action */}
      <Panel className="flex flex-row justify-between items-center p-8 bg-[var(--clay-raised-bg)]">
        <div className="flex flex-col gap-2 max-w-xl">
          <h2 className="text-3xl font-extrabold">Create captivating videos in seconds.</h2>
          <p className="text-sm text-[var(--clay-muted)]">
            Professional multi-scene video editing powered by Remotion, Zod schemas, and tactile clay UI.
          </p>
        </div>
        <Button onClick={() => setIsNewModalOpen(true)} style={{ padding: "14px 28px", fontSize: "18px" }}>
          <Plus size={20} /> New Project
        </Button>
      </Panel>

      {/* Recent Projects Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-extrabold flex items-center gap-2">
          <Film size={20} /> Recent Projects
        </h3>

        {recentProjects.length === 0 ? (
          <Panel className="items-center justify-center py-16 text-center">
            <p className="text-[var(--clay-muted)] font-medium">No projects yet. Click "New Project" above to get started!</p>
          </Panel>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentProjects.map((proj) => (
              <Card
                key={proj.id}
                onClick={() => navigate(proj.id === "sample-project" ? "/editor/sample-project" : `/editor/${proj.id}`)}
                className="flex flex-col justify-between gap-4 p-6 group cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--clay-surface)] shadow-[var(--clay-pressed)] flex items-center justify-center font-bold">
                    <Film size={24} />
                  </div>
                  {proj.id !== "sample-project" && (
                    <button
                      onClick={(e) => handleDeleteProject(proj.id, e)}
                      className="text-[var(--clay-muted)] hover:text-red-500 transition-colors p-1 rounded-lg"
                      title="Delete project"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <h4 className="font-extrabold text-lg group-hover:text-blue-500 transition-colors">{proj.name}</h4>
                  <div className="flex items-center gap-3 text-xs text-[var(--clay-muted)]">
                    <span className="flex items-center gap-1"><Clock size={12} /> {proj.updated}</span>
                    <span>•</span>
                    <span>{proj.dimensions}</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New Project Modal Dialog */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <Panel className="w-full max-w-md shadow-2xl p-8 flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-extrabold">Create New Project</h3>
              <button
                onClick={() => setIsNewModalOpen(false)}
                className="text-[var(--clay-muted)] font-bold hover:text-[var(--clay-text)]"
              >
                ✕
              </button>
            </div>

            <Input
              label="Project Name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />

            <Select
              label="Format Preset"
              value={selectedPreset}
              onChange={(e) => setSelectedPreset(e.target.value as PresetName)}
            >
              <option value="reel">Reel / TikTok (1080 x 1920, 30fps)</option>
              <option value="story">Story (1080 x 1920, 30fps)</option>
              <option value="ad45">Ad 4:5 (1080 x 1350, 30fps)</option>
              <option value="square">Square (1080 x 1080, 30fps)</option>
              <option value="landscape">Landscape (1920 x 1080, 30fps)</option>
              <option value="poster">Poster (1080 x 1620, 30fps)</option>
            </Select>

            <div className="flex justify-end gap-3 mt-4">
              <Button variant="flat" onClick={() => setIsNewModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateProject}>
                Create & Open Editor Layout
              </Button>
            </div>
          </Panel>
        </div>
      )}
    </div>
  );
};
