# 06 - Roadmap

## Phase 1: Foundation
- [ ] Vite + React + TS + Remotion setup
- [ ] Zod schema + sample project JSON rendering in Remotion
- [ ] Clay UI kit (tokens, button, input, slider, panel, chip, tooltip)
- [ ] App shell: canvas, left panel, right panel, timeline placeholders
- [ ] `@remotion/player` preview wired to the Zustand store

## Phase 2: Canvas editing
- [ ] Text, shape, image, video elements
- [ ] Selection, drag, resize, rotate (Moveable/Selecto), snapping
- [ ] Layers panel + properties panel
- [ ] Undo/redo with Immer patches
- [ ] Autosave + project list

## Phase 3: Media & library
- [ ] Import pipeline (ffmpeg thumbnails, proxies, waveforms)
- [ ] Library panel, fonts loader
- [ ] Audio tracks with waveform, trim, fades

## Phase 4: Timeline & animation
- [ ] Scene timeline, clip move/trim/split
- [ ] Animation presets (in/out/loop)
- [ ] Keyframes + easing
- [ ] Scene transitions
- [ ] Manual captions

## Phase 5: Export
- [ ] Render server + queue
- [ ] MP4/WebM/GIF/PNG/JPG export, export dialog, progress
- [ ] `.adoo` project import/export

## Phase 6: Polish
- [ ] Brand kit + token binding
- [ ] Templates (save/load, 2 starters)
- [ ] Shortcuts, safe-area overlays, theme switch
- [ ] Performance pass (proxy playback, lazy thumbnails)

## Future
AI generation, auto captions, TTS, xyflow pipelines, batch/variants, stock APIs, cloud render.

## Definition of Done (v1)
I can import my own clips, images and music, design a 9:16 reel and a 4:5 ad by hand, preview smoothly, export MP4/PNG, and reopen the project later with everything intact.
