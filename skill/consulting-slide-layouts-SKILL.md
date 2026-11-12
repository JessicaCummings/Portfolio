---
name: "consulting-slide-layouts"
description: "Use when building or redesigning a slide deck (Slides artifact or .pptx) that should read like a top-tier consulting deck: action titles, one exhibit per slide, varied layouts, data drawn to scale."
---

# Consulting slide layouts

Jess's standard for decks: content slides read like a strategy-firm exhibit. They should never be a row of look-alike cards under a corner label. Title and section-divider slides stay big, bold and branded. Content slides do the analytical work.

This skill covers layout and writing only. The file format comes from the Slides artifact type or the pptx skill. Colors and type come from the brand's design system. Mark-level chart specs (stroke widths, spacers, palette validation) come from the dataviz skill. This skill decides which exhibit to use, how it sits on the slide, and what it has to prove. The default brand is Constrat (ConStrat AI): read its README and tokens first, as described at the end.

## 1. Plan the story before any layout (the "ghost deck")

1. Write every slide's action title first, as a list. Read only the titles, in order. They must tell the whole argument. If they don't, fix the story before designing anything.
2. Group the slides into 3–6 sections. Each section opens with a divider slide.
3. For each content slide, name the one exhibit that proves its title (see the library below). If two slides in a row would use the same exhibit, change one of them, unless they are a deliberate build (step 5).
4. **Data storyboard.** Next to each title, list every number the slide needs, its source, and whether you actually have it. Anything missing becomes `[__]` now, not at the end. If a slide's key number is missing, flag it in the reply before designing that slide.
5. **Builds are allowed, sparingly.** When one exhibit needs several steps to land (first the whole, then a filter, then the one segment that matters), repeat it on 2–3 consecutive slides. Keep the frame identical and change only what's highlighted. Each step gets its own action title. Allow at most one build per section.

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

**Every number needs a comparison.** A number alone is trivia. Each hero or stat number carries one reference in words: versus last period, versus target, versus a benchmark, or its base ("of 1,240 schools"). Write deltas with sign, unit and period ("+18% vs. Q2"). Never use an arrow without the sign.

**Tie the title to the exhibit.** In the action title, underline the phrase that names the highlighted data with a 4px accent rule, so the eye moves from claim to proof. The text itself stays ink. Never color title text.

## 3. Slide types that stay bold

- **Cover:** a brand ground (orbits on ink), the reversed lockup, a huge title and a one-line promise.
- **Section divider:** a mono number (28px), a 160px title anchored bottom-left, and a one-line subtitle, on a brand ground (orbits on blue, blueprint, orbits on ink, quiet paper-deep). Rotate the grounds between sections.
- **Orange statement slide:** at most one per deck, with one bold white line at 120px.
- **Closer or ask:** a decision table on ink, with an illustration bled off the right edge.
- **Numeral divider (variant):** the section number as a cropped graphic numeral about 560px tall, bled off the bottom edge in a tint of the ground, with the 160px title beside it. It's a graphic, not text in the type scale. Use it for every divider in a deck, or for none.
- **Agenda tracker (variant):** on paper-deep, all section names at 52px. The current section is in ink, weight 700, with the 4px accent rule; the rest are in stone, weight 400. Use it instead of the standard divider in long readouts and workshops, where people need to know where they are.

## 4. Exhibit library: pick by what the title claims

| The title claims… | Use this layout | Build notes |
|---|---|---|
| What we propose and why | **SCR executive summary** | Three ruled rows (Situation, Complication, Resolution), each with a 300px label column. Resolution gets the shaded row, an accent left border and the most words. |
| A few documented facts | **Stat strip and kicker** | 3 big numbers (120px) split by vertical hairlines. The label under each includes its comparison ("vs. 2024", "of 1,240 schools"), with a source in mono. A kicker band below turns them into the problem. No tinted cards behind the numbers. |
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

Never use the same exhibit twice in a row, except in a build (section 1, step 5). A 15–20 slide deck should use at least 8 different exhibits.

### 4b. Data exhibits, by the job the numbers do

Pick the job first (part of a whole, change over time, comparison, what people said), then the exhibit.

