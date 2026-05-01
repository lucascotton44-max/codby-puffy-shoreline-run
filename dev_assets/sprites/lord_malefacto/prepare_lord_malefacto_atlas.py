from __future__ import annotations

import json
from collections import deque
from pathlib import Path

from PIL import Image


CELL_WIDTH = 320
CELL_HEIGHT = 320
COLUMNS = 1
ROWS = 1
INNER_PADDING = 18
BASELINE_PADDING = 8
BACKGROUND_DISTANCE_THRESHOLD = 54
BACKGROUND_CHANNEL_SPREAD = 28

FRAME_NAME = "lord_malefacto_idle"
SOURCE_NAME = "lord_malefacto_idle_reference_v1_raw.png"


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
    background = tuple(sorted(sample[channel] for sample in edge_samples)[len(edge_samples) // 2] for channel in range(3))

    def is_background(x: int, y: int) -> bool:
        red, green, blue, alpha = pixels[x, y]
        if alpha == 0:
            return True

        channel_spread = max(red, green, blue) - min(red, green, blue)
        color_distance = (
            (red - background[0]) ** 2 + (green - background[1]) ** 2 + (blue - background[2]) ** 2
        ) ** 0.5
        return channel_spread <= BACKGROUND_CHANNEL_SPREAD and color_distance <= BACKGROUND_DISTANCE_THRESHOLD

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


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int]:
    alpha = image.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        return (0, 0, image.width, image.height)
    return bbox


def main() -> None:
    script_dir = Path(__file__).resolve().parent
    repo_root = script_dir.parents[2]
    source_path = script_dir / "source" / SOURCE_NAME
    output_dir = repo_root / "public" / "assets" / "sprites" / "lord_malefacto"
    output_dir.mkdir(parents=True, exist_ok=True)

    cleaned = clean_background(Image.open(source_path))
    bbox = alpha_bbox(cleaned)
    cropped = cleaned.crop(bbox)

    max_width = CELL_WIDTH - INNER_PADDING * 2
    max_height = CELL_HEIGHT - INNER_PADDING * 2
    scale = min(max_width / cropped.width, max_height / cropped.height)
    scaled_size = (max(1, round(cropped.width * scale)), max(1, round(cropped.height * scale)))
    scaled = cropped.resize(scaled_size, Image.Resampling.LANCZOS)

    atlas = Image.new("RGBA", (CELL_WIDTH * COLUMNS, CELL_HEIGHT * ROWS), (0, 0, 0, 0))
    x = (CELL_WIDTH - scaled.width) // 2
    y = CELL_HEIGHT - scaled.height - BASELINE_PADDING
    atlas.alpha_composite(scaled, (x, y))

    left, top, right, bottom = bbox
    bbox_width = right - left
    bbox_height = bottom - top
    frame = {
        "name": FRAME_NAME,
        "animation": "idle",
        "index": 0,
        "atlasX": 0,
        "atlasY": 0,
        "w": CELL_WIDTH,
        "h": CELL_HEIGHT,
        "sourceBBox": {
            "x": left,
            "y": top,
            "w": bbox_width,
            "h": bbox_height,
            "area": bbox_width * bbox_height,
        },
    }

    metadata = {
        "character": "lord_malefacto",
        "source": f"dev_assets/sprites/lord_malefacto/source/{SOURCE_NAME}",
        "cellWidth": CELL_WIDTH,
        "cellHeight": CELL_HEIGHT,
        "columns": COLUMNS,
        "rows": ROWS,
        "animations": {
            "idle": [frame],
        },
        "frames": [frame],
    }

    atlas.save(output_dir / "lord_malefacto_atlas_v1.png")
    (output_dir / "lord_malefacto_atlas_v1.json").write_text(
        json.dumps(metadata, indent=2) + "\n",
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
