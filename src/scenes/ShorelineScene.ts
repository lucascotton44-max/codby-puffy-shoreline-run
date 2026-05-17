import Phaser from 'phaser';
import { CHARACTERS, CharacterKey } from '../config/characters.js';
import {
  ASSET_PATHS,
  AUDIO_KEYS,
  AUDIO_PATHS,
  COLORS,
  DAMAGE_COOLDOWN_MS,
  GAME_HEIGHT,
  GAME_WIDTH,
  GROUND_Y,
  TEXTURE_KEYS,
} from '../config/constants.js';
import { LEVELS, LevelDefinition } from '../config/levels.js';
import { GAMEPLAY_TUNING } from '../config/tuning.js';
import { StoryFragment } from '../objects/Collectible.js';
import { HazardKind, HazardZone } from '../objects/Hazard.js';
import { LordMalefacto } from '../objects/LordMalefacto.js';
import { PowerUpKind, PowerUpPickup } from '../objects/PowerUp.js';
import { Scuttleclaw } from '../objects/Scuttleclaw.js';

type Controls = {
  cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  wasd: Record<'up' | 'left' | 'right', Phaser.Input.Keyboard.Key>;
  one: Phaser.Input.Keyboard.Key;
  two: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
  restart: Phaser.Input.Keyboard.Key;
  start: Phaser.Input.Keyboard.Key;
  debugHitboxes: Phaser.Input.Keyboard.Key;
  musicToggle: Phaser.Input.Keyboard.Key;
  sfxToggle: Phaser.Input.Keyboard.Key;
};

type AtlasAnimationFrame = {
  atlasX: number;
  atlasY: number;
  w: number;
  h: number;
};

type CharacterAtlasMeta = {
  cellWidth: number;
  cellHeight: number;
  columns: number;
  rows: number;
  animations: Record<string, AtlasAnimationFrame[]>;
};

type VisualMode = 'sprite' | 'placeholder';

type PowerUpStateAtlasFrame = AtlasAnimationFrame & {
  name: string;
};

type PowerUpStateAtlasMeta = {
  cellWidth: number;
  cellHeight: number;
  columns: number;
  rows: number;
  frames: PowerUpStateAtlasFrame[];
};

type WaterShimmer = {
  band: Phaser.GameObjects.Rectangle;
  baseX: number;
  baseAlpha: number;
  speed: number;
  phase: number;
  drift: number;
};

const PRESENTATION_MATTE_Y = 14;
const PRESENTATION_VIEW_HEIGHT = GAME_HEIGHT - PRESENTATION_MATTE_Y * 2;

// Set true to hide control hints and dev labels for clean trailer/screen captures.
const TRAILER_CAPTURE_MODE = false;

const CHARACTER_ANIMATION_KEYS = {
  cod: {
    idle: 'codby-idle',
    move: 'codby-walk',
    jump: 'codby-jump',
    fall: 'codby-fall',
    hurt: 'codby-hurt',
  },
  puffy: {
    idle: 'puffy-idle',
    move: 'puffy-run',
    jump: 'puffy-jump',
    fall: 'puffy-glide',
    hurt: 'puffy-hurt',
  },
} as const;

export class ShorelineScene extends Phaser.Scene {
  private currentLevelIndex = 0;
  private currentLevel: LevelDefinition = LEVELS[0];
  private controls!: Controls;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private hazards!: Phaser.Physics.Arcade.StaticGroup;
  private fragments!: Phaser.Physics.Arcade.Group;
  private powerUps!: Phaser.Physics.Arcade.Group;
  private scuttleclaws!: Phaser.Physics.Arcade.Group;
  private lordMalefacto?: LordMalefacto;
  private ventZones: Phaser.GameObjects.Rectangle[] = [];
  private ventGraphics!: Phaser.GameObjects.Graphics;
  private readonly BUBBLE_VENT_BOOST_COOLDOWN_MS = 700;
  private bubbleVentBoostAt = -10000;
  private eelgrassGraphics!: Phaser.GameObjects.Graphics;
  private currentZoneGraphics!: Phaser.GameObjects.Graphics;
  private chalkTrigger?: Phaser.GameObjects.Rectangle;
  private player!: Phaser.GameObjects.Rectangle;
  private playerVisual!: Phaser.GameObjects.Container | Phaser.GameObjects.Sprite;
  private playerVisualMode: VisualMode = 'placeholder';
  private powerUpStateVisual?: Phaser.GameObjects.Sprite;
  private activePowerUpStateFrame?: string;
  private playerLabel!: Phaser.GameObjects.Text;
  private endMarkerVisual!: Phaser.GameObjects.Container | Phaser.GameObjects.Image;
  private activeCharacter: CharacterKey = 'cod';
  private health = CHARACTERS.cod.maxHealth;
  private collectedFragments = 0;
  private score = 0;
  private lastDamageAt = -DAMAGE_COOLDOWN_MS;
  private hurtUntil = 0;
  private isRunStarted = false;
  private levelStartedAt = 0;
  private levelEndedAt = 0;
  private isEnded = false;
  private didWinLevel = false;
  private hudPanel!: Phaser.GameObjects.Rectangle;
  private hudTitleText!: Phaser.GameObjects.Text;
  private hudStatsText!: Phaser.GameObjects.Text;
  private hudHintText!: Phaser.GameObjects.Text;
  private isMobileLayout = false;
  private suppressNextTouchAction = false;
  private isDirectTestLevel = false;
  private titleOverlay!: Phaser.GameObjects.Container;
  private messagePanel!: Phaser.GameObjects.Rectangle;
  private messageText!: Phaser.GameObjects.Text;
  private endMarker!: Phaser.GameObjects.Rectangle;
  private endMarkerText!: Phaser.GameObjects.Text;
  private waterShimmers: WaterShimmer[] = [];
  private tideLiftGraphics!: Phaser.GameObjects.Graphics;
  private sparkIndicator!: Phaser.GameObjects.Arc;
  private debugGraphics!: Phaser.GameObjects.Graphics;
  private areDebugHitboxesVisible = false;
  private music?: Phaser.Sound.BaseSound;
  private hasPlayerInteractedWithAudio = false;
  private isMusicEnabled: boolean = GAMEPLAY_TUNING.audio.musicEnabled;
  private isSfxEnabled: boolean = GAMEPLAY_TUNING.audio.sfxEnabled;
  private wasGliding = false;
  private kelpShieldCharges = 0;
  private kelpShieldExpiresAt = 0;
  private tideLiftExpiresAt = 0;
  private hasTideLiftCharge = false;
  private tideGlideBoostUntil = 0;
  private storySparkExpiresAt = 0;
  private tideRunExpiresAt = 0;
  private isTransitioningToBoss = false;
  private touchInput = { left: false, right: false, jumpJustDown: false, jumpHeld: false, switchJustDown: false };
  private touchPointers = { left: new Set<number>(), right: new Set<number>(), jump: new Set<number>(), switch: new Set<number>() };
  private jumpQueuedUntil = 0;
  private switchQueuedUntil = 0;
  private lastTouchSwitchAt = -1000;
  private readonly TOUCH_JUMP_BUFFER_MS = 170;
  private readonly TOUCH_SWITCH_BUFFER_MS = 170;
  private readonly TOUCH_SWITCH_COOLDOWN_MS = 240;

  public constructor() {
    super('ShorelineScene');
  }

  public preload(): void {
    LEVELS.forEach((level) => {
      this.load.image(level.backdropTextureKey, level.backdropPath);
    });
    this.load.spritesheet(TEXTURE_KEYS.codbyAtlas, ASSET_PATHS.codbyAtlasImage, {
      frameWidth: 256,
      frameHeight: 320,
    });
    this.load.json(TEXTURE_KEYS.codbyAtlasMeta, ASSET_PATHS.codbyAtlasJson);
    this.load.spritesheet(TEXTURE_KEYS.puffyAtlas, ASSET_PATHS.puffyAtlasImage, {
      frameWidth: 288,
      frameHeight: 240,
    });
    this.load.json(TEXTURE_KEYS.puffyAtlasMeta, ASSET_PATHS.puffyAtlasJson);
    this.load.spritesheet(TEXTURE_KEYS.scuttleclawAtlas, ASSET_PATHS.scuttleclawAtlasImage, {
      frameWidth: 256,
      frameHeight: 160,
    });
    this.load.json(TEXTURE_KEYS.scuttleclawAtlasMeta, ASSET_PATHS.scuttleclawAtlasJson);
    this.load.spritesheet(TEXTURE_KEYS.tiderunnerAtlas, ASSET_PATHS.tiderunnerAtlasImage, {
      frameWidth: 128,
      frameHeight: 128,
    });
    this.load.json(TEXTURE_KEYS.tiderunnerAtlasMeta, ASSET_PATHS.tiderunnerAtlasJson);
    this.load.spritesheet(TEXTURE_KEYS.lordMalefactoAtlas, ASSET_PATHS.lordMalefactoAtlasImage, {
      frameWidth: 320,
      frameHeight: 320,
    });
    this.load.json(TEXTURE_KEYS.lordMalefactoAtlasMeta, ASSET_PATHS.lordMalefactoAtlasJson);
    this.load.spritesheet(TEXTURE_KEYS.powerUpStatesAtlas, ASSET_PATHS.powerUpStatesAtlasImage, {
      frameWidth: 256,
      frameHeight: 256,
    });
    this.load.json(TEXTURE_KEYS.powerUpStatesAtlasMeta, ASSET_PATHS.powerUpStatesAtlasJson);
    this.load.image(TEXTURE_KEYS.dockPlankPlatformProp, ASSET_PATHS.dockPlankPlatformProp);
    this.load.image(TEXTURE_KEYS.brokenWharfHazardProp, ASSET_PATHS.brokenWharfHazardProp);
    this.load.image(TEXTURE_KEYS.rockHazardProp, ASSET_PATHS.rockHazardProp);
    this.load.image(TEXTURE_KEYS.ropeDebrisHazardProp, ASSET_PATHS.ropeDebrisHazardProp);
    this.load.image(TEXTURE_KEYS.storyFragmentProp, ASSET_PATHS.storyFragmentProp);
    this.load.image(TEXTURE_KEYS.ch8BeaconMarkerProp, ASSET_PATHS.ch8BeaconMarkerProp);
    this.load.image(TEXTURE_KEYS.kelpShieldIcon, ASSET_PATHS.kelpShieldIcon);
    this.load.image(TEXTURE_KEYS.tideLiftIcon, ASSET_PATHS.tideLiftIcon);
    this.load.image(TEXTURE_KEYS.storySparkIcon, ASSET_PATHS.storySparkIcon);
    this.load.image(TEXTURE_KEYS.level04LockTransition, ASSET_PATHS.level04LockTransition);
    this.load.image(TEXTURE_KEYS.lordMalefactoFlareZoneFx, ASSET_PATHS.lordMalefactoFlareZoneFx);
    this.load.image(TEXTURE_KEYS.calvinEarthEyesBartPlaceholder, ASSET_PATHS.calvinEarthEyesBartPlaceholder);
    this.load.image(TEXTURE_KEYS.calvinRedBartPlaceholder, ASSET_PATHS.calvinRedBartPlaceholder);
    this.load.image(TEXTURE_KEYS.calvinMeltPatrolSprite, ASSET_PATHS.calvinMeltPatrolSprite);
    this.load.audio(AUDIO_KEYS.shorelineThemeLoop, AUDIO_PATHS.shorelineThemeLoop);
    this.load.audio(AUDIO_KEYS.level02Theme, AUDIO_PATHS.level02Theme);
    this.load.audio(AUDIO_KEYS.level03CanalTheme, AUDIO_PATHS.level03CanalTheme);
    this.load.audio(AUDIO_KEYS.calvinsCreatureRoomThemeLoop, AUDIO_PATHS.calvinsCreatureRoomThemeLoop);
    this.load.audio(AUDIO_KEYS.jump, AUDIO_PATHS.jump);
    this.load.audio(AUDIO_KEYS.glide, AUDIO_PATHS.glide);
    this.load.audio(AUDIO_KEYS.collectFragment, AUDIO_PATHS.collectFragment);
    this.load.audio(AUDIO_KEYS.hazardHit, AUDIO_PATHS.hazardHit);
    this.load.audio(AUDIO_KEYS.characterSwitch, AUDIO_PATHS.characterSwitch);
    this.load.audio(AUDIO_KEYS.levelComplete, AUDIO_PATHS.levelComplete);
    this.load.audio(AUDIO_KEYS.gameOver, AUDIO_PATHS.gameOver);
    this.load.audio(AUDIO_KEYS.scuttleclawStomp, AUDIO_PATHS.scuttleclawStomp);
    this.load.audio(AUDIO_KEYS.powerupPickup, AUDIO_PATHS.powerupPickup);
    this.load.audio(AUDIO_KEYS.kelpShield, AUDIO_PATHS.kelpShield);
    this.load.audio(AUDIO_KEYS.tideLift, AUDIO_PATHS.tideLift);
    this.load.audio(AUDIO_KEYS.canalBoatTransition, AUDIO_PATHS.canalBoatTransition);
    this.load.audio(AUDIO_KEYS.malefactoStompHit, AUDIO_PATHS.malefactoStompHit);
  }

  public create(): void {
    this.selectCurrentLevel();
    this.resetRunState();
    this.resetCameraState();
    this.physics.world.setBounds(0, 0, this.currentLevel.worldWidth, GAME_HEIGHT);

    this.createControls();
    this.createAudio();
    this.createBackdrop();
    this.createLevel();
    this.createCharacterAnimations();
    this.createPlayer();
    this.createPlayerPowerIndicators();
    this.createHud();
    this.createTitleOverlay();
    this.createOverlaps();
    this.createDebugOverlay();
    this.createTouchControls();

    this.cameras.main.startFollow(this.player, true, 0.12, 0.1, -120, 30);

    if (this.registry.get('shorelineStartLevelImmediately') === true) {
      this.registry.set('shorelineStartLevelImmediately', false);
      this.startRun();
    }

    if (this.registry.get('shorelineRestartCurrentLevel') === true) {
      this.registry.set('shorelineRestartCurrentLevel', false);
    }
  }

  public update(time: number): void {
    this.handleAudioInput();

    if (Phaser.Input.Keyboard.JustDown(this.controls.restart)) {
      if (this.isEnded && this.didWinLevel && !this.hasNextLevel() && !this.isDirectTestLevel) {
        this.restartFromLevelOne();
      } else {
        this.restartCurrentLevelOrReturnFromSecretRoute();
      }
      return;
    }

    if (this.isEnded && this.touchInput.jumpJustDown) {
      this.touchInput.jumpJustDown = false;
      if (this.didWinLevel && this.hasNextLevel()) {
        this.advanceToNextLevel();
      } else if (this.didWinLevel && !this.hasNextLevel() && !this.isDirectTestLevel) {
        this.restartFromLevelOne();
      } else {
        this.restartCurrentLevelOrReturnFromSecretRoute();
      }
      return;
    }

    if (
      this.isEnded &&
      this.didWinLevel &&
      this.hasNextLevel() &&
      Phaser.Input.Keyboard.JustDown(this.controls.start)
    ) {
      this.advanceToNextLevel();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.debugHitboxes)) {
      this.toggleDebugHitboxes();
    }

    if (!this.isRunStarted) {
      this.handleTitleInput();
      this.getPlayerBody().setVelocityX(0);
      this.fragments.children.each((child) => {
        const fragment = child as StoryFragment;
        if (fragment.active) {
          fragment.pulse(time);
        }
        return true;
      });
      this.powerUps.children.each((child) => {
        const powerUp = child as PowerUpPickup;
        if (powerUp.active && powerUp.body.enable) {
          powerUp.pulse(time);
        }
        return true;
      });
      this.updateWaterShimmers(time);
      this.updateBubbleVentVisual(time);
      this.updateScuttleclaws();
      this.syncPlayerDecorations();
      this.updateHud();
      this.drawDebugHitboxes();
      return;
    }

    this.fragments.children.each((child) => {
      const fragment = child as StoryFragment;
      if (fragment.active) {
        fragment.pulse(time);
      }
      return true;
    });

