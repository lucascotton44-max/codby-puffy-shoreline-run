import Phaser from 'phaser';
import { TEXTURE_KEYS } from '../config/constants.js';
import type { QuakeBossDefinition } from '../config/levels.js';

/** Full fight-state union so later stages (rounds, dap ending) extend behavior
 *  without reworking the machine. Stage 2 (Q2) implements the throw loop:
 *  idle -> telegraph -> throwActive (spawns ONE arced donair) -> recovery ->
 *  idle. No rounds, no player-hits-boss, no catch yet. */
type QuakeBossState = 'idle' | 'telegraph' | 'throwActive' | 'recovery' | 'hitStun' | 'roundLost' | 'dapping';

// Physics core sized to the sprite's torso (like Malefacto's 74x156 core vs its
// wider visual). Still inert — donairs, not the body, carry the danger.
const BODY_WIDTH = 84;
const BODY_HEIGHT = 116;
// Each state's art is sized from ITS OWN texture dimensions at swap time (see
// syncBodyVisual) targeting this boss height; width follows each frame's ratio.
const TARGET_HEIGHT_PX = 130;
// Measured transparent bottom padding of each 320px-tall Quake frame (source
// pixels between the feet's lowest opaque pixel and the canvas bottom; alpha
// bbox bottom = 306 of 320 on both idle and throw). The sprite is pushed DOWN
// by pad * renderScale so the CONTENT bottom — the feet — sits on the ground
// line; without it the swap reads as the foot clipping/jumping between poses.
const FRAME_BOTTOM_PADDING_PX: Record<string, number> = {
  [TEXTURE_KEYS.quakeDonairBossIdle]: 54,
  [TEXTURE_KEYS.quakeDonairBossThrow]: 54,
  [TEXTURE_KEYS.quakeDonairBossStunned]: 14,
};

// Cycle timing: idle 1450 + telegraph 700 + throwActive 250 + recovery 600 =
// ~3.0s per throw (one donair per cycle, in the requested 2.5-3s cadence).
const IDLE_MS = 1450;
const TELEGRAPH_MS = 700;
const THROW_ACTIVE_MS = 250;
const RECOVERY_MS = 600;

// The donair leaves the throwing hand/release edge (upper-left of the lunging pose).
const HAND_OFFSET_X = -49;
const HAND_OFFSET_Y = -61;
const DONAIR_THROW_RELEASE_DELAY_MS = 110;
// Ballistic arc: gravity does the work (no tween). Flight time is fixed and
// the horizontal speed derives from the player's distance at throw time,
// clamped so point-blank or cross-arena targets still produce a readable,
// dodgeable arc (peak ~= (g*T/2)^2 / 2g ~= 91px at g=900).
const DONAIR_FLIGHT_MS = 900;
const DONAIR_MIN_SPEED_X = 120;
const DONAIR_MAX_SPEED_X = 420;
const DONAIR_SPIN_DEG_PER_S = 240;
const DONAIR_LIFETIME_MS = 1400;
const DONAIR_DISPLAY_WIDTH_PX = 44; // source 128x80 -> 44x27.5, ratio preserved
const DONAIR_BOUNDS_PADDING_PX = 96;

/** Quake the donair-shop boss — structural sibling of LordMalefacto: same
 *  container + enterState/stateEndsAt timing + syncBodyVisual architecture,
 *  PNG-texture visuals instead of procedural parts. Bottom-anchored so he
 *  stands ON the ground (definition.y is the feet/ground line). The scene wires
 *  donair overlaps into the existing damage flow (mirroring how it wires
 *  Malefacto's flare zone) — the boss only owns spawning and despawn timing. */
export class QuakeBoss extends Phaser.GameObjects.Container {
  public declare readonly body: Phaser.Physics.Arcade.Body;
  public readonly damage: number;
  private readonly baseX: number;
  private readonly baseY: number;
  private readonly spriteBody: Phaser.GameObjects.Image;
  private readonly donairs: Phaser.Physics.Arcade.Group;
  private bossState: QuakeBossState = 'idle';
  private stateEndsAt = 0;
  private hasSpawnedDonairThisThrow = false;
  private donairReleaseAt = 0;
  private throwTargetX = 0;
  private activeDonair: Phaser.Physics.Arcade.Image | null = null;
  private activeDonairLifetimeEvent: Phaser.Time.TimerEvent | null = null;

