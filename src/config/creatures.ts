export type CreatureRarity = 'common' | 'uncommon' | 'rare' | 'legendary';

export interface Creature {
  id: string;
  name: string;
  rarity: CreatureRarity;
  /** % of creature that has melted. null = not yet confirmed with Calvin. */
  meltPercent: number | null;
  /** Texture key the scene preload registers for this creature's cutout. */
  textureKey: string;
  /** Filename under MELT_CUTOUT_BASE_PATH (transparent set — renders on the dark gallery card). */
  file: string;
  /** True while % / rarity are placeholders awaiting Calvin's confirmation. */
  provisional?: boolean;
  flavor?: string;
}

/** Transparent cutout set ONLY — the white_background_png siblings are not for the gallery. */
export const MELT_CUTOUT_BASE_PATH = 'assets/sprites/calvin/melts/melt_creature_cutouts/transparent_png/';

/**
 * Registry of Calvin's real melt roster (C2): the 14 scanned cutouts.
 * Keys match the `creatureId` on FragmentDefinition / StoryFragment.
 *
 * Confirmed with Calvin: melt-long-48, melt-king, melt-snail.
 * The rest are provisional (meltPercent null, rarity defaulted) until confirmed.
 *
 * TODO (C3): add the 8 cast Barts
 */
export const CREATURES: Readonly<Record<string, Creature>> = {
  'melt-crowned-long': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-crowned-long',
    name: 'Crowned Long Blob',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-crowned-long',
    file: '01_crowned_long_blob.png',
  },
  'melt-flying': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-flying',
    name: 'Flying Blob',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-flying',
    file: '02_flying_blob.png',
  },
  'melt-long-48': {
    // CONFIRMED: 48% melted, common. (Name TBD with Calvin; descriptive for now.)
    id: 'melt-long-48',
    name: 'Long Blob',
    rarity: 'common',
    meltPercent: 48,
    textureKey: 'calvin-melt-long-48',
    file: '03_long_blob_48.png',
  },
  'melt-tiny-center': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-tiny-center',
    name: 'Tiny Center Blob',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-tiny-center',
    file: '04_tiny_center_blob.png',
  },
  'melt-small-face': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-small-face',
    name: 'Small Face Blob',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-small-face',
    file: '05_small_face_blob.png',
  },
  'melt-right-legged': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-right-legged',
    name: 'Right-Legged Blob',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-right-legged',
    file: '06_right_legged_blob.png',
  },
  'melt-large-slug': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-large-slug',
    name: 'Large Center Slug',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-large-slug',
    file: '07_large_center_slug.png',
  },
  'melt-left-smiling': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-left-smiling',
    name: 'Left Smiling Blob',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-left-smiling',
    file: '08_left_smiling_blob.png',
  },
  'melt-right-spiky': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-right-spiky',
    name: 'Right Spiky Blob',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-right-spiky',
    file: '09_right_spiky_blob.png',
  },
  'melt-squid': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-squid',
    name: 'Squid Blob',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-squid',
    file: '10_squid_blob.png',
  },
  'melt-hair': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-hair',
    name: 'Hair Blob',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-hair',
    file: '11_hair_blob.png',
  },
  'melt-long-droop': {
    // PLACEHOLDER — confirm % + rarity with Calvin
    id: 'melt-long-droop',
    name: 'Long Droop Blob',
    rarity: 'uncommon',
    meltPercent: null,
    provisional: true,
    textureKey: 'calvin-melt-long-droop',
    file: '12_long_droop_blob.png',
  },
  'melt-king': {
    // CONFIRMED: 'Sucka Free King', 3.8% melted, rare.
    id: 'melt-king',
    name: 'Sucka Free King',
    rarity: 'rare',
    meltPercent: 3.8,
    textureKey: 'calvin-melt-king',
    file: '13_king_blob.png',
  },
  'melt-snail': {
    // CONFIRMED: 'Snail-Sludge', 30% melted, uncommon.
    id: 'melt-snail',
    name: 'Snail-Sludge',
    rarity: 'uncommon',
    meltPercent: 30,
    textureKey: 'calvin-melt-snail',
    file: '14_snail.png',
  },
};

export const CREATURE_ATTRIBUTION = 'From a drawing by Calvin Royce Stay';
