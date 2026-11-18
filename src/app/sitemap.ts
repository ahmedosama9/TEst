import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { indexableLocales } from "@/i18n/config";
import { loadMessages } from "@/i18n/messages";
import { allPages, alternatesOf, metaOf, pathOf } from "@/lib/pages";
import { hreflangMap } from "@/lib/routes";

/** Every indexable URL in every language, each with its reciprocal hreflang alternates. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of indexableLocales) {
    const messages = await loadMessages(locale);
    for (const page of allPages(locale)) {
      if (metaOf(page, messages).noindex) continue;
      const isHome = page.kind === "static" && page.id === "home";
      entries.push({
        url: site.url + pathOf(locale, page),
        lastModified: page.kind === "post" ? new Date(`${page.post.updated}T08:00:00+01:00`) : undefined,
        changeFrequency: page.kind === "post" ? "monthly" : "weekly",
        priority: isHome ? 1 : page.kind === "static" ? 0.8 : 0.6,
        alternates: { languages: hreflangMap(alternatesOf(page), site.url) },
      });
    }
  }
  return entries;
}
