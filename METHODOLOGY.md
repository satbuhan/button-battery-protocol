# How these tools are built — methodology

This file exists so that **any** collaborator — a person, or any AI
assistant (Claude, ChatGPT, Gemini, or otherwise) — can pick up this project
in a new session and build the next tool the same way, without having to
reverse-engineer the conventions from scratch. If you are an AI reading
this because you were asked to build or extend a tool for this atlas, treat
this file as your instructions.

**Authors:** Dr. Özgür Karcıoğlu & Dr. Satuk Buğra Han Bozatlı.
**What this is:** a growing series of interactive, referenced
clinical-algorithm web tools, each converted from the authors' own
hand-drawn flowcharts or manuscript figures. Existing tools:
`aortic-dissection-protocol`, `agitation-delirium-protocol`,
`influenza-antiviral-protocol`, `nsaid-pain-protocol`,
`anticoagulant-reversal-protocol`, `obesity-critical-care-protocol`,
`dapagliflozin-overdose-protocol`, `lidocaine-prilocaine-protocol`,
`pte-thrombolysis-protocol`, `lmwh-nste-acs-protocol`,
`ketamine-head-injury-protocol`, `midazolam-clonazepam-protocol`,
`vasopressor-shock-protocol`, `wbct-trauma-protocol`,
`epinephrine-revisited-protocol`, `ketamine-indications-protocol`,
`tenecteplase-alteplase-stemi-protocol`, `cwa-blood-gas-protocol`,
`ccb-toxicity-protocol`, `haloperidol-adjunct-protocol`,
`succinylcholine-rocuronium-protocol`, `geriatric-pain-protocol`,
`metoclopramide-ondansetron-protocol`, `spontaneous-pneumothorax-protocol`,
`button-battery-protocol` (GitHub account: satbuhan). Hub page listing all
of them: `clinical-algorithm-atlas`.

## The one rule that overrides everything else