  public constructor(scene: Phaser.Scene, definition: QuakeBossDefinition) {
    const sprite = scene.add.image(0, 0, TEXTURE_KEYS.quakeDonairBossIdle);
    sprite.setOrigin(0.5, 1); // feet at the container origin (the ground line)

    super(scene, definition.x, definition.y, [sprite]);

    this.baseX = definition.x;
    this.baseY = definition.y;
    this.damage = definition.damage ?? 1;
    this.spriteBody = sprite;
    this.donairs = scene.physics.add.group({ allowGravity: true });

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setSize(BODY_WIDTH, BODY_HEIGHT);
    // Container origin is the feet line: center the body on x, stand it on y.
    this.body.setOffset(-BODY_WIDTH / 2, -BODY_HEIGHT);
    this.setDepth(11);

    this.applyFrameSizing();
    this.enterState('idle', scene.time.now);
  }

  /** targetX is the player's x at update time; captured when the throw fires. */
  public update(time: number, targetX: number): void {
    this.destroyOutOfBoundsDonairs();
    if (this.activeDonair && !this.activeDonair.active) {
      this.activeDonair = null;
    }
    this.enforceSingleDonairInvariant();

    if (this.bossState === 'throwActive' && !this.hasSpawnedDonairThisThrow && time >= this.donairReleaseAt) {
      this.spawnDonair(this.throwTargetX);
    }

    if (time < this.stateEndsAt) {
      return;
    }

    if (this.bossState === 'idle') {
      this.enterState('telegraph', time);
      return;
    }

    if (this.bossState === 'telegraph') {
      this.throwTargetX = targetX;
      this.enterState('throwActive', time);
      return;
    }

    if (this.bossState === 'throwActive') {
      this.enterState('recovery', time);
      return;
    }

    // recovery (and any not-yet-implemented state) returns to idle.
    this.enterState('idle', time);
  }

  public getState(): QuakeBossState {
    return this.bossState;
  }

  /** The scene wires player overlap + platform colliders against this group. */
  public getDonairs(): Phaser.Physics.Arcade.Group {
    return this.donairs;
  }

  public destroyDonair(donair: Phaser.Physics.Arcade.Image): void {
    if (donair === this.activeDonair) {
      this.destroyActiveDonair();
    } else if (donair.active) {
      donair.destroy();
    }
    this.enforceSingleDonairInvariant();
  }

  private enterState(nextState: QuakeBossState, time: number): void {
    this.bossState = nextState;
    this.syncBodyVisual(nextState);
    this.setPosition(this.baseX, this.baseY);
    this.body.reset(this.baseX, this.baseY);

    if (nextState === 'telegraph') {
      this.hasSpawnedDonairThisThrow = false;
      this.stateEndsAt = time + TELEGRAPH_MS;
      return;
    }

    if (nextState === 'throwActive') {
      this.donairReleaseAt = time + DONAIR_THROW_RELEASE_DELAY_MS;
      this.stateEndsAt = time + THROW_ACTIVE_MS;
      return;
    }

    if (nextState === 'recovery') {
      this.stateEndsAt = time + RECOVERY_MS;
      return;
    }

    this.stateEndsAt = time + IDLE_MS;
  }

  /** One ballistic donair toward the player's x at throw time. Gravity shapes
   *  the arc; horizontal speed = distance / fixed flight time (clamped).
   *  Despawn is triple-covered: scene-wired platform collide, scene-wired
   *  player hit, world-bounds cleanup, and the lifetime timer here. */
  private spawnDonair(targetX: number): void {
    if (this.hasSpawnedDonairThisThrow) {
      return;
    }
    if (this.activeDonair?.active) {
      return;
    }
    this.hasSpawnedDonairThisThrow = true;
    this.destroyActiveDonair();

    const spawnX = this.baseX + HAND_OFFSET_X;
    const spawnY = this.baseY + HAND_OFFSET_Y;
    const donair = this.donairs.create(spawnX, spawnY, TEXTURE_KEYS.donairProjectile) as Phaser.Physics.Arcade.Image;
    this.ignoreFromNonMainCameras(donair);
    const source = donair.texture.getSourceImage() as { width: number; height: number };
    donair.setScale(DONAIR_DISPLAY_WIDTH_PX / source.width); // ratio-true (128x80 -> 44x27.5)
    donair.setDepth(11);

    const flightSeconds = DONAIR_FLIGHT_MS / 1000;
    const gravityY = this.scene.physics.world.gravity.y;
    const deltaX = targetX - spawnX;
    const speedX = Phaser.Math.Clamp(Math.abs(deltaX) / flightSeconds, DONAIR_MIN_SPEED_X, DONAIR_MAX_SPEED_X) * Math.sign(deltaX || -1);
    // Upward impulse for a symmetric arc over the flight window; gravity pulls
    // it down onto the ground near the target.
    const speedY = -(gravityY * flightSeconds) / 2;
    donair.setVelocity(speedX, speedY);
    donair.setAngularVelocity(speedX < 0 ? -DONAIR_SPIN_DEG_PER_S : DONAIR_SPIN_DEG_PER_S);
    this.activeDonair = donair;

    this.activeDonairLifetimeEvent = this.scene.time.delayedCall(DONAIR_LIFETIME_MS, () => {
      if (this.activeDonair === donair) {
        this.destroyActiveDonair();
      }
    });
  }

