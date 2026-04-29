# Cod B'y & Puffy: Shoreline Run

Private playable demo prototype for a small browser game connected to the Atlantic Cinematic Universe. This is a polished proof of the shoreline run loop, not the full game.

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open the local Vite URL shown in the terminal.

## Build

```bash
npm run build
```

## Controls

- Enter or Space on title screen: start run
- Arrow keys or WASD: move
- Space: jump
- 1: switch to Cod B'y
- 2: switch to Puffy
- R: restart level

Audio and debug:

- H: toggle debug hitbox overlay
- M: toggle music
- N: toggle sound effects

The in-game controls line is: `1 Cod B’y | 2 Puffy | H Debug | M Music | N SFX`.

## Current Game Loop

Start on the shoreline as Cod B'y, move across ground and simple dock platforms, avoid water and hazard shapes, collect story fragments, and reach the end marker. The level is won after reaching the end with at least 8 of 10 fragments. Health loss from hazards can trigger a game-over state, and the level can be restarted at any time.

Cod B'y is slower, heavier, and tougher. Puffy is quicker, lighter, lower-health, and has a short glide placeholder while holding Space during a fall.

The current backdrop uses the St. Peters Canal image when available, with procedural placeholder scenery kept as a fallback. Cod B'y and Puffy use cleaned transparent sprite atlases over simple hidden arcade hitboxes.

## Presentation Flow

Prototype 1.3 uses a clean title/start screen with demo-ready copy. The level is built behind the presentation overlay, but movement is gated until the player presses `Enter` or `Space`. The first start input does not trigger an immediate jump.

The HUD shows `CHAR`, `HP`, `FRAGS`, `POWER`, `SCORE`, `TIME`, and a compact controls line. Win presentation shows a level-complete summary with CH 8 arrival, fragments collected, completion time, score, and a run-again prompt. Loss presentation shows a restrained game-over message with fragments collected, score, and a try-again prompt.

## Environmental Polish

Prototype 1.4 adds restrained environmental motion without changing gameplay. Prototype 1.4.1 cleaned up the visible geometry from that pass:

- Subtle horizontal water shimmer bands drift across the canal area.
- Distant depth now uses low-opacity mist and soft shoreline silhouettes instead of geometric triangle shapes.
- Foreground shoreline texture uses slightly stronger parallax while staying behind gameplay objects.
- The START marker is hidden during normal play and appears only as a debug outline when `H` is enabled.

These effects are procedural, low-alpha, and lightweight. They do not affect collision, hazards, collectibles, power-ups, audio, restart, or win/loss logic.

## Demo Status

Current private demo includes:

- One playable shoreline level with real backdrop, character sprites, prop assets, power-up icons, music, and SFX.
- Title/start screen, HUD, level-complete overlay, game-over overlay, restart flow, and development hitbox toggle.
- Three power-ups: Kelp Shield, Tide Lift, and Story Spark.

Suggested private demo deployment path:

1. Run `npm run build`.
2. Upload the generated `dist/` folder to a private static host such as an unlisted Netlify/Vercel site, an internal web server, or a private itch.io draft page.
3. Share the private URL with testers and ask them to use a desktop browser with keyboard controls.

Prototype 1.3.1 keeps `public/assets` limited to runtime demo assets. Raw sheets, frame exports, preview images, ZIPs, preprocessing scripts, and asset-prep notes live under `dev_assets/public_assets` so they are preserved without being copied into `dist`.

## Power-Ups

Prototype 1.1 adds three lightweight power-ups to the current shoreline level:

- Kelp Shield: absorbs one hazard hit, then disappears.
- Tide Lift: gives Cod B'y a slightly stronger next jump, and gives Puffy a modest boosted jump/glide window.
- Story Spark: briefly and gently attracts nearby story fragments toward the player.

Power-ups are collected by touching them. They do not add inventory, menus, projectiles, combat, or new controls. Active states are shown in the HUD power line, with subtle player indicators while an effect is active. Power-up pickup zones appear in the `H` debug hitbox overlay.

Active power-up icon paths:

- `public/assets/props/kelp_shield_icon.png`
- `public/assets/props/tide_lift_icon.png`
- `public/assets/props/story_spark_icon.png`

Prototype 1.2.2b verified these files as 512 x 512 RGBA PNGs with real alpha transparency and no baked checkerboard. They are now active runtime pickup icons. If any icon texture is missing or fails to load later, the game falls back to the procedural pickup icon for that specific power-up.

## Visual Cleanup Notes

Prototype 0.5 removed an unwanted semi-transparent blue block from gameplay. The cause was the old procedural `createMidgroundWater()` fallback layer: a large blue-green rectangle was still being drawn over the real backdrop. It now only renders when the real backdrop is unavailable.

