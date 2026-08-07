import Phaser from 'phaser';
import { GAME_HEIGHT, GAME_WIDTH } from './config/constants.js';
import { ShorelineScene } from './scenes/ShorelineScene.js';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'app',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#172426',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 900, x: 0 },
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [ShorelineScene],
};

// Build stamp (injected per page load by the vite plugin): logged on boot so
// every session — and every verification screenshot's console — can be checked
// against `git rev-parse --short HEAD`. A mismatched or missing stamp means
// the tab is running stale code and its evidence is void.
const buildStamp = (window as unknown as { __SHORELINE_BUILD__?: { commit: string; loadedAt: string } })
  .__SHORELINE_BUILD__;
console.log(
  `[shoreline-run] build ${buildStamp?.commit ?? 'unknown'} loaded ${buildStamp?.loadedAt ?? '?'}`,
);

const game = new Phaser.Game(config);

// QA hook: import.meta.env exists only under the Vite dev server; the
// production build (plain tsc, no bundler) has no env, so guard the access.
const env = (import.meta as { env?: { DEV?: boolean } }).env;
if (env?.DEV) {
  (window as unknown as { game?: Phaser.Game }).game = game;
}
