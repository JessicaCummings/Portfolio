#!/usr/bin/env python3
"""Fails if any image on the site is missing alt text.

Checks three places images come from:
  1. <img> tags in the HTML pages
  2. case study figures in js/cases-data.js  ({ src: "...", alt: "..." })
  3. Play page art and slide decks in js/about-play.js

Empty alt (alt="") is allowed only where it is deliberate: an <img> whose src is
filled in by JavaScript (the alt is set at the same time), or one marked
decorative with aria-hidden="true" or role="presentation".

Run from the repo root:   python3 tools/check-alt.py
GitHub runs it on every push (.github/workflows/checks.yml).
"""
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
problems = []


def line_of(text, index):
    return text.count("\n", 0, index) + 1


# 1. <img> tags in HTML pages (skip generated route stubs: they have no images)
for page in sorted(ROOT.glob("*.html")):
    text = page.read_text()
    for m in re.finditer(r"<img\b[^>]*>", text):
        tag = m.group(0)
        alt = re.search(r'\balt="([^"]*)"', tag)
        src = re.search(r'\bsrc="([^"]*)"', tag)
        decorative = 'aria-hidden="true"' in tag or 'role="presentation"' in tag
        filled_by_js = src is not None and src.group(1) == ""
        where = f"{page.name}:{line_of(text, m.start())}"
        if alt is None:
            problems.append(f"{where}  <img> has no alt attribute: {tag[:80]}")
        elif not alt.group(1).strip() and not (decorative or filled_by_js):
            problems.append(f"{where}  <img> has empty alt but isn't marked decorative: {tag[:80]}")

# 2. Case study figures: every object with a src needs a non-empty alt
cases = ROOT / "js" / "cases-data.js"
text = cases.read_text()
for m in re.finditer(r"\{[^{}]*?\bsrc:\s*\"([^\"]+)\"[^{}]*?\}", text):
    if not re.search(r'\balt:\s*"[^"]+"', m.group(0)):
        problems.append(f"js/cases-data.js:{line_of(text, m.start())}  figure {m.group(1)} has no alt")

# 3. Play page: art needs alt; every slide needs a title (it becomes the slide's alt)
play = ROOT / "js" / "about-play.js"
text = play.read_text()
for m in re.finditer(r"\{[^{}]*?\bimg:\s*\"([^\"]+)\"[^{}]*?\}", text):
    if not re.search(r'\balt:\s*"[^"]+"', m.group(0)):
        problems.append(f"js/about-play.js:{line_of(text, m.start())}  art {m.group(1)} has no alt")
for m in re.finditer(r'\[\s*"([^"]+\.(?:jpg|jpeg|png|webp|gif))"\s*,\s*"([^"]*)"\s*\]', text):
    if not m.group(2).strip():
        problems.append(f"js/about-play.js:{line_of(text, m.start())}  slide {m.group(1)} has no title")

if problems:
    print("Missing alt text:\n  " + "\n  ".join(problems))
    sys.exit(1)
print("Alt text check passed: every image has alt text.")
