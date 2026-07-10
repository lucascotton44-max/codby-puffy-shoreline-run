export type CreatureRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface Creature {
  id: string;
  name: string;
  rarity: CreatureRarity;
  /** % of creature that has melted. null = non-melt creature (cast Bart, legendary, etc.) */
  meltPercent: number | null;
  /** Spritesheet / texture key — populated in C2 when art is ready. */
  textureKey?: string;
  flavor?: string;
}

/**
 * Registry of all Calvin creatures confirmed from Calvin's cards.
 * Keys match the `creatureId` on FragmentDefinition / StoryFragment.
 *
 * TODO (C2/C3): add remaining melts to reach ~22 total
 * TODO (C3): add the 8 cast Barts
 * TODO (C2+): set textureKey for each once art is prepared
 * TODO: replace legendary-unknown's name once Calvin names it
 */
export const CREATURES: Readonly<Record<string, Creature>> = {
  'drip-head': {
    id: 'drip-head',
    name: 'Drip-Head',
    rarity: 'rare',
    meltPercent: 48,
  },
  'spike-drip': {
    id: 'spike-drip',
    name: 'Spike-Drip',
    rarity: 'uncommon',
    meltPercent: 40,
  },
  'blob-frog': {
    id: 'blob-frog',
    name: 'Blob-Frog',
    rarity: 'common',
    meltPercent: 22,
  },
  'book-ghost': {
    id: 'book-ghost',
    name: 'Book-Ghost',
    rarity: 'uncommon',
    meltPercent: 40,
  },
  'button-eyes': {
    id: 'button-eyes',
    name: 'Button-Eyes',
    rarity: 'uncommon',
    meltPercent: 80,
  },
  'tiny-puddle': {
    id: 'tiny-puddle',
    name: 'Tiny-Puddle',
    rarity: 'common',
    meltPercent: 2,
  },
  'puff-face': {
    id: 'puff-face',
    name: 'Puff-Face',
    rarity: 'common',
    meltPercent: 9,
  },
  'melt-grin': {
    id: 'melt-grin',
    name: 'Melt-Grin',
    rarity: 'uncommon',
    meltPercent: 90,
  },
  'drip-stack': {
    id: 'drip-stack',
    name: 'Drip-Stack',
    rarity: 'rare',
    meltPercent: 99,
  },
  'snail-sludge': {
    id: 'snail-sludge',
    name: 'Snail-Sludge',
    rarity: 'uncommon',
    meltPercent: null,
  },
  'drip-block': {
    id: 'drip-block',
    name: 'Drip-Block',
    rarity: 'uncommon',
    meltPercent: 40,
  },
  // Ships as a locked "?" card until Calvin names it.
  'legendary-unknown': {
    id: 'legendary-unknown',
    name: '???',
    rarity: 'legendary',
    meltPercent: null,
  },
};

export const CREATURE_ATTRIBUTION = 'From a drawing by Calvin Royce Stay';
