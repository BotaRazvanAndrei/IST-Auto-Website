# Memory — Index

> **Read this first.** This folder is the project's working memory. It exists so any LLM (or a returning human) can resume work in minutes without re-deriving context. See [../CLAUDE.md](../CLAUDE.md) for the project rules.

## Read order for a brand-new session

1. [01-project-brief.md](01-project-brief.md) — what IST Auto is and why we're building this
2. [05-progress-log.md](05-progress-log.md) — what was done in past sessions (most recent entry first)
3. [08-next-steps.md](08-next-steps.md) — what to do now
4. [07-mistakes-and-lessons.md](07-mistakes-and-lessons.md) — what not to repeat
5. [06-decisions-and-rationale.md](06-decisions-and-rationale.md) — decisions already settled (don't re-litigate)
6. Reference as needed: [02-client-data.md](02-client-data.md), [03-brand-identity.md](03-brand-identity.md), [04-website-spec.md](04-website-spec.md)

## File map

| File | Purpose |
|---|---|
| [00-index.md](00-index.md) | This file — table of contents and read order |
| [01-project-brief.md](01-project-brief.md) | Business summary, target customer, success criteria |
| [02-client-data.md](02-client-data.md) | Real contact info + `TODO_*` placeholders, pre-launch checklist |
| [03-brand-identity.md](03-brand-identity.md) | Palette, typography, logo spec, voice — the brand we invented |
| [04-website-spec.md](04-website-spec.md) | Sitemap, sections, i18n keys, SEO targets |
| [05-progress-log.md](05-progress-log.md) | Dated journal — what each session actually did |
| [06-decisions-and-rationale.md](06-decisions-and-rationale.md) | Every non-obvious decision + **why** |
| [07-mistakes-and-lessons.md](07-mistakes-and-lessons.md) | Dead-ends, wrong assumptions, fixes — *Mistake → Why → How to avoid* |
| [08-next-steps.md](08-next-steps.md) | Prioritized queue + blockers waiting on the owner |

## House rules for updating memory

- **At the end of every session**, append to `05`, `06` (if a decision was made), `07` (if something went wrong), and update `08`.
- **Dates are absolute** (e.g. `2026-04-21`), never "yesterday" or "last week".
- **Be specific**: name the file, the function, the exact error. "The iframe didn't work" is useless; "OLX sent `X-Frame-Options: sameorigin`, so the iframe renders blank — fallback in `olx-embed.js` handles it" is useful.
- **Honesty over polish**: if an approach failed, say so plainly. The lessons file exists so we stop repeating mistakes.
- **Never duplicate**: if the same fact belongs in two files, put it in one and link to it.
