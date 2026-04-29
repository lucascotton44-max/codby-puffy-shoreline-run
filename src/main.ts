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

new Phaser.Game(config);
