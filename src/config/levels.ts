import type { HazardKind } from '../objects/Hazard.js';
import type { PowerUpKind } from '../objects/PowerUp.js';
import {
  ASSET_PATHS,
  AUDIO_KEYS,
  COLORS,
  END_X,
  GROUND_Y,
  REQUIRED_FRAGMENTS,
  START_X,
  TEXTURE_KEYS,
  TOTAL_FRAGMENTS,
  WORLD_WIDTH,
} from './constants.js';

export type PlatformDefinition = {
  x: number;
  y: number;
  width: number;
  height: number;
  color: number;
};

export type HazardDefinition = {
  x: number;
  y: number;
  width: number;
  height: number;
  kind: HazardKind;
};

export type FragmentDefinition = {
  x: number;
  y: number;
};

export type PowerUpDefinition = {
  kind: PowerUpKind;
  x: number;
  y: number;
};

export type ScuttleclawDefinition = {
  x: number;
  y: number;
  minX: number;
  maxX: number;
  speed?: number;
  damage?: number;
};

export type LordMalefactoDefinition = {
  x: number;
  y: number;
  hp?: number;
  damage?: number;
};

export type BubbleVentDefinition = {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Upward velocity cap applied while player is airborne inside the zone (px/s). */
  boostVelocity: number;
};

export type EelgrassZoneDefinition = {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Horizontal speed multiplier while inside the zone (0–1). */
  slowMultiplier: number;
};

export type CurrentZoneDefinition = {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Target rightward drift speed (px/s). Player input remains fully effective;
   *  the nudge stops once player velocity already exceeds this value in that direction. */
  velocityBias: number;
};

export type ChalkTriggerDefinition = {
  x: number;
  y: number;
  width: number;
  height: number;
  targetLevelId: string;
};

export type LevelDefinition = {
  id: string;
  name: string;
  backdropPath: string;
  backdropTextureKey: string;
  musicAudioKey: string;
  worldWidth: number;
  startX: number;
  endX: number;
  totalFragments: number;
  requiredFragments: number;
  platforms: PlatformDefinition[];
  hazards: HazardDefinition[];
  fragments: FragmentDefinition[];
  powerUps: PowerUpDefinition[];
  scuttleclaws: ScuttleclawDefinition[];
  boss?: LordMalefactoDefinition;
  bubbleVents?: BubbleVentDefinition[];
  eelgrassZones?: EelgrassZoneDefinition[];
  currentZones?: CurrentZoneDefinition[];
  chalkTrigger?: ChalkTriggerDefinition;
  /** Hidden tribute slice; not part of normal campaign progression. */
  secretLevel?: boolean;
  /** Test/dev slice — excluded from normal campaign progression. Load via ?level=<id>. */
  testOnly?: boolean;
};

