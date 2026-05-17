# Quake Donair Boss Design Source v1

## Purpose

This document locks the first design direction for a possible bonus boss encounter connected to Calvin’s Creature Room before generating art or writing code.

This is a planning/source document only. It does not approve implementation.

## Working Title

Quake — Donair Toss Boss

Alternate names:
- The Donair Don
- Quake the Donair King
- The Old Variety Boss
- Donair Toss Boss

Preferred v1 name:
Quake — Donair Toss Boss

## Core Premise

After the player completes Calvin’s Creature Room and collects all 8 Sketches, the Creature Door may eventually lead into a bonus memory-boss encounter.

The arena is inspired by an old local convenience store / variety store memory: wet pavement, old signage, late-night store glow, childhood corner-store energy, and the feeling of a real place disappearing into memory.

The fight is funny on the surface because the boss throws donairs, but the setting should carry melancholy underneath: a childhood place remembered, distorted, and turned into a playable Calvin-room encounter.

## Permission Status

Current status: not cleared for public release.

Before public release using the real person’s name, likeness, voice, or obvious identity, get a clean written yes.

Minimum permission ask:
“Can I put you in the game as a bonus boss who throws donairs?”

Ideal response:
“Yeah, do it.”

Until permission is clean, this boss remains:
- internal prototype only
- clearly marked as not final
- not used in public marketing
- not presented as endorsed

If permission is not obtained, use a fictionalized in-universe version instead.

## Location / Arena Inspiration

Preferred fictionalized arena name:
The Old Variety

Other options:
- Fairview Memory Mart
- The Memory Mart
- Kwik Memory
- Old Corner Variety

Do not make v1 a literal exact recreation of a real business.

Reason:
- keeps the emotional reference
- avoids unnecessary brand/legal friction
- gives the arena story weight
- allows sketch-world distortion

## Tone Guardrails

The boss must be:
- funny but not cheap
- local but not inside-joke only
- strange but grounded
- playful but not disrespectful
- sketch-world weird but not generic fantasy
- Atlantic / East Coast specific
- emotionally tied to memory and place

The fight should feel like:
A childhood place disappearing, then coming back for one ridiculous boss fight.

Avoid:
- meme-only treatment
- mean parody
- over-realistic human violence
- generic rapper caricature
- fantasy demon version
- neon arcade nonsense
- cheap fast-food mascot energy
- anything that makes Calvin’s room stop feeling like Calvin’s world

## Boss Identity

Working identity:
Quake — Donair Toss Boss

Design direction:
- local-legend energy
- sketch-world guest boss
- confident stance
- readable silhouette
- expressive face
- grounded streetwear / stage-presence influence
- translated into Calvin’s sketch-world, not photorealistic
- respectful playable cameo, not mockery

Do not use a photoreal human sprite for v1.

## Arena Concept

Arena name:
The Old Variety

Visual direction:
- nighttime convenience store exterior
- wet pavement
- old yellow sign glow
- rain sheen
- fireworks sign or old product signage as environmental detail
- half-real place, half-memory distortion
- subtle Calvin sketch marks bleeding into the world
- black sketch puddles on pavement
- faded posters / torn notices
- warm store glow contrasted with cold Atlantic night

Avoid:
- literal brand-heavy recreation
- overly bright cartoon shop
- fantasy portal shop
- cyberpunk neon
- cluttered meme background
- exact real-world signage unless cleared

## Placement in Game Structure

Do not insert the boss into the current Calvin room platform route.

Preferred structure:
1. Player enters Calvin’s Creature Room.
2. Player collects 8 Sketches.
3. Player reaches Creature Door.
4. Creature Door opens.
5. Future branch loads bonus arena: The Old Variety.
6. Player fights Quake — Donair Toss Boss.
7. Player earns special completion / bonus clear card.

This protects the current Calvin room and makes the boss an extra payoff.

## Boss Mechanics v1

Boss HP:
3 hits

