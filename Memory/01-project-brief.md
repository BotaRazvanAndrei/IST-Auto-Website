# 01 — Project Brief

## Who is IST Auto

IST Auto is a **car-selling lot (parc auto)** in Romania. They currently operate with **zero online presence**:

- No website
- Not indexed on Google
- No Google Business Profile
- Some activity on OLX, Facebook, and Instagram — details partially known (see [02-client-data.md](02-client-data.md))
- No logo, no brand colors, no defined voice

They sell used cars and (to be confirmed with the owner) may also offer related services: trade-ins, consultancy, financing brokerage, sourcing-on-request.

## Target customer

Romanian local buyers searching for used cars online — most likely via:

1. **Google search** for `parc auto <city>`, `masini second hand <city>`, `rulate <oraș>`, specific brand/model queries
2. **OLX** listings they then want to verify against a "real" website before contacting the seller
3. **Social referral** (friend shares an FB/Insta post, buyer wants to see a legitimate site)

Secondary audience: English-speaking buyers (expats, dealers, export) — hence bilingual RO + EN.

## Why this project exists

Right now, a prospective buyer who finds an IST Auto OLX listing has **no way to verify the business is legitimate** — no website, no Google result, no structured info. This kills trust and conversions. The goal of the site is not to replace OLX as a sales channel; it is to:

1. **Exist on Google** when someone searches the business name or `parc auto <city>` → solved by SEO (meta tags, JSON-LD `LocalBusiness` + `AutoDealer`, Google Search Console submission, Google Business Profile setup).
2. **Look legitimate** when a buyer Googles IST Auto after seeing an OLX ad → solved by brand identity + clean design + real address/hours.
3. **Funnel buyers to high-conversion channels** — WhatsApp (direct chat), OLX (listings), Facebook / Instagram (social proof).

## Success criteria

Ship 1 (MVP):

- [ ] Site is live on GitHub Pages at a real domain (or `*.github.io` if no domain yet)
- [ ] Indexed by Google (confirmed via Search Console)
- [ ] Bilingual toggle works and persists
- [ ] WhatsApp, Facebook, Instagram, OLX CTAs all go to correct URLs
- [ ] Lighthouse ≥ 90 on Performance, Accessibility, Best Practices, SEO
- [ ] Google Business Profile created and verified

Ship 2 (later, not in scope now):

- Appear on page 1 of Google for `parc auto IST` and `parc auto <city>`
- Inbound WhatsApp messages attributable to the site
- Owner can update featured listings without LLM help (likely via editing a single data file)

## Out of scope (explicit)

- User accounts, authentication
- Payment processing
- Server-side contact form / email backend
- A CMS
- Real-time OLX inventory scraping
- Multi-page blog / content marketing
- Multiple languages beyond RO + EN
