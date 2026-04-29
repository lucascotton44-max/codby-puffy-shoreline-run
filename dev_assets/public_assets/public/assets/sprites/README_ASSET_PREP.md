# ACU Game Asset Prep - Prototype v1

Generated transparent prototypes from baked-checkerboard AI sprite sheets.

## Included

- `codby_sprite_sheet_v1_transparent.png` — full Cod B'y sheet with alpha transparency
- `puffy_sprite_sheet_v1_transparent.png` — full Puffy sheet with alpha transparency
- `codby/codby_atlas_v1.png` — packed fixed-cell prototype atlas
- `codby/codby_atlas_v1.json` — frame metadata
- `codby/frames/*.png` — individual fixed-cell frames
- `puffy/puffy_atlas_v1.png` — packed fixed-cell prototype atlas
- `puffy/puffy_atlas_v1.json` — frame metadata
- `puffy/frames/*.png` — individual fixed-cell frames

## Frame sizes

- Cod B'y atlas: 256 x 320 per frame
- Puffy atlas: 288 x 240 per frame

## Important limitations

These are prototype-cleaned assets. Inspect in-engine before trusting them as final.
The original AI sheets had baked checkerboards, so edge cleanup may not be perfect.
The hurt/recoil water droplets were mostly removed during individual-frame extraction; treat effects as separate FX later.

## Recommended project placement

```text
public/assets/sprites/codby/codby_atlas_v1.png
public/assets/sprites/codby/codby_atlas_v1.json
public/assets/sprites/puffy/puffy_atlas_v1.png
public/assets/sprites/puffy/puffy_atlas_v1.json
```

Keep the original sheets in:

```text
public/assets/sprites/raw/
```
