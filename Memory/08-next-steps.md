# 08 — Next Steps

> Prioritized queue for whoever (human or LLM) picks this up next. **Top items are ready to work on right now.** Items marked 🟥 are blockers waiting on the owner.

Update this file at the end of every session: remove completed items, re-prioritize, add anything new that surfaced.

---

## Ready to work on (no blockers)

### Visual check the new listings cards (5 min, do before anything else)

Server should already be running on `http://localhost:8000/` (or run `python3 -m http.server 8000` from repo root). Scroll to the **Mașini disponibile** section and confirm:

1. Two demo cards render in a grid (1 col mobile / 2 tablet / 3 desktop). Photo on top (16:10 aspect), bold title, description line below, `olx.ro` in lowercase at the bottom.
2. Hover lifts the card 2px and turns the border red — should feel "clickable like a WhatsApp link preview".
3. Click → opens the OLX seller page in a new tab.
4. RO/EN toggle re-renders the "see all on OLX" CTA below the grid (cards themselves stay — they don't use i18n).
5. Compare against [../Materials/Screenshot 2026-04-23 at 12.01.25.png](../Materials/Screenshot%202026-04-23%20at%2012.01.25.png). If spacing/typography drifts noticeably from that WhatsApp preview look, tune `.listing-card` in [../assets/css/styles.css](../assets/css/styles.css).

If broken, log it in [07-mistakes-and-lessons.md](07-mistakes-and-lessons.md).

### Replace the demo entries with real OLX listings

Once the owner provides one or more real OLX listing URLs (single-listing pages like `https://www.olx.ro/d/oferta/...`, **not** the seller page):

1. Edit [../listings.txt](../listings.txt) — add one URL per line, delete the example comments.
2. Run `python3 add-listings.py` from the repo root.
3. Script fetches each page's Open Graph tags + image, writes [../assets/data/listings.json](../assets/data/listings.json), downloads photos into [../assets/img/listings/](../assets/img/listings/).
4. Refresh the site — real cards replace the demo ones.

If a URL 404s (OLX rotates sold listings frequently), the script logs and skips. Run again once the owner gives a fresh URL.

### Verify the rest of Phase C + D in a browser (do before Phase E)

1. **i18n**: RO/EN toggle swaps **every** visible string, including `<title>` and `<meta description>` (inspect `<head>` after toggle). `<html lang>` updates to `ro` / `en`. Choice persists across refresh via `localStorage`.
2. **WhatsApp CTA**: `href` picks up the active-language prefilled message. Click on desktop → should deep-link to WhatsApp Web.
3. **Mobile hamburger** (≤767px): opens/closes the menu; `aria-expanded` flips.
4. **Diacritics**: `mașină`, `garanție`, `Sâmbătă` render without boxes or `?`.
5. **Favicon**: appears in the browser tab (SVG version on Chrome/Firefox/Safari). No 404s for the PNG sizes in the Network panel.
6. **OG preview**: once live, paste the URL into https://metatags.io/ and confirm `og.jpg` renders correctly with the RO title + description.
7. No JS errors in the browser console.

### Phase E — launch + Google presence

1. **Push to GitHub** — create repo `istauto-site` (or similar) under the owner's account, push `main`.
2. **Enable GitHub Pages** on `main` branch, root folder. Confirm the default `*.github.io` URL serves the site.
3. **`CNAME` file** at repo root containing `istautobavaria.ro`. Configure DNS per [GitHub Pages docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) — `A` records to GitHub's IPs + `CNAME` for `www` (or apex-only if preferred). Enable "Enforce HTTPS" once the cert provisions.
4. **Verify the site at `https://istautobavaria.ro/`** — loads, favicon shows, fonts load, WhatsApp CTA works, OLX fallback renders.
5. **Google Search Console**: verify ownership (DNS TXT preferred, HTML file backup). Submit `sitemap.xml`. Request indexing of `/`.
6. **Validate structured data**:
   - JSON-LD at https://validator.schema.org/ — expect zero errors once `TODO_*` are filled. Meanwhile, expect warnings for missing postal code / geo / hours.
   - Rich results at https://search.google.com/test/rich-results.
7. **Google Business Profile**: create for `IST Auto, Strada Corneliu Coposu 167, Cluj-Napoca`. Verification is usually by postcard and takes days. Once verified, link the site URL in the profile and add the profile URL to the JSON-LD `sameAs` array.
8. **Lighthouse**: run in Chrome DevTools on the production URL. Target ≥ 90 Performance / Accessibility / Best Practices, ≥ 95 SEO.
9. **Social debuggers**: Facebook (https://developers.facebook.com/tools/debug/) and Twitter card validator — scrape the URL so caches pick up the real `og.jpg`.

### Phase E.5 — Listings auto-sync via GitHub Action (after Pages is live)

Once the site is on GitHub Pages, replace the local `add-listings.py` workflow with a scheduled GitHub Action so the owner doesn't need a developer to add cars.

Two possible implementations:

- **Manual-paste mode** (simpler, ships first): owner edits `listings.txt` via GitHub's web UI → commit triggers Action → Action runs the existing `add-listings.py` → commits the resulting `listings.json` + downloaded photos back to `main`. Pages auto-redeploys. Owner does: open repo on github.com, paste URL, click commit. ~30s round-trip.
- **Auto-discovery mode** (later, owner-zero-effort): scheduled Action runs every 6h, hits OLX's hydration API or scrapes the seller page (`olx.ro/oferte/user/1wec1a/`), discovers all current listings, fetches each one's OG tags. Owner does **nothing** — keeps using OLX as before. Caveat: depends on OLX HTML structure; ~10-min fix when OLX redesigns. Add a workflow-failure notification so we know quickly.

Both modes write the same `listings.json` shape — the rendering layer is unchanged. Build manual-paste first, then auto-discovery once the discovery scraper is reliable.

### Phase F — skill extraction (after launch)

Only after the site is live and [07-mistakes-and-lessons.md](07-mistakes-and-lessons.md) has more real entries. Candidate skills:

- `brand-website-bootstrap` — scaffolds `CLAUDE.md` + `Memory/` + file structure for a new brand site. **Must include** the "ask for existing materials even if owner says they have no brand" question up front (lesson from this project).
- `bilingual-static-site` — `data-i18n` + JSON pattern, language persistence, `<html lang>` swap, hreflang meta.
- `local-business-seo` — meta tags + JSON-LD `LocalBusiness`/`AutoDealer` + sitemap + robots + Search Console + Google Business Profile checklist.
- `olx-embed-with-fallback` — iframe-with-load-timeout pattern (generalizes to any site that blocks embedding — not just OLX).
- `favicon-and-og-from-svg` — the Chrome-headless-renders-SVG-at-exact-dimensions pattern, since `qlmanage` and `sips -z` alone corrupted the aspect ratio. Cheap, zero-dependency, reproducible.

Don't extract a skill for a pattern that didn't prove itself under real conditions.

---

## 🟥 Still pending from the owner (blocks launch completeness, not Phase E push)

Phase E can ship with the current `TODO_*` placeholders — the site will still serve, rank, and funnel leads. Remaining items that sharpen the JSON-LD / rich-results surface once supplied:

- [ ] Confirm WhatsApp number — is it the same as the primary phone `0740 346 163`, or a different number?
- [ ] Provide Autovit seller URL (the banner proves they're on Autovit)
- [ ] Provide Instagram profile URL
- [ ] Confirm: full brand name — "IST Auto" or "IST Auto Bavaria"? (Domain is `istautobavaria.ro`.)
- [ ] Provide postal code for Str. Corneliu Coposu 167, Cluj-Napoca (or let us look it up — 400000-series)
- [ ] Provide or confirm lat/lng for the Google Maps embed (can be derived from the address)
- [ ] Provide a real logo SVG (optional — PNG is now wired in from [../Materials/Ist logo only.png](../Materials/Ist%20logo%20only.png); SVG would sharpen at high-DPR)
- [ ] Provide photos of the lot and a few cars (optional — launchable without; hero currently uses a dark CSS radial-gradient)

### Resolved 2026-04-21

- ✅ Facebook URL: `https://www.facebook.com/p/IST-Auto-61572566661880/`
- ✅ OLX seller URL: `https://www.olx.ro/oferte/user/1wec1a/`
- ✅ Opening hours: Mon–Sat 09:00–18:00, Sun 10:00–17:00 (from [../Materials/Hours.png](../Materials/Hours.png))
- ✅ Email: `istimportauto@gmail.com`
- ✅ Logo asset: [../assets/img/logo.png](../assets/img/logo.png)

## How to prioritize

Pick the topmost item in "Ready to work on". The browser-verification checklist is cheap and should happen before pushing to GitHub. Phase E's first blockers are **owner-side** (GitHub account access, DNS control, Google account for Search Console + Business Profile) — loop the owner in before starting.
