"use client";

import { Search, X } from "lucide-react";
import { useDeferredValue, useMemo, useState, type ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { PostSummary } from "@/lib/blog";
import { cn, fmt } from "@/lib/utils";
import { PostCard, type CardLabels } from "./post-card";

type Labels = CardLabels & {
  searchLabel: string;
  searchPlaceholder: string;
  tagsTitle: string;
  clearFilters: string;
  resultsCount: string;
  noResults: string;
};

const norm = (s: string, locale: string) => s.toLocaleLowerCase(locale).normalize("NFKD").replace(/[̀-ًͯ-ٟ]/g, "");

/**
 * Search + tag filter over all articles of the current language (client-side, no request).
 * Without an active filter the server-rendered, paginated list (`children`) is shown,
 * so crawlers and no-JS visitors always get the full paginated archive.
 */
export function BlogExplorer({ posts, locale, intlLocale, labels, children }: { posts: PostSummary[]; locale: Locale; intlLocale: string; labels: Labels; children: ReactNode }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState<string | null>(null);
  const deferred = useDeferredValue(query);

  const tags = useMemo(() => {
    const count = new Map<string, number>();
    for (const p of posts) for (const t of p.tags) count.set(t, (count.get(t) ?? 0) + 1);
    return [...count.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], intlLocale)).map(([t]) => t);
  }, [posts, intlLocale]);

  const q = norm(deferred.trim(), intlLocale);
  const active = q.length >= 2 || tag !== null;
  const results = useMemo(() => {
    if (!active) return [];
    const terms = q.length >= 2 ? q.split(/\s+/) : [];
    return posts.filter((p) => {
      if (tag && !p.tags.includes(tag)) return false;
      const hay = norm([p.title, p.excerpt, p.description, p.tags.join(" "), labels.categories[p.category].name].join(" "), intlLocale);
      return terms.every((t) => hay.includes(t));
    });
  }, [active, q, tag, posts, intlLocale, labels.categories]);

  return (
    <div>
      <div className="mb-10 rounded-2xl border border-line bg-white p-5 shadow-card sm:p-6">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="relative">
          <label htmlFor="blog-search" className="sr-only">{labels.searchLabel}</label>
          <Search className="pointer-events-none absolute start-4 top-1/2 size-5 -translate-y-1/2 text-body" aria-hidden="true" />
          <input
            id="blog-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={labels.searchPlaceholder}
            className="block w-full rounded-full border border-navy/25 bg-white py-3 ps-12 pe-4 text-base text-ink placeholder:text-body/70 focus:border-violet focus:ring-3 focus:ring-violet/25 focus:outline-none"
          />
        </form>
        <div className="mt-4">
          <p id="blog-tags" className="mb-2 text-sm font-semibold text-ink">{labels.tagsTitle}</p>
          <ul aria-labelledby="blog-tags" className="flex flex-wrap gap-2">
            {tags.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  aria-pressed={tag === t}
                  onClick={() => setTag(tag === t ? null : t)}
                  className={cn(
                    "min-h-9 rounded-full border px-3.5 text-sm font-medium transition",
                    tag === t ? "border-navy bg-navy text-white" : "border-navy/20 bg-white text-ink hover:border-navy/60",
                  )}
                >
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p role="status" aria-live="polite" className={cn("mb-6 flex flex-wrap items-center gap-4 text-sm font-medium text-ink", !active && "sr-only")}>
        {active ? (results.length ? fmt(labels.resultsCount, { count: results.length }) : labels.noResults) : ""}
        {active ? (
          <button type="button" onClick={() => { setQuery(""); setTag(null); }} className="inline-flex min-h-9 items-center gap-1 text-teal-ink underline underline-offset-4">
            <X className="size-4" aria-hidden="true" />
            {labels.clearFilters}
          </button>
        ) : null}
      </p>

      {active ? (
        <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((p) => (
            <li key={p.id}><PostCard post={p} locale={locale} labels={labels} headingLevel="h2" /></li>
          ))}
        </ul>
      ) : (
        children
      )}
    </div>
  );
}