Obstacle visuals were also upgraded:

- Hazard hitboxes are invisible physics zones with separate readable visuals.
- Water-edge hazards now read as canal/dock gaps with wave highlights.
- Rock hazards use rough shoreline stone shapes.
- Maritime debris hazards use broken wharf/rope silhouettes.
- Platforms have weathered dock planks, posts, and shoreline surface details.
- Story fragments now read as tied parchment/map scraps.
- The end marker now uses a channel-marker/beacon visual instead of a generic rectangle.

## Feel And Timing Notes

Prototype 0.6 tuned sprite timing and readability while preserving the same gameplay systems.

Animation timing:

- Cod B'y idle: `3 fps`
- Cod B'y walk: `7 fps`
- Cod B'y jump/fall: `5 fps`
- Cod B'y hurt: `8 fps`
- Puffy idle: `5 fps`
- Puffy run: `12 fps`
- Puffy jump: `8 fps`
- Puffy glide: `7 fps`
- Puffy hurt: `10 fps`

Scale and anchoring:

- Cod B'y sprite scale increased from `0.28` to `0.30`.
- Puffy sprite scale reduced from `0.29` to `0.27`.
- Sprite foot anchoring was tightened so characters sit closer to platform tops.

Hitbox and readability changes:

- Player hitboxes remain Cod B'y `42 x 62` and Puffy `32 x 48`.
- Story fragment pickup overlap increased from `22 x 30` to `28 x 36`.
- Hurt animation lock reduced to `220 ms`.
- Water gaps, rocks, and debris received brighter edge/readability cues.
- End marker label simplified from `CHANNEL 8` to `CH 8`.

## Debug And Tuning

Press `H` during development to toggle hitbox outlines. The overlay is off by default and shows only simple outlines for the player, platforms, hazards, story-fragment pickup zones, and end marker trigger zone.

Core tuning values live in [src/config/tuning.ts](</C:/Users/me/OneDrive/Documents/New project/src/config/tuning.ts>). This includes movement speed, jump velocity, gravity, Puffy glide fall speed, hitbox sizes, collectible pickup size, hazard damage/cooldown, sprite scale, and animation frame rates.

Audio tuning also lives in [src/config/tuning.ts](</C:/Users/me/OneDrive/Documents/New project/src/config/tuning.ts>). Current defaults are music volume `0.25`, SFX volume `0.45`, music enabled, and SFX enabled.

Power-up placements and behavior tuning also live in [src/config/tuning.ts](</C:/Users/me/OneDrive/Documents/New project/src/config/tuning.ts>). Current tuning includes pickup size, level placements, Kelp Shield charge count, Tide Lift jump/glide values, and Story Spark duration/radius/strength.

## Audio Integration

Prototype 1.0.1 uses the shoreline loop from the dedicated music folder and SFX from the SFX folder.

Active audio paths:

- `public/assets/audio/music/shoreline_theme_loop.wav`
- `public/assets/audio/sfx/jump.wav`
- `public/assets/audio/sfx/glide.wav`
- `public/assets/audio/sfx/collect_fragment.wav`
- `public/assets/audio/sfx/hazard_hit.wav`
- `public/assets/audio/sfx/character_switch.wav`
- `public/assets/audio/sfx/level_complete.wav`
- `public/assets/audio/sfx/game_over.wav`
- `public/assets/audio/sfx/powerup_pickup.wav`
- `public/assets/audio/sfx/kelp_shield.wav`
- `public/assets/audio/sfx/tide_lift.wav`

The game starts or resumes background music only after the first player input so browser autoplay restrictions do not block gameplay. `M` toggles music and `N` toggles SFX, including power-up sounds.

Prototype 1.3.2 audio audit:

- Runtime music is still `public/assets/audio/music/shoreline_theme_loop.wav` at about 8.5 MB.
- Runtime SFX remain WAV files and are small enough for the private demo.
- No local MP3/OGG encoder was available during this pass, so compression was deferred rather than adding a heavy dependency.

Recommended local compression command:

```bash
ffmpeg -i public/assets/audio/music/shoreline_theme_loop.wav -codec:a libmp3lame -b:a 128k public/assets/audio/music/shoreline_theme_loop.mp3
```

After verifying playback, preserve the original WAV outside runtime assets and update [src/config/constants.ts](</C:/Users/me/OneDrive/Documents/New project/src/config/constants.ts>) to load `assets/audio/music/shoreline_theme_loop.mp3`:

```bash
mkdir -p dev_assets/audio_originals
mv public/assets/audio/music/shoreline_theme_loop.wav dev_assets/audio_originals/
```

## Prop Asset Integration

Prototype 0.8 integrates optional final prop PNGs. The game loads and uses these prop textures when available:

- `public/assets/props/dock_plank_platform.png`
- `public/assets/props/broken_wharf_hazard.png`
- `public/assets/props/rock_hazard.png`
- `public/assets/props/rope_debris_hazard.png`
- `public/assets/props/story_fragment.png`
- `public/assets/props/ch8_beacon_marker.png`

If any prop texture is missing or fails to load, the procedural Phaser shape fallback remains active for that object. Collision, hazards, collectibles, win state, and the `H` debug hitbox overlay continue to use the same hidden physics zones either way.

## Runtime Asset Folder Structure

```text
public/
  assets/
    backgrounds/
      st_peters_canal.png
    sprites/
      codby/
        codby_atlas_v1.png
        codby_atlas_v1.json
      puffy/
        puffy_atlas_v1.png
        puffy_atlas_v1.json
    props/
      dock_plank_platform.png
      broken_wharf_hazard.png
      rock_hazard.png
      rope_debris_hazard.png
      story_fragment.png
      ch8_beacon_marker.png
      kelp_shield_icon.png
      tide_lift_icon.png
      story_spark_icon.png
    audio/
      music/
        shoreline_theme_loop.wav
      sfx/
        jump.wav
        glide.wav
        collect_fragment.wav
        hazard_hit.wav
        character_switch.wav
        level_complete.wav
        game_over.wav
        powerup_pickup.wav
        kelp_shield.wav
        tide_lift.wav
```

Files in `public/assets` are served directly by Vite and copied into `dist/assets` by the custom build script.

## Development Assets

Non-runtime art intake files are preserved outside the public runtime path:

```text
dev_assets/
  public_assets/
    public/
      assets/
        props/
          acu_powerup_icons_transparent_v1.zip
          alpha_magenta_preview.jpg
          README*.md
        sprites/
          codby/frames/
          puffy/frames/
          *_sprite_sheet_v1*.png
          *_magenta_preview.jpg
          README_ASSET_PREP.md
          remove_checkerboard_and_extract_frames.py
```

These files are useful for future art prep, but are intentionally not shipped in the private demo build.

## Current Art Status

- `public/assets/backgrounds/st_peters_canal.png`: integrated as the first real background.
- `public/assets/sprites/codby/codby_atlas_v1.png`: integrated as Cod B'y's animated sprite source.
- `public/assets/sprites/codby/codby_atlas_v1.json`: loaded as Cod B'y animation metadata.
- `public/assets/sprites/puffy/puffy_atlas_v1.png`: integrated as Puffy's animated sprite source.
- `public/assets/sprites/puffy/puffy_atlas_v1.json`: loaded as Puffy animation metadata.
- `public/assets/props/kelp_shield_icon.png`, `public/assets/props/tide_lift_icon.png`, and `public/assets/props/story_spark_icon.png`: integrated as active power-up pickup icons.
- Raw sprite sheets, extracted frame PNGs, previews, ZIPs, and preprocessing scripts: moved to `dev_assets/public_assets`.

## Known Asset Limitations

The active cleaned sprite atlases have real alpha transparency and no checkerboard background. The original raw sprite sheets are RGB PNGs with baked checkerboard backgrounds and should not be used at runtime.

Active frame sizes:

- Cod B'y: `256 x 320`
- Puffy: `288 x 240`

Active animation names:

- Cod B'y: `idle`, `walk`, `jump`, `fall`, `hurt`
- Puffy: `idle`, `run`, `jump`, `glide`, `hurt`

Known limitations:

- Sprites are rendered over simple hidden arcade hitboxes, not pixel-perfect collision.
- Animation timing has been tuned once, but still needs live playtest validation.
- Sprite scale is tuned for readability in the current prototype level, not final art direction.
- Puffy glide remains a simple prototype glide behavior rather than a finished movement system.
- Title/start, win, and loss screens are lightweight scene overlays, not a full menu system.
- Story Spark attraction is intentionally subtle and may need playtest tuning around dense fragment clusters.
- Power-up pickup icons render over simple hidden pickup zones; procedural fallbacks remain available if any icon texture is missing.
- Audio mute state is stored in the scene registry for this play session only.
- Debug hitbox overlay is a development aid and is intentionally off in normal play.
- Prop PNGs are rendered over simple physics zones; they are not collision meshes.
- Animated water and parallax are procedural presentation layers, not a full environmental animation system.
- HUD styling is intentionally compact for the private demo and may need responsive treatment later.
- The music loop is still a WAV file because no local encoder was available in Prototype 1.3.2; compress to MP3 or OGG before a public web release.

## Next Recommended Features

1. Browser-check the softer parallax and slimmer HUD during a full run.
2. Compress the music loop locally with `ffmpeg` and switch runtime music to MP3 or OGG.
3. Capture a short demo video for stakeholder review.
