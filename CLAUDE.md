# CLAUDE.md — Cod B’y & Puffy: Shoreline Run

## Project Role

You are assisting with a premium Atlantic Canada 2D side-scrolling game prototype by Lucas & Liam Legacy Studios.

The game should feel grounded, cinematic, restrained, regional, and original. Do not turn it into a generic mascot platformer, fantasy game, or mobile-game reskin.

## Operating Rules

1. Make the smallest safe change that solves the task.
2. Do not modify unrelated files.
3. Preserve existing working behavior unless explicitly asked to change it.
4. Preserve locked visuals, canon, level progression, music, SFX, and gameplay mechanics.
5. Reuse existing systems before creating new ones.
6. Avoid unnecessary dependencies.
7. Do not install packages unless explicitly approved.
8. Do not edit package.json, package-lock.json, deployment files, Git config, .env, credentials, or security-sensitive files unless specifically asked.
9. Run npm run build after code changes.
10. Do not push to Git unless explicitly instructed.

## Current Game State

The game currently has:
- Level 1 shoreline stage
- Level 2 heritage/forge stage
- Level 3 St. Peter’s Canal stage
- Level-specific music
- Scuttleclaw patrol enemy
- Scuttleclaw stomp defeat
- Scuttleclaw sprite atlas
- Scuttleclaw stomp SFX
- Tiderunner being developed as a helper/power-up prototype

## Character / Mechanic Locks

### Scuttleclaw

Scuttleclaw is an ACU-original Atlantic shoreline crab enemy.

Preserve:
- patrol behavior
- side contact damage
- stomp defeat
- restart reset behavior
- sprite atlas integration
- stomp SFX

Do not redesign Scuttleclaw unless explicitly asked.

### Tiderunner

Tiderunner is an ACU-original Atlantic seahorse helper.

Prototype direction:
- helper/power-up, not a full mount system yet
- temporary TideRun buff
- water-hazard safety while active
- modest movement boost
- Level 3 introduction only
- placeholder runtime visual until final art is prepared

Avoid:
- riding/mount system
- copied third-party mount behavior
- fantasy magic drift
- cute/plush/tropical styling

## Git Workflow

Before editing:
- Check git status.
- If the repo is not clean, stop and report.

After editing:
- Report files changed.
- Report what changed.
- Report what stayed locked.
- Run npm run build.
- Do not commit or push unless instructed.

## Required Report Format

After every task, report:

- Pre-check result
- Files changed
- What changed
- What stayed locked
- Build/test result
- Security-sensitive files touched, if any
- Remaining risks
