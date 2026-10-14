# Data Model Schema (Zod)

This directory (`src/schema/`) contains the complete Zod schema definitions and inferred TypeScript types for the application, strictly adhering to `context/spec/02-data-model.md`.

## Files Implemented

1. **[animation.ts](file:///C:/Users/User/OneDrive/Desktop/adoo/src/schema/animation.ts)**: Animation presets (`Anim`, `AnimPreset`) and keyframes (`Keyframe`, `KeyframeProperty`).
2. **[asset.ts](file:///C:/Users/User/OneDrive/Desktop/adoo/src/schema/asset.ts)**: Library asset schema (`Asset`, `AssetKind`).
3. **[track.ts](file:///C:/Users/User/OneDrive/Desktop/adoo/src/schema/track.ts)**: Audio track schema (`Track`, `TrackKind`).
4. **[elements.ts](file:///C:/Users/User/OneDrive/Desktop/adoo/src/schema/elements.ts)**: Discriminated union of all element types (`text`, `image`, `video`, `shape`, `icon`, `group`) with common fields (`id`, `name`, `x`, `y`, width, height, rotation, opacity, locked, hidden, startFrame, durationInFrames, animations, keyframes) and recursive group support via `z.lazy`.
5. **[scene.ts](file:///C:/Users/User/OneDrive/Desktop/adoo/src/schema/scene.ts)**: Scene schema (`Scene`), background fill (`Fill`), and transition out (`TransitionOut`).
6. **[project.ts](file:///C:/Users/User/OneDrive/Desktop/adoo/src/schema/project.ts)**: Top-level project schema (`Project`), metadata, and brand configuration (`Brand`).
7. **[migrations.ts](file:///C:/Users/User/OneDrive/Desktop/adoo/src/schema/migrations.ts)**: Schema versioning (`CURRENT_SCHEMA_VERSION = 1`), empty migration pipeline ready for future schema upgrades, and `migrateProject()`.
8. **[presets.ts](file:///C:/Users/User/OneDrive/Desktop/adoo/src/schema/presets.ts)**: Presets for **Reel**, **Story**, **Ad 4:5**, **Square**, **Landscape**, and **Poster**, plus the `createEmptyProject(kind, width, height, fps)` helper.
9. **[index.ts](file:///C:/Users/User/OneDrive/Desktop/adoo/src/schema/index.ts)**: Unified entry point exporting all schemas, types, migrations, and presets.
10. **[__tests__/schema.test.ts](file:///C:/Users/User/OneDrive/Desktop/adoo/src/schema/__tests__/schema.test.ts)**: Vitest unit tests verifying valid projects, preset configurations, default value applications, element discriminated unions, error rejections, and migrations.

## Design Decisions & Spec Clarifications

1. **Shape Element Subtype**: The spec specifies `shape: rect | ellipse | line | polygon`. Since `type` is the discriminated union discriminator (`"shape"`), we introduced `shapeType` for the specific shape geometry (`rect | ellipse | line | polygon`).
2. **Asset References**: Brand logo (`logo?: AssetRef`) and element assets reference assets via `assetId`, keeping separation between asset metadata library and scene elements.
3. **Recursive Group Elements**: Group elements can contain nested elements (`children: Element[]`). This is implemented securely in Zod using `z.lazy(() => ElementSchema)`.
4. **Nested Object Defaults**: To ensure Zod populates defaults when parsing partial objects (e.g. `{}`), object schemas with nested fields (`BrandSchema`, `ProjectMetaSchema`) use `.default({...})` at the parent object level as well as field-level `.default(...)`.
