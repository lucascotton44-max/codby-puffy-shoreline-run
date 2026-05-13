# Shoreline Run Production Workflow

## Purpose

This document is the operating source for building **Cod B’y & Puffy: Shoreline Run** without drift, wasted prompts, broken working systems, or fake progress.

The goal is not to generate more code. The goal is to move the game toward a public website demo with controlled, verified, compoundable progress.

## Core Standard

A change is not considered successful because an AI report says it worked.

A change is only successful when it is proven by:

1. Correct repo path
2. Clean pre-check
3. Narrow file scope
4. Build passing
5. Runtime evidence
6. Screenshot/video proof when visual or gameplay behavior is involved
7. Clean commit
8. Push only after smoke test

## Production Doctrine

### Build small

One focused implementation goal per pass.

Good:

- Fix completion overlay copy only
- Add one Bras d’Or bubble vent only
- Tune mobile HUD only

Bad:

- Improve UI, controls, art, progression, and polish at the same time
- Redesign the level while fixing a restart bug
- Add mechanics before QA confirms the last mechanic works

### Trust screenshots and code, not reports

AI reports are treated as claims. They must be verified.

Required proof types:

- Code exists locally: `git grep`
- Correct repo: `git rev-parse --show-toplevel`
- Dirty scope: `git status --short`
- Build: `npm.cmd run build`
- Runtime: screenshot or screen recording
- Commit state: `git log --oneline -5`

### Protect working systems

When a system passes QA, it becomes locked unless the task directly targets it.

Currently protected:

- Mobile tap-to-start
- Hold left/right
- Jump while moving
- Puffy glide on jump hold
- Switch once per tap
- Tap restart after game over/completion
- Desktop keyboard controls
- Debug H toggle
- Bras d’Or bubble vent behavior
- Bras d’Or eelgrass behavior
- Bras d’Or current-zone behavior
- Final campaign restart flow
- Compact mobile HUD and FS button

## Standard Workflow

Every implementation pass follows this order.

### 1. Confirm the problem

Before writing a prompt, identify the issue precisely.

Format:

```text
Priority — Area — Problem
P1 Boss restart flow — Final win restarts boss instead of full campaign.
P2 Completion copy — Long internal level names overflow/feel ugly.
P3 Platform dressing — Bars read as debug rectangles instead of underwater ledges.
```

Priority rules:

- **P0**: crash, cannot load, cannot complete
- **P1**: progression blocker, broken control, impossible/unfair gameplay
- **P2**: confusing but playable, misleading UI, unclear mechanic
- **P3**: polish, visual quality, trailer-readiness

### 2. Inspect before prompting

Do not prompt blindly.

Use Git Bash to find the real code location first.

Common commands:

```bash
cd /c/Dev/shoreline-run

git status --short

git --no-pager grep -n "searchTerm" -- src/scenes/ShorelineScene.ts src/config/levels.ts
```

For line ranges:

```bash
nl -ba src/scenes/ShorelineScene.ts | sed -n '2360,2445p'
```

If the terminal enters pager mode, press:

```text
q
```

If stuck:

```text
Ctrl + C
```

### 3. Write a surgical prompt

Every prompt must include:

- Actual repo path
- Goal
- Pre-check
- Allowed files
- Locked files/systems
- Observed bug
- Required fix
- Preserve behavior
- Verification commands
- Report requirements
- Do not commit

Prompt must not include broad language like:

- “polish the game”
- “improve everything”
- “make it better”
- “clean up UI” without exact acceptance criteria

### 4. Require proof in the report

Every AI implementation report must include:

```text
- git status --short
- files changed
- build result
- exact functions/lines changed
- what stayed locked
- risk areas
- confirmation no unrelated systems changed
```

For previous wrong-worktree failures, require:

```bash
git rev-parse --show-toplevel
git --no-pager grep -n "newFunctionOrFieldName" -- relevant/file.ts
```

If the code is not visible in `/c/Dev/shoreline-run`, the report is rejected.

### 5. Verify locally before testing

After AI reports success, run:

```bash
cd /c/Dev/shoreline-run

git status --short
git --no-pager diff --stat
npm.cmd run build
```

If the task added named code, verify it:

```bash
git --no-pager grep -n "expectedFunctionName\|expectedFieldName" -- src/scenes/ShorelineScene.ts src/config/levels.ts
```

### 6. Runtime test with evidence

Use the correct server command:

```bash
cd /c/Dev/shoreline-run

powershell.exe -NoProfile -Command "Stop-Process -Name node -Force -ErrorAction SilentlyContinue"

npm.cmd run dev -- --host 0.0.0.0 --port 5173 --strictPort
```

Desktop URLs:

