import type Phaser from 'phaser';
import { PaintedParallaxConfig, PaintedParallaxLayer } from '../config/levelVisuals.js';

export function hasPaintedParallax(scene: Phaser.Scene, cfg: PaintedParallaxConfig): boolean {
  return cfg.layers.every((layer) => scene.textures.exists(layer.keyA));
}

/** Painted parallax layers (back-to-front), each two side-by-side sub-2048
 *  tiles sharing the config's topY/scale so they stay vertically registered;
 *  only scrollFactorX differs per layer. Added to the root display list — the
 *  create() layer sweep moves them to worldLayer. */
export function createPaintedParallax(scene: Phaser.Scene, cfg: PaintedParallaxConfig): void {
  cfg.layers.forEach((layer) => addPaintedLayerPair(scene, cfg, layer));
}

function addPaintedLayerPair(scene: Phaser.Scene, cfg: PaintedParallaxConfig, layer: PaintedParallaxLayer): void {
  [layer.keyA, layer.keyB].forEach((key, index) => {
    const img = scene.add.image(index * cfg.tileW * cfg.scale, cfg.topY, key);
    img.setOrigin(0, 0);
    img.setScale(cfg.scale);
    img.setScrollFactor(layer.scrollX, 0);
    img.setDepth(layer.depth);
    // These full painted images carry their own zoom compensation (uniform
    // scale baked into cfg.scale). The generic level-1 reseat does a scaleY-ONLY
    // counter-scale that would squash them, so exclude them from it.
    img.setData('skipReseat', true);
  });
}
