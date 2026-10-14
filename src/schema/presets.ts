import { Project, ProjectKind, ProjectSchema } from "./project";

export type PresetName = "reel" | "story" | "ad45" | "square" | "landscape" | "poster";

export interface PresetConfig {
  name: string;
  kind: ProjectKind;
  width: number;
  height: number;
  fps: number;
}

export const PROJECT_PRESETS: Record<PresetName, PresetConfig> = {
  reel: { name: "Reel", kind: "reel", width: 1080, height: 1920, fps: 30 },
  story: { name: "Story", kind: "reel", width: 1080, height: 1920, fps: 30 },
  ad45: { name: "Ad 4:5", kind: "ad", width: 1080, height: 1350, fps: 30 },
  square: { name: "Square", kind: "ad", width: 1080, height: 1080, fps: 30 },
  landscape: { name: "Landscape", kind: "ad", width: 1920, height: 1080, fps: 30 },
  poster: { name: "Poster", kind: "poster", width: 1080, height: 1620, fps: 30 },
};

export function createEmptyProject(
  kind: ProjectKind = "reel",
  width: number = 1080,
  height: number = 1920,
  fps: number = 30,
  projectName: string = "Untitled Project"
): Project {
  return ProjectSchema.parse({
    version: 1,
    meta: {
      name: projectName,
      kind,
      width,
      height,
      fps,
    },
    scenes: [
      {
        name: "Scene 1",
        durationInFrames: fps * 5,
        elements: [],
      },
    ],
  });
}

export function createProjectFromPreset(
  presetName: PresetName,
  projectName: string = "Untitled Project"
): Project {
  const preset = PROJECT_PRESETS[presetName] || PROJECT_PRESETS.reel;
  return createEmptyProject(preset.kind, preset.width, preset.height, preset.fps, projectName);
}
