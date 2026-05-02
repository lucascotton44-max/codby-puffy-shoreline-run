from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image


SOURCE_FILE = "lord_malefacto_flare_zone_reference_v2.png"
OUTPUT_STEM = "lord_malefacto_flare_zone_v2"

# Background removal — primary flood fill from all edges.
# Raised aggressively so warm-grey fire-bleed fringe pixels don't block the fill.
BACKGROUND_DISTANCE_THRESHOLD = 65   # was 24
BACKGROUND_CHANNEL_SPREAD = 55       # was 14

# Second-pass cleanup: zeros residual near-background bright low-saturation pixels
# that were enclosed by fire content and unreachable from the image edges.
SECONDARY_BRIGHTNESS_FLOOR = 90      # below this = dark smoke/shadow — preserve
SECONDARY_SATURATION_CEILING = 0.22  # above this = coloured fire content — preserve
SECONDARY_DISTANCE_THRESHOLD = 55    # within this distance of bg colour = zero alpha

# Runtime output: scale cropped content so width fits within this budget
TARGET_MAX_WIDTH = 520
TARGET_MAX_HEIGHT = 220

# Transparent padding added around the cropped visible content (px per side)
CROP_PADDING = 14


def _sample_background(rgba: Image.Image) -> tuple[int, int, int]:
    width, height = rgba.size
    samples = [
        rgba.getpixel((0, 0)),
        rgba.getpixel((width - 1, 0)),
        rgba.getpixel((0, height - 1)),
        rgba.getpixel((width - 1, height - 1)),
        rgba.getpixel((width // 2, 0)),
        rgba.getpixel((width // 2, height - 1)),
        rgba.getpixel((0, height // 2)),
        rgba.getpixel((width - 1, height // 2)),
    ]
    return tuple(
        sorted(s[ch] for s in samples)[len(samples) // 2]
        for ch in range(3)
    )


def clean_background(image: Image.Image) -> tuple[Image.Image, tuple[int, int, int]]:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    background = _sample_background(rgba)

    def is_background_pixel(x: int, y: int) -> bool:
        red, green, blue, alpha = pixels[x, y]
        if alpha == 0:
            return True
        channel_spread = max(red, green, blue) - min(red, green, blue)
        color_distance = (
            (red - background[0]) ** 2
            + (green - background[1]) ** 2
            + (blue - background[2]) ** 2
        ) ** 0.5
        return (
            channel_spread <= BACKGROUND_CHANNEL_SPREAD
            and color_distance <= BACKGROUND_DISTANCE_THRESHOLD
        )

    # Pass 1: flood fill from all four edges.
    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()
    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited or x < 0 or y < 0 or x >= width or y >= height:
            continue
        visited.add((x, y))
        if not is_background_pixel(x, y):
            continue
        red, green, blue, _ = pixels[x, y]
        pixels[x, y] = (red, green, blue, 0)
        queue.append((x + 1, y))
        queue.append((x - 1, y))
        queue.append((x, y + 1))
        queue.append((x, y - 1))

    # Pass 2: zero residual near-background bright low-saturation pixels that
    # the edge-seeded flood fill could not reach (enclosed by fire content).
    for py in range(height):
        for px in range(width):
            red, green, blue, alpha = pixels[px, py]
            if alpha == 0:
                continue
            brightness = max(red, green, blue)
            if brightness < SECONDARY_BRIGHTNESS_FLOOR:
                continue  # dark smoke / shadow — preserve
            spread = brightness - min(red, green, blue)
            saturation = spread / brightness if brightness > 0 else 0.0
            if saturation > SECONDARY_SATURATION_CEILING:
                continue  # coloured / fire content — preserve
            color_distance = (
                (red - background[0]) ** 2
                + (green - background[1]) ** 2
                + (blue - background[2]) ** 2
            ) ** 0.5
            if color_distance <= SECONDARY_DISTANCE_THRESHOLD:
                pixels[px, py] = (red, green, blue, 0)

    return rgba, background


def alpha_bbox_padded(image: Image.Image, padding: int) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        return (0, 0, image.width, image.height)
    left, top, right, bottom = bbox
    return (
        max(0, left - padding),
        max(0, top - padding),
        min(image.width, right + padding),
        min(image.height, bottom + padding),
    )


def main() -> None:
    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parents[2]
    source_path = script_dir / SOURCE_FILE
    output_dir = repo_root / "public" / "assets" / "sprites" / "lord_malefacto_fx"
    output_dir.mkdir(parents=True, exist_ok=True)

    src = Image.open(source_path)
    print(f"Source: {SOURCE_FILE}  ({src.size[0]}x{src.size[1]})")

    cleaned, background_color = clean_background(src)
    bbox = alpha_bbox_padded(cleaned, CROP_PADDING)
    cropped = cleaned.crop(bbox)

    scale = min(TARGET_MAX_WIDTH / cropped.width, TARGET_MAX_HEIGHT / cropped.height, 1.0)
    out_w = max(1, round(cropped.width * scale))
    out_h = max(1, round(cropped.height * scale))
    output = cropped.resize((out_w, out_h), Image.Resampling.LANCZOS)

    out_png = output_dir / f"{OUTPUT_STEM}.png"
    out_json = output_dir / f"{OUTPUT_STEM}.json"
    output.save(out_png)

    corner_alphas = [
        output.getpixel((0, 0))[3],
        output.getpixel((out_w - 1, 0))[3],
        output.getpixel((0, out_h - 1))[3],
        output.getpixel((out_w - 1, out_h - 1))[3],
    ]
    print(f"Corner alphas TL/TR/BL/BR: {corner_alphas}")

    display_w = 320
    display_h = round(display_w * out_h / out_w)

    metadata = {
        "source": SOURCE_FILE,
        "outputWidth": out_w,
        "outputHeight": out_h,
        "recommendedOrigin": {"x": 0.5, "y": 0.5},
        "recommendedDisplaySize": {"w": display_w, "h": display_h},
        "alphaCleanupMethod": (
            "pass 1: flood-fill from edges with raised thresholds to catch warm-grey "
            "fire-bleed fringe; pass 2: zero enclosed near-background bright "
            "low-saturation pixels unreachable from edges"
        ),
        "backgroundDistanceThreshold": BACKGROUND_DISTANCE_THRESHOLD,
        "backgroundChannelSpread": BACKGROUND_CHANNEL_SPREAD,
        "secondaryBrightnessFloor": SECONDARY_BRIGHTNESS_FLOOR,
        "secondarySaturationCeiling": SECONDARY_SATURATION_CEILING,
        "secondaryDistanceThreshold": SECONDARY_DISTANCE_THRESHOLD,
        "cropPaddingPx": CROP_PADDING,
        "notes": [
            "Overlay this at the flare zone center (flareX, flareY) using setDisplaySize for hitbox alignment.",
            "Rectangle flareZone collision body is unchanged; this PNG is visual-only.",
            "If glow fringe clips, increase recommendedDisplaySize.w slightly.",
            "If background fringing visible at edges, tighten BACKGROUND_DISTANCE_THRESHOLD.",
            "Second-pass cleanup zeros near-background bright low-saturation pixels not reachable by edge flood fill.",
        ],
    }
    out_json.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")

    print(f"Output PNG:  {out_png.name}  {out_w}x{out_h}px")
    print(f"Output JSON: {out_json.name}")
    print(f"Recommended display size: {display_w}x{display_h}")
    print(f"Scale applied: {scale:.3f}")
    print(f"Background colour sampled: {background_color}")


if __name__ == "__main__":
    main()
