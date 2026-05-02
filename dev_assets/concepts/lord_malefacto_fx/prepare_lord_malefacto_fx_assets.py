from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image


SOURCE_FILE = "lord_malefacto_flare_zone_reference_v2.png"
OUTPUT_STEM = "lord_malefacto_flare_zone_v2"

# Background removal tuning — light grey concept background
BACKGROUND_DISTANCE_THRESHOLD = 38
BACKGROUND_CHANNEL_SPREAD = 22

# Runtime output: scale cropped content so width fits within this budget
TARGET_MAX_WIDTH = 520
TARGET_MAX_HEIGHT = 220

# Transparent padding added around the cropped visible content (px per side)
CROP_PADDING = 14


def clean_background(image: Image.Image) -> Image.Image:
    rgba = image.convert("RGBA")
    pixels = rgba.load()
    width, height = rgba.size

    edge_samples = [
        rgba.getpixel((0, 0)),
        rgba.getpixel((width - 1, 0)),
        rgba.getpixel((0, height - 1)),
        rgba.getpixel((width - 1, height - 1)),
        rgba.getpixel((width // 2, 0)),
        rgba.getpixel((width // 2, height - 1)),
        rgba.getpixel((0, height // 2)),
        rgba.getpixel((width - 1, height // 2)),
    ]
    background = tuple(
        sorted(sample[channel] for sample in edge_samples)[len(edge_samples) // 2]
        for channel in range(3)
    )

    def is_background(x: int, y: int) -> bool:
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
        if not is_background(x, y):
            continue
        red, green, blue, _ = pixels[x, y]
        pixels[x, y] = (red, green, blue, 0)
        queue.append((x + 1, y))
        queue.append((x - 1, y))
        queue.append((x, y + 1))
        queue.append((x, y - 1))

    return rgba


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

    print(f"Source: {SOURCE_FILE}  ({Image.open(source_path).size[0]}x{Image.open(source_path).size[1]})")

    cleaned = clean_background(Image.open(source_path))
    bbox = alpha_bbox_padded(cleaned, CROP_PADDING)
    cropped = cleaned.crop(bbox)

    scale = min(TARGET_MAX_WIDTH / cropped.width, TARGET_MAX_HEIGHT / cropped.height, 1.0)
    out_w = max(1, round(cropped.width * scale))
    out_h = max(1, round(cropped.height * scale))
    output = cropped.resize((out_w, out_h), Image.Resampling.LANCZOS)

    out_png = output_dir / f"{OUTPUT_STEM}.png"
    out_json = output_dir / f"{OUTPUT_STEM}.json"
    output.save(out_png)

    # Recommended display size matches existing flare hitbox with slight glow bleed
    display_w = 320
    display_h = round(display_w * out_h / out_w)

    metadata = {
        "source": SOURCE_FILE,
        "outputWidth": out_w,
        "outputHeight": out_h,
        "recommendedOrigin": {"x": 0.5, "y": 0.5},
        "recommendedDisplaySize": {"w": display_w, "h": display_h},
        "alphaCleanupMethod": "flood-fill from edges, distance threshold from median edge-sample background",
        "backgroundDistanceThreshold": BACKGROUND_DISTANCE_THRESHOLD,
        "backgroundChannelSpread": BACKGROUND_CHANNEL_SPREAD,
        "cropPaddingPx": CROP_PADDING,
        "notes": [
            "Overlay this at the flare zone center (flareX, flareY) using setDisplaySize for hitbox alignment.",
            "Rectangle flareZone collision body is unchanged; this PNG is visual-only.",
            "If glow fringe clips, increase recommendedDisplaySize.w slightly.",
            "If background fringing visible at edges, tighten BACKGROUND_DISTANCE_THRESHOLD.",
        ],
    }
    out_json.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")

    print(f"Output PNG:  {out_png.name}  {out_w}x{out_h}px")
    print(f"Output JSON: {out_json.name}")
    print(f"Recommended display size: {display_w}x{display_h}")
    print(f"Scale applied: {scale:.3f}")


if __name__ == "__main__":
    main()
