# CLAUDE.md — IST Auto Website

> This file is loaded into every Claude Code session for this project. **Read it, then open [Memory/00-index.md](Memory/00-index.md)** before touching any code.

---

## One-paragraph summary

**IST Auto** is a car-selling lot (parc auto) with **no website, no Google presence, and no brand identity**. We are building a small, fast, bilingual (Romanian + English) **static website** to give IST Auto a searchable online presence, and to funnel buyers to their OLX listings, WhatsApp, Facebook, and Instagram. In parallel, we are building a **persistent learning system** inside the `Memory/` folder so every future session can pick up the project cleanly, and so that — once this site ships — we can distill the reusable patterns into Claude Code skills for future brand websites.

---

## Non-negotiables

- **Tech stack**: plain HTML, CSS, vanilla JavaScript. **No frameworks. No build step. No npm.**
- **Hosting**: GitHub Pages. Everything must work as static files served from a flat folder. `.nojekyll` is required.
- **Languages**: Romanian (default) + English. Every user-visible string goes through the i18n system (`data-i18n` attributes + `assets/lang/ro.json` and `en.json`).
- **SEO is the whole point**: the client currently doesn't exist on Google. Every page change must preserve or improve meta tags, JSON-LD `LocalBusiness` / `AutoDealer` schema, semantic HTML, and Lighthouse SEO score.
- **No secrets, no backend, no database**. Contact happens via WhatsApp link (`wa.me/...`), Facebook, Instagram, OLX, and `tel:`.
- **Placeholders must scream**: anything not yet provided by the owner uses `TODO_*` (e.g. `TODO_WHATSAPP_NUMBER`) so it is trivial to grep before launch.

---

## Project conventions

- **File structure** is documented in the plan and in [Memory/04-website-spec.md](Memory/04-website-spec.md). Do not invent new top-level folders without logging the decision.
- **Single-page layout**: `index.html` contains Hero, About, Services, Listings (OLX), Contact — all anchor-linked from a sticky nav. Do not split into multiple HTML pages unless the content explicitly demands it.
- **Romanian diacritics** (ă â î ș ț) must render correctly. Always set `<meta charset="UTF-8">` and use fonts with full Romanian support (Inter / Poppins / Montserrat all qualify).
- **OLX listings are embedded via iframe with a JS fallback** (`assets/js/olx-embed.js`). OLX Romania may block iframe embedding via `X-Frame-Options`; the fallback swaps in a "View all listings on OLX →" card if the iframe fails to load.
- **Accessibility**: minimum contrast 4.5:1 for body text, 3:1 for large text. Every interactive element has a visible focus state.
- **Mobile first**: design at 375px width first, scale up.

---

## The Memory system — how to use it

The `Memory/` folder is **not documentation**. It is the project's working memory, written so that any LLM (me in a future session, or a different model) can catch up in minutes.

**Every session must:**

1. Open [Memory/00-index.md](Memory/00-index.md) first — it is the table of contents.
2. Read [Memory/05-progress-log.md](Memory/05-progress-log.md) and [Memory/08-next-steps.md](Memory/08-next-steps.md) to learn what was done and what's queued.
3. Before making a non-obvious decision, check [Memory/06-decisions-and-rationale.md](Memory/06-decisions-and-rationale.md) — it may already be settled.
4. Before repeating a pattern, check [Memory/07-mistakes-and-lessons.md](Memory/07-mistakes-and-lessons.md) — the same wall may have been hit before.

**Every session must end with:**

- An appended dated entry in `05-progress-log.md` describing what was actually done (files changed, verified behavior)
- Any new decisions logged in `06-decisions-and-rationale.md` with the **why**
- Any new dead-ends, wrong assumptions, or fixes logged in `07-mistakes-and-lessons.md`
- An updated `08-next-steps.md` so the next session starts already oriented

This discipline is the whole point of the project. Skipping it defeats the learning system.

---

## Current status

- **Phase**: A (Foundations) — setting up `CLAUDE.md`, `Memory/`, `README.md`
- **Brand identity**: not yet approved — Phase B waits on owner direction for palette + fonts
- **Site**: not yet started
- **Known blockers**: owner still needs to provide real WhatsApp number, OLX seller URL, Facebook/Instagram handles, address, opening hours, and services list — see [Memory/02-client-data.md](Memory/02-client-data.md)

---

## Local preview

```sh
cd "Website IST Auto"
python3 -m http.server 8000
# open http://localhost:8000
```

No build, no install. If a change requires either, stop and log a decision in `Memory/06-decisions-and-rationale.md` before proceeding.

---

## End-goal: distill skills

Once the site is live and `Memory/07-mistakes-and-lessons.md` contains real content, we will turn the reusable parts into proper Claude Code skills under `~/.claude/skills/` — e.g. `brand-website-bootstrap`, `bilingual-static-site`, `local-business-seo`, `olx-embed-with-fallback`. Don't try to extract skills early; only extract what demonstrably worked.
