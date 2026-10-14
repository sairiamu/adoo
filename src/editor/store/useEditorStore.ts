import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { Project, Element, Scene, ProjectSchema } from "../../schema";
import sampleJson from "../../../templates/sample.json";

interface EditorState {
  project: Project;
  selectedElementIds: string[];
  activeSceneId: string;
  playheadFrame: number;
  isPlaying: boolean;
  zoom: number;

  setProject: (project: Project) => void;
  updateElement: (sceneId: string, elementId: string, updates: Partial<Element>) => void;
  addElement: (sceneId: string, element: Element) => void;
  removeElement: (sceneId: string, elementId: string) => void;
  reorderElements: (sceneId: string, newElements: Element[]) => void;
  addScene: (scene?: Scene) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  removeScene: (sceneId: string) => void;
  setPlayhead: (frame: number) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setSelection: (elementIds: string[]) => void;
  setActiveScene: (sceneId: string) => void;
  setZoom: (zoom: number) => void;
  updateBrand: (updates: Partial<Project["brand"]>) => void;
  updateMeta: (updates: Partial<Project["meta"]>) => void;
}

const defaultProject = ProjectSchema.parse(sampleJson);

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    project: defaultProject,
    selectedElementIds: [],
    activeSceneId: defaultProject.scenes[0]?.id || "",
    playheadFrame: 0,
    isPlaying: false,
    zoom: 1,

    setProject: (project) =>
      set((state) => {
        state.project = project;
        if (project.scenes.length > 0 && !project.scenes.some((s) => s.id === state.activeSceneId)) {
          state.activeSceneId = project.scenes[0]?.id || "";
        }
      }),

    updateElement: (sceneId, elementId, updates) =>
      set((state) => {
        const scene = state.project.scenes.find((s) => s.id === sceneId);
        if (scene) {
          const el = scene.elements.find((e) => e.id === elementId);
          if (el) {
            Object.assign(el, updates);
          }
        }
      }),

    addElement: (sceneId, element) =>
      set((state) => {
        const scene = state.project.scenes.find((s) => s.id === sceneId);
        if (scene) {
          scene.elements.push(element);
        }
      }),

    removeElement: (sceneId, elementId) =>
      set((state) => {
        const scene = state.project.scenes.find((s) => s.id === sceneId);
        if (scene) {
          scene.elements = scene.elements.filter((e) => e.id !== elementId);
        }
        state.selectedElementIds = state.selectedElementIds.filter((id) => id !== elementId);
      }),

    reorderElements: (sceneId, newElements) =>
      set((state) => {
        const scene = state.project.scenes.find((s) => s.id === sceneId);
        if (scene) {
          scene.elements = newElements;
        }
      }),

    addScene: (scene) =>
      set((state) => {
        const newScene: Scene = scene || {
          id: `scene-${Date.now()}`,
          name: `Scene ${state.project.scenes.length + 1}`,
          durationInFrames: 90,
          background: { type: "solid", color: "{brand.colors.bg}" },
          elements: [],
          transitionOut: { type: "none", duration: 15 },
        };
        state.project.scenes.push(newScene);
        state.activeSceneId = newScene.id;
      }),

    updateScene: (sceneId, updates) =>
      set((state) => {
        const scene = state.project.scenes.find((s) => s.id === sceneId);
        if (scene) {
          Object.assign(scene, updates);
        }
      }),

    removeScene: (sceneId) =>
      set((state) => {
        if (state.project.scenes.length <= 1) return;
        state.project.scenes = state.project.scenes.filter((s) => s.id !== sceneId);
        if (state.activeSceneId === sceneId) {
          state.activeSceneId = state.project.scenes[0]?.id || "";
        }
      }),

    setPlayhead: (frame) =>
      set((state) => {
        state.playheadFrame = Math.max(0, frame);
      }),

    setIsPlaying: (isPlaying) =>
      set((state) => {
        state.isPlaying = isPlaying;
      }),

    setSelection: (elementIds) =>
      set((state) => {
        state.selectedElementIds = elementIds;
      }),

    setActiveScene: (sceneId) =>
      set((state) => {
        state.activeSceneId = sceneId;
      }),

    setZoom: (zoom) =>
      set((state) => {
        state.zoom = Math.max(0.25, Math.min(4, zoom));
      }),

    updateBrand: (updates) =>
      set((state) => {
        Object.assign(state.project.brand, updates);
      }),

    updateMeta: (updates) =>
      set((state) => {
        Object.assign(state.project.meta, updates);
      }),
  }))
);
