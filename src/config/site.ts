/**
 * Central business configuration — the single place to update verified facts.
 *
 * IMPORTANT: every `null` below is a fact the owner has not supplied yet.
 * The site hides or marks the related output instead of inventing data
 * (no address → no LocalBusiness schema, no phone → no phone link, …).
 * See docs/LEGAL_CHECKLIST.md and docs/LAUNCH_CHECKLIST.md.
 */
export const site = {
  name: "Social Media Komplett",
  legalName: null as string | null, // e.g. "Max Mustermann – Social Media Komplett" or "… GmbH"
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://socialmediakomplett.de").replace(/\/$/, ""),
  tagline: "Content. Betreuung. Ergebnisse.",
  supportingTagline: "Ihre Social Media. Komplett betreut.",

  contact: {
    /** Public contact address shown on the site. Leave null until the mailbox is confirmed. */
    email: (process.env.NEXT_PUBLIC_CONTACT_EMAIL || null) as string | null,
    phone: (process.env.NEXT_PUBLIC_CONTACT_PHONE || null) as string | null, // E.164, e.g. "+49251…"
    whatsapp: null as string | null,
  },

  /** Postal address. Required for the Impressum and for LocalBusiness structured data. */
  address: null as null | {
    street: string;
    postalCode: string;
    city: string;
    region: string;
    country: "DE";
  },

  /** Persons legally/editorially responsible. Supplied by the owner — never invented. */
  owner: null as null | { name: string; role: string },

  legal: {
    vatId: null as string | null, // USt-IdNr. (§ 27a UStG), if any
    registerCourt: null as string | null,
    registerNumber: null as string | null,
    /** Flip to true only after a lawyer/owner has completed and approved Impressum + Datenschutz. */
    documentsApproved: false,
  },

  /**
   * Service area. Münster is the base; North Rhine-Westphalia (NRW) is the market.
   * Remote services (strategy, management, community) are offered throughout NRW.
   * On-site shoots are offered within `onSiteRadiusKm` driving distance of the base city,
   * always subject to individual arrangement — the site never promises visits everywhere in NRW.
   * Texts that mention the area are in messages/<locale> and use {city} and {km}.
   */
  serviceArea: {
    baseCity: "Münster",
    state: "Nordrhein-Westfalen",
    stateShort: "NRW",
    country: "DE",
    onSiteRadiusKm: 150,
  },

  /** Official profiles (sameAs in structured data). Add only real, owned profiles. */
  social: {
    instagram: null as string | null,
    facebook: null as string | null,
    tiktok: null as string | null,
    linkedin: null as string | null,
    youtube: null as string | null,
  },

  /**
   * Languages in which the agency can actually serve clients (consulting, content).
   * The website is available in five languages, but service languages are only
   * advertised once confirmed here.
   */
  confirmedServiceLanguages: ["de"] as string[],

  blog: {
    postsPerPage: 6,
  },
} as const satisfies Record<string, unknown>;

/**
 * Only the production deployment may be indexed. Vercel sets VERCEL_ENV automatically;
 * on other hosts set NEXT_PUBLIC_ALLOW_INDEXING=true. "false" is a kill switch.
 */
export const allowIndexing =
  process.env.NEXT_PUBLIC_ALLOW_INDEXING !== "false" &&
  (process.env.VERCEL_ENV === "production" || process.env.NEXT_PUBLIC_ALLOW_INDEXING === "true");

export const socialProfiles = Object.values(site.social).filter((v): v is string => !!v);
