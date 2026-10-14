import {
  ProjectSchema,
  createEmptyProject,
  createProjectFromPreset,
  migrateProject,
  PROJECT_PRESETS,
} from "./index";

function runTests() {
  console.log("Running schema validation tests...");

  // 1. Good empty project
  const project = createEmptyProject("reel", 1080, 1920, 30, "Test Reel");
  const result1 = ProjectSchema.safeParse(project);
  if (!result1.success) {
    throw new Error(`Test 1 failed: ${JSON.stringify(result1.error.format())}`);
  }
  console.log("✓ createEmptyProject valid");

  // 2. Presets
  for (const presetKey of Object.keys(PROJECT_PRESETS) as Array<keyof typeof PROJECT_PRESETS>) {
    const proj = createProjectFromPreset(presetKey, `${presetKey} Project`);
    const res = ProjectSchema.safeParse(proj);
    if (!res.success) {
      throw new Error(`Preset ${presetKey} failed: ${JSON.stringify(res.error.format())}`);
    }
  }
  console.log("✓ All presets valid");

  // 3. Defaults applied on partial data
  const partialData = {
    meta: {
      name: "Partial Project",
    },
  };
  const parsed = ProjectSchema.parse(partialData);
  if (
    parsed.version !== 1 ||
    parsed.meta.width !== 1080 ||
    parsed.meta.height !== 1920 ||
    parsed.meta.fps !== 30 ||
    parsed.meta.kind !== "reel" ||
    parsed.brand.colors.primary !== "#3b82f6" ||
    parsed.brand.fonts.body !== "Inter" ||
    parsed.audio.length !== 0 ||
    parsed.scenes.length !== 0
  ) {
    throw new Error("Test 3 failed: Defaults were not correctly applied");
  }
  console.log("✓ Defaults applied correctly");

  // 4. Elements validation (text, image, video, shape, icon, group)
  const projectData = {
    meta: { name: "Elements Test" },
    scenes: [
      {
        name: "Scene 1",
        durationInFrames: 90,
        elements: [
          { type: "text", content: "Hello World", size: 64 },
          { type: "image", assetId: "asset-123", fit: "cover" },
          { type: "video", assetId: "asset-456", volume: 0.8 },
          { type: "shape", shapeType: "ellipse", fill: "#ff0000" },
          { type: "icon", iconId: "check", size: 32 },
          {
            type: "group",
            children: [{ type: "text", content: "Child Text" }],
          },
        ],
      },
    ],
  };
  const resElements = ProjectSchema.safeParse(projectData);
  if (!resElements.success) {
    throw new Error(`Elements test failed: ${JSON.stringify(resElements.error.format())}`);
  }
  console.log("✓ All element types (text, image, video, shape, icon, group) valid");

  // 5. Reject bad project
  const badProject = {
    version: "not-a-number",
    meta: { kind: "invalid-kind" },
    scenes: [
      {
        elements: [{ type: "unknown-element-type" }],
      },
    ],
  };
  const resBad = ProjectSchema.safeParse(badProject);
  if (resBad.success) {
    throw new Error("Test 5 failed: Bad project was incorrectly accepted");
  }
  console.log("✓ Bad project rejected successfully");

  // 6. Migration pipeline
  const oldProject = { version: 1, meta: { name: "Old Project" } };
  const migrated = migrateProject(oldProject);
  if (migrated.version !== 1 || migrated.meta.name !== "Old Project") {
    throw new Error("Test 6 failed: Migration pipeline failed");
  }
  console.log("✓ Migration pipeline works");

  console.log("All schema tests passed successfully! 🎉");
}

runTests();
