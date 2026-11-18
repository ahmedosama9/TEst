"""Builds the tiny Turkish/Kurdish glyph supplements in public/fonts (≈3 kB each).

Why: Turkish and Kurmanji need only ğ Ğ İ ş Ş beyond the "latin" font subset. Google's
"latin-ext" files that contain them weigh ~230 kB for the three fonts used here. These
supplements carry just those glyphs (variable weight kept) and are declared in globals.css
with a matching unicode-range, so the big latin-ext files are never requested.

Run after `npm run build` (it reads the font files next/font downloaded into .next/static/media):
    pip install fonttools brotli && python3 scripts/derive-font-supplement.py
Fonts: Inter and Montserrat, SIL Open Font License 1.1.
"""
import glob
import os
from fontTools import subset
from fontTools.ttLib import TTFont

NEED = [0x11E, 0x11F, 0x130, 0x15E, 0x15F]
OUT = {("Inter", False): "inter-tr-ku.woff2", ("Montserrat", False): "montserrat-tr-ku.woff2", ("Montserrat", True): "montserrat-italic-tr-ku.woff2"}

for path in sorted(glob.glob(".next/static/media/*.woff2")):
    probe = TTFont(path)
    cmap = probe.getBestCmap()
    if not all(c in cmap for c in NEED):
        continue
    key = (probe["name"].getDebugName(1).split()[0], probe["post"].italicAngle != 0)
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["kern", "locl", "mark", "mkmk", "ccmp"]
    font = TTFont(path)
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=NEED)
    subsetter.subset(font)
    font.flavor = "woff2"
    target = os.path.join("public", "fonts", OUT[key])
    font.save(target)
    print(target, os.path.getsize(target), "bytes")


# --- Arabic: Noto Sans Arabic limited to the Arabic block (U+0600–06FF) and weights 400–700.
# Source: the "arabic" variable file of @fontsource-variable/noto-sans-arabic (OFL 1.1), passed as
#   python3 scripts/derive-font-supplement.py path/to/noto-sans-arabic-arabic-wght-normal.woff2
# Extended Arabic letters for other languages (e.g. Urdu, Sorani additions beyond this block) are
# not included; widen ARABIC below and rerun before adding such a language.
import sys

if len(sys.argv) > 1:
    from fontTools.varLib import instancer

    ARABIC = list(range(0x600, 0x700)) + [0x200C, 0x200D, 0x200E, 0x200F, 0x2010, 0x2011, 0x25CC]
    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["*"]
    font = TTFont(sys.argv[1])
    subsetter = subset.Subsetter(options)
    subsetter.populate(unicodes=ARABIC)
    subsetter.subset(font)
    font = instancer.instantiateVariableFont(font, {"wght": (400, 700)})
    font.flavor = "woff2"
    font.save("public/fonts/noto-sans-arabic.woff2")
    print("public/fonts/noto-sans-arabic.woff2", os.path.getsize("public/fonts/noto-sans-arabic.woff2"), "bytes")
