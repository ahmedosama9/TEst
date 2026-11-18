import { describe, expect, it } from "vitest";
import { resolveContentLink } from "@/components/blog/mdx";
import { locales } from "@/i18n/config";
import { getPosts, getPostTranslations } from "@/lib/blog";

describe("blog content", () => {
  const de = getPosts("de");

  it("has ten published German starter articles", () => {
    expect(de.length).toBeGreaterThanOrEqual(10);
    for (const p of de) expect(p.translationStatus).toBe("source");
  });

  it("flags every translation for native-speaker review until signed off", () => {
    for (const locale of locales.filter((l) => l !== "de")) {
      for (const p of getPosts(locale)) expect(["needs-review", "reviewed"]).toContain(p.translationStatus);
    }
  });

  it("keeps language-neutral fields identical across translations", () => {
    for (const src of de) {
      for (const locale of Object.keys(getPostTranslations(src.id)) as (typeof locales)[number][]) {
        const t = getPosts(locale).find((p) => p.id === src.id)!;
        expect(t.category).toBe(src.category);
        expect(t.relatedService).toBe(src.relatedService);
        expect(t.toc.length, `${src.id}/${locale} heading count`).toBe(src.toc.length);
        expect(t.faq.length).toBe(src.faq.length);
      }
    }
  });

  it("only uses resolvable internal links and has no raw site URLs", () => {
    for (const locale of locales) {
      for (const p of getPosts(locale)) {
        for (const m of p.body.matchAll(/\]\(([^)]+)\)/g)) {
          expect(m[1], `${p.id}/${locale}`).toMatch(/^(page:|post:|https:\/\/)/);
          expect(() => resolveContentLink(m[1], locale)).not.toThrow();
        }
        expect(p.toc.length).toBeGreaterThanOrEqual(3);
      }
    }
  });
});
