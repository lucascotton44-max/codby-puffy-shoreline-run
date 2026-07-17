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
  // Old-generation 320x320 art like stunned (alpha bbox bottom 306 of 320).
  [TEXTURE_KEYS.quakeDonairBossDefeat]: 14,
};

// Cycle timing: idle 1200 + telegraph 700 + throwActive 250 + recovery 850 =
// ~3.0s per throw (one donair per cycle, in the requested 2.5-3s cadence).
const IDLE_MS = 1200;
const TELEGRAPH_MS = 700;
const THROW_ACTIVE_MS = 250;
const RECOVERY_MS = 1500;

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
const DEFAULT_HP = 3;
const HIT_STUN_MS = 420;
const HIT_FLASH_MS = 140;
const VULNERABLE_TINT = 0xf1d37a;
const VULNERABLE_PULSE_MS = 240;
// Ending beats: at 0 HP he's caught (roundLost, stunned art) then daps —
// beaten and delighted, never destroyed. After DAP_END_NOTIFY_MS in dapping,
// isMatchOver() flips true and the scene ends the level as a win.
const ROUND_LOST_MS = 900;
const DAP_END_NOTIFY_MS = 1600;
// Recovery-window "!" indicator above the head — created on recovery enter,
// destroyed on exit (see syncVulnerableReadability). Container-local, so it
// moves and cleans up with the boss.
const INDICATOR_Y_PX = -(TARGET_HEIGHT_PX + 16);
const INDICATOR_BOB_PX = 6;
const INDICATOR_BOB_MS = 260;

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
  private hasTakenDamageThisRecovery = false;
  private donairReleaseAt = 0;
  private throwTargetX = 0;
  private facingDirection: -1 | 1 = -1;
  private hp: number;
  private activeDonair: Phaser.Physics.Arcade.Image | null = null;
  private activeDonairLifetimeEvent: Phaser.Time.TimerEvent | null = null;
  private hitReactionTween?: Phaser.Tweens.Tween;
  private vulnerablePulseTween?: Phaser.Tweens.Tween;
  private hitFlashTimer?: Phaser.Time.TimerEvent;
  private vulnerableIndicator?: Phaser.GameObjects.Text;
  private vulnerableIndicatorTween?: Phaser.Tweens.Tween;
  private matchOverAt = Number.POSITIVE_INFINITY;

  public constructor(scene: Phaser.Scene, definition: QuakeBossDefinition) {
    const sprite = scene.add.image(0, 0, TEXTURE_KEYS.quakeDonairBossIdle);
    sprite.setOrigin(0.5, 1); // feet at the container origin (the ground line)

    super(scene, definition.x, definition.y, [sprite]);

    this.baseX = definition.x;
    this.baseY = definition.y;
    this.hp = definition.hp ?? DEFAULT_HP;
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
    this.updateFacing(targetX);
    this.destroyOutOfBoundsDonairs();
    if (this.activeDonair && !this.activeDonair.active) {
      this.activeDonair = null;
    }
    this.enforceSingleDonairInvariant();

    if (this.bossState === 'throwActive' && !this.hasSpawnedDonairThisThrow && time >= this.donairReleaseAt) {
      this.spawnDonair(this.throwTargetX);
    }

    // The dap is terminal: he holds it (facing the player) and never rejoins
    // the throw cycle. The scene ends the level via isMatchOver().
    if (this.bossState === 'dapping') {
      return;
    }

    if (time < this.stateEndsAt) {
      return;
    }

    if (this.bossState === 'roundLost') {
      this.enterState('dapping', time);
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

  public isVulnerable(): boolean {
    return this.bossState === 'recovery' && !this.hasTakenDamageThisRecovery && this.hp > 0;
  }

  public getHealth(): number {
    return Math.max(0, this.hp);
  }

  public isInHitReaction(): boolean {
    return this.bossState === 'hitStun';
  }

  public takeDamage(amount: number): boolean {
    if (!this.isVulnerable()) {
      return false;
    }

    this.hasTakenDamageThisRecovery = true;
    this.hp = Math.max(0, this.hp - amount);
    // At 0 HP the fight ends: a caught beat (roundLost, stunned art), then the
    // dap (see update). No more hitStun cycling — the dead-end loop is gone.
    this.enterState(this.hp <= 0 ? 'roundLost' : 'hitStun', this.scene.time.now);
    this.playHitFeedback();
    return true;
  }

  /** True once the dap has been held long enough for the scene to end the level
   *  as a win (the scene polls this beside its update call, mirroring how
   *  Malefacto's defeat feeds endLevel(true)). */
  public isMatchOver(): boolean {
    return this.bossState === 'dapping' && this.scene.time.now >= this.matchOverAt;
  }

  public destroyDonair(donair: Phaser.Physics.Arcade.Image): void {
    if (donair === this.activeDonair) {
      this.destroyActiveDonair();
    } else if (donair.active) {
      donair.destroy();
    }
    this.enforceSingleDonairInvariant();
  }

  private updateFacing(targetX: number): void {
    if (targetX === this.baseX) {
      return;
    }

    this.facingDirection = targetX < this.baseX ? -1 : 1;
    this.spriteBody.setFlipX(this.facingDirection > 0);
  }

  private enterState(nextState: QuakeBossState, time: number): void {
    this.bossState = nextState;
    this.syncBodyVisual(nextState);
    this.syncVulnerableReadability(nextState);
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
      this.hasTakenDamageThisRecovery = false;
      this.stateEndsAt = time + RECOVERY_MS;
      return;
    }

    if (nextState === 'hitStun') {
      this.stateEndsAt = time + HIT_STUN_MS;
      return;
    }

    if (nextState === 'roundLost') {
      // Fight's over the moment he's caught: any in-flight donair vanishes so
      // nothing can hit the player during the ending beats.
      this.destroyActiveDonair();
      this.stateEndsAt = time + ROUND_LOST_MS;
      return;
    }

    if (nextState === 'dapping') {
      this.destroyActiveDonair();
      this.stateEndsAt = Number.POSITIVE_INFINITY; // terminal — never auto-exits
      this.matchOverAt = time + DAP_END_NOTIFY_MS;
      return;
    }

    this.stateEndsAt = time + IDLE_MS;
  }

  private playHitFeedback(): void {
    this.hitReactionTween?.stop();
    this.hitReactionTween = undefined;
    this.hitFlashTimer?.remove(false);
    this.hitFlashTimer = undefined;

    this.spriteBody.setTintFill(0xffffff);
    this.spriteBody.setX(-6 * this.facingDirection);
    this.hitFlashTimer = this.scene.time.delayedCall(HIT_FLASH_MS, () => {
      this.spriteBody.clearTint();
      this.hitFlashTimer = undefined;
    });
    this.hitReactionTween = this.scene.tweens.add({
      targets: this.spriteBody,
      x: 0,
      duration: HIT_FLASH_MS,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.hitReactionTween = undefined;
      },
    });
  }

  private syncVulnerableReadability(state: QuakeBossState): void {
    this.vulnerablePulseTween?.stop();
    this.vulnerablePulseTween = undefined;
    this.vulnerableIndicatorTween?.stop();
    this.vulnerableIndicatorTween = undefined;
    this.vulnerableIndicator?.destroy();
    this.vulnerableIndicator = undefined;

    if (state === 'recovery') {
      this.spriteBody.setAlpha(1);
      this.spriteBody.setTint(VULNERABLE_TINT);
      this.vulnerablePulseTween = this.scene.tweens.add({
        targets: this.spriteBody,
        alpha: { from: 0.92, to: 1 },
        duration: VULNERABLE_PULSE_MS,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      // Unmissable window cue: a warm-yellow "!" bobbing above his head for the
      // whole recovery. Container child, so it tracks the boss and is destroyed
      // with him; explicitly destroyed on every state exit above.
      const indicator = this.scene.add.text(0, INDICATOR_Y_PX, '!', {
        color: '#ffd75a',
        fontFamily: 'monospace',
        fontSize: '22px',
        fontStyle: 'bold',
      });
      indicator.setOrigin(0.5, 1);
      indicator.setStroke('#15181c', 4);
      this.add(indicator);
      this.vulnerableIndicator = indicator;
      this.vulnerableIndicatorTween = this.scene.tweens.add({
        targets: indicator,
        y: { from: INDICATOR_Y_PX + INDICATOR_BOB_PX, to: INDICATOR_Y_PX - INDICATOR_BOB_PX },
        duration: INDICATOR_BOB_MS,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
      return;
    }

    this.spriteBody.setAlpha(1);
    this.spriteBody.clearTint();
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

    const spawnX = this.baseX + HAND_OFFSET_X * -this.facingDirection;
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
   *  recovery stays on normal art so it reads as an opening; actual hit reactions
   *  keep the stunned art. Unmapped states fall back to idle. */
  private syncBodyVisual(state: QuakeBossState): void {
    const textureKey =
      state === 'telegraph' || state === 'throwActive'
        ? TEXTURE_KEYS.quakeDonairBossThrow
        : state === 'hitStun' || state === 'roundLost'
          ? TEXTURE_KEYS.quakeDonairBossStunned
          : state === 'dapping'
            ? TEXTURE_KEYS.quakeDonairBossDefeat // repurposed as respect — beaten and delighted
            : TEXTURE_KEYS.quakeDonairBossIdle;
    if (this.spriteBody.texture.key !== textureKey && this.scene.textures.exists(textureKey)) {
      this.spriteBody.setTexture(textureKey);
      this.applyFrameSizing();
    }
    this.spriteBody.setFlipX(this.facingDirection > 0);
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
