# Calvin's Creature Room — Platform Layout Proposal (August 2026)

Design pass only — no code changed, [levels.ts](../src/config/levels.ts) untouched. Prepared against [calvin_room_stage_design_source_v2.md](../docs/calvin_room_stage_design_source_v2.md) (read in full; cited as "§" below) and the live physics in [tuning.ts](../src/config/tuning.ts). Numbers below use platform **top** surfaces (center-y − 11 for the 22-px docks; ground top = 483).

**Physics the layout must respect:** Earth Eyes (Cod slot) max jump rise **84.5 px** (v=390, g=900), full-speed flat-jump reach ≈ 160 px; campaign convention treats **43 px** as the comfortable hop and ~76–84 px as a deliberate "risk" climb. Red Bart (Puffy slot) rises 136 px and glides at a 135 px/s fall cap. The camera has **no vertical scroll** in this room (world height = viewport height), so world-y maps 1:1 to the screen — platform bands hold a fixed relationship to the backdrop's water line (~screen y 227–369) and foreground pavement (~369–540). Alignment to the scene is therefore real, not aspirational.

---

## 1. Locked constraints that bind layout

| # | Constraint | Source |
|---|---|---|
| L1 | **Exactly 8 Sketch Fragments**, distributed to trace the route per the beat table (arrival-safe → platform-reward → vertical-confirm → climb-reward → pull-down → glide-reward → near-end → door payoff) | §8 |
| L2 | All 8 visible/discoverable, no pixel hunting, **no blind leaps**, reachable with fair play | §8 |
| L3 | **Earth Eyes must complete everything**; Red Bart may ease the high/descent routes but is never mandatory | §5.4, §8 |
| L4 | **Beat structure 1–7** with the stated x-ranges (arrival 0–500, low hop 500–1050, high climb 1050–1700, recovery 1700–2250, glide descent 2250–3050, final approach 3050–3900, door 3900+) and the teach→vary→raise→recover→reward→resolve pacing | §7, §5.3 |
| L5 | worldWidth 4200–4600, endX 4000–4350 (current 4200/4000 compliant — keep) | §7 |
| L6 | **Three vertical lanes** — low ~top 400–430, mid ~340–380, high ~260–320; every platform classified (teaching/reward/recovery/glide-setup/final-approach/reserved); purposeless platforms removed | §9 |
| L7 | **No boss logic**; one melt patrol only, simple, in Beat 4 **or** Beat 6, never near the first teaching section | §11 |
| L8 | Fall consequence = **visible** hazards only ("the danger must be visible before the player falls into it"; puddles belong **below high-route drops**); no fall damage | §10 |
| L9 | Emotional register: playable tribute not shrine; rainy harbour night, chalk, quiet mystery, protective darkness; no fantasy-portal/neon/horror language | §5.1, §5.2, §18 |
| L10 | Locked working systems: chalk entry, R-return, direct URL, backdrop, **SFB wall easter egg stays subtle**, Creature Door endpoint + locked-door message + completion card, HUD labels, theme | §3 |
| L11 | One gameplay idea per screen; every platform purposeful; fragments guide movement; recovery routes for hard moments | §6 |
| L12 | A greybox implementation pass may only touch the room's `worldWidth`/`endX`/`platforms`/`fragments` in levels.ts — **hazards and the enemy are locked** in that scope | §14 |

L12 matters most below: the current puddle/patrol placements conflict with L8/L4, but *moving them is outside the sanctioned greybox scope*. Those moves are proposed anyway and **flagged** — they need either your explicit approval as a companion hazard micro-pass or deferral.

---

## 2. Diagnosis of the current layout

Current geometry (16 docks + full-width ground), with edge-to-edge gap from the previous platform and climb(+)/drop(−):

