import { CharacterKey } from './characters.js';
import { ASSET_PATHS, AUDIO_KEYS, AUDIO_PATHS, TEXTURE_KEYS, WORLD_WIDTH } from './constants.js';

// Per-level painted parallax descriptor. Each layer is two `tileW`-wide tiles
// drawn side-by-side; `topY`/`scale` are the shared vertical-registration anchor.
// `layers` is ordered back-to-front (far -> near). This data-drives the
// createBackdrop swap so more than one level can reuse the same code path.
export type PaintedParallaxLayer = {
  keyA: string;
  keyB: string;
  pathA: string;
  pathB: string;
  scrollX: number;
  depth: number;
};
export type PaintedParallaxConfig = {
  tileW: number;
  scale: number;
  topY: number;
  shimmer: boolean; // render the animated water shimmer on top of the painted layers
  layers: PaintedParallaxLayer[];
};

// Single source of truth for the level-1 cinematic world zoom. The painted
// parallax descriptor, the camera zoom/lock, and the reseat all derive from this
// one value so they can never desync. (Module scope so the descriptor can read it.)
export const LEVEL_ONE_WORLD_ZOOM = 1.3;

export const PAINTED_PARALLAX: Record<string, PaintedParallaxConfig> = {
  'st-peters-canal-level-03': {
    tileW: 1725,
    scale: 1.0,
    topY: -430,
    shimmer: true,
    layers: [
      { keyA: TEXTURE_KEYS.stPetersCanalFarA, keyB: TEXTURE_KEYS.stPetersCanalFarB, pathA: ASSET_PATHS.stPetersCanalFarA, pathB: ASSET_PATHS.stPetersCanalFarB, scrollX: 0.2, depth: -100 },
      { keyA: TEXTURE_KEYS.stPetersCanalMidA, keyB: TEXTURE_KEYS.stPetersCanalMidB, pathA: ASSET_PATHS.stPetersCanalMidA, pathB: ASSET_PATHS.stPetersCanalMidB, scrollX: 0.45, depth: -96 },
      { keyA: TEXTURE_KEYS.stPetersCanalNearA, keyB: TEXTURE_KEYS.stPetersCanalNearB, pathA: ASSET_PATHS.stPetersCanalNearA, pathB: ASSET_PATHS.stPetersCanalNearB, scrollX: 0.9, depth: -3 },
    ],
  },
  // Level 1 runs at the 1.3x cinematic zoom. The painted layers are excluded
  // from reseatLevelOneParallax (skipReseat flag) and instead pre-counter-scaled
  // UNIFORMLY here: tiles are sized 1755 wide (= worldWidth*1.3 / 2) and drawn at
  // scale 1/1.3, so the camera's 1.3x magnification renders them at native size,
  // undistorted, with worldWidth (2700) horizontal coverage. topY positions the
  // overcast scene against the play plane under the zoom + lock.
  'shoreline-run-level-01': {
    tileW: (WORLD_WIDTH * LEVEL_ONE_WORLD_ZOOM) / 2,
    scale: 1 / LEVEL_ONE_WORLD_ZOOM,
    topY: -120,
    shimmer: false,
    layers: [
      { keyA: TEXTURE_KEYS.shorelineRunLevel01FarA, keyB: TEXTURE_KEYS.shorelineRunLevel01FarB, pathA: ASSET_PATHS.shorelineRunLevel01FarA, pathB: ASSET_PATHS.shorelineRunLevel01FarB, scrollX: 0.2, depth: -100 },
      { keyA: TEXTURE_KEYS.shorelineRunLevel01MidA, keyB: TEXTURE_KEYS.shorelineRunLevel01MidB, pathA: ASSET_PATHS.shorelineRunLevel01MidA, pathB: ASSET_PATHS.shorelineRunLevel01MidB, scrollX: 0.45, depth: -96 },
      { keyA: TEXTURE_KEYS.shorelineRunLevel01NearA, keyB: TEXTURE_KEYS.shorelineRunLevel01NearB, pathA: ASSET_PATHS.shorelineRunLevel01NearA, pathB: ASSET_PATHS.shorelineRunLevel01NearB, scrollX: 0.9, depth: -3 },
    ],
  },
  // Bridge level: dark-overcast canal crossing, zoom 1 (canal-style). tileW
  // worldWidth/2 = 1950, scale 1.0, shimmer on (it has lock water). topY frames
  // the steel truss + lock + water as the subject with the sky breathing above.
  'bridge_crossing_1a': {
    tileW: 1950,
    scale: 1.0,
    topY: -250,
    shimmer: true,
    layers: [
      { keyA: TEXTURE_KEYS.stPetersBridgeCrossingFarA, keyB: TEXTURE_KEYS.stPetersBridgeCrossingFarB, pathA: ASSET_PATHS.stPetersBridgeCrossingFarA, pathB: ASSET_PATHS.stPetersBridgeCrossingFarB, scrollX: 0.2, depth: -100 },
      { keyA: TEXTURE_KEYS.stPetersBridgeCrossingMidA, keyB: TEXTURE_KEYS.stPetersBridgeCrossingMidB, pathA: ASSET_PATHS.stPetersBridgeCrossingMidA, pathB: ASSET_PATHS.stPetersBridgeCrossingMidB, scrollX: 0.45, depth: -96 },
      { keyA: TEXTURE_KEYS.stPetersBridgeCrossingNearA, keyB: TEXTURE_KEYS.stPetersBridgeCrossingNearB, pathA: ASSET_PATHS.stPetersBridgeCrossingNearA, pathB: ASSET_PATHS.stPetersBridgeCrossingNearB, scrollX: 0.9, depth: -3 },
    ],
  },
  // Level 01b: bright sunny canal-edge-to-locks, zoom 1. tileW worldWidth/2 = 1600,
  // scale 1.0, shimmer on (canal water). topY frames the single lock + canal as the
  // subject with the towpath at the play plane and sky breathing above.
  'shoreline-run-level-01b': {
    tileW: 1600,
    scale: 1.0,
    topY: -900,
    shimmer: true,
    layers: [
      { keyA: TEXTURE_KEYS.shorelineRunLevel01bFarA, keyB: TEXTURE_KEYS.shorelineRunLevel01bFarB, pathA: ASSET_PATHS.shorelineRunLevel01bFarA, pathB: ASSET_PATHS.shorelineRunLevel01bFarB, scrollX: 0.2, depth: -100 },
      { keyA: TEXTURE_KEYS.shorelineRunLevel01bMidA, keyB: TEXTURE_KEYS.shorelineRunLevel01bMidB, pathA: ASSET_PATHS.shorelineRunLevel01bMidA, pathB: ASSET_PATHS.shorelineRunLevel01bMidB, scrollX: 0.45, depth: -96 },
      { keyA: TEXTURE_KEYS.shorelineRunLevel01bNearA, keyB: TEXTURE_KEYS.shorelineRunLevel01bNearB, pathA: ASSET_PATHS.shorelineRunLevel01bNearA, pathB: ASSET_PATHS.shorelineRunLevel01bNearB, scrollX: 0.9, depth: -3 },
    ],
  },
};

