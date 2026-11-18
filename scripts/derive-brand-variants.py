"""Derives web variants from the approved logo (public/brand/source/logo-original.png).

The master file is never changed. Derived files (all pixel copies, no redrawing, no resampling
except the square icons):
  public/brand/logo.png          master with the empty transparent margin trimmed (light backgrounds);
                                 stray specks from background removal are cleared in all derived files
  public/brand/logo-on-dark.png  same pixels; only the dark-navy wordmark and divider are recoloured
                                 to white so the logo is legible on the navy header/footer
  public/brand/logo-symbol.png   the S symbol alone (cut from the master)
  public/brand/logo-mark.png     symbol on a navy square, 512 px (structured data, social profiles)
  public/brand/social-profile.png  symbol on a navy square, 1080 px
  src/app/icon.png, src/app/apple-icon.png   favicon / touch icon

Usage: python3 scripts/derive-brand-variants.py   (needs Pillow and numpy)
"""
from PIL import Image
import numpy as np

SRC = "public/brand/source/logo-original.png"
NAVY = (11, 16, 38, 255)
SYMBOL_END_X = 565  # the symbol ends left of this column; divider and wordmark start right of it

im = Image.open(SRC).convert("RGBA")
a = np.array(im)


def clean_strays(arr, min_area=220, keep_radius=3):
    """Removes background-removal leftovers (isolated specks and faint halos) from the DERIVED
    files only. Geometry is untouched: every pixel that belongs to, or lies within a few pixels
    of, a real shape (symbol, divider, letters, i-dots) is kept exactly as it is."""
    from PIL import ImageFilter
    solid = arr[..., 3] > 48
    h, w = solid.shape
    labels = np.zeros((h, w), dtype=np.int32)
    keep = np.zeros((h, w), dtype=bool)
    current = 0
    for y0, x0 in zip(*np.nonzero(solid)):
        if labels[y0, x0]:
            continue
        current += 1
        stack = [(y0, x0)]
        labels[y0, x0] = current
        pixels = []
        while stack:
            y, x = stack.pop()
            pixels.append((y, x))
            for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1), (y - 1, x - 1), (y - 1, x + 1), (y + 1, x - 1), (y + 1, x + 1)):
                if 0 <= ny < h and 0 <= nx < w and solid[ny, nx] and not labels[ny, nx]:
                    labels[ny, nx] = current
                    stack.append((ny, nx))
        if len(pixels) >= min_area:
            ys_, xs_ = zip(*pixels)
            keep[ys_, xs_] = True
    grown = np.array(Image.fromarray((keep * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(2 * keep_radius + 1))) > 0
    out = arr.copy()
    removed = int(((out[..., 3] > 0) & ~grown).sum())
    out[~grown, 3] = 0
    return out, removed


clean, removed = clean_strays(a)
print("stray pixels removed from derivatives:", removed)
display = Image.fromarray(clean)
ys, xs = np.where(a[..., 3] > 20)
pad = 12
box = (max(xs.min() - pad, 0), max(ys.min() - pad, 0), min(xs.max() + pad, im.width), min(ys.max() + pad, im.height))
display.crop(box).save("public/brand/logo.png", optimize=True)

dark = clean.copy()
rgb = dark[..., :3].astype(int)
is_navy = (rgb.max(axis=2) < 90) & (dark[..., 3] > 0)
is_navy[:, :SYMBOL_END_X] = False  # never touch the symbol (it has dark teal shading)
dark[is_navy, 0:3] = 255
Image.fromarray(dark).crop(box).save("public/brand/logo-on-dark.png", optimize=True)

# Symbol only: columns left of the divider, trimmed to its own bounding box.
sym = clean[:, :SYMBOL_END_X]
sy, sx = np.where(sym[..., 3] > 60)
symbol = display.crop((sx.min() - 4, sy.min() - 4, sx.max() + 5, sy.max() + 5))
symbol.save("public/brand/logo-symbol.png", optimize=True)

def square(size, out, scale=0.68, radius=0.0):
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    bg = Image.new("RGBA", (size, size), NAVY)
    if radius:
        from PIL import ImageDraw
        mask = Image.new("L", (size, size), 0)
        ImageDraw.Draw(mask).rounded_rectangle((0, 0, size - 1, size - 1), int(size * radius), fill=255)
        canvas.paste(bg, (0, 0), mask)
    else:
        canvas = bg
    target = int(size * scale)
    ratio = min(target / symbol.width, target / symbol.height)
    s = symbol.resize((round(symbol.width * ratio), round(symbol.height * ratio)), Image.LANCZOS)
    canvas.alpha_composite(s, ((size - s.width) // 2, (size - s.height) // 2))
    canvas.save(out, optimize=True)

square(512, "public/brand/logo-mark.png")
square(1080, "public/brand/social-profile.png", scale=0.6)
square(96, "src/app/icon.png", scale=0.74, radius=0.22)
square(180, "src/app/apple-icon.png", scale=0.7)
print("logo box", box, "symbol", symbol.size, "logo", Image.open("public/brand/logo.png").size)