```text
http://localhost:5173/
http://localhost:5173/?level=bras-dor-below-level-05
```

Mobile URLs:

```text
http://192.168.0.65:5173/
http://192.168.0.65:5173/?level=bras-dor-below-level-05
```

If the page looks wrong, inspect the URL before assuming code broke.

Correct:

```text
http://localhost:5173/?level=bras-dor-below-level-05
```

Wrong:

```text
localhost:5173/http://localhost:5173/?level=bras-dor-below-level-05
```

### 7. Commit only after proof

Never use:

```bash
git add .
```

Stage exact files only:

```bash
git add src/scenes/ShorelineScene.ts
```

or:

```bash
git add src/config/levels.ts src/scenes/ShorelineScene.ts
```

Commit:

```bash
git commit -m "Clear imperative commit message"
```

Then verify:

```bash
git status --short
git --no-pager log --oneline -5
```

### 8. Push only after smoke test

Before push:

```bash
git status --short
npm.cmd run build
```

Push:

```bash
git push origin master
```

Verify:

```bash
git status --short
git --no-pager log --oneline -5
```

## Prompt Template

Use this template for future Codex/Claude prompts.

```text
You are working in the actual main Shoreline Run repo:

/c/Dev/shoreline-run

Goal:
[One precise goal only.]

This is a [code/UI/level-design/visual/audio/progression] pass only. Do not change unrelated systems.

Pre-check:
Run:

git rev-parse --show-toplevel
git status --short

Expected:
- repo root is /c/Dev/shoreline-run
- git status is clean

If not true, stop and report.

Allowed files:
- [exact file list]

Locked:
- all other files
- package.json
- package-lock.json
- assets unless explicitly allowed
- audio unless explicitly allowed
- controls/input behavior unless this is the task
- movement/physics unless this is the task
- level data unless this is the task
- campaign progression unless this is the task

Observed problem:
[Exact issue from screenshot/video/code inspection.]

Required fix:
1. [Specific requirement]
2. [Specific requirement]
3. [Specific requirement]

Preserve:
- [working behavior]
- [working behavior]
- [working behavior]

Verification:
Run:

npm.cmd run build

Report:
- git status --short
- files changed
- build result
- exact changes made
- exact behavior preserved
- risk areas

Do not commit.
```

## Public Demo Readiness Gates

A build is not public-demo ready unless all gates pass.

### Gate 1 — Load

- Normal campaign loads at `/`
- Bras d’Or test loads at `?level=bras-dor-below-level-05`
- No broken textures
- No console-visible crash behavior

### Gate 2 — Desktop Controls

- Arrow/WASD movement
- Space jump
- 1/2 switch
- R restart
- Enter next level where applicable
- H debug still works

### Gate 3 — Mobile Controls

- Tap to start
- Hold left/right
- Jump while moving
- Puffy glide on jump hold
- Switch once per tap
- Tap restart/advance
- FS button visible and harmless if fullscreen unsupported

### Gate 4 — Progression

- Level completion advances correctly
- Boss/final completion does not trap player at boss
- Final campaign win restarts run from Level 1
- Direct test URL completion restarts the test level

### Gate 5 — UI

- Mobile HUD is compact
- Helper/debug text hidden on mobile
- Completion overlay does not compete with HUD
- Completion copy is short and readable
- No contradictory TAP instructions

### Gate 6 — Gameplay Readability

- Hazards are readable
- Scuttleclaws are visible
- Bubble vent teaches jump/fall into bubbles for lift
- Eelgrass reads as slowdown terrain
- Current zone reads as moving water
- Required relic count is achievable without expert play

### Gate 7 — Trailer Readiness

- At least three clean 3–5 second gameplay moments exist
- UI does not dominate capture
- No obvious debug artifacts in normal mode
- Visual tone remains grounded Atlantic, not cartoon/fantasy excess

## Current Do-Not-Drift Rules

Do not add new mechanics until current QA list is gathered.

Do not add:

- swimming system
- new enemies
- new boss behavior
- more underwater mechanics
- new assets
- broad HUD redesign
- physics changes

Until after:

1. Full campaign QA recording
2. Bras d’Or QA recording
3. P0/P1/P2/P3 bug list
4. Fix-priority decision

## Definition of Real Progress

Real progress is not “more features.”

Real progress is:

- fewer blockers
- clearer controls
- stronger level readability
- cleaner public demo flow
- verified mobile playability
- cleaner trailer capture
- cleaner commit history

If a change does not improve one of those, it waits.

## Best Next Production Phase

Current priority after the Bras d’Or/mobile/progression stack:

1. Record level-section playthroughs
2. Build a bug list
3. Fix P0/P1 first
4. Fix high-impact P2 next
5. Only then add polish or new mechanics

