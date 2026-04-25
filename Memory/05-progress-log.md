# 05 — Progress Log

> Dated journal of what each session actually did. **Most recent entry at the top.** Every session ends with a new entry appended here.

Format for each entry:

```
## YYYY-MM-DD — short session title

**Done:**
- bullet list of what was actually finished (files created/changed, verified behavior)

**Not done / deferred:**
- what was planned but didn't happen, and why

**Next session should:**
- pointer to the top of 08-next-steps.md
```

---

## 2026-04-25 — Listings: WhatsApp-preview-style cards driven by a paste-link script

**Done:**

- **Pivoted listings architecture from iframe-with-fallback to a card grid.** Owner workflow (locally for now, GitHub Action later) is: paste an OLX listing URL into [../listings.txt](../listings.txt), run `python3 add-listings.py`, refresh the site. Cards appear in the WhatsApp-preview style — photo on top, bold title, a description line, `olx.ro` domain hint at the bottom. Clicking a card opens the listing in a new tab.
- **New script [../add-listings.py](../add-listings.py)** (zero deps, stdlib only): reads URLs from `listings.txt`, fetches each OLX page with a real User-Agent + `Accept-Language: ro,en`, parses `<meta property="og:title|og:description|og:image">`, downloads the photo into [../assets/img/listings/](../assets/img/listings/), writes [../assets/data/listings.json](../assets/data/listings.json). Errors per URL are logged + skipped (so one broken URL doesn't kill the whole run). Empty `listings.txt` writes `[]` so the rendering layer falls back gracefully.
- **New renderer [../assets/js/listings.js](../assets/js/listings.js)** (replaces the old `olx-embed.js`): fetches `listings.json`, renders a card grid (1 col mobile / 2 tablet / 3 desktop). Empty array → falls back to the existing "Vezi toate mașinile pe OLX" CTA card pointing at the seller URL from `data-olx-url`. Re-renders on `i18n:changed` event.
- **Removed [../assets/js/olx-embed.js](../assets/js/olx-embed.js)** entirely. The iframe path is dead — OLX hydrates listings via XHR (the seller-page SSR HTML contains zero of the seller's actual ads, only sidebar recommendations cycled across categories) so the iframe approach was never going to work even if `X-Frame-Options` permitted it.
- **CSS [../assets/css/styles.css](../assets/css/styles.css)**: replaced the `.olx-embed` / `.olx-fallback` block with `.listings-grid` + `.listing-card` (16:10 photo aspect, 2-line title clamp, 2-line description clamp, lowercase domain footer, `--c-red` border on hover with translate-up + shadow). Renamed fallback class to `.listings-fallback`. Layout is mobile-first; breakpoints at 640px (2 cols) and 1024px (3 cols).
- **HTML [../index.html](../index.html)**: container renamed `#olx-embed` → `#listings-grid`, class `olx-embed` → `listings`, script src updated. `data-olx-url="https://www.olx.ro/oferte/user/1wec1a/"` retained — used as the "see all" link below the grid AND as the empty-state fallback URL.
- **Seeded [../assets/data/listings.json](../assets/data/listings.json)** with 2 demo entries (Volvo V60, BMW Series 3) using two locally-generated 800×500 JPG placeholders ([../assets/img/listings/demo-1.jpg](../assets/img/listings/demo-1.jpg), [demo-2.jpg](../assets/img/listings/demo-2.jpg)) so the card layout is testable without a real listing URL. Both cards link to the seller page until real listing URLs replace them.
- **Verified on localhost** (`python3 -m http.server 8000` running in background): root, `assets/data/listings.json`, `assets/img/listings/demo-1.jpg`, and `assets/js/listings.js` all serve `200 OK`. (Visual confirmation in browser still pending — owner/dev to eyeball.)

**Architectural note for the next session:** the rendering layer is fully decoupled from the data source. `listings.json` has the same shape regardless of whether it was hand-written, produced by the local `add-listings.py`, or written by a future GitHub Action that scrapes the seller page on a schedule. So the long-term automation work (Action that runs every 6h, calls OLX's hydration API or scrapes the seller page) doesn't touch the cards — only the script gets upgraded.

**Not done / deferred:**

- Did **not** ship a real listing yet — the one OLX URL I tested with returned 404 (it was a sidebar recommendation that OLX cycled out between fetches). Real listings will land when the owner provides URLs or when the GitHub Action goes live.
- The seller-page-discovery scraper (the version that reads `olx.ro/oferte/user/1wec1a/` and auto-finds all current listings) is not built. That's the **GitHub Action future-work** the user asked about — explicitly deferred until after the manual paste-link flow is proven in production.
- Browser visual verification (cards actually look like the WhatsApp preview screenshot in [../Materials/Screenshot 2026-04-23 at 12.01.25.png](../Materials/Screenshot%202026-04-23%20at%2012.01.25.png)) — still owed before declaring this complete.

**Next session should:**

- Open the site at `http://localhost:8000/`, confirm the demo cards render as expected, adjust spacing/typography if the visual doesn't match the WhatsApp screenshot closely enough.
- When the owner provides a real OLX listing URL, paste into `listings.txt` and run `python3 add-listings.py` to confirm the OG-fetch path works end-to-end on a live page.
- Then resume Phase E (GitHub push, Pages, CNAME, DNS) — see [08-next-steps.md](08-next-steps.md).

---

## 2026-04-21 — Personalization pass: real logo, hours, email, Facebook + OLX URLs; ghost-button hover bug fixed

**Done:**

- Owner supplied 5 items — all applied:
  - **Logo PNG** ([../Materials/Ist logo only.png](../Materials/Ist%20logo%20only.png), 750×333, transparent alpha) copied to [../assets/img/logo.png](../assets/img/logo.png) and wired into the nav. Replaced the inline SVG wordmark in [../index.html](../index.html) with `<img src="assets/img/logo.png" alt="IST Auto" width="180" height="80" />`. CSS updated in [../assets/css/styles.css](../assets/css/styles.css) — `.logo img { height: 44px; width: auto; display: block; }` (was `.logo svg { height: 28px; ... }`).
  - **Opening hours** (from [../Materials/Hours.png](../Materials/Hours.png)): Mon–Sat 09:00–18:00, Sun 10:00–17:00. Updated:
    - `contact.hours_value` in [../assets/lang/ro.json](../assets/lang/ro.json) and [../assets/lang/en.json](../assets/lang/en.json)
    - Default text in `index.html` contact row (no longer `TODO_HOURS`)
    - JSON-LD `openingHoursSpecification` now a proper **array of two `OpeningHoursSpecification` objects** (one for Mon–Sat, one for Sunday, with `dayOfWeek` / `opens` / `closes`)
  - **Email** `istimportauto@gmail.com`:
    - New `.contact__row` in index.html with `mailto:` link under phone
    - `contact.email_label` key added to both RO/EN i18n JSONs
    - `"email": "istimportauto@gmail.com"` added to JSON-LD
  - **Facebook URL** `https://www.facebook.com/p/IST-Auto-61572566661880/` — replaced `TODO_FACEBOOK_URL` in the contact button `href` and in JSON-LD `sameAs`.
  - **OLX seller URL** `https://www.olx.ro/oferte/user/1wec1a/` — replaced `TODO_OLX_SELLER_URL` in:
    - the contact "OLX" button `href`
    - the `#olx-embed data-olx-url` attribute (so `olx-embed.js` will now *attempt* the iframe before falling back)
    - JSON-LD `sameAs`
- **Ghost-button hover bug fixed** in [../assets/css/styles.css](../assets/css/styles.css). The prior rule used `background: currentColor; color: var(--c-dark)` which — because `currentColor` resolves to the computed color in the same rule — made both background and text the same dark color (invisible text) on any light section, which is where the Facebook/Instagram/OLX contact buttons live. Replaced with explicit colors: light sections hover → dark bg + **white text**, dark sections hover → white bg + dark text. Per-section-override block kept for the inverted hero case.
- Updated [02-client-data.md](02-client-data.md): marked hours, email, Facebook URL, and OLX URL as ✅ from owner.
- Validated: [../index.html](../index.html) JSON-LD reparses cleanly (`email` present, 2 hours entries, 2 sameAs URLs); RO/EN JSON + sitemap.xml + site.webmanifest all parse.

**Not done / deferred:**

- Still blocked on owner: Autovit seller URL, Instagram URL, brand-name confirmation ("IST Auto" vs "IST Auto Bavaria"), postal code, lat/lng, optional logo SVG / lot photos.
- No real browser check of the logo yet — the PNG has a transparent alpha channel per `sips -g hasAlpha`, so it should sit cleanly on the dark nav, but in-tab rendering at `height: 44px` is unverified.
- Hover-color fix is a CSS-level change — also needs eyeball verification in a real browser.
- Phase E (push + Pages + DNS + Search Console + Business Profile + Lighthouse) still outstanding.

**Next session should:**

- Run the long-pending browser verification at `http://localhost:8000` — now especially important because (a) the logo swap is image-based and depends on transparency, and (b) the ghost-button hover rule was materially rewritten. Add an OLX iframe test to the list: with a real `data-olx-url` set, does it embed or fall back? (Expected: OLX sends `X-Frame-Options`, so the 3-second timeout fallback fires — confirm by eye.)
- Then Phase E. See [08-next-steps.md](08-next-steps.md).

---

## 2026-04-21 — Phase D complete: SEO + launch-prep assets in place

**Done:**

- [../.nojekyll](../.nojekyll): empty file at repo root — prevents GitHub Pages' Jekyll pipeline from stripping underscore-prefixed files and speeds up builds.
- [../robots.txt](../robots.txt): `User-agent: *` / `Allow: /` + `Sitemap: https://istautobavaria.ro/sitemap.xml`.
- [../sitemap.xml](../sitemap.xml): single-URL sitemap with `xhtml:link` alternates for `ro`, `en`, `x-default`. Valid XML (parsed via `xml.etree`).
- [../assets/img/favicon/favicon.svg](../assets/img/favicon/favicon.svg): vector favicon — red `#E53935` rounded square, white `IST` monogram in Poppins 700. Primary icon for modern browsers.
- PNG favicon set rendered from the SVG via Chrome headless (1:1 at 512) and resized with `sips`: [../assets/img/favicon/favicon-16.png](../assets/img/favicon/favicon-16.png), `favicon-32.png`, `favicon-48.png`, `apple-touch-icon.png` (180), `android-chrome-192.png`, `android-chrome-512.png`. All transparent background (Chrome headless `--default-background-color=00000000`).
- [../assets/img/favicon/site.webmanifest](../assets/img/favicon/site.webmanifest): PWA manifest with 192/512 icons, `theme_color` and `background_color` `#0F1419`, `display: standalone`.
- Wired favicon set into [../index.html](../index.html) `<head>` (SVG icon + 32/16 PNG + apple-touch + manifest), placed immediately before the Google Fonts preconnect.
- [../assets/img/og.svg](../assets/img/og.svg) + [../assets/img/og.jpg](../assets/img/og.jpg): 1200×630 share image. Dark `#0F1419` background, red radial glow top-right, `IST auto` wordmark (white + red italic), red accent rule, tagline `12 luni garanție fără limită de km`, descriptor line, `istautobavaria.ro`. Rendered via Chrome headless at exact dimensions (sips `-z` alone squashed the viewBox), then `sips -s format jpeg -s formatOptions 88` → 69 KB JPG. SVG retained as editable source.
- Smoke test via `python3 -m http.server 8766`: `/`, `/robots.txt`, `/sitemap.xml`, `/.nojekyll`, favicon SVG + 32 PNG + apple-touch + webmanifest, and `/assets/img/og.jpg` all return 200. `site.webmanifest` parses as valid JSON.

**Not done / deferred:**

- JSON-LD `openingHoursSpecification` still a bare `"TODO_HOURS"` string — waiting on owner to provide Mon–Sun open/close times. Same for `postalCode`, `geo.latitude`, `geo.longitude`, and the four `sameAs` TODO URLs.
- No visual browser check of how the favicons render in a real browser tab / bookmark / iOS home-screen. Asset generation verified; in-browser rendering unverified.
- No real OG share validation (Facebook / Twitter debuggers) — will run those after push to GitHub Pages.
- Browser verification of Phase C still pending (carried forward from last session).

**Next session should:**

- Phase E (launch): push to GitHub, enable Pages, add `CNAME` with `istautobavaria.ro`, configure DNS, verify at Search Console, submit sitemap, validate JSON-LD, create Google Business Profile, run Lighthouse. See [08-next-steps.md](08-next-steps.md).
- Before Phase E, the browser-verification checklist from the previous session should still be run (language toggle, hamburger, OLX fallback, diacritics). Combine with a visual favicon / OG check (Chrome devtools → Elements → favicon preview, and a quick OG preview via https://metatags.io/ once the site is live).

---

## 2026-04-21 — Phase C complete: site scaffolded, i18n wired, OLX fallback implemented

**Done:**

- [../index.html](../index.html): semantic single-page layout (sticky nav, hero, about, services, listings, contact, footer). Every user-visible string has `data-i18n="section.key"`. Head contains `<title>`, description, canonical, `hreflang` alternates (ro/en/x-default), Open Graph, Twitter card, and a JSON-LD `["AutoDealer","LocalBusiness"]` block with real data from [02-client-data.md](02-client-data.md) (remaining `TODO_POSTAL_CODE` / `TODO_LAT` / `TODO_LNG` / `TODO_HOURS` / social URLs preserved as placeholders). Inline SVG wordmark per [03-brand-identity.md](03-brand-identity.md) § "Logo fallback SVG". Footer year auto-updates via inline JS.
- [../assets/css/styles.css](../assets/css/styles.css): mobile-first, `≥768px` breakpoint. Locked palette (`#0F1419` / `#E53935` / `#FFFFFF`), `Poppins` (600/700) + `Inter` (400/500/600) from Google Fonts with `latin,latin-ext` subset for Romanian diacritics. Type scale matches [03-brand-identity.md](03-brand-identity.md). Accessible focus outlines (red), hamburger nav for mobile, `prefers-reduced-motion` respected.
- [../assets/js/i18n.js](../assets/js/i18n.js): walks `[data-i18n]`, reads `assets/lang/{ro,en}.json`, persists choice in `localStorage` (`istauto.lang`), updates `<html lang>`, supports `data-i18n-attr` for non-text attrs (`content`, `aria-label`, `placeholder`, `title`), dispatches `i18n:changed` CustomEvent. Initial language resolves from `?lang=` query → `localStorage` → `ro` default. Updates every `a[id^="cta-whatsapp"]` href with `wa.me/40740346163?text=<encodeURIComponent(prefilled)>` on each language change.
- [../assets/js/olx-embed.js](../assets/js/olx-embed.js): tries iframe, 3-second load-timeout fallback. If iframe's `contentDocument` is inaccessible (cross-origin) it assumes success; if the iframe hasn't fired `load` within timeout or `body` is empty, swaps in a branded link-out card (no innerHTML injection of URL — URL set via `a.href` with `http(s)` scheme check). Re-renders fallback copy when language changes. If `data-olx-url` is still `TODO_*`, skips iframe attempt and shows fallback immediately.
- [../assets/lang/ro.json](../assets/lang/ro.json) + [../assets/lang/en.json](../assets/lang/en.json): every key from [04-website-spec.md](04-website-spec.md) § "i18n key inventory", plus `meta.*`, `listings.fallback.*`, `whatsapp.prefilled_message`. RO prefilled message: "Bună, am văzut site-ul IST Auto și vreau mai multe detalii despre mașini." EN prefilled message: "Hi, I found IST Auto's site and I'd like more info about your cars."
- Smoke test via `python3 -m http.server 8765`: `/`, `styles.css`, `i18n.js`, `olx-embed.js`, `ro.json`, `en.json` all return 200. JSON files parse cleanly with `python3 -c 'import json; json.load(...)'`.

**Not done / deferred:**

- Phase D (SEO + launch prep): `robots.txt`, `sitemap.xml`, `.nojekyll`, favicon set, OG share image. JSON-LD `openingHoursSpecification` left as `TODO_HOURS` pending owner; postal code / lat / lng still `TODO_*`.
- No real OLX seller URL yet — the embed shows the fallback card until the owner provides it.
- No Facebook / Instagram / Autovit URLs yet — contact section buttons link to `TODO_*`.
- No browser smoke-test of the UI itself (language toggle, mobile menu, OLX fallback render). Curl-level only. Marking as "code written + asset routing verified, UI behavior unverified".

**Next session should:**

- Phase D (SEO + launch prep) is next in the queue. See [08-next-steps.md](08-next-steps.md).
- Before Phase D, ideally open `http://localhost:8000` and verify: (a) RO/EN toggle swaps every string, (b) `<html lang>` updates, (c) WhatsApp href picks up the active language, (d) OLX section renders the fallback card (since URL is `TODO_*`), (e) mobile hamburger opens/closes.

---

## 2026-04-21 — Project kickoff, foundations scaffolded, brand + contact info extracted from existing banner

**Done:**

- Captured initial requirements via Q&A with owner (see [06-decisions-and-rationale.md](06-decisions-and-rationale.md) `2026-04-21 — Initial decisions`)
- Wrote the project plan at `/Users/razvan/.claude/plans/in-this-project-we-deep-boot.md`
- Created [../CLAUDE.md](../CLAUDE.md) — session bootstrap rules, tech stack constraints, pointer into Memory/
- Created all 9 Memory files
- Created [../README.md](../README.md)
- **Found existing marketing material**: owner pointed to [../Materials/AUTOVIT - …png](../Materials/) — an Autovit banner with the real logo, colors, tagline, phone, address, and service list
- **Extracted real brand + business data from the banner**:
  - Palette: `#0F1419` dark background, `#E53935` red accent, `#FFFFFF` text
  - Logo: "IST auto" wordmark with red car silhouette
  - Tagline: "12 luni garanție fără limită de km"
  - Phone: `0740 346 163` → `+40740346163`
  - Address: `Strada Corneliu Coposu 167, Cluj-Napoca`
  - Domain: `istautobavaria.ro` (owner already owns a domain)
  - Services: sales, 12-month warranty no km limit, installments with ID only, temporary plates, nationwide home delivery
- Updated [02-client-data.md](02-client-data.md), [03-brand-identity.md](03-brand-identity.md) with real data
- Logged the mistake ("asked 'do you have a brand?' instead of 'what materials exist?'") in [07-mistakes-and-lessons.md](07-mistakes-and-lessons.md) and a superseding decision in [06-decisions-and-rationale.md](06-decisions-and-rationale.md)

**Not done / deferred:**

- No `index.html`, CSS, JS, or i18n JSON yet — Phase C begins next
- Still pending from owner: WhatsApp number (assumed same as primary phone), OLX / Autovit seller URLs, Facebook + Instagram URLs, opening hours, full brand name confirmation ("IST Auto" vs "IST Auto Bavaria")

**Next session should:**

- Proceed to Phase C (build the site). Brand direction is locked via the banner. Start with `index.html` skeleton + `data-i18n` attributes, then CSS, then JS. Use placeholders for still-missing values (WhatsApp confirmation, social URLs, hours). See [08-next-steps.md](08-next-steps.md).
