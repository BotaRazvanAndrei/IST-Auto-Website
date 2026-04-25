# 03 — Brand Identity

> IST Auto does have an existing visual identity, visible on their Autovit banner at [../Materials/AUTOVIT - Anunturi auto, mașini de vânzare - noi și second-hand.png](../Materials/AUTOVIT%20-%20Anunturi%20auto%2C%20ma%C8%99ini%20de%20v%C3%A2nzare%20-%20noi%20%C8%99i%20second-hand.png). The palette and logo below are **extracted from that banner**, not invented.

## Status

✅ **Approved — derived directly from the owner's existing banner.** Session `2026-04-21`.

---

## Name treatment

- **Logo wordmark**: `IST auto` — "IST" in bold, "auto" in lighter weight (italic-leaning on the banner). A stylized red car silhouette underlines or threads through the "IST" letters on the banner.
- **Rendering on the site**: inline SVG wordmark, styled with the active red accent color for "auto" (or for the car silhouette). Owner can later replace with a higher-fidelity SVG of the real logo without touching layout — the SVG block is the only change needed.
- **Short display name in copy**: use `IST Auto` (capitalized) in body copy and meta titles; reserve the lowercase `auto` for the logo wordmark.

## Color palette (extracted from banner)

| Role | Hex | Usage |
|---|---|---|
| Primary (dark) | `#0F1419` | Hero background, nav, footer — near-black with very slight navy undertone (matches banner background) |
| Primary 800 | `#1A1F26` | Secondary dark surfaces, hover states on dark elements |
| Accent red | `#E53935` | Logo "auto" text, primary CTA buttons, phone number emphasis, bullet markers (matches banner red) |
| Accent red dark | `#C62828` | Red CTA hover/active state |
| Text on dark | `#FFFFFF` | Primary text on dark backgrounds |
| Text on dark (muted) | `#C8CED6` | Secondary text on dark backgrounds |
| Text on light | `#111317` | Body text on light backgrounds |
| Text on light (muted) | `#4B5563` | Secondary text on light |
| Neutral 200 | `#E5E7EB` | Borders, dividers |
| Surface | `#FFFFFF` | Light content sections (About / Services cards) |
| Surface alt | `#F5F7FA` | Section striping |

### Accessibility checks

- `#FFFFFF` on `#0F1419` → ~18:1 ✅ AAA
- `#E53935` on `#0F1419` → ~5.1:1 ✅ AA for normal text, AAA for large text
- `#FFFFFF` on `#E53935` → ~4.1:1 ✅ AA for large text (≥18pt or ≥14pt bold) — this is our CTA style
- `#111317` on `#FFFFFF` → ~17:1 ✅ AAA
- `#4B5563` on `#FFFFFF` → ~7.6:1 ✅ AAA

Rule: never put small-weight red body text on white. Red is for CTAs, headlines (large weight), highlights, and icons.

## Typography

**Headings**: `Poppins` (700, 600) — confirmed by user, session `2026-04-21`. Loaded from Google Fonts with `latin,latin-ext` subset for Romanian diacritics. Uppercase for small labels (like the banner's "RATE DOAR CU BULETINUL").

**Body / UI**: `Inter` (400, 500, 600) — not explicitly approved but standard companion to Poppins and has excellent diacritic rendering.

### Type scale (mobile → desktop)

| Level | Size | Line-height | Weight |
|---|---|---|---|
| H1 (hero) | `2.25rem` → `3.5rem` @ ≥768px | 1.1 | 700 |
| H2 (section) | `1.75rem` → `2.25rem` @ ≥768px | 1.2 | 700 |
| H3 (card) | `1.25rem` | 1.3 | 600 |
| Body | `1rem` | 1.6 | 400 |
| Small / label | `0.875rem` | 1.5 | 500 (uppercase, letter-spacing 0.05em for banner-style labels) |

## Voice

Tone confirmed by the banner's own copy: **direct, confident, benefit-forward, no exclamation marks, no sales clichés.** The banner says "12 LUNI GARANȚIE FĂRĂ LIMITĂ DE KM" — a concrete promise, not a slogan. Match that register.

- Romanian: second-person informal (`tu` / imperative forms like `Scrie-ne`). Not `dumneavoastră`.
- English: direct and plain. Avoid "Contact us today for amazing deals!"

Examples aligned with the banner:

- ✅ "12 luni garanție. Fără limită de km."
- ✅ "Rate doar cu buletinul. Numere provizorii incluse. Livrăm oriunde în țară."
- ✅ "Scrie-ne pe WhatsApp." / "Text us on WhatsApp."
- ❌ "Descoperă cele mai tari mașini la cele mai bune prețuri!!"

## Logo fallback SVG

Until we have a higher-fidelity SVG of the real logo, render inline:

```html
<a href="#" class="logo" aria-label="IST auto">
  <svg viewBox="0 0 140 32" role="img" aria-hidden="false">
    <text x="0"  y="24" font-family="Poppins, sans-serif" font-weight="700" font-size="26" fill="#FFFFFF">IST</text>
    <text x="62" y="24" font-family="Poppins, sans-serif" font-weight="400" font-size="22" fill="#E53935" font-style="italic">auto</text>
  </svg>
</a>
```

When the owner provides a proper SVG, replace this one block — nothing else needs to change.

## Favicon

Monogram `IST` in Poppins 700, white text on `#E53935` red square background. Generate at 16/32/48/180/192/512 px and save to `assets/img/favicon/`. Use [realfavicongenerator.net](https://realfavicongenerator.net/) before launch.

## Open Graph share image

1200x630 PNG: dark `#0F1419` background, white `IST Auto` wordmark centered, red accent rule, tagline `12 luni garanție fără limită de km` below. Save to `assets/img/og.jpg`.
