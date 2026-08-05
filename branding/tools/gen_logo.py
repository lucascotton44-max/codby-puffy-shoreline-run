#!/usr/bin/env python3
"""
Lucas & Liam Legacy Studios — master identity generator.
Refinement of Logo Concept #4 (stacked serif wordmark / brass rule / tracked sans).
Shapes type with HarfBuzz (real kerning), converts to SVG paths (vector-clean,
no live text, no font dependencies), and assembles all lockup variants.
"""
import os
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
SERIF = os.path.join(FONTS, "EBGaramond-SemiBold.ttf")
SANS = os.path.join(FONTS, "Inter-Medium.ttf")
SANS_SB = os.path.join(FONTS, "Inter-SemiBold.ttf")

OUT = os.environ.get("LOGO_OUT", os.path.join(HERE, "out"))
os.makedirs(OUT, exist_ok=True)

# ---- palette --------------------------------------------------------------
NAVY = "#132C40"      # deep Atlantic navy
OFFWHITE = "#F6F0E4"  # warm off-white
BRASS = "#A98A50"     # muted brass / weathered gold
BLACK = "#000000"
WHITE = "#FFFFFF"

_font_cache = {}

def _load(fontpath):
    if fontpath not in _font_cache:
        blob = hb.Blob.from_file_path(fontpath)
        face = hb.Face(blob)
        font = hb.Font(face)
        tt = TTFont(fontpath)
        _font_cache[fontpath] = (face, font, tt, tt.getGlyphSet(), tt.getGlyphOrder())
    return _font_cache[fontpath]

def shape_run(fontpath, text, size, tracking_em=0.0):
    """Shape text -> (svg path d, advance width). Baseline at y=0, x from 0."""
    face, font, tt, glyph_set, glyph_order = _load(fontpath)
    upem = face.upem
    buf = hb.Buffer()
    buf.add_str(text)
    buf.guess_segment_properties()
    hb.shape(font, buf)
    scale = size / upem
    track = tracking_em * upem
    x = 0.0
    parts = []
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        gname = glyph_order[info.codepoint]
        pen = SVGPathPen(glyph_set)
        tp = TransformPen(pen, Transform(scale, 0, 0, -scale,
                                         (x + pos.x_offset) * scale,
                                         -pos.y_offset * scale))
        glyph_set[gname].draw(tp)
        d = pen.getCommands()
        if d:
            parts.append(d)
        x += pos.x_advance
        if i < n - 1:
            x += track
    return " ".join(parts), x * scale

def natural_width(fontpath, text, size):
    return shape_run(fontpath, text, size, 0.0)[1]

def tracking_for_width(fontpath, text, size, target_width):
    """Solve per-gap tracking (em) so the run's width equals target_width."""
    face, font, tt, *_ = _load(fontpath)
    upem = face.upem
    w0 = natural_width(fontpath, text, size)
    gaps = len(text) - 1
    if gaps <= 0:
        return 0.0
    return (target_width - w0) / gaps / (size)

def cap_height(fontpath, size):
    tt = _load(fontpath)[2]
    return tt["OS/2"].sCapHeight / tt["head"].unitsPerEm * size

def g(path_d, x, y, fill):
    return (f'<path transform="translate({x:.2f} {y:.2f})" fill="{fill}" '
            f'fill-rule="nonzero" d="{path_d}"/>')

def esc(s):
    return s.replace("&", "&amp;")

def svg_doc(w, h, body, bg=None, title=""):
    bg_rect = f'<rect width="{w:.0f}" height="{h:.0f}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" '
            f'width="{w:.0f}" height="{h:.0f}" role="img" aria-label="{esc(title)}">'
            f'{bg_rect}{body}</svg>')

# ---- shared type spec -----------------------------------------------------
S_SERIF = 100                    # serif font size for master lockups
TRACK_SERIF = 0.055              # quiet, editorial tracking on the serif caps
PRIMARY_TEXT = "LUCAS & LIAM"
SECONDARY_TEXT = "LEGACY STUDIOS"
DESCRIPTOR_TEXT = "ATLANTIC CINEMATIC STORYTELLING"

