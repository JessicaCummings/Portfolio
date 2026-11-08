---
name: "consulting-slide-layouts"
description: "Use when building or redesigning a slide deck (Slides artifact or .pptx) that should read like a top-tier consulting deck: action titles, one exhibit per slide, varied layouts."
---

# Consulting slide layouts

Jess's standard for decks: content slides read like a strategy-firm exhibit. They should never be a row of look-alike cards under a corner label. Title and section-divider slides stay big, bold and branded. Content slides do the analytical work.

This skill covers layout and writing only. The file format comes from the Slides artifact type or the pptx skill, and colors and type come from the brand's design system. The default brand is Constrat (ConStrat AI): read its README and tokens first, as described at the end.

## 1. Plan the story before any layout (the "ghost deck")

1. Write every slide's action title first, as a list. Read only the titles, in order. They must tell the whole argument. If they don't, fix the story before designing anything.
2. Group the slides into 3–6 sections. Each section opens with a divider slide.
3. For each content slide, name the one exhibit that proves its title (see the library below). If two slides in a row would use the same exhibit, change one of them.

## 2. Anatomy of every content slide

The canvas is 1920×1080. Every element keeps its position on every slide, so flipping through, nothing jumps.

| Zone | Rule |
|---|---|
| Margins | 112px left and right, about 104px top. Nothing below y 920 except the footer row. |
| **Action title** | A full-sentence takeaway, 15 words or fewer where possible, never more than 2 lines. It states the conclusion ("The same loan carried 21.4× the hazard at the 2010 peak"), not the topic ("Credit cycle"). Set it in the display face at 52px, weight 700, letter-spacing −1px, full width, with a 2px ink rule under it and 32px of padding. If it needs "and" to hold two ideas, split the slide. |
| **No eyebrow or corner label** | Never put a mono label such as `05 · WHY IT CAN BE TRUSTED` above a content title. Section names belong on divider slides only. |
| Exhibit | One chart, diagram, table or structured layout that proves the title. No paragraphs. 2–4 supporting points at most. |
| Callout or kicker | Optional and at most one: a sidebar box (often dark) holding the single number that proves the title, or a bottom band with an accent left border saying "so what". |
| Footer | One pinned 24px row at bottom:56px. Left: the source ("Source: …"), required for any number. Right: deck name and page number in mono ("Stratum · 07"). |

