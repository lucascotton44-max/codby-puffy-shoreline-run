from __future__ import annotations

import json
from collections import deque
from pathlib import Path
from typing import List, Tuple

from PIL import Image

ROOT = Path(__file__).resolve().parents[3]
SOURCE_DIR = ROOT / "dev_assets" / "sprites" / "tiderunner" / "source"
OUTPUT_DIR = ROOT / "public" / "assets" / "sprites" / "tiderunner"

INPUTS = [
    ("idle", "tiderunner_pickup_idle_01_raw.png", "tiderunner_idle_01.png"),
    ("idle", "tiderunner_pickup_idle_02_raw.png", "tiderunner_idle_02.png"),
]

CELL_W = 128
CELL_H = 128
COLUMNS = 2
ROWS = 1
MARGIN = 8

ATLAS_PATH = OUTPUT_DIR / "tiderunner_atlas_v1.png"
JSON_PATH = OUTPUT_DIR / "tiderunner_atlas_v1.json"


def load_rgba(path: Path) -> Image.Image:
    return Image.open(path).convert("RGBA")


def color_dist_sq(a: Tuple[int, int, int], b: Tuple[int, int, int]) -> int:
    dr = a[0] - b[0]
    dg = a[1] - b[1]
    db = a[2] - b[2]
    return dr * dr + dg * dg + db * db


def sample_edge_background_colors(img: Image.Image) -> List[Tuple[int, int, int]]:
    w, h = img.size
    samples = [
        img.getpixel((0, 0))[:3],
        img.getpixel((w - 1, 0))[:3],
        img.getpixel((0, h - 1))[:3],
        img.getpixel((w - 1, h - 1))[:3],
        img.getpixel((w // 2, 0))[:3],
        img.getpixel((w // 2, h - 1))[:3],
        img.getpixel((0, h // 2))[:3],
        img.getpixel((w - 1, h // 2))[:3],
    ]

    unique = []
    for s in samples:
        if s not in unique:
            unique.append(s)
    return unique


def remove_flat_background(img: Image.Image, tolerance_sq: int = 42 * 42) -> Image.Image:
    """Flood-fill from the outer edges, removing pixels close to the flat background color."""
    rgba = img.copy()
    px = rgba.load()
    w, h = rgba.size

    bg_colors = sample_edge_background_colors(rgba)

    visited = [[False] * w for _ in range(h)]
    q = deque()

    for x in range(w):
        q.append((x, 0))
        q.append((x, h - 1))
    for y in range(h):
        q.append((0, y))
        q.append((w - 1, y))

    while q:
        x, y = q.popleft()
        if x < 0 or y < 0 or x >= w or y >= h or visited[y][x]:
            continue

        visited[y][x] = True
        r, g, b, a = px[x, y]
        if a == 0:
            px[x, y] = (r, g, b, 0)
        else:
            rgb = (r, g, b)
            if any(color_dist_sq(rgb, bg) <= tolerance_sq for bg in bg_colors):
                px[x, y] = (r, g, b, 0)
                q.append((x + 1, y))
                q.append((x - 1, y))
                q.append((x, y + 1))
                q.append((x, y - 1))

    return rgba


def alpha_bbox(img: Image.Image) -> Tuple[int, int, int, int]:
    alpha = img.getchannel("A")
    bbox = alpha.getbbox()
    if bbox is None:
        raise RuntimeError("No visible pixels found after background removal.")
    return bbox


def union_bbox(boxes: List[Tuple[int, int, int, int]]) -> Tuple[int, int, int, int]:
    left = min(b[0] for b in boxes)
    top = min(b[1] for b in boxes)
    right = max(b[2] for b in boxes)
    bottom = max(b[3] for b in boxes)
    return (left, top, right, bottom)


def fit_union_crop_into_cell(
    crop: Image.Image,
    cell_w: int,
    cell_h: int,
    margin: int,
) -> Image.Image:
    max_w = cell_w - margin * 2
    max_h = cell_h - margin * 2

    scale = min(max_w / crop.width, max_h / crop.height)
    new_w = max(1, int(round(crop.width * scale)))
    new_h = max(1, int(round(crop.height * scale)))

    resized = crop.resize((new_w, new_h), Image.LANCZOS)
    cell = Image.new("RGBA", (cell_w, cell_h), (0, 0, 0, 0))

    paste_x = (cell_w - new_w) // 2
    paste_y = (cell_h - new_h) // 2
    cell.paste(resized, (paste_x, paste_y), resized)
    return cell


def main() -> None:
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    prepared = []
    bboxes = []

    for animation, source_name, frame_name in INPUTS:
        src_path = SOURCE_DIR / source_name
        if not src_path.exists():
            raise FileNotFoundError(f"Missing source image: {src_path}")

        raw = load_rgba(src_path)
        cleaned = remove_flat_background(raw)
        bbox = alpha_bbox(cleaned)
        prepared.append(
            {
                "animation": animation,
                "source_name": source_name,
                "frame_name": frame_name,
                "raw": raw,
                "cleaned": cleaned,
                "bbox": bbox,
            }
        )
        bboxes.append(bbox)

    shared_box = union_bbox(bboxes)

    atlas_w = CELL_W * COLUMNS
    atlas_h = CELL_H * ROWS
    atlas = Image.new("RGBA", (atlas_w, atlas_h), (0, 0, 0, 0))

    animation_map = {}
    frame_entries = []

    for i, item in enumerate(prepared):
        col = i % COLUMNS
        row = i // COLUMNS
        atlas_x = col * CELL_W
        atlas_y = row * CELL_H

        union_crop = item["cleaned"].crop(shared_box)
        cell = fit_union_crop_into_cell(union_crop, CELL_W, CELL_H, MARGIN)
        atlas.paste(cell, (atlas_x, atlas_y), cell)

        bbox = item["bbox"]
        bbox_data = {
            "x": int(bbox[0]),
            "y": int(bbox[1]),
            "w": int(bbox[2] - bbox[0]),
            "h": int(bbox[3] - bbox[1]),
            "area": int((bbox[2] - bbox[0]) * (bbox[3] - bbox[1])),
        }

        entry = {
            "name": item["frame_name"],
            "animation": item["animation"],
            "index": sum(1 for p in prepared[:i] if p["animation"] == item["animation"]),
            "atlasX": atlas_x,
            "atlasY": atlas_y,
            "w": CELL_W,
            "h": CELL_H,
            "sourceBBox": bbox_data,
        }

        animation_map.setdefault(item["animation"], []).append(entry)
        frame_entries.append(entry)

    atlas.save(ATLAS_PATH)

    metadata = {
        "character": "tiderunner",
        "source": "dev_assets/sprites/tiderunner/source",
        "cellWidth": CELL_W,
        "cellHeight": CELL_H,
        "columns": COLUMNS,
        "rows": ROWS,
        "animations": animation_map,
        "frames": frame_entries,
    }

    with JSON_PATH.open("w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    print(f"Created: {ATLAS_PATH}")
    print(f"Created: {JSON_PATH}")
    print(f"Atlas size: {atlas_w}x{atlas_h}")
    print("Frames: " + ", ".join(e["name"] for e in frame_entries))


if __name__ == "__main__":
    main()
