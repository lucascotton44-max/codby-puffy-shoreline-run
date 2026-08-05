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
