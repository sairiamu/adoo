# Adoo

> A personal, manual design studio for making reels, ads, posters, animations and videos.

## Vision
Adoo is a local-first creative tool where I design everything by hand: layers on a canvas, scenes on a timeline, my own imported media, exported to real files. It should feel as tactile and soft as clay, and be fast enough that I actually enjoy using it daily.

## Scope (v1)
- Personal use only, single user, runs locally.
- **Manual design only.** No AI, no automation, no auto-generation.
- Formats: reels (9:16), ads (9:16 / 1:1 / 16:9 / 4:5), posters (static), short animations.
- Import and export of video, images, audio, fonts and whole projects.

## Non-Goals (for now)
- AI script/scene/caption/voice generation
- xyflow pipelines, batch rendering, scheduling
- Accounts, cloud sync, collaboration, multi-user
- Cloud rendering (Remotion Lambda)
- Mobile app

These are not dead, only deferred. The architecture must not block them (see "Core Principle").

## Core Principle
**Every project is a JSON document.** The editor only edits the JSON. Remotion only reads the JSON. Preview, render, save, undo/redo, templates and any future AI or automation all work on that same document.

```
Project JSON -> Remotion composition -> Player (live preview) / Renderer (MP4, PNG...)
```

## Tech Stack
| Layer | Choice |
|---|---|
| Language | TypeScript |
| UI | React + Vite |
| Video engine | Remotion (`@remotion/player`, `@remotion/renderer`, `renderStill`) |
| State | Zustand + Immer (undo/redo via patches) |
| Validation | Zod (single source of truth for types) |
| Canvas interaction | Moveable + Selecto (drag, resize, rotate, multi-select) |
| Styling | CSS variables + Tailwind (claymorphism tokens) |
| Storage | Local folder + SQLite (project index, asset metadata) |
| Backend | Small Node server (render queue, file access, ffmpeg) |
| Media tools | ffmpeg (transcode, thumbnails, waveform, proxies) |

Later (not v1): xyflow, @remotion/captions + Whisper, TTS, Lottie/Rive, @remotion/three.

## Licensing Note
Remotion is free for individuals and small teams but requires a paid license for larger companies. Fine for personal use; re-check before any commercial expansion.

## Repo Layout
```
adoo/
├─ context/
│  ├─ project.md
│  └─ spec/
│     ├─ 01-architecture.md
│     ├─ 02-data-model.md
│     ├─ 03-design-system.md
│     ├─ 04-features.md
│     ├─ 05-import-export.md
│     └─ 06-roadmap.md
├─ src/
│  ├─ schema/        # Zod schemas
│  ├─ remotion/      # Root, ProjectComp, scenes, elements, animations, transitions
│  ├─ editor/        # store, panels, canvas, timeline, preview
│  ├─ ui/            # clay component library
│  └─ lib/           # helpers
├─ server/           # render queue, file API, ffmpeg
├─ library/          # user media (images, video, audio, fonts)
├─ projects/         # saved .adoo projects
└─ templates/        # starter JSON projects
```

## Working Rules
1. Schema first: change the Zod schema before changing UI or renderer.
2. Time is stored in **frames**, never seconds.
3. All animation is frame-driven (`useCurrentFrame`, `interpolate`, `spring`). No CSS transitions or timers inside compositions.
4. Colors and fonts in elements may reference brand tokens, e.g. `{brand.primary}`.
5. The UI never calls the renderer directly; it goes through the render queue.
6. Keep editor chrome (clay UI) fully separate from composition output. The clay style never leaks into exports.