# Content workflow: blog and page copy

## Blog articles

Articles are files. No component code is touched to add, edit, translate or unpublish one.

```
content/blog/<article-id>/de.mdx     ← German source
content/blog/<article-id>/en.mdx     ← translations (optional, one file per language)
content/blog/<article-id>/ar.mdx …
```

`<article-id>` is a stable, language-neutral name. It links the language versions to each other
(hreflang, language switcher) and is what other articles link to. Never rename it after publishing.

### Frontmatter

```yaml
---
title: "…"                    # H1 and <title>; ≤ 65 characters
slug: "…"                     # URL slug for THIS language; lowercase ASCII with hyphens; unique per language
description: "…"              # meta description, 140–160 characters
excerpt: "…"                  # teaser on cards
category: "instagram-marketing"   # one id from src/config/blog.ts
tags: ["Instagram", "Reels"]  # 3–5, written in the article's language (used by the tag filter)
date: "2026-11-18"            # first publication
updated: "2026-11-18"         # last substantial change (shown to readers and in structured data)
author: "redaktion"           # id from src/config/blog.ts
status: "published"           # "draft" → visible in `npm run dev` only, never built for production
translationStatus: "source"   # source | needs-review | reviewed
featured: false               # true → "Empfohlene Artikel" on the blog home
relatedService: "reels-video-production"   # optional; drives the sidebar box and CTA
answer: "…"                   # 2–3 sentence direct answer ("Kurz gesagt" box)
keyTakeaways: ["…", "…"]      # 3–5 bullets
faq:                          # optional; rendered at the end + FAQPage structured data
  - q: "…"
    a: "…"
sources:                      # optional; only real, checked sources
  - title: "…"
    url: "https://…"
---
```

The build fails with a clear message if a field is missing or malformed, or if two articles in
one language share a slug.

### Body

Plain Markdown (GFM tables allowed), starting with the introduction — title, answer box, key
takeaways, table of contents, FAQ, author box, share links and the closing CTA are added by the template.

- Headings: `##` and `###` only. They become the table of contents and get anchor links.
- Internal links are language-neutral and resolved per language at build time:
  - `[Text](page:contact)`, `[Text](page:service:reels-video-production)`, `[Text](page:industry:gastronomy)` …
  - `[Text](post:<article-id>)` → that article in the reader's language (falls back to the blog home
    if it is not translated yet).
- One component: `<Callout title="Tipp">One paragraph.</Callout>`.
- No raw `<`, `>`, `{`, `}` in text (MDX would treat them as code).

### Editorial rules

1. One article = one search intent. Check the content plan below before starting a new topic.
2. Answer the question in the first paragraph (`answer`), then explain.
3. No statistics, study claims or platform "facts" without a source you have opened yourself; list it in `sources`.
   Article 12 cites six Google help pages. They could not be opened from the build environment and were
   taken from search extracts — **open each link once and compare the figures before launch.**
4. No invented clients, results or testimonials. Examples must read as examples.
5. Update `updated` whenever the substance changes.

### Publishing steps

1. Write `de.mdx` with `status: "draft"`, preview with `npm run dev`.
2. Set `status: "published"`, run `npm test` and `npm run build`.
3. Commit and push → Vercel deploys. The article appears in the blog, its category, the sitemap and `llms.txt`.

### Translating an article

1. Copy `de.mdx` to `<locale>.mdx`, translate the text fields and the body, give it its own `slug`,
   keep `category`, `date`, `author`, `relatedService`, link targets and heading structure.
2. Set `translationStatus: "needs-review"`. Readers see a note that the translation is under review.
3. A native speaker reviews it (see `TRANSLATION_REVIEW.md`) and sets `translationStatus: "reviewed"`.
4. A language version that does not exist is simply not generated: no empty page, no hreflang entry,
   and the language switcher sends readers to that language's blog home instead.

`npm run check:i18n` prints the coverage table (article × language × status).

To take one translated article out of the index while it is being reworked, set `status: "draft"`.
To keep a whole language out of search engines, set `indexable: false` in `src/i18n/config.ts`.

### Categories and authors

- Categories: ids and slugs in `src/config/blog.ts`, names and descriptions in
  `messages/<locale>/pages.json` → `blog.categories`. A category page exists only while it has articles.
- Authors: `src/config/blog.ts` + `blog.authors` in the messages. The current author is the editorial
  team (an organization). When a real person writes, add them with `type: "person"` and their profile
  links — the article then carries `Person` structured data and an author page.

## Page copy

All page texts are in `messages/<locale>/*.json`. German is the source: change German first, then the
other languages, then run `npm run check:i18n` (fails if a key, list item or `{placeholder}` is missing).
After changing reviewed text in German, set that language's `reviewStatus` back to `needs-review`
until the translation has been checked again.

## Content plan

Status of all twelve articles: German published; EN/AR/KU/TR translated, `needs-review`.
Suggested CTA for all: "Kostenloses Erstgespräch" plus the related service.

