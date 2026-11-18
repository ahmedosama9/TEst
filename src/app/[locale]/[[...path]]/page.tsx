import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PageView } from "@/components/pages/page-view";
import { isLocale, locales } from "@/i18n/config";
import { loadMessages } from "@/i18n/messages";
import { allPages, alternatesOf, metaOf, pathOf, resolve, segmentsOf } from "@/lib/pages";
import { buildMetadata } from "@/lib/seo";

/**
 * Single catch-all route. Every URL is resolved against the central route registry
 * (src/lib/routes.ts) and the blog content, then statically generated.
 */
export function generateStaticParams() {
  return locales.flatMap((locale) => allPages(locale).map((page) => ({ locale, path: segmentsOf(locale, page) })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[[...path]]">): Promise<Metadata> {
  const { locale, path = [] } = await params;
  if (!isLocale(locale)) return { robots: { index: false, follow: false } };
  const page = resolve(locale, path);
  if (!page) return { robots: { index: false, follow: false } };
  const meta = metaOf(page, await loadMessages(locale));
  return buildMetadata({
    locale,
    ...meta,
    path: pathOf(locale, page),
    alternates: alternatesOf(page),
    type: page.kind === "post" ? "article" : "website",
    article:
      page.kind === "post"
        ? {
            publishedTime: page.post.date,
            modifiedTime: page.post.updated,
            authors: [],
            tags: page.post.tags,
            section: page.post.category,
          }
        : undefined,
  });
}

export default async function Page({ params }: PageProps<"/[locale]/[[...path]]">) {
  const { locale, path = [] } = await params;
  if (!isLocale(locale)) notFound();
  setRequestLocale(locale);
  const page = resolve(locale, path);
  if (!page) notFound();
  return <PageView locale={locale} page={page} messages={await loadMessages(locale)} />;
}
