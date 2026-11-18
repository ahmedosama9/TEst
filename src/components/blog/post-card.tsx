import { Clock } from "lucide-react";
import Link from "next/link";
import { categorySlug } from "@/config/blog";
import { localeConfig, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import type { PostSummary } from "@/lib/blog";
import { blogPaths } from "@/lib/routes";
import { cn, fmt } from "@/lib/utils";

export function formatDate(iso: string, locale: Locale): string {
  return new Intl.DateTimeFormat(localeConfig[locale].intlLocale, { dateStyle: "long", timeZone: "Europe/Berlin" }).format(new Date(`${iso}T12:00:00Z`));
}

export type CardLabels = { readingTime: string; categories: Messages["pages"]["blog"]["categories"] };

/** Pure presentational card (usable from server and client components). */
export function PostCard({ post, locale, labels, featured, headingLevel = "h3" }: { post: PostSummary; locale: Locale; labels: CardLabels; featured?: boolean; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <article className={cn("group relative flex h-full flex-col rounded-2xl border border-line bg-white p-6 shadow-card transition hover:-translate-y-1 hover:border-turquoise", featured && "sm:p-8")}>
      <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold">
        <Link href={blogPaths.category(locale, categorySlug(post.category, locale))} className="relative z-10 rounded-full bg-turquoise/15 px-2.5 py-1 text-teal-ink hover:bg-turquoise/30">
          {labels.categories[post.category].name}
        </Link>
        <span className="inline-flex items-center gap-1 text-body">
          <Clock className="size-3.5" aria-hidden="true" />
          {fmt(labels.readingTime, { minutes: post.readingMinutes })}
        </span>
      </p>
      <H className={featured ? "text-2xl" : "text-xl"}>
        <Link href={blogPaths.post(locale, post.slug)} className="after:absolute after:inset-0 after:rounded-2xl">
          {post.title}
        </Link>
      </H>
      <p className="mt-3 flex-1 text-[0.95rem]">{post.excerpt}</p>
      <p className="mt-5 text-xs text-body">
        <time dateTime={post.updated}>{formatDate(post.updated, locale)}</time>
      </p>
    </article>
  );
}