The authored algorithm — every box, every decision diamond, every drug
name, every numeric dose — must stay **byte-for-byte unchanged** from what
the authors drew or specified. You may add supplementary explanatory /
academic content only: what a step means, why the protocol calls for it,
cautions, and citations. Never "fix", paraphrase, round, or standardize a
`label`, `sub`, or `dose` field without the author team's explicit
sign-off — those fields are the algorithm itself, not prose. If you edit
`content.js`, grep the `NODES` array before and after your edit and
confirm every `label`/`sub`/`dose` string is identical. This includes
punctuation: splitting one authored box's text across `label` and `sub`
must not silently drop a semicolon, comma, or parenthesis that was present
in the original — reconstruct `label + " " + sub` and compare it against
the source, not just the words. The same fidelity rule has two directions,
not one: never invent punctuation the source doesn't have, but also never
add punctuation to "fix" a plain line break the source genuinely leaves
unpunctuated — a bare line break can correctly map to no inserted
character, to a preserved literal `\n` (see "Itemized / bulleted box
content" below), but never to a comma or semicolon you supplied yourself.

This extends to the diagram's own shape, not just its text: if a source
figure draws two visually separate, arrow-connected boxes where a first
read might see one box with an internal split, or draws only some of the
arrows a decision's downstream options might seem to deserve, preserve
exactly what is drawn — the number of boxes and the number and direction
of arrows are part of the authored algorithm too. When an automated
condensation step describes the figure in words, verify its claims
against the rendered figure itself before trusting them — this tool's own
build caught four such discrepancies (a false colour claim, a missing
arrow, two boxes wrongly merged into one, and a decision shape
misdescribed as a rectangle instead of a diamond; see
`assets/content.js`'s header comment and `button-battery-protocol`'s own
README for the details). When in doubt, crop the source image at native
resolution and look again rather than trusting an earlier description —
this also caught a real error in `ketamine-head-injury-protocol` (a
complication-decision box initially described as fanning out to all six
downstream boxes, when the source actually draws only two arrows out of
it).

## Repo structure — one GitHub repo per tool

Each tool is its **own** GitHub repository, with its own independent
GitHub Pages deployment — not a subfolder inside another tool's repo. (An
earlier version of this project put two tools in one repo; the GitHub
Pages deployments list mixed them together in a confusing way and this
was explicitly abandoned in favor of full separation. Don't repeat that.)

Each tool repo looks like this:

```
index.html          page structure, masthead, English-only disclaimer
                     (an earlier version of this project carried a Turkish
                     translation of the disclaimer too; that was dropped
                     project-wide — keep everything on these pages in
                     English, including the disclaimer, not just the
                     algorithm content),
                     footer with a single absolute cross-link (target="_blank"
                     rel="noopener") back to the atlas hub, plus a
                     "Report an issue" link straight to this repo's own
                     GitHub issues/new page — the hub's own grouped,
                     always-current gallery is the one place to browse
                     every tool now; don't reintroduce a per-tool sister
                     link list here.
assets/style.css     visual design — shared paper/ink/navy "journal"
                     palette across the atlas; the diagram grid (column
                     count and widths) adapted per tool to match how many
                     parallel branches that algorithm actually has
assets/content.js    single source of truth for content: REFERENCES[],
                     NODES[], GLOSSARY[] — schema below
assets/app.js        rendering + interaction: a LAYOUT + EDGES description
                     drives an SVG flowchart; click-to-expand detail panel
                     on desktop, bottom sheet on mobile
README.md            what the tool is, links to sister tools in the atlas,
                     status, disclaimer, how it's built, how to edit it
LICENSE.md           CC BY-NC-SA 4.0, both authors credited
```

No build step, no framework — plain static files that GitHub Pages serves
directly from the `main` branch root. Enabling Pages is a manual step in
the repo's Settings → Pages → "Deploy from branch" → `main` → `/ (root)` →
**Save** — the Save click is easy to miss. Don't assume Pages is live
because the branch/folder was picked; verify with
`gh api repos/<owner>/<repo> --jq '{has_pages}'`.

Creating the empty GitHub repository itself is a step only the human
author can do — an AI assistant working from an API-scoped session
typically cannot call a repo-creation endpoint. Ask the author to create
an empty repo (no README/.gitignore/license) via GitHub's web UI, then
clone into it and push.

## `content.js` schema

- `VERIFIED`: top-level `const VERIFIED = "YYYY-MM-DD";` (or `null`) -- the
  date this tool's content and citations were last built/checked together.
  Set it to the date you actually *finish* the citation-verification pass
  below, not when you started. Use `null` with an explanatory comment
  instead of a backfilled guess if verification is genuinely incomplete
  when you ship. `assets/app.js`'s References `<summary>` shows
  "(N) — verified <date>" when set, nothing extra when `null`.
- `REFERENCES`: array of `{id, kind, text, url}`. `url` can be `null` (or
  omitted) for a source with no stable link — e.g. an unpublished
  manuscript. When rendering references, skip the linked-URL line entirely
  if `url` is falsy; don't link to something that doesn't exist. If a
  trial is multi-arm and only two of its arms are the comparison this tool
  cites, say so directly in `kind` rather than citing it as if it were a
  plain two-arm trial.
- `NODES`: array of `{id, type, label, sub?, meaning, rationale,
  dose?: [[label, value], ...], cautions?: [...], refs: [...], tone?,
  certainty?, needsAuthor?}`. `needsAuthor: true` flags a number or claim
  that the author team still needs to confirm or source — flag it, never
  invent a plausible-sounding citation or number to fill the gap. `tone:
  "key"` marks the pivotal action box on a branch; `tone: "alarm"` marks a
  "do not" / contraindication box, or (as in `button-battery-protocol`) a
  critical safety-netting box the figure itself visually singles out — use
  sparingly, only where the algorithm itself does. `certainty?:
  "core"|"low"|"local"` is the new field this tool introduces — see below.
- `GLOSSARY`: array of `{match, full?, def}` — terms auto-linked (with a
  click-to-expand definition) inside the readout panel's prose. An
  abbreviation that appears directly inside a diagram box's own
  `label`/`sub` text is not auto-linked there (those fields render as
  plain text, deliberately, so the diagram stays exactly as authored) —
  expand those instead in a short `.abbrev-note` legend printed under the
  diagram, the same way the original flowchart would carry a legend.

### Cross-atlas concept links

Every tool fetches one shared file at runtime —
`https://satbuhan.github.io/clinical-algorithm-atlas/assets/concepts.json`
— which maps a `GLOSSARY` term (lowercased `match` string) to every tool
that independently defines the same term, each with its own `def`, `url`,
and the `id` of the node that term is actually linked from there (for
deep-linking straight to that box via `#node-<id>`, the same hash every
node button's own DOM id already uses). When a term in this tool's own
`GLOSSARY` has other tools listed against it, its click-to-expand
`.term-def` panel grows an extra "Also covered in: <tool> →" line,
rendered by `crossLinksHtml()` in `app.js`. The fetch is best-effort and
non-blocking — the page is byte-identical without it, just missing that
one extra line.

`concepts.json` itself is generated by hand-reviewing every term that
appears in 2+ tools' `GLOSSARY` arrays, not by blind string matching.
Regenerate it with `clinical-algorithm-atlas/tools/gen_concepts.py` and
push the one updated file to the hub repo whenever a new tool's `GLOSSARY`
is likely to overlap with an existing one. Every tool also sets its own
`TOOL_SLUG` constant near the top of `app.js` (its repo name).

### Itemized / bulleted box content

Most boxes flatten naturally to one line or to comma-separated prose. But
when a source box is genuinely drawn as a bulleted or enumerated list,
preserve it as literal `\n` line breaks inside the `sub` string, one item
per line, with `white-space: pre-line;` on both `.node__sub` and
`.readout__sub` — without it the browser collapses the `\n` characters
back into a single run-on line.

### A real backward FEEDBACK edge (`spontaneous-pneumothorax-protocol`)

`spontaneous-pneumothorax-protocol`'s source figure draws an actual
backward edge — a dashed arrow, labelled "Reassess", from a later box back
up to a decision one row above it. The existing `drawEdges()` same-row/
vertical logic assumes a target is level with or below its source, so this
needed a dedicated `variant === "loop"` branch, checked *before* the
generic row logic: it connects the source node's own top-right corner to
the target's right vertex with a fixed-size rightward bulge (a cubic
Bézier whose control points sit a constant distance further right than
either endpoint), clear of every box in the trunk. Styled as its own CSS
class, `.is-loop` (dashed, no arrowhead-omission — a loop edge still
denotes real flow direction). Reuse this `"loop"` variant directly for any
future tool whose source figure draws a genuine backward loop; it needs
only the two node ids regardless of which row either is on.

### Border style as evidence-certainty coding (`button-battery-protocol`)

Every earlier tool that distinguished strength of evidence did it with
`tone` (colour/background). `button-battery-protocol`'s source figure is
the first to instead encode it in **border style**, and says so directly
in its own caption: solid = guideline-concordant core step (all cited
guidance agrees); dashed, labelled "LOW CERTAINTY" = preclinical evidence,
case series or expert opinion; dotted, labelled "LOCAL PROTOCOL" =
guidance diverges or only one source recommends it.

Modelled as a new optional `certainty?: "core"|"low"|"local"` field on a
`NODES` entry (omit it, rather than writing `"core"` explicitly, for a
node the source draws with a plain solid border — `"core"` is the CSS
default, not a value every node needs to carry). `nodeEl()` in `app.js`
adds a class for the non-default cases only:

```js
if (n.certainty === "low") cls += " node--certainty-low";
if (n.certainty === "local") cls += " node--certainty-local";
```

and `style.css` maps those classes straight to `border-style`:

```css
.node--certainty-low { border-style: dashed; }
.node--certainty-local { border-style: dotted; }
```

A small `.scope__legend` block was added above the diagram in `index.html`
explaining the three border styles in plain language, and matching
`.swatch--core/--low/--local` mini-swatches reuse the same CSS so the
legend and the live diagram can never visually drift apart. This
generalizes directly: any future tool whose source figure encodes a
third dimension of meaning in border style (rather than introducing a
fourth `tone` value, which only ever varied fill/accent colour) can reuse
the same `certainty` field and class pattern.

One rendering choice, not a fidelity violation: the condensation step
described this tool's central decision box ("WHERE IS THE BATTERY?") as "a
wide rounded rectangle rather than a diamond," but the rendered figure
shows an unambiguous diamond. This tool still renders it with the atlas's
existing decision-diamond/hexagon clip-path convention — matching the
actual source, and consistent with every other tool's decision points —
rather than inventing a new shape because of what turned out to be an
incorrect condensation description.

## Citation verification — do not skip this (default rule — see exception below)

Every reference must be **independently verified** against a real primary
source (search for and open the actual paper, check the DOI resolves to
the claim being cited) before it goes in `REFERENCES`. Do not trust a
source list at face value, even one supplied by the authors' own
manuscript — reference lists can and do contain real errors.

> **Author-directed exception, granted per-tool — not a standing policy.**
> Seven tools so far have been built this way, each on its own explicit
> instruction from Dr. Bozatlı, not as a carried-over default:
>
> - `epinephrine-revisited-protocol` (2026) — 57 entries.
> - `ketamine-indications-protocol` (2026) — 47 entries.
> - `haloperidol-adjunct-protocol` (2026) — 74 entries.
> - `geriatric-pain-protocol` (2026) — 52 entries.
> - `metoclopramide-ondansetron-protocol` (2026) — 105 entries.
> - `spontaneous-pneumothorax-protocol` (2026) — 80 entries.
> - `button-battery-protocol` (2026) — asked directly whether to extend
>   the same policy to this tool's 92-entry bibliography (built from a
>   Gemini condensation of an unpublished SANRA structured narrative
>   review plus the authors' own Figure 1 PowerPoint slide), Dr. Bozatlı
>   selected "Yine istisna uygula (hızlı)" (apply the exception again,
>   quick) from the offered choices. 92 entries; 88 carry a manuscript DOI,
>   4 link to a cited web page instead (non-journal guideline/standard
>   sources), and 1 (no DOI, 1999) links to its PubMed record.
>
> In all seven cases the manuscript's own reference list is accepted as
> correct on the author's explicit instruction; every entry in
> `REFERENCES` is transcribed directly from the manuscript's own
> bibliography (DOIs as given, not independently re-resolved), and every
> entry's `kind` field says so plainly ("As cited in the manuscript; not
> independently re-verified"). **This still does not change the default
> rule above for any other tool, including future ones.** Each instance is
> a deliberate, recorded exception for that one build, made at the
> author's explicit direction for that specific manuscript — not a
> precedent a builder may apply on its own judgement just because it was
> used before. A future builder should run the full independent
> verification pass by default, and only skip it when the author gives
> this same explicit instruction again, for that specific tool, in that
> session — recording it in `content.js`'s header comment and in this
> file exactly as these entries do.

If the authors' own manuscript is itself the source for an algorithm and
is unpublished, cite it with `url: null` and note "in preparation" in
`text`/`kind` rather than inventing a fake link. Anything you cannot
independently verify gets flagged (`needsAuthor`-style) in the UI and in
`content.js` — it does not get a fabricated citation.

## Rendering / SVG edge routing (`app.js`)

`LAYOUT` (`{col, decision?, group?, row?}` per node) and `EDGES`
(`[fromId, toId, label?, variant?]`) drive the diagram. Pick the column
count and widths to match the algorithm's actual shape — two columns for
a genuine two-way fork, three equal columns for three parallel branches
(this tool's own layout: `OESOPHAGUS` / `STOMACH OR BEYOND THE PYLORUS` /
`NOSE OR EAR`, fanning out from a single central decision diamond), an
asymmetric `1fr 1.6fr 1fr` only when the center lane carries a decision
and the side lanes are branch outcomes (see `aortic-dissection-protocol`
for the original version of that pattern).

When a tool's branches are genuinely unequal in height (this tool: 4 boxes
in the oesophagus column, 3 in the stomach column, 1 in the nose-or-ear
column, all starting from the same row), rely on CSS Grid's own sparse
auto-placement rather than hand-assigning row numbers: give each node only
a `grid-column` (via a `.col-left`/`.col-center`/`.col-right` class) and
list `NODES` in careful **row-by-row document order** — the browser's
default placement cursor only ever advances forward, so a column index
lower than the cursor's current column within the same row forces a new
row, which naturally top-aligns columns of different heights without any
explicit `row` field. Getting the `NODES` array order wrong here (e.g.
grouping entries by column-chain instead of row-by-row) silently produces
a broken layout with no error — verify the intended row grouping with a
quick Playwright script that reads every node's live
`getBoundingClientRect().top` and groups by that value, the same way this
tool's own build caught and fixed exactly this ordering mistake before
shipping.

