import { COLORS } from './constants.js';
import { GAMEPLAY_TUNING } from './tuning.js';

export type CharacterKey = 'cod' | 'puffy';

export type CharacterConfig = {
  key: CharacterKey;
  label: string;
  maxHealth: number;
  moveSpeed: number;
  jumpSpeed: number;
  gravityY: number;
  dragX: number;
  bodyColor: number;
  accentColor: number;
  width: number;
  height: number;
};

export const CHARACTERS: Record<CharacterKey, CharacterConfig> = {
  cod: {
    key: 'cod',
    label: "COD B'Y",
    maxHealth: GAMEPLAY_TUNING.characters.cod.maxHealth,
    moveSpeed: GAMEPLAY_TUNING.characters.cod.moveSpeed,
    jumpSpeed: GAMEPLAY_TUNING.characters.cod.jumpVelocity,
    gravityY: GAMEPLAY_TUNING.characters.cod.gravityY,
    dragX: GAMEPLAY_TUNING.characters.cod.dragX,
    bodyColor: COLORS.cod,
    accentColor: 0x3d3427,
    width: GAMEPLAY_TUNING.characters.cod.hitbox.width,
    height: GAMEPLAY_TUNING.characters.cod.hitbox.height,
  },
  puffy: {
    key: 'puffy',
    label: 'PUFFY',
    maxHealth: GAMEPLAY_TUNING.characters.puffy.maxHealth,
    moveSpeed: GAMEPLAY_TUNING.characters.puffy.moveSpeed,
    jumpSpeed: GAMEPLAY_TUNING.characters.puffy.jumpVelocity,
    gravityY: GAMEPLAY_TUNING.characters.puffy.gravityY,
    dragX: GAMEPLAY_TUNING.characters.puffy.dragX,
    bodyColor: COLORS.puffy,
    accentColor: COLORS.puffyMark,
    width: GAMEPLAY_TUNING.characters.puffy.hitbox.width,
    height: GAMEPLAY_TUNING.characters.puffy.hitbox.height,
  },
};
