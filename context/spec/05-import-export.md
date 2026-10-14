# 05 - Import / Export

## Import
| Type | Formats | Processing on import |
|---|---|---|
| Video | MP4, MOV, WebM, MKV | probe metadata, thumbnail, 540p proxy, audio waveform |
| Image | PNG, JPG, WebP, GIF, SVG, AVIF | thumbnail, dimensions |
| Audio | MP3, WAV, M4A, AAC, OGG | duration, waveform |
| Fonts | TTF, OTF, WOFF, WOFF2 | register with `FontFace`, list in font picker |
| Project | `.adoo` | validate, migrate, unpack media into library |

Methods: drag-and-drop onto the library or canvas, file picker, paste image from clipboard.
Files are copied into `library/` (originals kept untouched); the project stores only `assetId`.

## Export
| Output | Formats | Notes |
|---|---|---|
| Video | MP4 (H.264), WebM | CRF/quality presets: Draft, Standard, High |
| Still | PNG, JPG, WebP | 1x / 2x scale, transparent PNG option |
| Animation | GIF | short clips only, size warning |
| Audio only | MP3, WAV | mixed project audio |
| Frame | PNG | current playhead frame |
| Project | `.adoo` | zip: `project.json` + all referenced media + fonts |

Export dialog: range (full / current scene / selection), resolution, fps, quality, filename. Progress bar with cancel, then "Reveal in folder".

## `.adoo` Package Layout
```
mything.adoo (zip)
├─ project.json
├─ assets/        # referenced media only
├─ fonts/
└─ manifest.json  # schema version, app version, asset index
```

## Rules
- Never modify originals.
- Warn when a project references missing assets and offer relink.
- Export uses original media, not proxies.
- Preset targets: Instagram Reel, YouTube Short, TikTok, Instagram Post, Story (size + safe zones).