If two nodes end up sharing a pixel column with a third node sandwiched
between them, an edge between the outer two can visually cross straight
through the middle box. Diagnose this by sampling points along each
rendered SVG path (`path.getPointAtLength()`) and checking for
bounding-rect overlap against every *other* node's live
`getBoundingClientRect()` — don't just eyeball a screenshot. Fix it with a
small per-edge detour table (`DETOUR`) that routes the path around the
obstacle's live bounding rect at draw time, read fresh rather than
hardcoded as pixel offsets:

```js
const DETOUR = {
  "ent-removal->discharge": { obstacle: "gastric-position-note", side: "right", clearance: 16 }
};
```

This tool needed exactly one such entry: the right-column `ENT removal`
box converges on the full-width `discharge` box past the center column's
`gastric-position-note` box, which the default single-bezier path cut
straight through. `drawEdges()` checks `DETOUR[fromId + "->" + toId]` and,
when present, builds a 3-segment bezier/straight/bezier path around the
obstacle's live rect instead of the default curve.

## QA — do this yourself, every time, before calling something done

The authors do not want a manual test checklist handed back to them to run
— do the strict checking yourself, and let them catch real-world edge
cases from actual field use afterward:

- Syntax-check JS with a parse-only check (e.g. `node --check app.js`) —
  not by executing it in a bare Node context, which throws on missing
  browser globals and looks like a syntax error but isn't.
