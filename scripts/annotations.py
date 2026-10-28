# /// script
# dependencies = ["pypdf"]
# ///
"""Recover the text under the owner's highlight and ink annotations (spec §11).

Run from the repo root:
    uv run scripts/annotations.py

Reads   source/Nuzhat al-Nazar - Ibn Hajar.pdf
Writes  source/highlights.txt (git-ignored; never commit it)

pypdf's visitor gives each text run with its start point but not per-glyph
positions, so glyph x positions inside a run are estimated from the font's
widths (falling back to an average width). A run's characters are kept when
their estimated point on the baseline falls inside an annotation area.
"""

from __future__ import annotations

import sys
from pathlib import Path

from pypdf import PdfReader

PDF = Path("source/Nuzhat al-Nazar - Ibn Hajar.pdf")
OUT = Path("source/highlights.txt")
TOL = 2.0  # points of slack around each quad / rect
AVG_W = 0.5  # fallback glyph width as a fraction of font size

Box = tuple[float, float, float, float]  # x0, y0, x1, y1


def mul(m: list[float], n: list[float]) -> list[float]:
    """Multiply two PDF affine matrices (m then n)."""
    a, b, c, d, e, f = m
    a2, b2, c2, d2, e2, f2 = n
    return [
        a * a2 + b * c2,
        a * b2 + b * d2,
        c * a2 + d * c2,
        c * b2 + d * d2,
        e * a2 + f * c2 + e2,
        e * b2 + f * d2 + f2,
    ]


def quads(annot) -> list[Box]:
    q = [float(v) for v in annot.get("/QuadPoints", [])]
    boxes = []
    for i in range(0, len(q) - 7, 8):
        xs, ys = q[i : i + 8 : 2], q[i + 1 : i + 8 : 2]
        boxes.append((min(xs), min(ys), max(xs), max(ys)))
    return boxes


def rect(annot) -> Box:
    x0, y0, x1, y1 = (float(v) for v in annot["/Rect"])
    return (min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1))


def inside(x: float, y: float, boxes: list[Box]) -> bool:
    return any(
        b[0] - TOL <= x <= b[2] + TOL and b[1] - TOL <= y <= b[3] + TOL
        for b in boxes
    )


def widths(font) -> tuple[int, list[float]] | None:
    """First char code and glyph widths (1/1000 em) for a simple font."""
    try:
        first = int(font["/FirstChar"])
        return first, [float(w) for w in font["/Widths"]]
    except (KeyError, TypeError):
        return None


def page_glyphs(page) -> list[tuple[str, float, float]]:
    """(char, x, baseline y) for every character on the page, x estimated."""
    out: list[tuple[str, float, float]] = []

    def visit(text, cm, tm, font, size):
        if not text or cm is None or tm is None:
            return
        m = mul(tm, cm)
        x, y = m[4], m[5]
        scale = (m[0] ** 2 + m[1] ** 2) ** 0.5 * (size or 1)
        ws = widths(font) if font is not None else None
        for ch in text:
            if ch in "\r\n":
                continue
            out.append((ch, x, y))
            w = AVG_W
            if ws is not None:
                code = ord(ch) - ws[0]
                if 0 <= code < len(ws[1]) and ws[1][code] > 0:
                    w = ws[1][code] / 1000
            x += w * scale

    page.extract_text(visitor_text=visit)
    return out


def text_in(glyphs: list[tuple[str, float, float]], boxes: list[Box]) -> str:
    kept = [ch for ch, x, y in glyphs if inside(x, y, boxes)]
    return " ".join("".join(kept).split())


def main() -> int:
    if not PDF.exists():
        print(f"missing {PDF}", file=sys.stderr)
        return 1
    reader = PdfReader(PDF)
    lines: list[str] = []
    counts = {"/Highlight": [0, 0], "/Ink": [0, 0]}
    for n, page in enumerate(reader.pages, start=1):
        annots = [a.get_object() for a in page.get("/Annots", []) or []]
        annots = [a for a in annots if a.get("/Subtype") in counts]
        if not annots:
            continue
        glyphs = page_glyphs(page)
        for a in annots:
            kind = a["/Subtype"]
            if kind == "/Highlight":
                boxes = quads(a) or [rect(a)]
                head = f"--- PAGE {n} /Highlight"
            else:
                boxes = [rect(a)]
                r = ", ".join(f"{v:.0f}" for v in boxes[0])
                head = f"--- PAGE {n} /Ink [{r}]"
            text = text_in(glyphs, boxes)
            counts[kind][0] += 1
            counts[kind][1] += bool(text)
            lines.append(head)
            lines.append(text)
            note = str(a.get("/Contents", "") or "").strip()
            if note:
                lines.append("> " + " ".join(note.split()))
    OUT.write_text("\n".join(lines) + "\n", encoding="utf-8", newline="\n")
    for kind, (total, found) in counts.items():
        print(f"{kind[1:]}: {found}/{total} with text")
    print(f"wrote {OUT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
