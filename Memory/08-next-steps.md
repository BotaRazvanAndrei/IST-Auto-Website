# 08 — Next Steps

> Prioritized queue for whoever (human or LLM) picks this up next. **Top items are ready to work on right now.** Items marked 🟥 are blockers waiting on the owner.

Update this file at the end of every session: remove completed items, re-prioritize, add anything new that surfaced.

---

## Ready to work on (no blockers)

### Verify the GitHub Action on the cloud

Repo is on GitHub. Pages is enabled. The auto-sync workflow lives at [../.github/workflows/update-listings.yml](../.github/workflows/update-listings.yml). Owner is testing on a `work` branch alongside `main`.

To unlock the **Run workflow** button on github.com → Actions → **Update listings**:

1. The workflow file must exist on the **default branch** (`main`). GitHub only renders the manual-dispatch dropdown for workflows that are present on the default branch. If you've been iterating on `work`, merge the workflow file into `main` once.
2. Confirm repo **Settings → Actions → General → Workflow permissions** is set to **"Read and write permissions"** (otherwise the auto-commit step fails silently).
3. Trigger a manual dispatch from `main`. Watch the run. The three steps to confirm: `Set up Python`, `Run add-listings.py` (should print 7 ok lines), `Commit changes (if any)` (prints `No listing changes to commit.` if state is already current — that's success).
4. If the auto-commit step fails with `Permission denied to push`, re-check step 2.

After this, the daily cron at 04:17 UTC takes over. Verify it once by checking the next morning that a run appears in the Actions history.

### Phase E — custom domain + Google presence

1. **`CNAME` file** at repo root containing `istautobavaria.ro`. Configure DNS per [GitHub Pages docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) — `A` records to GitHub's IPs (`185.199.108.153` etc.) + `CNAME` for `www` (or apex-only if preferred). Enable "Enforce HTTPS" once the cert provisions (can take 15–60 min).
2. **Verify the site at `https://istautobavaria.ro/`** — loads, favicon shows, fonts load, WhatsApp CTA works, listings cards render with the **Mai multe** toggle.
3. **Google Search Console**: verify ownership (DNS TXT preferred, HTML file backup). Submit `sitemap.xml`. Request indexing of `/`.
4. **Validate structured data**:
   - JSON-LD at https://validator.schema.org/ — expect zero errors once `TODO_*` are filled. Meanwhile, expect warnings for missing postal code / geo / hours.
   - Rich results at https://search.google.com/test/rich-results.
5. **Google Business Profile**: create for `IST Auto, Strada Corneliu Coposu 167, Cluj-Napoca`. Verification is usually by postcard and takes days. Once verified, link the site URL in the profile and add the profile URL to the JSON-LD `sameAs` array.
6. **Lighthouse**: run in Chrome DevTools on the production URL. Target ≥ 90 Performance / Accessibility / Best Practices, ≥ 95 SEO.
7. **Social debuggers**: Facebook (https://developers.facebook.com/tools/debug/) and Twitter card validator — scrape the URL so caches pick up the real `og.jpg`.

### Verify the rest of Phase C + D in a browser (cheap, do before deep-link debugging)

1. **i18n**: RO/EN toggle swaps **every** visible string, including `<title>` and `<meta description>` (inspect `<head>` after toggle). `<html lang>` updates to `ro` / `en`. Choice persists across refresh via `localStorage`. The listings toggle button label flips between `Mai multe` ↔ `Show more` (and `Mai puține` ↔ `Show less` when expanded).
2. **WhatsApp CTA**: `href` picks up the active-language prefilled message. Click on desktop → should deep-link to WhatsApp Web.
3. **Mobile hamburger** (≤767px): opens/closes the menu; `aria-expanded` flips.
4. **Diacritics**: `mașină`, `garanție`, `Sâmbătă` render without boxes or `?`.
5. **Favicon**: appears in the browser tab (SVG version on Chrome/Firefox/Safari). No 404s for the PNG sizes in the Network panel.
6. **OG preview**: once live, paste the URL into https://metatags.io/ and confirm `og.jpg` renders correctly with the RO title + description.
7. No JS errors in the browser console.

### Watch the auto-sync after first cron fire

After the first scheduled run (next day at 04:17 UTC):

1. Confirm a new run appears in the Actions history without manual help.
2. If `listings.json` changed (a car was added/sold/repriced on OLX), confirm the `[skip ci]` commit appears on `main` and that GitHub Pages redeployed.
3. If listings changed but no commit appeared → check the run logs for `Permission denied to push` (re-fix step 2 above) or for the regex returning 0 matches (OLX may have redesigned the seller page — see fallback note below).

**Failure mode to watch for:** if OLX redesigns the seller page, `discover_seller_listings()` may return `[]` and the workflow will commit an empty `listings.json`, replacing all real cards with the empty-state fallback. Mitigation queued: add a step that fails the workflow when discovery returns 0 listings AND `listings.txt` is also empty, so the failure is visible. Until then, eyeball the live site weekly during the first month.

### Maintenance / housekeeping

- Delete the unused [../assets/img/listings/demo-1.jpg](../assets/img/listings/demo-1.jpg) and `demo-2.jpg` (no longer referenced by `listings.json`). Harmless but adds noise to git diffs.
- Decide whether `listings.txt` should be blanked to comments-only (it's now an optional manual override; the file isn't required for the auto-discovery flow).

### Phase F — skill extraction (after launch)

Only after the site is live and [07-mistakes-and-lessons.md](07-mistakes-and-lessons.md) has more real entries. Candidate skills:

- `brand-website-bootstrap` — scaffolds `CLAUDE.md` + `Memory/` + file structure for a new brand site. **Must include** the "ask for existing materials even if owner says they have no brand" question up front (lesson from this project).
- `bilingual-static-site` — `data-i18n` + JSON pattern, language persistence, `<html lang>` swap, hreflang meta.
- `local-business-seo` — meta tags + JSON-LD `LocalBusiness`/`AutoDealer` + sitemap + robots + Search Console + Google Business Profile checklist.
- `marketplace-listings-sync` — paste-link script + auto-discovery from a seller page's Next.js JSON blob + GitHub Action on a daily cron. Generalizes to any marketplace whose listing page exposes OG meta + JSON-LD. The right pattern is regex-against-SSR, not headless-browser. **Must include** the "re-probe before trusting old notes about external HTML" lesson.
- `favicon-and-og-from-svg` — the Chrome-headless-renders-SVG-at-exact-dimensions pattern, since `qlmanage` and `sips -z` alone corrupted the aspect ratio. Cheap, zero-dependency, reproducible.

Note: the originally-planned `olx-embed-with-fallback` skill is **dead** — the iframe path was abandoned because OLX hydrates listings client-side. Don't extract it.

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

Pick the topmost item in "Ready to work on". The cloud-verification of the GitHub Action comes first — the auto-sync is the highest-leverage piece of infrastructure on this project, and verifying it on the cloud (vs. just locally) is gating Phase E launch confidence. After that, the custom domain + Google indexing is mostly owner-side coordination (DNS control, Google account access).
