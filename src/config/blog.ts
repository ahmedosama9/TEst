import type { Locale } from "@/i18n/config";

export const categoryIds = [
  "social-media-marketing",
  "instagram-marketing",
  "facebook-marketing",
  "tiktok-marketing",
  "reels-video-marketing",
  "content-creation",
  "restaurant-marketing",
  "salon-marketing",
  "local-business-marketing",
  "social-media-strategy",
  "ai-tools-marketing",
  "tips-guides",
] as const;
export type CategoryId = (typeof categoryIds)[number];

/** Localized category slugs. Locales not listed use the English id. */
const localized: Partial<Record<Locale, Record<CategoryId, string>>> = {
  de: {
    "social-media-marketing": "social-media-marketing",
    "instagram-marketing": "instagram-marketing",
    "facebook-marketing": "facebook-marketing",
    "tiktok-marketing": "tiktok-marketing",
    "reels-video-marketing": "reels-video-marketing",
    "content-creation": "content-erstellung",
    "restaurant-marketing": "marketing-fuer-restaurants",
    "salon-marketing": "marketing-fuer-salons",
    "local-business-marketing": "lokales-marketing",
    "social-media-strategy": "social-media-strategie",
    "ai-tools-marketing": "ki-tools-marketing",
    "tips-guides": "tipps-und-anleitungen",
  },
  tr: {
    "social-media-marketing": "sosyal-medya-pazarlamasi",
    "instagram-marketing": "instagram-pazarlamasi",
    "facebook-marketing": "facebook-pazarlamasi",
    "tiktok-marketing": "tiktok-pazarlamasi",
    "reels-video-marketing": "reels-video-pazarlamasi",
    "content-creation": "icerik-uretimi",
    "restaurant-marketing": "restoran-pazarlamasi",
    "salon-marketing": "salon-pazarlamasi",
    "local-business-marketing": "yerel-isletme-pazarlamasi",
    "social-media-strategy": "sosyal-medya-stratejisi",
    "ai-tools-marketing": "yapay-zeka-araclari",
    "tips-guides": "ipuclari-ve-rehberler",
  },
};

export function categorySlug(id: CategoryId, locale: Locale): string {
  return localized[locale]?.[id] ?? id;
}

export function categoryFromSlug(slug: string, locale: Locale): CategoryId | null {
  return categoryIds.find((id) => categorySlug(id, locale) === slug) ?? null;
}

/**
 * Authors. Texts (name, role, bio) live in messages/<locale>/pages.json → blog.authors.<id>.
 * Add real people here once the owner supplies them: type "person" emits Person structured data.
 */
export const authors = {
  redaktion: { type: "organization" as "organization" | "person", sameAs: [] as string[] },
} as const;
export type AuthorId = keyof typeof authors;
export const authorIds = Object.keys(authors) as AuthorId[];
