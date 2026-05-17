# Quake Bonus Branch Implementation Plan v1

## 1. Purpose

This document plans a future optional Quake Donair Boss bonus branch from Calvin's Creature Room.

It is documentation only. It does not approve implementation, create runtime assets, or change the existing Calvin room completion path.

The core rule: do not replace or break the existing Calvin Creature Door completion behavior in the first boss pass. The boss branch must be additive and optional unless a later prompt explicitly approves a campaign-flow change.

## 2. Current Locked Source Package

The current source package is:

- `docs/quake_donair_boss_design_source_v1.md`
- `dev_assets/concepts/quake_donair_boss/quake_donair_boss_art_direction_lock_v1.md`
- `dev_assets/concepts/quake_donair_boss/old_variety_arena_source_v1.png`
- `dev_assets/concepts/quake_donair_boss/quake_donair_boss_source_sheet_v1.png`
- `dev_assets/concepts/quake_donair_boss/donair_projectile_source_v1.png`

These are source/planning assets only. Runtime extraction and code implementation should happen in later scoped passes.

## 3. Recommended Branch Structure

Recommended future work branch:

`codex/quake-donair-boss-bonus-branch`

Recommended commit sequence:

1. Runtime asset prep for Old Variety arena, Quake boss, and donair projectile.
2. Data-only level definition for the optional Old Variety bonus arena.
3. Scene support for optional branch routing from Calvin completion state.
4. Boss object and donair projectile behavior.
5. QA polish and final acceptance fixes.

Keep each pass small and independently buildable.

## 4. Branch Decision

Quake Donair Boss is optional bonus content, not required for Calvin room completion yet.

The first implementation should preserve:

- Calvin's Creature Room completion after 8 Sketch Fragments.
- Creature Door endpoint behavior.
- Calvin completion card.
- Direct URL access to Calvin's room.
- Normal campaign progression.

The future boss branch may be entered only through an explicitly approved optional path, such as a test-only direct level URL or a clearly gated post-completion branch.

Do not make Quake required to finish Calvin's Creature Room in v1.

## 5. Proposed Future Level Key / Name

Proposed level id:

`quake-donair-boss-old-variety`

Proposed level name:

`The Old Variety`

Proposed boss display name:

`Quake - Donair Toss Boss`

Permission note:

If public permission is not clean, use a fictionalized in-universe boss name before release.

## 6. Proposed Future Runtime Assets

Future runtime assets should be created only after source art is approved for extraction.

Recommended runtime paths:

- `public/assets/backgrounds/old_variety_boss_arena_v1.png`
- `public/assets/sprites/calvin/quake_donair_boss_v1.png`
- `public/assets/sprites/calvin/donair_projectile_v1.png`

Optional later runtime asset:

- `public/assets/sprites/calvin/donair_sauce_splat_v1.png`

Do not create sauce splat runtime art until the projectile-only fight is stable.

## 7. V1 Implementation Scope

V1 should include:

- One optional bonus arena.
- One static or limited-pose Quake boss visual.
- One wrapped donair projectile visual.
- Simple timed donair toss pattern.
- Projectile contact causes damage.
- Boss has 3 HP.
- Counter window after a throw sequence.
- Player damages boss only during the counter window.
- Humbled non-injury defeat state.
- Bonus clear message/card.
- Direct test URL for the bonus arena if useful during development.

V1 should not include:

- Sauce splat hazards.
- Voice acting.
- Dialogue trees.
- NPC crowd.
- Multi-phase behavior.
- Public-facing real-person endorsement.
- Changes to player movement.
- Changes to Calvin's room route.

## 8. Locked Systems That Must Not Change

Protect:

- Existing Calvin Creature Door completion behavior.
- Calvin's 8 Sketch Fragment requirement.
- Calvin room platforms.
- Calvin room black sketch puddles.
- ScuttleMelt patrol.
- Earth Eyes Bart / Red Bart visuals and controls.
- Red Bart glide behavior.
- Calvin HUD and completion card.
- Normal campaign levels.
- Normal Cod B'y / Puffy sprites and controls.
- Existing audio unless a later audio-specific pass approves a boss track or SFX.
- Package files and dependencies.

Any implementation prompt must repeat these locks.

## 9. Deferred Features

Defer:

- Sauce splat temporary hazards.
- Page Tear / Chalk Gate routing.
- Cutscenes.
- Boss dialogue.
- Crowd/fans.
- Advanced AI.
- Multi-phase fight.
- Alternate endings.
- Public release naming/likeness decisions.
- Mobile-specific boss UI polish.
- Runtime animation sheets beyond what v1 needs.

These can be considered only after the basic optional boss fight is readable, fair, and non-regressive.

## 10. QA Checklist

Before any future boss implementation commit:

- Build passes.
- Git status contains only intended scoped files.
- Calvin's Creature Room still completes normally without Quake.
- Creature Door still behaves correctly before and after 8 Sketches.
- Direct Calvin room test URL still works.
- Normal campaign still works.
- The optional bonus arena loads only through approved route or test URL.
- Quake boss stays inside the arena.
- Donair projectile path is readable.
- Donair projectile hit causes expected damage.
- Player can dodge without unfair hits.
- Counter window is visually clear.
- Boss can be damaged only during the intended window.
- Boss defeat is funny and respectful, with no injury/gore.
- Restart behavior works.
- Mobile controls remain usable.
- No real logos or unsafe signage appear in runtime assets.

## 11. Stop Conditions

Stop implementation if:

- Quake becomes required for Calvin room completion without explicit approval.
- Existing Creature Door completion behavior is replaced or broken.
- The fight needs broad scene refactors to work.
- Donair projectile readability is poor.
- The boss reads as parody, exact likeness, mascot, fantasy demon, or generic rapper caricature.
- Runtime assets include real logos or brand marks.
- Calvin room, normal campaign, controls, or physics regress.
- The pass touches locked files outside its explicit scope.

## 12. Future Codex Implementation Prompt Skeleton

```text
You are working in /c/Dev/shoreline-run.

Goal:
Implement [one narrow Quake Donair Boss bonus-branch task].

Use and follow:
- docs/quake_donair_boss_design_source_v1.md
- dev_assets/concepts/quake_donair_boss/quake_donair_boss_art_direction_lock_v1.md
- dev_assets/concepts/quake_donair_boss/quake_bonus_branch_implementation_plan_v1.md

Pre-check:
Run:
git rev-parse --show-toplevel
git status --short
git --no-pager log --oneline -8

Expected:
- repo root is /c/Dev/shoreline-run
- git status is clean
- latest commit includes: [expected commit]

Allowed files:
- [exact files for this narrow pass]

Locked:
- existing Calvin Creature Door completion behavior
- Calvin room route, platforms, fragments, puddles, ScuttleMelt
- Earth Eyes / Red Bart movement, controls, hitboxes
- normal campaign levels
- package files
- all unrelated assets/code

Required:
- [specific small implementation]
- preserve current Calvin completion
- keep Quake branch optional/test-only unless explicitly approved

Verification:
Run:
git status --short
git --no-pager diff --stat
git --no-pager diff -- [allowed files]
npm.cmd run build

Report:
- files changed
- build result
- exact behavior added
- confirmation Calvin Creature Door completion is unchanged
- confirmation normal campaign is unchanged
- risk areas
- do not commit
```

Use this skeleton to keep future work narrow, testable, and additive.
