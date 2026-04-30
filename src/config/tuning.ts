export const GAMEPLAY_TUNING = {
  characters: {
    cod: {
      maxHealth: 5,
      moveSpeed: 185,
      jumpVelocity: 390,
      gravityY: 900,
      dragX: 980,
      hitbox: { width: 42, height: 62 },
      spriteScale: 0.3,
      animationFrameRates: {
        idle: 3,
        walk: 7,
        jump: 5,
        fall: 5,
        hurt: 8,
      },
    },
    puffy: {
      maxHealth: 3,
      moveSpeed: 250,
      jumpVelocity: 455,
      gravityY: 760,
      dragX: 760,
      hitbox: { width: 32, height: 48 },
      spriteScale: 0.27,
      glideMaxFallSpeed: 135,
      animationFrameRates: {
        idle: 5,
        run: 12,
        jump: 8,
        glide: 7,
        hurt: 10,
      },
    },
  },
  collectibles: {
    pickupSize: { width: 28, height: 36 },
  },
  hazards: {
    defaultDamage: 1,
    damageCooldownMs: 900,
  },
  powerUps: {
    pickupSize: { width: 34, height: 38 },
    placements: [
      { kind: 'kelpShield', x: 620, y: 430 },
      { kind: 'tideLift', x: 910, y: 298 },
      { kind: 'storySpark', x: 1685, y: 310 },
    ],
    kelpShield: {
      charges: 1,
      durationMs: 8000,
    },
    tideLift: {
      durationMs: 5200,
      codJumpMultiplier: 1.12,
      puffyJumpMultiplier: 1.08,
      puffyGlideDurationMs: 1500,
      puffyGlideMaxFallSpeed: 88,
      puffyGlideLiftVelocity: -55,
    },
    storySpark: {
      durationMs: 5200,
      attractionRadius: 190,
      attractionStrength: 0.055,
    },
    tiderunner: {
      durationMs: 5200,
      moveSpeedMultiplier: 1.14,
    },
  },
  bosses: {
    lordMalefacto: {
      maxHealth: 3,
      damage: 1,
      telegraphMs: 900,
      attackActiveMs: 900,
      vulnerableMs: 1200,
      hitStunMs: 500,
    },
  },
  audio: {
    musicVolume: 0.25,
    sfxVolume: 0.45,
    musicEnabled: true,
    sfxEnabled: true,
  },
  debug: {
    hitboxToggleKey: 'H',
  },
} as const;
