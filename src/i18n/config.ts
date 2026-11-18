/**
 * Central locale registry. To add a language later (e.g. Sorani Kurdish "ckb", RTL):
 * 1. add it to `locales` and `localeConfig` here (dir: "rtl"),
 * 2. add `messages/ckb/*.json`, route slugs in `src/lib/routes.ts`,
 * 3. add the locale to NON_DEFAULT_LOCALES in `next.config.ts`.
 * Nothing else in the app is locale-specific.
 */
export const locales = ["de", "en", "ar", "ku", "tr"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "de";
export const LOCALE_COOKIE = "smk_locale";

export type LocaleConfig = {
  /** Native name shown in the language switcher. */
  nativeName: string;
  /** Value of <html lang>. */
  htmlLang: string;
  /** hreflang value. Language-only on purpose: every version targets speakers living in Germany/EU. */
  hreflang: string;
  /** Open Graph locale. */
  ogLocale: string;
  /** Locale passed to Intl formatters. */
  intlLocale: string;
  dir: "ltr" | "rtl";
  /** Font stack key, see src/app/[locale]/layout.tsx. */
  script: "latin" | "arabic";
  /**
   * Editorial status of the UI/page translations for this language.
   * "source" = written in this language, "needs-review" = machine-assisted draft
   * awaiting a native-speaker review, "reviewed" = signed off.
   */
  reviewStatus: "source" | "needs-review" | "reviewed";
  /** Set to false to keep a language reachable but out of the index (noindex + not in sitemap/hreflang). */
  indexable: boolean;
};

export const localeConfig: Record<Locale, LocaleConfig> = {
  de: { nativeName: "Deutsch", htmlLang: "de-DE", hreflang: "de", ogLocale: "de_DE", intlLocale: "de-DE", dir: "ltr", script: "latin", reviewStatus: "source", indexable: true },
  en: { nativeName: "English", htmlLang: "en", hreflang: "en", ogLocale: "en_GB", intlLocale: "en-GB", dir: "ltr", script: "latin", reviewStatus: "needs-review", indexable: true },
  ar: { nativeName: "العربية", htmlLang: "ar", hreflang: "ar", ogLocale: "ar_AR", intlLocale: "ar", dir: "rtl", script: "arabic", reviewStatus: "needs-review", indexable: true },
  ku: { nativeName: "Kurdî", htmlLang: "ku", hreflang: "ku", ogLocale: "ku_TR", intlLocale: "ku", dir: "ltr", script: "latin", reviewStatus: "needs-review", indexable: true },
  tr: { nativeName: "Türkçe", htmlLang: "tr-TR", hreflang: "tr", ogLocale: "tr_TR", intlLocale: "tr-TR", dir: "ltr", script: "latin", reviewStatus: "needs-review", indexable: true },
};

export function isLocale(value: string | undefined): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export const indexableLocales = locales.filter((l) => localeConfig[l].indexable);
