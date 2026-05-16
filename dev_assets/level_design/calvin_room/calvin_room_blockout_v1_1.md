# Calvin Room Blockout v1.1

## Purpose

Functional gameplay blockout for Calvin’s Creature Room before any further code changes.

This is a design blueprint, not concept art. It exists to prevent coordinate guessing and to make sure the next `src/config/levels.ts` pass is transcribing an approved stage plan instead of inventing one.

## Current code baseline

- `77a5dcf Improve Calvin platform readability`

## Design goals

- Longer room with readable sections.
- Strong low / mid / high lane rhythm.
- 8 Sketch Fragments that guide the route.
- One clear Red Bart glide-value moment.
- Earth Eyes fairness preserved.
- Creature Door payoff near the end.
- No hazards, enemies, portals, or fall damage implemented in the next pass.

## Blockout v1.1 revision notes

Changes from v1:

- Removed the strong white Sketch-to-Sketch route lines from the playfield.
- Replaced them with a subtle Sketch order guide near the top of the map.
- S08 is placed near the final approach and Creature Door payoff, not in a danger/drop zone.
- Future hazard/enemy/Page Tear slots are visually softened and clearly marked as future-only.
- Red Bart glide moment is labeled as an optional advantage, not a required route gate.

Important clarification:

- Route/progression markers are not jump trajectories.
- Sketches mark progression/reward placement.
- Red Bart glide should feel useful, but Earth Eyes must still have a fair completion route.

## Target world

- Target `worldWidth`: 4200
- Target `endX`: 4000
- Intended range: 7 screens / beats
- Creature Door resolves near the final screen.

## Lane language

- HIGH lane: `y 260–310`
- MID lane: `y 330–370`
- LOW lane: `y 400–420`
- GROUND lane: `GROUND_Y`

## Screen map

### Screen 1 — Safe Arrival

Range: `x 0–600`

Purpose: teach the room and give the first reward quickly.

Platforms:

- P01 — low teaching platform near screen end

Fragments:

- S01 — early, safe, near ground

Notes:

- zero frustration
- immediate visual clarity
- player understands this room is about Sketches and the Creature Door

### Screen 2 — Low Dock Hop

Range: `x 600–1200`

Purpose: easy route extension.

Platforms:

- P02 — low hop platform
- P03 — mid guide platform

Fragments:

- S02 — route guide
- S03 — forward confirmation

Notes:

- no dead air
- platforming begins safely

### Screen 3 — High Climb

Range: `x 1200–1800`

Purpose: first real vertical section.

Platforms:

- P04 — low climb start
- P05 — mid climb
- P06 — high reward platform

Fragments:

- S04 — top reward

Notes:

- first visual high-route moment
- Earth Eyes must still be able to clear this fairly
- Red Bart makes it smoother, but not mandatory

### Screen 4 — Recovery Lane

Range: `x 1800–2400`

Purpose: reset pacing after the high climb.

Platforms:

- P07 — broad low recovery platform
- P08 — mid setup platform

Fragments:

- S05 — recovery reward

Notes:

- room breathes here
- future hazard/enemy space is reserved, not implemented

### Screen 5 — Glide-Value Section

Range: `x 2400–3000`

Purpose: Red Bart advantage.

Platforms:

- P09 — high launch platform
- P10 — mid catch platform
- P11 — lower landing platform

Fragments:

- S06 — controlled movement reward

Notes:

- Red Bart glide should feel valuable here
- Red Bart glide is an advantage, not a required route gate
- Earth Eyes still has a valid route
- future black sketch puddle can live below later

### Screen 6 — Final Climb

Range: `x 3000–3600`

Purpose: build toward ending.

Platforms:

- P12 — low build platform
- P13 — mid final climb
- P14 — high final reward

Fragments:

- S07 — final buildup reward

Notes:

- visually builds energy
- not too hard
- future final obstacle or Page Tear can be reserved here later

### Screen 7 — Creature Door Payoff

Range: `x 3600–4200`

Purpose: ending and closure.

Platforms:

- P15 — final approach platform

Fragments:

- S08 — near door / unlock payoff, placed on or near the final approach rather than in a danger/drop zone

Door:

- Creature Door near `x 4000`

Notes:

- final Sketch should feel close enough to the door for immediate payoff
- clean ending, no frustration

## Future slots

These are shown on the blockout image but must not be implemented in the next code pass.

- H01 — black sketch puddle candidate
- H02 — descent danger candidate
- E01 — Melt patrol candidate
- G01 — Page Tear / Chalk Gate candidate

## Approval checklist

Do not convert this blockout into code unless the map passes this checklist:

- Does every screen have a distinct purpose?
- Do Sketches guide the route without implying impossible jump lines?
- Does Screen 5 clearly justify Red Bart as an optional advantage?
- Can Earth Eyes still complete the room?
- Is S08 positioned as near-door payoff?
- Are future hazards/enemies/portals marked but not implemented?
- Is this ready to convert into exact coordinates?

## Next code-pass rule after approval

Allowed file:

- `src/config/levels.ts`

Locked:

- `src/scenes/ShorelineScene.ts`
- `public/assets`
- `docs`
- audio
- controls
- physics
- HUD
- enemies
- hazards
- portals/Page Tears
- normal campaign levels

Codex should transcribe the approved map. It should not invent a new stage.
