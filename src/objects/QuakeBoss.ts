import Phaser from 'phaser';
import { TEXTURE_KEYS } from '../config/constants.js';
import type { QuakeBossDefinition } from '../config/levels.js';

/** Full fight-state union so later stages (projectiles, rounds, dap ending)
 *  extend behavior without reworking the machine. Stage 1 implements ONLY the
 *  idle -> telegraph -> idle cycle on timers — no projectiles, no damage, no
 *  player interaction. */
type QuakeBossState = 'idle' | 'telegraph' | 'throwActive' | 'recovery' | 'hitStun' | 'roundLost' | 'dapping';

// Physics core sized to the sprite's torso (like Malefacto's 74x156 core vs its
// wider visual). Inert this stage — no overlap handlers reference it yet.
const BODY_WIDTH = 84;
const BODY_HEIGHT = 116;
// Display height for the 320x320 source art; width derives from the texture's
// real aspect at runtime (uniform setScale), never a hardcoded squash.
const TARGET_HEIGHT_PX = 130;
const IDLE_MS = 2000;
const TELEGRAPH_MS = 700;

/** Quake the donair-shop boss — structural sibling of LordMalefacto: same
 *  container + enterState/stateEndsAt timing + syncBodyVisual architecture,
 *  PNG-texture visuals instead of procedural parts. Bottom-anchored so he
 *  stands ON the ground (definition.y is the feet/ground line). */
export class QuakeBoss extends Phaser.GameObjects.Container {
  public declare readonly body: Phaser.Physics.Arcade.Body;
  private readonly baseX: number;
  private readonly baseY: number;
  private readonly spriteBody: Phaser.GameObjects.Image;
  private bossState: QuakeBossState = 'idle';
  private stateEndsAt = 0;

  public constructor(scene: Phaser.Scene, definition: QuakeBossDefinition) {
    const sprite = scene.add.image(0, 0, TEXTURE_KEYS.quakeDonairBossIdle);
    sprite.setOrigin(0.5, 1); // feet at the container origin (the ground line)
    // Ratio-true sizing from the texture's actual source dimensions.
    const source = sprite.texture.getSourceImage() as { width: number; height: number };
    sprite.setScale(TARGET_HEIGHT_PX / source.height);

    super(scene, definition.x, definition.y, [sprite]);

    this.baseX = definition.x;
    this.baseY = definition.y;
    this.spriteBody = sprite;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setSize(BODY_WIDTH, BODY_HEIGHT);
    // Container origin is the feet line: center the body on x, stand it on y.
    this.body.setOffset(-BODY_WIDTH / 2, -BODY_HEIGHT);
    this.setDepth(11);

    this.enterState('idle', scene.time.now);
  }

  public update(time: number): void {
    if (time < this.stateEndsAt) {
      return;
    }

    if (this.bossState === 'idle') {
      this.enterState('telegraph', time);
      return;
    }

    // Stage 1: telegraph (and any not-yet-implemented state) returns to idle.
    this.enterState('idle', time);
  }

  public getState(): QuakeBossState {
    return this.bossState;
  }

  private enterState(nextState: QuakeBossState, time: number): void {
    this.bossState = nextState;
    this.syncBodyVisual(nextState);
    this.setPosition(this.baseX, this.baseY);
    this.body.reset(this.baseX, this.baseY);

    if (nextState === 'telegraph') {
      this.stateEndsAt = time + TELEGRAPH_MS;
      return;
    }

    this.stateEndsAt = time + IDLE_MS;
  }

  /** Texture-per-state (the PNG analogue of Malefacto's atlas-frame sync).
   *  Later stages map throwActive/recovery/roundLost/dapping onto the throw/
   *  stunned/defeat art; unmapped states fall back to idle. */
  private syncBodyVisual(state: QuakeBossState): void {
    const textureKey =
      state === 'telegraph' || state === 'throwActive'
        ? TEXTURE_KEYS.quakeDonairBossThrow
        : state === 'hitStun' || state === 'roundLost'
          ? TEXTURE_KEYS.quakeDonairBossStunned
          : TEXTURE_KEYS.quakeDonairBossIdle;
    if (this.spriteBody.texture.key !== textureKey && this.scene.textures.exists(textureKey)) {
      this.spriteBody.setTexture(textureKey);
      const source = this.spriteBody.texture.getSourceImage() as { width: number; height: number };
      this.spriteBody.setScale(TARGET_HEIGHT_PX / source.height);
    }
  }
}
