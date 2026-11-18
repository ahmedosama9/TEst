import { describe, expect, it } from "vitest";
import { locales } from "@/i18n/config";
import { allPages, alternatesOf, pathOf, resolve, segmentsOf } from "@/lib/pages";
import { hreflangMap, href, staticPageIds } from "@/lib/routes";

describe("route registry", () => {
  it("gives every static page a unique path per language", () => {
    for (const locale of locales) {
      const paths = staticPageIds.map((id) => href(id, locale));
      expect(new Set(paths).size).toBe(paths.length);
      for (const p of paths) expect(p).toMatch(new RegExp(`^/${locale}(/[a-z0-9-]+)*$`));
    }
  });

  it("uses localized slugs", () => {
    expect(href("contact", "de")).toBe("/de/kontakt");
    expect(href("contact", "en")).toBe("/en/contact");
    expect(href("contact", "tr")).toBe("/tr/iletisim");
    expect(href("service:reels-video-production", "de")).toBe("/de/leistungen/reels-videoproduktion");
    expect(href("home", "ar")).toBe("/ar");
    expect(href("service:menu-design", "de")).toBe("/de/leistungen/speisekarten-design");
    expect(href("service:google-business-profile", "de")).toBe("/de/leistungen/google-unternehmensprofil");
    expect(href("service:google-business-profile", "tr")).toBe("/tr/hizmetler/google-isletme-profili");
    expect(href("service:menu-design", "ar")).toBe("/ar/services/menu-design");
  });

  it("round-trips every page: path → resolve → same path", () => {
    for (const locale of locales) {
      for (const page of allPages(locale)) {
        const resolved = resolve(locale, segmentsOf(locale, page));
        expect(resolved, pathOf(locale, page)).not.toBeNull();
        expect(pathOf(locale, resolved!)).toBe(pathOf(locale, page));
      }
    }
  });

  it("returns null for unknown paths, foreign-language slugs and out-of-range pages", () => {
    expect(resolve("de", ["gibt-es-nicht"])).toBeNull();
    expect(resolve("de", ["contact"])).toBeNull(); // English slug under /de
    expect(resolve("de", ["ratgeber", "seite", "1"])).toBeNull(); // page 1 is the blog root
    expect(resolve("de", ["ratgeber", "seite", "999"])).toBeNull();
    expect(resolve("de", ["ratgeber", "kategorie", "facebook-marketing"])).toBeNull(); // empty category
  });

  it("builds reciprocal alternates including x-default → German", () => {
    for (const locale of locales) {
      for (const page of allPages(locale)) {
        const alt = alternatesOf(page);
        expect(alt[locale]).toBe(pathOf(locale, page));
        const map = hreflangMap(alt, "https://example.test");
        expect(map["x-default"]).toBe("https://example.test" + (alt.de ?? Object.values(alt)[0]));
      }
    }
  });
});