| The title claims… | Use this layout | Build notes |
|---|---|---|
| **Part of a whole** | | |
| One share ("6 in 10 teachers skip it") | **Unit chart** | A 10×10 grid of dots, or one row of 10. The share is in the accent and the rest in stone, with the number at 120px beside it. Say "6 in 10" when the base is people. |
| A share of a share ("90% occupied; of those, 62% rent") | **Fraction chain** | One line per step: the number at 120px, then a row of 10 circles, with the remainder as a partial circle. The second line starts "of those". |
| Parts of one total, 5 or fewer | **100% band** | One full-width bar with segments labeled inside in horizontal text. A segment too narrow for its label gets a leader line. Replaces pies and donuts. |
| How segments differ in size and in mix | **Marimekko** | Column width = segment size, stacked height = mix. Labels go inside, with one highlighted cell. Add a "How to read" line. |
| **Change over time** | | |
| A number that has grown | **Hero number over its history** | The hero number (120px) and its label sit top-left. Below, one column per period stands on a baseline just above the footer. A ruled header row over the columns carries each period and value, so there's no axis. The latest column is in the accent, with a growth tag ("+32% YoY"). For two related metrics, use two panels side by side. |
| A trend with a turning point | **Annotated line** | A 2px line. Mark the event with a vertical hairline and a short label, label the end value at the line's end, and name the phases along the bottom. |
| Change between two dates for 4–12 items | **Slope chart** | "Then" and "now" axes, with labels and values at both ends. The item that matters is in the accent, the rest in stone. |
| When something happens (day, week, hour) | **Heat strip** | A grid of cells in 4–5 tints of one hue, with the peak column labeled with its value. |
| What moved us from A to B | **Waterfall bridge** | Start and end bars in ink. Increases and decreases float between them, each with a signed label, joined by hairline connectors. |
| **Comparison** | | |
| A ranking | **Sorted bars** | Horizontal, largest on top, with the value at each bar's end. No axis, one accent bar. |
| A gap between two groups across items | **Dumbbell** | Per row, two dots joined by a hairline. Rows are sorted by the gap, with the gap labeled on the right. |
| Results against a target | **Bullet bars** | The actual as a dark bar, the target as a vertical tick, the acceptable range as a stone band. Replaces gauges, dials and progress rings. |
| Agreement or sentiment | **Diverging stacked bar** | Disagree to the left of a center line, agree to the right, neutral in grey split across the center. Rows are sorted by net agreement. |
| How big the market is | **Nested circles, to scale** | TAM, SAM and SOM as circles resting on one baseline, with area proportional to value and labels on leader lines. If SOM is under 2% of TAM, use a bar comparison instead: the circle would disappear. |
| One measure across 3–8 segments | **Small multiples** | Identical mini-charts in a grid, with the same scale and order and one highlight carried across all of them. Panel titles are the only labels. |
| **What people said** | | |
| What users or customers told us | **Verbatim quote** | One quote at 52px, weight 400, with the 3–6 words that carry the finding in weight 700. Attribution is a participant code in mono ("P07 · teacher, 6 yrs"). Add up to two shorter supporting quotes at 30px, so it isn't one person's view. |

### 4c. Chart craft

- **Every big number is also a chart.** A hero number sits next to a mark that shows it to scale: a unit chart, a fill against a 0–100 scale, or its own history. A number alone in a tinted box isn't an exhibit.
- **Label the data, not the chart.** Put values on the marks or at their ends and drop the value axis, but keep the baseline stated. Two or more series get direct labels plus a one-line legend.
- **One hue, many tints.** Context series are tints of stone or of the data color, never new hues. The accent is reserved for the one thing that matters.
- **Texture before a second color.** When two context series sit side by side, or the deck may be printed in greyscale, separate them with hatch density (dense versus sparse 45° lines). This keeps meaning out of color alone.
- **Explain a new chart once.** The first time a Marimekko, slope, dumbbell, bullet or diverging bar appears, add one "How to read" line with a leader line to a single mark.
- **One axis per chart.** Never two y-scales. Two measures get two panels.
- **Never:** pies, donuts, gauges, progress rings, 3D, gradient-faded bars (the fade reads as a change in value), shadows on data, or rotated text.
- **Don't copy from inspiration boards:** bento grids of KPI cards in a different color each, decorative 3D objects and stickers, percentages placed inside arches or blobs, shapes or icons sized by eye, or rainbow palettes. Take the layout idea, then rebuild it to these rules.

## 5. Honesty rules (non-negotiable)

- Never invent a number, source, date, owner or quote. Use `[__]` placeholders and list them in the reply.
- Bars are drawn to scale, for example peak 380px and trough 380 ÷ 21.4 ≈ 18px. If a bar can't be to scale, say so on the slide.
- A source line gives only what the source document says. Don't embellish it (no added program names or years).
- Label illustrative or sample data as illustrative, on the slide.
- Any shape that shows a value by its size scales by area (radius ∝ √value). Never size a circle, square or icon by eye.
- Unit charts count exactly: 85% is 85 of 100 dots.
- Bars start at zero. A line may start above zero only if the axis says so on the slide.
- Quotes are verbatim, attributed to a participant code, and never merged from several people.

## 6. Fit checks before publishing

- Title height ≈ 52 × 1.12 × lines + 34. The body has about 620px under a two-line title.
- Text width ≈ 0.6 × font size per character (bold +5%). Size every column to its longest word.
- A table row ≈ 2.1 × font size per line of text.
- Too much content? Split the slide. Never shrink the text below 24px.
- The footer source fits on one line (about 95 characters at 24px over 1400px); otherwise shorten it.
- No rotated text. If column labels don't fit, make the chart horizontal or split the slide.

## 7. Constrat defaults

Read the Constrat design system first (its README and tokens). Then:

- **Colors:** paper #eeebe4 is the ground; surface #f6f4ef marks highlights; ink #16181a for text and rules; ink-2 #4b4c4c for secondary text; rule #c2c0bb; stone #b3aea4 for context bars; data #1f4ba5 for primary data; signal #e4572e as the one highlight; signal-deep #b23c17 for orange text and for the High pill.
- **Type:** Inter Tight for titles and numbers, DM Mono for page numbers, divider numbers and source tags only.
- **Light first:** content slides on paper. Ink and blue are for dividers, the cover, callout sidebars and the closer.
- **Imagery:** an illustration or a brand ground, never both on one slide. Illustrations go in as PNGs (an SVG that relies on a style block renders blank), bled off an edge.