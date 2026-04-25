# 07 — Mistakes and Lessons

> Honest log of dead-ends, wrong assumptions, and fixes. The only way to stop repeating mistakes is to write them down when they happen. **If this file is empty at the end of a long session, you are either not being honest or not being ambitious enough.**

Format per entry:

```
## YYYY-MM-DD — short label

**What happened:** concrete description of the mistake or dead-end.
**Why it happened:** root cause (not "I forgot" — dig deeper).
**Fix:** what actually resolved it.
**How to avoid next time:** a specific rule or check that would have caught it.
```

---

## 2026-04-21 — Asked "do you have a brand?" instead of "what visual materials exist?"

**What happened:** Early in the kickoff I asked the owner whether IST Auto had any brand identity or assets. The answer was "nothing at all, no brand identity". I spent time inventing a starter palette and font pair. Later, they pointed me to a `Materials/` folder containing an Autovit banner with their existing logo, colors, phone number, address, tagline, and service list — all real, all already in public circulation.
**Why it happened:** I asked the wrong question. "Brand identity" sounds formal to a non-designer, so the answer was technically true ("no formal brand guidelines") but practically misleading — they *do* have a banner with real visual assets and real business info.
**Fix:** Extracted the palette (`#0F1419` dark, `#E53935` red), logo treatment ("IST auto" with car silhouette), tagline ("12 luni garanție fără limită de km"), phone (0740 346 163), address (Str. Corneliu Coposu 167, Cluj-Napoca), and services directly from the banner. Updated [02-client-data.md](02-client-data.md), [03-brand-identity.md](03-brand-identity.md), and [06-decisions-and-rationale.md](06-decisions-and-rationale.md).
**How to avoid next time:** For any new brand-site project, the first Phase A question must be: *"What existing visual materials do you have, even informal ones? (banners, business cards, social-media headers, Autovit/OLX ads, printed flyers, logo you made in Canva, anything at all)"*. Not `"Do you have a brand identity?"`. Ask the narrower, concrete question. This is skill-extraction material.

---

## 2026-04-21 — `qlmanage` + `sips -z` silently squashed an SVG with a non-square viewBox

**What happened:** Generating the 1200×630 Open Graph image from `og.svg`, I ran `qlmanage -t -s 1200 og.svg` followed by `sips -z 630 1200`. Output was 1200×630 as requested, but the content was horizontally squashed and the right edge of text was cut off — `"de km"` and `"Livra..."` ran past the visible area.
**Why it happened:** `qlmanage -t` generates a **square thumbnail** (for file-browser previews) regardless of the source SVG's aspect ratio. It placed the 1200×630 SVG content into a 1200×1200 frame, fitting to width and padding height. Then `sips -z 630 1200` took absolute target dimensions and stretched the square source to 1200×630, squashing everything horizontally by ~47%. Neither tool warned about aspect mismatch.
**Fix:** Render via Chrome headless with an explicit window size: write a tiny wrapper HTML that embeds the SVG at `width="1200" height="630"`, then `google-chrome --headless --window-size=1200,630 --screenshot=og.png file://.../_og_render.html`. Respects the SVG's aspect ratio exactly. Convert PNG → JPG with `sips -s format jpeg -s formatOptions 88`. The same pattern produced the PNG favicon set cleanly (render square SVG at 512, then `sips -z` down to 192/180/48/32/16 — square-to-square is safe).
**How to avoid next time:** Never use `qlmanage` for exact-dimension image generation — it's a thumbnailer. For any SVG → raster at a specific non-square size, use Chrome headless (always available on macOS dev machines) with an HTML wrapper that pins dimensions. `sips -z` only preserves aspect ratio if one target dimension is zero or matches the source; with two non-matching dims, it stretches silently.

---

## 2026-04-21 — `background: currentColor; color: X` in the same hover rule makes the button invisible

