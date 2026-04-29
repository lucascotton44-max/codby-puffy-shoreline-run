import Phaser from 'phaser';
import { TEXTURE_KEYS } from '../config/constants.js';
import { GAMEPLAY_TUNING } from '../config/tuning.js';

export class StoryFragment extends Phaser.GameObjects.Container {
  public declare readonly body: Phaser.Physics.Arcade.Body;
  private readonly visual: Phaser.GameObjects.Image | Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, index: number) {
    const hasPropTexture = scene.textures.exists(TEXTURE_KEYS.storyFragmentProp);
    const shadow = scene.add.ellipse(2, 16, 26, 8, 0x172426, 0.32);
    const page = scene.add.rectangle(0, 0, 23, 31, 0xe0c894, hasPropTexture ? 0 : 0.98);
    page.setStrokeStyle(2, 0x574832, 0.85);
    page.setVisible(!hasPropTexture);

    const prop = hasPropTexture ? scene.add.image(0, 0, TEXTURE_KEYS.storyFragmentProp) : null;
    prop?.setDisplaySize(34, 34);

    const fold = scene.add.triangle(8, -10, 0, 0, 9, 0, 9, 9, 0xf7e2ac, hasPropTexture ? 0 : 0.98);
    const twine = scene.add.rectangle(0, 4, 24, 3, 0x7b5f3d, hasPropTexture ? 0 : 0.82);
    const lineOne = scene.add.rectangle(-2, -5, 14, 2, 0x5e4b34, hasPropTexture ? 0 : 0.66);
    const lineTwo = scene.add.rectangle(-4, 12, 11, 2, 0x5e4b34, hasPropTexture ? 0 : 0.58);
    const mark = scene.add.text(-5, -16, String(index), {
      color: '#3d3427',
      fontFamily: 'monospace',
      fontSize: '10px',
      fontStyle: 'bold',
    });
    mark.setVisible(!hasPropTexture);

    super(scene, x, y, prop ? [shadow, prop, page, fold, twine, lineOne, lineTwo, mark] : [shadow, page, fold, twine, lineOne, lineTwo, mark]);

    this.visual = prop ?? page;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setAllowGravity(false);
    this.body.setSize(GAMEPLAY_TUNING.collectibles.pickupSize.width, GAMEPLAY_TUNING.collectibles.pickupSize.height);
    this.body.setOffset(
      -GAMEPLAY_TUNING.collectibles.pickupSize.width / 2,
      -GAMEPLAY_TUNING.collectibles.pickupSize.height / 2,
    );
  }

  public collect(): void {
    this.body.enable = false;
    this.scene.tweens.add({
      targets: this,
      y: this.y - 20,
      alpha: 0,
      scale: 1.25,
      duration: 160,
      onComplete: () => this.destroy(),
    });
  }

  public pulse(time: number): void {
    this.visual.rotation = Math.sin(time / 260) * 0.08;
    this.y += Math.sin(time / 180) * 0.015;
  }
}
