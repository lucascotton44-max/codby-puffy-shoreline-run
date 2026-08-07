# Presence & Choices pass — proof pack (calvins-creature-room)

Captures taken live in the pumped dev build at 2× camera zoom, magenta stamp
label rendered into the canvas at capture time. Acceptance criterion:
**visibility at play speed** (final visual acceptance = Lucas's phone test).

- `BEFORE` frames: stamp `8604fb4` (chain tip, pre-pass). The three
  `before_melt_*` frames were captured minutes before the stamp label was
  added to the canvas overlay and carry no in-frame stamp; their build is the
  same clean `8604fb4` session as the stamped `before_puddle_*` frames.
- `AFTER` frames: stamp `8604fb4-dirty` — the working tree whose content is
  this pass's commit.

| File | Shows |
|---|---|
| `before_melt_*.png` / `after_melt_*.png` | The three melt patrols (ground A, ground B, dock B2). Before: ~11%-opaque line-sketch ghost. After: solid `melt_patrol_v1` cutout, chalk rim, grounded shadow. |
| `before_puddle_*.png` / `after_puddle_*.png` | The three blackSketchPuddles (P3 x1770, P1 x2380, P2 x3020). Before: pale grey oval floating above the pavement line. After: full-alpha ink pool with chalk-white edge, lying ON the pavement, spatter at the tips. |
| `after_pickup_kelp.png` | kelpShield (x1900) tucked under wharf R between the pilings — P3 left, melt B's lane right. |
| `after_pickup_tidelift.png` | tideLift (x2300) in the pressure pocket: melt B left, P1 right, Ladder B above. |
| `after_pickup_spark_spawn.png` | storySpark (x45) on the pavement left of the spawn — visible from frame one, collected only by walking against the level's grain. |
| `fixed_R_B1_zone.png` | The R–B1 silhouette after removing the unplaceable optional perch (the only pair the platform-overlap audit ever flagged: 43px × 9px rectangle overlap). |

Method notes: hidden-pane pump (`game.loop.step`), `renderer.snapshot`,
camera `stopFollow` + `centerOn` per target; audits in the session scratchpad
(`presence_choices_audit.py`, `platform_overlap_audit.py`) — key numbers are
inlined as comments in `levels.ts` and quoted in the PR body.