**What happened:** The `.btn--ghost:hover` rule was written as `background: currentColor; color: var(--c-dark)`. Intent was: invert the button on hover — bg becomes whatever the text color currently is (dark on light sections, white in the hero), text becomes the opposite. In practice the three Facebook/Instagram/OLX ghost buttons in the contact section (light background) went dark-bg + dark-text on hover — text was invisible. Owner flagged it: "the text should be white not black."
**Why it happened:** `currentColor` resolves to the element's **computed** `color`, not the color it had *before* the `:hover` pseudo-class matched. When `color` and `background: currentColor` are set in the same rule, they resolve together — so `background` ends up equal to the new `color`, not the old one. The trick only works if the rule sets `background: currentColor` **without** also changing `color` in the same ruleset. A per-section override that later set `color: var(--c-dark)` on the hero case kept the hero looking vaguely right, but in light sections both ended up dark.
**Fix:** Stopped using `currentColor` for this inversion. Set explicit colors per section context: light-section hover → `background: var(--c-dark); color: var(--c-white); border-color: var(--c-dark);`. Dark-section / hero hover → the inverse (`background: var(--c-white); color: var(--c-dark); border-color: var(--c-white);`). Four concrete values, zero `currentColor` dependency.
**How to avoid next time:** Never combine `background: currentColor` with a `color:` change in the same rule — `currentColor` will follow the new value, not the old one. If the goal is a color-inversion on hover, set both colors explicitly. For the narrow case where `background: currentColor` *does* work (no `color` change in the same rule), add a comment saying so — the pattern reads as magic and attracts well-meaning "refactors".

---

## 2026-04-21 — (seeding) Don't skip the Memory write-back

**What happened:** N/A yet — seeding this file so the pattern is present from day one.
**Why it happened:** The memory system only works if every session writes back. The failure mode is obvious in hindsight: you do real work, get tired, skip the log, next session has to re-derive everything. This is the exact circle the project exists to break.
**Fix:** Treat the end-of-session write-back as part of "done". Work that is not logged in `05`, `06`, `07`, and `08` is not done.
**How to avoid next time:** Before claiming any task is finished, re-read [00-index.md](00-index.md) house rules and confirm the four files are updated.

---

## Anticipated pitfalls to watch for (pre-populated)

These haven't happened yet, but are foreseeable traps on this stack. Convert each into a dated entry when it actually bites.

### OLX iframe may silently render blank instead of failing

OLX likely sends `X-Frame-Options: sameorigin` or a CSP that blocks embedding. An iframe that's blocked often renders as a blank white area rather than throwing a JS error the browser exposes. The fallback in `olx-embed.js` must therefore use a **load-timeout** (e.g. 3 seconds after `iframe.onload` doesn't fire, or `contentDocument` access throws) to decide to swap in the link card — not rely on `onerror`.

### Romanian diacritics rendering as `?` or boxes

If the font is loaded with a Latin-only subset, `ș` and `ț` render as fallback glyphs. Google Fonts requires `&subset=latin,latin-ext` (or `display=swap` on a URL that includes `latin-ext`). Always test with a word like `mașină` before claiming typography is done.

### GitHub Pages serves underscore-prefixed files as 404

By default GitHub Pages runs Jekyll, which ignores `_`-prefixed files. Fix: always commit a `.nojekyll` file at repo root. If you ever see a 404 on a file that exists, this is the first suspect.

### `wa.me` link format mistakes

`wa.me/` wants an E.164 number **without** `+` and **without** spaces (`40712345678`, not `+40 712 345 678`). The `?text=...` body must be URL-encoded. Use `encodeURIComponent()` in JS rather than hand-encoding — hand-encoding Romanian diacritics is where people lose hours.

### Hardcoding real phone/URL in multiple places

The owner will eventually change a number or switch OLX accounts. If the value is hardcoded in `index.html`, `en.json`, `ro.json`, and JSON-LD, you'll miss one. Pick a single source (likely a `<meta>` tag or a small `config.js`) and derive all other uses from it.

### Lighthouse SEO score dropping due to JS-rendered meta tags

If we swap `<title>` / `<meta description>` on language change via JS, Google still indexes the initial server-rendered HTML. That is acceptable, but **do not remove the initial Romanian meta tags** from the HTML source — Googlebot uses those for the primary-language indexing signal. The `<link rel="alternate" hreflang="en" href="...">` is what tells Google the English version exists.

### Assuming owner's service list

We don't actually know what services IST Auto offers. The default list in [02-client-data.md](02-client-data.md) is a guess. Do not ship with the guess unchallenged — confirm with the owner, or label the section clearly as "TODO: confirm".