// Per-level 3-slice plank material. Same geometry; only the texture set (palette)
// differs: canal = warm golden wood, level-1 = cool grey-timber for the overcast.
export type PlankSkin = { capLeft: string; mid: string; capRight: string };
export const PLANK_SKINS: Record<string, PlankSkin> = {
  'st-peters-canal-level-03': {
    capLeft: TEXTURE_KEYS.canalPlankCapLeft,
    mid: TEXTURE_KEYS.canalPlankMid,
    capRight: TEXTURE_KEYS.canalPlankCapRight,
  },
  'shoreline-run-level-01': {
    capLeft: TEXTURE_KEYS.shorelineRunPlankCapLeft,
    mid: TEXTURE_KEYS.shorelineRunPlankMid,
    capRight: TEXTURE_KEYS.shorelineRunPlankCapRight,
  },
  'bridge_crossing_1a': {
    capLeft: TEXTURE_KEYS.bridgeCrossingPlankCapLeft,
    mid: TEXTURE_KEYS.bridgeCrossingPlankMid,
    capRight: TEXTURE_KEYS.bridgeCrossingPlankCapRight,
  },
  'shoreline-run-level-01b': {
    capLeft: TEXTURE_KEYS.level01bPlankCapLeft,
    mid: TEXTURE_KEYS.level01bPlankMid,
    capRight: TEXTURE_KEYS.level01bPlankCapRight,
  },
};

