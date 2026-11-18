import { evaluate } from "@mdx-js/mdx";
import { Lightbulb } from "lucide-react";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import * as runtime from "react/jsx-runtime";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import type { Locale } from "@/i18n/config";
import { getPostById } from "@/lib/blog";
import { blogPaths, href, staticPageIds, type StaticPageId } from "@/lib/routes";

/**
 * Internal links in articles are language-neutral:
 *   [text](page:contact)  → localized page URL
 *   [text](post:<article-id>) → that article in the current language (or the blog index if untranslated)
 */
export function resolveContentLink(target: string, locale: Locale): string {
  if (target.startsWith("page:")) {
    const id = target.slice(5) as StaticPageId;
    if (!staticPageIds.includes(id)) throw new Error(`Unknown page link "${target}" in article content`);
    return href(id, locale);
  }
  if (target.startsWith("post:")) {
    const post = getPostById(locale, target.slice(5));
    return post ? blogPaths.post(locale, post.slug) : href("blog", locale);
  }
  return target;
}

function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <aside className="rounded-2xl border border-turquoise/40 bg-turquoise/10 p-5 sm:p-6">
      {title ? (
        <p className="mb-1 flex items-center gap-2 font-display font-bold text-ink">
          <Lightbulb className="size-5 text-teal-ink" aria-hidden="true" />
          {title}
        </p>
      ) : null}
      <div className="[&>p]:m-0">{children}</div>
    </aside>
  );
}

export async function ArticleBody({ source, locale, anchorLabel, externalLabel }: { source: string; locale: Locale; anchorLabel: string; externalLabel: string }) {
  const heading = (Tag: "h2" | "h3") =>
    function Heading({ id, children, ...rest }: ComponentProps<"h2">) {
      return (
        <Tag id={id} {...rest}>
          {children}
          {id ? (
            <a href={`#${id}`} className="heading-anchor" aria-label={`${anchorLabel}: ${typeof children === "string" ? children : ""}`}>#</a>
          ) : null}
        </Tag>
      );
    };

  const components = {
    Callout,
    h2: heading("h2"),
    h3: heading("h3"),
    a: ({ href: to = "", children }: ComponentProps<"a">) => {
      const resolved = resolveContentLink(to, locale);
      if (/^https?:\/\//.test(resolved)) {
        return (
          <a href={resolved} target="_blank" rel="noopener noreferrer">
            {children}
            <span className="sr-only"> ({externalLabel})</span>
          </a>
        );
      }
      return <Link href={resolved}>{children}</Link>;
    },
    table: (props: ComponentProps<"table">) => (
      <div className="table-wrap" tabIndex={0}>
        <table {...props} />
      </div>
    ),
  };

  const { default: Content } = await evaluate(source, {
    ...runtime,
    remarkPlugins: [remarkGfm],
    rehypePlugins: [rehypeSlug],
  });
  return (
    <div className="prose-article">
      <Content components={components} />
    </div>
  );
}
