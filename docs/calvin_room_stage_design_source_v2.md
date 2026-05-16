# Shoreline Run — Calvin’s Creature Room Stage Design Source v2

**Project:** Cod B’y & Puffy: Shoreline Run  
**Focus area:** Calvin’s Creature Room secret stage  
**Purpose:** Prevent average AI drift, coordinate guessing, feature pileups, and emotionally weak implementation.  
**Use:** Attach this source document to Codex, Claude, or any coding/design agent before future Calvin room work.

---

## 1. Core Standard

This room must not be “average AI platformer content.”

A pass is not successful because it builds. A pass is only successful when it improves the room as a playable, respectful, testable side-scroller stage and is proven by:

1. correct repo path
2. clean pre-check
3. one focused goal
4. narrow file scope
5. build passing
6. runtime video or screenshot evidence
7. clean commit
8. push only after smoke test

No coordinate guessing. No vague polish. No feature stacking.

---

## 2. Current Stable Baseline

Before any future work, verify the actual repo state. Do not trust this document blindly if the repo has moved.

Expected baseline at the time this source document was written:

```text
c940b1e Polish Calvin completion card layout
db00646 Add Calvin Creature Door endpoint
511494a Add Calvin sketch fragment objective
3af45df Add Calvin secret room theme
004ab9a Lift Earth Eyes Bart player visual
06d3f4b Polish Calvin secret HUD labels
3d62792 Add Calvin secret player visual swaps
8e64371 Add Calvin secret level placeholder backdrop
cb29a0b Add Calvin secret level route
```

Required first command before using this document for implementation:

```bash
cd /c/Dev/shoreline-run

git rev-parse --show-toplevel
git status --short
git --no-pager log --oneline -8
npm.cmd run build
```

Expected:

```text
repo root: /c/Dev/shoreline-run
git status: clean
build: passes
```

If the worktree is not clean, stop. Inspect the dirty diff before writing any prompt.

---

## 3. Locked Working Systems

These systems are protected unless the next task directly targets them:

- hidden chalk trigger from Level 1 enters Calvin’s Creature Room
- walking right in Level 1 does not accidentally enter the secret room
- R inside Calvin’s room returns to Level 1 when entered from the chalk route
- direct URL `?level=calvins-creature-room` works
- rainy Halifax/Dartmouth backdrop loads
- SFB wall easter egg stays subtle
- Earth Eyes Bart replaces Cod B’y visually inside Calvin’s room only
- Red Bart replaces Puffy visually inside Calvin’s room only
- underlying mechanics remain Cod/Puffy
- Calvin HUD labels stay correct
- Calvin spooky theme plays
- 8 Sketch Fragment objective works
- Creature Door endpoint works
- locked-door message works
- Calvin completion card fits
- normal campaign still uses Cod B’y/Puffy, RELIC language, normal music, and normal CH 8 endpoint
- desktop controls remain intact
- mobile controls remain intact
- debug H toggle remains intact

---

## 4. Current Strategic Problem

The Calvin room works, but it does not yet feel like a top-tier side-scroller stage.

Observed weakness:

```text
The room still reads as a flat rainy hallway with collectible pickups and a door payoff.
```

Target outcome:

```text
A designed secret stage with readable beats, vertical rhythm, character purpose, safe teaching, rising tension, recovery, and payoff.
```

The issue is not just length. The issue is missing **stage grammar**.

---

## 5. Design Pillars

### 5.1 Playable tribute, not shrine

This stage is emotionally meaningful, but it must remain a game level. Avoid heavy memorial language, plaques, halos, angel imagery, or sentimental overstatement.

### 5.2 Atlantic sketch-world, not fantasy portal land

Tone:

```text
rainy harbour night
chalk marks on concrete
sketchbook weirdness
quiet mystery
protective darkness
```

Avoid:

```text
generic fantasy portal
neon magic
Halloween comedy
circus weirdness
sci-fi glow
cheap horror
```

### 5.3 Platformer-first design

The level must teach, test, and reward movement. Mood alone is not enough.

Use classic platformer principles:

```text
teach safely → repeat with variation → raise stakes → give recovery → reward mastery → resolve clearly
```

### 5.4 Character purpose

Earth Eyes Bart / Cod-slot should feel stable and grounded.

Red Bart / Puffy-slot should feel useful for:

- high-route recovery
- controlled descent
- crossing danger later
- correcting bad jumps

Do not force every pickup to require Red Bart. Do make Red Bart feel valuable.

### 5.5 Visible consequence, not invisible punishment

Do not add generic fall damage as a hidden rule.

Better rule:

```text
High drops are dangerous because visible black sketch puddles / broken dock gaps / chalk hazards sit below.
Red Bart glide lets the player recover.
Earth Eyes has safer but slower route choices.
```

---

## 6. Above-Average Stage Design Laws

1. Every screen must have one gameplay idea.
2. Every platform must have a purpose.
3. Every Sketch Fragment must guide or reward movement.
4. Every future hazard must be readable before it punishes.
5. Every character swap should have a reason.
6. Every difficult moment needs either a safe teaching version first or a recovery route.
7. The room must have sections, not just coordinates.
8. Do not add mechanics until the current route is fun without them.
9. If a change only makes the level longer but not more designed, reject it.
10. If runtime evidence says it still feels average, revert or revise before commit.

---

## 7. Calvin Room Stage Beat Map v2

This is the next design target. Do not write code until these beats are accepted.

Recommended target:

```text
worldWidth: 4200–4600
endX: 4000–4350
```

The exact numbers should be chosen after paper design. Do not default to 3200 again unless the beat map proves it is enough.

### Beat 1 — Arrival / safe sketch

Approximate range:

```text
x 0–500
```

Purpose:

- orient the player
- establish rainy sketch-world tone
- place first Sketch Fragment safely
- no enemy pressure
- no difficult jump

Player lesson:

```text
This room is about collecting Sketches and reaching the Creature Door.
```

### Beat 2 — Low dock hop

Approximate range:

```text
x 500–1050
```

Purpose:

- introduce platforming with safe, low dock jumps
- place one fragment on a low platform
- keep failure harmless

Player lesson:

```text
Sketch Fragments mark the route.
```

### Beat 3 — First high climb

Approximate range:

```text
x 1050–1700
```

Purpose:

- introduce a visibly higher route
- use two or three staggered platforms
- reward climbing with a fragment
- create clear vertical silhouette

Player lesson:

```text
There is a high route; Red Bart may help, but Earth Eyes can still progress.
```

### Beat 4 — Lower recovery route

Approximate range:

```text
x 1700–2250
```

Purpose:

- let the player recover after the high section
- provide a lower floor route
- create breathing room
- reserve space for a future black sketch puddle or enemy patrol

Player lesson:

```text
The room has safe and risky lanes.
```

### Beat 5 — Glide-value descent

Approximate range:

```text
x 2250–3050
```

Purpose:

- create a high platform followed by a meaningful descent
- make Red Bart/Puffy glide feel valuable
- do not require invisible fall damage
- reserve the ground below for future visible danger

Player lesson:

```text
Flutter/glide is recovery, control, and style.
```

### Beat 6 — Final raised approach

Approximate range:

```text
x 3050–3900
```

Purpose:

- final platform sequence before the door
- place seventh or eighth Sketch Fragment near the approach
- build anticipation
- reserve room for final future obstacle

Player lesson:

```text
The door is close; finish the route cleanly.
```

### Beat 7 — Creature Door resolution

Approximate range:

```text
x 3900–4350
```

Purpose:

- final Sketch pickup should happen shortly before the door
- Creature Door should feel like the end of the page
- completion card should appear after a clear final walk/touch

Player lesson:

```text
All pieces found. The door opens.
```

---

## 8. Fragment Placement Rules

Keep 8 Sketch Fragments.

Do not place them randomly. They should trace the intended route.

Recommended distribution:

| Fragment | Beat | Function |
|---:|---|---|
| 1 | Arrival | safe first pickup |
| 2 | Low dock hop | teaches platform reward |
| 3 | First high climb | confirms vertical route |
| 4 | High route | rewards climbing |
| 5 | Recovery route | pulls player back down |
| 6 | Glide descent | rewards controlled movement |
| 7 | Final approach | confirms near-end progress |
| 8 | Door approach | creates immediate unlock payoff |

Acceptance criteria:

- all 8 are visible or discoverable without pixel hunting
- all 8 are reachable with fair play
- no fragment should require a blind leap
- Red Bart can make the high/descent route easier
- Earth Eyes can still complete the room, unless a future mechanic explicitly creates alternate character paths

---

## 9. Platform Route Rules

Use at least three vertical lanes:

```text
low lane: y ~400–430
mid lane: y ~340–380
high lane: y ~260–320
```

Do not keep every platform in the same band.

Each platform should be classified before implementation:

| Type | Purpose |
|---|---|
| Teaching platform | safe introduction |
| Reward platform | holds fragment |
| Recovery platform | catches failed route |
| Glide setup platform | sets up descent |
| Final approach platform | builds door anticipation |
| Future hazard/enemy lane | reserved but not implemented yet |

If a platform does not serve one of these functions, remove it.

---