serif_d, serif_w = shape_run(SERIF, PRIMARY_TEXT, S_SERIF, TRACK_SERIF)
serif_cap = cap_height(SERIF, S_SERIF)

# Secondary line: fixed editorial tracking; size solved so the tracked line
# lands at a set proportion of the serif width (width-matched lockup).
def size_for_width(fontpath, text, tracking_em, target_width):
    k = natural_width(fontpath, text, 1.0)
    gaps = len(text) - 1
    return target_width / (k + tracking_em * gaps)

SANS_TRACK = 0.335
sans_target_w = serif_w * 0.66
S_SANS = size_for_width(SANS, SECONDARY_TEXT, SANS_TRACK, sans_target_w)
sans_d, sans_w = shape_run(SANS, SECONDARY_TEXT, S_SANS, SANS_TRACK)
sans_cap = cap_height(SANS, S_SANS)

# Descriptor: smaller still, same width as the secondary line
DESC_TRACK = 0.30
S_DESC = size_for_width(SANS, DESCRIPTOR_TEXT, DESC_TRACK, sans_target_w)
desc_d, desc_w = shape_run(SANS, DESCRIPTOR_TEXT, S_DESC, DESC_TRACK)
desc_cap = cap_height(SANS, S_DESC)

RULE_H = 2.4                     # crisp geometric hairline (was tapered in C#4)

# ---------------------------------------------------------------------------
# Monogram: two "L" frame corners (cinematic frame / the two L's) holding a
# brass tide line — derived from Concept #4's rule. Quiet, custom geometry.
# ---------------------------------------------------------------------------
def monogram_body(ink, accent, scale=1.0, ox=0.0, oy=0.0):
    """Monogram drawn in a 96x96 box at origin (ox, oy)."""
    s = scale
    def r(x, y, w_, h_, fill):
        return (f'<rect x="{ox + x*s:.2f}" y="{oy + y*s:.2f}" '
                f'width="{w_*s:.2f}" height="{h_*s:.2f}" fill="{fill}"/>')
    stroke = 6.5
    parts = []
    # bottom-left "L" (frame corner)
    parts.append(r(16, 46, stroke, 28, ink))          # vertical arm
    parts.append(r(16, 68, 26, stroke, ink))          # horizontal arm
    # top-right "L" (frame corner, rotated 180)
    parts.append(r(96 - 16 - stroke, 22, stroke, 28, ink))
    parts.append(r(96 - 16 - 26, 22, 26, stroke, ink))
    # tide line: thin horizontal, small break right of centre (light through)
    ty, th = 46.6, 2.8
    parts.append(r(27, ty, 31, th, accent))
    parts.append(r(62.5, ty, 6.5, th, accent))
    return "".join(parts)

def monogram_svg(ink, accent, bg=None):
    pad = 0
    body = monogram_body(ink, accent)
    return svg_doc(96, 96, body, bg=bg, title="Lucas & Liam Legacy Studios monogram")

# ---------------------------------------------------------------------------
# Stacked lockup — the refined Concept #4 composition.
# ---------------------------------------------------------------------------
def stacked_svg(ink, accent, secondary_fill=None, bg=None, descriptor=False,
                pad_x=70, pad_y=64):
    sec = secondary_fill or accent
    w = serif_w + 2 * pad_x
    cx = w / 2

    y = pad_y + serif_cap                       # serif baseline
    parts = [g(serif_d, cx - serif_w / 2, y, ink)]

    rule_y = y + 31
    rule_w = sans_target_w
    parts.append(f'<rect x="{cx - rule_w/2:.2f}" y="{rule_y:.2f}" '
                 f'width="{rule_w:.2f}" height="{RULE_H}" fill="{accent}"/>')

    sans_base = rule_y + RULE_H + 27 + sans_cap
    parts.append(g(sans_d, cx - sans_w / 2, sans_base, sec))

    bottom = sans_base
    if descriptor:
        desc_base = sans_base + 30 + desc_cap
        parts.append(g(desc_d, cx - desc_w / 2, desc_base, ink))
        bottom = desc_base

    h = bottom + pad_y
    return svg_doc(w, h, "".join(parts), bg=bg,
                   title="Lucas & Liam Legacy Studios")

