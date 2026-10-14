# 01 - Architecture

## Overview
Three parts: **Editor (browser)**, **Remotion layer (shared)**, **Server (Node)**.

```
Editor UI  --edits-->  Zustand store (Project JSON)
                           |
                           v
              @remotion/player (live preview)
                           |
         "Export" -> Server render queue -> @remotion/renderer -> file
```

## Editor
- Three main areas: **Canvas** (center), **Timeline** (bottom), **Panels** (left: library/layers, right: properties).
- State lives in one Zustand store holding the `Project` object plus UI state (selection, zoom, playhead).
- Immer patches power undo/redo. Every edit is a patch; history is a stack of patch pairs.
- Autosave to disk (debounced, ~1s) via server API.

## Remotion Layer
- `Root.tsx` registers two compositions: `VideoProject` and `StillProject`.
- `ProjectComp` reads the Project JSON and lays out scenes with `<Sequence>`.
- `calculateMetadata` derives total duration, width, height, fps from JSON.
- Elements: Text, Media (image/video), Shape, Audio, Sticker/Icon, Group.
- Animation presets are pure functions of `(frame, config) -> style`.

## Server
- `POST /render` adds a job (video or still); `GET /render/:id` returns progress.
- Render jobs run one at a time (simple queue) so the UI never blocks.
- `POST /import` stores media, runs ffmpeg for thumbnails, waveform and proxy.
- `GET /library` lists assets; `GET /projects` lists projects.
- Files served from local `library/` and `projects/`.

## Preview Performance
- Imported video gets a low-res **proxy** (e.g. 540p) for editing; the original is used on export.
- Thumbnails and audio waveforms are generated once at import.
- Fonts are preloaded before preview and render to avoid flicker.

## Error Handling
- Zod-validate every project on load; show a repair dialog on failure.
- Missing media shows a placeholder and a "Relink" action.
- Render failures show the log and keep the project untouched.
