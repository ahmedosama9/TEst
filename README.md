# Social Media Komplett — Website

Multilingual agency website with blog for **Social Media Komplett** (Münster), built for
`https://socialmediakomplett.de`.

- **Stack:** Next.js 16 (App Router, Turbopack), React 19, TypeScript (strict), Tailwind CSS 4,
  next-intl, Motion, React Hook Form + Zod, MDX, Lucide.
- **Languages:** German (default), English, Arabic (RTL), Kurdish Kurmanji, Turkish — every page
  is a statically generated, individually indexable URL under `/de`, `/en`, `/ar`, `/ku`, `/tr`.
- **No database, no CMS, no tracking.** Content lives in JSON and MDX files in this repository.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional for local work
npm run dev                  # http://localhost:3000 → redirects to /de
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Development server (draft articles visible) |
| `npm run build` / `npm start` | Production build / serve it |
| `npm run typecheck` | TypeScript, strict |
| `npm run lint` | ESLint (Next.js core-web-vitals + TypeScript) |
| `npm test` | Unit tests: routes, hreflang, blog content, form validation, rate limiter |
| `npm run check:i18n` | All languages have the same message structure as German; blog coverage table |
| `npm run audit:site` | Crawls a running build: status, canonicals, reciprocal hreflang, JSON-LD, links, 404 |
| `npm run audit:browser` | Real-browser checks: RTL, overflow at 3 viewports × 5 languages, switcher, blog, forms |

`audit:site` needs a build made with `NEXT_PUBLIC_ALLOW_INDEXING=true` that is running on port 3000.
`audit:browser` and `scripts/generate-brand-assets.mjs` need Playwright
(`npm i -D playwright && npx playwright install chromium`).

## Where things live

```
content/blog/<article-id>/<locale>.mdx   Blog articles (one folder per article, one file per language)
messages/<locale>/*.json                 All page and UI copy (German is the source of truth)
src/config/site.ts                       Business facts, service area, contact, legal switches
src/config/packages.ts                   Package prices, deliverables, terms, add-ons
src/config/blog.ts                       Blog categories (+ slugs) and authors
src/i18n/config.ts                       Languages, direction, hreflang, review/index status
src/lib/routes.ts                        Route registry: page ids → localized URL slugs
src/lib/pages.ts                         URL resolver, alternates, metadata lookup
src/lib/seo.ts                           Metadata + JSON-LD builders
src/app/[locale]/[[...path]]/page.tsx    The one route that renders every page
src/components/pages/*                   Page templates
public/brand, public/og                  Logo files and social sharing images
docs/                                    Deployment, content, translation, SEO and legal guides
```

### How routing works

There is a single catch-all route. Each request is resolved against the route registry
(`src/lib/routes.ts`) and the blog content, so page ids stay stable while slugs are localized
(`/de/kontakt`, `/en/contact`, `/tr/iletisim`). `generateStaticParams` enumerates every page, so the
whole site is static HTML. Each page passes the language versions that really exist to the header;
the language switcher, `hreflang` tags and the sitemap all use that same list.

The root URL `/` redirects to `/de`. If a visitor has explicitly chosen a language in the switcher
(cookie `smk_locale`), `/` redirects there instead. Language URLs themselves are never redirected
and there is no browser-language sniffing.

### Changing common things

| I want to… | Edit |
| --- | --- |
| Set address, owner, VAT ID, e-mail, phone, social profiles | `src/config/site.ts` (+ env vars for e-mail/phone) |
| Change the service area | `src/config/site.ts` → `serviceArea` |
| Publish prices and package contents | `src/config/packages.ts` |
| Change any text | `messages/<locale>/*.json` |
| Add or edit an article | `content/blog/…` — see `docs/CONTENT_WORKFLOW.md` |
| Mark a language as reviewed / hide it from search | `src/i18n/config.ts` → `reviewStatus`, `indexable` |
| Add a language (e.g. Sorani `ckb`) | see the comment at the top of `src/i18n/config.ts` |
| Add analytics later | wrap it in `<ConsentGate category="analytics">` (`src/components/forms/consent-settings.tsx`) |

## Documentation

- `docs/DEPLOYMENT.md` — Vercel, Namecheap DNS without touching e-mail, Resend, environment variables
- `docs/CONTENT_WORKFLOW.md` — writing, translating and publishing articles; content plan
- `docs/TRANSLATION_REVIEW.md` — native-speaker review checklist and open questions per language
- `docs/SEO.md` — what is implemented, crawler control, validation checklist
- `docs/LEGAL_CHECKLIST.md` — what must be completed before the legal pages are final
- `docs/LAUNCH_CHECKLIST.md` — remaining steps to go live

## Honesty rules built into the site

- Facts that have not been supplied are `null` in `src/config/site.ts`; the site then hides the
  element or shows a visible "to be supplied" marker (legal pages) — nothing is invented.
- `LocalBusiness`-type structured data is only emitted once a real address is configured.
- Portfolio tiles are labelled as examples. There are no testimonials, ratings or client numbers.
- Prices render as "Preis auf Anfrage" until set in `src/config/packages.ts`.
- The contact form reports success only when the mail provider accepted the message.
- All non-German text is a machine-assisted draft marked `needs-review` until a native speaker signs it off.

## Measured results (local production build, 2026-11-18)

| Check | Result |
| --- | --- |
| TypeScript strict, ESLint | no errors |
| Unit tests | 12 / 12 passed |
| Static pages generated | 216 (195 indexable URLs in the sitemap, 39 per language) |
| Site audit | passed: canonicals, reciprocal hreflang, unique titles/descriptions, JSON-LD, 210 internal links, 404, redirects |
| Browser audit | passed: 135 page renders (3 viewports × 5 languages) without overflow or console errors; RTL, switcher, blog, forms |
| axe (WCAG 2.2 AA rules) | 0 violations on 18 pages × 2 viewports |
| Lighthouse mobile — home (de / ar) | Performance 95 / 98, Accessibility 100, Best Practices 100, SEO 100 |
| Lighthouse mobile — article | Performance 97–100, LCP 0.9 s, CLS 0 |
| Lighthouse desktop | Performance 99–100 |

Lighthouse numbers are lab values from a local server and vary between runs; measure again on the
live domain. Automated accessibility tools find only part of all issues — a manual screen-reader
pass (VoiceOver/NVDA, including Arabic) is still recommended.
