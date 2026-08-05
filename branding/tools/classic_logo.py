#!/usr/bin/env python3
"""
Lucas & Liam Legacy Studios — "classic" master: faithful vector rebuild of
Logo Concept #4 as posted (Cormorant Garamond serif, Montserrat sans,
tapered gold rule, cream field). Proportions measured from the source image.
"""
import os, re
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.misc.transform import Transform

HERE = os.path.dirname(os.path.abspath(__file__))
FONTS = os.path.join(HERE, "fonts")
SERIF = os.path.join(FONTS, "CormorantGaramond-Medium.ttf")
SANS = os.path.join(FONTS, "Montserrat-Medium.ttf")
OUT = os.path.join(HERE, "out_classic")
os.makedirs(OUT, exist_ok=True)

# ---- palette sampled from the source image --------------------------------
NAVY = "#23384A"
CREAM = "#F9F2E1"
GOLD_TEXT = "#B4824D"
GOLD_RULE = "#C9A254"
BLACK, WHITE = "#000000", "#FFFFFF"

_cache = {}
def _load(p):
    if p not in _cache:
        blob = hb.Blob.from_file_path(p); face = hb.Face(blob)
        tt = TTFont(p)
        _cache[p] = (face, hb.Font(face), tt, tt.getGlyphSet(), tt.getGlyphOrder())
    return _cache[p]

def shape_run(p, text, size, tracking_em=0.0):
    face, font, tt, gs, order = _load(p)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf)
    sc = size / face.upem; track = tracking_em * face.upem
    x, parts = 0.0, []
    n = len(buf.glyph_infos)
    for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
        pen = SVGPathPen(gs)
        gs[order[info.codepoint]].draw(TransformPen(pen,
            Transform(sc, 0, 0, -sc, (x + pos.x_offset) * sc, -pos.y_offset * sc)))
        d = pen.getCommands()
        if d: parts.append(d)
        x += pos.x_advance + (track if i < n - 1 else 0)
    return " ".join(parts), x * sc

def cap(p, size):
    tt = _load(p)[2]
    return tt["OS/2"].sCapHeight / tt["head"].unitsPerEm * size

def size_for_width(p, text, tracking_em, target):
    k = shape_run(p, text, 1.0)[1]
    return target / (k + tracking_em * (len(text) - 1))

def esc(s): return s.replace("&", "&amp;")

def svg_doc(w, h, body, bg=None):
    r = f'<rect width="{w:.0f}" height="{h:.0f}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {w:.0f} {h:.0f}" '
            f'width="{w:.0f}" height="{h:.0f}" role="img" '
            f'aria-label="{esc("Lucas & Liam Legacy Studios")}">{r}{body}</svg>')

def g(d, x, y, fill):
    return (f'<path transform="translate({x:.2f} {y:.2f})" fill="{fill}" '
            f'fill-rule="nonzero" d="{d}"/>')

# ---- type spec: measured from the 2000px source ---------------------------
# serif cap 127 px, width 1325; rule 897 wide, 63 below baseline; sans 856
# wide, cap ~52, top 57 below rule. All expressed at serif cap height = 127.
S_SERIF_CAPS = 127.0
S_SERIF = 100.0
serif_size = S_SERIF_CAPS / cap(SERIF, 1.0)          # font size for cap 127
TRACK_SERIF = 0.045
serif_d, serif_w = shape_run(SERIF, "LUCAS & LIAM", serif_size, TRACK_SERIF)
# match source width ratio serif_w/cap = 1325/127 = 10.43 by solving tracking
target_ratio = 1325.0 / 127.0
tr = TRACK_SERIF + (target_ratio * S_SERIF_CAPS - serif_w) / (len("LUCAS & LIAM") - 1) / serif_size
serif_d, serif_w = shape_run(SERIF, "LUCAS & LIAM", serif_size, tr)
serif_cap = S_SERIF_CAPS

SANS_TRACK = 0.38
sans_w_target = serif_w * (856.0 / 1325.0)
sans_size = size_for_width(SANS, "LEGACY STUDIOS", SANS_TRACK, sans_w_target)
sans_d, sans_w = shape_run(SANS, "LEGACY STUDIOS", sans_size, SANS_TRACK)
sans_cap = cap(SANS, sans_size)

RULE_W = serif_w * (897.0 / 1325.0)
RULE_H = 9.0                                          # solid core of taper
GAP_BASE_RULE = 63.0
GAP_RULE_SANS = 57.0

def tapered_rule(cx, y, w, h, fill):
    """Lens-shaped rule: pointed ends, full thickness in the middle."""
    x0, x1 = cx - w / 2, cx + w / 2
    return (f'<path fill="{fill}" d="M {x0:.2f} {y:.2f} '
            f'Q {cx:.2f} {y - h/2:.2f} {x1:.2f} {y:.2f} '
            f'Q {cx:.2f} {y + h/2:.2f} {x0:.2f} {y:.2f} Z"/>')