**Color.** Context is grey (stone #b3aea4, rule #c2c0bb). Primary data is blue or ink. Exactly one highlight per slide in the accent (orange). Color never carries meaning alone: label it in words.

**Type scale.** Five sizes: 160 (divider titles), 120 (hero numbers), 52 (action titles), 26–30 (body), 24 (labels, footer). Nothing below 24px.

**Lines over boxes.** Separate with hairline rules and white space, not filled cards. Use a filled surface only to mark the one row, column or callout that matters.

## 3. Slide types that stay bold

- **Cover:** a brand ground (orbits on ink), the reversed lockup, a huge title and a one-line promise.
- **Section divider:** a mono number (28px), a 160px title anchored bottom-left, and a one-line subtitle, on a brand ground (orbits on blue, blueprint, orbits on ink, quiet paper-deep). Rotate the grounds between sections.
- **Orange statement slide:** at most one per deck, with one bold white line at 120px.
- **Closer or ask:** a decision table on ink, with an illustration bled off the right edge.

## 4. Exhibit library: pick by what the title claims

| The title claims… | Use this layout | Build notes |
|---|---|---|
| What we propose and why | **SCR executive summary** | Three ruled rows (Situation, Complication, Resolution), each with a 300px label column. Resolution gets the shaded row, an accent left border and the most words. |
| A few documented facts | **Stat strip and kicker** | 3 big numbers (120px) split by vertical hairlines, a label under each, a source in mono; a kicker band below that turns them into the problem. |
| One number versus another | **Bar comparison and sidebar** | 2–5 bars drawn **to scale**: grey context, one orange highlight, value labels on the bars, the axis baseline stated. The sidebar lists what this implies. |
| A ranking or score across groups | **Grouped horizontal bars** | Group by dataset so nobody compares across populations. Bars start at a stated baseline (e.g. 0.50 = chance). A dark callout holds the headline multiple. |
| How something is counted wrong | **Two-panel diagram** | Left: how it's counted today, in grey. Right: what it really is, in orange. Same boxes in both, with x-connector lines. One result line under each panel. |
| A process or method | **Process matrix** | Steps as colored column headers (last step in the accent), and the same rows under each (What it does / What it produces / Example) so readers compare across. |
| Evidence or source quality | **Table and formula sidebar** | Ruled table with a tier column labelled in words; only the risky row is shaded. A dark sidebar shows the logic as a stacked equation. |
| Several channels or surfaces | **Ruled columns** | 3 columns divided by hairlines, each with an icon, name, "used by" line and description. A small paired bar if a number appears. |
| Who sees what | **Coverage matrix** | Audiences down the side, surfaces across the top, a filled dot where they meet and an en dash where they don't, plus a legend in the footer. |
| Many safeguards or reasons | **Grouped list (3 × 3)** | Nine points grouped under 3 ideas, each with a colored top rule. Bold title plus one line per point. A limits box below keeps it honest. |
| A schedule | **Gantt** | Workstreams down the side, weeks across. Each bar is labelled with its done-when test; partial weeks use % widths; milestones are diamonds. |
| Risks | **Risk register** | Ruled rows: risk, likelihood as a labelled pill (High in dark orange, Medium in paper-deep) and mitigation. Only the top risk's row is shaded. |
| A fallback order | **Staircase** | Steps offset 80px each and lightening (ink, ink-soft, ink-2) so the last resort reads as least wanted. Deferred items in a grey list on the right. |
| What it costs | **Cost table and ownership sidebar** | The one real cost row shaded with its estimate in the accent. The sidebar separates what engineering stands behind from what finance owns. |
| Decisions needed | **Decision table** | Number, approval, and "needed for" date. On ink, with an illustration cut off at the right edge. |
| Two options or states | **Before / after split** | Two halves (paper-deep versus ink), identical categories in identical order. |
| Priorities across two variables | **2×2 matrix** | Both axes named and independent; items placed honestly; the target quadrant tinted. |
| A sequence over time | **Timeline** | A heavy ink rail with ticks, each tick bearing a date and an outcome. Launch in the accent. |

Never use the same exhibit twice in a row. A 15–20 slide deck should use at least 8 different exhibits.

## 5. Honesty rules (non-negotiable)

- Never invent a number, source, date, owner or quote. Use `[__]` placeholders and list them in the reply.
- Bars are drawn to scale, for example peak 380px and trough 380 ÷ 21.4 ≈ 18px. If a bar can't be to scale, say so on the slide.
- A source line gives only what the source document says. Don't embellish it (no added program names or years).
- Label illustrative or sample data as illustrative, on the slide.

## 6. Fit checks before publishing

- Title height ≈ 52 × 1.12 × lines + 34. The body has about 620px under a two-line title.
- Text width ≈ 0.6 × font size per character (bold +5%). Size every column to its longest word.
- A table row ≈ 2.1 × font size per line of text.
- Too much content? Split the slide. Never shrink the text below 24px.
- The footer source fits on one line (about 95 characters at 24px over 1400px); otherwise shorten it.

## 7. Constrat defaults

Read the Constrat design system first (its README and tokens). Then:

- **Colors:** paper #eeebe4 is the ground; surface #f6f4ef marks highlights; ink #16181a for text and rules; ink-2 #4b4c4c for secondary text; rule #c2c0bb; stone #b3aea4 for context bars; data #1f4ba5 for primary data; signal #e4572e as the one highlight; signal-deep #b23c17 for orange text and for the High pill.
- **Type:** Inter Tight for titles and numbers, DM Mono for page numbers, divider numbers and source tags only.
- **Light first:** content slides on paper. Ink and blue are for dividers, the cover, callout sidebars and the closer.
- **Imagery:** an illustration or a brand ground, never both on one slide. Illustrations go in as PNGs (an SVG that relies on a style block renders blank), bled off an edge.