import Phaser from 'phaser';
import { COLORS, TEXTURE_KEYS } from '../config/constants.js';
import { GAMEPLAY_TUNING } from '../config/tuning.js';

export type PowerUpKind = 'kelpShield' | 'tideLift' | 'storySpark' | 'tiderunner';

const POWER_UP_LABELS: Record<PowerUpKind, string> = {
  kelpShield: 'KELP',
  tideLift: 'TIDE',
  storySpark: 'MAG',
  tiderunner: 'RUN',
};

const TIDERUNNER_IDLE_ANIMATION_KEY = 'tiderunner-idle';

type TiderunnerAtlasFrame = {
  atlasX: number;
  atlasY: number;
  w: number;
  h: number;
};

type TiderunnerAtlasMeta = {
  cellWidth: number;
  cellHeight: number;
  columns: number;
  animations: Record<string, TiderunnerAtlasFrame[]>;
};

export class PowerUpPickup extends Phaser.GameObjects.Container {
  public declare readonly body: Phaser.Physics.Arcade.Body;
  public readonly kind: PowerUpKind;
  private readonly core:
    | Phaser.GameObjects.Image
    | Phaser.GameObjects.Sprite
    | Phaser.GameObjects.Arc
    | Phaser.GameObjects.Rectangle;

  public constructor(scene: Phaser.Scene, x: number, y: number, kind: PowerUpKind) {
    const parts = PowerUpPickup.createVisualParts(scene, kind);
    super(scene, x, y, parts);

    this.kind = kind;
    this.core = parts[1] as
      | Phaser.GameObjects.Image
      | Phaser.GameObjects.Sprite
      | Phaser.GameObjects.Arc
      | Phaser.GameObjects.Rectangle;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setSize(GAMEPLAY_TUNING.powerUps.pickupSize.width, GAMEPLAY_TUNING.powerUps.pickupSize.height);
    this.body.setOffset(-GAMEPLAY_TUNING.powerUps.pickupSize.width / 2, -GAMEPLAY_TUNING.powerUps.pickupSize.height / 2);
    this.setDepth(12);
  }

  public collect(): void {
    this.body.enable = false;
    this.scene.tweens.add({
      targets: this,
      y: this.y - 18,
      alpha: 0,
      scale: 1.2,
      duration: 150,
      onComplete: () => this.destroy(),
    });
  }

  public pulse(time: number): void {
    this.core.rotation = Math.sin(time / 320) * 0.08;
    this.y += Math.sin(time / 210) * 0.012;
  }

  private static createVisualParts(scene: Phaser.Scene, kind: PowerUpKind): Phaser.GameObjects.GameObject[] {
    const shadow = scene.add.ellipse(2, 17, 30, 8, 0x172426, 0.28);
    const icon = PowerUpPickup.createIcon(scene, kind);

    if (icon) {
      const label = scene.add.text(-18, 22, POWER_UP_LABELS[kind], {
        color: COLORS.text,
        fontFamily: 'monospace',
        fontSize: '8px',
        fontStyle: 'bold',
      });

      return [shadow, icon, label];
    }

    if (kind === 'tiderunner' && scene.textures.exists(TEXTURE_KEYS.tiderunnerAtlas)) {
      PowerUpPickup.createTiderunnerAnimation(scene);
      const sprite = scene.add.sprite(0, 17, TEXTURE_KEYS.tiderunnerAtlas, 0);
      sprite.setDisplaySize(34, 34);
      if (scene.anims.exists(TIDERUNNER_IDLE_ANIMATION_KEY)) {
        sprite.play(TIDERUNNER_IDLE_ANIMATION_KEY);
      }
      const label = scene.add.text(-18, 22, POWER_UP_LABELS[kind], {
        color: COLORS.text,
        fontFamily: 'monospace',
        fontSize: '8px',
        fontStyle: 'bold',
      });

      return [shadow, sprite, label];
    }

    const color =
      kind === 'kelpShield'
        ? 0x5f8b4b
        : kind === 'tideLift'
          ? 0x5f9eb6
          : kind === 'tiderunner'
            ? 0x4f8fa6
            : 0xd5a24f;
    const stroke =
      kind === 'kelpShield'
        ? 0x2f5232
        : kind === 'tideLift'
          ? 0x27566a
          : kind === 'tiderunner'
            ? 0x234b57
            : 0x6d4d24;
    const core =
      kind === 'storySpark'
        ? scene.add.rectangle(0, 0, 25, 29, color, 0.95)
        : kind === 'tiderunner'
          ? scene.add.arc(0, 0, 16, 35, 315, false, color, 0.95)
        : scene.add.arc(0, 0, 15, kind === 'tideLift' ? 35 : 0, kind === 'tideLift' ? 325 : 360, false, color, 0.95);

    core.setStrokeStyle(2, stroke, 0.9);

    const mark =
      kind === 'kelpShield'
        ? scene.add.rectangle(0, 1, 7, 24, 0xc6d7a1, 0.78)
        : kind === 'tideLift'
          ? scene.add.arc(0, 0, 9, 35, 325, false, 0xd8e8e8, 0.5).setStrokeStyle(3, 0xd8e8e8, 0.5)
          : kind === 'tiderunner'
            ? scene.add.rectangle(7, 0, 9, 3, 0xd8e8e8, 0.78).setRotation(-0.34)
            : scene.add.rectangle(0, -1, 16, 3, 0xf4d28b, 0.8);

    if (kind === 'kelpShield') {
      mark.setRotation(-0.28);
    }

    const label = scene.add.text(-18, 22, POWER_UP_LABELS[kind], {
      color: COLORS.text,
      fontFamily: 'monospace',
      fontSize: '8px',
      fontStyle: 'bold',
    });

    return [shadow, core, mark, label];
  }

  private static createIcon(scene: Phaser.Scene, kind: PowerUpKind): Phaser.GameObjects.Image | null {
    if (kind === 'tiderunner') {
      return null;
    }

    const textureKey =
      kind === 'kelpShield'
        ? TEXTURE_KEYS.kelpShieldIcon
        : kind === 'tideLift'
          ? TEXTURE_KEYS.tideLiftIcon
          : TEXTURE_KEYS.storySparkIcon;

    if (!scene.textures.exists(textureKey)) {
      return null;
    }

    const icon = scene.add.image(0, -1, textureKey);
    icon.setDisplaySize(38, 38);
    return icon;
  }

  private static createTiderunnerAnimation(scene: Phaser.Scene): void {
    if (scene.anims.exists(TIDERUNNER_IDLE_ANIMATION_KEY)) {
      return;
    }

    const meta = scene.cache.json.get(TEXTURE_KEYS.tiderunnerAtlasMeta) as TiderunnerAtlasMeta | undefined;
    const sourceFrames = meta?.animations.idle;
    if (!meta || meta.cellWidth !== 128 || meta.cellHeight !== 128 || !sourceFrames?.length) {
      return;
    }

    scene.anims.create({
      key: TIDERUNNER_IDLE_ANIMATION_KEY,
      frames: sourceFrames.map((frame) => ({
        key: TEXTURE_KEYS.tiderunnerAtlas,
        frame: Math.floor(frame.atlasY / meta.cellHeight) * meta.columns + Math.floor(frame.atlasX / meta.cellWidth),
      })),
      frameRate: 3,
      repeat: -1,
    });
  }
}
