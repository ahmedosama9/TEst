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
- [ ] **Brand check**: the logo and layout were built from the written brand description; the
      reference image was not available. Compare with the reference and replace `public/brand/*` and
      `src/components/ui/logo.tsx` if the official logo differs

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