- Validate data integrity mechanically: every `NODES[].id` has a matching
  `LAYOUT` entry, every `EDGES` endpoint resolves to a real node id, every
  `NODES[].refs` entry resolves to a real `REFERENCES[].id`, and there are
  no duplicate node ids — don't just eyeball the arrays.
- Serve the folder locally and drive it with an automated browser at both
  a desktop width (~1360px) and a mobile width (~412px).
- Run the geometric overlap check (above) at both viewports and confirm
  zero hits before calling the diagram done.
- When the layout relies on CSS Grid sparse auto-placement (see above),
  separately confirm the resulting row grouping matches the intended
  structure — group every node's live bounding-rect top coordinate and
  check it against the planned row-by-row order, not just that nothing
  overlaps.
- Grep the content file before and after any edit to prove the authored
  `label`/`sub`/`dose` text is untouched — and specifically reconstruct
  `label + " " + sub` for every node and diff it against your own
  transcription of the source image, to catch a dropped semicolon, comma,
  or parenthesis that a careless split point can introduce.
- Click through a representative sample of nodes (including any node with
  zero references, and any node whose readout contains a glossary term)
  in the live rendered page and confirm zero console/page errors, the
  references list renders every entry, and a glossary term expands on
  click.
- Verify a git push actually landed by checking the remote directly
  (`git ls-remote`, `git ls-tree -r origin/main --name-only`) rather than
  trusting the push command's own output.

## Tone / working style

Explicit, direct instructions over general guidance; honest, critical
findings over reassurance. If something isn't actually working yet (a
page not deployed, a reference not verifiable), say so plainly rather than
assuming it's probably fine.
