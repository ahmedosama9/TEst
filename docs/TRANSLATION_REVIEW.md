# Translation review checklist

**Status: no translation on this site has been verified by a native speaker or professional
translator.** English, Arabic, Kurdish (Kurmanji) and Turkish were produced as machine-assisted
drafts from the German source. They are marked `needs-review` in `src/i18n/config.ts`
(page and UI copy) and in each article's frontmatter (`translationStatus`). While a language is in
that state, its footer says so and its articles carry a review note.

## Workflow for a reviewer

1. Review on the running site (`npm run dev`, then `/en`, `/ar`, `/ku`, `/tr`) next to the German page.
2. Correct text directly in `messages/<locale>/*.json` and `content/blog/<id>/<locale>.mdx`.
   Change values only — never keys, `{placeholders}`, link targets (`page:…`, `post:…`) or the
   frontmatter fields `category`, `date`, `author`, `relatedService`.
3. Run `npm run check:i18n` and `npm test` (structure, placeholders, link targets, heading counts).
4. Sign off:
   - articles: set `translationStatus: "reviewed"` per file;
   - page/UI copy: set `reviewStatus: "reviewed"` for the language in `src/i18n/config.ts`
     (removes the footer note).
5. Service languages: the site says consulting is currently in German only. Once the agency can
   really serve clients in another language, add its code to `confirmedServiceLanguages` in
   `src/config/site.ts` and adjust `about.languagesText` and the matching FAQ answer.

Slugs: article slugs and Turkish page slugs are part of the URL. Change them **before** launch if
needed; after launch a change needs a redirect.

## What to check in every language

- [ ] Natural, idiomatic wording a business owner in Germany would trust; consistent form of address
- [ ] Consistent terminology (see glossaries below) across pages, forms and articles
- [ ] Meaning matches German: no added promises, numbers or claims; caveats kept ("example", "on request", "no guarantee")
- [ ] Navigation, buttons and form labels fit their space on mobile (360 px)
- [ ] Form validation and success/error messages
- [ ] Sentences with inserted values read correctly: service-area sentences (`{areas}`, `{remote}`),
      "page {n}", "{count} articles", "{minutes} min", share labels, package terms (`{months}`, `{km}`, `{city}`)
- [ ] Page titles and meta descriptions (search snippets)
- [ ] Legal pages: translation is for convenience; German is binding. Re-check after the German legal texts are final
- [ ] The four brand attributes under the hero (`home.hero.values`: Schnell, Komplett, Wachstumsstark, Messbar) and the
      hero copy: three headline lines (`home.hero.titleLines`; `titleHighlight` must be an exact part of one line),
      `subtitle`, `ctaPrimary`, `ctaSecondary`, `imageAlt`
- [ ] Regional positioning (Münster & NRW): hero label, home/about/contact/service descriptions, footer and the
      service-area sentences with `{city}` and `{km}`. NRW is written as "NRW", spelled out once per language
      (North Rhine-Westphalia / Kuzey Ren-Vestfalya / شمال الراين-وستفاليا / Nordrhein-Westfalen)
- [ ] The inline error-page strings in `src/app/[locale]/error.tsx` and the taglines in `scripts/generate-brand-assets.mjs` (share images)

## English (`en`, British English)

Glossary: Betreuung → social media management / ongoing management · Redaktionsplan → content
calendar · Drehtermin → on-site shoot · Erstgespräch → free initial consultation · Anfrage → enquiry ·
Angebot → quote · Freigabe → approval · Impressum → Legal Notice · Ratgeber → Blog · Ablauf → How it works.

Open points:
- [ ] Legal citations are kept in German form with English glosses — legal check
- [ ] Legal meta descriptions were lengthened slightly versus German (neutral wording)
- [ ] `industries.items.gastronomy.meta.title` adds "in Germany" and drops "Instagram"
- [ ] "from a single source" for "alles aus einer Hand" — or "all in one place"?
- [ ] "clients" (salon article) vs "customers" (salon page)
- [ ] Culture-specific terms glossed: Abiball, du/Sie, Semesterstart, Mittagstisch, Ruhetag, Sanitätshaus, Steuerkanzlei
- [ ] Service names in Title Case vs sentence case in forms
- [ ] `about.story[2]` explains the "komplett" pun

