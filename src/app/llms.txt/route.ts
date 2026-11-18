import { site } from "@/config/site";
import { defaultLocale, localeConfig, locales } from "@/i18n/config";
import { loadMessages } from "@/i18n/messages";
import { getPosts } from "@/lib/blog";
import { blogPaths, href, industryIds, serviceIds } from "@/lib/routes";

export const dynamic = "force-static";

/**
 * Experimental llms.txt: a plain-text guide to the site for language models.
 * Supplementary documentation only — not a ranking factor and not a replacement for
 * crawlable pages, structured data or the sitemap.
 */
export async function GET() {
  const m = await loadMessages(defaultLocale);
  const u = (p: string) => site.url + p;
  const lines = [
    `# ${site.name}`,
    "",
    `> ${m.common.meta.siteDescription}`,
    "",
    `Standort: ${site.serviceArea.baseCity}, ${site.serviceArea.region}. Vor-Ort-Produktion: ${site.serviceArea.onSiteAreas.join(", ")}. Betreuung: ${site.serviceArea.remote}.`,
    `Sprachversionen: ${locales.map((l) => `${localeConfig[l].nativeName} (${u(href("home", l))})`).join(", ")}. Maßgeblich ist die deutsche Fassung.`,
    "Preise: auf Anfrage (keine veröffentlichten Preise). Portfolio-Motive sind Demonstrationsbeispiele, keine Kundenprojekte.",
    "",
    "## Leistungen",
    ...serviceIds.map((id) => `- [${m.services.items[id].name}](${u(href(`service:${id}`, defaultLocale))}): ${m.services.items[id].short}`),
    "",
    "## Branchen",
    ...industryIds.map((id) => `- [${m.industries.items[id].name}](${u(href(`industry:${id}`, defaultLocale))}): ${m.industries.items[id].short}`),
    "",
    "## Agentur",
    `- [${m.common.nav.about}](${u(href("about", defaultLocale))})`,
    `- [${m.common.nav.process}](${u(href("process", defaultLocale))})`,
    `- [${m.common.nav.packages}](${u(href("packages", defaultLocale))})`,
    `- [${m.common.nav.faq}](${u(href("faq", defaultLocale))})`,
    `- [${m.common.nav.contact}](${u(href("contact", defaultLocale))})`,
    "",
    "## Ratgeber",
    ...getPosts(defaultLocale).map((p) => `- [${p.title}](${u(blogPaths.post(defaultLocale, p.slug))}): ${p.excerpt}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
