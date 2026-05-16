import Phaser from 'phaser';
import { COLORS } from '../config/constants.js';
import { GAMEPLAY_TUNING } from '../config/tuning.js';

export type HazardKind = 'water' | 'rock' | 'net' | 'blackSketchPuddle';

export class HazardZone extends Phaser.GameObjects.Rectangle {
  public declare readonly body: Phaser.Physics.Arcade.StaticBody;
  public readonly damage: number;
  public readonly kind: HazardKind;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    kind: HazardKind,
    damage = GAMEPLAY_TUNING.hazards.defaultDamage,
  ) {
    super(scene, x, y, width, height, COLORS.hazard, 0);

    this.kind = kind;
    this.damage = damage;

    scene.add.existing(this);
    scene.physics.add.existing(this, true);
    this.setVisible(false);
  }
}