## Arabic (`ar`, Modern Standard Arabic, RTL)

Conventions: respectful plural address (أنتم); platform and brand names in Latin script; Western
digits; Arabic punctuation (، ؛ ؟) and «…» quotes; English URL slugs.

Glossary: social media management → إدارة حسابات التواصل الاجتماعي · content creation → صناعة المحتوى ·
community management → إدارة المجتمع · editorial plan → الخطة التحريرية · on-site shoot → موعد تصوير في الموقع ·
free initial consultation → استشارة أولية مجانية · package → باقة · enquiry → استفسار · approval → الموافقة ·
reach → الوصول · blog → المدونة · portfolio → نماذج الأعمال · Impressum → البيانات القانونية.

Open points:
- [ ] Number agreement: `resultsCount`, `readingTime` and `terms.term.value` ("أشهر" is only right for 3–10) were reworded to avoid plural forms — confirm
- [ ] Latin words with Arabic prefixes (وReels, لـ Instagram, بـ Instagram): rendering and house style
- [ ] Platform names in Latin vs Arabic script (إنستغرام, ريلز)
- [ ] `hero.mockup.profile` left as "dein.unternehmen"; `about.facts.base.value` left in Latin script
- [ ] Legal terms: معالجة البيانات بالنيابة, جهة تحكيم للمستهلكين, محكمة السجل, the NRW authority name
- [ ] Beauty/fitness loanwords (البالياج, الغلوسينغ, قصّة بوب, الرفعة الميتة, مكواة الفرد, أطباق البول) for Levantine and Iraqi readers
- [ ] Cultural references kept literally: wine pairing, Christmas menu/season, bars, Abiball
- [ ] Nav uses "تواصل معنا", buttons use "تواصلوا معنا"
- [ ] 24-hour clock in the restaurant article; shortened title of the small-business article
- [ ] Mixed Arabic/Latin lines (brand name, e-mail, package names) read in the right order on the live page

## Kurdish (`ku`, Kurmanji, Latin script)

Kurmanji marketing vocabulary is the least standardized of the five languages; this review needs
the most care. Open points and glossary: see the section appended at the end of this file.

## Turkish (`tr`)

Conventions: "siz" throughout; Turkish URL slugs (ASCII); German legal references verbatim.

Glossary: sosyal medya yönetimi · içerik üretimi · topluluk yönetimi · Redaktionsplan → içerik takvimi ·
Drehtermin → yerinde çekim / çekim günü · Erstgespräch → ücretsiz ön görüşme · Anfrage → talep ·
Angebot → teklif · Freigabe → onay · Reichweite → erişim · Karussell → kaydırmalı gönderi ·
Impressum → Künye · Datenschutzerklärung → Gizlilik Politikası · Einsatzgebiet → hizmet bölgesi.

