# Legal completion checklist

The legal pages are **drafts**. They show a yellow draft banner, mark missing facts visibly and are
`noindex` until `site.legal.documentsApproved` is set to `true` in `src/config/site.ts`.
This checklist is not legal advice; have the final texts checked by a lawyer or a reputable
generator service for German law.

## Facts the owner must supply (`src/config/site.ts`)

- [ ] `legalName` — full name of the owner or company incl. legal form
- [ ] `address` — street, postal code, city (a summonable address; no P.O. box)
- [ ] `owner` — name and role of the person representing the business / responsible for content
- [ ] `contact.email` and `contact.phone` (via `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_PHONE`)
- [ ] `legal.vatId` — USt-IdNr., if one exists (otherwise remove that section in `legal.tsx`)
- [ ] `legal.registerCourt` / `registerNumber` — only if registered (e.g. GmbH, e.K.)
- [ ] Any profession-specific or supervisory information, if applicable

## Impressum (`messages/de/legal.json` → `imprint`)

- [ ] Wording of the consumer dispute resolution statement matches the business's actual position
- [ ] Liability and copyright paragraphs approved

## Datenschutzerklärung (`messages/de/legal.json` → `privacy`)

- [ ] Hosting: name and address of the host (Vercel Inc.), data-processing agreement accepted,
      server region, log retention, legal basis for third-country transfer — replace the bracketed note
- [ ] Contact form: e-mail provider (Resend) named, DPA accepted, transfer basis — replace the bracketed note
- [ ] Retention periods for enquiries defined
- [ ] E-mail provider of the existing mailboxes mentioned if enquiries are stored there
- [ ] Cookie section still matches reality (only `smk_locale` cookie and `smk_consent` local storage)
- [ ] Supervisory authority correct for the business's federal state
- [ ] If analytics, pixels, maps, videos or fonts from third parties are added later: update this
      document, the cookie settings page and gate the service behind `<ConsentGate>`

## Translations

- [ ] German version is legally binding; translated legal pages state this at the top
- [ ] After the German texts are final, re-translate and have them reviewed (see `TRANSLATION_REVIEW.md`)

## Other

- [ ] Written consent process for people who appear in photos/videos (clients, staff, guests)
- [ ] Contract/offer templates cover usage rights, term and notice period as described on the packages page
- [ ] Set `documentsApproved: true` → banner disappears, pages become indexable