# ---------------------------------------------------------------------------
# Primary horizontal lockup — wordmark, vertical brass hairline, single-line
# secondary. Built for headers, end cards, sponsor bars.
# ---------------------------------------------------------------------------
def horizontal_svg(ink, accent, secondary_fill=None, bg=None, pad_x=64, pad_y=56):
    sec = secondary_fill or accent
    s_sans = 27.5
    track = 0.34
    hd, hw = shape_run(SANS, SECONDARY_TEXT, s_sans, track)
    hcap = cap_height(SANS, s_sans)

    gap = 38                     # wordmark -> divider -> secondary
    div_w = RULE_H
    x = pad_x
    y = pad_y + serif_cap        # shared baseline zone
    parts = [g(serif_d, x, y, ink)]

    div_x = x + serif_w + gap
    div_top = y - serif_cap + 6
    div_h = serif_cap - 12
    parts.append(f'<rect x="{div_x:.2f}" y="{div_top:.2f}" width="{div_w}" '
                 f'height="{div_h:.2f}" fill="{accent}"/>')

    sx = div_x + div_w + gap
    sy = y - (serif_cap - hcap) / 2          # optically centre on cap height
    parts.append(g(hd, sx, sy, sec))

    w = sx + hw + pad_x
    h = y + pad_y
    return svg_doc(w, h, "".join(parts), bg=bg,
                   title="Lucas & Liam Legacy Studios")

# ---------------------------------------------------------------------------
# Sponsor-safe small-size — simplified stacked: sturdier tracking, secondary
# in ink (not brass) for contrast, no descriptor. Holds at ~24 px tall.
# ---------------------------------------------------------------------------
def smallsize_svg(ink, accent, bg=None, pad_x=56, pad_y=52):
    sd, sw = shape_run(SERIF, PRIMARY_TEXT, S_SERIF, 0.04)
    target = sw * 0.70
    s_sans = size_for_width(SANS_SB, SECONDARY_TEXT, 0.24, target)
    nd, nw = shape_run(SANS_SB, SECONDARY_TEXT, s_sans, 0.24)
    ncap = cap_height(SANS_SB, s_sans)

    w = sw + 2 * pad_x
    cx = w / 2
    y = pad_y + serif_cap
    parts = [g(sd, cx - sw / 2, y, ink)]
    rule_y = y + 24
    parts.append(f'<rect x="{cx - target/2:.2f}" y="{rule_y:.2f}" '
                 f'width="{target:.2f}" height="3.2" fill="{accent}"/>')
    base = rule_y + 3.2 + 22 + ncap
    parts.append(g(nd, cx - nw / 2, base, ink))
    h = base + pad_y
    return svg_doc(w, h, "".join(parts), bg=bg,
                   title="Lucas & Liam Legacy Studios")

# ---------------------------------------------------------------------------
# Watermark — compact white horizontal at 40% opacity, for footage/photos.
# ---------------------------------------------------------------------------
def watermark_svg():
    inner = horizontal_svg(WHITE, WHITE, secondary_fill=WHITE, bg=None)
    # unwrap and re-wrap with opacity group
    import re
    m = re.match(r'(<svg[^>]*>)(.*)</svg>$', inner, re.S)
    head, body = m.group(1), m.group(2)
    return head + f'<g opacity="0.4">{body}</g>' + "</svg>"

# ---- emit -----------------------------------------------------------------
def write(name, content):
    p = os.path.join(OUT, name)
    with open(p, "w") as f:
        f.write(content)
    print("wrote", name, f"({len(content)//1024} KB)")

