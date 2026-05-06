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
    scuttleclaws: [],
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
    scuttleclaws: [],
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
];
