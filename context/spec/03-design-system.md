# 03 - Design System: Claymorphism

## Style Summary
Soft, puffy, tactile UI. Everything looks molded from clay: large radii, gentle double shadows (one light, one dark), subtle inner highlights, and monochrome tones. No harsh borders, no flat dividers, no neon.

## Palette (grayscale ramp `#F3F2F2` -> `#0D0C0C`)
| Token | Hex |
|---|---|
| `--clay-50`  | `#F3F2F2` |
| `--clay-100` | `#E6E5E5` |
| `--clay-200` | `#D3D2D2` |
| `--clay-300` | `#BDBCBC` |
| `--clay-400` | `#A3A2A2` |
| `--clay-500` | `#878686` |
| `--clay-600` | `#6B6A6A` |
| `--clay-700` | `#4F4E4E` |
| `--clay-800` | `#353434` |
| `--clay-900` | `#1E1D1D` |
| `--clay-950` | `#0D0C0C` |

The UI uses **only** this ramp. Color appears only inside the user's canvas content.

## Themes
**Light:** surface `clay-50`, raised `clay-100`, text `clay-950`, muted text `clay-600`.
**Dark:** surface `clay-950`, raised `clay-900`, text `clay-50`, muted text `clay-400`.
Selected/active state = the **inverse** tone (dark pill in light theme, light pill in dark theme), so no accent color is needed.

## Shadow Tokens
```css
:root {
  /* Light theme */
  --clay-raised:
    8px 8px 20px rgba(13,12,12,0.16),
    -6px -6px 16px rgba(255,255,255,0.85),
    inset 2px 2px 4px rgba(255,255,255,0.8),
    inset -3px -3px 6px rgba(13,12,12,0.10);

  --clay-pressed:
    inset 6px 6px 12px rgba(13,12,12,0.18),
    inset -5px -5px 10px rgba(255,255,255,0.8);

  --clay-flat:
    3px 3px 8px rgba(13,12,12,0.12),
    -3px -3px 8px rgba(255,255,255,0.8);
}

[data-theme="dark"] {
  --clay-raised:
    8px 8px 20px rgba(0,0,0,0.65),
    -6px -6px 16px rgba(243,242,242,0.05),
    inset 2px 2px 4px rgba(243,242,242,0.07),
    inset -3px -3px 6px rgba(0,0,0,0.5);

  --clay-pressed:
    inset 6px 6px 12px rgba(0,0,0,0.7),
    inset -5px -5px 10px rgba(243,242,242,0.05);

  --clay-flat:
    3px 3px 8px rgba(0,0,0,0.55),
    -3px -3px 8px rgba(243,242,242,0.04);
}
```

## Shape & Spacing
- Radius: `sm 12px`, `md 18px`, `lg 28px`, `pill 999px`. Panels use `lg`.
- Spacing scale: 4, 8, 12, 16, 24, 32.
- Panels float as separate clay slabs with 12-16px gaps between them (no hard edges).
- Minimum hit target 36px.

## Typography
- UI font: a rounded sans (e.g. **Nunito** or **Quicksand**).
- Weights: 500 body, 700 labels, 800 headings.
- Sizes: 12 (meta), 14 (body), 16 (controls), 20 (panel titles), 28 (page titles).

## Component Rules
| Component | Rest | Hover | Active/Selected |
|---|---|---|---|
| Button | `raised` | lift: slightly stronger shadow, `translateY(-1px)` | `pressed` |
| Toggle / Chip | `flat` | `raised` | inverse tone + `pressed` |
| Input / Slider track | `pressed` (inset) | stays inset | inset + soft inverse ring |
| Panel / Card | `raised` | none | none |
| Timeline clip | `flat`, rounded `md` | `raised` | inverse tone |
| Tooltip | `raised`, inverse tone | | |

## Motion (editor UI only)
- 150-220ms, `cubic-bezier(.2,.8,.2,1)`.
- Press = scale `0.97` + switch to `pressed` shadow.
- Respect `prefers-reduced-motion`.

## Canvas Area
- Canvas workspace background is a slightly darker/lighter tone than the panels so the artboard reads as a clay tray holding the design.
- The artboard itself shows exact output pixels; no clay effects applied to it.

## Accessibility
- Keep text/background contrast at WCAG AA or better. Do not use `clay-400` text on `clay-100` surfaces.
- Focus ring: 2px inverse-tone outline with a 3px offset.
- Don't rely on shadow alone to show state; pair it with tone or icon changes.
