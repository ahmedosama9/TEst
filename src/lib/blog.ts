import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { z } from "zod";
import { locales, type Locale } from "@/i18n/config";
import { authorIds, categoryIds, type AuthorId, type CategoryId } from "@/config/blog";
import { serviceIds, type ServiceId } from "@/lib/routes";

/**
 * File-based blog: content/blog/<article-id>/<locale>.mdx
 * - <article-id> is the stable, language-neutral identifier that links translations.
 * - A language version exists only if its file exists (no empty pages are generated).
 * - `status: draft` articles are visible in development only.
 * See docs/CONTENT_WORKFLOW.md.
 */
const BLOG_DIR = path.join(process.cwd(), "content", "blog");

const frontmatterSchema = z.object({
  title: z.string().min(5),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be lowercase ASCII with hyphens"),
  description: z.string().min(50).max(200),
  excerpt: z.string().min(20),
  category: z.enum(categoryIds),
  tags: z.array(z.string().min(1)).min(1).max(8),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  author: z.enum(authorIds as [AuthorId, ...AuthorId[]]),
  status: z.enum(["draft", "published"]),
  translationStatus: z.enum(["source", "needs-review", "reviewed"]),
  featured: z.boolean().default(false),
  relatedService: z.enum(serviceIds).optional(),
  answer: z.string().min(40),
  keyTakeaways: z.array(z.string()).min(2).max(7),
  faq: z.array(z.object({ q: z.string(), a: z.string() })).default([]),
  sources: z.array(z.object({ title: z.string(), url: z.string().url() })).default([]),
});

export type PostFrontmatter = z.infer<typeof frontmatterSchema>;
export type TocItem = { id: string; text: string; level: 2 | 3 };
export type Post = PostFrontmatter & {
  id: string;
  locale: Locale;
  body: string;
  readingMinutes: number;
  toc: TocItem[];
  category: CategoryId;
  relatedService?: ServiceId;
};
export type PostSummary = Omit<Post, "body" | "toc" | "faq" | "sources" | "keyTakeaways" | "answer">;

const showDrafts = process.env.NODE_ENV !== "production";

function stripInline(md: string): string {
  return md
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

function extractToc(body: string): TocItem[] {
  const slugger = new GithubSlugger();
  const items: TocItem[] = [];
  let inFence = false;
  for (const line of body.split("\n")) {
    if (line.trim().startsWith("```")) inFence = !inFence;
    if (inFence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (!m) continue;
    const text = stripInline(m[2]);
    items.push({ id: slugger.slug(text), text, level: m[1].length as 2 | 3 });
  }
  return items;
}

function readingMinutes(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

let cache: Post[] | null = null;

function loadAll(): Post[] {
  if (cache && !showDrafts) return cache;
  const posts: Post[] = [];
  if (!fs.existsSync(BLOG_DIR)) return posts;
  for (const id of fs.readdirSync(BLOG_DIR).sort()) {
    const dir = path.join(BLOG_DIR, id);
    if (id.startsWith("_") || !fs.statSync(dir).isDirectory()) continue;
    for (const locale of locales) {
      const file = path.join(dir, `${locale}.mdx`);
      if (!fs.existsSync(file)) continue;
      const { data, content } = matter(fs.readFileSync(file, "utf8"));
      const parsed = frontmatterSchema.safeParse(data);
      if (!parsed.success) {
        throw new Error(`Invalid frontmatter in content/blog/${id}/${locale}.mdx:\n${z.prettifyError(parsed.error)}`);
      }
      if (parsed.data.status === "draft" && !showDrafts) continue;
      posts.push({
        ...parsed.data,
        id,
        locale,
        body: content,
        toc: extractToc(content),
        readingMinutes: readingMinutes(content),
      });
    }
  }
  // Slugs must be unique per locale.
  const seen = new Set<string>();
  for (const p of posts) {
    const key = `${p.locale}/${p.slug}`;
    if (seen.has(key)) throw new Error(`Duplicate blog slug: ${key}`);
    seen.add(key);
  }
  cache = posts;
  return posts;
}

const byDateDesc = (a: Post, b: Post) => (a.date === b.date ? a.id.localeCompare(b.id) : a.date < b.date ? 1 : -1);

export function getPosts(locale: Locale): Post[] {
  return loadAll()
    .filter((p) => p.locale === locale)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || byDateDesc(a, b));
}

export function getPostBySlug(locale: Locale, slug: string): Post | null {
  return loadAll().find((p) => p.locale === locale && p.slug === slug) ?? null;
}

export function getPostById(locale: Locale, id: string): Post | null {
  return loadAll().find((p) => p.locale === locale && p.id === id) ?? null;
}

/** All language versions of one article: locale → slug. */
export function getPostTranslations(id: string): Partial<Record<Locale, string>> {
  const out: Partial<Record<Locale, string>> = {};
  for (const p of loadAll()) if (p.id === id) out[p.locale] = p.slug;
  return out;
}

export function getPostsByCategory(locale: Locale, category: CategoryId): Post[] {
  return getPosts(locale).filter((p) => p.category === category);
}

export function getPostsByAuthor(locale: Locale, author: AuthorId): Post[] {
  return getPosts(locale).filter((p) => p.author === author);
}

/** Categories that have at least one article in this language (empty category pages are never generated). */
export function getActiveCategories(locale: Locale): CategoryId[] {
  const used = new Set(getPosts(locale).map((p) => p.category));
  return categoryIds.filter((c) => used.has(c));
}

export function getRelatedPosts(post: Post, limit = 3): Post[] {
  const others = getPosts(post.locale).filter((p) => p.id !== post.id);
  const score = (p: Post) =>
    (p.category === post.category ? 3 : 0) +
    (p.relatedService && p.relatedService === post.relatedService ? 2 : 0) +
    p.tags.filter((t) => post.tags.includes(t)).length;
  return others.sort((a, b) => score(b) - score(a) || byDateDesc(a, b)).slice(0, limit);
}

export function pageCount(total: number, perPage: number): number {
  return Math.max(1, Math.ceil(total / perPage));
}

export function toSummary(p: Post): PostSummary {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { body, toc, faq, sources, keyTakeaways, answer, ...rest } = p;
  return rest;
}

export function tagSlug(tag: string): string {
  return new GithubSlugger().slug(tag);
}
