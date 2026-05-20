# Full Game Platform and Boss Readability Audit v1

## 1. Purpose

This document is a documentation-only senior audit of the current full-game prototype with emphasis on platform-route readability, boss-hit readability, and near-term staging priorities. It is intended to guide the next focused implementation pass without changing code, assets, mechanics, or progression in this pass.

The audit treats the current prototype as a premium Atlantic Canada side-scroller with a grounded campaign route, a Lord Malefacto lock-arena boss, Calvin's Creature Room sketch-world content, and a visual-only Quake / Old Variety boss test branch.

## 2. Current Commit / Context

- Repo: `/c/Dev/shoreline-run`
- Current clean commit at audit start: `d23dcd4 Add Quake boss visual test route`
- Build status at audit start: passing via `npm.cmd run build`
- Current route set includes campaign shoreline/canal/lock content, Calvin's Creature Room, and `quake-donair-boss-test`.
- Current Quake route is explicitly visual-only: static Quake idle sprite, static donair projectile, no boss behavior or progression.

## 3. Full-Game Verdict

The prototype has the right identity ingredients: readable main characters, a strong regional shoreline/canal vocabulary, a distinct Calvin sketch-world branch, and a boss arena that already has enough structure to support a real readability pass. The main weakness is not content quantity; it is route rhythm. Too many platform sections still read as evenly spaced test geometry rather than authored side-scroller beats.

The next serious improvement should not be another content expansion. It should be a focused readability pass that makes the current path feel intentional: clearer approach beats, grounded supports, better high/low choices, and more obvious recovery lanes. Lord Malefacto also needs hit-feedback clarity before difficulty tuning, because unclear hit rules will make any balance changes feel arbitrary.

## 4. Platform Audit By Section

### Shoreline Opening

The shoreline opening is the best candidate for teaching the game's platform language. It should feel grounded, forgiving, and maritime before it becomes demanding. Current platforming appears functional but still risks reading as a sequence of similar-height blocks. The first route should establish: ground run, one small elevation change, one readable collectible detour, one safe recovery lane, then one slightly sharper test.

Recommended direction: reduce repeated same-band hops, anchor platforms visually to dock/shore materials, and make early relic placements demonstrate intended movement rather than simply mark a path.

### Bridge / Canal Approach

The bridge/canal approach should become the first sense of infrastructure scale: bridge edges, lock walls, canal-side platforms, and water risk. This section can support stronger vertical contrast than the shoreline opening, but only if the player can see why platforms exist in the world.

Recommended direction: make the route feel like crossing built structures rather than floating across generic ledges. Use a few grounded step-ups, one raised optional line, and at least one clear return path after a missed jump.

### Canal / Marina Run

The canal/marina run should be the strongest place for route variation: low dock path, mid platform path, and a short high reward line. If all platforms occupy similar Y bands, the marina loses its reason to exist as a gameplay space.

Recommended direction: create visible high/low choices. The low route should be safer but slower or less rewarding; the high route should expose the player to a sharper jump sequence or hazard read while offering fragments/relics. Keep water threat staged, not global.

### Lord Malefacto Lock Arena

The lock arena has a coherent boss-frame purpose, but the platforming around a boss should support reading the boss, not compete with it. The current arena should prioritize stomp setup, retreat space, and clear visual separation between the boss body, flare attack, and player recovery path.

Recommended direction: keep the arena geometry simple until boss hit feedback is improved. Avoid adding extra platform noise before the player can reliably understand when Malefacto is vulnerable, when contact hurts, and when a stomp succeeded.

### Calvin's Creature Room

Calvin's Creature Room has a strong identity shift: Earth Eyes Bart / Red Bart, sketch fragments, black sketch puddles, ScuttleMelt, and Creature Door behavior. Its platforming can be stranger than the campaign, but it still needs readable route grammar. Sketch-world does not mean arbitrary.

Recommended direction: convert the room into a beat map: safe sketch entry, first puddle read, ScuttleMelt read, vertical fragment detour, second puddle pressure, final door approach. The room should feel hand-sketched but not random.

### Quake / Old Variety Test Branch

The Quake route currently succeeds as an identity/staging branch: Old Variety setting, Earth Eyes Bart / Red Bart identity, static Quake, and static donair projectile. It should remain a visual-only test until the main platform/boss readability debt is reduced.

Recommended direction: do not add Quake mechanics yet. Keep this branch as a composition check for scale, lane, and character identity. Quake mechanics should be P3 after Malefacto feedback and core route cleanup.

## 5. Platform Problems

### Samey Spacing

Multiple routes appear to rely on repeated horizontal intervals and similar jump asks. This makes the game feel less authored and makes missed jumps feel less instructive. The player needs short, medium, and occasional long beats with visible intent.

### Same Height Bands

Platforms sitting in repeated Y bands reduce route contrast. The player reads them as a flat obstacle line instead of a place with choices. Height bands should be used deliberately: low safe lane, mid main lane, high reward lane.

### Floating / Unsupported Platforms

