# Internal job tracking — requirements

Status: **planning only. Nothing in this document is built, and nothing is scheduled to be built.**

Both additional services are **done-for-you agency services**:

- **Google Maps Bilder erneuern & Unternehmensfotos** — the agency visits the business, photographs,
  edits and uploads the approved photos by hand.
- **Speisekarten-Design & Redesign** — the agency designs the menu and delivers the finished files.

The customer does not use this website or any software from the agency to get the work done.

## Explicitly out of scope

- No Google Maps / Google Business Profile **API integration**
- No **automated publishing** to client profiles
- No **customer-facing dashboard** or photo-upload portal for the Google Maps service
- No CRM is part of the website

If the agency later wants a tool, it is an **internal** aid for the team to keep track of jobs.
The notes below describe what such an internal list would need; a spreadsheet covers it at the start.

## Service catalog

`src/config/service-catalog.ts` lists the services, groups and booking options with stable ids
(prices `null` = "Preis auf Anfrage").

- Menu design: `menu-new-design`, `menu-redesign`, `menu-seasonal-updates`, `menu-print-preparation`
- Google Maps photos: `gbp-photo-refresh` (Einmaliger Foto-Refresh), `gbp-on-site-photography`
  (Professionelle Unternehmensfotografie vor Ort), `gbp-photo-profile-maintenance` (Regelmäßige Foto-Aktualisierung),
  `gbp-search-terms-profile-texts` (Suchbegriffe & Profiltexte, optional)

## What the team should record per job

| Field | Notes |
|---|---|
| Client | Company, contact person, preferred language |
| Service selected | Catalog id and option |
| Business location | Address and driving distance from Münster (on-site work within ~150 km, by arrangement) |
| On-site visit | Date, duration, what to photograph, consent of people shown, travel |
| Source assets | What the client supplied (existing menu, logo, texts, price and allergen list) |
| Work status | briefing → in progress → client review → revision → approved → delivered |
| Client approval | Who approved which version/photos, and when |
| Delivery | Files handed over, or photos uploaded to the profile (by whom, when) |
| Revisions | Change requests and versions |
| Recurring schedule | Next photo refresh or seasonal menu update |
| Time and costs | Hours, travel, external costs per client |

## How the Google Maps photo service is delivered (manual)

1. **Termin vereinbaren** — agree what to show and when.
2. **Fotos vor Ort aufnehmen.**
3. **Bilder professionell bearbeiten.**
4. **Freigabe durch den Kunden** — only approved photos are used.
5. **Google Maps Bilder aktualisieren** — a team member uploads the photos by hand through the
   manager access the client has granted.

Rules:

- The client adds the agency as a manager of the Google Business Profile when access is needed and
  remains the owner. The agency never asks for or stores a Google password. Access is removed when
  the job or engagement ends.
- Nothing is uploaded without the client's approval.
- Search terms: researched per client and placed only in the description, categories and services/products —
  never added to the business name (Google's guidelines require the real-world name). Texts need client approval.
- The agency does not promise deletion of all old photos, control over Google's photo order, or rankings.
- It is an agency photography and profile-update service, not a Google product; no partner claims.

## How menu design is delivered

1. Client sends the existing menu and the content (dishes, prices, allergens, additives).
2. Agency designs; client reviews; changes are made.
3. Client approves — prices, allergen and mandatory information stay under the client's control.
4. Agency delivers print-ready files, PDF and, if ordered, QR code and inserts.
