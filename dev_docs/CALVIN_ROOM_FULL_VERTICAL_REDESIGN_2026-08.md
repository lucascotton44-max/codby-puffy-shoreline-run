# Calvin's Creature Room — Full-Vertical Redesign (Kishōtenketsu Structure)

**Status: APPROVED (2026-08) with one blocking correction applied — see S06/S01 notes.** Supersedes the greybox layout of PR #7 (closed unmerged). Successor to [CALVIN_ROOM_LAYOUT_PROPOSAL_2026-08.md](CALVIN_ROOM_LAYOUT_PROPOSAL_2026-08.md); the locked-constraint inventory there (L1–L12 from the design source) still binds and is not repeated in full. Physics: Earth Eyes rise ceiling **84.5 px** / flat reach ~160 px; Red Bart rise 136 px, glide fall-cap 135 px/s (descent slope ≈ 0.54 px/px at full drift).

## The honest anchoring constraint

The room's backdrop is screen-fixed (no parallax, no vertical camera scroll), so backdrop features hold constant **screen height** forever but have no stable x-relationship to world positions. Anchoring is therefore by **height band** — real and dependable — not by x-features:

| Band (platform-top y) | Backdrop feature at that height |
|---|---|
| 150–205 | Macdonald Bridge deck / cable line |
| 205–260 | City skyline roofline |
| 262–345 | Seawall top edge / harbour horizon |
| 345–440 | Open water surface band |
| 440–483 | Wet pavement / foreshore |

Vertical grounding comes from **point 2's pilings** (below), which visually connect docks downward — the fixed-backdrop truth is why they matter.

## Elevation profile (side view — approve this)

Each column ≈ 100 px of world-x. `═` platforms · `○` fragments (on jump/fall arcs) · `▓` puddles · `M` melt patrol (ground lane) · `D` Creature Door · `~` glide path.

```
  y      0    400   800  1200  1600  2000  2400  2800  3200  3600  4000
        |     |     |     |     |     |     |     |     |     |     |
 158 ── ······································○···················· ← S04 on the B2→H arc apex      ─ bridge-deck band
 168 ── ··························,→···········══H══~~··············   THE SUMMIT (top 168)
 215 ── ························································~···  ══B2══                        ─ skyline band
 255 ── ····························································~
 268 ── ······································○ S06 (glide dip / M1 jump)~
 275 ── ·····························══B1══······················~··                               ─ seawall-top band
 305 ── ················══A3══··········································
 340 ── ··················──══ R ══─────··········══M1══·············                              ─ recovery wharf
 359 ── ·············══A2══···············································                        ─ water band
 386 ── ······○S02·······································○S07·········
 415 ── ···········══A1══·····································══C1══··
 421 ── ······══D2══····························································
 440 ── ══B0══·══T1══·············································══S══·····                       ─ pavement band
 462 ── ···○S01(drop)···········································○S08··
 483 ── ═══════════════▓P3══════M══▓P1═════════▓P2═══════════════D═══  ← ground: puddles+patrol+door
        |     |     |     |     |     |     |     |     |     |     |
        INTRODUCE──→ DEVELOP (climb·breathe·climb higher)──→ TWIST──→ CONCLUDE
```

