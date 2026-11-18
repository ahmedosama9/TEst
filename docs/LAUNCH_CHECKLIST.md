# Launch checklist

The code is complete and tested locally. These items need the owner, external accounts or people
and are **not** done.

## Blockers

- [ ] **Business identity** in `src/config/site.ts`: legal name, postal address, owner/responsible person, VAT ID if any
- [ ] **Contact details**: `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_CONTACT_PHONE`
- [ ] **Impressum and Datenschutzerklärung** completed and legally checked → `documentsApproved: true` (`docs/LEGAL_CHECKLIST.md`)
- [ ] **Contact form delivery**: Resend account, verified sending domain, three env vars; test enquiry received (`docs/DEPLOYMENT.md` §2)
- [ ] **Owner approval of the German copy** — in particular everything that describes how the agency
      works: approval before publishing, regular reports, on-site shoots, account access, package
      contents, answers in the FAQs, and first-person statements in the articles ("Fragen, die wir häufig hören")
- [ ] **Logo source file**: the site uses the supplied PNG (`public/brand/source/logo-original.png`).
      It has slightly rough edges and stray pixels from background removal, visible when enlarged.
      A vector (SVG) or clean high-resolution export from the designer would be sharper — drop it in
      and rerun `python3 scripts/derive-brand-variants.py`
- [ ] **White-wordmark variant**: the supplied logo has a navy wordmark, which is unreadable on the navy
      header/footer. `logo-on-dark.png` is a pixel copy with only the wordmark and divider recoloured
      to white. Replace it with the designer's official dark-background version if one exists

- [ ] **Service area**: confirm the 150 km on-site radius around Münster (`serviceArea.onSiteRadiusKm`)
      and the wording "Betreuung in ganz NRW"

- [ ] **New services — owner approval**: confirm the descriptions of Speisekarten-Design and
      Google Maps Bilder erneuern & Unternehmensfotos (scope, print coordination, QR-menu hosting, manual upload as profile manager)
- [ ] **New services — real imagery**: the before/after visuals on both pages are schematic examples.
      Replace them with the agency's own, licensed photos and real menu designs when available
- [ ] **Google facts**: open the six Google help links cited in the article "Google Maps Bilder
      aktualisieren" and confirm formats, sizes and role names (they could not be opened during the build)

## Before indexing other languages

- [ ] Native-speaker review of EN / AR / KU / TR (`docs/TRANSLATION_REVIEW.md`), or set
      `indexable: false` for languages that should stay out of search until reviewed
- [ ] Decide whether service is offered in other languages (`confirmedServiceLanguages`)

## Commercial details (can follow after launch)

- [ ] Prices, deliverables per package, minimum term, travel policy in `src/config/packages.ts`
- [ ] Real social media profiles in `site.social`
- [ ] Real portfolio work and, with consent, case studies (replace the labelled examples)
- [ ] Owner/team section on the About page (appears when `site.owner` is set); real authors for the blog

## Go-live steps

1. Import the repository in Vercel, set environment variables, deploy a preview.
2. Check the preview: all five languages, contact form end-to-end, legal pages.
3. Add the domains in Vercel; set the `A` and `CNAME` records at Namecheap **without touching mail records** (`docs/DEPLOYMENT.md` §3).
4. Confirm HTTPS, `www` → apex redirect, and that e-mail still works.
5. Check `/robots.txt`, `/sitemap.xml`; submit the sitemap in Search Console and Bing Webmaster Tools.
6. Run the manual checks in `docs/SEO.md`; measure PageSpeed/Core Web Vitals on the live domain.
7. Create/verify the Google Business Profile with identical name, phone and URL.