def lockup(ink, rule_fill, sec_fill):
    """Returns (body_parts_fn(cx, baseline_y) -> str, block_w, asc, desc)."""
    def body(cx, y):
        parts = [g(serif_d, cx - serif_w / 2, y, ink)]
        ry = y + GAP_BASE_RULE
        parts.append(tapered_rule(cx, ry, RULE_W, RULE_H, rule_fill))
        sb = ry + GAP_RULE_SANS + sans_cap
        parts.append(g(sans_d, cx - sans_w / 2, sb, sec_fill))
        return "".join(parts)
    block_h_above = serif_cap            # above baseline
    block_h_below = GAP_BASE_RULE + GAP_RULE_SANS + sans_cap
    return body, serif_w, block_h_above, block_h_below

def canvas(w, h, ink=NAVY, rule=GOLD_RULE, sec=GOLD_TEXT, bg=CREAM, vpos=0.485):
    """Logo block centred at vpos of canvas height (0.485 = as posted)."""
    body, bw, asc, desc = lockup(ink, rule, sec)
    scale = 1.0
    max_w = w * 0.665                    # source: 1325 / 2000
    if bw > max_w or True:
        scale = max_w / bw
    block_h = (asc + desc) * scale
    cy = h * vpos
    y = cy - block_h / 2 + asc * scale   # baseline in canvas coords
    inner = body(0, 0)
    wrapped = (f'<g transform="translate({w/2:.2f} {y:.2f}) scale({scale:.5f})">'
               f'{body(0, 0)}</g>')
    return svg_doc(w, h, wrapped, bg=bg)

def tight(ink=NAVY, rule=GOLD_RULE, sec=GOLD_TEXT, bg=None, pad=90):
    body, bw, asc, desc = lockup(ink, rule, sec)
    w = bw + 2 * pad
    h = asc + desc + 2 * pad
    wrapped = f'<g transform="translate({w/2:.2f} {pad + asc:.2f})">{body(0,0)}</g>'
    return svg_doc(w, h, wrapped, bg=bg)

def watermark():
    inner = tight(WHITE, WHITE, WHITE)
    m = re.match(r'(<svg[^>]*>)(.*)</svg>$', inner, re.S)
    return m.group(1) + f'<g opacity="0.4">{m.group(2)}</g></svg>'

def write(name, content):
    open(os.path.join(OUT, name), "w").write(content)
    print("wrote", name)

# masters (SVG)
write("ll_classic_square.svg", canvas(2000, 2000))                    # as posted
write("ll_classic_portrait_4x5.svg", canvas(1600, 2000))
write("ll_classic_landscape_16x9.svg", canvas(1920, 1080, vpos=0.5))
write("ll_classic_banner.svg", canvas(2560, 852, vpos=0.5))
write("ll_classic_story_9x16.svg", canvas(1080, 1920))
write("ll_classic_tight_fullcolour.svg", tight())                     # transparent
write("ll_classic_tight_on_cream.svg", tight(bg=CREAM))
write("ll_classic_tight_white_tile.svg", tight(bg=WHITE))             # sponsor tile
write("ll_classic_black.svg", tight(BLACK, BLACK, BLACK))
write("ll_classic_white.svg", tight(WHITE, WHITE, WHITE))
write("ll_classic_on_navy.svg", tight(CREAM, GOLD_RULE, GOLD_TEXT, bg=NAVY))
write("ll_classic_watermark.svg", watermark())
print("serif_w", round(serif_w, 1), "| sans size", round(sans_size, 1),
      "| rule w", round(RULE_W, 1))

# ---------------------------------------------------------------------------
# Descriptor variants: one quiet tracked line under the lockup, width-matched
# to 80% of the LEGACY STUDIOS line. The furthest the identity goes toward
# saying what the studio does — never a services list.
# ---------------------------------------------------------------------------
DESC = "ATLANTIC CINEMATIC STORYTELLING"
DESC_TRACK = 0.32
desc_size = size_for_width(SANS, DESC, DESC_TRACK, sans_w * 0.80)
desc_d, desc_w2 = shape_run(SANS, DESC, desc_size, DESC_TRACK)
desc_cap2 = cap(SANS, desc_size)

def tight_descriptor(bg=WHITE, pad=90):
    body, bw, asc, desc = lockup(NAVY, GOLD_RULE, GOLD_TEXT)
    gap = 46
    w = bw + 2 * pad
    h = asc + desc + gap + desc_cap2 + 2 * pad
    base = f'<g transform="translate({w/2:.2f} {pad + asc:.2f})">{body(0,0)}</g>'
    dy = pad + asc + desc + gap + desc_cap2
    dline = g(desc_d, w/2 - desc_w2/2, dy, NAVY)
    return svg_doc(w, h, base + dline, bg=bg)

write("ll_classic_tile_descriptor_white.svg", tight_descriptor())
write("ll_classic_tight_descriptor_transparent.svg", tight_descriptor(bg=None))
write("ll_classic_tight_descriptor_on_cream.svg", tight_descriptor(bg=CREAM))
