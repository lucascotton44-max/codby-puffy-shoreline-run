import Phaser from 'phaser';
import { getPaintedParallaxTiles, PaintedParallaxConfig, PaintedParallaxLayer } from '../config/levelVisuals.js';

export function shouldUsePaintedParallax(scene: Phaser.Scene, cfg: PaintedParallaxConfig): boolean {
  return !(scene.game.renderer.type === Phaser.CANVAS && Math.abs(cfg.scale - 1) > 1e-6);
}

export function hasPaintedParallax(scene: Phaser.Scene, cfg: PaintedParallaxConfig): boolean {
  if (!shouldUsePaintedParallax(scene, cfg)) {
    return false;
  }
  return cfg.layers.every((layer) => {
    if (!('tiles' in layer)) {
      return scene.textures.exists(layer.keyA);
    }
    getPaintedTileStride(cfg, layer);
    const tiles = getPaintedParallaxTiles(layer);
    return tiles.length > 0 && tiles.every((tile) => scene.textures.exists(tile.key));
  });
}

/** Painted parallax layers (back-to-front), with ordered side-by-side sub-2048
 *  tiles sharing the config's topY/scale so they stay vertically registered;
 *  only scrollFactorX differs per layer. Added to the root display list — the
 *  create() layer sweep moves them to worldLayer. */
export function createPaintedParallax(scene: Phaser.Scene, cfg: PaintedParallaxConfig): void {
  cfg.layers.forEach((layer) => addPaintedLayer(scene, cfg, layer));
}

function getPaintedTileStride(cfg: PaintedParallaxConfig, layer: PaintedParallaxLayer): number {
  const scaledStride = cfg.tileW * cfg.scale;
  const stride = Math.round(scaledStride);
  if ('tiles' in layer && !(Math.abs(scaledStride - stride) <= 1e-6)) {
    throw new Error(`Painted parallax tiles require an integral scaled stride; received ${scaledStride}.`);
  }
  return stride;
}

function addPaintedLayer(scene: Phaser.Scene, cfg: PaintedParallaxConfig, layer: PaintedParallaxLayer): void {
  const stride = getPaintedTileStride(cfg, layer);
  getPaintedParallaxTiles(layer).forEach((tile, index) => {
    const img = scene.add.image(index * stride, cfg.topY, tile.key);
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
