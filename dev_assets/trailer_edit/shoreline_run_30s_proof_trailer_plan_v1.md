# Cod B’y & Puffy: Shoreline Run — 30-Second Proof Trailer Plan v1

## Goal

Build a 30-second proof trailer using cinematic stills, text cards, audio, and placeholders for gameplay captures.

Core rule:

**Cinematic soul. Gameplay spine.**

Every cinematic image must connect quickly to playable footage.

---

## Timeline

| Time | Visual | Text | Audio |
|---:|---|---|---|
| 0:00–0:02 | Black screen | none | Low Atlantic wind, distant harbour bell |
| 0:02–0:05 | `trailer_tide_reveal_relics_reference_v1.png` | WHEN THE TIDE PULLS BACK… | Cursed low hum begins |
| 0:05–0:07 | Cod B’y / Puffy reaction still or capture | none | VO: “Well, b’y… that ain’t the tide.” |
| 0:07–0:10 | `GP_A_run_jump_dodge.mp4` | RUN THE SHORELINE | Music pulse starts, dock/jump SFX |
| 0:10–0:13 | `GP_B_jump_dodge_hazard.mp4` | none | Jump / hazard SFX |
| 0:13–0:16 | `GP_C_puffy_assist.mp4` | CALL IN PUFFY | Character switch + glide SFX |
| 0:16–0:19 | `GP_D_relic_collection.mp4` | COLLECT THE TIDE RELICS | Relic collect SFX |
| 0:19–0:22 | `trailer_lighthouse_failing_reference_v1.png` | KEEP THE LIGHT ALIVE | Wind swell, lighthouse creak |
| 0:22–0:25 | `GP_E_malefacto_flare_attack.mp4` | BEFORE THE LANTERN DIES | Boss danger / flare SFX |
| 0:25–0:27 | `GP_F_boss_stomp_or_demo_complete.mp4` | optional: DEMO COMPLETE | Stomp-hit or level-complete SFX |
| 0:27–0:30 | `trailer_title_background_reference_v1.png` | COD B’Y & PUFFY: SHORELINE RUN / RUN THE COAST. SAVE THE LIGHT. / DEMO COMING SOON | Final bell + wave swell |

---

## Locked Trailer Stills

Place these in:

`dev_assets/concepts/trailer_stills/final/`

- `trailer_tide_reveal_relics_reference_v1.png`
- `trailer_lighthouse_failing_reference_v1.png`
- `trailer_title_background_reference_v1.png`

---

## Trailer Capture References

Place these in:

`dev_assets/concepts/trailer_capture/`

- `demo_complete_ui_polish_reference_v1.png`

---

## Gameplay Placeholder Clips

Place final clips here:

`dev_assets/trailer_edit/placeholders/`

Required placeholder names:

- `GP_A_run_jump_dodge.mp4`
- `GP_B_jump_dodge_hazard.mp4`
- `GP_C_puffy_assist.mp4`
- `GP_D_relic_collection.mp4`
- `GP_E_malefacto_flare_attack.mp4`
- `GP_F_boss_stomp_or_demo_complete.mp4`

---

## Motion Notes For Stills

### Tide Reveal Relics

Duration: 3 seconds  
Motion: slow push-in toward relic/glow  
Effects: subtle mist drift, low tide movement, soft green pulse  
Avoid: heavy camera shake, object morphing, new objects

### Lighthouse Failing

Duration: 3 seconds  
Motion: slow push toward lighthouse  
Effects: weak flickering beam, fog drift, low wave movement  
Avoid: overdone fantasy glow, fast motion

### Title Background

Duration: 3 seconds  
Motion: nearly static, 100% to 102% scale push  
Effects: subtle fog/water movement only  
Priority: keep title-safe area clean

### Demo Complete UI

Duration: 1.5–2 seconds  
Motion: manual Premiere scale only, 100% to 103%  
Avoid: AI motion or text distortion

---

## Text Cards

Use restrained all-caps text:

- WHEN THE TIDE PULLS BACK…
- RUN THE SHORELINE
- CALL IN PUFFY
- COLLECT THE TIDE RELICS
- KEEP THE LIGHT ALIVE
- BEFORE THE LANTERN DIES
- RUN THE COAST. SAVE THE LIGHT.

Style:

- white or warm off-white
- subtle shadow
- no gimmick animation
- readable lower-third or center-left placement
- no text over busy highlights

---

## Audio Plan

Audio tracks:

- A1: wind / water ambience
- A2: music bed
- A3: SFX hits
- A4: VO

Key audio moments:

- 0:00 — distant bell hit
- 0:02 — cursed hum begins
- 0:05 — Cod B’y VO
- 0:07 — music pulse starts
- 0:13 — switch/glide SFX
- 0:16 — relic collect SFX
- 0:19 — wind swell / lighthouse creak
- 0:22 — boss danger hit
- 0:25 — stomp or level complete
- 0:27 — final bell / wave swell

---

## Premiere Export

Sequence:

- 1920 × 1080
- 30 fps or 60 fps
- H.264
- Match Source - High Bitrate

Export name:

`dev_assets/trailer_edit/exports/Shoreline_Run_30s_Proof_Trailer_v1.mp4`

---

## Capture Rules

- OBS or direct screen capture
- 1920×1080 preferred
- 60fps preferred
- no phone recording
- no mouse cursor
- no browser tabs
- no Windows taskbar
- no debug overlay
- trailer capture mode enabled if needed

---

## Build Order

1. Place stills and black/title frames.
2. Add text cards.
3. Add placeholder gameplay blocks.
4. Add VO line.
5. Add music/SFX.
6. Replace placeholders with real gameplay.
7. Tighten cuts after the full 30 seconds exists.