Attack 1 — Donair Toss:
- boss throws wrapped donairs in slow arcs
- player jumps over, runs under, or backs away
- contact causes 1 damage
- projectile disappears on wall/ground contact or after leaving arena

Attack 2 — Sauce Splat:
- optional v1.1 mechanic
- donair impact leaves a temporary sauce hazard
- lasts about 1.5 to 2 seconds
- must not look like the black sketch puddles

Attack 3 — Counter Window:
- boss throws 3 donairs
- boss pauses briefly
- player can damage boss during the pause
- boss loses 1 HP
- repeat until 3 hits

## First Implementation Scope

Approved v1 scope should be:
- one boss arena
- one static boss visual
- one donair projectile
- simple timed throw pattern
- 3 HP
- simple damage rules
- simple victory condition
- special completion message

Do not include in v1:
- voice acting
- dialogue trees
- NPC crowd/fans
- multi-phase boss logic
- complex cutscenes
- sauce hazard unless projectile pass is stable
- new player mechanics
- new movement physics
- extra enemy types
- public-facing permission-dependent branding

## Required Assets

Future concept/source assets:
- dev_assets/concepts/quake_donair_boss/old_variety_arena_source_v1.png
- dev_assets/concepts/quake_donair_boss/quake_donair_boss_source_sheet_v1.png
- dev_assets/concepts/quake_donair_boss/donair_projectile_source_v1.png

Future runtime assets:
- public/assets/backgrounds/old_variety_boss_arena_v1.png
- public/assets/sprites/calvin/quake_donair_boss_v1.png
- public/assets/sprites/calvin/donair_projectile_v1.png
- public/assets/sprites/calvin/donair_sauce_splat_v1.png

Runtime files should not be created until concept/source art is approved.

## Locked Existing Systems

Protect:
- current Calvin room route
- Sketch Fragment count and placement
- ScuttleMelt patrol
- black sketch puddles
- Creature Door behavior
- Calvin completion card
- Earth Eyes / Red Bart controls
- Red Bart glide
- desktop behavior
- mobile controls
- normal campaign levels
- Cod B’y / Puffy normal sprites
- existing audio unless explicitly scoped

## Implementation Phases

Phase 0 — Permission / Source Lock:
- confirm permission status
- lock fictionalized or real-name direction
- save permission record externally
- approve this source document

Phase 1 — Arena Concept:
- create old_variety_arena_source_v1.png
- lock memory-store visual direction

Phase 2 — Boss Character Concept:
- create quake_donair_boss_source_sheet_v1.png
- include idle, throwing, hurt/stunned, and optional defeat pose

Phase 3 — Projectile Concept:
- create donair_projectile_source_v1.png
- keep readable at side-scroller scale

Phase 4 — Runtime Asset Prep:
- create runtime PNGs only after concept approval

Phase 5 — Code Implementation v1:
- bonus arena
- boss spawn
- donair projectile arc
- boss HP
- counter window
- victory condition

Phase 6 — Runtime QA:
- boss fight readable
- projectiles fair
- Earth Eyes can complete
- Red Bart can complete
- no regression to Calvin room
- no regression to normal campaign

## QA Checklist

Gameplay:
- Player can enter bonus arena only through intended route.
- Boss does not spawn in the normal Calvin route.
- Donair projectile is readable.
- Donair projectile hit causes expected damage.
- Player can dodge without unfair hits.
- Boss can be damaged during counter window.
- Boss defeat triggers completion cleanly.
- Restart works.
- Normal Calvin room still works.
- Normal campaign still works.

Visual:
- Arena reads as memory-store / old variety-store.
- Boss reads as sketch-world guest boss.
- Donair projectile reads clearly at game scale.
- No real-world signage creates permission risk.
- Tone stays funny but grounded.
- No generic fantasy drift.

Production:
- No broad refactors.
- No package changes.
- No physics changes unless explicitly approved.
- Build passes.
- Git status clean before commit.
- One focused commit per pass.

## Current Status

Document created as planning source.

No art approved yet.
No code approved yet.
No public use approved yet.
Permission still needs explicit clean confirmation before public-facing release.
