import type { Metadata } from "next";
import { allowIndexing, site, socialProfiles } from "@/config/site";
import { localeConfig, type Locale } from "@/i18n/config";
import { hreflangMap, href, type Alternates } from "@/lib/routes";

export const abs = (p: string) => site.url + p;

type BuildMetadataInput = {
  locale: Locale;
  title: string;
  description: string;
  /** Root-relative path of this page (self-referencing canonical). */
  path: string;
  /** Existing language versions of this page: locale → path. */
  alternates: Alternates;
  type?: "website" | "article";
  noindex?: boolean;
  article?: { publishedTime: string; modifiedTime: string; authors: string[]; tags: string[]; section: string };
  /** Use the title verbatim without the brand suffix (home page). */
  absoluteTitle?: boolean;
};

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const cfg = localeConfig[input.locale];
  const indexable = allowIndexing && cfg.indexable && !input.noindex;
  // Append the brand unless that would push the title past what search results display.
  const branded = `${input.title} | ${site.name}`;
  const fullTitle = input.absoluteTitle || branded.length > 65 ? input.title : branded;
  const image = { url: abs(`/og/${input.locale}.png`), width: 1200, height: 630, alt: `${site.name} – ${site.tagline}` };
  const otherLocales = Object.keys(input.alternates)
    .filter((l) => l !== input.locale && localeConfig[l as Locale].indexable)
    .map((l) => localeConfig[l as Locale].ogLocale);

  return {
    title: { absolute: fullTitle },
    description: input.description,
    alternates: {
      canonical: abs(input.path),
      languages: indexable ? hreflangMap(input.alternates, site.url) : undefined,
    },
    robots: indexable
      ? { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 }
      : { index: false, follow: true },
    openGraph: {
      type: input.type ?? "website",
      title: fullTitle,
      description: input.description,
      url: abs(input.path),
      siteName: site.name,
      locale: cfg.ogLocale,
      alternateLocale: otherLocales,
      images: [image],
      ...(input.article ?? {}),
    },
    twitter: { card: "summary_large_image", title: fullTitle, description: input.description, images: [image.url] },
  };
}

/* ---------- JSON-LD builders (only verified facts from src/config/site.ts) ---------- */

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export function organizationJsonLd(locale: Locale, description: string) {
  const hasAddress = !!site.address;
  return {
    "@context": "https://schema.org",
    // LocalBusiness is only emitted once a verified postal address exists.
    "@type": hasAddress ? ["Organization", "ProfessionalService"] : "Organization",
    "@id": ORG_ID,
    name: site.name,
    ...(site.legalName ? { legalName: site.legalName } : {}),
    url: site.url,
    logo: { "@type": "ImageObject", url: abs("/brand/logo-mark.png"), width: 512, height: 512 },
    image: abs(`/og/${locale}.png`),
    description,
    slogan: site.tagline,
    ...(site.contact.email ? { email: site.contact.email } : {}),
    ...(site.contact.phone ? { telephone: site.contact.phone } : {}),
    ...(site.address
      ? {
          address: {
            "@type": "PostalAddress",
            streetAddress: site.address.street,
            postalCode: site.address.postalCode,
            addressLocality: site.address.city,
            addressRegion: site.address.region,
            addressCountry: site.address.country,
          },
        }
      : {}),
    areaServed: [
      ...site.serviceArea.onSiteAreas.map((name) => ({ "@type": "Place", name })),
      { "@type": "Country", name: "Germany" },
    ],
    knowsAbout: ["Social Media Management", "Content Creation", "Reels", "Video Production", "Social Media Strategy", "Community Management"],
    ...(socialProfiles.length ? { sameAs: socialProfiles } : {}),
  };
}

export function websiteJsonLd(locale: Locale, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: site.url,
    name: site.name,
    description,
    inLanguage: localeConfig[locale].htmlLang,
    publisher: { "@id": ORG_ID },
  };
}

export type Crumb = { name: string; path: string };

export function breadcrumbJsonLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export function serviceJsonLd(input: { locale: Locale; name: string; description: string; path: string; serviceType: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    serviceType: input.serviceType,
    description: input.description,
    url: abs(input.path),
    inLanguage: localeConfig[input.locale].htmlLang,
    provider: { "@id": ORG_ID },
    areaServed: [
      ...site.serviceArea.onSiteAreas.map((name) => ({ "@type": "Place", name })),
      { "@type": "Country", name: "Germany" },
    ],
  };
}

export function faqJsonLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((i) => ({ "@type": "Question", name: i.q, acceptedAnswer: { "@type": "Answer", text: i.a } })),
  };
}

export function articleJsonLd(input: {
  locale: Locale;
  title: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified: string;
  author: { name: string; type: "organization" | "person"; path: string; sameAs: readonly string[] };
  section: string;
  keywords: string[];
  wordCountMinutes: number;
}) {
  const author =
    input.author.type === "person"
      ? { "@type": "Person", name: input.author.name, url: abs(input.author.path), ...(input.author.sameAs.length ? { sameAs: input.author.sameAs } : {}) }
      : { "@id": ORG_ID };
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: input.description,
    url: abs(input.path),
    mainEntityOfPage: { "@type": "WebPage", "@id": abs(input.path) },
    inLanguage: localeConfig[input.locale].htmlLang,
    datePublished: `${input.datePublished}T08:00:00+01:00`,
    dateModified: `${input.dateModified}T08:00:00+01:00`,
    image: abs(`/og/${input.locale}.png`),
    articleSection: input.section,
    keywords: input.keywords.join(", "),
    timeRequired: `PT${input.wordCountMinutes}M`,
    author,
    publisher: { "@id": ORG_ID },
    isPartOf: { "@id": WEBSITE_ID },
  };
}

export const homePath = (locale: Locale) => href("home", locale);
