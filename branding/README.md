# Lucas & Liam Legacy Studios — Master Identity

Final studio identity, refined from Logo Concept #4. Wordmark-first, editorial,
Atlantic-rooted, sponsor-safe. All artwork is vector-clean SVG (type converted
to outlines — no font dependencies) with production PNG exports.

## Palette

| Role | Hex |
|---|---|
| Deep Atlantic navy (primary ink) | `#132C40` |
| Warm off-white (light field) | `#F6F0E4` |
| Muted brass / weathered gold (accent) | `#A98A50` |

One-colour black (`#000000`) and one-colour white (`#FFFFFF`) versions are
provided and are the only versions to use when full colour cannot be
reproduced.

## Typography

- **LUCAS & LIAM** — EB Garamond SemiBold, all caps, +0.055 em tracking
- **LEGACY STUDIOS** — Inter Medium, all caps, +0.335 em tracking,
  width-matched to 66% of the wordmark
- Descriptor (optional) — Inter Medium, +0.30 em tracking:
  “ATLANTIC CINEMATIC STORYTELLING”

Both typefaces are SIL Open Font License (Google Fonts). The shipped SVGs do
not require the fonts to be installed.

## The mark

The monogram is two custom “L” forms set as opposing frame corners — the two
L’s of the studio name and a quiet cinematic framing cue — holding a thin
brass tide line with a single break of light. No stock iconography.
The brass rule inside the wordmark lockups is the same tide line.

## File guide (`svg/` masters, `png/` production exports)

| Use | File |
|---|---|
| Primary horizontal (full colour, transparent) | `ll_legacy_primary_horizontal.svg` |
| Stacked (full colour, transparent) — the master Concept #4 lockup | `ll_legacy_stacked.svg` |
| Stacked with descriptor | `ll_legacy_stacked_descriptor.svg` |
| Monogram / icon (also favicon & avatar source) | `ll_legacy_monogram.svg` |
| Presentation on off-white / navy fields | `ll_legacy_stacked_on_offwhite.svg`, `ll_legacy_stacked_on_navy.svg`, `ll_legacy_primary_horizontal_on_navy.svg`, `ll_legacy_monogram_on_navy.svg` |
| One-colour black | `*_black.svg` |
| One-colour white | `*_white.svg` |
| Sponsor-safe small-size (holds at ~24 px tall) | `ll_legacy_smallsize.svg` |
| Watermark-ready (white @ 40% opacity) | `ll_legacy_watermark.svg` |

All SVGs without a named background are transparent.

## Classic master (Concept #4 as posted)

`classic/` holds the faithful vector rebuild of the original Concept #4
render — Cormorant Garamond serif, Montserrat sans, tapered gold rule,
cream field, colours sampled from the source (`#23384A` / `#F9F2E1` /
`#B4824D` / `#C9A254`). Use it when you want the exact posted look.

Formats in `classic/png/` (SVG masters in `classic/svg/`): square 2000 &
1080, portrait 4:5 (1080×1350), landscape 16:9 (1920×1080), banner
(2560×852), story 9:16 (1080×1920), tight-crop transparent and on-cream,
white sponsor tile, one-colour black, one-colour white, on-navy, and a
40%-white watermark. Regenerate with `tools/classic_logo.py`.

The refined system above remains the durable identity for small sizes and
one-colour reproduction; the classic master is the display version.

## Sponsor tiles (event templates)

For event graphics that layer sponsor logos onto a white tile (e.g. Harbour
Wars thank-you posts), send `png/ll_legacy_sponsor_tile_fit_white.png` —
pure-white background (their tiles are pure white; the off-white field would
show a seam), sponsor-safe cut, logo sized to fill. `_5x4_` and `_square_`
versions cover templates that need a fixed tile shape, and
`_5x4_transparent` covers tools that composite onto their own tile.
`sponsor_tile_mock.png` shows all three layered in a template-style tile.

## Usage rules

- Clear space: keep a margin of at least the cap height of “LEGACY STUDIOS”
  on all sides (already baked into each file’s padding).
- Minimum sizes: stacked ≥ 90 px wide, horizontal ≥ 160 px wide; below that,
  use `ll_legacy_smallsize` or the monogram.
- On photography or footage, use the white version or the watermark file.
- Do not recolour, stretch, add effects, gradients, or shadows, or re-set the
  type in substitute fonts.

## Reproducing / editing

`tools/gen_logo.py` regenerates every SVG from scratch
(`pip install fonttools uharfbuzz`, plus EB Garamond SemiBold and Inter
Medium/SemiBold TTFs from Google Fonts in a `fonts/` directory next to the
script; output directory via `LOGO_OUT`).