| Plat | x | w | top | gap | step | Visual problem | Gameplay problem |
|---|---|---|---|---|---|---|---|
| S1 | 430 | 220 | 401 | — | +82 from ground | Floats mid-air over the pavement band; nothing anchors it to the left pier | **82 px climb vs the 84.5 px physics maximum on the ARRIVAL platform** (Beat 1 demands "no difficult jump", §7) — and it holds no fragment, serving no §9 function |
| S2a | 700 | 220 | 397 | 50 | +4 | Same band as S1 → reads as a duplicate slab | The only honest gap in the room's first half; fine in isolation |
| S2b | 960 | 230 | 359 | 35 | +38 | Floating; no piling/step relationship to S2a | OK hop; fragment S02 sits back at S2a, so the reward doesn't pull forward |
| S3a | 1200 | 240 | 391 | **5** | −32 | Slab scatter begins: 5-px "gaps" read as broken tiling, not design | Drops *down* to start the "high climb" — silhouette contradicts the beat |
| S3b | 1440 | 230 | 327 | **5** | +64 | Near-touching stair | No jump challenge — it's a staircase walk |
| S3c | 1680 | 260 | 271 | **−5 (overlap)** | +56 | Overlapping slabs at the summit | Same |
| S4a | 1980 | 300 | 403 | 20 | **−132** | The recovery dock — but visually identical to every other slab | **The Beat-4 "recovery/breathing room" platform carries BOTH puddle 1 (x2030, on its surface) AND the melt patrol (1915–2045)** — the landing zone of the 132 px drop is the most dangerous tile in the room, inverting §7/§10 |
| S4b | 2180 | 230 | 345 | −65 (overlap) | +58 | Overlap | Fragment S05 fine |
| S5a | 2400 | 280 | 275 | −35 (overlap) | +70 | Overlap | The 70 px climb is a fair risk step — but it's entered from an overlap, so it reads accidental |
| S5b | 2660 | 260 | 341 | −10 (overlap) | −66 | Slab | **Fragment S06 (glide reward) floats 31 px above a platform whose surface holds puddle 2** — collecting the reward lands you beside/in the hazard (L2 "fair play" violation in spirit) |
| S5c | 2940 | 300 | 405 | 0 (touching) | −64 | Touching slabs | Descent is two stair-steps, not a glide moment — Red Bart has nothing to do (§16 stop condition "Red Bart has no reason to exist" is near) |
| S6a | 3220 | 280 | 391 | −10 (overlap) | +14 | Slab | **Fragment S07 above puddle 3 (on this surface)** — same trap-the-reward pattern |
| S6b | 3480 | 250 | 331 | −5 (overlap) | +60 | Slab stair | — |
| S6c | 3740 | 260 | 293 | 5 | +38 | Slab stair | — |
| S7 | 3920 | 300 | 399 | **−100 (overlap)** | −106 | 100 px of accidental overlap under the door | Redundant — the door stands at ground level; fragment S08 floats in the overlap zone |

**Summary:** 11 of 14 transitions have gaps of ≤ 20 px or negative (overlaps). Horizontal jumping — the core platformer verb — is almost absent; height zigzags (401→397→359→391→327→271→403→345→275→341→405→391→331→293→399) with no silhouette shape; every dock is a same-language slab floating over a screen-fixed backdrop with no massing that acknowledges the pier at left, the water band in the middle distance, or the seawall at right. The fragments mostly hover over platforms rather than pulling the eye along a route, and two of them bait the player onto puddled surfaces. This is §4's "flat rainy hallway" wearing stairs.

---

## 3. Proposed layout

**Route shape (the two principles applied):** leave the shore at the left pier (low boardwalk, Beats 1–2) → climb out **over the water** on a rising piling ladder (Beat 3, the high lane hangs over the backdrop's water band — the dressing's legs become pilings) → drop back to a *clean* recovery wharf (Beat 4) → one risk climb and the long **glide descent** back toward shore (Beat 5) → a second, tighter rise along the **seawall** (Beat 6, mirroring Beat 3 with variation per §5.3) → step down and walk to the chalked door on the pavement (Beat 7). Out over the dark water and safely back to the wall: rising interest with a shape that belongs to the scene.

14 docks (−2 from current: the purposeless S1 and the redundant S7 are removed per §9) + the existing full-width ground (kept — it is the Earth-Eyes fair-completion floor, L3).

| # | Name | x | w | top | Lane | §9 type | Rationale |
|---|---|---|---|---|---|---|---|
| 1 | T1 | 420 | 200 | 440 | low | Teaching | The campaign-standard 43 px hop, learned where failure is meaningless; sits at the pavement edge of the left pier |
| 2 | D2 | 680 | 200 | 440 | low | Teaching | First real gap (60 px, flat) — the boardwalk leaves the shore |
| 3 | D3 | 950 | 200 | 403 | low | Reward | Gap 70/up 37; carries **S02** overhead — the reward pulls forward, first step onto pilings |
| 4 | C1 | 1220 | 220 | 359 | mid | Reward | Gap 60/up 44; **S03** overhead confirms the vertical route beginning |
| 5 | C2 | 1470 | 200 | 305 | high | Teaching | Gap 40/up 54 — the ladder over the water is now unmistakable in silhouette |
| 6 | C3 | 1720 | 200 | 271 | high | Reward | Gap 50/up 34; **S04** at the summit rewards the climb (L1 beat table) |
| 7 | R1 | 2000 | 300 | 403 | low | Recovery | The 132 px drop's catch — **kept clean** (no hazard, no patrol on it; see flags); wide, calm, breathing room per §7 Beat 4; **S05** overhead pulls the player back down |
| 8 | R2 | 2240 | 180 | 345 | mid | Glide setup | Butted to R1's edge (deliberate connected wharf step, not scatter) — the approach stair to the descent |
| 9 | G1 | 2480 | 220 | 275 | high | Glide setup | Gap 40/up 70 — the room's one deliberate limit-flavored climb (fair at 84.5 max; trivial for Red Bart), stakes rising per §5.3 |
| 10 | G2 | 2820 | 240 | 405 | low | Recovery/Reward | **The glide moment**: 110 px gap, 130 px drop from G1. Red Bart rides the diagonal through **S06 floating mid-air at (2700, 330)**; Earth Eyes can still take S06 with an 75 px jump from G2's left edge (≤84.5, fair per L3) |
| 11 | G3 | 3000 | 200 | 440 | low | Recovery | Overlapped step-down from G2 — the wharf descends to the water's edge before the final rise |
| 12 | F1 | 3260 | 220 | 403 | low | Final approach | Gap 50/up 37 — second rise begins against the seawall |
| 13 | F2 | 3510 | 220 | 359 | mid | Final approach/Reward | Gap 30/up 44; **S07** overhead confirms near-end progress |
| 14 | F3 | 3760 | 220 | 305 | mid-high | Final approach | Gap 30/up 54 — anticipation peak; from here the player sees the door below |
| — | (ground) | — | — | 483 | floor | Recovery/route | Unchanged full-width floor: Earth Eyes' safer-slower lane under Beats 5–6 (§5.4) and the Beat 7 walk-up |