export const LEVELS: LevelDefinition[] = [
  // ── Campaign 1 — Shoreline intro ─────────────────────────────────────────
  {
    id: 'shoreline-run-level-01',
    name: 'Shoreline Run',
    backdropPath: ASSET_PATHS.shorelineRunLevel01Backdrop,
    backdropTextureKey: TEXTURE_KEYS.shorelineRunLevel01Backdrop,
    musicAudioKey: AUDIO_KEYS.shorelineThemeLoop,
    worldWidth: WORLD_WIDTH,
    startX: START_X,
    endX: END_X,
    totalFragments: TOTAL_FRAGMENTS,
    requiredFragments: REQUIRED_FRAGMENTS,
    platforms: [
      { x: 375, y: GROUND_Y + 26, width: 750, height: 70, color: COLORS.shore },
      { x: 1240, y: GROUND_Y + 26, width: 620, height: 70, color: COLORS.shore },
      { x: 2050, y: GROUND_Y + 26, width: 920, height: 70, color: COLORS.shore },
      { x: 720, y: 390, width: 190, height: 22, color: COLORS.dock },
      { x: 980, y: 338, width: 180, height: 22, color: COLORS.dock },
      { x: 1510, y: 408, width: 210, height: 22, color: COLORS.dock },
      { x: 1750, y: 350, width: 160, height: 22, color: COLORS.dock },
      { x: 2230, y: 384, width: 220, height: 22, color: COLORS.dock },
    ],
    hazards: [
      { x: 805, y: 515, width: 190, height: 54, kind: 'water' },
      { x: 1645, y: 515, width: 240, height: 54, kind: 'water' },
      { x: 1290, y: 464, width: 46, height: 34, kind: 'rock' },
      { x: 1905, y: 464, width: 50, height: 34, kind: 'rock' },
      { x: 2325, y: 360, width: 44, height: 44, kind: 'net' },
    ],
    fragments: [
      { x: 230, y: 430 },
      { x: 560, y: 430 },
      { x: 720, y: 350 },
      { x: 980, y: 298 },
      { x: 1180, y: 430 },
      { x: 1510, y: 368 },
      { x: 1760, y: 310 },
      { x: 2060, y: 430 },
      { x: 2235, y: 344 },
      { x: 2440, y: 430 },
    ],
    powerUps: [
      { kind: 'kelpShield', x: 620, y: 430 },
      { kind: 'tideLift', x: 910, y: 298 },
      { kind: 'storySpark', x: 1685, y: 310 },
    ],
    scuttleclaws: [
      // First campaign enemy — late section 3; slow speed; player has 440px run-up before patrol
      { x: 2120, y: GROUND_Y - 20, minX: 2030, maxX: 2230, speed: 44, damage: 1 },
    ],
    chalkTrigger: {
      x: 42,
      y: GROUND_Y - 32,
      width: 28,
      height: 44,
      targetLevelId: 'calvins-creature-room',
    },
  },
  // ── Campaign 2 — Bridge crossing (St. Peter's Canal) ─────────────────────
  // Also accessible directly via: ?level=bridge_crossing_1a
  {
    id: 'bridge_crossing_1a',
    name: "St. Peter's Canal — Bridge Crossing",
    backdropPath: ASSET_PATHS.stPetersBridgeCrossingBackdrop,
    backdropTextureKey: TEXTURE_KEYS.stPetersBridgeCrossingBackdrop,
    musicAudioKey: AUDIO_KEYS.level03CanalTheme,
    worldWidth: 3900,
    startX: START_X,
    endX: 3500,
    totalFragments: 10,
    requiredFragments: 8,
    platforms: [
      // Left bank — concrete towpath; player spawns here; right edge x=660 visible in spawn viewport
      // x=340 w=640 → left x=20, right x=660
      { x: 340, y: GROUND_Y + 26, width: 640, height: 70, color: COLORS.shore },
      // Left approach ledge — 50 px gap / 43 px hop up from bank; visible from spawn; canal-wall entry step
      // x=830 w=240 → left x=710, right x=950
      { x: 830, y: 451, width: 240, height: 22, color: COLORS.shore },
      // Left concrete service ledge — 50 px gap at same level; top of left canal wall
      // x=1140 w=280 → left x=1000, right x=1280
      { x: 1140, y: 451, width: 280, height: 22, color: COLORS.shore },
      // Left timber fender — 50 px gap at same level; first plank crossing over canal
      // x=1430 w=200 → left x=1330, right x=1530
      { x: 1430, y: 451, width: 200, height: 22, color: COLORS.dock },
      // Bridge maintenance catwalk — 30 px gap / 45 px hop up; wider under-bridge section
      // x=1800 w=480 → left x=1560, right x=2040
      { x: 1800, y: 406, width: 480, height: 22, color: COLORS.dock },
      // Right timber fender — 40 px gap / 45 px walk-off drop from catwalk (no jump needed)
      // x=2180 w=200 → left x=2080, right x=2280
      { x: 2180, y: 451, width: 200, height: 22, color: COLORS.dock },
      // Right concrete service ledge — 60 px gap at same level; top of right canal wall
      // x=2480 w=280 → left x=2340, right x=2620
      { x: 2480, y: 451, width: 280, height: 22, color: COLORS.shore },
      // Right approach ledge — 50 px gap at same level; canal-wall exit step
      // x=2790 w=240 → left x=2670, right x=2910
      { x: 2790, y: 451, width: 240, height: 22, color: COLORS.shore },
      // Right bank / towpath — 40 px gap / 43 px walk-off drop; wide landing before CH 8
      // x=3400 w=900 → left x=2950, right x=3850; endX=3500 at 550 px inside bank
      { x: 3400, y: GROUND_Y + 26, width: 900, height: 70, color: COLORS.shore },
    ],
    hazards: [
      // Canal water — spans exactly bank to bank; top y=488 is 5 px below ground surface y=483
      // x=1805 w=2290 → left x=660 (left bank right edge), right x=2950 (right bank left edge)
      { x: 1805, y: 515, width: 2290, height: 54, kind: 'water' },
      // Rock debris — on left service ledge (top=440); y=421 matches 19px-above-top rule from campaign levels
      // x=1160: 160px from ledge left edge (landing zone clear), 120px from ledge right edge (exit clear)
      { x: 1160, y: 421, width: 48, height: 34, kind: 'rock' },
      // Rock on catwalk (top=395); y=376 follows 19px-above-top rule; TideLift at 1800 rewards clearing it
      // Fragment at 1680 is 170px left (clear approach); fragment at 1900 is 50px right (post-rock reward)
      { x: 1850, y: 376, width: 48, height: 34, kind: 'rock' },
      // Rock on right service ledge (mirrors left side); fragment at 2480 is 60px left — collectible first
      { x: 2540, y: 421, width: 48, height: 34, kind: 'rock' },
    ],
    fragments: [
      { x: 200, y: 448 },   // left bank — early
      { x: 480, y: 448 },   // left bank — mid; leads eye toward approach ledge ahead
      { x: 830, y: 406 },   // above left approach ledge
      { x: 1140, y: 406 },  // above left service ledge
      { x: 1430, y: 406 },  // above left timber fender
      { x: 1680, y: 360 },  // catwalk — entry; rewards the hop up
      { x: 1900, y: 360 },  // catwalk — mid; encourages full traversal
      { x: 2180, y: 406 },  // above right timber fender
      { x: 2480, y: 406 },  // above right service ledge
      { x: 3350, y: 448 },  // right bank — past Scuttleclaw patrol; reward after clearing the crab
    ],
    powerUps: [
      { kind: 'kelpShield', x: 570, y: 448 },  // left bank, last safe pickup before canal
      { kind: 'tideLift', x: 1800, y: 356 },   // bridge catwalk centre
    ],
    scuttleclaws: [
      // Right towpath — ground level (y=GROUND_Y-20 matches campaign convention); mid-to-late beat
      // patrol 3060–3260: 110px clear buffer from player landing zone (~2970); endX=3500 is 240px past patrol
      { x: 3150, y: GROUND_Y - 20, minX: 3060, maxX: 3260, speed: 52, damage: 1 },
    ],
  },
  // ── Campaign 3 — Canal edge to locks ─────────────────────────────────────
  // Also accessible directly via: ?level=shoreline-run-level-01b
  // Route: wide dirt towpath running alongside canal → lock gate (endX).
  // Three 80px water gaps interrupt the path; each has a low dock platform
  // (y=451, top=440) straddling the gap so the player can either jump the gap
  // directly at ground level OR hop up 43px to the dock for elevated fragments.
  // All hops are within Cod B'y's 84px max jump. No precision required.
  {
    id: 'shoreline-run-level-01b',
    name: "St. Peter's Canal — Canal Edge to Locks",
    backdropPath: ASSET_PATHS.level01bCanalEdgeToLocksBackdrop,
    backdropTextureKey: TEXTURE_KEYS.level01bCanalEdgeToLocksBackdrop,
    musicAudioKey: AUDIO_KEYS.level03CanalTheme,
    worldWidth: 3200,
    startX: START_X,
    endX: 3060,
    totalFragments: TOTAL_FRAGMENTS,
    requiredFragments: REQUIRED_FRAGMENTS,
    platforms: [
      // Ground sections — dirt towpath; gaps are 80px (easily jumped or dock-hopped)
      // Section 1: wide starting area x=0–900
      { x: 450, y: GROUND_Y + 26, width: 900, height: 70, color: COLORS.shore },
      // Section 2: canal-edge mid x=980–1620
      { x: 1300, y: GROUND_Y + 26, width: 640, height: 70, color: COLORS.shore },
      // Section 3: approaching lock x=1700–2420
      { x: 2060, y: GROUND_Y + 26, width: 720, height: 70, color: COLORS.shore },
      // Section 4: lock gate area x=2500–3200; endX=3060 is 560px inside
      { x: 2850, y: GROUND_Y + 26, width: 700, height: 70, color: COLORS.shore },
      // Low dock platforms — 43px hop from ground (top=440); straddle each water gap
      // Each dock overlaps 50px into the adjacent ground sections on both sides
      { x: 940, y: 451, width: 180, height: 22, color: COLORS.dock },   // gap 1: x=850–1030
      { x: 1660, y: 451, width: 180, height: 22, color: COLORS.dock },  // gap 2: x=1570–1750
      { x: 2460, y: 451, width: 180, height: 22, color: COLORS.dock },  // gap 3: x=2370–2550
    ],
    hazards: [
      // Three canal-water breaks — 80px each; top=488 (5px below ground top 483)
      { x: 940, y: 515, width: 80, height: 54, kind: 'water' },   // gap 1: x=900–980
      { x: 1660, y: 515, width: 80, height: 54, kind: 'water' },  // gap 2: x=1620–1700
      { x: 2460, y: 515, width: 80, height: 54, kind: 'water' },  // gap 3: x=2420–2500
      // Ground rock — mid section 3 (x=1700–2420); 150px clear each side; breaks flat-path feel
      { x: 2050, y: 464, width: 48, height: 34, kind: 'rock' },
    ],
    fragments: [
      { x: 200,  y: 430 },  // section 1 — early towpath
      { x: 560,  y: 430 },  // section 1 — mid towpath
      { x: 840,  y: 406 },  // dock 1 left approach — 77px from ground (within Cod B'y jump)
      { x: 1160, y: 430 },  // section 2 — canal edge
      { x: 1420, y: 430 },  // section 2 — before gap 2
      { x: 1660, y: 406 },  // dock 2 — reward for hopping up
      { x: 1900, y: 430 },  // section 3 — lock approach early
      { x: 2200, y: 430 },  // section 3 — lock approach late
      { x: 2460, y: 406 },  // dock 3 — reward for hopping up
      { x: 2820, y: 430 },  // section 4 — lock gate arrival
    ],
    powerUps: [
      { kind: 'kelpShield', x: 400, y: 430 },   // section 1 — protection before first gap
      { kind: 'tideLift',   x: 1340, y: 430 },  // section 2 — optional boost for dock fragments
    ],
    scuttleclaws: [
      // Section 4 — 140px landing zone before patrol; fragment at 2820 within zone (deliberate collect)
      { x: 2750, y: GROUND_Y - 20, minX: 2640, maxX: 2870, speed: 46, damage: 1 },
    ],
  },
  // ── Campaign 4 — St. Peter's Canal ───────────────────────────────────────
  {
    id: 'st-peters-canal-level-03',
    name: "St. Peter's Canal",
    backdropPath: ASSET_PATHS.stPetersCanalLevel03Backdrop,
    backdropTextureKey: TEXTURE_KEYS.stPetersCanalLevel03Backdrop,
    musicAudioKey: AUDIO_KEYS.level03CanalTheme,
    worldWidth: 3450,
    startX: START_X,
    endX: 3310,
    totalFragments: 12,
    requiredFragments: 10,
    platforms: [
      { x: 390, y: GROUND_Y + 26, width: 780, height: 70, color: COLORS.shore },
      { x: 1290, y: GROUND_Y + 26, width: 620, height: 70, color: COLORS.shore },
      { x: 2140, y: GROUND_Y + 26, width: 720, height: 70, color: COLORS.shore },
      { x: 3120, y: GROUND_Y + 26, width: 620, height: 70, color: COLORS.shore },
      { x: 680, y: 402, width: 170, height: 22, color: COLORS.dock },
      { x: 930, y: 354, width: 170, height: 22, color: COLORS.dock },
      { x: 1180, y: 316, width: 160, height: 22, color: COLORS.dock },
      { x: 1580, y: 392, width: 200, height: 22, color: COLORS.dock },
      { x: 1880, y: 344, width: 170, height: 22, color: COLORS.dock },
      { x: 2230, y: 386, width: 190, height: 22, color: COLORS.dock },
      { x: 2540, y: 338, width: 180, height: 22, color: COLORS.dock },
      { x: 2860, y: 382, width: 190, height: 22, color: COLORS.dock },
    ],
    hazards: [
      { x: 830, y: 515, width: 160, height: 54, kind: 'water' },
      { x: 1650, y: 515, width: 220, height: 54, kind: 'water' },
      { x: 2580, y: 515, width: 240, height: 54, kind: 'water' },
      { x: 1390, y: 464, width: 48, height: 34, kind: 'rock' },
      { x: 2320, y: 464, width: 52, height: 34, kind: 'rock' },
      { x: 2960, y: 358, width: 44, height: 44, kind: 'net' },
    ],
    fragments: [
      { x: 240, y: 430 },
      { x: 560, y: 430 },
      { x: 680, y: 362 },
      { x: 930, y: 314 },
      { x: 1180, y: 276 },
      { x: 1380, y: 430 },
      { x: 1580, y: 352 },
      { x: 1880, y: 304 },
      { x: 2160, y: 430 },
      { x: 2540, y: 298 },
      { x: 2860, y: 342 },
      { x: 3180, y: 430 },
    ],
    powerUps: [
      { kind: 'kelpShield', x: 1460, y: 430 },
      { kind: 'tiderunner', x: 1535, y: 430 },
      { kind: 'tideLift', x: 1070, y: 276 },
      { kind: 'storySpark', x: 2460, y: 298 },
    ],
    scuttleclaws: [
      { x: 2050, y: GROUND_Y - 20, minX: 1940, maxX: 2180, speed: 56, damage: 1 },
    ],
  },
  // ── Campaign 5 — Lord Malefacto boss (lock chamber arena) ────────────────
  {
    id: 'lord-malefacto-boss-level-04',
    name: 'Lord Malefacto',
    backdropPath: ASSET_PATHS.level04LockChamberArenaBackdrop,
    backdropTextureKey: TEXTURE_KEYS.level04LockChamberArenaBackdrop,
    musicAudioKey: AUDIO_KEYS.level03CanalTheme,
    worldWidth: 1320,
    startX: START_X,
    endX: 1200,
    totalFragments: 0,
    requiredFragments: 0,
    platforms: [
      { x: 660, y: GROUND_Y + 26, width: 1320, height: 70, color: COLORS.shore },
      { x: 372, y: 402, width: 180, height: 22, color: COLORS.dock },
      { x: 948, y: 402, width: 180, height: 22, color: COLORS.dock },
    ],
    hazards: [],
    fragments: [],
    powerUps: [],
    scuttleclaws: [],
    boss: { x: 1048, y: GROUND_Y - 78, hp: 3, damage: 1 },
  },
  // ── Preserved / removed from current campaign — Heritage Steps ────────────
  // Full definition kept intact; not in active progression.
  // Restore to campaign by removing testOnly and inserting at the desired index.
  // Also accessible directly via: ?level=heritage-steps-level-02
  {
    id: 'heritage-steps-level-02',
    name: 'The Heritage Steps',
    backdropPath: ASSET_PATHS.heritageStepsLevel02Backdrop,
    backdropTextureKey: TEXTURE_KEYS.heritageStepsLevel02Backdrop,
    musicAudioKey: AUDIO_KEYS.level02Theme,
    worldWidth: 3300,
    startX: START_X,
    endX: 3160,
    totalFragments: 12,
    requiredFragments: 10,
    platforms: [
      { x: 360, y: GROUND_Y + 26, width: 720, height: 70, color: COLORS.shore },
      { x: 1240, y: GROUND_Y + 26, width: 520, height: 70, color: COLORS.shore },
      { x: 2100, y: GROUND_Y + 26, width: 660, height: 70, color: COLORS.shore },
      { x: 3000, y: GROUND_Y + 26, width: 720, height: 70, color: COLORS.shore },
      { x: 620, y: 420, width: 150, height: 22, color: COLORS.dock },
      { x: 850, y: 374, width: 150, height: 22, color: COLORS.dock },
      { x: 1080, y: 328, width: 160, height: 22, color: COLORS.dock },
      { x: 1480, y: 402, width: 190, height: 22, color: COLORS.dock },
      { x: 1780, y: 352, width: 170, height: 22, color: COLORS.dock },
      { x: 2050, y: 306, width: 160, height: 22, color: COLORS.dock },
      { x: 2380, y: 392, width: 200, height: 22, color: COLORS.dock },
      { x: 2660, y: 338, width: 170, height: 22, color: COLORS.dock },
      { x: 2940, y: 384, width: 190, height: 22, color: COLORS.dock },
    ],
    hazards: [
      { x: 760, y: 515, width: 170, height: 54, kind: 'water' },
      { x: 1580, y: 515, width: 260, height: 54, kind: 'water' },
      { x: 2240, y: 515, width: 210, height: 54, kind: 'water' },
      { x: 2850, y: 515, width: 180, height: 54, kind: 'water' },
      { x: 1320, y: 464, width: 48, height: 34, kind: 'rock' },
      { x: 1960, y: 464, width: 54, height: 34, kind: 'rock' },
      { x: 2500, y: 368, width: 44, height: 44, kind: 'net' },
      { x: 3060, y: 464, width: 50, height: 34, kind: 'rock' },
    ],
    fragments: [
      { x: 220, y: 430 },
      { x: 620, y: 382 },
      { x: 850, y: 334 },
      { x: 1080, y: 288 },
      { x: 1240, y: 430 },
      { x: 1480, y: 362 },
      { x: 1780, y: 312 },
      { x: 2050, y: 266 },
      { x: 2260, y: 430 },
      { x: 2380, y: 352 },
      { x: 2660, y: 298 },
      { x: 3040, y: 430 },
    ],
    powerUps: [
      { kind: 'kelpShield', x: 1380, y: 430 },
      { kind: 'tideLift', x: 970, y: 288 },
      { kind: 'storySpark', x: 2320, y: 352 },
    ],
    scuttleclaws: [
      { x: 1120, y: GROUND_Y - 20, minX: 1030, maxX: 1210, speed: 52, damage: 1 },
    ],
    testOnly: true,
  },
  // ── Test — Bras d'Or Below (shallow eelgrass) ─────────────────────────────
  // Accessible directly via: ?level=bras-dor-below-level-05
  // No swimming or current zones. Bubble vent in trench 1. Eelgrass slow-zone on shelf 2 entry.
  // Two routes: lower bridge path (43px hops on stone A→B, both characters) or
  // upper ledge risk route (jump from stone B right edge, 76px hop, both characters).
  // Upper ledge is past stone B so Cod B'y walks the lower route with full headroom.
  {
    id: 'bras-dor-below-level-05',
    name: "Bras d'Or Below",
    backdropPath: ASSET_PATHS.brasDorBelowLevel05Backdrop,
    backdropTextureKey: TEXTURE_KEYS.brasDorBelowLevel05Backdrop,
    musicAudioKey: AUDIO_KEYS.shorelineThemeLoop,
    worldWidth: WORLD_WIDTH,
    startX: START_X,
    endX: END_X,
    totalFragments: 8,
    requiredFragments: 6,
    platforms: [
      // Section 1 — start shelf; x=25–735; safe spawn zone
      { x: 380, y: GROUND_Y + 26, width: 710, height: 70, color: COLORS.shore },
      // Stepping stone A — lower bridge route; 43px hop from shelf 1 (top 483→440)
      // center x=815 w=190 → left x=720, right x=910
      { x: 815, y: 451, width: 190, height: 22, color: COLORS.dock },
      // Upper ledge — risk/reward route; shifted past stone B so Cod B'y walks under it freely
      // 76px hop from stone B right edge (top 440→364); reachable by both characters
      // center x=1160 w=140 → left x=1090, right x=1230; starts 25px past stone B right (1065)
      { x: 1160, y: 375, width: 140, height: 22, color: COLORS.dock },
      // Stepping stone B — lower bridge route continues; overlaps stone A and shelf 2
      // center x=975 w=180 → left x=885, right x=1065
      { x: 975, y: 451, width: 180, height: 22, color: COLORS.dock },
      // Section 2 — mid shelf; x=1010–1590
      { x: 1300, y: GROUND_Y + 26, width: 580, height: 70, color: COLORS.shore },
      // Gap 2 bridge dock — 43px hop; bridges 100px narrow trench
      // center x=1640 w=170 → left x=1555, right x=1725
      { x: 1640, y: 451, width: 170, height: 22, color: COLORS.dock },
      // Section 3 — far shelf; x=1690–2610; spans endX=2550
      { x: 2150, y: GROUND_Y + 26, width: 920, height: 70, color: COLORS.shore },
      // Far upper ledge — 79px hop from ground; optional risk/reward (top 483→404)
      // center x=2020 w=190 → left x=1925, right x=2115
      { x: 2020, y: 415, width: 190, height: 22, color: COLORS.dock },
    ],
    hazards: [
      // Trench 1 — wide deep-current gap; x=735–1008; impassable without bridge stones
      { x: 872, y: 515, width: 273, height: 54, kind: 'water' },
      // Trench 2 — narrow gap; x=1590–1690; jumpable directly or via bridge dock
      { x: 1640, y: 515, width: 100, height: 54, kind: 'water' },
      // Rock hazard — far shelf entry; x=1800; before crab patrol zone starts
      { x: 1800, y: 464, width: 48, height: 34, kind: 'rock' },
      // Rock hazard — mid shelf exit; x=1520; past scuttleclaw patrol; near shelf edge
      { x: 1520, y: 464, width: 48, height: 34, kind: 'rock' },
    ],
    fragments: [
      { x: 210,  y: 430 },  // start shelf — early; safe
      { x: 530,  y: 430 },  // start shelf — mid; draws player toward trench
      { x: 815,  y: 406 },  // stone A — reward for bridge hop (34px above top=440)
      { x: 1160, y: 330 },  // upper ledge — risk/reward (34px above top=364)
      { x: 1150, y: 430 },  // mid shelf — clear landing zone after trench
      { x: 1640, y: 406 },  // bridge dock — reward for gap 2 hop (34px above top=440)
      { x: 1900, y: 430 },  // far shelf — entry; past rock hazard
      { x: 2020, y: 370 },  // far upper ledge — risk/reward (34px above top=404)
    ],
    powerUps: [
      { kind: 'kelpShield', x: 640,  y: 430 },  // start shelf; protection before trench
      { kind: 'tideLift',   x: 1750, y: 430 },  // far shelf entry; helps upper ledge hop
      { kind: 'storySpark', x: 1230, y: 430 },  // mid shelf; attracts nearby fragments
    ],
    scuttleclaws: [
      // Mid shelf — placed past landing zone; player has shelf footing before crab appears
      { x: 1320, y: GROUND_Y - 20, minX: 1150, maxX: 1490, speed: 52, damage: 1 },
      // Far shelf — late pressure; 460px clear landing zone before patrol start
      { x: 2380, y: GROUND_Y - 20, minX: 2180, maxX: 2490, speed: 52, damage: 1 },
    ],
    bubbleVents: [
      // Seabed thermal in trench 1 — upward boost zone catching players who fall in
      // Zone x=846–898, y=390–485; above water hazard top (488), below stone A surface (440)
      // boostVelocity=290: less than a full jump (390); enough to recover to stone A height
      { x: 872, y: 438, width: 52, height: 95, boostVelocity: 290 },
    ],
    eelgrassZones: [
      // Dense eelgrass patch — shelf 2 entry; x=1015–1145, before scuttleclaw patrol (minX=1150)
      // Zone y=420–500; player center on ground ≈452 (Cod) / 459 (Puffy); both fully caught
      // slowMultiplier=0.72: mild 28% drag; noticeable but controls stay responsive on mobile
      { x: 1080, y: 460, width: 130, height: 80, slowMultiplier: 0.72 },
    ],
    currentZones: [
      // Gentle rightward current — far-shelf open water, assists approach toward upper ledge
      // x=1850–2100, y=390–470; well past all teaching moments (eelgrass, bubble vent, trench 2)
      // Clear of rock hazard (right edge x=1824), scuttleclaw 2 patrol (minX=2180)
      // Players on far upper ledge have centre y≈373–380, above zone top (y=390) — not in current
      // velocityBias=40: target ~32 px/s drift; 11% resistance vs left input (Cod); completable either way
      { x: 1975, y: 430, width: 250, height: 80, velocityBias: 40 },
    ],
    testOnly: true,
  },
  // Secret test tribute - Calvin's Creature Room. Routing skeleton only.
  {
    id: 'calvins-creature-room',
    name: "Calvin's Creature Room",
    backdropPath: ASSET_PATHS.shorelineRunLevel01Backdrop,
    backdropTextureKey: TEXTURE_KEYS.shorelineRunLevel01Backdrop,
    musicAudioKey: AUDIO_KEYS.shorelineThemeLoop,
    worldWidth: 1800,
    startX: START_X,
    endX: 1620,
    totalFragments: 0,
    requiredFragments: 0,
    platforms: [
      { x: 900, y: GROUND_Y + 26, width: 1800, height: 70, color: COLORS.shore },
      { x: 520, y: 408, width: 190, height: 22, color: COLORS.dock },
      { x: 850, y: 360, width: 180, height: 22, color: COLORS.dock },
      { x: 1180, y: 408, width: 190, height: 22, color: COLORS.dock },
    ],
    hazards: [],
    fragments: [],
    powerUps: [],
    scuttleclaws: [],
    secretLevel: true,
    testOnly: true,
  },
];
