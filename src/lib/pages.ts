import { authorIds, categoryFromSlug, categorySlug, type AuthorId, type CategoryId } from "@/config/blog";
import { site } from "@/config/site";
import { locales, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import {
  getActiveCategories,
  getPostBySlug,
  getPosts,
  getPostsByAuthor,
  getPostTranslations,
  pageCount,
  type Post,
} from "@/lib/blog";
import {
  blogPaths,
  blogSegments,
  href,
  isBlogSection,
  matchStaticPage,
  pageSegments,
  staticAlternates,
  staticPageIds,
  type Alternates,
  type IndustryId,
  type ServiceId,
  type StaticPageId,
} from "@/lib/routes";
import { fmt } from "@/lib/utils";

export type Resolved =
  | { kind: "static"; id: StaticPageId }
  | { kind: "blogPage"; page: number }
  | { kind: "category"; category: CategoryId }
  | { kind: "author"; author: AuthorId }
  | { kind: "post"; post: Post };

const perPage = site.blog.postsPerPage;

/** URL segments (after the locale) → page. Returns null for anything that must 404. */
export function resolve(locale: Locale, segments: string[]): Resolved | null {
  const staticId = matchStaticPage(locale, segments);
  if (staticId) return { kind: "static", id: staticId };
  if (!isBlogSection(locale, segments)) return null;

  const [, a, b, ...rest] = segments;
  if (rest.length) return null;
  if (a === blogSegments.page[locale] && b) {
    const n = Number(b);
    const total = pageCount(getPosts(locale).length, perPage);
    // Page 1 lives at the blog root; out-of-range pages do not exist.
    return /^\d+$/.test(b) && n >= 2 && n <= total ? { kind: "blogPage", page: n } : null;
  }
  if (a === blogSegments.category[locale] && b) {
    const category = categoryFromSlug(b, locale);
    return category && getActiveCategories(locale).includes(category) ? { kind: "category", category } : null;
  }
  if (a === blogSegments.author[locale] && b) {
    const author = authorIds.find((id) => id === b);
    return author && getPostsByAuthor(locale, author).length ? { kind: "author", author } : null;
  }
  if (a && !b) {
    const post = getPostBySlug(locale, a);
    return post ? { kind: "post", post } : null;
  }
  return null;
}

/** Root-relative path of a resolved page. */
export function pathOf(locale: Locale, r: Resolved): string {
  switch (r.kind) {
    case "static":
      return href(r.id, locale);
    case "blogPage":
      return blogPaths.page(locale, r.page);
    case "category":
      return blogPaths.category(locale, categorySlug(r.category, locale));
    case "author":
      return blogPaths.author(locale, r.author);
    case "post":
      return blogPaths.post(locale, r.post.slug);
  }
}

/** Language versions that really exist for this page (drives hreflang, sitemap and the language switcher). */
export function alternatesOf(r: Resolved): Alternates {
  switch (r.kind) {
    case "static":
      return staticAlternates(r.id);
    case "blogPage": {
      const out: Alternates = {};
      for (const l of locales) if (r.page <= pageCount(getPosts(l).length, perPage)) out[l] = blogPaths.page(l, r.page);
      return out;
    }
    case "category": {
      const out: Alternates = {};
      for (const l of locales) if (getActiveCategories(l).includes(r.category)) out[l] = blogPaths.category(l, categorySlug(r.category, l));
      return out;
    }
    case "author": {
      const out: Alternates = {};
      for (const l of locales) if (getPostsByAuthor(l, r.author).length) out[l] = blogPaths.author(l, r.author);
      return out;
    }
    case "post": {
      const out: Alternates = {};
      for (const [l, slug] of Object.entries(getPostTranslations(r.post.id))) out[l as Locale] = blogPaths.post(l as Locale, slug);
      return out;
    }
  }
}

/** Every page of the site, per locale — used by generateStaticParams, the sitemap and tests. */
export function allPages(locale: Locale): Resolved[] {
  const pages: Resolved[] = staticPageIds.map((id) => ({ kind: "static", id }));
  const posts = getPosts(locale);
  for (let n = 2; n <= pageCount(posts.length, perPage); n++) pages.push({ kind: "blogPage", page: n });
  for (const category of getActiveCategories(locale)) pages.push({ kind: "category", category });
  for (const author of authorIds) if (getPostsByAuthor(locale, author).length) pages.push({ kind: "author", author });
  for (const post of posts) pages.push({ kind: "post", post });
  return pages;
}

export function segmentsOf(locale: Locale, r: Resolved): string[] {
  return r.kind === "static" ? pageSegments(r.id, locale) : pathOf(locale, r).split("/").slice(2);
}

/** Shorten to a snippet-friendly length on a word boundary. */
function clip(text: string, max = 158): string {
  if (text.length <= max) return text;
  return text.slice(0, text.lastIndexOf(" ", max - 1)).replace(/[\s,;:–-]+$/, "") + "…";
}

export type PageMeta = { title: string; description: string; noindex?: boolean; absoluteTitle?: boolean };

export function staticMeta(id: StaticPageId, m: Messages): PageMeta {
  if (id === "home") return { ...m.home.meta, absoluteTitle: true };
  if (id === "services") return m.services.overview.meta;
  if (id === "industries") return m.industries.overview.meta;
  if (id.startsWith("service:")) return m.services.items[id.slice(8) as ServiceId].meta;
  if (id.startsWith("industry:")) return m.industries.items[id.slice(9) as IndustryId].meta;
  if (id === "imprint" || id === "privacy" || id === "cookies") {
    // Legal pages stay out of the index until the documents are completed and approved.
    return { ...m.legal[id].meta, noindex: id === "cookies" || !site.legal.documentsApproved };
  }
  return m.pages[id as "portfolio" | "about" | "process" | "packages" | "faq" | "contact" | "blog"].meta;
}

export function metaOf(r: Resolved, m: Messages): PageMeta {
  const b = m.pages.blog;
  switch (r.kind) {
    case "static":
      return staticMeta(r.id, m);
    case "blogPage":
      return {
        title: `${b.meta.title} – ${fmt(b.pageTitleSuffix, { n: r.page })}`,
        description: `${fmt(b.pageTitleSuffix, { n: r.page })}: ${b.meta.description}`,
      };
    case "category":
      return {
        title: fmt(b.category.metaTitle, { name: b.categories[r.category].name }),
        description: clip(`${b.categories[r.category].name}: ${b.categories[r.category].description} ${b.intro}`),
      };
    case "author":
      return {
        title: b.authors[r.author].name,
        description: fmt(b.authorPage.metaDescription, { name: b.authors[r.author].name }),
      };
    case "post":
      return { title: r.post.title, description: r.post.description };
  }
}
