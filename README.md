# IST Auto — Website

A small, fast, bilingual (Romanian + English) static website for **IST Auto**, a Romanian car-selling lot. The site exists to give IST Auto a searchable Google presence and funnel buyers to their OLX listings, WhatsApp, Facebook, and Instagram.

**Tech:** plain HTML, CSS, vanilla JavaScript. No build step. Hosted on GitHub Pages.

---

## Local preview

```sh
python3 -m http.server 8000
# open http://localhost:8000
```

No install, no build. Any change to an HTML / CSS / JS file shows up on refresh.

---

## Project rules

- Before touching any code, read [CLAUDE.md](CLAUDE.md) and then [Memory/00-index.md](Memory/00-index.md).
- Every session ends by updating [Memory/05-progress-log.md](Memory/05-progress-log.md), plus [06](Memory/06-decisions-and-rationale.md) / [07](Memory/07-mistakes-and-lessons.md) / [08](Memory/08-next-steps.md) when applicable. This is non-negotiable — it's the whole point of the `Memory/` system.
- Unknown values use the `TODO_*` placeholder convention. Before launch, `grep -r "TODO_" .` must return zero results outside [Memory/02-client-data.md](Memory/02-client-data.md).

---

## Structure

```
.
├── CLAUDE.md                  # loaded into every LLM session
├── README.md                  # you are here
├── Memory/                    # working memory — start at 00-index.md
├── index.html                 # single-page site
├── assets/
│   ├── css/styles.css
│   ├── js/{i18n.js, olx-embed.js}
│   ├── img/
│   └── lang/{ro.json, en.json}
├── robots.txt
├── sitemap.xml
└── .nojekyll
```

## Deploy (GitHub Pages)

1. Push to GitHub
2. Repo **Settings → Pages** → source `main` branch, root folder
3. (Optional) Custom domain via a `CNAME` file at repo root + DNS record

See [Memory/08-next-steps.md](Memory/08-next-steps.md) for the full launch checklist including Google Search Console and Google Business Profile setup.
