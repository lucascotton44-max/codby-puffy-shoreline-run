import Phaser from 'phaser';
import type { ScuttleclawDefinition } from '../config/levels.js';

const DEFAULT_SPEED = 48;
const DEFAULT_DAMAGE = 1;
const BODY_WIDTH = 62;
const BODY_HEIGHT = 22;

export class Scuttleclaw extends Phaser.GameObjects.Container {
  public declare readonly body: Phaser.Physics.Arcade.Body;
  public readonly damage: number;
  private readonly minX: number;
  private readonly maxX: number;
  private readonly speed: number;
  private direction = 1;

  public constructor(scene: Phaser.Scene, definition: ScuttleclawDefinition) {
    const parts = Scuttleclaw.createVisualParts(scene);
    super(scene, definition.x, definition.y, parts);

    this.minX = Math.min(definition.minX, definition.maxX);
    this.maxX = Math.max(definition.minX, definition.maxX);
    this.speed = Math.max(1, Math.abs(definition.speed ?? DEFAULT_SPEED));
    this.damage = Math.max(1, Math.floor(definition.damage ?? DEFAULT_DAMAGE));

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.body.setSize(BODY_WIDTH, BODY_HEIGHT);
    this.body.setOffset(-BODY_WIDTH / 2, -BODY_HEIGHT / 2);
    this.body.setAllowGravity(true);
    this.body.setDragX(0);
    this.body.setImmovable(true);
    this.body.setVelocityX(this.speed);
    this.setDepth(9);
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
  }

  private static createVisualParts(scene: Phaser.Scene): Phaser.GameObjects.GameObject[] {
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
}
