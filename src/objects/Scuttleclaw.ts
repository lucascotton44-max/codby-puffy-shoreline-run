import Phaser from 'phaser';
import { TEXTURE_KEYS } from '../config/constants.js';
import type { ScuttleclawDefinition } from '../config/levels.js';

const DEFAULT_SPEED = 48;
const DEFAULT_DAMAGE = 1;
const BODY_WIDTH = 62;
const BODY_HEIGHT = 22;
const SPRITE_DISPLAY_WIDTH = 92;
const SPRITE_DISPLAY_HEIGHT = 58;
const WALK_ANIMATION_KEY = 'scuttleclaw-walk';
const IDLE_ANIMATION_KEY = 'scuttleclaw-idle';

type ScuttleclawAtlasFrame = {
  atlasX: number;
  atlasY: number;
  w: number;
  h: number;
};

type ScuttleclawAtlasMeta = {
  cellWidth: number;
  cellHeight: number;
  columns: number;
  animations: Record<string, ScuttleclawAtlasFrame[]>;
};

export class Scuttleclaw extends Phaser.GameObjects.Container {
  public declare readonly body: Phaser.Physics.Arcade.Body;
  public readonly damage: number;
  private readonly minX: number;
  private readonly maxX: number;
  private readonly speed: number;
  private readonly variant?: ScuttleclawDefinition['variant'];
  private readonly sprite?: Phaser.GameObjects.Sprite;
  private direction = 1;

  public constructor(scene: Phaser.Scene, definition: ScuttleclawDefinition) {
    Scuttleclaw.createAnimations(scene);
    const parts = Scuttleclaw.createVisualParts(scene, definition.variant);
    super(scene, definition.x, definition.y, parts);

    this.sprite = parts.find((part): part is Phaser.GameObjects.Sprite => part instanceof Phaser.GameObjects.Sprite);
    this.minX = Math.min(definition.minX, definition.maxX);
    this.maxX = Math.max(definition.minX, definition.maxX);
    this.speed = Math.max(1, Math.abs(definition.speed ?? DEFAULT_SPEED));
    this.damage = Math.max(1, Math.floor(definition.damage ?? DEFAULT_DAMAGE));
    this.variant = definition.variant;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(BODY_WIDTH, BODY_HEIGHT);
    this.body.setOffset(-BODY_WIDTH / 2, -BODY_HEIGHT / 2);
    this.body.setAllowGravity(this.variant !== 'melt');
    this.body.setDragX(0);
    this.body.setImmovable(true);
    if (this.variant === 'melt') {
      this.body.setVelocityY(0);
    }
    this.body.setVelocityX(this.speed);
    this.setDepth(9);
    this.playAnimation(WALK_ANIMATION_KEY);
  }

  public updatePatrol(): void {
    if (!this.active || !this.body.enable) {
      return;
    }

    if (this.x <= this.minX && this.direction < 0) {
      this.x = this.minX;
      this.direction = 1;
    } else if (this.x >= this.maxX && this.direction > 0) {
      this.x = this.maxX;
      this.direction = -1;
    }

    this.body.setVelocityX(this.speed * this.direction);
    this.playAnimation(WALK_ANIMATION_KEY);
  }

