# Deterministic plank alignment — proof pack (2026-08)

Captured with `?level=calvins-creature-room&debug=align` at 4x zoom; the strip at
the bottom of each image is the same-frame build stamp (`window.__SHORELINE_BUILD__`,
injected per page load — a stamp that doesn't match `git rev-parse --short HEAD`
means the tab is stale and its evidence is void).

- MAGENTA line: platform physics body top (where feet rest)
- CYAN dashes: the plank sprite's drawn deck walk row, re-derived from the final
  draw position (dashed so coincidence doesn't hide the magenta underneath)
- Correct = the two read as ONE continuous line alternating colors

## Pixel assertions (automated, on these exact PNGs)

| Proof | magenta row | cyan row | delta (world px) | feet vs line |
|---|---|---|---|---|
| proof_T1_low.png (boardwalk, top 440) | 205.5 | 205.5 | 0.00 | -0.6 px |
| proof_R_mid.png (recovery wharf, top 340) | 205.5 | 205.5 | 0.00 | -0.6 px |
| proof_H_summit.png (summit, top 168) | 205.5 | 205.5 | 0.00 | -0.6 px |

## Fragment clearance audit (>=12px vs all platform/prop bounds)

```
frag   before          clr    after           clr   note
S01   ( 295, 465)     19.0    unchanged             clear (ground-exempt walk pickup)
S02   ( 630, 382)     19.6    unchanged             clear
S03   (1322, 350)     -1.0 -> (1420, 262)           NO arc point clears (84.5px apex misses corridor by ~3px);
                                                    re-anchored to standing-hop arc above A2 - design call, disclosed
S04   (2600, 158)     -1.0 -> (2601, 132)   17.0    moved along the SAME arc (t 0.380->0.384)
S05   (1790, 322)     -1.0 -> (1900, 240)           same as S03: re-anchored to hop arc above the recovery wharf
S06   (2900, 225)     95.6    unchanged             clear
S07   (3335, 392)      4.6 -> (3371, 450)   13.3    moved along the SAME arc (t 0.270->0.274)
S08   (3940, 430)    304.0    unchanged             ground walk pickup, no arc - clear
```

Ground rect is exempt for the two designed walk-height pickups (S01/S08) — the
12px rule's intent is plank-art occlusion clearance; overlap remains forbidden.
