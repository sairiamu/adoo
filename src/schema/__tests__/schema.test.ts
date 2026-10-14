import { describe, it, expect } from "vitest";
import {
  ProjectSchema,
  createEmptyProject,
  createProjectFromPreset,
  migrateProject,
  PROJECT_PRESETS,
} from "../index";

describe("Schema & Project Validation", () => {
  it("should validate a good empty project created by createEmptyProject", () => {
    const project = createEmptyProject("reel", 1080, 1920, 30, "Test Reel");
    const result = ProjectSchema.safeParse(project);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.meta.name).toBe("Test Reel");
      expect(result.data.meta.width).toBe(1080);
      expect(result.data.meta.height).toBe(1920);
      expect(result.data.meta.fps).toBe(30);
      expect(result.data.scenes.length).toBe(1);
    }
  });

  it("should validate all presets", () => {
    for (const presetKey of Object.keys(PROJECT_PRESETS) as Array<keyof typeof PROJECT_PRESETS>) {
      const proj = createProjectFromPreset(presetKey, `${presetKey} Project`);
      const result = ProjectSchema.safeParse(proj);
      expect(result.success).toBe(true);
    }
  });

  it("should verify defaults are applied when parsing partial data", () => {
    const partialData = {
      meta: {
        name: "Partial Project",
      },
    };

    const parsed = ProjectSchema.parse(partialData);
    expect(parsed.version).toBe(1);
    expect(parsed.meta.width).toBe(1080);
    expect(parsed.meta.height).toBe(1920);
    expect(parsed.meta.fps).toBe(30);
    expect(parsed.meta.kind).toBe("reel");
    expect(parsed.brand.colors.primary).toBe("#3b82f6");
    expect(parsed.brand.fonts.body).toBe("Inter");
    expect(parsed.audio).toEqual([]);
    expect(parsed.scenes).toEqual([]);
  });

  it("should validate elements of different types (text, image, video, shape, icon, group)", () => {
    const projectData = {
      meta: { name: "Elements Test" },
      scenes: [
        {
          name: "Scene 1",
          durationInFrames: 90,
          elements: [
            {
              type: "text",
              content: "Hello World",
              size: 64,
            },
            {
              type: "image",
              assetId: "asset-123",
              fit: "cover",
            },
            {
              type: "video",
              assetId: "asset-456",
              volume: 0.8,
            },
            {
              type: "shape",
              shapeType: "ellipse",
              fill: "#ff0000",
            },
            {
              type: "icon",
              iconId: "check",
              size: 32,
            },
            {
              type: "group",
              children: [
                {
                  type: "text",
                  content: "Child Text",
                },
              ],
            },
          ],
        },
      ],
    };

    const result = ProjectSchema.safeParse(projectData);
    expect(result.success).toBe(true);
    if (result.success) {
      const elements = result.data.scenes[0].elements;
      expect(elements.length).toBe(6);
      expect(elements[0].type).toBe("text");
      if (elements[0].type === "text") {
        expect(elements[0].content).toBe("Hello World");
        expect(elements[0].size).toBe(64);
        expect(elements[0].color).toBe("{brand.colors.text}"); // default applied
      }
      expect(elements[3].type).toBe("shape");
      if (elements[3].type === "shape") {
        expect(elements[3].shapeType).toBe("ellipse");
      }
      expect(elements[5].type).toBe("group");
      if (elements[5].type === "group") {
        expect(elements[5].children.length).toBe(1);
        expect(elements[5].children[0].type).toBe("text");
      }
    }
  });

  it("should reject a bad project with invalid types or invalid element discriminator", () => {
    const badProject = {
      version: "not-a-number", // should be number
      meta: {
        kind: "invalid-kind", // invalid enum
      },
      scenes: [
        {
          elements: [
            {
              type: "unknown-element-type", // invalid discriminated union type
            },
          ],
        },
      ],
    };

    const result = ProjectSchema.safeParse(badProject);
    expect(result.success).toBe(false);
  });

  it("should handle migration pipeline correctly", () => {
    const oldProject = {
      version: 1,
      meta: { name: "Old Project" },
    };

    const migrated = migrateProject(oldProject);
    expect(migrated.version).toBe(1);
    expect(migrated.meta.name).toBe("Old Project");
  });
});