**Beat 7:** stays on the ground — the door already renders at ground height against the seawall (endpoint behavior locked, L10), and §7 asks for a "clear final walk/touch," not a final jump. **S08 moves to (3940, 430)**, floating just above the pavement a step before the door: pickup → door touch in one motion (L1 "immediate unlock payoff").

**Fragments (all 8, L1 mapping):** S01 ground (180, 428) unchanged · S02 (950, 369) · S03 (1220, 325) · S04 (1720, 237) · S05 (2000, 369) · S06 (2700, 330) mid-air on the glide line · S07 (3510, 325) · S08 (3940, 430). Every fragment either hangs ≤ 34 px above a surface or sits on a jump arc proven below — no blind leaps (L2).

**Jump-arc audit (Earth Eyes, max rise 84.5 / reach ≈160):** ground→T1 +43 · T1→D2 gap 60 flat · D2→D3 gap 70 +37 · D3→C1 gap 60 +44 · C1→C2 gap 40 +54 · C2→C3 gap 50 +34 · C3→R1 drop (safe catch) · R1→R2 step +58 · R2→G1 gap 40 **+70 (deliberate risk peak)** · G1→G2 glide/drop · G2→S06 +75 (optional reward) · G3→F1 gap 50 +37 · F1→F2 gap 30 +44 · F2→F3 gap 30 +54 · F3→ground drop. Every mandatory move ≤ 70; every optional move ≤ 75; nothing touches the 84.5 ceiling. Red Bart shortens Beat 3, trivializes G1, and owns the S06 glide line — valuable, never required (L3).

---

## 4. Flagged items (touch locked constraints — need your call)

| Flag | Proposal | Constraint touched |
|---|---|---|
| F-A | **Puddle 1** off the R1 recovery surface → ground at x≈1880, directly below the C3→R1 drop line (visible from C3 before jumping — this is §10's own placement rule) | §14 locks hazards in the greybox scope |
| F-B | **Puddle 2** off S5b's surface → ground at x≈2700, under the G1→G2 glide gap (punishes a short jump; Red Bart clears it — §10's exact scenario) | Same |
| F-C | **Puddle 3** off S6a's surface → ground at x≈3420, under the F2→F3 stretch of the final rise | Same |
| F-D | **Melt patrol** from the R1 recovery platform → either Beat 6 on F1 (range ≈3160–3360, final-approach pressure per §11's Beat-6 option) or, if Beat 4 pressure is preferred, onto the **ground below R1** (≈1900–2100) so the catch platform itself stays safe | §14 locks the enemy; §11 permits Beat 4 or 6 |

Without F-A→F-D approved, the platform/fragment proposal still stands on its own (it is fully within §14's allowed greybox scope) — but R1 would inherit today's puddle+patrol combination, so approving at least F-A and F-D alongside the greybox is strongly recommended; they're what restores §7's recovery beat.

**Explicitly untouched:** worldWidth/endX (compliant, kept), the ground floor, chalk trigger, door/completion behavior, SFB wall (the Beat-6 seawall rise deliberately *approaches* it but nothing is added to it — subtlety preserved per L10), all §3 systems.

**§16 stop-condition self-check:** route no longer flat (two rises, one glide valley) · more than one platform changed · fragments trace the path · Red Bart has three distinct reasons to exist · Earth Eyes completes everything ≤ 70 px mandatory rises · nothing outside levels.ts proposed except the four flags, which are flagged.

---

*Implementation, when approved, is exactly the §14 greybox pass: `platforms` + `fragments` arrays in the room's LevelDefinition (plus the flagged hazard/patrol coordinates if green-lit). Paper-design values above are ready to transcribe. This document changes no code.*
