#!/usr/bin/env python3
"""
Prototype asset-prep helper for Cod B'y & Puffy: Shoreline Run.

What it does:
- Converts baked checkerboard sprite sheets into alpha-transparent sheets.
- Extracts major connected character components into individual transparent frames.
- Packs frames into animation-row atlases with fixed cell sizes.
- Writes JSON metadata for Phaser integration.

This is a prototype helper, not a final art pipeline. Always inspect the output.
"""
from PIL import Image
import numpy as np, cv2, os, json
from collections import deque

def alpha_clean_sheet(path, out_path, bg_brightness_min=180, bg_saturation_max=18):
    im = Image.open(path).convert('RGBA')
    arr = np.array(im)
    rgb = arr[:,:,:3].astype(np.int16)
    mx = rgb.max(axis=2); mn=rgb.min(axis=2); mean=rgb.mean(axis=2)
    bg_like = ((mx-mn) <= bg_saturation_max) & (mean >= bg_brightness_min)
    h,w = bg_like.shape
    visited=np.zeros((h,w), dtype=bool)
    q=deque()
    for x in range(w):
        for y in (0,h-1):
            if bg_like[y,x] and not visited[y,x]:
                visited[y,x]=True; q.append((y,x))
    for y in range(h):
        for x in (0,w-1):
            if bg_like[y,x] and not visited[y,x]:
                visited[y,x]=True; q.append((y,x))
    while q:
        y,x=q.popleft()
        for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny,nx=y+dy,x+dx
            if 0<=ny<h and 0<=nx<w and not visited[ny,nx] and bg_like[ny,nx]:
                visited[ny,nx]=True; q.append((ny,nx))
    out=arr.copy()
    out[:,:,3]=np.where(visited,0,255).astype(np.uint8)
    Image.fromarray(out,'RGBA').save(out_path)

# This script was generated as a starting point. Adapt paths/cell sizes as needed.
