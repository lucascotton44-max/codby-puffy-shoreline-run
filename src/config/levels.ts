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
};

export const LEVELS: LevelDefinition[] = [
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
  },
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
];