// Landing feedback (global, all levels). Tune feel here. A landing only fires
// when the captured peak fall speed exceeds minFallVelocity; intensity ramps
// 0..1 between min and maxFallVelocity and drives both the squash and the puff
// count. Squash is a transient transform on the rendered visual that fully
// recovers (no residual). Surface material is intentionally ignored this pass.
export const LANDING_FEEDBACK = {
  minFallVelocity: 200, // px/s downward; lighter touchdowns emit nothing
  maxFallVelocity: 560, // intensity caps here (near the ~620 fall-speed limit)
  maxSquashY: 0.16, // scaleY dips to (1 - this) at full intensity
  squashStretchX: 0.5, // scaleX rises by maxSquashY*this (volume preservation feel)
  squashDurationMs: 100, // total recover time — fast, weight not bounce
  puffMinCount: 3,
  puffMaxCount: 8,
  puffTint: 0xe8dcc2, // neutral warm dust, reads on any surface
  puffAlpha: 0.5,
  puffScale: 0.5, // particle start scale
  puffLifespanMs: 320,
  puffSpread: 38, // horizontal speed spread
};

// Per-level rim. Canal: warm low sun from the left (offset −x). Level-1: diffuse
// upper-left overcast sky-light — cool tint, offset up-and-left, kept near-off
// (Cod already separates on the cool background, so it's a faint edge-catch only).
export type RimLightConfig = {
  offsetPx: number;
  offsetYPx: number;
  tint: number;
  alpha: Record<CharacterKey, number>;
};
export const RIM_LIGHT_BY_LEVEL: Record<string, RimLightConfig> = {
  'st-peters-canal-level-03': { offsetPx: 2, offsetYPx: 0, tint: 0xffd9a0, alpha: { cod: 0.32, puffy: 0 } },
  'shoreline-run-level-01': { offsetPx: 2, offsetYPx: 1, tint: 0xcfe2ee, alpha: { cod: 0.1, puffy: 0 } },
  // Bridge: heavy dark overcast already gives Cod strong contrast, so the rim is a
  // near-off cool top-ambient whisper only (cooler/greener tint than level-1).
  'bridge_crossing_1a': { offsetPx: 1, offsetYPx: 1, tint: 0xc4dee0, alpha: { cod: 0.06, puffy: 0 } },
  // Level 01b: the only level with real sun — a warm DIRECTIONAL rim, high and
  // slightly left, brighter/whiter than canal's golden-hour rim. The strongest of
  // the four; this is the case the rim system was built for.
  'shoreline-run-level-01b': { offsetPx: 2, offsetYPx: 3, tint: 0xffeec8, alpha: { cod: 0.42, puffy: 0 } },
};

// Per-level looping ambient bed (water/gulls/wind under the music). Keyed by level
// id like the descriptors above; a level with no entry plays no bed. Loaded in
// preload (audio isn't auto-iterated) and driven by a parallel sound lifecycle.
// `volume` is per-bed (each recording sits at its own natural level under the
// 0.25 music); omit it to fall back to GAMEPLAY_TUNING.audio.ambientVolume.
export type AmbientBed = { key: string; path: string; volume?: number };
export const AMBIENT_BY_LEVEL: Record<string, AmbientBed> = {
  'shoreline-run-level-01': { key: AUDIO_KEYS.level1ShoreAmbient, path: AUDIO_PATHS.level1ShoreAmbient, volume: 0.12 },
  'st-peters-canal-level-03': { key: AUDIO_KEYS.canalAmbient, path: AUDIO_PATHS.canalAmbient, volume: 0.17 },
  'bridge_crossing_1a': { key: AUDIO_KEYS.bridgeAmbient, path: AUDIO_PATHS.bridgeAmbient, volume: 0.18 },
  'shoreline-run-level-01b': { key: AUDIO_KEYS.level01bAmbient, path: AUDIO_PATHS.level01bAmbient, volume: 0.17 },
};