## 10. Fall Consequence Plan

Do not implement fall damage yet.

The professional version is visible consequence:

```text
black sketch puddles
broken dock gaps
chalk-drip hazards
rain-slick danger zones
```

Design rule:

```text
The danger must be visible before the player falls into it.
```

Future first hazard pass:

```text
Add 2–3 black sketch puddles below high-route drops.
Contact hurts or resets.
Red Bart glide helps avoid them.
```

This creates fall consequence without unfair invisible rules.

---

## 11. Enemy Plan

Do not add enemy behavior until the stage route and visible hazard vocabulary work.

Future enemy:

```text
Melt creature patrol
```

Rules:

- one enemy type only
- simple left/right patrol
- contact hurts
- no complex AI
- no boss logic
- no new animation system in the first pass
- visually drawn from Calvin’s creature language

Suggested first enemy placement later:

```text
one patrol in Beat 4 or Beat 6, not near the first safe teaching section
```

---

## 12. Portal / Page Tear Plan

Portals can work later, but generic portal language is banned.

Use:

```text
Page Tear
Chalk Gate
Rain-Puddle Threshold
Sketch Door
```

First mechanic should be optional and simple:

```text
A Page Tear moves the player from a lower recovery lane to a high route platform.
```

Do not implement a full alternate dimension first.

Possible later escalation:

1. visual Page Tear only
2. optional teleport from low route to high route
3. Page Tear leading to a small alternate sketch pocket
4. Creature Door opens into a future full sketch dimension

---

## 13. What Not To Do Next

Do not add in the next pass:

- fall damage
- black sketch puddles
- enemies
- Melt creature behavior
- portals/Page Tears
- animation
- new assets
- player grounding changes
- HUD changes
- audio/SFX
- scene logic
- physics/hitbox edits

Next pass should be **paper beat map → one-file level-data greybox** only.

---

## 14. Next Implementation Pass Definition

Next code pass name:

```text
Greybox Calvin room beat-map route
```

Allowed file:

```text
src/config/levels.ts
```

Allowed changes:

- Calvin room `worldWidth`
- Calvin room `endX`
- Calvin room `platforms`
- Calvin room `fragments`

Locked:

- all other files
- hazards
- enemies
- audio
- player visuals
- scene logic
- controls
- physics
- HUD
- Creature Door behavior
- completion card layout
- normal campaign levels

Success criteria:

- stage is clearly longer
- stage has distinct beats
- high route is visible
- low recovery route exists
- Red Bart glide feels valuable
- Earth Eyes can complete the room fairly
- all 8 Sketch Fragments are reachable
- Creature Door still works at the end
- normal campaign unchanged

---

## 15. Runtime QA Checklist

Direct URL:

```text
http://localhost:5173/?level=calvins-creature-room
```

Check:

1. room loads cleanly
2. camera follows to the new end
3. route has clear sections, not one flat lane
4. platforms visibly use low/mid/high lanes
5. all 8 Sketch Fragments are reachable
6. no impossible or unfair jumps
7. Red Bart glide feels useful at least once
8. Earth Eyes can still complete the room
9. Creature Door appears at the end
10. locked-door message still works before 8/8
11. completion works after 8/8
12. completion card still fits
13. audio still plays
14. normal route from `/` still works
15. normal campaign remains unchanged

If any of these fail, do not commit.

---

## 16. Stop Conditions

Stop and rethink if:

- the route still feels flat
- only one platform visibly changed
- fragments feel scattered instead of guiding the path
- Red Bart has no reason to exist
- Earth Eyes cannot complete the stage fairly
- the level feels longer but not better
- the pass touches files outside `src/config/levels.ts`
- the agent adds hazards, enemies, portals, or scene logic early
- runtime footage does not show improvement

---

## 17. Prompt Requirements for Coding Agents

Every prompt must include:

- actual repo path `/c/Dev/shoreline-run`
- expected latest commit
- clean pre-check
- exact allowed file list
- exact locked file/systems list
- one goal only
- paper beat-map intent
- required platform/fragment design
- preserve list
- verification commands
- report requirements
- `Do not commit`

Every report must include:

- `git status --short`
- files changed
- build result
- exact level-data changes
- confirmation only allowed file changed
- confirmation locked systems were untouched
- risk areas
- do not commit

Reject any report that says “improved” without showing exact data and build proof.

---

## 18. Quality Bar

This room must feel:

```text
playable
respectful
grounded
weird but safe
Atlantic
stage-designed
not patched together
not generic
not fantasy spectacle
not a flat hallway
```

The goal is not to add more. The goal is to make each added thing deliberate.

If the next change does not create clearer stage design, it waits.