Route in words: spawn lands on the **B0 boardwalk → safe drop-collect** (S01 in the fall line — the first verb taught is falling, safely) → low hops re-teach jumping → the **develop** climb: Ladder A up the water band, a wide **clean recovery wharf** to breathe, then Ladder B *higher* through the skyline band to the **summit at bridge-deck height** (top 168 — total climb 315 px; the current layout's whole range is ~212) → the **twist**: the world opens; Red Bart glides one unbroken 250 px descent off the summit (threading S06); Earth Eyes takes the visible stepped catches M1→C1 → **conclude**: one gentle step-down, hazard-free calm walk, S08 at stride height, the chalked door.

## Platform table

| # | Name | x | w | top | Band anchor | Phase | §9 type | Rationale |
|---|---|---|---|---|---|---|---|---|
| 1 | B0 | 140 | 220 | 440 | pavement | Introduce | Teaching | Spawn lands here; walking off its edge IS the first lesson — S01 collected mid-fall, failure impossible |
| 2 | T1 | 480 | 200 | 440 | pavement | Introduce | Teaching | The 43 px standard hop, learned flat |
| 3 | D2 | 740 | 200 | 421 | pavement edge | Introduce | Reward | First real gap (60); S02 hangs on this arc |
| 4 | A1 | 1180 | 200 | 415 | water edge | Develop | Teaching | Ladder A begins: 68 px rise from the ground lane — the develop phase announces itself |
| 5 | A2 | 1420 | 190 | 359 | water band | Develop | Reward | Gap 45 / +56; S03 on its entry arc |
| 6 | A3 | 1650 | 190 | 305 | seawall top | Develop | Teaching | Gap 40 / +54 — rhythm repetition |
| 7 | R | 1950 | 320 | 340 | seawall top | Develop | Recovery | Wide, hazard-free breathing wharf; S05 on the drop arc into it |
| 8 | B1 | 2220 | 180 | 275 | seawall top | Develop | Teaching | Ladder B: +65 — the escalation (same verb, higher stakes) |
| 9 | B2 | 2440 | 180 | 215 | skyline | Develop | Teaching | Gap 40 / +60 — city roofline height |
| 10 | H | 2650 | 200 | 168 | **bridge deck** | Develop→Twist | Glide setup | THE SUMMIT: gap 20 / +47, silhouetted against the span; S04 caps its entry arc |
| 11 | M1 | 2900 | 180 | 340 | seawall top | Twist | Recovery | Earth Eyes' visible stepped catch (gap 60, drop 172); Red Bart overflies it |
| 12 | C1 | 3200 | 240 | 416 | water edge | Twist | Recovery/Reward | Second catch (gap 90, drop 76); the glide's landing wharf |
| 13 | S | 3510 | 200 | 440 | pavement | Conclude | Final approach | Gentle 90/−24 step-down; S07 on its low calm arc |
| — | ground | — | — | 483 | pavement | all | Floor | Unchanged; Earth Eyes' safer lane and the door walk-up |

13 docks (was 14). **Mandatory-rise audit (final numbers): worst 72 px — S06 from M1, from a stable platform, retryable** (the 8/8 requirement makes S06 mandatory; see the fragment table). Worst platform-to-platform rise 68 px (ground→A1), everything else ≤65, vs the 84.5 ceiling. No blind leaps — every target is visible before takeoff (M1/C1 both readable from H).

## Fragments — guidance arcs (all 8 airborne on real trajectories)

| Frag | Pos | Arc it traces | Fair-reach check |
|---|---|---|---|
| S01 | (295, 465) | The fall off B0's edge — drop-collect | Walk-off; cannot fail. Position verified against actual drift: run-speed walk-off (185 px/s over the 43 px fall) crosses x≈270–312 body-width; at x=330 the pickup missed by ~4 px, so S01 sits at 295 where both walk-off and run-off arcs — and the ground walk-back — all collect it |
| S02 | (615, 378) | T1→D2 jump apex (takeoff 580,440; apex +60 at ~75 px out) | On the mandatory arc |
| S03 | (1310, 362) | A1→A2 entry arc apex | On the mandatory arc |
| S04 | (2600, 158) | B2→H summit arc apex (+57 above takeoff) | On the mandatory arc |
| S05 | (1790, 322) | A3→R drop arc — pulls the player down onto the recovery wharf | On the mandatory descent |
| S06 | (2880, 268) | The glide line (Red Bart dips below the 0.54-slope path — controlled descent is the skill) | **MANDATORY** (the room requires 8/8 — every creature comes home). Fair because it stands directly above M1: a missed glide grab is fully recoverable — land, walk back, and it's a 72 px vertical jump from a stable platform, retryable, not a one-shot mid-air catch. Red Bart's glide-dip is the stylish way; Earth Eyes' ladder-jump is the honest way |
| S07 | (3370, 386) | C1→S calm low arc (+30) | On the mandatory arc |
| S08 | (3940, 430) | Stride height, one step before the door | Walk-through |

Six of eight sit **on mandatory arcs** — collecting them requires no detour, they *are* the route's drawn line (guidance per §8). S06 is the twist's skill pickup — mandatory like everything else (8/8), fair through retryability from M1. S01/S08 bookend at zero risk.

## Hazards & patrol (rebind to the new drop lines — §10/§11)

| Item | Pos | Purpose |
|---|---|---|
| Puddle P3 | ground x 1770, w 80 | Below the A3→R drop line — visible from A3 |
| Puddle P1 | ground x 2380, w 90 | Below Ladder B's gaps — the climb's visible stake |
| Puddle P2 | ground x 3020, w 105 | Under the twist's air — punishes a botched glide/short hop; visible from H |
| Melt patrol | ground, 2060–2240 | Beat-4 zone per §11, on the **ground lane** under Ladder B — pressures the low route, never the recovery wharf. (Still provisional per your standing verdict.) |

Conclude phase is deliberately hazard-free (calm per the brief). All puddles ground-jumpable (≤105 px vs ~160 reach).

## Pilings (point 2 — the code addition)

Opt-in flag `pilings: true` on the room's `PLANK_SKINS` entry (other levels byte-identical). In `addPaintedPlankProp`, when set: 2–3 dark timber legs per dock — a narrow strip cut from the source sheet's stringer (same master, no generated art) drawn as TileSprites at depth 0.75 (**behind** the planks at depth 1, above the backdrop), from the plank underside downward `clamp(gap-to-ground, 46, 140)` px with an alpha fade at the foot — structure receding into the rain rather than 300 px stilts under the summit. Calvin's chalk dressing (depth 0.5 legs / 1.05 marks) is untouched and reads as his sketch *over* real timber — on-theme. **Flag:** this extends §14's greybox scope (scene code + one new prop texture) — explicitly sanctioned by your brief, noted for the record.

## Density check (≥2 POIs per 960 px screen window)

Every 960 px window on the route contains 4–8 of {platform, fragment, puddle, patrol, door}: intro 5 · ladder-A 6 · recovery/ladder-B 8 · summit/twist 7 · conclude 5. Minimum found: 4 (final approach). Pass.

## Kishōtenketsu compliance

**Ki** (0–1050): drop-collect + two flat hops — the full verb set taught at zero stakes. **Shō** (1050–2750): the same climb verb escalated twice with a breather between — rises 56→54, breathe, 65→60→47, each ladder higher-stakes over visible puddles. **Ten** (2750–3400): the mechanics invert — the room stops asking you to climb and asks you to *fall well*; Red Bart's one unbroken glide is the spectacle, Earth Eyes' stepped catches keep it fair. **Ketsu** (3400–4200): no hazards, one soft step, stride-height pickup, door.

**Constraint flags:** platform tops 168–275 exceed §9's suggested high-lane band (260–320) — §9 says "at least three lanes," treated as a floor, flagged. Fragment functional order runs 3→5→4 on the x-axis (recovery sits mid-develop) — §8 maps function-to-beat, not sequence, flagged. Pilings extend §14 scope — sanctioned by this brief. Everything else inside L1–L12.

---

*Awaiting sketch approval. On your go: implementation = levels.ts (platforms/fragments/hazards/patrol) + the pilings addition (ShorelineScene.ts + one leg texture from the committed master + PLANK_SKINS flag), then the full runtime re-audit.*
