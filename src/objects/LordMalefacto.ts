import Phaser from 'phaser';
import { GAMEPLAY_TUNING } from '../config/tuning.js';
import { TEXTURE_KEYS } from '../config/constants.js';
import type { LordMalefactoDefinition } from '../config/levels.js';

type LordMalefactoState = 'idle' | 'telegraph' | 'attackActive' | 'vulnerable' | 'hitStun' | 'defeated';

const BODY_WIDTH = 74;
const BODY_HEIGHT = 156;
const FLARE_WIDTH = 260;
const FLARE_HEIGHT = 112;
const IDLE_MS = 700;
const VISUAL_SCALE = 0.84;

export class LordMalefacto extends Phaser.GameObjects.Container {
  public declare readonly body: Phaser.Physics.Arcade.Body;
  public readonly damage: number;
  private readonly baseX: number;
  private readonly baseY: number;
  private readonly flareZone: Phaser.GameObjects.Rectangle;
  private readonly flareBody: Phaser.Physics.Arcade.Body;
  private readonly hitboxCue: Phaser.GameObjects.Rectangle;
  private readonly coat: Phaser.GameObjects.Rectangle;
  private readonly shoulder: Phaser.GameObjects.Rectangle;
  private readonly collar: Phaser.GameObjects.Triangle;
  private readonly head: Phaser.GameObjects.Ellipse;
  private readonly lantern: Phaser.GameObjects.Arc;
  private readonly lanternGlow: Phaser.GameObjects.Arc;
  private readonly eyeLine: Phaser.GameObjects.Rectangle;
  private readonly statusText: Phaser.GameObjects.Text;
  private readonly vulnerableText: Phaser.GameObjects.Text;
  private readonly stompCue: Phaser.GameObjects.Triangle;
  private hp: number;
  private bossState: LordMalefactoState = 'idle';
  private stateEndsAt = 0;
  private readonly spriteBody?: Phaser.GameObjects.Image;
  private readonly bodyPrimitives: Phaser.GameObjects.Rectangle[] = [];

  public constructor(scene: Phaser.Scene, definition: LordMalefactoDefinition) {
    const parts = LordMalefacto.createVisualParts(scene);
    super(scene, definition.x, definition.y, parts);

    this.baseX = definition.x;
    this.baseY = definition.y;
    this.hp = definition.hp ?? GAMEPLAY_TUNING.bosses.lordMalefacto.maxHealth;
    this.damage = definition.damage ?? GAMEPLAY_TUNING.bosses.lordMalefacto.damage;
    this.hitboxCue = parts[1] as Phaser.GameObjects.Rectangle;
    this.coat = parts[2] as Phaser.GameObjects.Rectangle;
    this.shoulder = parts[5] as Phaser.GameObjects.Rectangle;
    this.collar = parts[6] as Phaser.GameObjects.Triangle;
    this.head = parts[7] as Phaser.GameObjects.Ellipse;
    this.lanternGlow = parts[9] as Phaser.GameObjects.Arc;
    this.lantern = parts[10] as Phaser.GameObjects.Arc;
    this.eyeLine = parts[13] as Phaser.GameObjects.Rectangle;
    this.statusText = parts[17] as Phaser.GameObjects.Text;
    this.vulnerableText = parts[18] as Phaser.GameObjects.Text;
    this.stompCue = parts[19] as Phaser.GameObjects.Triangle;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.body.setSize(BODY_WIDTH, BODY_HEIGHT);
    this.body.setOffset(-BODY_WIDTH / 2, -BODY_HEIGHT / 2);
    this.setDepth(11);

    // Body primitives hidden when sprite is active; shown for vulnerable/hitStun feedback
    this.bodyPrimitives = [
      parts[2], parts[3], parts[4], parts[5], parts[6],
      parts[7], parts[8], parts[13], parts[14], parts[15], parts[16],
    ] as Phaser.GameObjects.Rectangle[];

    if (scene.textures.exists(TEXTURE_KEYS.lordMalefactoAtlas)) {
      this.spriteBody = scene.add.image(0, -14, TEXTURE_KEYS.lordMalefactoAtlas, 0);
      this.spriteBody.setOrigin(0.5, 0.5);
      this.spriteBody.setScale(0.75);
      this.addAt(this.spriteBody, 1);
    }

    this.flareZone = scene.add.rectangle(definition.x - 138, definition.y + 42, FLARE_WIDTH, FLARE_HEIGHT, 0xb65b2a, 0);
    scene.physics.add.existing(this.flareZone);
    this.flareBody = this.flareZone.body as Phaser.Physics.Arcade.Body;
    this.flareBody.setAllowGravity(false);
    this.flareBody.setImmovable(true);
    this.flareBody.setSize(FLARE_WIDTH, FLARE_HEIGHT);
    this.flareBody.enable = false;
    this.flareZone.setDepth(10);
    this.flareZone.setStrokeStyle(3, 0xd88a36, 0);
    this.flareZone.setVisible(false);

    this.enterState('idle', scene.time.now);
  }

