#!/usr/bin/env python3
"""
Dev-only Scuttleclaw sprite atlas prep.

Converts the existing raw Scuttleclaw source images into a fixed-cell PNG atlas
and JSON metadata shaped like the Cod B'y/Puffy prototype sprite atlases.
"""
from __future__ import annotations

from collections import deque
from pathlib import Path
import json

import numpy as np
from PIL import Image


CHARACTER = "scuttleclaw"
CELL_WIDTH = 256
CELL_HEIGHT = 160
BASELINE_Y = 140
CONTENT_MARGIN_X = 12
CONTENT_MARGIN_TOP = 12

SCRIPT_DIR = Path(__file__).resolve().parent
REPO_ROOT = SCRIPT_DIR.parents[2]
SOURCE_DIR = SCRIPT_DIR / "source"
FRAMES_DIR = SCRIPT_DIR / "frames"
RUNTIME_DIR = REPO_ROOT / "public" / "assets" / "sprites" / "scuttleclaw"

IDLE_SOURCES = [
    ("idle", 1, SOURCE_DIR / "scuttleclaw_idle_01_raw.png"),
    ("idle", 2, SOURCE_DIR / "scuttleclaw_idle_02_raw.png"),
]
WALK_SHEET = SOURCE_DIR / "scuttleclaw_walk_sheet_v1_raw.png"


def remove_edge_background(image: Image.Image) -> Image.Image:
    arr = np.array(image.convert("RGBA"))
    rgb = arr[:, :, :3].astype(np.int16)
    alpha = arr[:, :, 3]

    channel_max = rgb.max(axis=2)
    channel_min = rgb.min(axis=2)
    mean = rgb.mean(axis=2)
    near_white = ((channel_max - channel_min) <= 34) & (mean >= 170)
    near_magenta = (rgb[:, :, 0] > 190) & (rgb[:, :, 1] < 90) & (rgb[:, :, 2] > 150)
    transparent = alpha < 24
    background_like = near_white | near_magenta | transparent

    height, width = background_like.shape
    visited = np.zeros((height, width), dtype=bool)
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        for y in (0, height - 1):
            if background_like[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))

    for y in range(height):
        for x in (0, width - 1):
            if background_like[y, x] and not visited[y, x]:
                visited[y, x] = True
                queue.append((y, x))

    while queue:
        y, x = queue.popleft()
        for dy, dx in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ny = y + dy
            nx = x + dx
            if (
                0 <= ny < height
                and 0 <= nx < width
                and not visited[ny, nx]
                and background_like[ny, nx]
            ):
                visited[ny, nx] = True
                queue.append((ny, nx))

    arr[:, :, 3] = np.where(visited, 0, alpha).astype(np.uint8)
    return Image.fromarray(arr, "RGBA")


def alpha_bbox(image: Image.Image) -> tuple[int, int, int, int, int]:
    alpha = np.array(image.convert("RGBA"))[:, :, 3]
    ys, xs = np.where(alpha > 20)

    if len(xs) == 0:
        raise ValueError("No foreground pixels found after background cleanup.")

    left = int(xs.min())
    top = int(ys.min())
    right = int(xs.max()) + 1
    bottom = int(ys.max()) + 1
    area = int(len(xs))
    return left, top, right, bottom, area


def normalize_frame(source_image: Image.Image) -> tuple[Image.Image, dict[str, int]]:
    cleaned = remove_edge_background(source_image)
    left, top, right, bottom, area = alpha_bbox(cleaned)
    cropped = cleaned.crop((left, top, right, bottom))

    max_width = CELL_WIDTH - CONTENT_MARGIN_X * 2
    max_height = BASELINE_Y - CONTENT_MARGIN_TOP
    scale = min(max_width / cropped.width, max_height / cropped.height)
    output_size = (
        max(1, round(cropped.width * scale)),
        max(1, round(cropped.height * scale)),
    )
    resized = cropped.resize(output_size, Image.Resampling.LANCZOS)

    frame = Image.new("RGBA", (CELL_WIDTH, CELL_HEIGHT), (0, 0, 0, 0))
    paste_x = (CELL_WIDTH - resized.width) // 2
    paste_y = BASELINE_Y - resized.height
    frame.alpha_composite(resized, (paste_x, paste_y))

    return frame, {"x": left, "y": top, "w": right - left, "h": bottom - top, "area": area}


def load_source_frames() -> list[tuple[str, str, int, Image.Image]]:
    frames: list[tuple[str, str, int, Image.Image]] = []

    for animation, index, path in IDLE_SOURCES:
        frames.append((animation, f"{animation}_{index:02d}", index - 1, Image.open(path).convert("RGBA")))

    walk_sheet = Image.open(WALK_SHEET).convert("RGBA")
    frame_width = walk_sheet.width // 4
    for index in range(4):
        left = index * frame_width
        right = left + frame_width
        frame = walk_sheet.crop((left, 0, right, walk_sheet.height))
        frames.append(("walk", f"walk_{index + 1:02d}", index, frame))

    return frames


def main() -> None:
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)
    RUNTIME_DIR.mkdir(parents=True, exist_ok=True)

    source_frames = load_source_frames()
    atlas = Image.new("RGBA", (CELL_WIDTH * len(source_frames), CELL_HEIGHT), (0, 0, 0, 0))
    animations: dict[str, list[dict[str, object]]] = {"idle": [], "walk": []}
    flat_frames: list[dict[str, object]] = []

    for atlas_index, (animation, frame_id, animation_index, source_image) in enumerate(source_frames):
        frame, source_bbox = normalize_frame(source_image)
        atlas_x = atlas_index * CELL_WIDTH
        atlas.alpha_composite(frame, (atlas_x, 0))

        frame_filename = f"{CHARACTER}_{frame_id}.png"
        frame.save(FRAMES_DIR / frame_filename)

        frame_meta = {
            "name": frame_filename,
            "animation": animation,
            "index": animation_index,
            "atlasX": atlas_x,
            "atlasY": 0,
            "w": CELL_WIDTH,
            "h": CELL_HEIGHT,
            "sourceBBox": source_bbox,
        }
        animations[animation].append(frame_meta)
        flat_frames.append(frame_meta.copy())

    atlas_path = RUNTIME_DIR / "scuttleclaw_atlas_v1.png"
    json_path = RUNTIME_DIR / "scuttleclaw_atlas_v1.json"
    atlas.save(atlas_path)

    metadata = {
        "character": CHARACTER,
        "source": "dev_assets/sprites/scuttleclaw/source",
        "cellWidth": CELL_WIDTH,
        "cellHeight": CELL_HEIGHT,
        "columns": len(source_frames),
        "rows": 1,
        "animations": animations,
        "frames": flat_frames,
    }
    json_path.write_text(json.dumps(metadata, indent=2) + "\n", encoding="utf-8")

    print(f"Wrote {atlas_path}")
    print(f"Wrote {json_path}")
    print("Frames:", ", ".join(frame_id for _, frame_id, _, _ in source_frames))


if __name__ == "__main__":
    main()
