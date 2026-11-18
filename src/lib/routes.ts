import { defaultLocale, indexableLocales, localeConfig, locales, type Locale } from "@/i18n/config";

/**
 * Route registry: stable internal page ids → localized URL paths.
 *
 * Slug policy: German and Turkish use native slugs; English, Arabic and Kurdish share
 * English slugs (ASCII, stable, no percent-encoding; Kurdish/Arabic slugs can be introduced
 * later with redirects once native speakers have signed off the terminology).
 */
export const serviceIds = [
  "social-media-management",
  "content-creation",
  "reels-video-production",
  "social-media-strategy",
  "community-management",
  "menu-design",
  "google-business-profile",
] as const;
export type ServiceId = (typeof serviceIds)[number];

export const industryIds = ["gastronomy", "beauty-salons", "fitness-studios", "local-businesses"] as const;
export type IndustryId = (typeof industryIds)[number];

export type StaticPageId =
  | "home"
  | "services"
  | `service:${ServiceId}`
  | "industries"
  | `industry:${IndustryId}`
  | "portfolio"
  | "about"
  | "process"
  | "packages"
  | "faq"
  | "contact"
  | "blog"
  | "imprint"
  | "privacy"
  | "cookies";

type Slugs = Record<Locale, string>;
const same = (en: string, de: string, tr: string): Slugs => ({ de, en, ar: en, ku: en, tr });

const top = {
  services: same("services", "leistungen", "hizmetler"),
  industries: same("industries", "branchen", "sektorler"),
  portfolio: same("portfolio", "portfolio", "portfolyo"),
  about: same("about", "ueber-uns", "hakkimizda"),
  process: same("process", "ablauf", "surec"),
  packages: same("packages", "pakete", "paketler"),
  faq: same("faq", "faq", "sss"),
  contact: same("contact", "kontakt", "iletisim"),
  blog: same("blog", "ratgeber", "blog"),
  imprint: same("legal-notice", "impressum", "kunye"),
  privacy: same("privacy-policy", "datenschutz", "gizlilik-politikasi"),
  cookies: same("cookie-settings", "cookie-einstellungen", "cerez-ayarlari"),
} as const;

const serviceSlugs: Record<ServiceId, Slugs> = {
  "social-media-management": same("social-media-management", "social-media-management", "sosyal-medya-yonetimi"),
  "content-creation": same("content-creation", "content-erstellung", "icerik-uretimi"),
  "reels-video-production": same("reels-video-production", "reels-videoproduktion", "reels-video-produksiyonu"),
  "social-media-strategy": same("social-media-strategy", "social-media-strategie", "sosyal-medya-stratejisi"),
  "community-management": same("community-management", "community-management", "topluluk-yonetimi"),
  "menu-design": same("menu-design", "speisekarten-design", "menu-tasarimi"),
  "google-business-profile": same("google-business-profile", "google-unternehmensprofil", "google-isletme-profili"),
};

const industrySlugs: Record<IndustryId, Slugs> = {
  gastronomy: same("gastronomy", "gastronomie", "gastronomi"),
  "beauty-salons": same("beauty-salons", "beauty-salons", "guzellik-salonlari"),
  "fitness-studios": same("fitness-studios", "fitnessstudios", "fitness-salonlari"),
  "local-businesses": same("local-businesses", "lokale-unternehmen", "yerel-isletmeler"),
};

/** Sub-path keywords inside the blog section. */
export const blogSegments = {
  category: same("category", "kategorie", "kategori"),
  page: same("page", "seite", "sayfa"),
  author: same("author", "autor", "yazar"),
} as const;

export const staticPageIds: StaticPageId[] = [
  "home",
  "services",
  ...serviceIds.map((id) => `service:${id}` as const),
  "industries",
  ...industryIds.map((id) => `industry:${id}` as const),
  "portfolio",
  "about",
  "process",
  "packages",
  "faq",
  "contact",
  "blog",
  "imprint",
  "privacy",
  "cookies",
];

/** Path segments (without locale) of a static page. */
export function pageSegments(id: StaticPageId, locale: Locale): string[] {
  if (id === "home") return [];
  if (id.startsWith("service:")) return [top.services[locale], serviceSlugs[id.slice(8) as ServiceId][locale]];
  if (id.startsWith("industry:")) return [top.industries[locale], industrySlugs[id.slice(9) as IndustryId][locale]];
  return [top[id as keyof typeof top][locale]];
}

export function buildPath(locale: Locale, segments: string[]): string {
  return "/" + [locale, ...segments].join("/");
}

/** Localized, root-relative href of a static page, e.g. href("contact", "de") → "/de/kontakt". */
export function href(id: StaticPageId, locale: Locale): string {
  return buildPath(locale, pageSegments(id, locale));
}

export const blogPaths = {
  post: (locale: Locale, slug: string) => buildPath(locale, [top.blog[locale], slug]),
  category: (locale: Locale, categorySlug: string) =>
    buildPath(locale, [top.blog[locale], blogSegments.category[locale], categorySlug]),
  page: (locale: Locale, n: number) =>
    n <= 1 ? href("blog", locale) : buildPath(locale, [top.blog[locale], blogSegments.page[locale], String(n)]),
  author: (locale: Locale, authorId: string) =>
    buildPath(locale, [top.blog[locale], blogSegments.author[locale], authorId]),
};

/** Reverse lookup for static pages: segments → page id. */
export function matchStaticPage(locale: Locale, segments: string[]): StaticPageId | null {
  const key = segments.join("/");
  for (const id of staticPageIds) {
    if (pageSegments(id, locale).join("/") === key) return id;
  }
  return null;
}

export function isBlogSection(locale: Locale, segments: string[]): boolean {
  return segments[0] === top.blog[locale];
}

/** Map of locale → path for a page that exists in every language. */
export function staticAlternates(id: StaticPageId): Record<Locale, string> {
  return Object.fromEntries(locales.map((l) => [l, href(id, l)])) as Record<Locale, string>;
}

export type Alternates = Partial<Record<Locale, string>>;

/** hreflang map (incl. x-default → German, or first available) for Next's metadata API. */
export function hreflangMap(alternates: Alternates, origin: string): Record<string, string> {
  const out: Record<string, string> = {};
  for (const l of indexableLocales) {
    const p = alternates[l];
    if (p) out[localeConfig[l].hreflang] = origin + p;
  }
  const xDefault = alternates[defaultLocale] ?? Object.values(alternates)[0];
  if (xDefault && Object.keys(out).length > 0) out["x-default"] = origin + xDefault;
  return out;
}
