# 06 — Decisions and Rationale

> Every non-obvious decision, with the **why** behind it. Do not re-litigate anything recorded here unless circumstances have materially changed. If you overturn a decision, keep the old entry and append a **Superseded by** note.

Format:

```
## YYYY-MM-DD — Decision title

**Decision:** one sentence.
**Why:** the reasoning.
**Alternatives considered:** what else was on the table and why it lost.
**Consequences:** what this locks in or rules out later.
```

---

## 2026-04-21 — Initial decisions

### Tech stack: plain HTML / CSS / vanilla JS

**Decision:** No framework, no build step, no npm.
**Why:** Owner is non-technical, site is small and mostly static, hosting is GitHub Pages. A framework would add maintenance surface for zero benefit at this scale and would make the handoff harder.
**Alternatives considered:** Next.js (too heavy for a 1-page site), Astro (nice SEO but still a build step), WordPress (too much server-side complexity for this scope).
**Consequences:** No JSX, no TypeScript, no bundler. Must use Web-standard APIs. i18n is hand-rolled with `data-i18n` attributes.

### Single-page layout

**Decision:** One `index.html` with anchor-linked sections (Hero, About, Services, Listings, Contact) rather than multiple HTML pages.
**Why:** The content is small and cohesive; users scroll rather than navigate. Google indexes single pages well. Maintenance is simpler.
**Alternatives considered:** Multi-page (`/about`, `/contact`) — rejected because it adds routing complexity and splits SEO authority across thin pages.
**Consequences:** If the owner later wants per-car detail pages or a blog for long-tail SEO, we'll revisit.

### Bilingual via `data-i18n` + JSON, default Romanian

**Decision:** Every translatable string uses `data-i18n="section.key"`, translations live in `assets/lang/ro.json` and `en.json`, default language is Romanian, choice is persisted in `localStorage`.
**Why:** The primary audience is Romanian; English is secondary. `localStorage` persistence means a returning buyer sees their chosen language. `data-i18n` keeps HTML and translations decoupled so translations can be updated without touching layout.
**Alternatives considered:** Separate `/en/` folder with duplicated HTML (works but doubles maintenance), server-side language routing (rejected — we have no server).
**Consequences:** Initial page render is in Romanian; language switch is client-side JS and requires that JS runs. Acceptable because Google Googlebot executes JS. We must still provide correct `<html lang>` and `hreflang` meta for SEO.

### OLX: iframe attempt + JS fallback

**Decision:** Try to embed OLX seller page in an iframe; if it fails to load (X-Frame-Options / CSP), swap in a link-out card.
**Why:** Owner asked for iframe. OLX Romania likely blocks iframe embedding. A detect-and-fallback approach gives them what they asked for without leaving a broken iframe on the site.
**Alternatives considered:** (a) Skip the iframe, just show a link-out button (simpler but weaker engagement); (b) Manually mirror a card grid from OLX (best UX but more owner maintenance).
**Consequences:** The listings section will probably render as a link-out card in production. This is fine. If the fallback becomes permanent, we should consider switching to option (c) — a mirrored card grid the owner maintains in a JSON file — and log that as a new decision.

### Hosting: GitHub Pages

**Decision:** Deploy as static files to GitHub Pages.
**Why:** Free, HTTPS by default, handles custom domains, no server to maintain. Fits a plain-HTML site perfectly.
**Alternatives considered:** Netlify / Cloudflare Pages (also fine; GitHub Pages was owner's pick); cPanel shared hosting (no benefit over GitHub Pages).
**Consequences:** Need `.nojekyll` at project root so files starting with `_` are served. Any build step would require a GitHub Actions workflow — currently none needed.

### Brand identity: invent a starter, get owner approval before CSS

**Decision:** Since IST Auto has no existing brand, propose a palette + font pair in [03-brand-identity.md](03-brand-identity.md) and require owner approval before writing CSS.
**Why:** Colors and typography are cheap to change before CSS exists, expensive to change after. Approving early avoids rework.
**Alternatives considered:** Pick something "reasonable" and start coding — rejected because it invites a full restyle later.
**Superseded by:** `2026-04-21 — Brand identity extracted from existing Autovit banner` (below). We found they *do* have visual assets; we extracted instead of inventing.

### 2026-04-21 — Brand identity extracted from existing Autovit banner

**Decision:** Use the palette and logo treatment from the owner's existing Autovit banner ([../Materials/AUTOVIT - …png](../Materials/)) rather than inventing a fresh identity.
**Why:** Revealed late in the kickoff that IST Auto *does* have a banner in circulation. Matching it avoids creating a second, inconsistent visual identity that would confuse buyers who recognize them from Autovit listings. The banner also gave us real contact info (phone, address, tagline, services) — a big unblock.
**Alternatives considered:** Ignore the banner and use my proposed navy+red — rejected because it would fragment the brand.
**Consequences:** Palette locked: primary dark `#0F1419`, accent red `#E53935`, white text. Headings `Poppins` (already-approved choice still applies). Site should feel continuous with the banner — same darkness, same red, same voice ("12 luni garanție fără limită de km").

### 2026-04-21 — Always check for existing materials before proposing a brand

**Decision:** Going forward — for every brand-site project — the first Phase A question is "What existing visual materials do you have, even informal ones?" Not "Do you have a brand identity?".
**Why:** Owners often say "no brand" when they mean "no formal brand guidelines" but actually have banners, business cards, or social-media headers with real colors and a real logo. Asking the narrower question surfaces them.
**Consequences:** This goes into the skill extraction later as a required bootstrap question.

### Placeholder convention: `TODO_*`

**Decision:** Any unknown value is stored as an uppercase `TODO_*` token (e.g. `TODO_WHATSAPP_NUMBER`, `TODO_OLX_SELLER_URL`). Pre-launch, `grep -r "TODO_" .` must return zero results outside [02-client-data.md](02-client-data.md).
**Why:** Makes missing data impossible to miss. `TODO` without a suffix is too common in code; `TODO_` prefix is distinctive.
**Consequences:** Any new unknown value must follow this convention.

### Memory system discipline

**Decision:** Every session must read [00-index.md](00-index.md) first and must end by updating [05-progress-log.md](05-progress-log.md), and [07-mistakes-and-lessons.md](07-mistakes-and-lessons.md) / [08-next-steps.md](08-next-steps.md) when applicable.
**Why:** The entire purpose of this project is to stop running in circles. Without write-back, the memory system rots.
**Consequences:** Sessions that skip this step have failed to do the work, regardless of whether code was written.