Unsupported platforms are the largest visual-readability risk in a grounded Atlantic Canada world. Where a platform is dock, wharf, stone, bridge, lock wall, or sketch object, the support logic should be visible or implied.

### Lack Of Route Beats

Several sections need clearer internal phrases: approach, test, recovery, reward, exit. Without this, levels can feel like a continuous strip of jumps. Route beats also help screen recordings read better because each section has a recognizable purpose.

### Lack Of Recovery Lanes

The prototype should avoid punishing every missed jump equally. Especially before adding void consequences, routes need safe lower lanes or reset ledges where the player can recover without hard failure.

### Missing High / Low Route Choices

The current route structure would benefit from more explicit choices. High routes should carry optional reward and higher execution. Low routes should preserve flow and readability. This matters more than adding more hazards.

## 6. Void / Fall-Consequence Plan

### Where Voids Make Sense

Voids make sense where the world already implies danger: open water gaps, lock drops, pier edges, sketch-world black voids, and special boss arenas. These should be authored as local hazards, not global assumptions.

### Where Voids Would Be Unfair

Voids would be unfair under early tutorial jumps, blind drops, ambiguous foreground/background edges, and any platform sequence where the art does not clearly say "falling here matters." The player should not learn void rules by surprise.

### Water Gaps

Water gaps should be introduced gradually. First, show harmless water-adjacent space. Then show a short controlled gap with a visible landing. Later, add wider water reads or optional high-line risks.

### Lock Drops

Lock drops can be more severe than shoreline water because the setting supports vertical danger. They should be used in the Malefacto/lock section only after camera framing and recovery behavior are clear.

### Black Sketch Voids

Black sketch puddles already provide a Calvin-specific hazard language. They can evolve into void-like consequences, but only within the sketch-world branch and only when their edges are readable.

### No Global Death Pits Yet

Do not add global death pits yet. The prototype needs local, authored fall consequences first. Global pit behavior would create balance and fairness problems before the route grammar is ready.

## 7. Lord Malefacto Hit-Readability Audit

### Likely Ambiguity Points

The current Malefacto encounter has several potential ambiguity points: the difference between touching the boss and stomping the boss, whether vulnerability is active, whether the stomp landed deep enough, and whether the flare/attack state is responsible for damage.

### Stomp Timing Readability

The code supports a vulnerability window and stomp check, but the player-facing read likely needs stronger anticipation and confirmation. A good stomp should be unmissable in feedback: boss reaction, audio, brief freeze/flash, player bounce, and clear state change.

### Contact-vs-Hit Confusion

If side contact damages the player while top contact sometimes hurts and sometimes hits, the player must see why. The boss needs visual language that separates "dangerous body," "vulnerable head/top," and "active attack." Without that, players will assume hit detection is inconsistent.

### Recommended Feedback Before Difficulty Tuning

Before changing HP, timings, speed, or damage, add/strengthen feedback:

- Clear vulnerable tell before stomp window.
- Distinct successful-hit response.
- Distinct failed-contact/damage response.
- Brief hit pause or camera/audio punctuation on successful stomp.
- A visible attack-active warning that is not confused with vulnerability.

Do this before difficulty tuning. If the read is unclear, balance numbers will not solve the feel.

## 8. Priority List

### P1: Malefacto Hit Feedback

Improve successful stomp confirmation, failed contact feedback, and vulnerability readability before tuning boss difficulty.

### P1: Platform Route Cleanup

Clean the current campaign route into authored beats with clearer supports, varied spacing, high/low choices, and recovery lanes.

### P2: Controlled Voids

Add local fall-consequence tests only after routes are readable. Start with water gaps or lock drops, not global death pits.

### P2: Calvin Room Beat-Map Polish

Polish Calvin's Creature Room into a readable sketch-world sequence with deliberate puddle, ScuttleMelt, fragment, and door beats.

### P3: Quake Mechanics

Leave Quake as visual staging until Malefacto and core platform readability are stronger. Quake mechanics should come later as a focused branch.

## 9. Recommended Next Code Pass

Run one focused pass only: **Malefacto hit-feedback readability**.

Allowed files for that pass should be limited to:

- `src/scenes/ShorelineScene.ts`
- `src/objects/LordMalefacto.ts`
- `src/config/tuning.ts` only if a feedback timing constant is truly needed
- `src/config/constants.ts` only if referencing an already-approved existing asset/audio key

Locked systems for that pass:

- Level geometry
- Quake route behavior
- Calvin Creature Door behavior
- Player physics and hitboxes
- Player damage rules, except where existing boss-contact feedback needs clearer presentation
- Boss HP/difficulty tuning
- Mobile controls
- Existing assets

The pass should not make Malefacto harder or easier. It should make the current rules legible.

## 10. Stop Conditions

Stop immediately if any of the following become necessary:

- A global death-pit system is required.
- New boss mechanics are proposed.
- Quake behavior or progression is touched.
- Player movement, hitboxes, or core physics need changes.
- New assets are required.
- The work expands beyond one focused readability pass.
- The next change would affect normal campaign, Calvin room, and boss routes at the same time.

The safest near-term path is not more systems. It is making the existing game read cleanly.