| # | Article id | Primary topic | Search intent | Audience | Title (DE) | Slug (DE) | Main sections | Related service | Internal links |
|---|---|---|---|---|---|---|---|---|---|
| 1 | social-media-marketing-small-business | Social Media Marketing für kleine Unternehmen | Informational: how to start | Owners starting out | Social Media Marketing für kleine Unternehmen: So startest du | social-media-marketing-kleine-unternehmen | Goal, channel, formats, rhythm, routine | Social Media Management | strategy article, posting frequency, services |
| 2 | social-media-management-cost | Kosten Social Media Betreuung | Commercial investigation | Owners comparing offers | Was kostet professionelle Social Media Betreuung? | kosten-social-media-betreuung | Pricing models, cost drivers, hidden costs, checking an offer | Social Media Management | packages, contact, measuring success |
| 3 | instagram-marketing-restaurants | Instagram für Restaurants | Informational, industry | Restaurant/café owners | Instagram Marketing für Restaurants: Der Praxis-Leitfaden | instagram-marketing-restaurants | Profile, content ideas, Reels, routine | Content-Erstellung | gastronomy page, Reels guide |
| 4 | instagram-posting-frequency | Posting-Frequenz Instagram | Informational, quick answer | Owners posting themselves | Wie oft sollte ein Unternehmen auf Instagram posten? | wie-oft-auf-instagram-posten | Rule of thumb, formats, testing with Insights | Social Media Management | strategy, mistakes |
| 5 | reels-guide-local-business | Reels erstellen | How-to | Local businesses | Reels erstellen: Der Leitfaden für lokale Unternehmen | reels-erstellen-leitfaden | Idea, shoot, edit, publish, legal points | Reels & Videoproduktion | Reels service, Instagram vs TikTok |
| 6 | instagram-vs-tiktok | Instagram oder TikTok | Comparison | Owners choosing a channel | Instagram oder TikTok: Was lohnt sich für Unternehmen? | instagram-oder-tiktok-fuer-unternehmen | Differences, comparison table, decision help | Social-Media-Strategie | strategy service, Reels guide |
| 7 | social-media-strategy-small-business | Social-Media-Strategie | How-to | Small businesses | Social Media Strategie für kleine Unternehmen | social-media-strategie-kleine-unternehmen | Seven steps from goal to review | Social-Media-Strategie | strategy service, measuring success |
| 8 | common-social-media-mistakes | Social-Media-Fehler | Informational, checklist | Owners already posting | Die häufigsten Social Media Fehler | haeufigste-social-media-fehler | Mistakes and fixes | Social Media Management | strategy, posting frequency |
| 9 | content-ideas-salons | Content-Ideen Salons | Idea list, industry | Hairdressers, salons | Content-Ideen für Friseure und Beauty-Salons | content-ideen-friseure-beauty-salons | Idea groups, consent, routine | Content-Erstellung | beauty page, Reels guide |
| 11 | menu-design-restaurants | Speisekarten-Design | Informational, how-to | Restaurant/café owners | Speisekarten-Design: Was Restaurants beachten sollten | speisekarten-design-restaurants | Structure, legibility, formats, QR, print files, checklist | Speisekarten-Design | menu service, gastronomy page, Google article |
| 12 | google-maps-photos-business | Google Maps Bilder aktualisieren | How-to | Owners of local businesses | Google Maps Bilder aktualisieren: So geht's für Unternehmen | google-maps-bilder-aktualisieren | Profile basics, adding photos, what Google decides, access without password, routine | Google-Unternehmensprofil | profile service, local-businesses page, menu article |
| 10 | measuring-social-media-success | Erfolg messen | How-to | Owners wanting proof | Wie misst man den Erfolg von Social Media Marketing? | erfolg-social-media-marketing-messen | Goals → KPIs, tracking enquiries, monthly review | Social-Media-Strategie | strategy, cost article |

### Topic clusters and next articles

Each cluster has one service or industry page as its hub; articles link to the hub and to each other.
The four categories without articles are not shown on the site until they have one.

| Cluster (hub page) | Published | Next articles (distinct intents) | Category |
|---|---|---|---|
| Social Media Management | 1, 2, 8, 10 | "Social Media selbst machen oder Agentur beauftragen?" | social-media-marketing |
| Reels & Video | 5 | "Reels-Ideen für Restaurants", "Untertitel für Reels" | reels-video-marketing |
| Strategy | 6, 7 | "Redaktionsplan erstellen: Vorlage und Anleitung" | social-media-strategy |
| Content creation | 9 | "Bessere Handyfotos für den Betrieb" | content-creation |
| Gastronomy / Salons / Fitness | 3, 9 | "Social Media für Fitnessstudios: Content-Ideen" | restaurant-/salon-marketing |
| Local marketing & design (menu design, Google-Unternehmensprofil) | 11, 12 | "QR-Code-Speisekarte: Vor- und Nachteile", "Öffnungszeiten und Feiertage im Google-Unternehmensprofil pflegen" | restaurant-marketing, local-business-marketing |
| Local business | – | "Facebook für lokale Unternehmen: lohnt es sich noch?" | facebook-marketing |
| AI tools | – | "KI-Tools für Social Media: was sie können und was nicht" | ai-tools-marketing |

Avoid near-duplicates: e.g. no separate "Instagram für Cafés" next to article 3 — extend article 3 instead.