    this.powerUps.children.each((child) => {
      const powerUp = child as PowerUpPickup;
      if (powerUp.active && powerUp.body.enable) {
        powerUp.pulse(time);
      }
      return true;
    });

    this.updatePowerUpTimers(time);
    this.applyStorySparkAttraction();
    this.updateWaterShimmers(time);
    this.updateBubbleVentVisual(time);
    this.updateScuttleclaws();
    this.lordMalefacto?.update(time);
    this.syncPlayerDecorations();

    if (this.isEnded) {
      this.getPlayerBody().velocity.x *= 0.86;
      this.drawDebugHitboxes();
      return;
    }

    this.handleCharacterSwitch();
    this.handleMovement();
    this.checkFallOut();
    this.updateHud();
    this.drawDebugHitboxes();
  }

  private createControls(): void {
    const keyboard = this.input.keyboard;

    if (!keyboard) {
      throw new Error('Keyboard input is required for this prototype.');
    }

    keyboard.removeAllKeys(true, false);
    keyboard.resetKeys();

    this.controls = {
      cursors: keyboard.createCursorKeys(),
      wasd: {
        up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
        right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      },
      one: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ONE),
      two: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.TWO),
      space: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
      restart: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R),
      start: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER),
      debugHitboxes: keyboard.addKey(GAMEPLAY_TUNING.debug.hitboxToggleKey),
      musicToggle: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M),
      sfxToggle: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.N),
    };
  }

  private selectCurrentLevel(): void {
    const storedLevelIndex = this.registry.get('shorelineCurrentLevelIndex');
    const isSecretRoute = this.registry.get('shorelineSecretRoute') === true;
    const shouldKeepStoredLevel =
      this.registry.get('shorelineStartLevelImmediately') === true ||
      this.registry.get('shorelineRestartCurrentLevel') === true ||
      isSecretRoute;

    let levelIndex: number;
    if (shouldKeepStoredLevel && typeof storedLevelIndex === 'number') {
      levelIndex = storedLevelIndex;
    } else {
      // Allow ?level=<id> in the URL to jump directly to a level for dev/test.
      const urlLevelId = new URLSearchParams(window.location.search).get('level');
      const urlLevelIndex = urlLevelId ? LEVELS.findIndex((l) => l.id === urlLevelId) : -1;
      this.isDirectTestLevel = urlLevelIndex >= 0;
      levelIndex = urlLevelIndex >= 0 ? urlLevelIndex : 0;
    }

    this.currentLevelIndex = Phaser.Math.Clamp(Math.floor(levelIndex), 0, LEVELS.length - 1);
    this.currentLevel = LEVELS[this.currentLevelIndex];
    this.isDirectTestLevel = this.isDirectTestLevel || isSecretRoute || this.currentLevel.testOnly === true;
    this.registry.set('shorelineSecretReturnToMain', isSecretRoute);
    this.registry.set('shorelineSecretRoute', false);
    this.registry.set('shorelineCurrentLevelIndex', this.currentLevelIndex);
  }

  private hasNextLevel(): boolean {
    const nextIndex = this.currentLevelIndex + 1;
    if (nextIndex >= LEVELS.length) return false;
    // testOnly levels are not part of normal campaign progression.
    if (LEVELS[nextIndex].testOnly) return false;
    return true;
  }

  private getCompletionLevelLabel(): string {
    const name = this.currentLevel.name;
    const dashIdx = name.lastIndexOf('—');
    return dashIdx >= 0 ? name.slice(dashIdx + 1).trim() : name;
  }

  private restartFromLevelOne(): void {
    this.stopCurrentMusic();
    this.scene.restart();
  }

  private restartCurrentLevelOrReturnFromSecretRoute(): void {
    const shouldReturnToMain =
      this.currentLevel.secretLevel === true && this.registry.get('shorelineSecretReturnToMain') === true;

    if (shouldReturnToMain) {
      this.registry.set('shorelineSecretReturnToMain', false);
      this.registry.set('shorelineSecretRoute', false);
      this.registry.set('shorelineCurrentLevelIndex', 0);
      this.stopCurrentMusic();
      this.scene.restart();
      return;
    }

    this.registry.set('shorelineRestartCurrentLevel', true);
    this.stopCurrentMusic();
    this.scene.restart();
  }

  private advanceToNextLevel(): void {
    if (!this.hasNextLevel()) {
      return;
    }

    this.registry.set('shorelineCurrentLevelIndex', this.currentLevelIndex + 1);
    this.registry.set('shorelineStartLevelImmediately', true);
    this.stopCurrentMusic();
    this.scene.restart();
  }

  private createAudio(): void {
    this.isMusicEnabled = this.getStoredAudioToggle('shorelineMusicEnabled', GAMEPLAY_TUNING.audio.musicEnabled);
    this.isSfxEnabled = this.getStoredAudioToggle('shorelineSfxEnabled', GAMEPLAY_TUNING.audio.sfxEnabled);
    this.hasPlayerInteractedWithAudio = this.registry.get('shorelineAudioUnlocked') === true;

    const musicKey = this.currentLevel.musicAudioKey;
    this.stopOtherLevelMusic(musicKey);

    if (this.hasAudio(musicKey)) {
      this.music = this.sound.get(musicKey) ?? this.sound.add(musicKey, {
        loop: true,
        volume: GAMEPLAY_TUNING.audio.musicVolume,
      });
      this.setSoundVolume(this.music, GAMEPLAY_TUNING.audio.musicVolume);
    }

    if (this.hasPlayerInteractedWithAudio) {
      this.startOrResumeMusic();
    }
  }

  private getStoredAudioToggle(key: string, fallback: boolean): boolean {
    const stored = this.registry.get(key);
    return typeof stored === 'boolean' ? stored : fallback;
  }

  private handleAudioInput(): void {
    const toggledMusic = Phaser.Input.Keyboard.JustDown(this.controls.musicToggle);
    const toggledSfx = Phaser.Input.Keyboard.JustDown(this.controls.sfxToggle);

    if (toggledMusic) {
      this.toggleMusic();
    }

    if (toggledSfx) {
      this.toggleSfx();
    }

    if (toggledMusic || toggledSfx || this.hasAnyPlayerInput()) {
      this.markAudioInteraction();
    }
  }

  private hasAnyPlayerInput(): boolean {
    return (
      this.controls.cursors.left.isDown ||
      this.controls.cursors.right.isDown ||
      this.controls.cursors.up.isDown ||
      this.controls.cursors.down.isDown ||
      this.controls.wasd.left.isDown ||
      this.controls.wasd.right.isDown ||
      this.controls.wasd.up.isDown ||
      this.controls.space.isDown ||
      this.controls.one.isDown ||
      this.controls.two.isDown ||
      this.controls.restart.isDown ||
      this.controls.start.isDown ||
      this.controls.debugHitboxes.isDown ||
      this.touchInput.left ||
      this.touchInput.right ||
      this.touchInput.jumpHeld ||
      this.touchInput.jumpJustDown
    );
  }

  private markAudioInteraction(): void {
    if (!this.hasPlayerInteractedWithAudio) {
      this.hasPlayerInteractedWithAudio = true;
      this.registry.set('shorelineAudioUnlocked', true);
    }

    this.resumeAudioContext();
    this.startOrResumeMusic();
  }

  private toggleMusic(): void {
    this.isMusicEnabled = !this.isMusicEnabled;
    this.registry.set('shorelineMusicEnabled', this.isMusicEnabled);

    if (this.isMusicEnabled) {
      this.startOrResumeMusic();
      return;
    }

    if (this.music?.isPlaying) {
      this.music.pause();
    }
  }

  private toggleSfx(): void {
    this.isSfxEnabled = !this.isSfxEnabled;
    this.registry.set('shorelineSfxEnabled', this.isSfxEnabled);
  }

  private startOrResumeMusic(): void {
    if (!this.isMusicEnabled || !this.music || !this.hasAudio(this.currentLevel.musicAudioKey)) {
      return;
    }

    this.setSoundVolume(this.music, GAMEPLAY_TUNING.audio.musicVolume);

    if (this.music.isPaused) {
      this.music.resume();
      return;
    }

    if (!this.music.isPlaying) {
      this.music.play({ loop: true, volume: GAMEPLAY_TUNING.audio.musicVolume });
    }
  }

  private stopCurrentMusic(): void {
    if (this.music) {
      this.music.stop();
    }
  }

  private stopOtherLevelMusic(currentMusicKey: string): void {
    LEVELS.forEach((level) => {
      if (level.musicAudioKey === currentMusicKey) {
        return;
      }

      this.sound.get(level.musicAudioKey)?.stop();
    });
  }

  private playSfx(audioKey: string): void {
    if (!this.isSfxEnabled || !this.hasAudio(audioKey)) {
      return;
    }

    this.sound.play(audioKey, { volume: GAMEPLAY_TUNING.audio.sfxVolume });
  }

  private hasAudio(audioKey: string): boolean {
    return this.cache.audio.exists(audioKey);
  }

  private setSoundVolume(sound: Phaser.Sound.BaseSound, volume: number): void {
    const soundWithVolume = sound as Phaser.Sound.BaseSound & { setVolume?: (value: number) => void };
    soundWithVolume.setVolume?.(volume);
  }

  private resumeAudioContext(): void {
    const soundWithContext = this.sound as Phaser.Sound.BaseSoundManager & { context?: AudioContext };

    if (soundWithContext.context?.state === 'suspended') {
      void soundWithContext.context.resume();
    }
  }

  private createBackdrop(): void {
    this.waterShimmers = [];
    const hasRealBackdrop = this.createRealBackdrop();

    if (!hasRealBackdrop) {
      this.createSkyGradient();
      this.createDistantShoreline();
      this.createMidgroundWater();
    } else {
      this.createDistantParallaxSilhouette();
    }

    this.createAnimatedWaterLayer();
    this.createForegroundShoreDetail();
  }

  private createRealBackdrop(): boolean {
    if (!this.textures.exists(this.currentLevel.backdropTextureKey)) {
      return false;
    }

    const source = this.textures.get(this.currentLevel.backdropTextureKey).getSourceImage() as HTMLImageElement;
    const coverScale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    const image = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, this.currentLevel.backdropTextureKey);
    image.setDisplaySize(source.width * coverScale, source.height * coverScale);
    image.setScrollFactor(0);
    image.setDepth(-100);

    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x1a2a2b, 0.22).setScrollFactor(0).setDepth(-99);
    this.add.rectangle(GAME_WIDTH / 2, 420, GAME_WIDTH, 150, 0x172426, 0.18).setScrollFactor(0).setDepth(-98);

    return true;
  }

  private createDistantParallaxSilhouette(): void {
    this.add
      .rectangle(this.currentLevel.worldWidth / 2, 286, this.currentLevel.worldWidth, 54, 0x203a34, 0.08)
      .setScrollFactor(0.16, 0)
      .setDepth(-97);
    this.add
      .rectangle(this.currentLevel.worldWidth / 2, 326, this.currentLevel.worldWidth, 28, 0xd8ddd2, 0.05)
      .setScrollFactor(0.2, 0)
      .setDepth(-96);

    for (let x = -140; x < this.currentLevel.worldWidth + 240; x += 150) {
      const treeLine = this.add.ellipse(x, 292 + Math.sin(x * 0.03) * 7, 118, 44, 0x172b26, 0.11);
      const lowScrub = this.add.ellipse(x + 58, 312 + Math.cos(x * 0.021) * 5, 160, 26, 0x203a34, 0.08);
      treeLine.setScrollFactor(0.2, 0).setDepth(-96);
      lowScrub.setScrollFactor(0.24, 0).setDepth(-95);
    }
  }

  private createSkyGradient(): void {
    const top = Phaser.Display.Color.ValueToColor(0xa7b8b4);
    const bottom = Phaser.Display.Color.ValueToColor(0x607d80);
    const bands = 12;
    const bandHeight = Math.ceil(GAME_HEIGHT / bands);

    for (let i = 0; i < bands; i += 1) {
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(top, bottom, bands - 1, i);
      this.add
        .rectangle(
          this.currentLevel.worldWidth / 2,
          i * bandHeight + bandHeight / 2,
          this.currentLevel.worldWidth,
          bandHeight + 1,
          Phaser.Display.Color.GetColor(color.r, color.g, color.b),
        )
        .setScrollFactor(0.08, 0);
    }

    this.add
      .rectangle(this.currentLevel.worldWidth / 2, 178, this.currentLevel.worldWidth, 3, 0xd8ddd2, 0.18)
      .setScrollFactor(0.1, 0);
  }

  private createDistantShoreline(): void {
    this.add
      .rectangle(this.currentLevel.worldWidth / 2, 314, this.currentLevel.worldWidth, 88, 0x35534a, 0.52)
      .setScrollFactor(0.28, 0);

    for (let x = -80; x < this.currentLevel.worldWidth + 180; x += 118) {
      const trunk = this.add.rectangle(x + 28, 286, 10, 56, 0x3d3329, 0.55).setScrollFactor(0.32, 0);
      const lower = this.add.triangle(x, 286, 0, 76, 48, 0, 96, 76, 0x29443a, 0.86).setScrollFactor(0.32, 0);
      const upper = this.add.triangle(x + 10, 242, 0, 62, 38, 0, 76, 62, 0x21382f, 0.9).setScrollFactor(0.32, 0);
      trunk.setDepth(-20);
      lower.setDepth(-19);
      upper.setDepth(-18);
    }
  }

  private createMidgroundWater(): void {
    this.add
      .rectangle(this.currentLevel.worldWidth / 2, 390, this.currentLevel.worldWidth, 166, 0x315b64, 0.88)
      .setScrollFactor(0.45, 0);

    for (let x = -40; x < this.currentLevel.worldWidth + 240; x += 210) {
      this.add.rectangle(x, 356, 132, 3, 0xb7c7c2, 0.24).setScrollFactor(0.48, 0);
      this.add.rectangle(x + 90, 418, 86, 2, 0xd8ddd2, 0.16).setScrollFactor(0.5, 0);
    }

    for (let x = 90; x < this.currentLevel.worldWidth; x += 185) {
      this.add.ellipse(x, 455, 86, 25, 0x49514d, 0.58).setScrollFactor(0.62, 0);
      this.add.ellipse(x + 34, 449, 48, 16, 0x636961, 0.52).setScrollFactor(0.62, 0);
    }
  }

  private createAnimatedWaterLayer(): void {
    const rows = [
      { y: 364, alpha: 0.075, scroll: 0.34, step: 260, width: 132, drift: 11, speed: 0.00075 },
      { y: 402, alpha: 0.068, scroll: 0.42, step: 285, width: 108, drift: 13, speed: 0.0009 },
      { y: 438, alpha: 0.052, scroll: 0.5, step: 245, width: 84, drift: 9, speed: 0.001 },
    ];

    rows.forEach((row, rowIndex) => {
      for (let x = -160; x < this.currentLevel.worldWidth + 220; x += row.step) {
        const band = this.add.rectangle(x, row.y + (rowIndex % 2) * 7, row.width, 2, 0xd8e0db, row.alpha);
        band.setScrollFactor(row.scroll, 0);
        band.setDepth(-94 + rowIndex);
        this.waterShimmers.push({
          band,
          baseX: x,
          baseAlpha: row.alpha,
          speed: row.speed,
          phase: x * 0.013 + rowIndex * 1.7,
          drift: row.drift,
        });
      }
    });
  }

  private createForegroundShoreDetail(): void {
    this.add
      .rectangle(this.currentLevel.worldWidth / 2, GROUND_Y + 56, this.currentLevel.worldWidth, 86, 0x514c43, 0.34)
      .setScrollFactor(0.82, 0)
      .setDepth(-3);

    for (let x = 48; x < this.currentLevel.worldWidth; x += 130) {
      this.add.ellipse(x, GROUND_Y + 12, 58, 16, 0x434944, 0.34).setScrollFactor(0.9, 0).setDepth(-2);
      this.add.rectangle(x + 46, GROUND_Y - 3, 54, 5, 0x6f6352, 0.28).setScrollFactor(0.94, 0).setDepth(-2);
    }
  }

  private createLevel(): void {
    this.platforms = this.physics.add.staticGroup();
    this.hazards = this.physics.add.staticGroup();
    this.fragments = this.physics.add.group({ allowGravity: false, immovable: true });
    this.powerUps = this.physics.add.group({ allowGravity: false, immovable: true });
    this.scuttleclaws = this.physics.add.group();

    this.currentLevel.platforms.forEach(({ x, y, width, height, color }) => {
      this.addPlatform(x, y, width, height, color);
    });

    this.currentLevel.hazards.forEach(({ x, y, width, height, kind }) => {
      this.addHazard(x, y, width, height, kind);
    });

    this.createFragments();
    this.createPowerUps();
    this.createScuttleclaws();
    this.createBoss();
    this.createEndMarker();
    this.createStartZone();
    this.createChalkTrigger();
    this.createBubbleVents();
    this.createEelgrassVisuals();
    this.createCurrentZoneVisuals();
  }

  private addPlatform(x: number, y: number, width: number, height: number, color: number): void {
    const platform = this.add.rectangle(x, y, width, height, color);
    const isBrasDor = this.currentLevel.id === 'bras-dor-below-level-05';
    const hasDockProp = color === COLORS.dock && this.hasTexture(TEXTURE_KEYS.dockPlankPlatformProp);

    if (isBrasDor) {
      platform.setAlpha(0);
    } else {
      platform.setAlpha(hasDockProp ? 0 : color === COLORS.dock ? 0.94 : 0.82);
      platform.setStrokeStyle(2, color === COLORS.dock ? 0x33291f : 0x3d4039, 0.78);
    }

    this.platforms.add(platform);
    (platform.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();

    if (isBrasDor) {
      this.addBrasDorPlatformDressing(x, y, width, height, color);
    } else if (color === COLORS.dock) {
      if (hasDockProp) {
        this.addPlatformProp(x, y, width, height);
      } else {
        this.addDockDetail(x, y, width);
      }
      if (this.currentLevel.id === 'calvins-creature-room') {
        this.addCalvinSketchDockDressing(x, y, width, height);
      }
    } else {
      this.addShoreSurfaceDetail(x, y, width);
    }
  }

  private addPlatformProp(x: number, y: number, width: number, height: number): void {
    const image = this.add.image(x, y - 7, TEXTURE_KEYS.dockPlankPlatformProp);
    image.setDisplaySize(width + 18, Math.max(42, height + 18));
    image.setDepth(1);
  }

  private addDockDetail(x: number, y: number, width: number): void {
    const plankCount = Math.max(3, Math.floor(width / 42));
    const plankSpacing = width / plankCount;

    for (let i = 0; i <= plankCount; i += 1) {
      this.add.rectangle(x - width / 2 + i * plankSpacing, y, 4, 24, 0x3e3328, 0.38);
    }

    this.add.rectangle(x, y - 8, width - 12, 3, 0x8a765d, 0.42);
    this.add.rectangle(x, y - 14, width - 18, 4, 0xa08b6d, 0.55);
    this.add.rectangle(x - width / 2 + 22, y + 27, 11, 54, 0x4b3b2d, 0.92);
    this.add.rectangle(x + width / 2 - 22, y + 27, 11, 54, 0x4b3b2d, 0.92);
  }

  private addCalvinSketchDockDressing(x: number, y: number, width: number, height: number): void {
    const top = y - height / 2;
    const undersideY = y + height / 2 + 4;
    const supportBaseY = Math.min(GROUND_Y + 8, undersideY + Phaser.Math.Clamp(GROUND_Y - undersideY, 46, 148));
    const supportXs = [x - width * 0.36, x, x + width * 0.36];

    const supports = this.add.graphics();
    supports.setDepth(0.5);
    supports.fillStyle(0x0f1516, 0.34);
    supports.fillRoundedRect(x - width / 2 + 8, undersideY - 2, width - 16, 10, 3);
    supports.lineStyle(5, 0x101718, 0.42);
    supportXs.forEach((supportX, index) => {
      const lean = index === 1 ? 0 : (index === 0 ? -4 : 4);
      supports.lineBetween(supportX, undersideY, supportX + lean, supportBaseY);
    });
    supports.lineStyle(2, 0x273131, 0.36);
    supports.lineBetween(x - width / 2 + 22, supportBaseY - 18, x + width / 2 - 22, supportBaseY - 34);

    const chalk = this.add.graphics();
    chalk.setDepth(1.05);
    chalk.lineStyle(2, 0xd8ddd2, 0.32);
    chalk.lineBetween(x - width / 2 + 10, top + 4, x + width / 2 - 12, top + 1);
    chalk.lineStyle(1, 0xd8ddd2, 0.22);
    chalk.lineBetween(x - width / 2 + 8, undersideY + 4, x + width / 2 - 10, undersideY + 2);

    const markCount = Phaser.Math.Clamp(Math.floor(width / 58), 2, 4);
    for (let i = 0; i < markCount; i += 1) {
      const t = (i + 1) / (markCount + 1);
      const markX = x - width / 2 + width * t;
      const slant = ((Math.floor(x + width + i * 17) % 2) * 2 - 1) * 4;
      chalk.lineBetween(markX - 5, top + 10, markX + slant, top + 16);
      if ((Math.floor(x + i * 31) % 3) === 0) {
        chalk.lineBetween(markX + 3, top + 9, markX - slant, top + 14);
      }
    }
  }

  private addShoreSurfaceDetail(x: number, y: number, width: number): void {
    this.add.rectangle(x, y - 31, width - 18, 7, 0x8a8270, 0.36);

    for (let pebbleX = x - width / 2 + 44; pebbleX < x + width / 2 - 32; pebbleX += 74) {
      this.add.ellipse(pebbleX, y - 27, 22, 7, 0x4e544f, 0.44);
      this.add.ellipse(pebbleX + 28, y - 25, 14, 5, 0x767366, 0.36);
    }
  }

  private addBrasDorPlatformDressing(x: number, y: number, width: number, height: number, color: number): void {
    const g = this.add.graphics();
    const top = y - height / 2;
    const left = x - width / 2;

    if (color === COLORS.shore) {
      // Large underwater stone shelf

      // Main stone body — muted blue-grey slate
      g.fillStyle(0x475d68, 0.90);
      g.fillRect(left, top, width, height);

      // Top surface — lighter walkable face
      g.fillStyle(0x5e7a86, 0.54);
      g.fillRect(left, top, width, 8);

      // Thin highlight lip at crown
      g.fillStyle(0x7898a4, 0.28);
      g.fillRect(left, top, width, 2);

      // Dark silt/shadow underside
      g.fillStyle(0x222e36, 0.60);
      g.fillRect(left, top + height - 20, width, 20);

      // Side edge shading
      g.fillStyle(0x263540, 0.40);
      g.fillRect(left, top, 5, height);
      g.fillRect(left + width - 5, top, 5, height);

      // Stone grain seams
      g.lineStyle(1, 0x2e3d48, 0.28);
      g.lineBetween(left + 12, top + 26, left + width - 12, top + 26);
      g.lineStyle(1, 0x2e3d48, 0.18);
      g.lineBetween(left + 12, top + 48, left + width - 12, top + 48);

      // Shell and pebble flecks along top
      let si = 0;
      for (let sx = left + 32; sx < left + width - 22; sx += 50 + (si % 3) * 18, si++) {
        g.fillStyle(0xd2c8b0, 0.38);
        g.fillEllipse(sx, top + 4, 14, 5);
        g.fillStyle(0xbcb29a, 0.26);
        g.fillEllipse(sx + 20, top + 5, 8, 3);
      }

    } else {
      // COLORS.dock — submerged stone slab / ledge

      // Main stone body — dark blue-grey
      g.fillStyle(0x3c4f5c, 0.92);
      g.fillRect(left, top, width, height);

      // Top surface highlight
      g.fillStyle(0x587888, 0.58);
      g.fillRect(left, top, width, 5);

      // Thin highlight lip
      g.fillStyle(0x6e9098, 0.26);
      g.fillRect(left, top, width, 2);

      // Dark underside shadow
      g.fillStyle(0x1e2c36, 0.55);
      g.fillRect(left, top + height - 5, width, 5);

      // Stone edge lines
      g.lineStyle(1, 0x2a3a46, 0.55);
      g.lineBetween(left, top, left + width, top);
      g.lineStyle(1, 0x131e28, 0.42);
      g.lineBetween(left, top + height, left + width, top + height);

      // Vertical crack seam — suggests stone block joinery
      if (width >= 140) {
        const crackX = left + Math.floor(width * 0.42);
        g.lineStyle(1, 0x182430, 0.32);
        g.lineBetween(crackX, top + 2, crackX, top + height - 2);
      }

      // Shell and barnacle flecks
      const fleckStep = Math.max(26, Math.floor(width / 5));
      let fi = 0;
      for (let fx = left + 14; fx < left + width - 10; fx += fleckStep, fi++) {
        g.fillStyle(0xc2b99c, 0.28 + (fi % 2) * 0.10);
        g.fillEllipse(fx, top + 3, 7 + (fi % 2) * 3, 3);
      }
    }
  }

  private addHazard(
    x: number,
    y: number,
    width: number,
    height: number,
    kind: HazardKind,
  ): void {
    const hazard = new HazardZone(this, x, y, width, height, kind);
    this.hazards.add(hazard);
    hazard.body.updateFromGameObject();
    this.addHazardDetail(x, y, width, height, kind);
  }

  private addHazardDetail(
    x: number,
    y: number,
    width: number,
    height: number,
    kind: HazardKind,
  ): void {
    if (kind === 'blackSketchPuddle') {
      this.addBlackSketchPuddleHazardDetail(x, y, width, height);
      return;
    }

    if (this.addHazardProp(x, y, width, height, kind)) {
      return;
    }

    if (kind === 'water') {
      this.add.rectangle(x, y - height / 2 + 2, width + 8, 5, 0x4d3624, 0.9);
      this.add.rectangle(x, y - height / 2 + 7, width - 18, 6, 0xc8d5cf, 0.34);
      this.add.rectangle(x, y + height / 2 - 10, width, 18, 0x1d3f48, 0.62);

      for (let waveX = x - width / 2 + 24; waveX < x + width / 2 - 16; waveX += 42) {
        this.add.arc(waveX, y - 8, 14, 200, 340, false, 0xd8e0db, 0.42).setStrokeStyle(2, 0xd8e0db, 0.42);
      }

      this.add.rectangle(x - width / 2 + 10, y - 8, 8, height - 12, 0xc9b36a, 0.72);
      this.add.rectangle(x + width / 2 - 10, y - 8, 8, height - 12, 0xc9b36a, 0.72);
      return;
    }

    if (kind === 'rock') {
      this.add.ellipse(x - 6, y + 6, width * 0.72, height * 0.72, 0x4d534e, 0.96).setStrokeStyle(2, 0x2e332f, 0.8);
      this.add.ellipse(x + 12, y + 1, width * 0.5, height * 0.52, 0x6a6d64, 0.9);
      this.add.rectangle(x + 4, y - 10, width * 0.36, 4, 0xb5b2a2, 0.3);
      this.add.rectangle(x - 3, y - 16, width * 0.52, 3, 0xe2d5a4, 0.42);
      return;
    }

    this.add.rectangle(x, y - height / 2 - 3, width + 14, 5, 0xd0b56b, 0.72).setRotation(-0.12);
    this.add.rectangle(x, y + 9, width + 12, 8, 0x6b4f3a, 0.96).setRotation(-0.16);
    this.add.rectangle(x - 7, y - 3, 7, height + 10, 0x8e684a, 0.96).setRotation(0.18);
    this.add.rectangle(x + 11, y - 2, 6, height, 0x453a2e, 0.86).setRotation(-0.24);
    this.add.arc(x + 3, y + 7, 22, 208, 328, false, 0xd8d2bd, 0.5).setStrokeStyle(3, 0xd8d2bd, 0.5);
  }

  private addBlackSketchPuddleHazardDetail(x: number, y: number, width: number, height: number): void {
    const shadow = this.add.ellipse(x + 5, y + 5, width + 22, height + 12, 0x070b0d, 0.38);
    shadow.setDepth(1.6);

    const body = this.add.ellipse(x, y, width, height, 0x0b1217, 0.88);
    body.setDepth(1.7);

    const leftSpill = this.add.ellipse(x - width * 0.34, y + 1, width * 0.28, height * 0.62, 0x101a20, 0.72);
    leftSpill.setDepth(1.72);

    const rightSpill = this.add.ellipse(x + width * 0.31, y - 3, width * 0.24, height * 0.48, 0x070d11, 0.62);
    rightSpill.setDepth(1.72);

    const frontDrip = this.add.ellipse(x - width * 0.08, y + height * 0.34, width * 0.38, height * 0.34, 0x111b21, 0.56);
    frontDrip.setDepth(1.73);

    const brokenEdge = this.add.ellipse(x - width * 0.2, y - 2, width * 0.34, height * 0.28, 0x1a262c, 0.28);
    brokenEdge.setDepth(1.74);

    const scratches = this.add.graphics();
    scratches.setDepth(1.8);
    scratches.lineStyle(1, 0xd8ddd2, 0.18);
    scratches.lineBetween(x - width * 0.43, y - 3, x - width * 0.28, y - 6);
    scratches.lineBetween(x - width * 0.1, y - height * 0.42, x + width * 0.08, y - height * 0.36);
    scratches.lineBetween(x + width * 0.24, y + 2, x + width * 0.4, y - 1);
    scratches.lineStyle(1, 0x2a3940, 0.46);
    scratches.lineBetween(x - width * 0.26, y + 5, x - width * 0.02, y + 8);
    scratches.lineBetween(x + width * 0.08, y + 7, x + width * 0.28, y + 4);
  }

  private addHazardProp(
    x: number,
    y: number,
    width: number,
    height: number,
    kind: HazardKind,
  ): boolean {
    const textureKey =
      kind === 'water'
        ? TEXTURE_KEYS.brokenWharfHazardProp
        : kind === 'rock'
          ? TEXTURE_KEYS.rockHazardProp
          : TEXTURE_KEYS.ropeDebrisHazardProp;

    if (!this.hasTexture(textureKey)) {
      return false;
    }

    const image = this.add.image(x, y, textureKey);
    image.setDepth(3);

    if (kind === 'water') {
      image.setDisplaySize(width + 34, height + 38);
      image.setPosition(x, y - 10);
      return true;
    }

    if (kind === 'rock') {
      image.setDisplaySize(width + 28, height + 24);
      image.setPosition(x, y - 5);
      return true;
    }

    image.setDisplaySize(width + 26, height + 22);
    image.setPosition(x, y - 5);
    return true;
  }

  private createFragments(): void {
    this.currentLevel.fragments.forEach(({ x, y }, index) => {
      const fragment = new StoryFragment(this, x, y, index + 1);
      this.fragments.add(fragment);
    });
  }

  private createPowerUps(): void {
    this.currentLevel.powerUps.forEach(({ kind, x, y }) => {
      const powerUp = new PowerUpPickup(this, x, y, kind);
      this.powerUps.add(powerUp);
    });
  }

  private createScuttleclaws(): void {
    this.currentLevel.scuttleclaws.forEach((definition) => {
      const scuttleclaw = new Scuttleclaw(this, definition);
      this.scuttleclaws.add(scuttleclaw);
    });
  }

  private createBoss(): void {
    this.lordMalefacto = this.currentLevel.boss ? new LordMalefacto(this, this.currentLevel.boss) : undefined;
  }

  private createEndMarker(): void {
    if (this.currentLevel.boss) {
      this.endMarker = this.add.rectangle(this.currentLevel.endX, GROUND_Y - 62, 34, 124, COLORS.marker, 0);
      this.endMarkerVisual = this.add.container(this.currentLevel.endX, GROUND_Y - 72);
      this.endMarkerText = this.add.text(this.currentLevel.endX, GROUND_Y - 174, '', {
        color: COLORS.text,
        fontFamily: 'monospace',
        fontSize: '13px',
      });
      this.endMarker.setVisible(false);
      this.endMarkerVisual.setVisible(false);
      this.endMarkerText.setVisible(false);
      return;
    }

    this.endMarker = this.add.rectangle(this.currentLevel.endX, GROUND_Y - 62, 34, 124, COLORS.marker, 0);
    if (this.currentLevel.secretLevel === true) {
      this.createCreatureDoorMarker();
      return;
    }

    if (this.hasTexture(TEXTURE_KEYS.ch8BeaconMarkerProp)) {
      this.endMarkerVisual = this.add.image(this.currentLevel.endX, GROUND_Y - 76, TEXTURE_KEYS.ch8BeaconMarkerProp);
      this.endMarkerVisual.setDisplaySize(96, 162);
      this.endMarkerVisual.setDepth(4);
      this.endMarkerText = this.add.text(this.currentLevel.endX - 30, GROUND_Y - 178, 'CH 8', {
        color: COLORS.text,
        fontFamily: 'monospace',
        fontSize: '13px',
        fontStyle: 'bold',
      });
      return;
    }

    const post = this.add.rectangle(0, 10, 14, 132, 0x544637, 0.98);
    const beacon = this.add.triangle(0, -63, 0, 46, 31, 0, 62, 46, 0xb7352d, 0.98);
    const cap = this.add.rectangle(0, -82, 58, 8, 0xf2efe4, 0.95);
    const band = this.add.rectangle(0, -50, 50, 8, 0xf2efe4, 0.88);
    const base = this.add.rectangle(0, 75, 46, 12, 0x2f3936, 0.94);
    post.setStrokeStyle(2, 0x2e261e, 0.85);
    beacon.setStrokeStyle(2, 0x6a221f, 0.9);
    this.endMarkerVisual = this.add.container(this.currentLevel.endX, GROUND_Y - 72, [post, beacon, cap, band, base]);

    this.endMarkerText = this.add.text(this.currentLevel.endX - 38, GROUND_Y - 174, 'CH 8', {
      color: COLORS.text,
      fontFamily: 'monospace',
      fontSize: '14px',
      fontStyle: 'bold',
    });
  }

  private createCreatureDoorMarker(): void {
    const isUnlocked = this.collectedFragments >= this.currentLevel.requiredFragments;
    const chalkAlpha = isUnlocked ? 0.76 : 0.38;
    const door = this.add.graphics();
    door.fillStyle(0x070b0d, isUnlocked ? 0.34 : 0.24);
    door.fillRoundedRect(-26, -68, 52, 110, 17);

    door.lineStyle(3, 0xd8ddd2, chalkAlpha);
    door.lineBetween(-29, 38, -27, -40);
    door.lineBetween(-26, -40, -18, -61);
    door.lineBetween(-17, -63, 1, -70);
    door.lineBetween(2, -69, 20, -61);
    door.lineBetween(21, -60, 28, -38);
    door.lineBetween(28, -36, 29, 38);

    door.lineStyle(2, 0xd8ddd2, chalkAlpha * 0.56);
    door.lineBetween(-19, 34, -18, -34);
    door.lineBetween(-16, -43, -4, -53);
    door.lineBetween(-1, -55, 13, -48);
    door.lineBetween(16, -42, 18, 33);

    door.lineStyle(1, 0xd8ddd2, chalkAlpha * 0.28);
    door.lineBetween(-23, -30, -10, -35);
    door.lineBetween(-22, -7, 9, -15);
    door.lineBetween(-17, 13, 16, 5);
    door.lineBetween(-30, 45, 31, 42);
    door.lineBetween(-20, 50, 22, 47);

    door.fillStyle(0xd8ddd2, chalkAlpha * 0.62);
    door.fillCircle(15, -6, 2);

    this.endMarkerVisual = this.add.container(this.currentLevel.endX, GROUND_Y - 82, [door]);
    this.endMarkerVisual.setDepth(4);

    this.endMarkerText = this.add.text(this.currentLevel.endX - 20, GROUND_Y - 172, '', {
      color: COLORS.mutedText,
      fontFamily: 'monospace',
      fontSize: '11px',
      fontStyle: 'bold',
    });
  }

  private createStartZone(): void {
    // Start-zone visualization lives in the H debug overlay for demo builds.
  }

  private createChalkTrigger(): void {
    const chalkTrigger = this.currentLevel.chalkTrigger;
    if (!chalkTrigger) {
      this.chalkTrigger = undefined;
      return;
    }

    this.chalkTrigger = this.add.rectangle(
      chalkTrigger.x,
      chalkTrigger.y,
      chalkTrigger.width,
      chalkTrigger.height,
      0xd8ddd2,
      0,
    );
    this.physics.add.existing(this.chalkTrigger, true);

    const sketch = this.add.graphics();
    sketch.setDepth(5);
    sketch.lineStyle(2, 0xd8ddd2, 0.42);
    sketch.strokeCircle(chalkTrigger.x - 6, chalkTrigger.y - 3, 8);
    sketch.lineBetween(chalkTrigger.x + 2, chalkTrigger.y + 2, chalkTrigger.x + 12, chalkTrigger.y - 12);
    sketch.lineBetween(chalkTrigger.x + 2, chalkTrigger.y + 2, chalkTrigger.x + 12, chalkTrigger.y + 12);
    sketch.lineStyle(1, 0xd8ddd2, 0.28);
    sketch.strokeRect(chalkTrigger.x - 15, chalkTrigger.y - 20, 30, 40);
  }

  private createBubbleVents(): void {
    this.ventZones = [];
    this.ventGraphics = this.add.graphics();
    this.ventGraphics.setDepth(1);

    const vents = this.currentLevel.bubbleVents ?? [];
    vents.forEach(({ x, y, width, height }) => {
      const zone = this.add.rectangle(x, y, width, height, 0x7fd8d5, 0);
      this.physics.add.existing(zone, true);
      (zone.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
      this.ventZones.push(zone);
    });
  }

  private createEelgrassVisuals(): void {
    this.eelgrassGraphics = this.add.graphics();
    this.eelgrassGraphics.setDepth(2);

    const zones = this.currentLevel.eelgrassZones ?? [];
    for (const zone of zones) {
      const left = zone.x - zone.width / 2;
      const base = zone.y + zone.height / 2;

      // Ground-level tint — dark green strip anchors the blades and signals dense vegetation
      this.eelgrassGraphics.fillStyle(0x1b3d24, 0.22);
      this.eelgrassGraphics.fillRect(left, base - 40, zone.width, 40);

      // Grass blades — taller than the first pass so tips reach ankle/shin height on both characters
      const bladeCount = Math.floor(zone.width / 7);
      const step = zone.width / bladeCount;
      for (let i = 0; i < bladeCount; i++) {
        const bx = left + (i + 0.5) * step;
        const bladeH = 42 + (i % 4) * 4;  // 42 / 46 / 50 / 54 px
        const lean = ((i % 5) - 2) * 3;    // -6 / -3 / 0 / +3 / +6 px
        this.eelgrassGraphics.lineStyle(2.5, 0x4a8c57, 0.80);
        this.eelgrassGraphics.lineBetween(bx, base, bx + lean, base - bladeH);
      }
    }
  }

  private getActiveEelgrassMultiplier(): number {
    const zones = this.currentLevel.eelgrassZones;
    if (!zones?.length) return 1;
    const px = this.player.x;
    const py = this.player.y;
    for (const zone of zones) {
      if (
        px >= zone.x - zone.width / 2 &&
        px <= zone.x + zone.width / 2 &&
        py >= zone.y - zone.height / 2 &&
        py <= zone.y + zone.height / 2
      ) {
        return zone.slowMultiplier;
      }
    }
    return 1;
  }

  /** Applies a gentle rightward nudge while the player overlaps a current zone.
   *  Runs after all input-driven velocity decisions each frame.
   *  - Adds 20 px/s per frame toward the zone's velocityBias (target speed).
   *  - Stops adding once player velocity already meets or exceeds the target.
   *  - Player input fully overrides: going left is only ~11 % slower (Cod) or ~8 % (Puffy).
   *  - On exit the addition stops immediately; body drag returns velocity to 0 within ~3 frames. */
  private applyCurrentZonePush(): void {
    if (!this.isRunStarted || this.isEnded) return;
    const zones = this.currentLevel.currentZones;
    if (!zones?.length) return;
    const px = this.player.x;
    const py = this.player.y;
    const body = this.getPlayerBody();
    for (const zone of zones) {
      if (
        px >= zone.x - zone.width / 2 &&
        px <= zone.x + zone.width / 2 &&
        py >= zone.y - zone.height / 2 &&
        py <= zone.y + zone.height / 2
      ) {
        const bias = zone.velocityBias;
        const vx = body.velocity.x;
        if (bias > 0 && vx < bias) {
          body.setVelocityX(Math.min(vx + 20, bias));
        } else if (bias < 0 && vx > bias) {
          body.setVelocityX(Math.max(vx - 20, bias));
        }
        break;
      }
    }
  }

  /** Draws organic underwater flow cues for each current zone.
   *  Depth 1 — rendered above platforms, below player and collectibles.
   *  No filled rectangle in normal view. Uses a seeded PRNG so the visual
   *  is deterministic every load without requiring external state.
   *  H/debug rectangle is drawn separately in drawDebugOverlay and is unchanged. */
  private createCurrentZoneVisuals(): void {
    this.currentZoneGraphics = this.add.graphics();
    this.currentZoneGraphics.setDepth(1);

    const zones = this.currentLevel.currentZones ?? [];
    for (const zone of zones) {
      const left   = zone.x - zone.width  / 2;
      const top    = zone.y - zone.height / 2;
      const right  = zone.x + zone.width  / 2;
      const g      = this.currentZoneGraphics;

      // Seeded PRNG — deterministic per zone, identical each run
      let seed = (zone.x * 31 + zone.y * 17 + zone.width) | 0;
      const rand = (): number => {
        seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
        return (seed >>> 0) / 0x100000000;
      };

      // Bare background tint — 4% alpha, imperceptible as a rectangle,
      // just enough to very slightly cool the water colour in the zone
      g.fillStyle(0x4a90a4, 0.04);
      g.fillRect(left, top, zone.width, zone.height);

      // --- Organic flow streaks ---
      // Staggered starts, varied lengths and alpha.  No lines share the same
      // x-bounds, so the zone reads as flowing water rather than a UI box.
      for (let i = 0; i < 18; i++) {
        const ry     = top + 5 + rand() * (zone.height - 10);
        // Start biased to left half so streaks trail rightward across the zone
        const xStart = left + rand() * (zone.width * 0.45);
        const len    = zone.width * (0.28 + rand() * 0.60);
        const xEnd   = Math.min(xStart + len, right - 3);
        const thick  = rand() < 0.38 ? 2 : 1;
        const alpha  = 0.22 + rand() * 0.28;
        const colour = rand() < 0.55 ? 0x56a0b4 : 0x4888a0;

        g.lineStyle(thick, colour, alpha);
        g.lineBetween(xStart, ry, xEnd, ry);
      }

      // --- Silt / tiny-fleck dashes — particles carried by current ---
      for (let i = 0; i < 14; i++) {
        const ry     = top + 5 + rand() * (zone.height - 10);
        const xStart = left + 6 + rand() * (zone.width - 14);
        const len    = 3 + rand() * 8;           // 3 – 11 px
        const alpha  = 0.12 + rand() * 0.14;     // 12 – 26 %

        g.lineStyle(1, 0x70c0d2, alpha);
        g.lineBetween(xStart, ry, xStart + len, ry);
      }

      // --- Tiny bubble / mote dots ---
      for (let i = 0; i < 6; i++) {
        const bx    = left + 8 + rand() * (zone.width  - 16);
        const by    = top  + 5 + rand() * (zone.height - 10);
        const alpha = 0.10 + rand() * 0.12;      // 10 – 22 %

        g.fillStyle(0x88d0e0, alpha);
        g.fillRect(bx, by, 2, 2);                // 2×2 px mote
      }
    }
  }

  private createPlayer(): void {
    const character = CHARACTERS[this.activeCharacter];
    this.player = this.add.rectangle(this.currentLevel.startX, GROUND_Y - 80, character.width, character.height, character.bodyColor);
    this.player.setVisible(false);
    this.physics.add.existing(this.player);

    const body = this.getPlayerBody();
    body.setSize(character.width, character.height);
    body.setCollideWorldBounds(true);
    body.setMaxVelocity(360, 620);
    body.setDragX(character.dragX);
    body.setAllowGravity(true);
    body.setGravityY(character.gravityY - 900);

    this.playerVisual = this.createCharacterVisual(this.activeCharacter);
    this.powerUpStateVisual = this.createPowerUpStateVisual();
    this.playerLabel = this.add.text(this.player.x, this.player.y - 48, character.label, {
      color: COLORS.text,
      fontFamily: 'monospace',
      fontSize: '12px',
      fontStyle: 'bold',
    });
    this.playerLabel.setOrigin(0.5, 1);
    this.playerLabel.setVisible(false);

    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.scuttleclaws, this.platforms);
  }

  private createPlayerPowerIndicators(): void {
    this.tideLiftGraphics = this.add.graphics();
    this.tideLiftGraphics.setDepth(18);

    this.sparkIndicator = this.add.arc(0, 0, 32, 205, 335, false, 0xd5a24f, 0);
    this.sparkIndicator.setStrokeStyle(2, 0xd5a24f, 0.76);
    this.sparkIndicator.setDepth(19);
    this.sparkIndicator.setVisible(false);
  }

  private createCharacterVisual(characterKey: CharacterKey): Phaser.GameObjects.Container | Phaser.GameObjects.Sprite {
    const calvinVisual = this.createCalvinCreatureVisual(characterKey);
    if (calvinVisual) {
      this.playerVisualMode = 'placeholder';
      return calvinVisual;
    }

    const sprite = this.createSpriteCharacterVisual(characterKey);
    if (sprite) {
      this.playerVisualMode = 'sprite';
      return sprite;
    }

    this.playerVisualMode = 'placeholder';
    const parts =
      characterKey === 'cod' ? this.createCodByVisualParts() : this.createPuffyVisualParts();
    const visual = this.add.container(this.player.x, this.player.y, parts);
    visual.setDepth(20);
    return visual;
  }

  private isCalvinCreatureRoom(): boolean {
    return this.currentLevel.secretLevel === true;
  }

  private createCalvinCreatureVisual(characterKey: CharacterKey): Phaser.GameObjects.Container | null {
    if (!this.isCalvinCreatureRoom()) {
      return null;
    }

    const textureKey =
      characterKey === 'cod'
        ? TEXTURE_KEYS.calvinEarthEyesBartPlaceholder
        : TEXTURE_KEYS.calvinRedBartPlaceholder;
    if (!this.textures.exists(textureKey)) {
      return null;
    }

    const character = CHARACTERS[characterKey];
    const calvinVisualYOffset = characterKey === 'cod' ? -10 : 0;
    const image = this.add.image(0, character.height / 2 + 1 + calvinVisualYOffset, textureKey);
    image.setOrigin(0.5, 1);
    image.setScale(characterKey === 'cod' ? 0.16 : 0.12);

    const visual = this.add.container(this.player.x, this.player.y, [image]);
    visual.setDepth(20);
    return visual;
  }

  private createSpriteCharacterVisual(characterKey: CharacterKey): Phaser.GameObjects.Sprite | null {
    if (!this.canUseSpriteAtlas(characterKey)) {
      return null;
    }

    const textureKey = characterKey === 'cod' ? TEXTURE_KEYS.codbyAtlas : TEXTURE_KEYS.puffyAtlas;
    const frame = characterKey === 'cod' ? 0 : 0;
    const sprite = this.add.sprite(this.player.x, this.getPlayerFootY(), textureKey, frame);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(20);
    sprite.setScale(GAMEPLAY_TUNING.characters[characterKey].spriteScale);
    sprite.play(CHARACTER_ANIMATION_KEYS[characterKey].idle);
    return sprite;
  }

  private canUseSpriteAtlas(characterKey: CharacterKey): boolean {
    const textureKey = characterKey === 'cod' ? TEXTURE_KEYS.codbyAtlas : TEXTURE_KEYS.puffyAtlas;
    const metaKey = characterKey === 'cod' ? TEXTURE_KEYS.codbyAtlasMeta : TEXTURE_KEYS.puffyAtlasMeta;
    return this.textures.exists(textureKey) && Boolean(this.cache.json.get(metaKey));
  }

  private createCharacterAnimations(): void {
    this.createAnimationsFromMeta('cod', TEXTURE_KEYS.codbyAtlas, TEXTURE_KEYS.codbyAtlasMeta, {
      idle: CHARACTER_ANIMATION_KEYS.cod.idle,
      walk: CHARACTER_ANIMATION_KEYS.cod.move,
      jump: CHARACTER_ANIMATION_KEYS.cod.jump,
      fall: CHARACTER_ANIMATION_KEYS.cod.fall,
      hurt: CHARACTER_ANIMATION_KEYS.cod.hurt,
    });

    this.createAnimationsFromMeta('puffy', TEXTURE_KEYS.puffyAtlas, TEXTURE_KEYS.puffyAtlasMeta, {
      idle: CHARACTER_ANIMATION_KEYS.puffy.idle,
      run: CHARACTER_ANIMATION_KEYS.puffy.move,
      jump: CHARACTER_ANIMATION_KEYS.puffy.jump,
      glide: CHARACTER_ANIMATION_KEYS.puffy.fall,
      hurt: CHARACTER_ANIMATION_KEYS.puffy.hurt,
    });
  }

  private createAnimationsFromMeta(
    characterKey: CharacterKey,
    textureKey: string,
    metaKey: string,
    animationMap: Record<string, string>,
  ): void {
    const meta = this.cache.json.get(metaKey) as CharacterAtlasMeta | undefined;
    if (!meta || !this.textures.exists(textureKey)) {
      return;
    }

    const expectedWidth = characterKey === 'cod' ? 256 : 288;
    const expectedHeight = characterKey === 'cod' ? 320 : 240;
    if (meta.cellWidth !== expectedWidth || meta.cellHeight !== expectedHeight) {
      return;
    }

    Object.entries(animationMap).forEach(([sourceName, animationKey]) => {
      if (this.anims.exists(animationKey)) {
        return;
      }

      const sourceFrames = meta.animations[sourceName];
      if (!sourceFrames?.length) {
        return;
      }

      const hasExpectedFrameSize = sourceFrames.every(
        (frame) => frame.w === expectedWidth && frame.h === expectedHeight,
      );
      if (!hasExpectedFrameSize) {
        return;
      }

      const frames = sourceFrames.map((frame) => ({
        key: textureKey,
        frame: this.getAtlasFrameIndex(meta, frame),
      }));

      this.anims.create({
        key: animationKey,
        frames,
        frameRate: this.getAnimationFrameRate(characterKey, sourceName),
        repeat: -1,
      });
    });
  }

  private getAnimationFrameRate(characterKey: CharacterKey, sourceName: string): number {
    const frameRates = GAMEPLAY_TUNING.characters[characterKey].animationFrameRates as Record<string, number>;
    return frameRates[sourceName] ?? 8;
  }

  private getAtlasFrameIndex(
    meta: Pick<CharacterAtlasMeta, 'cellWidth' | 'cellHeight' | 'columns'>,
    frame: AtlasAnimationFrame,
  ): number {
    const column = Math.floor(frame.atlasX / meta.cellWidth);
    const row = Math.floor(frame.atlasY / meta.cellHeight);
    return row * meta.columns + column;
  }

  private createCodByVisualParts(): Phaser.GameObjects.GameObject[] {
    const coat = this.add.ellipse(0, 7, 44, 42, 0xd6b93e, 1);
    const coatHem = this.add.rectangle(0, 25, 34, 10, 0xc4a533, 1);
    const fishHead = this.add.ellipse(1, -13, 38, 22, 0x8e9a84, 1);
    const codJaw = this.add.ellipse(6, -6, 26, 10, 0xb8b49d, 0.88);
    const tail = this.add.triangle(-27, 2, 22, 0, 0, 15, 0, -15, 0x798a78, 1);
    const hatBrim = this.add.rectangle(2, -24, 40, 7, 0xe6c84f, 1);
    const hatTop = this.add.triangle(1, -40, 0, 20, 20, 0, 40, 20, 0xe6c84f, 1);
    const collar = this.add.rectangle(0, -1, 31, 6, 0x625034, 0.82);
    const eye = this.add.rectangle(12, -16, 4, 2, 0x1f2422, 1);
    const bootLeft = this.add.rectangle(-10, 31, 9, 8, 0x2c2925, 1);
    const bootRight = this.add.rectangle(11, 31, 9, 8, 0x2c2925, 1);

    coat.setStrokeStyle(2, 0x57482f, 0.9);
    fishHead.setStrokeStyle(2, 0x4e5d50, 0.9);
    tail.setStrokeStyle(2, 0x4e5d50, 0.8);
    hatBrim.setStrokeStyle(1, 0x5b4b2e, 0.75);

    return [tail, coat, coatHem, fishHead, codJaw, collar, hatBrim, hatTop, eye, bootLeft, bootRight];
  }

  private createPuffyVisualParts(): Phaser.GameObjects.GameObject[] {
    const wingBack = this.add.ellipse(-4, 6, 31, 42, 0x20252a, 1);
    const belly = this.add.ellipse(4, 9, 25, 33, 0xf2efe4, 1);
    const head = this.add.ellipse(1, -14, 29, 25, 0x20252a, 1);
    const face = this.add.ellipse(7, -14, 16, 18, 0xf2efe4, 1);
    const beak = this.add.triangle(19, -13, 0, 0, 15, 6, 0, 12, 0xd9783d, 1);
    const eye = this.add.rectangle(8, -18, 3, 3, 0x111416, 1);
    const footLeft = this.add.rectangle(-6, 31, 10, 4, 0xc76b3a, 1);
    const footRight = this.add.rectangle(8, 31, 10, 4, 0xc76b3a, 1);
    const wingCut = this.add.arc(-8, 10, 12, 70, 250, false, 0x2d3439, 0.95);

    wingBack.setStrokeStyle(2, 0x111416, 0.9);
    head.setStrokeStyle(2, 0x111416, 0.9);
    belly.setStrokeStyle(1, 0xb8b4a8, 0.65);
    beak.setStrokeStyle(1, 0x823f2a, 0.75);

    return [wingBack, belly, wingCut, head, face, beak, eye, footLeft, footRight];
  }

  private createHud(): void {
    const hasTouch =
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches ||
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      this.sys.game.device.input.touch;
    this.isMobileLayout = hasTouch;

    if (this.isMobileLayout) {
      // Compact full-width strip at top of screen for touch devices.
      this.hudPanel = this.add.rectangle(480, 24, 960, 48, 0x172426, 0.82);
      this.hudPanel.setStrokeStyle(1, 0xb9c0b5, 0.18);
      this.hudPanel.setScrollFactor(0);

      this.hudTitleText = this.add.text(0, 0, '', {
        color: COLORS.text, fontFamily: 'monospace', fontSize: '11px', fontStyle: 'bold',
      });
      this.hudTitleText.setScrollFactor(0);
      this.hudTitleText.setVisible(false);

      this.hudStatsText = this.add.text(10, 17, '', {
        color: COLORS.text, fontFamily: 'monospace', fontSize: '11px', fontStyle: 'bold',
      });
      this.hudStatsText.setScrollFactor(0);

      this.hudHintText = this.add.text(0, 0, '', {
        color: COLORS.mutedText, fontFamily: 'monospace', fontSize: '10px',
      });
      this.hudHintText.setScrollFactor(0);
      this.hudHintText.setVisible(false);
    } else {
      // Desktop HUD: existing layout.
      this.hudPanel = this.add.rectangle(378, 56, 708, 88, 0x172426, 0.76);
      this.hudPanel.setStrokeStyle(1, 0xb9c0b5, 0.24);
      this.hudPanel.setScrollFactor(0);

      this.hudTitleText = this.add.text(24, 12, '', {
        color: COLORS.text,
        fontFamily: 'monospace',
        fontSize: '12px',
        fontStyle: 'bold',
      });
      this.hudTitleText.setScrollFactor(0);

      this.hudStatsText = this.add.text(24, 33, '', {
        color: COLORS.text,
        fontFamily: 'monospace',
        fontSize: '12px',
        fontStyle: 'bold',
        lineSpacing: 4,
      });
      this.hudStatsText.setScrollFactor(0);

      this.hudHintText = this.add.text(24, 81, '', {
        color: COLORS.mutedText,
        fontFamily: 'monospace',
        fontSize: '10px',
      });
      this.hudHintText.setScrollFactor(0);

      if (TRAILER_CAPTURE_MODE) {
        this.hudTitleText.setVisible(false);
        this.hudHintText.setVisible(false);
      }
    }

    this.createFullscreenButton();

    const overlayY = this.isMobileLayout ? 185 : 206;
    const overlayW = this.isMobileLayout ? 576 : 560;
    const overlayH = this.isMobileLayout ? 210 : 200;
    const overlayFontSize = this.isMobileLayout ? '15px' : '19px';
    const overlayLineSpacing = this.isMobileLayout ? 5 : 5;

    this.messagePanel = this.add.rectangle(GAME_WIDTH / 2, overlayY, overlayW, overlayH, 0x172426, 0.88);
    this.messagePanel.setStrokeStyle(1, 0xd8ddd2, 0.28);
    this.messagePanel.setScrollFactor(0);
    this.messagePanel.setVisible(false);

    this.messageText = this.add.text(GAME_WIDTH / 2, overlayY, '', {
      align: 'center',
      color: COLORS.text,
      fontFamily: 'monospace',
      fontSize: overlayFontSize,
      fontStyle: 'bold',
      lineSpacing: overlayLineSpacing,
    });
    this.messageText.setOrigin(0.5, 0.5);
    this.messageText.setScrollFactor(0);

    this.updateHud();
  }

  private createFullscreenButton(): void {
    const x = GAME_WIDTH - 28;
    const y = this.isMobileLayout ? 24 : 16;

    const btn = this.add.rectangle(x, y, 44, 28, 0x1a3a3c, 0.72);
    btn.setStrokeStyle(1, 0xb9c0b5, 0.40);
    btn.setScrollFactor(0);
    btn.setDepth(800);
    btn.setInteractive();

    const label = this.add.text(x, y, 'FS', {
      color: '#a8bfb8',
      fontFamily: 'monospace',
      fontSize: '13px',
      fontStyle: 'bold',
    });
    label.setOrigin(0.5, 0.5);
    label.setScrollFactor(0);
    label.setDepth(801);

    btn.on('pointerover', () => btn.setFillStyle(0x2a5050, 0.85));
    btn.on('pointerout', () => btn.setFillStyle(0x1a3a3c, 0.72));
    btn.on('pointerdown', (_ptr: Phaser.Input.Pointer, _lx: number, _ly: number, event: Phaser.Types.Input.EventData) => {
      event.stopPropagation();
      this.suppressNextTouchAction = true;
      const target = (this.sys.game.canvas.parentElement ?? this.sys.game.canvas) as HTMLElement;
      const isFs = !!(document.fullscreenElement || (document as any).webkitFullscreenElement);
      const p = isFs ? document.exitFullscreen?.() : target.requestFullscreen?.();
      p?.catch(() => {});
    });
  }

  private createTitleOverlay(): void {
    const titleText = this.currentLevel.secretLevel ? "CALVIN'S CREATURE ROOM" : "COD B\u2019Y & PUFFY\nSHORELINE RUN";
    const objectiveText = this.currentLevel.secretLevel
      ? 'A secret page behind the shoreline.'
      : 'Collect the Tide Relics.\nMind the gaps. Ride the tide.\nReach CH 8.';
    const footerText = this.currentLevel.secretLevel ? 'Sucka Free.' : '1 Cod B\u2019y | 2 Puffy | R Restart';

    const shade = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0f1819, 0.58);
    const topRule = this.add.rectangle(GAME_WIDTH / 2, 126, 430, 1, 0xd8ddd2, 0.34);
    const lowerRule = this.add.rectangle(GAME_WIDTH / 2, 332, 430, 1, 0xd8ddd2, 0.28);
    const title = this.add.text(GAME_WIDTH / 2, 180, titleText, {
      align: 'center',
      color: COLORS.text,
      fontFamily: 'monospace',
      fontSize: this.currentLevel.secretLevel ? '34px' : '39px',
      fontStyle: 'bold',
      lineSpacing: 11,
    });
    title.setOrigin(0.5, 0.5);

    const objective = this.add.text(
      GAME_WIDTH / 2,
      272,
      objectiveText,
      {
        align: 'center',
        color: COLORS.mutedText,
        fontFamily: 'monospace',
        fontSize: '15px',
        lineSpacing: 6,
      },
    );
    objective.setOrigin(0.5, 0.5);

    const prompt = this.add.text(GAME_WIDTH / 2, 374, 'Press ENTER or SPACE to Start', {
      align: 'center',
      color: COLORS.text,
      fontFamily: 'monospace',
      fontSize: '18px',
      fontStyle: 'bold',
    });
    prompt.setOrigin(0.5, 0.5);

    const controls = this.add.text(GAME_WIDTH / 2, 424, footerText, {
      align: 'center',
      color: COLORS.mutedText,
      fontFamily: 'monospace',
      fontSize: '12px',
    });
    controls.setOrigin(0.5, 0.5);

    if (TRAILER_CAPTURE_MODE) {
      prompt.setVisible(false);
      controls.setVisible(false);
    }

    this.titleOverlay = this.add.container(0, 0, [shade, topRule, title, objective, lowerRule, prompt, controls]);
    this.titleOverlay.setDepth(900);
    this.titleOverlay.setScrollFactor(0);
  }

  private handleTitleInput(): void {
    const wantsStart =
      Phaser.Input.Keyboard.JustDown(this.controls.start) ||
      Phaser.Input.Keyboard.JustDown(this.controls.space) ||
      this.touchInput.jumpJustDown;

    if (!wantsStart) {
      return;
    }

    this.touchInput.jumpJustDown = false;
    this.jumpQueuedUntil = 0;
    this.startRun();
  }

  private startRun(): void {
    this.isRunStarted = true;
    this.touchInput.jumpHeld = false;
    this.levelStartedAt = this.time.now;
    this.titleOverlay.setVisible(false);
    this.messagePanel.setVisible(false);
    this.messageText.setText('');
    this.updateHud();
  }

  private createDebugOverlay(): void {
    this.debugGraphics = this.add.graphics();
    this.debugGraphics.setDepth(1000);
    this.debugGraphics.setVisible(false);
  }

  private queueTouchJump(): void {
    this.touchInput.jumpJustDown = true;
    this.touchInput.jumpHeld = true;
    this.jumpQueuedUntil = this.time.now + this.TOUCH_JUMP_BUFFER_MS;
    this.markAudioInteraction();
  }

  private queueTouchSwitch(): void {
    const now = this.time.now;
    if (now - this.lastTouchSwitchAt < this.TOUCH_SWITCH_COOLDOWN_MS) {
      return;
    }

    this.touchInput.switchJustDown = true;
    this.switchQueuedUntil = now + this.TOUCH_SWITCH_BUFFER_MS;
    this.lastTouchSwitchAt = now;
    this.markAudioInteraction();
  }

  private releaseTouchPointer(kind: 'left' | 'right' | 'jump' | 'switch', pointerId: number): void {
    this.touchPointers[kind].delete(pointerId);
    this.touchInput.left = this.touchPointers.left.size > 0;
    this.touchInput.right = this.touchPointers.right.size > 0;
    this.touchInput.jumpHeld = this.touchPointers.jump.size > 0;
  }

  private createTouchControls(): void {
    if (!this.sys.game.device.input.touch || TRAILER_CAPTURE_MODE) {
      return;
    }

    // Support at least 4 simultaneous touches (left, right, jump, switch each get their own pointer).
    this.input.addPointer(3);

    // Prevent browser scroll/zoom from stealing touch events on the canvas.
    const canvas = this.sys.game.canvas;
    canvas.style.touchAction = 'none';
    canvas.style.userSelect = 'none';
    canvas.style.setProperty('-webkit-user-select', 'none');
    canvas.style.setProperty('-webkit-touch-callout', 'none');

    const DEPTH = 950;
    const BG = 0x1a3a3c;
    const BG_A = 0.52;
    const TEXT: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#c8d8d0', fontFamily: 'monospace', fontSize: '16px', fontStyle: 'bold',
    };
    const SMALL: Phaser.Types.GameObjects.Text.TextStyle = {
      color: '#c8d8d0', fontFamily: 'monospace', fontSize: '13px', fontStyle: 'bold',
    };

    // makeBtn draws a visual rectangle + centered label.
    // The interactive hit zone is set separately and is larger than the visual.
    const makeBtn = (
      x: number, y: number,
      visW: number, visH: number,
      hitW: number, hitH: number,
      label: string, style: Phaser.Types.GameObjects.Text.TextStyle,
    ): Phaser.GameObjects.Rectangle => {
      const bg = this.add.rectangle(x, y, visW, visH, BG, BG_A).setScrollFactor(0).setDepth(DEPTH);
      this.add.text(x, y, label, style).setOrigin(0.5, 0.5).setScrollFactor(0).setDepth(DEPTH + 1);
      bg.setInteractive(
        new Phaser.Geom.Rectangle(-hitW / 2, -hitH / 2, hitW, hitH),
        Phaser.Geom.Rectangle.Contains,
      );
      return bg;
    };

    // LEFT — bottom-left cluster
    // Visual 88×84; hit 124×124 (right edge of hit zone at x=134, gap before RIGHT).
    const leftBtn = makeBtn(72, 478, 88, 84, 124, 124, '<', TEXT);
    leftBtn.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      this.touchPointers.left.add(ptr.id);
      this.touchInput.left = true;
      this.markAudioInteraction();
    });
    leftBtn.on('pointerover', (ptr: Phaser.Input.Pointer) => {
      if (!ptr.isDown) return;
      this.touchPointers.left.add(ptr.id);
      this.touchInput.left = true;
    });
    leftBtn.on('pointerup', (ptr: Phaser.Input.Pointer) => {
      this.touchPointers.left.delete(ptr.id);
      this.touchInput.left = this.touchPointers.left.size > 0;
    });
    leftBtn.on('pointerout', (ptr: Phaser.Input.Pointer) => {
      this.touchPointers.left.delete(ptr.id);
      this.touchInput.left = this.touchPointers.left.size > 0;
    });

    // RIGHT — bottom-left cluster (left edge of hit zone at x=136, 2px gap after LEFT).
    // Visual 88×84; hit 124×124.
    const rightBtn = makeBtn(198, 478, 88, 84, 124, 124, '>', TEXT);
    rightBtn.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
      this.touchPointers.right.add(ptr.id);
      this.touchInput.right = true;
      this.markAudioInteraction();
    });
    rightBtn.on('pointerover', (ptr: Phaser.Input.Pointer) => {
      if (!ptr.isDown) return;
      this.touchPointers.right.add(ptr.id);
      this.touchInput.right = true;
    });
    rightBtn.on('pointerup', (ptr: Phaser.Input.Pointer) => {
      this.touchPointers.right.delete(ptr.id);
      this.touchInput.right = this.touchPointers.right.size > 0;
    });
    rightBtn.on('pointerout', (ptr: Phaser.Input.Pointer) => {
      this.touchPointers.right.delete(ptr.id);
      this.touchInput.right = this.touchPointers.right.size > 0;
    });

      // JUMP — bottom-right. Large forgiving hit zone; buffered so near-ground taps still fire.
      const jumpBtn = makeBtn(876, 479, 116, 90, 168, 142, 'JUMP', TEXT);
      jumpBtn.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
        this.touchPointers.jump.add(ptr.id);
        this.queueTouchJump();
      });
      jumpBtn.on('pointerover', (ptr: Phaser.Input.Pointer) => {
        if (!ptr.isDown) return;
        this.touchPointers.jump.add(ptr.id);
        this.queueTouchJump();
      });
      ['pointerup', 'pointerout', 'pointerupoutside', 'pointercancel'].forEach((eventName) => {
        jumpBtn.on(eventName, (ptr: Phaser.Input.Pointer) => {
          this.releaseTouchPointer('jump', ptr.id);
        });
      });

      // SWITCH — above JUMP. Large forgiving hit zone; buffered with cooldown to prevent double-switches.
      const switchBtn = makeBtn(876, 356, 128, 70, 168, 102, 'SWITCH', SMALL);
      switchBtn.on('pointerdown', (ptr: Phaser.Input.Pointer) => {
        this.touchPointers.switch.add(ptr.id);
        this.queueTouchSwitch();
      });
      switchBtn.on('pointerover', (ptr: Phaser.Input.Pointer) => {
        if (!ptr.isDown) return;
        this.touchPointers.switch.add(ptr.id);
        this.queueTouchSwitch();
      });
      ['pointerup', 'pointerout', 'pointerupoutside', 'pointercancel'].forEach((eventName) => {
        switchBtn.on(eventName, (ptr: Phaser.Input.Pointer) => {
          this.releaseTouchPointer('switch', ptr.id);
        });
      });

    // Tap anywhere on canvas to start (title screen) or restart/advance (game over / level complete).
    // Only active when the scene is waiting for user action, not during live gameplay.
    this.input.on('pointerdown', () => {
      if (this.suppressNextTouchAction) {
        this.suppressNextTouchAction = false;
        return;
      }
      if (!this.isRunStarted || (this.isEnded && !this.isTransitioningToBoss)) {
        this.touchInput.jumpJustDown = true;
      }
    });
  }

  private createOverlaps(): void {
    this.physics.add.overlap(this.player, this.fragments, (_, fragment) => {
      this.collectFragment(fragment as StoryFragment);
    });

    this.physics.add.overlap(this.player, this.powerUps, (_, powerUp) => {
      this.collectPowerUp(powerUp as PowerUpPickup);
    });

    this.physics.add.overlap(this.player, this.hazards, (_, hazard) => {
      this.handleHazardContact(hazard as HazardZone);
    });

    this.physics.add.overlap(this.player, this.scuttleclaws, (_, scuttleclaw) => {
      this.handleScuttleclawContact(scuttleclaw as Scuttleclaw);
    });

    if (this.chalkTrigger) {
      this.physics.add.overlap(this.player, this.chalkTrigger, () => {
        this.enterSecretLevel();
      });
    }

    this.ventZones.forEach((zone, index) => {
      this.physics.add.overlap(this.player, zone, () => {
        this.handleBubbleVentContact(index);
      });
    });

    if (this.lordMalefacto) {
      this.physics.add.overlap(this.player, this.lordMalefacto as Phaser.GameObjects.GameObject, () => {
        this.handleBossContact();
      });

      this.physics.add.overlap(this.player, this.lordMalefacto.getFlareZone(), () => {
        this.handleBossFlareContact();
      });
    }
  }

  private enterSecretLevel(): void {
    if (this.isEnded || this.isTransitioningToBoss) {
      return;
    }

    const targetLevelId = this.currentLevel.chalkTrigger?.targetLevelId;
    const targetLevelIndex = targetLevelId ? LEVELS.findIndex((level) => level.id === targetLevelId) : -1;
    if (targetLevelIndex < 0) {
      return;
    }

    this.registry.set('shorelineCurrentLevelIndex', targetLevelIndex);
    this.registry.set('shorelineSecretRoute', true);
    this.stopCurrentMusic();
    this.scene.restart();
  }

  private resetRunState(): void {
    this.activeCharacter = 'cod';
    this.health = CHARACTERS.cod.maxHealth;
    this.collectedFragments = 0;
    this.score = 0;
    this.lastDamageAt = -DAMAGE_COOLDOWN_MS;
    this.hurtUntil = 0;
    this.isRunStarted = false;
    this.levelStartedAt = 0;
    this.levelEndedAt = 0;
    this.isEnded = false;
    this.didWinLevel = false;
    this.isTransitioningToBoss = false;
    this.kelpShieldCharges = 0;
    this.kelpShieldExpiresAt = 0;
    this.tideLiftExpiresAt = 0;
    this.hasTideLiftCharge = false;
    this.tideGlideBoostUntil = 0;
    this.storySparkExpiresAt = 0;
    this.tideRunExpiresAt = 0;
    this.wasGliding = false;
    this.bubbleVentBoostAt = -10000;
    this.touchInput = { left: false, right: false, jumpJustDown: false, jumpHeld: false, switchJustDown: false };
    this.touchPointers = { left: new Set<number>(), right: new Set<number>(), jump: new Set<number>(), switch: new Set<number>() };
    this.jumpQueuedUntil = 0;
    this.switchQueuedUntil = 0;
    this.lastTouchSwitchAt = -1000;
  }

  private resetCameraState(): void {
    const camera = this.cameras.main;
    camera.stopFollow();
    camera.resetFX();
    camera.setViewport(0, PRESENTATION_MATTE_Y, GAME_WIDTH, PRESENTATION_VIEW_HEIGHT);
    camera.setBounds(0, 0, this.currentLevel.worldWidth, PRESENTATION_VIEW_HEIGHT);
    camera.setScroll(0, 0);
    camera.setZoom(1);
    camera.setRotation(0);
  }

  private handleCharacterSwitch(): void {
    if (Phaser.Input.Keyboard.JustDown(this.controls.one)) {
      this.switchCharacter('cod');
    }

    if (Phaser.Input.Keyboard.JustDown(this.controls.two)) {
      this.switchCharacter('puffy');
    }

    const wantsTouchSwitch = this.touchInput.switchJustDown || this.switchQueuedUntil >= this.time.now;
    if (wantsTouchSwitch) {
      this.touchInput.switchJustDown = false;
      this.switchQueuedUntil = 0;
      this.switchCharacter(this.activeCharacter === 'cod' ? 'puffy' : 'cod');
    }
  }

  private switchCharacter(next: CharacterKey): void {
    if (next === this.activeCharacter) {
      return;
    }

    const previousRatio = this.health / CHARACTERS[this.activeCharacter].maxHealth;
    this.activeCharacter = next;
    const character = CHARACTERS[next];
    this.health = Math.max(1, Math.ceil(character.maxHealth * previousRatio));

    this.player.setSize(character.width, character.height);

    const body = this.getPlayerBody();
    body.setSize(character.width, character.height);
    body.setOffset(0, 0);
    body.setDragX(character.dragX);
    body.setGravityY(character.gravityY - 900);

    this.playerVisual.destroy();
    this.playerVisual = this.createCharacterVisual(next);
    this.activePowerUpStateFrame = undefined;
    this.playerLabel.setText(character.label);
    this.wasGliding = false;
    this.playSfx(AUDIO_KEYS.characterSwitch);
    this.updateHud();
  }

  private handleMovement(): void {
    const character = CHARACTERS[this.activeCharacter];
    const body = this.getPlayerBody();
    const moveSpeed = character.moveSpeed * (this.hasActiveTideRun() ? GAMEPLAY_TUNING.powerUps.tiderunner.moveSpeedMultiplier : 1) * this.getActiveEelgrassMultiplier();
    const left = this.controls.cursors.left.isDown || this.controls.wasd.left.isDown || this.touchInput.left;
    const right = this.controls.cursors.right.isDown || this.controls.wasd.right.isDown || this.touchInput.right;
    const inputNow = this.time.now;
    const wantsJump =
      Phaser.Input.Keyboard.JustDown(this.controls.cursors.up) ||
      Phaser.Input.Keyboard.JustDown(this.controls.wasd.up) ||
      Phaser.Input.Keyboard.JustDown(this.controls.space) ||
      this.touchInput.jumpJustDown ||
      this.jumpQueuedUntil >= inputNow;
    this.touchInput.jumpJustDown = false;
    if (this.jumpQueuedUntil < inputNow) {
      this.jumpQueuedUntil = 0;
    }

    if (left) {
      body.setVelocityX(-moveSpeed);
    } else if (right) {
      body.setVelocityX(moveSpeed);
    }

    if (wantsJump && body.blocked.down) {
      this.jumpQueuedUntil = 0;
      const tideJumpMultiplier = this.consumeTideLiftForJump();
      body.setVelocityY(-character.jumpSpeed * tideJumpMultiplier);
      this.wasGliding = false;
      this.playSfx(AUDIO_KEYS.jump);
    }

    const isGliding =
      this.activeCharacter === 'puffy' &&
      (this.controls.space.isDown || this.touchInput.jumpHeld) &&
      body.velocity.y > 40 &&
      !body.blocked.down;

    if (isGliding) {
      const glideMaxFallSpeed =
        this.time.now < this.tideGlideBoostUntil
          ? GAMEPLAY_TUNING.powerUps.tideLift.puffyGlideMaxFallSpeed
          : GAMEPLAY_TUNING.characters.puffy.glideMaxFallSpeed;

      if (!this.wasGliding && this.consumeTideLiftForGlide()) {
        body.setVelocityY(Math.min(body.velocity.y, GAMEPLAY_TUNING.powerUps.tideLift.puffyGlideLiftVelocity));
      }

      body.setVelocityY(Math.min(body.velocity.y, glideMaxFallSpeed));
      if (!this.wasGliding) {
        this.playSfx(AUDIO_KEYS.glide);
      }
    }

    this.wasGliding = isGliding;
    this.applyCurrentZonePush();
    this.updateCharacterAnimation(left, right);
  }

  private updateCharacterAnimation(isMovingLeft: boolean, isMovingRight: boolean): void {
    if (this.playerVisualMode !== 'sprite') {
      return;
    }

    const sprite = this.playerVisual as Phaser.GameObjects.Sprite;
    const body = this.getPlayerBody();
    const animationKeys = CHARACTER_ANIMATION_KEYS[this.activeCharacter];

    if (this.time.now < this.hurtUntil) {
      this.playCharacterAnimation(animationKeys.hurt);
      return;
    }

    if (isMovingLeft) {
      sprite.setFlipX(true);
    } else if (isMovingRight) {
      sprite.setFlipX(false);
    }

    if (!body.blocked.down) {
      const airborneKey =
        this.activeCharacter === 'puffy' && (this.controls.space.isDown || this.touchInput.jumpHeld) && body.velocity.y > 0
          ? animationKeys.fall
          : body.velocity.y < 0
            ? animationKeys.jump
            : animationKeys.fall;
      this.playCharacterAnimation(airborneKey);
      return;
    }

    this.playCharacterAnimation(isMovingLeft || isMovingRight ? animationKeys.move : animationKeys.idle);
  }

  private playCharacterAnimation(animationKey: string): void {
    if (this.playerVisualMode !== 'sprite' || !this.anims.exists(animationKey)) {
      return;
    }

    const sprite = this.playerVisual as Phaser.GameObjects.Sprite;
    if (sprite.anims.currentAnim?.key !== animationKey) {
      sprite.play(animationKey);
    }
  }

  private collectPowerUp(powerUp: PowerUpPickup): void {
    if (!powerUp.body.enable || this.isEnded) {
      return;
    }

    powerUp.collect();
    this.activatePowerUp(powerUp.kind);
    this.score += 50;
    this.updateHud();
  }

  private activatePowerUp(kind: PowerUpKind): void {
    if (kind === 'kelpShield') {
      this.kelpShieldCharges = GAMEPLAY_TUNING.powerUps.kelpShield.charges;
      this.kelpShieldExpiresAt = this.time.now + GAMEPLAY_TUNING.powerUps.kelpShield.durationMs;
      this.activePowerUpStateFrame = undefined;
      this.playSfx(AUDIO_KEYS.kelpShield);
      return;
    }

    if (kind === 'tideLift') {
      this.tideLiftExpiresAt = this.time.now + GAMEPLAY_TUNING.powerUps.tideLift.durationMs;
      this.tideGlideBoostUntil = 0;
      this.hasTideLiftCharge = true;
      this.playSfx(AUDIO_KEYS.tideLift);
      return;
    }

    if (kind === 'tiderunner') {
      this.tideRunExpiresAt = this.time.now + GAMEPLAY_TUNING.powerUps.tiderunner.durationMs;
      this.activePowerUpStateFrame = undefined;
      this.playSfx(AUDIO_KEYS.powerupPickup);
      return;
    }

    this.storySparkExpiresAt = this.time.now + GAMEPLAY_TUNING.powerUps.storySpark.durationMs;
    this.playSfx(AUDIO_KEYS.powerupPickup);
  }

  private updatePowerUpTimers(time: number): void {
    if (this.kelpShieldExpiresAt > 0 && time >= this.kelpShieldExpiresAt) {
      this.kelpShieldExpiresAt = 0;
      this.kelpShieldCharges = 0;
      this.clearPowerUpStateVisual();
      this.updateHud();
    }

    if (this.tideLiftExpiresAt > 0 && time >= this.tideLiftExpiresAt && time >= this.tideGlideBoostUntil) {
      this.tideLiftExpiresAt = 0;
      this.tideGlideBoostUntil = 0;
      this.hasTideLiftCharge = false;
    }

    if (this.storySparkExpiresAt > 0 && time >= this.storySparkExpiresAt) {
      this.storySparkExpiresAt = 0;
    }

    if (this.tideRunExpiresAt > 0 && time >= this.tideRunExpiresAt) {
      this.tideRunExpiresAt = 0;
      this.clearPowerUpStateVisual();
    }
  }

  private hasActiveTideLift(): boolean {
    return this.tideLiftExpiresAt > this.time.now || this.tideGlideBoostUntil > this.time.now;
  }

  private hasActiveStorySpark(): boolean {
    return this.storySparkExpiresAt > this.time.now;
  }

  private hasActiveTideRun(): boolean {
    return this.tideRunExpiresAt > this.time.now;
  }

  private hasActiveKelpShield(): boolean {
    return this.kelpShieldCharges > 0 && this.kelpShieldExpiresAt > this.time.now;
  }

  private consumeTideLiftForJump(): number {
    if (!this.hasTideLiftCharge || this.tideLiftExpiresAt <= this.time.now) {
      return 1;
    }

    this.hasTideLiftCharge = false;

    if (this.activeCharacter === 'puffy') {
      this.tideGlideBoostUntil = this.time.now + GAMEPLAY_TUNING.powerUps.tideLift.puffyGlideDurationMs;
      this.tideLiftExpiresAt = Math.max(this.tideLiftExpiresAt, this.tideGlideBoostUntil);
      return GAMEPLAY_TUNING.powerUps.tideLift.puffyJumpMultiplier;
    }

    this.tideLiftExpiresAt = 0;
    return GAMEPLAY_TUNING.powerUps.tideLift.codJumpMultiplier;
  }

  private consumeTideLiftForGlide(): boolean {
    if (!this.hasTideLiftCharge || this.tideLiftExpiresAt <= this.time.now) {
      return false;
    }

    this.hasTideLiftCharge = false;
    this.tideGlideBoostUntil = this.time.now + GAMEPLAY_TUNING.powerUps.tideLift.puffyGlideDurationMs;
    this.tideLiftExpiresAt = Math.max(this.tideLiftExpiresAt, this.tideGlideBoostUntil);
    return true;
  }

  private applyStorySparkAttraction(): void {
    if (!this.hasActiveStorySpark() || this.isEnded) {
      return;
    }

    const { attractionRadius, attractionStrength } = GAMEPLAY_TUNING.powerUps.storySpark;

    this.fragments.children.each((child) => {
      const fragment = child as StoryFragment;
      if (!fragment.active || !fragment.body.enable) {
        return true;
      }

      const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, fragment.x, fragment.y);
      if (distance > attractionRadius || distance < 6) {
        return true;
      }

      const pull = 1 - distance / attractionRadius;
      const step = Phaser.Math.Clamp(attractionStrength * pull, 0.004, 0.045);
      fragment.x = Phaser.Math.Linear(fragment.x, this.player.x, step);
      fragment.y = Phaser.Math.Linear(fragment.y, this.player.y, step);
      fragment.body.reset(fragment.x, fragment.y);
      return true;
    });
  }

  private updateWaterShimmers(time: number): void {
    this.waterShimmers.forEach(({ band, baseX, baseAlpha, speed, phase, drift }) => {
      const wave = Math.sin(time * speed + phase);
      band.x = baseX + wave * drift;
      band.alpha = baseAlpha + Math.max(0, wave) * 0.035;
    });
  }

  private updateBubbleVentVisual(time: number): void {
    this.ventGraphics.clear();
    const vents = this.currentLevel.bubbleVents;
    if (!vents?.length) return;

    for (const vent of vents) {
      const vx = vent.x;
      const vTop = vent.y - vent.height / 2;
      const vBottom = vent.y + vent.height / 2;
      const vHeight = vent.height;

      // Subtle upward column streaks
      const streaks = [
        { xOff: -8, width: 1.2, alpha: 0.20, phase: 0.0 },
        { xOff:  0, width: 1.0, alpha: 0.16, phase: 1.1 },
        { xOff:  8, width: 1.2, alpha: 0.18, phase: 2.3 },
      ];
      for (const s of streaks) {
        const sway = Math.sin(time * 0.0026 + s.phase) * 2.0;
        this.ventGraphics.lineStyle(s.width, 0x7fd8d5, s.alpha);
        this.ventGraphics.lineBetween(vx + s.xOff - sway, vBottom, vx + s.xOff + sway, vTop + 12);
      }

      // Rising bubbles looping from bottom to top
      const bubbles = [
        { xOff: -10, speed: 0.0018, phase: 0.00 },
        { xOff:   6, speed: 0.0022, phase: 0.38 },
        { xOff:  -4, speed: 0.0015, phase: 0.71 },
        { xOff:  11, speed: 0.0019, phase: 0.15 },
      ];
      this.ventGraphics.fillStyle(0x9ee8e4, 0.62);
      for (const b of bubbles) {
        const cycle = (time * b.speed + b.phase) % 1.0;
        const bx = vx + b.xOff;
        const by = vBottom - cycle * vHeight;
        const r = Math.max(1, 2.6 - cycle * 0.8);
        this.ventGraphics.fillCircle(bx, by, r);
      }

      // Base shimmer at vent mouth
      const shimAlpha = 0.26 + Math.sin(time * 0.0032) * 0.09;
      this.ventGraphics.lineStyle(2, 0xc5f5ee, shimAlpha);
      this.ventGraphics.lineBetween(vx - 18, vBottom + 3, vx + 18, vBottom + 3);
    }
  }

  private updateScuttleclaws(): void {
    this.scuttleclaws.children.each((child) => {
      (child as Scuttleclaw).updatePatrol();
      return true;
    });
  }

  private handleScuttleclawContact(scuttleclaw: Scuttleclaw): void {
    if (!scuttleclaw.active || !scuttleclaw.body.enable || this.isEnded) {
      return;
    }

    if (this.isStompingScuttleclaw(scuttleclaw)) {
      scuttleclaw.defeat();
      this.playSfx(AUDIO_KEYS.scuttleclawStomp);
      this.getPlayerBody().setVelocityY(-235);
      return;
    }

    this.damagePlayer(scuttleclaw.damage);
  }

  private handleHazardContact(hazard: HazardZone): void {
    if (hazard.kind === 'water' && this.hasActiveTideRun()) {
      return;
    }

    this.damagePlayer(hazard.damage);
  }

  private handleBubbleVentContact(ventIndex: number): void {
    if (!this.isRunStarted || this.isEnded) return;

    const vent = this.currentLevel.bubbleVents?.[ventIndex];
    if (!vent) return;

    const body = this.getPlayerBody();
    if (body.blocked.down) return;

    const now = this.time.now;
    if (now - this.bubbleVentBoostAt < this.BUBBLE_VENT_BOOST_COOLDOWN_MS) return;

    if (body.velocity.y > -vent.boostVelocity) {
      body.setVelocityY(-vent.boostVelocity);
      this.bubbleVentBoostAt = now;
    }
  }

  private handleBossContact(): void {
    const boss = this.lordMalefacto;
    if (!boss || boss.isDefeated() || this.isEnded) {
      return;
    }

    if (this.isStompingBoss(boss)) {
      const didDefeatBoss = boss.takeHit(this.time.now);
      const bounceDirection = this.player.x < boss.x ? -1 : 1;
      this.getPlayerBody().setVelocity(bounceDirection * 125, -270);
      this.playSfx(AUDIO_KEYS.malefactoStompHit);
      this.cameras.main.shake(90, 0.003);
      if (didDefeatBoss) {
        this.endLevel(true);
      }
      return;
    }

    this.damagePlayer(boss.damage);
  }

  private handleBossFlareContact(): void {
    const boss = this.lordMalefacto;
    if (!boss || !boss.isAttackActive()) {
      return;
    }

    this.damagePlayer(boss.damage);
  }

  private isStompingBoss(boss: LordMalefacto): boolean {
    if (!boss.isVulnerable()) {
      return false;
    }

    const playerBody = this.getPlayerBody();
    const bossBody = boss.body;
    const playerBottom = playerBody.y + playerBody.height;
    const bossTop = bossBody.y;
    const playerCenterY = playerBody.y + playerBody.height * 0.5;
    const bossUpperBody = bossBody.y + bossBody.height * 0.72;
    const stompDepth = bossBody.height * 0.72;

    return playerBody.velocity.y > 35 && playerCenterY < bossUpperBody && playerBottom <= bossTop + stompDepth;
  }

  private isStompingScuttleclaw(scuttleclaw: Scuttleclaw): boolean {
    const playerBody = this.getPlayerBody();
    const enemyBody = scuttleclaw.body;
    const playerBottom = playerBody.y + playerBody.height;
    const enemyTop = enemyBody.y;

    return playerBody.velocity.y > 80 && this.player.y < scuttleclaw.y && playerBottom <= enemyTop + 16;
  }

  private collectFragment(fragment: StoryFragment): void {
    if (!fragment.body.enable || this.isEnded) {
      return;
    }

    fragment.collect();
    this.collectedFragments += 1;
    this.score += 100;
    this.playSfx(AUDIO_KEYS.collectFragment);
    this.updateHud();
  }

  private damagePlayer(amount: number): void {
    if (this.isEnded || this.time.now - this.lastDamageAt < DAMAGE_COOLDOWN_MS) {
      return;
    }

    this.lastDamageAt = this.time.now;
    this.hurtUntil = this.time.now + 220;

    if (this.hasActiveKelpShield()) {
      this.kelpShieldCharges -= 1;
      this.kelpShieldExpiresAt = 0;
      if (this.kelpShieldCharges <= 0) {
        this.clearPowerUpStateVisual();
      }
      this.cameras.main.shake(90, 0.003);
      this.playerVisual.setAlpha(0.78);
      this.time.delayedCall(140, () => this.playerVisual.setAlpha(1));
      this.updateHud();
      return;
    }

    this.health -= amount;
    this.playSfx(AUDIO_KEYS.hazardHit);
    this.cameras.main.shake(130, 0.006);
    this.playCharacterAnimation(CHARACTER_ANIMATION_KEYS[this.activeCharacter].hurt);
    this.playerVisual.setAlpha(0.55);
    this.time.delayedCall(160, () => this.playerVisual.setAlpha(1));

    if (this.health <= 0) {
      this.endLevel(false);
      return;
    }

    const direction = this.player.x > this.currentLevel.endX / 2 ? -1 : 1;
    this.getPlayerBody().setVelocity(direction * -150, -250);
    this.updateHud();
  }

  private checkFallOut(): void {
    if (this.player.y > GAME_HEIGHT + 80) {
      this.health = 0;
      this.endLevel(false);
      return;
    }

    if (!this.currentLevel.boss && this.player.x >= this.currentLevel.endX - 26) {
      if (this.collectedFragments >= this.currentLevel.requiredFragments) {
        this.endLevel(true);
      } else {
        this.messageText.setText(this.getIncompleteEndpointMessage());
        this.messagePanel.setVisible(true);
        this.time.delayedCall(900, () => {
          if (!this.isEnded) {
            this.messageText.setText('');
            this.messagePanel.setVisible(false);
          }
        });
      }
    }
  }

  private endLevel(didWin: boolean): void {
    this.isEnded = true;
    this.didWinLevel = didWin;
    this.levelEndedAt = this.time.now;
    const body = this.getPlayerBody();
    body.setVelocity(0, 0);
    body.setAllowGravity(false);
    this.score += didWin ? 500 : 0;
    this.playSfx(didWin ? AUDIO_KEYS.levelComplete : AUDIO_KEYS.gameOver);
    this.updateHud();

    if (didWin && this.shouldPlayBossTransition()) {
      this.startBossTransition();
      return;
    }

    const hasNextLevel = this.hasNextLevel();
    const completionLabel = this.getCompletionLevelLabel();

    const summaryLines = didWin
      ? this.getLevelCompleteSummaryLines(hasNextLevel, completionLabel)
      : [
          'GAME OVER',
          '',
          'The tide got the better of you.',
          ...(this.currentLevel.totalFragments > 0 ? [`Tide Relics: ${this.collectedFragments}/${this.currentLevel.totalFragments}`] : []),
          `Score: ${this.score}`,
          '',
          'R / TAP: Try Again',
        ];

    this.applyEndMessageLayout(didWin);
    this.messageText.setText(summaryLines.join('\n'));
    this.hudPanel.setVisible(false);
    this.hudTitleText.setVisible(false);
    this.hudStatsText.setVisible(false);
    this.hudHintText.setVisible(false);
    this.messagePanel.setVisible(true);
  }

  private applyEndMessageLayout(didWin: boolean): void {
    if (didWin && this.currentLevel.secretLevel === true) {
      this.applyCalvinCompletionMessageLayout();
      return;
    }

    const overlayY = this.isMobileLayout ? 185 : 206;
    const overlayW = this.isMobileLayout ? 576 : 560;
    const overlayH = this.isMobileLayout ? 210 : 200;
    const overlayFontSize = this.isMobileLayout ? '15px' : '19px';

    this.messagePanel.setPosition(GAME_WIDTH / 2, overlayY);
    this.messagePanel.setSize(overlayW, overlayH);
    this.messageText.setPosition(GAME_WIDTH / 2, overlayY);
    this.messageText.setFontSize(overlayFontSize);
    this.messageText.setLineSpacing(5);
  }

  private applyCalvinCompletionMessageLayout(): void {
    const overlayY = this.isMobileLayout ? 196 : 216;
    const overlayW = this.isMobileLayout ? 592 : 584;
    const overlayH = this.isMobileLayout ? 234 : 240;
    const fontSize = this.isMobileLayout ? '14px' : '16px';

    this.messagePanel.setPosition(GAME_WIDTH / 2, overlayY);
    this.messagePanel.setSize(overlayW, overlayH);
    this.messageText.setPosition(GAME_WIDTH / 2, overlayY + 4);
    this.messageText.setFontSize(fontSize);
    this.messageText.setLineSpacing(2);
  }

  private getIncompleteEndpointMessage(): string {
    if (this.currentLevel.secretLevel === true) {
      return 'The door is still missing pieces.';
    }

    return `Need ${this.currentLevel.requiredFragments - this.collectedFragments} more Tide Relic(s).`;
  }

  private getLevelCompleteSummaryLines(hasNextLevel: boolean, completionLabel: string): string[] {
    const restartLines = hasNextLevel
      ? ['ENTER / TAP: Next Level', 'R: Replay']
      : (this.isDirectTestLevel ? ['R / TAP: Run Again'] : ['R / TAP: Restart Run']);

    if (this.currentLevel.secretLevel === true) {
      return [
        'SKETCHBOOK COMPLETE',
        '',
        'Every creature made it home.',
        `Sketches: ${this.collectedFragments}/${this.currentLevel.totalFragments}`,
        'Sucka Free',
        `Time: ${this.formatSeconds(this.getElapsedSeconds())}`,
        `Score: ${this.score}`,
        '',
        ...restartLines,
      ];
    }

    return [
      hasNextLevel ? `${completionLabel} Cleared` : 'DEMO COMPLETE',
      '',
      ...(hasNextLevel ? [] : [this.isDirectTestLevel ? `${completionLabel} complete.` : 'Run complete.']),
      ...(this.currentLevel.totalFragments > 0 ? [`Tide Relics: ${this.collectedFragments}/${this.currentLevel.totalFragments}`] : []),
      `Time: ${this.formatSeconds(this.getElapsedSeconds())}`,
      `Score: ${this.score}`,
      '',
      ...restartLines,
    ];
  }

  private shouldPlayBossTransition(): boolean {
    const nextLevel = LEVELS[this.currentLevelIndex + 1];
    return !this.isTransitioningToBoss && Boolean(nextLevel?.boss);
  }

  private startBossTransition(): void {
    this.isTransitioningToBoss = true;
    this.messagePanel.setVisible(false);
    this.messageText.setText('');

    if (!this.textures.exists(TEXTURE_KEYS.level04LockTransition)) {
      this.advanceToNextLevel();
      return;
    }

    this.playSfx(AUDIO_KEYS.canalBoatTransition);

    const camera = this.cameras.main;
    const transitionImage = this.add.image(GAME_WIDTH / 2, GAME_HEIGHT / 2, TEXTURE_KEYS.level04LockTransition);
    const source = this.textures.get(TEXTURE_KEYS.level04LockTransition).getSourceImage() as HTMLImageElement;
    const coverScale = Math.max(GAME_WIDTH / source.width, GAME_HEIGHT / source.height);
    transitionImage
      .setScrollFactor(0)
      .setDepth(1200)
      .setScale(coverScale)
      .setAlpha(0);

    const flash = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0xe9f7ff, 0);
    flash.setScrollFactor(0);
    flash.setDepth(1201);

    this.tweens.add({
      targets: transitionImage,
      alpha: 1,
      scale: coverScale * 1.045,
      x: GAME_WIDTH / 2 - 18,
      duration: 2900,
      ease: 'Sine.easeInOut',
      onComplete: () => {
        this.tweens.add({
          targets: flash,
          alpha: 0.86,
          duration: 115,
          yoyo: true,
          ease: 'Sine.easeOut',
          onComplete: () => {
            camera.fadeOut(180, 233, 247, 255);
            this.time.delayedCall(210, () => this.advanceToNextLevel());
          },
        });
      },
    });
  }

  private updateHud(): void {
    const character = CHARACTERS[this.activeCharacter];
    const characterLabel = this.getHudCharacterLabel();
    const collectibleLabel = this.getCollectibleHudLabel();

    if (this.isMobileLayout) {
      const powerText = this.getPowerStatusText();
      const powerSuffix = powerText !== "NONE" ? `  PWR ${powerText}` : "";
      this.hudStatsText.setText(
        `${characterLabel}  HP ${Math.max(0, this.health)}/${character.maxHealth}  ${collectibleLabel} ${this.collectedFragments}/${this.currentLevel.requiredFragments}${powerSuffix}`,
      );
      return;
    }

    this.hudTitleText.setText(this.getHudTitleText());
    this.hudHintText.setText(this.getHudSwitchHintText());
    this.hudStatsText.setText(
      [
        `CHAR ${characterLabel}   HP ${Math.max(0, this.health)}/${character.maxHealth}   ${collectibleLabel} ${this.collectedFragments}/${this.currentLevel.requiredFragments} REQUIRED   TOTAL ${this.currentLevel.totalFragments}`,
        `POWER ${this.getPowerStatusText()}`,
        `SCORE ${this.score}   TIME ${this.formatSeconds(this.getElapsedSeconds())}${this.currentLevel.boss ? '   BOSS MALEFACTO' : ''}`,
      ].join('\n'),
    );
  }

  private getHudCharacterLabel(): string {
    if (this.currentLevel.secretLevel === true) {
      return this.activeCharacter === 'cod' ? 'EARTH EYES BART' : 'RED BART';
    }

    return CHARACTERS[this.activeCharacter].label;
  }

  private getHudTitleText(): string {
    return this.currentLevel.secretLevel === true ? "CALVIN'S CREATURE ROOM" : 'COD B\u2019Y & PUFFY: SHORELINE RUN';
  }

  private getHudSwitchHintText(): string {
    return this.currentLevel.secretLevel === true ? '1 Earth Eyes | 2 Red Bart | R Restart' : '1 Cod B\u2019y | 2 Puffy | R Restart';
  }

  private getCollectibleHudLabel(): string {
    return this.currentLevel.secretLevel === true ? 'SKETCH' : 'RELIC';
  }

  private getElapsedSeconds(): number {
    if (this.levelStartedAt <= 0) {
      return 0;
    }

    const endTime = this.levelEndedAt > 0 ? this.levelEndedAt : this.time.now;
    return Math.max(0, Math.floor((endTime - this.levelStartedAt) / 1000));
  }

  private formatSeconds(totalSeconds: number): string {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  private getPowerStatusText(): string {
    const states: string[] = [];

    if (this.hasActiveKelpShield()) {
      states.push(`KELP SHIELD ${this.getRemainingSeconds(this.kelpShieldExpiresAt)}`);
    }

    if (this.hasActiveTideLift()) {
      states.push(`TIDE LIFT ${this.getRemainingSeconds(Math.max(this.tideLiftExpiresAt, this.tideGlideBoostUntil))}`);
    }

    if (this.hasActiveStorySpark()) {
      states.push(`RELIC MAGNET ${this.getRemainingSeconds(this.storySparkExpiresAt)}`);
    }

    if (this.hasActiveTideRun()) {
      states.push(`TIDERUNNER ${this.getRemainingSeconds(this.tideRunExpiresAt)}`);
    }

    return states.length > 0 ? states.join(' | ') : 'NONE';
  }

  private getRemainingSeconds(expiresAt: number): string {
    return `${Math.max(0, Math.ceil((expiresAt - this.time.now) / 1000))}s`;
  }

  private syncPlayerDecorations(): void {
    if (this.playerVisualMode === 'sprite') {
      this.playerVisual.setPosition(this.player.x, this.getPlayerFootY());
    } else {
      this.playerVisual.setPosition(this.player.x, this.player.y);
    }
    this.syncPowerUpStateVisual();
    this.playerLabel.setPosition(this.player.x, this.player.y - this.player.height / 2 - 10);
    this.syncPowerIndicators();
    this.endMarkerText.setAlpha(this.collectedFragments >= this.currentLevel.requiredFragments ? 1 : 0.45);
    this.endMarker.setAlpha(this.collectedFragments >= this.currentLevel.requiredFragments ? 1 : 0.55);
    this.endMarkerVisual.setAlpha(this.collectedFragments >= this.currentLevel.requiredFragments ? 1 : 0.55);
  }

  private createPowerUpStateVisual(): Phaser.GameObjects.Sprite | undefined {
    if (!this.textures.exists(TEXTURE_KEYS.powerUpStatesAtlas) || !this.cache.json.get(TEXTURE_KEYS.powerUpStatesAtlasMeta)) {
      return undefined;
    }

    const sprite = this.add.sprite(this.player.x, this.getPlayerFootY(), TEXTURE_KEYS.powerUpStatesAtlas, 0);
    sprite.setOrigin(0.5, 1);
    sprite.setDepth(21);
    sprite.setVisible(false);
    return sprite;
  }

  private syncPowerUpStateVisual(): void {
    if (!this.powerUpStateVisual) {
      this.playerVisual.setVisible(true);
      return;
    }

    const frameName = this.getActivePowerUpStateFrameName();
    if (!frameName) {
      this.clearPowerUpStateVisual();
      return;
    }

    const frameIndex = this.getPowerUpStateFrameIndex(frameName);
    if (frameIndex === undefined) {
      this.clearPowerUpStateVisual();
      return;
    }

    if (this.activePowerUpStateFrame !== frameName) {
      this.powerUpStateVisual.setFrame(frameIndex);
      this.powerUpStateVisual.setScale(this.getPowerUpStateVisualScale());
      this.activePowerUpStateFrame = frameName;
    }

    this.powerUpStateVisual.setPosition(this.player.x, this.getPlayerFootY());
    this.powerUpStateVisual.setFlipX(this.playerVisualMode === 'sprite' && (this.playerVisual as Phaser.GameObjects.Sprite).flipX);
    this.powerUpStateVisual.setVisible(true);
    this.playerVisual.setVisible(false);
  }

  private clearPowerUpStateVisual(): void {
    this.powerUpStateVisual?.setVisible(false);
    this.activePowerUpStateFrame = undefined;
    this.playerVisual.setVisible(true);
  }

  private getActivePowerUpStateFrameName(): string | undefined {
    const prefix = this.activeCharacter === 'cod' ? 'codby' : 'puffy';

    if (this.hasActiveKelpShield()) {
      return `${prefix}_kelpshield`;
    }

    if (this.hasActiveTideRun()) {
      return `${prefix}_tiderunner`;
    }

    if (this.hasActiveStorySpark()) {
      return `${prefix}_fragmagnet`;
    }

    return undefined;
  }

  private getPowerUpStateFrameIndex(frameName: string): number | undefined {
    const meta = this.cache.json.get(TEXTURE_KEYS.powerUpStatesAtlasMeta) as PowerUpStateAtlasMeta | undefined;
    if (!meta || meta.cellWidth !== 256 || meta.cellHeight !== 256 || !this.textures.exists(TEXTURE_KEYS.powerUpStatesAtlas)) {
      return undefined;
    }

    const frame = meta.frames.find((candidate) => candidate.name === frameName);
    if (!frame) {
      return undefined;
    }

    return this.getAtlasFrameIndex(meta, frame);
  }

  private getPowerUpStateVisualScale(): number {
    return this.activeCharacter === 'cod' ? 0.38 : 0.34;
  }

  private syncPowerIndicators(): void {
    const footY = this.getPlayerFootY();
    const hasTide = this.hasActiveTideLift();
    const hasSpark = this.hasActiveStorySpark();

    this.tideLiftGraphics.clear();
    if (hasTide) {
      const t = this.time.now;
      const px = this.player.x;

      const streaks = [
        { xOff: -13, height: 42, width: 2.4, alpha: 0.48, phase: 0.0 },
        { xOff: 0, height: 50, width: 2.0, alpha: 0.36, phase: 1.3 },
        { xOff: 13, height: 38, width: 2.4, alpha: 0.44, phase: 2.1 },
      ];
      for (const streak of streaks) {
        const sway = Math.sin(t * 0.004 + streak.phase) * 2.4;
        this.tideLiftGraphics.lineStyle(streak.width, 0x67c6c2, streak.alpha);
        this.tideLiftGraphics.lineBetween(
          px + streak.xOff - sway * 0.25,
          footY - 2,
          px + streak.xOff + sway,
          footY - streak.height,
        );
      }

      this.tideLiftGraphics.lineStyle(1.2, 0xc5f5ee, 0.25);
      const foamXs = [-11, -3, 6];
      for (let i = 0; i < foamXs.length; i++) {
        const fw = Math.sin(t * 0.0022 + i * 2.0);
        this.tideLiftGraphics.lineBetween(px + foamXs[i] - 3, footY - 2 + fw, px + foamXs[i] + 4, footY - 5 + fw);
      }

      const bubbleDefs = [
        { xOff: -16, speed: 0.0018, phase: 0.00 },
        { xOff:   8, speed: 0.0022, phase: 0.30 },
        { xOff:  -6, speed: 0.0015, phase: 0.60 },
        { xOff:  16, speed: 0.0020, phase: 0.15 },
        { xOff:   0, speed: 0.0025, phase: 0.80 },
      ];
      this.tideLiftGraphics.fillStyle(0x7fd8d5, 0.68);
      for (const b of bubbleDefs) {
        const cycle = (t * b.speed + b.phase) % 1.0;
        const bx = px + b.xOff;
        const by = footY - 4 - cycle * 46;
        const r = Math.max(1, 2.8 - cycle * 0.6);
        this.tideLiftGraphics.fillCircle(bx, by, r);
      }
    }

    this.sparkIndicator.setPosition(this.player.x, footY - 22);
    this.sparkIndicator.setVisible(hasSpark);
  }

  private getPlayerBody(): Phaser.Physics.Arcade.Body {
    return this.player.body as Phaser.Physics.Arcade.Body;
  }

  private hasTexture(textureKey: string): boolean {
    return this.textures.exists(textureKey);
  }

  private toggleDebugHitboxes(): void {
    this.areDebugHitboxesVisible = !this.areDebugHitboxesVisible;
    this.debugGraphics.setVisible(this.areDebugHitboxesVisible);
    this.drawDebugHitboxes();
  }

  private drawDebugHitboxes(): void {
    this.debugGraphics.clear();

    if (!this.areDebugHitboxesVisible) {
      return;
    }

    this.drawBodyRect(this.getPlayerBody(), 0xf1d65c);

    this.platforms.children.each((child) => {
      const body = (child as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.StaticBody | undefined;
      if (body) {
        this.drawBodyRect(body, 0x7fd0ff);
      }
      return true;
    });

    this.hazards.children.each((child) => {
      const body = (child as Phaser.GameObjects.GameObject).body as Phaser.Physics.Arcade.StaticBody | undefined;
      if (body) {
        this.drawBodyRect(body, 0xff5f5f);
      }
      return true;
    });

    this.fragments.children.each((child) => {
      const fragment = child as StoryFragment;
      if (fragment.active && fragment.body.enable) {
        this.drawBodyRect(fragment.body, 0x9dff8f);
      }
      return true;
    });

    this.powerUps.children.each((child) => {
      const powerUp = child as PowerUpPickup;
      if (powerUp.active && powerUp.body.enable) {
        this.drawBodyRect(powerUp.body, 0xcfa7ff);
      }
      return true;
    });

    this.scuttleclaws.children.each((child) => {
      const scuttleclaw = child as Scuttleclaw;
      if (scuttleclaw.active && scuttleclaw.body.enable) {
        this.drawBodyRect(scuttleclaw.body, 0xff8a5c);
      }
      return true;
    });

    this.ventZones.forEach((zone) => {
      const body = zone.body as Phaser.Physics.Arcade.StaticBody | undefined;
      if (body) {
        this.drawBodyRect(body, 0x7fd8d5);
      }
    });

    if (this.chalkTrigger?.body) {
      this.drawBodyRect(this.chalkTrigger.body as Phaser.Physics.Arcade.StaticBody, 0xd8ddd2);
    }

    (this.currentLevel.eelgrassZones ?? []).forEach((zone) => {
      this.debugGraphics.fillStyle(0x44ff44, 0.10);
      this.debugGraphics.fillRect(zone.x - zone.width / 2, zone.y - zone.height / 2, zone.width, zone.height);
      this.debugGraphics.lineStyle(3, 0x44ff44, 1.0);
      this.debugGraphics.strokeRect(zone.x - zone.width / 2, zone.y - zone.height / 2, zone.width, zone.height);
    });

    (this.currentLevel.currentZones ?? []).forEach((zone) => {
      this.debugGraphics.fillStyle(0x00d0f0, 0.10);
      this.debugGraphics.fillRect(zone.x - zone.width / 2, zone.y - zone.height / 2, zone.width, zone.height);
      this.debugGraphics.lineStyle(2, 0x00d0f0, 0.90);
      this.debugGraphics.strokeRect(zone.x - zone.width / 2, zone.y - zone.height / 2, zone.width, zone.height);
    });

    if (this.lordMalefacto?.active && this.lordMalefacto.body.enable) {
      this.drawBodyRect(this.lordMalefacto.body, 0xd19745);
      const flareBody = this.lordMalefacto.getFlareZone().body as Phaser.Physics.Arcade.Body | undefined;
      if (flareBody?.enable) {
        this.drawBodyRect(flareBody, 0xff6f32);
      }
    }

    this.debugGraphics.lineStyle(2, 0x9fb1a7, 0.9);
    this.debugGraphics.strokeRect(this.currentLevel.startX - 46, GROUND_Y - 76, 92, 76);
    this.debugGraphics.lineStyle(2, 0xffd36e, 1);
    this.debugGraphics.strokeRect(this.currentLevel.endX - 26, GROUND_Y - 132, 52, 140);
  }

  private drawBodyRect(body: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody, color: number): void {
    this.debugGraphics.lineStyle(2, color, 1);
    this.debugGraphics.strokeRect(body.x, body.y, body.width, body.height);
  }

  private getPlayerFootY(): number {
    return this.player.y + this.player.height / 2 + 1;
  }
}
