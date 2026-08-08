# Foreground harbour water band — proof pack (calvins-creature-room)

Captures at 2× camera zoom, stamp `ccf6a53-dirty` (master + this pass) rendered
into each frame. Branch: `visual/creature-room-water-band` (off master — the
presence-pass visuals of PR #13 are not underneath, so melts show the old
line-art here; the water is the subject).

| File | Shows |
|---|---|
| `water_ladder_base.png` | Ladder A's base (~x1250): dark green-black water under the docks, pilings' lower reach submerged, ground-lane actors drawn on top. |
| `water_glide_landing.png` | The glide-landing zone (~x2950): wet band under M1/C1, right edge starting its fade toward the dry Beat 7. |
| `water_dry_intro_edge.png` | The x~1100 seam: dry intro pavement (left) fading into the wet band (right) via the 90px gradient. |
| `water_align_check.png` | `?debug=align` with the band live — 12 walk-row segments, numeric max delta **0.00px** vs physics tops. |

Numbers: band spans x1100–3100 (90px inner alpha fades each end; intro <1100
and Beat 7 >3400 stay dry); waterline at y481 (2px above the pavement line);
wet-quay face overlay y458–481 (static — stone does not ride the swell); swell
±2.5px on the existing `waterShimmers` clock (observed −2.35..+0.5 over a
3.5s sample window); 6 pooled rain rings (deterministic cycles, transforms
only); depths: quay 0.88 / water 0.9 / streaks 0.91 / rings 0.92 — above
pilings (0.75), below planks (1), puddles (1.6+), melts (9), player (20).
Performance (mobile viewport 375×812, worst-case hidden-pane software
rendering, warmed, 400-step averages ×2): 8.71ms/frame without the band,
9.78ms with — **+1.07ms, 6.4% of the 16.7ms budget**. Campaign gate:
`shoreline-run-level-01` has zero band-depth objects and an empty ring pool.
