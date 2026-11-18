# SEO and AI-search implementation

## What is implemented

| Area | Implementation |
|---|---|
| Titles / descriptions | Unique per page and language from `messages/<locale>` (`meta.title`, `meta.description`) or article frontmatter; built in `src/lib/seo.ts` |
| Canonicals | Self-referencing absolute URL on every page. Translations are **not** canonicalized to German |
| hreflang | `de`, `en`, `ar`, `ku`, `tr` + `x-default` (→ German). Only language versions that exist are listed; sets are reciprocal. Also in the sitemap |
| hreflang codes | Language-only on purpose: every version addresses speakers living in Germany/EU. `tr-TR` would target Turkey. `<html lang>` uses `de-DE`, `en`, `ar`, `ku`, `tr-TR` |
| `<html lang/dir>` | Per language; Arabic `dir="rtl"` |
| Open Graph / Twitter | Localized title, description, `og:locale`, alternates, 1200×630 image per language (`public/og`) |
| Sitemap | `/sitemap.xml`: all indexable pages in all languages with alternates; articles carry `lastmod` |
| Robots | `/robots.txt`: open on production, `Disallow: /` everywhere else. Non-production pages are also `noindex` |
| Structured data | `Organization` + `WebSite` (home), `Service` (service pages), `BreadcrumbList` (all inner pages), `BlogPosting` (articles), `FAQPage` (only where the Q&As are visible on the page) |
| Rendering | Every page is static HTML; content is not dependent on client JavaScript |
| Not indexed | Legal pages until approved, cookie settings, 404, any language with `indexable: false`, draft articles (not built) |
| URL policy | Localized slugs for German and Turkish; English slugs for English, Arabic and Kurdish (stable ASCII URLs; can be localized later with redirects) |

### Structured data and facts

`Organization` contains only verified facts from `src/config/site.ts`: name, URL, logo, service area,
topics. Address, phone, e-mail, legal name and `sameAs` profiles are added automatically once
configured; the type extends to `ProfessionalService` (a `LocalBusiness` subtype) only when a real
address exists. There are no ratings, reviews, opening hours or staff. Authors are the editorial
team (organization); `Person` is emitted only for authors configured as real people.

Valid markup does not guarantee rich results. Google currently shows FAQ rich results only for a
small set of site types; the `FAQPage` markup is kept because it is accurate and cheap, not because
a rich result is expected.

### AI search (GEO / AEO)

There is no special markup that guarantees inclusion in AI Overviews, ChatGPT Search, Perplexity or
Copilot. What the site does is make its content easy to retrieve and quote correctly:

- Each service page opens with a short definition under a question heading ("Was ist Social Media Management?").
- Common questions have direct answers on the page that owns the topic (FAQ page, service FAQs,
  packages page for cost, process page for on-site shoots).
- Articles start with a 2–3 sentence answer, then key takeaways, structured sections, FAQ, author and last-updated date.
- Consistent entity description (name, what, where, for whom) on home, about, footer, structured data and `llms.txt`.
- Honest limits are stated explicitly (prices on request, no guarantees, examples are examples) so they are not misquoted.

`/llms.txt` is an experimental, supplementary summary of the German site. It is not a ranking factor.

## Crawler control

Current policy (`src/app/robots.ts`): everything public is open to all crawlers.

| Crawler group | Examples | Blocking means |
|---|---|---|
| Search engines | Googlebot, Bingbot | Not in search results. Never block. Bing's index also feeds Copilot and ChatGPT Search |
| AI search / answer retrieval | OAI-SearchBot, ChatGPT-User, PerplexityBot, Claude-SearchBot, Claude-User | The site cannot be cited or linked in those answer engines |
| AI model training | GPTBot, ClaudeBot, Google-Extended, CCBot, Applebot-Extended | Content is not used for training. `Google-Extended` does not affect Google Search or AI Overviews |

Options: (a) keep everything open — maximum discoverability, content may be used for training;
(b) allow search and AI-search crawlers but disallow training crawlers — keeps citations, opts out
of training where the crawler honours robots.txt; (c) block AI crawlers entirely — no AI-search
visibility. To apply (b), add rule objects per user agent in `robots.ts`. Bot names change;
check each vendor's current documentation before editing. AI Overviews and AI Mode use the normal
Google index — there is no separate opt-in, and `nosnippet`/`max-snippet` limits affect them.

## Local SEO

- Münster and the service area are stated in titles/descriptions where natural, on home, about,
  process, contact, footer and in `areaServed`.
- No city landing pages and no office claims. The service area comes from `site.serviceArea`.
- To do by the owner (cannot be done in code): create and verify a Google Business Profile as a
  service-area business with the same name, phone and URL; keep name/address/phone identical everywhere.

## Validation checklist

Automated (run before every release):

- [ ] `npm run typecheck && npm run lint && npm test`
- [ ] `npm run check:i18n`
- [ ] `NEXT_PUBLIC_ALLOW_INDEXING=true npm run build && npm start` then `npm run audit:site`
      (status 200, lang/dir, unique titles and descriptions, self-canonicals, reciprocal hreflang +
      x-default, JSON-LD parse and required fields, one `<h1>`, alt text, internal links,
      no placeholders, 404 status, root redirect, robots/sitemap)
- [ ] `npm run audit:browser`

Manual, on the live domain:

- [ ] Rich Results Test + validator.schema.org for: home, one service page, one article, FAQ
- [ ] Search Console: sitemap submitted, International Targeting / hreflang report without errors
- [ ] URL Inspection for one page per language: indexed, canonical = declared canonical
- [ ] `site:socialmediakomplett.de` shows no preview, legal-draft or placeholder pages
- [ ] PageSpeed Insights (mobile) for home and one article; Core Web Vitals field data after a few weeks
- [ ] Social share preview (WhatsApp, LinkedIn, Facebook debugger) per language