  public update(time: number): void {
    if (this.bossState === 'defeated' || time < this.stateEndsAt) {
      return;
    }

    if (this.bossState === 'idle') {
      this.enterState('telegraph', time);
      return;
    }

    if (this.bossState === 'telegraph') {
      this.enterState('attackActive', time);
      return;
    }

    if (this.bossState === 'attackActive') {
      this.enterState('vulnerable', time);
      return;
    }

    this.enterState('idle', time);
  }

  public getFlareZone(): Phaser.GameObjects.Rectangle {
    return this.flareZone;
  }

  public isAttackActive(): boolean {
    return this.bossState === 'attackActive' && this.flareBody.enable;
  }

  public isDefeated(): boolean {
    return this.bossState === 'defeated';
  }

  public isVulnerable(): boolean {
    return this.bossState === 'vulnerable';
  }

  public getHealth(): number {
    return Math.max(0, this.hp);
  }

  public takeHit(time: number): boolean {
    if (!this.isVulnerable()) {
      return false;
    }

    this.hp -= 1;

    if (this.hp <= 0) {
      this.enterState('defeated', time);
      return true;
    }

    this.enterState('hitStun', time);
    return false;
  }

  private enterState(nextState: LordMalefactoState, time: number): void {
    this.bossState = nextState;
    this.syncBodyVisual(nextState);
    this.flareBody.enable = false;
    this.setPosition(this.baseX, this.baseY);
    this.body.reset(this.baseX, this.baseY);
    this.setAlpha(1);
    this.setScale(VISUAL_SCALE);
    this.hitboxCue.setStrokeStyle(3, 0x121616, 0.45);
    this.coat.setFillStyle(0x161616, 0.98);
    this.coat.setStrokeStyle(4, 0x050505, 0.96);
    this.shoulder.setFillStyle(0x25201d, 0.98);
    this.collar.setFillStyle(0x3a322a, 0.95);
    this.head.setFillStyle(0x1e1d1b, 0.98);
    this.lanternGlow.setAlpha(0.12);
    this.lantern.setAlpha(0.78);
    this.statusText.setColor('#d8ddd2');
    this.statusText.setText(`MALEFACTO ${this.getHealth()}`);
    this.flareZone.setAlpha(0);
    this.flareZone.setStrokeStyle(3, 0xd88a36, 0);
    this.flareZone.setVisible(false);
    this.vulnerableText.setVisible(false);
    this.stompCue.setVisible(false);
    this.stompCue.setFillStyle(0xd9f5ff, 0.95);

    if (nextState === 'idle') {
      this.stateEndsAt = time + IDLE_MS;
      this.eyeLine.setFillStyle(0x9f3d26, 0.58);
      return;
    }

    if (nextState === 'telegraph') {
      this.stateEndsAt = time + GAMEPLAY_TUNING.bosses.lordMalefacto.telegraphMs;
      this.statusText.setText(`MALEFACTO ${this.getHealth()}  FLARE`);
      this.lantern.setAlpha(1);
      this.lanternGlow.setAlpha(0.72);
      this.eyeLine.setFillStyle(0xd19745, 0.85);
      this.flareZone.setFillStyle(0xd18434, 0.2);
      this.flareZone.setStrokeStyle(3, 0xd8a156, 0.72);
      this.flareZone.setAlpha(0.72);
      this.flareZone.setVisible(true);
      return;
    }

    if (nextState === 'attackActive') {
      this.stateEndsAt = time + GAMEPLAY_TUNING.bosses.lordMalefacto.attackActiveMs;
      this.flareBody.enable = true;
      this.statusText.setText(`MALEFACTO ${this.getHealth()}  DANGER`);
      this.lanternGlow.setAlpha(0.95);
      this.flareZone.setFillStyle(0xb65b2a, 0.58);
      this.flareZone.setStrokeStyle(4, 0xffb35a, 0.9);
      this.flareZone.setAlpha(0.9);
      this.flareZone.setVisible(true);
      return;
    }

    if (nextState === 'vulnerable') {
      this.stateEndsAt = time + GAMEPLAY_TUNING.bosses.lordMalefacto.vulnerableMs;
      this.setPosition(this.baseX, this.baseY + 10);
      this.body.reset(this.x, this.y);
      this.statusText.setText(`MALEFACTO ${this.getHealth()}  VULNERABLE`);
      this.statusText.setColor('#eef8ff');
      this.vulnerableText.setVisible(true);
      this.vulnerableText.setText('VULNERABLE\nSTOMP NOW');
      this.stompCue.setVisible(true);
      this.hitboxCue.setStrokeStyle(7, 0xf5fbff, 1);
      this.coat.setFillStyle(0xdceff5, 0.98);
      this.coat.setStrokeStyle(7, 0xffffff, 1);
      this.shoulder.setFillStyle(0xf5fbff, 0.98);
      this.collar.setFillStyle(0xd9f5ff, 0.86);
      this.head.setFillStyle(0xeaf7fb, 0.98);
      this.lantern.setAlpha(0.22);
      this.lanternGlow.setAlpha(0);
      this.eyeLine.setFillStyle(0x143036, 0.95);
      return;
    }

    if (nextState === 'hitStun') {
      this.stateEndsAt = time + GAMEPLAY_TUNING.bosses.lordMalefacto.hitStunMs;
      this.setPosition(this.baseX - 8, this.baseY);
      this.body.reset(this.x, this.y);
      this.statusText.setText(`MALEFACTO ${this.getHealth()}  HIT`);
      this.statusText.setColor('#ffffff');
      this.vulnerableText.setVisible(true);
      this.vulnerableText.setText('STUNNED');
      this.hitboxCue.setStrokeStyle(6, 0xffffff, 0.85);
      this.coat.setFillStyle(0xffffff, 0.95);
      this.coat.setStrokeStyle(6, 0xffffff, 0.9);
      this.setAlpha(0.82);
      this.lantern.setAlpha(0.3);
      return;
    }

    this.stateEndsAt = Number.POSITIVE_INFINITY;
    this.body.enable = false;
    this.flareBody.enable = false;
    this.flareZone.setAlpha(0);
    this.flareZone.setVisible(false);
    this.statusText.setText('MALEFACTO 0');
    this.vulnerableText.setVisible(true);
    this.vulnerableText.setText('DEFEATED');
    this.stompCue.setVisible(false);
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      scaleY: VISUAL_SCALE * 0.55,
      y: this.y + 34,
      duration: 360,
    });
  }

  private syncBodyVisual(state: LordMalefactoState): void {
    if (!this.spriteBody) {
      return;
    }
    const showPrimitives = state === 'vulnerable' || state === 'hitStun';
    this.spriteBody.setVisible(!showPrimitives);
    for (const part of this.bodyPrimitives) {
      part.setVisible(showPrimitives);
    }
  }

  private static createVisualParts(scene: Phaser.Scene): Phaser.GameObjects.GameObject[] {
    const shadow = scene.add.ellipse(0, 98, 116, 20, 0x111615, 0.36);
    const hitboxCue = scene.add.rectangle(0, 0, BODY_WIDTH / VISUAL_SCALE, BODY_HEIGHT / VISUAL_SCALE, 0x000000, 0);
    const coat = scene.add.rectangle(0, 16, 74, 160, 0x161616, 0.98);
    const coatHem = scene.add.rectangle(0, 92, 92, 24, 0x111111, 0.98);
    const brassRib = scene.add.rectangle(-14, 18, 8, 142, 0x7d5a30, 0.78);
    const shoulder = scene.add.rectangle(0, -64, 96, 24, 0x25201d, 0.98);
    const collar = scene.add.triangle(3, -51, 0, 34, 42, 0, 84, 34, 0x3a322a, 0.95);
    const head = scene.add.ellipse(9, -88, 38, 34, 0x1e1d1b, 0.98);
    const facePlate = scene.add.rectangle(14, -86, 26, 18, 0x111111, 0.88);
    const lanternGlow = scene.add.arc(-62, 8, 34, 0, 360, false, 0xd18434, 0.12);
    const lantern = scene.add.arc(-62, 8, 23, 0, 360, false, 0xb98436, 0.78);
    const lanternHandle = scene.add.arc(-62, -18, 22, 210, 330, false, 0x8a6430, 0).setStrokeStyle(4, 0x8a6430, 0.86);
    const lanternCore = scene.add.rectangle(-62, 8, 16, 28, 0xf0b35c, 0.68);
    const eyeLine = scene.add.rectangle(16, -88, 28, 5, 0x9f3d26, 0.58);
    const hat = scene.add.rectangle(9, -110, 72, 12, 0x0d0d0d, 0.98);
    const hatTop = scene.add.rectangle(14, -126, 42, 24, 0x181818, 0.98);
    const corrosion = scene.add.rectangle(20, 34, 30, 4, 0x8b5a2d, 0.64).setRotation(-0.2);
    const statusText = scene.add.text(0, -150, 'MALEFACTO 3', {
      align: 'center',
      color: '#d8ddd2',
      fontFamily: 'monospace',
      fontSize: '15px',
      fontStyle: 'bold',
    });
    const vulnerableText = scene.add.text(0, -118, 'VULNERABLE\nSTOMP NOW', {
      align: 'center',
      color: '#ffffff',
      fontFamily: 'monospace',
      fontSize: '16px',
      fontStyle: 'bold',
      lineSpacing: 4,
    });
    const stompCue = scene.add.triangle(0, -98, 0, 0, 28, 0, 14, 24, 0xd9f5ff, 0.95);

    statusText.setOrigin(0.5, 0.5);
    vulnerableText.setOrigin(0.5, 0.5);
    vulnerableText.setVisible(false);
    stompCue.setOrigin(0.5, 0.5);
    stompCue.setVisible(false);
    hitboxCue.setStrokeStyle(3, 0x121616, 0.45);
    coat.setStrokeStyle(4, 0x050505, 0.96);
    shoulder.setStrokeStyle(2, 0x070707, 0.9);
    head.setStrokeStyle(2, 0x050505, 0.95);
    hat.setStrokeStyle(2, 0x050505, 0.95);
    hatTop.setStrokeStyle(2, 0x050505, 0.95);
    lantern.setStrokeStyle(3, 0x3a2417, 0.9);
    lanternCore.setStrokeStyle(1, 0x5d381f, 0.86);

    return [
      shadow,
      hitboxCue,
      coat,
      coatHem,
      brassRib,
      shoulder,
      collar,
      head,
      facePlate,
      lanternGlow,
      lantern,
      lanternHandle,
      lanternCore,
      eyeLine,
      hat,
      hatTop,
      corrosion,
      statusText,
      vulnerableText,
      stompCue,
    ];
  }
}
