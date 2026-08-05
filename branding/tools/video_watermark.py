#!/usr/bin/env python3
"""Video watermark overlays in the classic identity — full-frame transparent
canvases with the white lockup as a corner bug (and a centered screener
variant), ready to drop onto a timeline."""
import re
import classic_logo as C

def overlay(frame_w, frame_h, bug_w_ratio=0.177, margin_ratio=0.033,
            opacity=0.4, pos="br"):
    body, bw, asc, desc = C.lockup(C.WHITE, C.WHITE, C.WHITE)
    bh = asc + desc
    scale = frame_w * bug_w_ratio / bw
    m = frame_w * margin_ratio
    if pos == "br":
        x = frame_w - m - bw * scale / 2      # anchor: block centre x
        y = frame_h - m - bh * scale          # top of block
    elif pos == "center":
        x = frame_w / 2
        y = frame_h / 2 - bh * scale / 2
    wrapped = (f'<g opacity="{opacity}" transform="translate({x:.2f} '
               f'{y + asc * scale:.2f}) scale({scale:.5f})">{body(0, 0)}</g>')
    return C.svg_doc(frame_w, frame_h, wrapped, bg=None)

C.write("ll_classic_wm_overlay_1080p_br.svg", overlay(1920, 1080))
C.write("ll_classic_wm_overlay_4k_br.svg", overlay(3840, 2160))
C.write("ll_classic_wm_overlay_1080p_center.svg",
        overlay(1920, 1080, bug_w_ratio=0.42, opacity=0.28, pos="center"))
