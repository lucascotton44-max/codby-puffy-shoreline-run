# Shoreline Run — Fix Log

## Resolved

### Bridge backdrop does not appear
**Status:** Resolved / verified
Asset copied to `public/assets/backgrounds/st_peters_bridge_crossing.png`.
Registered in `constants.ts` (`ASSET_PATHS.stPetersBridgeCrossingBackdrop`, `TEXTURE_KEYS.stPetersBridgeCrossingBackdrop`).
Level `bridge_crossing_1a` preloads and renders the backdrop correctly.
Load via `?level=bridge_crossing_1a`.

---

## Resolved (awaiting play-test verification)

### Bridge Level 1A needs length / pacing pass
**Status:** Geometry complete — awaiting in-browser QA
Route extended from 7 platforms / worldWidth 3200 to 9 platforms / worldWidth 3900.
New beats: left approach ledge (before service ledge), right approach ledge (after service ledge).
Left bank right edge anchored to x=660, approach ledge center at x=830 — both visible in spawn
viewport so the canal entry beat reads immediately from start. Right bank left edge x=2950,
width=900 — wide towpath landing clearly distinct before CH8 at endX=3500 (550 px into bank).
Water hazard spans exactly x=660–2950 (bank edge to bank edge); y corrected to 515 (top=488).
endX=3500, well inside right bank. Requires manual play-test to confirm pacing and CH 8 reachability.
