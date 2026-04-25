# 02 — Client Data

> Single source of truth for every real value about IST Auto. **Anything not yet provided is a `TODO_*` placeholder.** Before launch, `grep -r "TODO_" .` must return zero results (outside this file).

**Source for most values below**: the only existing marketing material, an Autovit banner at [../Materials/AUTOVIT - Anunturi auto, mașini de vânzare - noi și second-hand.png](../Materials/AUTOVIT%20-%20Anunturi%20auto%2C%20ma%C8%99ini%20de%20v%C3%A2nzare%20-%20noi%20%C8%99i%20second-hand.png). Data read directly off the banner — session `2026-04-21`.

## Business info

| Field | Value | Status |
|---|---|---|
| Legal / display name | IST auto (lowercase "auto" per logo) | ✅ from banner |
| Likely full brand | IST Auto Bavaria (inferred from domain) | ⚠️ confirm with owner |
| Short tagline (RO) | 12 luni garanție fără limită de km | ✅ from banner |
| Short tagline (EN) | 12-month warranty, no km limit | ✅ translated |
| Street address | Strada Corneliu Coposu 167 | ✅ from banner |
| City | Cluj-Napoca | ✅ from banner |
| County (județ) | Cluj | ✅ inferred |
| Postal code | `TODO_POSTAL_CODE` (look up for `Str. Corneliu Coposu 167, Cluj-Napoca`) | 🟡 derivable |
| Latitude, Longitude | `TODO_LAT`, `TODO_LNG` (derivable from address) | 🟡 derivable |
| Opening hours | Mon–Sat 09:00–18:00 · Sun 10:00–17:00 | ✅ from owner ([../Materials/Hours.png](../Materials/Hours.png)) |
| Primary phone | `0740 346 163` → E.164 `+40740346163` → `wa.me` `40740346163` | ✅ from banner |
| Email | `istimportauto@gmail.com` | ✅ from owner |
| Website domain | istautobavaria.ro | ✅ from banner |

## Online channels

| Channel | URL / handle | Status |
|---|---|---|
| WhatsApp number | `40740346163` (assumed same as primary phone) | ⚠️ confirm with owner |
| OLX seller page | `https://www.olx.ro/oferte/user/1wec1a/` | ✅ from owner |
| Autovit seller page | `TODO_AUTOVIT_SELLER_URL` (banner is from Autovit, so they have a seller page there) | 🟡 derivable — owner can provide URL |
| Facebook page | `https://www.facebook.com/p/IST-Auto-61572566661880/` | ✅ from owner |
| Instagram handle | `TODO_INSTAGRAM_URL` | ❌ pending owner |
| TikTok (optional) | `TODO_TIKTOK_URL` | ❌ optional |
| Google Business Profile | `TODO_GBP_URL` (created after domain is live) | 🟡 later step |

## Services offered (from banner)

Confirmed from the banner:

- **Vânzare auto rulate** / Used car sales — core business
- **Garanție 12 luni fără limită de km** / 12-month warranty, no km limit
- **Rate doar cu buletinul** / Installments with ID only (no employment/income proof required)
- **Numere provizorii** / Temporary plate registration (provided by the lot)
- **Transport la domiciliu în toată țara** / Nationwide home delivery

Optional additions to confirm with owner:
- Trade-in / buy-back
- Pre-purchase inspection
- Financing via bank partners

## Notes for future sessions

- The domain `istautobavaria.ro` suggests the full brand is **"IST Auto Bavaria"** (likely German-car focused). Use `IST Auto` as the short display name, but the full legal/SEO name may be the longer form. Confirm with owner.
- The banner is an **Autovit** ad, not OLX. Owner may have listings on Autovit, OLX, or both. The listings section should link to whichever platform they actively use.

## Pre-launch checklist (block launch until all ✅)

- [ ] All `TODO_*` placeholders replaced with real values (check via grep — must return zero results outside this file)
- [ ] Confirmed with owner: is WhatsApp number the same as 0740 346 163? If not, update.
- [ ] Confirmed with owner: OLX seller URL (if they have one)
- [ ] Confirmed with owner: Autovit seller URL (the banner is from Autovit)
- [ ] Confirmed with owner: Facebook + Instagram URLs
- [ ] Confirmed with owner: opening hours
- [ ] Confirmed with owner: full brand name — "IST Auto" vs "IST Auto Bavaria"
- [ ] `wa.me/40740346163?text=...` tested on mobile — opens WhatsApp with pre-filled message
- [ ] Facebook URL tested — opens page (not a 404)
- [ ] Instagram URL tested — opens profile
- [ ] OLX / Autovit URL tested — opens seller page
- [ ] Google Maps embed centered on `Str. Corneliu Coposu 167, Cluj-Napoca`
- [ ] Romanian diacritics render correctly in all UI strings (test: mașină, garanție)

## How to use this file

- When the owner sends a real value, update the table here **first**, then search+replace the `TODO_*` token across the codebase.
- Never hardcode a real phone number or URL in multiple places — use the value from this file and reference it via a single config location in the site (to be designed when we hit that point).
- If a value is uncertain, mark it `⚠️ unconfirmed` rather than leaving it as a confident-looking placeholder.