  public defeat(): void {
    if (!this.active || !this.body.enable) {
      return;
    }

    this.body.enable = false;
    this.body.setVelocity(0, 0);
    this.sprite?.stop();
    this.sprite?.setFrame(0);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleY: 0.42,
      y: this.y + 8,
      duration: 130,
      onComplete: () => this.destroy(),
    });
  }

  private static createVisualParts(
    scene: Phaser.Scene,
    variant?: ScuttleclawDefinition['variant'],
  ): Phaser.GameObjects.GameObject[] {
    if (variant === 'melt') {
      return Scuttleclaw.createMeltVisualParts(scene);
    }

    if (scene.textures.exists(TEXTURE_KEYS.scuttleclawAtlas)) {
      const shadow = scene.add.ellipse(0, 16, 74, 10, 0x131817, 0.32);
      const sprite = scene.add.sprite(0, 20, TEXTURE_KEYS.scuttleclawAtlas, 2);
      sprite.setOrigin(0.5, 1);
      sprite.setDisplaySize(SPRITE_DISPLAY_WIDTH, SPRITE_DISPLAY_HEIGHT);
      return [shadow, sprite];
    }

    const shadow = scene.add.ellipse(0, 13, 72, 10, 0x131817, 0.34);

    const rearLegs = [
      scene.add.rectangle(-23, 8, 18, 4, 0x4d221b, 0.96).setRotation(-0.42),
      scene.add.rectangle(-9, 10, 17, 4, 0x5b281f, 0.96).setRotation(-0.18),
      scene.add.rectangle(9, 10, 17, 4, 0x5b281f, 0.96).setRotation(0.18),
      scene.add.rectangle(23, 8, 18, 4, 0x4d221b, 0.96).setRotation(0.42),
    ];

    const leftClaw = scene.add.ellipse(-37, -2, 17, 12, 0x6f2f24, 0.98).setRotation(-0.16);
    leftClaw.setStrokeStyle(2, 0x2a1612, 0.8);

    const rightClaw = scene.add.ellipse(37, -2, 17, 12, 0x6f2f24, 0.98).setRotation(0.16);
    rightClaw.setStrokeStyle(2, 0x2a1612, 0.8);

    const chippedTip = scene.add.triangle(45, -6, 0, 0, 8, 2, 2, 8, 0x171514, 0.98);
    chippedTip.setRotation(0.1);

    const body = scene.add.ellipse(0, 0, 58, 29, 0x7a3528, 0.98);
    body.setStrokeStyle(2, 0x2b1814, 0.92);

    const shellBand = scene.add.rectangle(0, -4, 46, 4, 0xa24b35, 0.38);
    const shellRidge = scene.add.rectangle(-4, 2, 36, 3, 0x381b16, 0.26);

    const leftEye = scene.add.ellipse(-12, -12, 5, 5, 0x050505, 1);
    const rightEye = scene.add.ellipse(12, -12, 5, 5, 0x050505, 1);

    return [shadow, ...rearLegs, leftClaw, rightClaw, chippedTip, body, shellBand, shellRidge, leftEye, rightEye];
  }

  private static createMeltVisualParts(scene: Phaser.Scene): Phaser.GameObjects.GameObject[] {
    const shadow = scene.add.ellipse(0, 14, 68, 11, 0x050809, 0.38);

    const body = scene.add.ellipse(0, 2, 54, 25, 0x0b1217, 0.95);
    body.setStrokeStyle(1, 0xd8ddd2, 0.16);

    const leftSpill = scene.add.ellipse(-21, 5, 24, 15, 0x101a20, 0.82);
    const rightSpill = scene.add.ellipse(22, 4, 21, 13, 0x070d11, 0.78);
    const frontDrip = scene.add.ellipse(-4, 11, 30, 9, 0x111b21, 0.7);

    const leftEye = scene.add.ellipse(-9, -4, 4, 3, 0xd8ddd2, 0.78);
    const rightEye = scene.add.ellipse(8, -5, 4, 3, 0xd8ddd2, 0.72);

    const scratches = scene.add.graphics();
    scratches.lineStyle(1, 0xd8ddd2, 0.22);
    scratches.lineBetween(-18, -10, -11, -15);
    scratches.lineBetween(0, -11, 4, -17);
    scratches.lineBetween(15, -8, 22, -13);

    return [shadow, leftSpill, rightSpill, frontDrip, body, leftEye, rightEye, scratches];
  }

  private static createAnimations(scene: Phaser.Scene): void {
    if (!scene.textures.exists(TEXTURE_KEYS.scuttleclawAtlas)) {
      return;
    }

    const meta = scene.cache.json.get(TEXTURE_KEYS.scuttleclawAtlasMeta) as ScuttleclawAtlasMeta | undefined;
    if (!meta || meta.cellWidth !== 256 || meta.cellHeight !== 160) {
      return;
    }

    Scuttleclaw.createAnimationFromMeta(scene, meta, 'idle', IDLE_ANIMATION_KEY, 3);
    Scuttleclaw.createAnimationFromMeta(scene, meta, 'walk', WALK_ANIMATION_KEY, 8);
  }

  private static createAnimationFromMeta(
    scene: Phaser.Scene,
    meta: ScuttleclawAtlasMeta,
    sourceName: string,
    animationKey: string,
    frameRate: number,
  ): void {
    if (scene.anims.exists(animationKey)) {
      return;
    }

    const sourceFrames = meta.animations[sourceName];
    if (!sourceFrames?.length) {
      return;
    }

    const frames = sourceFrames.map((frame) => ({
      key: TEXTURE_KEYS.scuttleclawAtlas,
      frame: Math.floor(frame.atlasY / meta.cellHeight) * meta.columns + Math.floor(frame.atlasX / meta.cellWidth),
    }));

    scene.anims.create({
      key: animationKey,
      frames,
      frameRate,
      repeat: -1,
    });
  }

  private playAnimation(animationKey: string): void {
    if (!this.sprite || !this.scene.anims.exists(animationKey)) {
      return;
    }

    if (this.sprite.anims.currentAnim?.key !== animationKey) {
      this.sprite.play(animationKey);
    }
  }
}
