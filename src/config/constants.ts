import { GAMEPLAY_TUNING } from './tuning.js';

export const GAME_WIDTH = 960;
export const GAME_HEIGHT = 540;
export const WORLD_WIDTH = 2700;
export const GROUND_Y = 492;
export const REQUIRED_FRAGMENTS = 8;
export const TOTAL_FRAGMENTS = 10;
export const DAMAGE_COOLDOWN_MS = GAMEPLAY_TUNING.hazards.damageCooldownMs;
export const START_X = 96;
export const END_X = 2550;

export const ASSET_PATHS = {
  shorelineRunLevel01Backdrop: 'assets/backgrounds/shoreline_run_level_01.png',
  heritageStepsLevel02Backdrop: 'assets/backgrounds/heritage_steps_level_02.png',
  stPetersCanalLevel03Backdrop: 'assets/backgrounds/st_peters_canal.png',
  stPetersBridgeCrossingBackdrop: 'assets/backgrounds/st_peters_bridge_crossing.png',
  level01bCanalEdgeToLocksBackdrop: 'assets/backgrounds/level_01b_canal_edge_to_locks.png',
  level04LockChamberArenaBackdrop: 'assets/backgrounds/level_04_lock_chamber_arena_v1.png',
  level04LockTransition: 'assets/cutscenes/level_04_lock_transition.png',
  brasDorBelowLevel05Backdrop: 'assets/backgrounds/bras_dor_below_shallow_eelgrass_v1.png',
  calvinsCreatureRoomRainyHalifaxPlaceholder: 'assets/backgrounds/calvins_creature_room_rainy_halifax_placeholder.png',
  calvinEarthEyesBartPlaceholder: 'assets/sprites/calvin/earth_eyes_bart_placeholder.png',
  calvinRedBartPlaceholder: 'assets/sprites/calvin/red_bart_placeholder.png',
  calvinEarthEyesBartPlayer: 'assets/sprites/calvin/earth_eyes_bart_player_v1.png',
  calvinRedBartPlayer: 'assets/sprites/calvin/red_bart_player_v1.png',
  calvinMeltPatrolSprite: 'assets/sprites/calvin/melt_patrol_v1.png',
  codbyAtlasImage: 'assets/sprites/codby/codby_atlas_v1.png',
  codbyAtlasJson: 'assets/sprites/codby/codby_atlas_v1.json',
  puffyAtlasImage: 'assets/sprites/puffy/puffy_atlas_v1.png',
  puffyAtlasJson: 'assets/sprites/puffy/puffy_atlas_v1.json',
  scuttleclawAtlasImage: 'assets/sprites/scuttleclaw/scuttleclaw_atlas_v1.png',
  scuttleclawAtlasJson: 'assets/sprites/scuttleclaw/scuttleclaw_atlas_v1.json',
  tiderunnerAtlasImage: 'assets/sprites/tiderunner/tiderunner_atlas_v1.png',
  tiderunnerAtlasJson: 'assets/sprites/tiderunner/tiderunner_atlas_v1.json',
  lordMalefactoAtlasImage: 'assets/sprites/lord_malefacto/lord_malefacto_atlas_v1.png',
  lordMalefactoAtlasJson: 'assets/sprites/lord_malefacto/lord_malefacto_atlas_v1.json',
  lordMalefactoFlareZoneFx: 'assets/sprites/lord_malefacto_fx/lord_malefacto_flare_zone_v2.png',
  powerUpStatesAtlasImage: 'assets/sprites/powerup_states/powerup_states_atlas_v1.png',
  powerUpStatesAtlasJson: 'assets/sprites/powerup_states/powerup_states_atlas_v1.json',
  dockPlankPlatformProp: 'assets/props/dock_plank_platform.png',
  brokenWharfHazardProp: 'assets/props/broken_wharf_hazard.png',
  rockHazardProp: 'assets/props/rock_hazard.png',
  ropeDebrisHazardProp: 'assets/props/rope_debris_hazard.png',
  storyFragmentProp: 'assets/props/story_fragment.png',
  ch8BeaconMarkerProp: 'assets/props/ch8_beacon_marker.png',
  kelpShieldIcon: 'assets/props/kelp_shield_icon.png',
  tideLiftIcon: 'assets/props/tide_lift_icon.png',
  storySparkIcon: 'assets/props/story_spark_icon.png',
};

export const AUDIO_PATHS = {
  shorelineThemeLoop: 'assets/audio/music/shoreline_theme_loop.wav',
  level02Theme: 'assets/audio/music/level_02_theme.wav',
  level03CanalTheme: 'assets/audio/music/level_03_canal_theme.wav',
  calvinsCreatureRoomThemeLoop: 'assets/audio/music/calvins_creature_room_theme_loop.wav',
  jump: 'assets/audio/sfx/jump.wav',
  glide: 'assets/audio/sfx/glide.wav',
  collectFragment: 'assets/audio/sfx/collect_fragment.wav',
  hazardHit: 'assets/audio/sfx/hazard_hit.wav',
  characterSwitch: 'assets/audio/sfx/character_switch.wav',
  levelComplete: 'assets/audio/sfx/level_complete.wav',
  gameOver: 'assets/audio/sfx/game_over.wav',
  scuttleclawStomp: 'assets/audio/sfx/scuttleclaw_stomp.wav',
  powerupPickup: 'assets/audio/sfx/powerup_pickup.wav',
  kelpShield: 'assets/audio/sfx/kelp_shield.wav',
  tideLift: 'assets/audio/sfx/tide_lift.wav',
  canalBoatTransition: 'assets/audio/sfx/canal_boat_transition_v1.wav',
  malefactoStompHit: 'assets/audio/sfx/malefacto_stomp_hit_v1.wav',
};

