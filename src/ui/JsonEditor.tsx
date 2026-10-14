import React, { useState } from "react";
import { ProjectSchema, Project, createProjectFromPreset, PROJECT_PRESETS, PresetName } from "../schema";
import { Button } from "./Button";
import { Play, Code, AlertCircle, CheckCircle2, Video } from "./icons";

interface JsonEditorProps {
  currentProject: Project;
  onProjectUpdate: (project: Project) => void;
  onSwitchToPreview: () => void;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  currentProject,
  onProjectUpdate,
  onSwitchToPreview,
}) => {
  const [jsonString, setJsonString] = useState(() => JSON.stringify(currentProject, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleApply = () => {
    try {
      setError(null);
      setSuccessMessage(null);
      const parsedData = JSON.parse(jsonString);
      const validatedProject = ProjectSchema.parse(parsedData);
      onProjectUpdate(validatedProject);
      setSuccessMessage("Project JSON successfully validated and loaded!");
      setTimeout(() => {
        onSwitchToPreview();
      }, 800);
    } catch (err: any) {
      setError(err.message || "Invalid JSON or schema validation failed");
    }
  };

  const handleLoadPreset = (presetName: PresetName) => {
    const newProj = createProjectFromPreset(presetName, `${presetName.toUpperCase()} Project`);
    setJsonString(JSON.stringify(newProj, null, 2));
    setError(null);
    setSuccessMessage(`Loaded ${presetName} preset! Click Apply & Preview.`);
  };

  return (
    <div className="min-h-screen p-8 flex flex-col gap-6" style={{ backgroundColor: "var(--clay-surface)", color: "var(--clay-text)" }}>
      {/* Top Bar */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold flex items-center gap-2">
            <Code size={24} /> Project JSON Editor & Creator
          </h1>
          <p className="text-sm text-[var(--clay-muted)] mt-1">
            Edit project JSON directly or load a preset, validate against Zod schema, and preview instantly.
          </p>
        </div>
        <div className="flex gap-4">
          <Button variant="flat" onClick={onSwitchToPreview}>
            <Video size={18} /> View Preview
          </Button>
          <Button onClick={handleApply}>
            <Play size={18} /> Apply & Preview Video
          </Button>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-3 items-center">
        <span className="text-sm font-bold text-[var(--clay-muted)]">Presets:</span>
        {(Object.keys(PROJECT_PRESETS) as PresetName[]).map((pKey) => (
          <Button key={pKey} variant="flat" style={{ padding: "6px 12px", fontSize: "14px" }} onClick={() => handleLoadPreset(pKey)}>
            {PROJECT_PRESETS[pKey].name} ({PROJECT_PRESETS[pKey].width}x{PROJECT_PRESETS[pKey].height})
          </Button>
        ))}
      </div>

      {/* Feedback Messages */}
      {error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/50 text-red-200 flex items-center gap-3 text-sm">
          <AlertCircle size={20} className="shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}
      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/50 text-emerald-200 flex items-center gap-3 text-sm">
          <CheckCircle2 size={20} className="shrink-0 text-emerald-400" />
          <span>{successMessage}</span>
        </div>
      )}

      {/* Textarea Editor */}
      <div className="flex-1 flex flex-col">
        <textarea
          value={jsonString}
          onChange={(e) => setJsonString(e.target.value)}
          className="w-full h-[600px] font-mono text-sm p-4 rounded-2xl outline-none resize-none"
          style={{
            backgroundColor: "var(--clay-surface)",
            boxShadow: "var(--clay-pressed)",
            color: "var(--clay-text)",
            border: "none",
          }}
          spellCheck={false}
        />
      </div>
    </div>
  );
};