  private ignoreFromNonMainCameras(gameObject: Phaser.GameObjects.GameObject): void {
    this.scene.cameras.cameras.forEach((camera) => {
      if (camera !== this.scene.cameras.main) {
        camera.ignore(gameObject);
      }
    });
  }

  private destroyActiveDonair(): void {
    this.activeDonairLifetimeEvent?.remove(false);
    this.activeDonairLifetimeEvent = null;

    if (this.activeDonair?.active) {
      this.activeDonair.destroy();
    }
    this.activeDonair = null;

    this.donairs.getChildren().forEach((child) => {
      const donair = child as Phaser.Physics.Arcade.Image;
      if (donair.active) {
        donair.destroy();
      }
    });
  }

  private destroyOutOfBoundsDonairs(): void {
    const bounds = this.scene.physics.world.bounds;
    const minX = bounds.x - DONAIR_BOUNDS_PADDING_PX;
    const maxX = bounds.x + bounds.width + DONAIR_BOUNDS_PADDING_PX;
    const minY = bounds.y - DONAIR_BOUNDS_PADDING_PX;
    const maxY = bounds.y + bounds.height + DONAIR_BOUNDS_PADDING_PX;

    this.donairs.getChildren().forEach((child) => {
      const donair = child as Phaser.Physics.Arcade.Image;
      if (!donair.active) {
        return;
      }

      if (donair.x < minX || donair.x > maxX || donair.y < minY || donair.y > maxY) {
        if (donair === this.activeDonair) {
          this.destroyActiveDonair();
        } else {
          donair.destroy();
        }
      }
    });
  }

  private enforceSingleDonairInvariant(): void {
    const activeChildren = this.donairs
      .getChildren()
      .filter((child) => {
        const donair = child as Phaser.Physics.Arcade.Image;
        return donair.active && donair.visible;
      }) as Phaser.Physics.Arcade.Image[];

    activeChildren.forEach((donair) => {
      if (!this.activeDonair || donair !== this.activeDonair) {
        donair.destroy();
      }
    });
  }

  /** Texture-per-state (the PNG analogue of Malefacto's atlas-frame sync).
   *  recovery shows idle art (wind-down); roundLost/hitStun map to stunned art
   *  for later stages; unmapped states fall back to idle. */
  private syncBodyVisual(state: QuakeBossState): void {
    const textureKey =
      state === 'telegraph' || state === 'throwActive'
        ? TEXTURE_KEYS.quakeDonairBossThrow
        : state === 'hitStun' || state === 'roundLost'
          ? TEXTURE_KEYS.quakeDonairBossStunned
          : TEXTURE_KEYS.quakeDonairBossIdle;
    if (this.spriteBody.texture.key !== textureKey && this.scene.textures.exists(textureKey)) {
      this.spriteBody.setTexture(textureKey);
      this.applyFrameSizing();
    }
  }

  /** Per-texture sizing + grounding: scale THIS frame from its own source
   *  dimensions to the target boss height (width follows the frame's ratio),
   *  then push the sprite down by the frame's measured transparent bottom
   *  padding at render scale, so the feet content sits exactly on the ground
   *  line for every pose — no clipping or foot-jump across state swaps. */
  private applyFrameSizing(): void {
    const source = this.spriteBody.texture.getSourceImage() as { width: number; height: number };
    const scale = TARGET_HEIGHT_PX / source.height;
    this.spriteBody.setScale(scale);
    const bottomPaddingPx = FRAME_BOTTOM_PADDING_PX[this.spriteBody.texture.key] ?? 0;
    this.spriteBody.setY(bottomPaddingPx * scale);
  }
}
