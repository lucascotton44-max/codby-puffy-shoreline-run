# Shoreline Run — Fix Log

## Resolved

### Bridge backdrop does not appear
**Status:** Resolved / verified
Asset copied to `public/assets/backgrounds/st_peters_bridge_crossing.png`.
Registered in `constants.ts` (`ASSET_PATHS.stPetersBridgeCrossingBackdrop`, `TEXTURE_KEYS.stPetersBridgeCrossingBackdrop`).
Level `bridge_crossing_1a` preloads and renders the backdrop correctly.
Load via `?level=bridge_crossing_1a`.

---

## Resolved

### Bridge Level 1A — layout, pacing, and anchoring passes
**Status:** Committed to master as `506c1c1`; desktop QA accepted.
9-platform bank-to-bank canal-infrastructure route. worldWidth=3900, endX=3500.
Left bank right edge x=660, approach ledge center x=830 — both visible in spawn viewport.
Right bank left=2950, width=900 — clear towpath landing before CH8.
Water spans exactly x=660–2950 (bank edge to bank edge), y=515 (top=488, 5px below ground).

---

## Active

### Bridge Level 1A — light obstacle pass
**Status:** Applied locally; desktop QA confirmed; mobile QA pending.
One Scuttleclaw: right towpath ground level, x=3150, patrol 3060–3260, speed=52.
One rock debris: left service ledge (top=440), x=1160, y=421.
Right bank fragment shifted to x=3350 (past Scuttleclaw patrol end).
Scuttleclaw placed at ground level only (narrow elevated ledges are untested for patrol physics).
Requires play-test: confirm Scuttleclaw patrol stays on bank, rock y=421 sits correctly on service ledge, no cheap hits on mobile.