export const TEXTURE_KEYS = {
  shorelineRunLevel01Backdrop: 'shoreline-run-level-01-backdrop',
  heritageStepsLevel02Backdrop: 'heritage-steps-level-02-backdrop',
  stPetersCanalLevel03Backdrop: 'st-peters-canal-level-03-backdrop',
  stPetersBridgeCrossingBackdrop: 'st-peters-bridge-crossing-backdrop',
  level01bCanalEdgeToLocksBackdrop: 'level-01b-canal-edge-to-locks-backdrop',
  level04LockChamberArenaBackdrop: 'level-04-lock-chamber-arena-backdrop',
  level04LockTransition: 'level-04-lock-transition',
  brasDorBelowLevel05Backdrop: 'bras-dor-below-level-05-backdrop',
  calvinsCreatureRoomRainyHalifaxPlaceholder: 'calvins-creature-room-rainy-halifax-placeholder',
  calvinEarthEyesBartPlaceholder: 'calvin-earth-eyes-bart-placeholder',
  calvinRedBartPlaceholder: 'calvin-red-bart-placeholder',
  calvinEarthEyesBartPlayer: 'calvin-earth-eyes-bart-player-v1',
  calvinRedBartPlayer: 'calvin-red-bart-player-v1',
  calvinMeltPatrolSprite: 'calvin-melt-patrol-sprite-v1',
  codbyAtlas: 'codby-atlas-v1',
  puffyAtlas: 'puffy-atlas-v1',
  codbyAtlasMeta: 'codby-atlas-v1-meta',
  puffyAtlasMeta: 'puffy-atlas-v1-meta',
  scuttleclawAtlas: 'scuttleclaw-atlas-v1',
  scuttleclawAtlasMeta: 'scuttleclaw-atlas-v1-meta',
  tiderunnerAtlas: 'tiderunner-atlas-v1',
  tiderunnerAtlasMeta: 'tiderunner-atlas-v1-meta',
  lordMalefactoAtlas: 'lord-malefacto-atlas-v1',
  lordMalefactoAtlasMeta: 'lord-malefacto-atlas-v1-meta',
  lordMalefactoFlareZoneFx: 'lord-malefacto-flare-zone-fx-v2',
  powerUpStatesAtlas: 'powerup-states-atlas-v1',
  powerUpStatesAtlasMeta: 'powerup-states-atlas-v1-meta',
  dockPlankPlatformProp: 'dock-plank-platform-prop',
  brokenWharfHazardProp: 'broken-wharf-hazard-prop',
  rockHazardProp: 'rock-hazard-prop',
  ropeDebrisHazardProp: 'rope-debris-hazard-prop',
  storyFragmentProp: 'story-fragment-prop',
  ch8BeaconMarkerProp: 'ch8-beacon-marker-prop',
  kelpShieldIcon: 'kelp-shield-icon',
  tideLiftIcon: 'tide-lift-icon',
  storySparkIcon: 'story-spark-icon',
};

export const AUDIO_KEYS = {
  shorelineThemeLoop: 'shoreline-theme-loop',
  level02Theme: 'level-02-theme',
  level03CanalTheme: 'level-03-canal-theme',
  calvinsCreatureRoomThemeLoop: 'calvins-creature-room-theme-loop',
  jump: 'jump-sfx',
  glide: 'glide-sfx',
  collectFragment: 'collect-fragment-sfx',
  hazardHit: 'hazard-hit-sfx',
  characterSwitch: 'character-switch-sfx',
  levelComplete: 'level-complete-sfx',
  gameOver: 'game-over-sfx',
  scuttleclawStomp: 'scuttleclaw-stomp-sfx',
  powerupPickup: 'powerup-pickup-sfx',
  kelpShield: 'kelp-shield-sfx',
  tideLift: 'tide-lift-sfx',
  canalBoatTransition: 'canal-boat-transition-sfx',
  malefactoStompHit: 'malefacto-stomp-hit-sfx',
};

export const COLORS = {
  sky: 0x8fa8a8,
  farWater: 0x375f68,
  water: 0x254c57,
  shore: 0x6c6859,
  rock: 0x565b56,
  dock: 0x64523f,
  evergreen: 0x263f35,
  cod: 0xe6c84f,
  puffy: 0xf3f0e8,
  puffyMark: 0x23262a,
  fragment: 0xcaa66a,
  hazard: 0x8b3f35,
  marker: 0xb7c7b2,
  text: '#f3efe2',
  mutedText: '#b9c0b5',
};

// TODO: Gilbert salmon river level.
// TODO: FlowEdge river/dome level.
// TODO: Land Yacht shoreline level.
// TODO: Toast and Marmalade worksite level.
// TODO: Rook crow mystery level.
