# Agency platform (CRM / dashboard) — requirements

Status: **planning only.** Nothing in this document is built or active. The website has no
database, no client login and no connection to any client account. This file records the
requirements so the future platform fits the services the website already sells.

## Service catalog (shared with the website)

`src/config/service-catalog.ts` is the single list of services. The platform should import it
rather than keep its own copy.

| Service id | Group | Stand-alone | Combinable with monthly management | On-site visit | Client authorization needed |
|---|---|---|---|---|---|
| `social-media-management` | Social Media & Content | yes | – | optional | yes (channel access) |
| `content-creation` | Social Media & Content | yes | yes | optional | no |
| `reels-video-production` | Social Media & Content | yes | yes | always | no |
| `social-media-strategy` | Social Media & Content | yes | yes | never | no |
| `community-management` | Social Media & Content | yes | yes | never | yes (channel access) |
| `menu-design` | Lokales Marketing & Design | yes | yes | optional | no |
| `google-business-profile` | Lokales Marketing & Design | yes | yes | always | yes (profile manager access) |

Booking options (ids are stable; prices are `null` = "Preis auf Anfrage" until approved):

- Menu design: `menu-new-design` (once), `menu-redesign` (once), `menu-seasonal-updates` (recurring), `menu-print-preparation` (optional)
- Google Business Profile: `gbp-photo-refresh` (once), `gbp-on-site-photography` (once), `gbp-photo-profile-maintenance` (recurring)

## What must be tracked per engagement

| Field | Notes |
|---|---|
| Client | Company, contact person, preferred language, billing details |
| Service selected | Catalog id + option id(s); package if part of monthly management |
| Business location | Address; **driving distance from Münster** (on-site work is offered within ~150 km, by arrangement) |
| On-site visit requirements | Needed yes/no, date, duration, access, consent of people photographed, travel cost |
| Source assets | Uploaded files: existing menu (PDF/photo/Word), logo, texts, price list, allergen list, existing photos |
| Content/design status | `briefing → assets-requested → in-design → internal-review → client-review → revision → approved → delivered` |
| Client approval | `not-requested / requested / changes-requested / approved`, who approved, when, which version |
| Delivery/publication status | `not-started / scheduled / delivered / published / archived`, with links to final files |
| Revision history | Every version with author, timestamp, change note and the client's comments |
| Recurring service schedule | Interval, next due date, last completed (seasonal menu updates, photo maintenance, reporting) |
| Time and costs | Time entries per client and service, travel, print or licence costs, for margin per client |

Status vocabularies are already defined in `workflowStatuses` in the catalog file.

## Workflow: menu design

1. **Intake** — client uploads the existing menu and assets; states formats needed (print sizes, PDF, QR, takeaway, inserts) and languages.
2. **Content sheet** — dishes, descriptions, prices, allergens and additives are captured as *client-supplied facts*. The agency may flag inconsistencies but never edits these values on its own authority.
3. **Design** — designer works on a versioned draft; each export is a new revision.
4. **Review** — client comments on the draft (per page/section). Changes to facts are entered by the client or confirmed by the client in writing.
5. **Approval** — explicit approval of a specific revision, recorded with name and time. Print files are locked to that revision. A changed price list after approval creates a new revision and needs a new approval.
6. **Export** — print-ready PDF (per print shop spec), screen PDF, QR code + target, source files if agreed.
7. **Follow-up** — seasonal updates are scheduled as recurring tasks.

Rules: prices, allergens and mandatory information stay under client control; nothing goes to print or online without recorded approval; the platform should show "last approved by client on …" on every exported file.

## Workflow: Google Business Profile — photo refresh & maintenance

1. **Authorization** — the client adds the agency as a **manager** of the profile. The client stays owner. The platform stores *which* Google account was granted access and when — **never a client password**. Access is removed when the engagement ends.
2. **Profile review** — checklist of photos, logo/cover, description, categories, hours, contact details; findings recorded as proposals.
3. **Shoot** — on-site appointment (distance check, consent of people shown).
4. **Selection and editing** — edited photos uploaded to the platform as a review set.
5. **Client approval** — per photo and per proposed text/attribute change.
6. **Publication** — approved items are uploaded **manually** by a team member through the authorized Google Business Profile access. The platform records what was uploaded, by whom and when.
7. **Maintenance** — optional recurring task (new photos, attribute check, simple figures where Google provides them).

Hard rules for this service:

- Version 1 is **manual**. No automated publishing to client profiles.
- No API integration is active. If one is added later it must be approved by the owner first and comply with Google's Business Profile API access requirements, terms and third-party policies (application for API access, OAuth consent by the profile owner, limited scopes, no credential storage, clear disclosure that the agency is a third party, client can revoke at any time).
- Never promise or log as "done" things only Google controls: which photo is shown first, removal of customer-uploaded photos, ranking.
- The agency is not a Google partner; no Google logos or partner claims in the platform or on exports.

## Data protection notes for the platform

- Client assets and photos of people are personal data: access control per client, deletion at end of contract, consent records for people photographed.
- Hosting in the EU, data-processing agreement with the provider, audit log of approvals and publications.
- Before launch of any platform: update the privacy policy and conclude processing agreements with clients where the agency processes their customers' data.
