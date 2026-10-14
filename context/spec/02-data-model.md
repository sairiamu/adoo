# 02 - Data Model

Source of truth: `src/schema/*.ts` (Zod). Types are inferred from it.

## Project
```ts
Project {
  version: number              // schema version, for migrations
  meta: {
    name: string
    kind: "reel" | "ad" | "poster" | "animation"
    width: number              // px, default 1080
    height: number             // px, default 1920
    fps: number                // default 30
    createdAt: string
    updatedAt: string
  }
  brand: {
    colors: Record<string, string>   // primary, accent, bg, text...
    fonts: { heading: string; body: string }
    logo?: AssetRef
  }
  audio: Track[]               // music, voiceover, sfx (manual imports)
  scenes: Scene[]
}
```

## Scene
```ts
Scene {
  id: string
  name: string
  durationInFrames: number
  background: Fill             // solid | gradient | media
  elements: Element[]          // z-order = array order
  transitionOut: { type: "none"|"fade"|"slide"|"zoom"|"wipe"; duration: number }
}
```

## Element (discriminated by `type`)
Common fields on every element:
```ts
{ id, name, type, x, y, width, height, rotation, opacity,
  locked, hidden, startFrame, durationInFrames,   // relative to scene
  animations: { in?: Anim; out?: Anim; loop?: Anim },
  keyframes?: Keyframe[] }
```
Types:
- `text`: content, font, size, weight, color, align, lineHeight, letterSpacing, stroke, shadow, background box
- `image`: assetId, fit, crop, filters (brightness, contrast, blur, grayscale), kenBurns
- `video`: assetId, fit, trimStart, trimEnd, volume, playbackRate, filters
- `shape`: rect | ellipse | line | polygon, fill, stroke, radius
- `icon`: built-in icon id, color, size
- `group`: children[]

## Track (audio)
```ts
Track { id, assetId, startFrame, trimStart, trimEnd, volume, fadeIn, fadeOut, kind: "music"|"voice"|"sfx" }
```

## Animation / Keyframe
```ts
Anim { preset: "fadeUp"|"pop"|"slideLeft"|"slideRight"|"typewriter"|"zoom"|"blurIn"|"none",
       delay: number, duration: number, easing: string }
Keyframe { frame: number, property: "x"|"y"|"scale"|"rotation"|"opacity", value: number, easing: string }
```

## Asset (library item)
```ts
Asset { id, kind: "image"|"video"|"audio"|"font", name, path, mime,
        size, width?, height?, durationSec?, thumbnail?, proxy?, waveform? }
```

## Rules
- Frames only. Convert to seconds in UI only.
- Elements reference assets by `assetId`, never by raw path.
- Brand tokens are resolved at render time: `"{brand.primary}"`.
- Any schema change bumps `version` and adds a migration function.