# 1. Primary horizontal (full colour, transparent bg)
write("ll_legacy_primary_horizontal.svg", horizontal_svg(NAVY, BRASS))
# 2. Stacked (full colour, transparent bg) — the refined Concept #4
write("ll_legacy_stacked.svg", stacked_svg(NAVY, BRASS))
#    Stacked with descriptor (optional use)
write("ll_legacy_stacked_descriptor.svg", stacked_svg(NAVY, BRASS, descriptor=True))
# 3. Monogram / icon
write("ll_legacy_monogram.svg", monogram_svg(NAVY, BRASS))
write("ll_legacy_monogram_black.svg", monogram_svg(BLACK, BLACK))
write("ll_legacy_monogram_white.svg", monogram_svg(WHITE, WHITE))
write("ll_legacy_monogram_on_navy.svg", monogram_svg(OFFWHITE, BRASS, bg=NAVY))
# 4. Full-colour presentation versions (on brand fields)
write("ll_legacy_stacked_on_offwhite.svg", stacked_svg(NAVY, BRASS, bg=OFFWHITE))
write("ll_legacy_stacked_on_navy.svg",
      stacked_svg(OFFWHITE, BRASS, bg=NAVY))
write("ll_legacy_primary_horizontal_on_navy.svg",
      horizontal_svg(OFFWHITE, BRASS, bg=NAVY))
# 5. One-colour black
write("ll_legacy_primary_horizontal_black.svg",
      horizontal_svg(BLACK, BLACK, secondary_fill=BLACK))
write("ll_legacy_stacked_black.svg", stacked_svg(BLACK, BLACK, secondary_fill=BLACK))
# 6. One-colour white
write("ll_legacy_primary_horizontal_white.svg",
      horizontal_svg(WHITE, WHITE, secondary_fill=WHITE))
write("ll_legacy_stacked_white.svg", stacked_svg(WHITE, WHITE, secondary_fill=WHITE))
# 8. Sponsor-safe small-size
write("ll_legacy_smallsize.svg", smallsize_svg(NAVY, BRASS))
write("ll_legacy_smallsize_black.svg", smallsize_svg(BLACK, BLACK))
# 9. Watermark-ready
write("ll_legacy_watermark.svg", watermark_svg())

print("\nserif width:", round(serif_w, 1), "| sans size:", round(S_SANS, 1),
      "| desc size:", round(S_DESC, 1))

# ---------------------------------------------------------------------------
# Sponsor tile — for event templates (e.g. Harbour Wars) that layer the logo
# onto a white rounded tile. Sponsor-safe cut, scaled to fill, pure white or
# transparent, sized to survive social-media compression.
# ---------------------------------------------------------------------------
def sponsor_tile_svg(w, h, bg=WHITE, fill_ratio=0.88):
    import re
    inner = smallsize_svg(NAVY, BRASS)
    m = re.search(r'viewBox="0 0 (\d+) (\d+)"', inner)
    iw, ih = int(m.group(1)), int(m.group(2))
    body = re.match(r'<svg[^>]*>(.*)</svg>$', inner, re.S).group(1)
    sc = min(w * fill_ratio / iw, h * fill_ratio / ih)
    tx = (w - iw * sc) / 2
    ty = (h - ih * sc) / 2
    wrapped = f'<g transform="translate({tx:.2f} {ty:.2f}) scale({sc:.4f})">{body}</g>'
    return svg_doc(w, h, wrapped, bg=bg, title="Lucas & Liam Legacy Studios")

write("ll_legacy_sponsor_tile_fit_white.svg", smallsize_svg(NAVY, BRASS, bg=WHITE))
write("ll_legacy_sponsor_tile_5x4_white.svg", sponsor_tile_svg(1500, 1200))
write("ll_legacy_sponsor_tile_square_white.svg", sponsor_tile_svg(1400, 1400))
write("ll_legacy_sponsor_tile_5x4_transparent.svg", sponsor_tile_svg(1500, 1200, bg=None))
