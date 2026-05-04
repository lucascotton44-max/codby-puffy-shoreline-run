# Shoreline Run Fix Log

Last updated: 2026-05-04

## Purpose

Repo source of truth for issues found during production of Cod B’y & Puffy: Shoreline Run.

Use the fix-log chat for fast intake. End of day: compress confirmed items into this file.

---

## Priority Scale

- P0 — Blocker: prevents build, testing, gameplay progression, visual QA, or trailer capture.
- P1 — High: hurts usability, controls, clarity, or core gameplay but does not fully block testing.
- P2 — Medium: polish, presentation, clarity, minor visual/audio/UI improvements.
- P3 — Low: nice-to-have, later polish, optional enhancements.

---

## Status Scale

- Active: needs investigation or fix.
- In Progress: currently being worked on.
- Needs QA: fix exists, needs verification.
- Verified: tested and accepted.
- Deferred: intentionally postponed.
- Closed: resolved and committed.

---

## Active Fix List

| Priority | Area | Issue | Status | Next Action |
|---|---|---|---|---|
| P0 | Level 1A / Backdrop | Bridge test slice loads, but bridge backdrop does not appear | Active | Diagnose asset preload/path/level selection/rendering |
| P1 | Start Screen / Desktop | Desktop start screen needs clearer usability | Logged | Review start overlay after bridge blocker |
| P2 | UI / Browser | Add fullscreen button | Logged | Separate UI pass after gameplay slice stabilizes |

---

# Fix Details

## P0 — Bridge Level 1A backdrop does not appear

Date found: 2026-05-04  
Area: Level 1A / asset loading / background rendering  
Status: Active  
Phase: Code / QA  

Expected:
Loading ?level=bridge_crossing_1a should show public/assets/backgrounds/st_peters_bridge_crossing.png.

Actual:
Bridge test slice loads, but the new bridge backdrop does not appear.

Impact:
Blocks visual QA, platform alignment review, camera review, bridge route readability review, and trailer-readiness review for Sub-Level 1A.

Likely causes to verify:
- asset not preloaded
- wrong texture key/path
- scene background rendering still hardcoded
- level query not selecting bridge_crossing_1a
- stale dev server/cache
- runtime asset exists but is not registered in Phaser preload/create flow

Next action:
Run diagnostics before touching geometry, start screen, fullscreen UI, enemies, collectibles, or polish.

---

## P1 — Desktop start screen usability

Date found: 2026-05-04  
Area: Start screen / desktop UX  
Status: Logged  
Phase: UI / Controls  

Issue:
Desktop start screen needs clearer start instruction.

Expected:
Start screen should clearly communicate Press Enter / Space / Click to Start or equivalent.

Constraints:
Must preserve mobile tap-to-start, desktop keyboard behavior, trailer capture mode, and existing title overlay behavior.

Next action:
Handle as a separate UI pass after the bridge backdrop blocker is fixed.

---

## P2 — Fullscreen button

Date found: 2026-05-04  
Area: UI / browser usability  
Status: Logged  
Phase: UI  

Issue:
Add a small fullscreen button.

Expected:
Clean and unobtrusive. Useful on desktop/browser. Does not block mobile controls, clutter gameplay, or appear in trailer capture mode unless intentionally enabled.

Constraints:
Do not mix with bridge backdrop loading, geometry, or start screen fixes.

Next action:
Separate UI pass after gameplay slice stabilizes.

---

# Daily Update Notes

## 2026-05-04

Added:
- Started repo-based fix log.
- Logged bridge Level 1A backdrop issue as current P0.
- Logged desktop start screen usability as P1.
- Logged fullscreen button as P2.

Current production order:
1. Fix bridge backdrop not appearing.
2. QA bridge slice visually.
3. Adjust bridge geometry/camera if needed.
4. Commit bridge Level 1A integration.
5. Improve desktop start screen.
6. Add fullscreen button.