Open points:
- [ ] Legal terms: "tüketici hakem kurulu" (Turkish-law analogue, not exact), "sicil mahkemesi", "katma değer vergisi kimlik numarası", "veri işleme sözleşmesi (Auftragsverarbeitung)"
- [ ] "kaydırmalı gönderi" vs "carousel"; the mockup line "Çar · Kaydırmalı gönderi" is long
- [ ] "Betreuung" rendered as "kanal yönetimi" / "yönetim" / "hizmet" by context
- [ ] Placeholder grammar without case suffixes: "{areas} bölgesinde", "tüm {remote} genelinde", "{city} çıkışlı {km} km'ye kadar", "{name} tarafından yazılanlar", "{network} üzerinde paylaş"
- [ ] `hero.mockup.profile` → "isletmeniz"
- [ ] Culture-specific examples kept literally: mezuniyet balosu, Noel menüsü, mali müşavirlik bürosu, semt pazarı
- [ ] Service and category names are translated (package names are not) — keep or revert to the German/English names?
- [ ] A few meta descriptions were tightened to fit 160 characters; the Reels-guide description gained "Üstelik film ekibi olmadan" (taken from the article's own answer)
- [ ] All Turkish page slugs in `src/lib/routes.ts` and category slugs in `src/config/blog.ts`

## Kurdish (`ku`) — glossary and open points

Conventions: Hawar alphabet, respectful "hûn", English URL slugs. Platform names, Reels/Story,
Highlights, Bio, Insights, feed, hashtag, package names and legal citations are left unchanged.

Glossary: medyaya civakî · rêveberiya medyaya civakî · Betreuung → lênêrîn · naverok / çêkirina naverokê ·
Community Management (kept in English) · Redaktionsplan → plana weşanê · Drehtermin → kişandina li cih /
roja kişandinê · Erstgespräch → hevdîtina yekem a bêpere · pakêt · Anfrage → daxwaz · Angebot → pêşniyar ·
Freigabe → pejirandin · Reichweite → gihîştin · Beitrag → şandî · Zielgruppe → koma armanc ·
Unternehmen → karsazî · Kunden → mişterî · Ratgeber → rêber · Datenschutzerklärung → daxuyaniya parastina daneyan.

Terminology that could reasonably go another way:
- [ ] "marketîng" vs "bazarkarî" / "kirrûbirr" (category names, titles)
- [ ] "Community Management" / "community" left in English
- [ ] "înteraksiyon" (Interaktionen); "şandî" (post) with the verb "parve kirin"
- [ ] "gihîştin" used for both reach (metric) and access
- [ ] "pirbûn" for posting frequency — or "frekans" / "çend caran"
- [ ] "hejmarên sereke" for KPIs — or "nîşander" / "KPI"
- [ ] "pêşniyar" covers quote, recommendation and special offer — ambiguity?
- [ ] "karsazî" vs "şirket" / "pargîdanî"; "mişterî" vs "xerîdar"
- [ ] "bêyî mecbûriyet" (unverbindlich); "muxatab" (Ansprechpartner) vs "kesê têkiliyê"
- [ ] "ecibandin" for likes; loans "kuafor", "restoran", "qehwexane", "metbex" vs native words
- [ ] "Dikan û firotin" (Einzelhandel), "Pîşekarî" (Handwerk)
- [ ] Nav label for FAQ, "Pirsên pir tên pirsîn", is long — "FAQ"?

UI and idiom:
- [ ] Imperatives mix singular (single-action buttons) and plural "hûn" (CTAs) — unify?
- [ ] Weekday abbreviations in the home mockup: "Duş · Çarş · Înî"
- [ ] Home trust title "medyaya civakî ya ku ne hewce ye di ber karê din re bê kirin" is awkward — needs a snappier line
- [ ] "karsaziyên ku li cihê xwe bawerî didin" (Unternehmen, die vor Ort überzeugen)
- [ ] "Rêça rûpelê" (breadcrumbs), "bijarte" (optional), "perwerdeya ceribandinê" (Probetraining),
      "rahêner", "dudilî", "lêkolînên rewşê" (case studies), "atolye" (workshop)
- [ ] Salon and food vocabulary: "meş", "zerkirina porê", "utiya porê", "şagirt", "porê xelekî",
      "şahiya mezûniyetê", "xwarineke taybet a restoranê", "qehwexaneya qeşayê"
- [ ] The imprint meta description was extended with a factual phrase not in the German source

Legal (`legal.json`) — needs a legally literate reviewer; German is binding:
- [ ] "baca nirxa zêdekirî" (VAT), "Dadgeha sicîlê" / "Hejmara sicîlê", "saziyeke lihevanîna xerîdaran",
      "mafê telîfê", "berjewendiya rewa", "bikaranîna daneyan" (Verarbeitung — or "pêvajokirin"),
      "bikarhênerê daneyan bi navê me" (processor), "welatên sêyem", the GDPR gloss and the NRW authority name


## Added later: menu design and Google Business Profile (all languages, `needs-review`)

New texts: `services.items.menu-design`, `services.items.google-business-profile`, `services.showcase.*`,
`services.groups`, `services.showcaseLabels`, the fifth FAQ group, `home.services.localCard`,
`packages.standalone`, two form options, and the articles `menu-design-restaurants` and
`google-maps-photos-business`.

Check in every language that none of these caveats was softened: the profile is a free Google product
and only the agency's work is paid; no partnership with Google; the business stays owner; no password;
Google decides which photos are shown; no ranking promise; customer photos cannot be removed by the
agency; nothing is published without approval; prices, allergens and mandatory information come from
and are approved by the client.

- [ ] **English:** "manager" is used for the German "Administrator" (Google's English role name);
      "snack bars" for Imbisse; IHK/DEHOGA glossed in brackets; mock labels fit their boxes
- [ ] **Arabic:** الملف التجاري على Google (with "Google Business Profile" in brackets once per page);
      قائمة الطعام for menu; السفري for takeaway (or الطلبات الخارجية?); role names مالك / مدير /
      المالك الأساسي against Google's Arabic interface; print terms (هامش القص); the home card text is longer
- [ ] **Turkish:** "Google Haritalar" / "Google Arama" are used in running text (official Turkish names);
      "yönetici" / "sahip" for roles; "klipsli altlık", "masa üstü stand", "büfe"; the profile-service meta
      description renders "optimieren lassen" loosely; "Hizmet seçenekleri", "sürekli"
- [ ] **Kurdish (highest review priority):** product name kept as "Google Business Profile", glossed as
      "profîla karsaziyê ya li ser Google" in several places (one extra explanatory sentence in the FAQ group);
      "Sêwirana menûyê", "nûsêwirandin" (redesign, coined), "nûkirina wêneyan", "lênêrîna profîlê",
      "rêvebir (Administrator)" / "xwedî" / "xwediyê sereke" for roles, "bijarte" for optional (literally "selected"),
      billing labels "yek carî" / "berdewam", "Berê" / "Piştî", "Bijardeyên xwestinê";
      print terms ("para birînê", "mesafeya ewlehiyê", "resolusyon"), menu formats ("textika bi kilîps",
      "stenda ser maseyê", "pelên zêde", "belavok"), food and venue terms, photo terms, and the added
      glosses for IHK and DEHOGA in the menu article

### Google Maps photo service — clarified wording (all languages, `needs-review`)

The Google page was rewritten as a done-for-you service ("Google Maps Bilder erneuern &
Unternehmensfotos"). Service names per language: "Refresh Google Maps photos & business photography" (en),
"تجديد صور Google Maps وتصوير الأنشطة التجارية" (ar), "Nûkirina wêneyên Google Maps û wênekêşiya karsaziyê" (ku),
"Google Haritalar Fotoğraf Yenileme ve İşletme Fotoğrafları" (tr).

- [ ] The five process steps and three booking options read naturally and stay short
- [ ] "ranking" vs "photo order" are clearly distinct (Arabic and Turkish use one word for both; a clarifying phrase was added)
- [ ] en: "manager" for Administrator; "Is this a Google service?"; "Regular photo update"
- [ ] ar: "الحانات" for bars (or "البارات"); "بوابة عملاء"; "خدمة وكالة"
- [ ] tr: "paket servis broşürü"; "uygulama odaları"; "sıralama konumu"
- [ ] ku: "nermalav" (software), "cureyên berheman", "xizmetkar" (may read as "servant" — or "pêşkêşkerên xizmetê"),
      "odeyên lênêrînê", "birîn" (crop), "Ev pêşniyareke Google ye?", the ezafe after "rêvebir (Administrator)"
