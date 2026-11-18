import { ArrowLeft, ArrowRight, CalendarDays, Clock, ListOrdered, RefreshCw, Sparkles, UserRound } from "lucide-react";
import Link from "next/link";
import { BlogExplorer } from "@/components/blog/blog-explorer";
import { ArticleBody } from "@/components/blog/mdx";
import { formatDate, PostCard } from "@/components/blog/post-card";
import { ShareLinks } from "@/components/blog/share-links";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { serviceIcons } from "@/components/sections/cards";
import { ArrowLink, CheckList, FaqList, PageHero } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { authors, categorySlug, type AuthorId, type CategoryId } from "@/config/blog";
import { site } from "@/config/site";
import { localeConfig, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { getActiveCategories, getPosts, getPostsByAuthor, getPostsByCategory, getRelatedPosts, pageCount, toSummary, type Post } from "@/lib/blog";
import { blogPaths, href } from "@/lib/routes";
import { abs, articleJsonLd, faqJsonLd, type Crumb } from "@/lib/seo";
import { cn, fmt } from "@/lib/utils";

type P = { locale: Locale; messages: Messages };
const cardLabels = (m: Messages) => ({ readingTime: m.pages.blog.article.readingTime, categories: m.pages.blog.categories });
const baseCrumbs = ({ locale, messages }: P): Crumb[] => [
  { name: messages.common.nav.home, path: href("home", locale) },
  { name: messages.common.nav.blog, path: href("blog", locale) },
];

function CategoryNav({ locale, messages, current }: P & { current?: CategoryId }) {
  const b = messages.pages.blog;
  const active = getActiveCategories(locale);
  const pill = "inline-flex min-h-10 items-center rounded-full border px-4 text-sm font-medium transition";
  return (
    <nav aria-label={b.categoriesTitle} className="mb-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href={href("blog", locale)} aria-current={current ? undefined : "page"} className={cn(pill, current ? "border-navy/20 bg-white text-ink hover:border-navy/60" : "border-navy bg-navy text-white")}>
            {b.allCategories}
          </Link>
        </li>
        {active.map((id) => (
          <li key={id}>
            <Link
              href={blogPaths.category(locale, categorySlug(id, locale))}
              aria-current={current === id ? "page" : undefined}
              className={cn(pill, current === id ? "border-navy bg-navy text-white" : "border-navy/20 bg-white text-ink hover:border-navy/60")}
            >
              {b.categories[id].name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Pagination({ locale, messages, page, total }: P & { page: number; total: number }) {
  if (total <= 1) return null;
  const t = messages.pages.blog.pagination;
  const item = "inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-full border px-4 text-sm font-semibold";
  return (
    <nav aria-label={t.label} className="mt-12 flex flex-wrap items-center justify-center gap-2">
      {page > 1 ? (
        <Link href={blogPaths.page(locale, page - 1)} rel="prev" className={cn(item, "border-navy/20 bg-white text-ink hover:border-navy/60")}>
          <ArrowLeft className="rtl-flip size-4" aria-hidden="true" />{t.prev}
        </Link>
      ) : null}
      <ul className="flex gap-2">
        {Array.from({ length: total }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <Link
              href={blogPaths.page(locale, n)}
              aria-label={fmt(t.page, { n })}
              aria-current={n === page ? "page" : undefined}
              className={cn(item, n === page ? "border-navy bg-navy text-white" : "border-navy/20 bg-white text-ink hover:border-navy/60")}
            >
              {n}
            </Link>
          </li>
        ))}
      </ul>
      {page < total ? (
        <Link href={blogPaths.page(locale, page + 1)} rel="next" className={cn(item, "border-navy/20 bg-white text-ink hover:border-navy/60")}>
          {t.next}<ArrowRight className="rtl-flip size-4" aria-hidden="true" />
        </Link>
      ) : null}
    </nav>
  );
}

function PostGrid({ posts, locale, messages }: P & { posts: Post[] }) {
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((p) => (
        <li key={p.id}><PostCard post={toSummary(p)} locale={locale} labels={cardLabels(messages)} headingLevel="h3" /></li>
      ))}
    </ul>
  );
}

export function BlogIndexPage({ locale, messages, page }: P & { page: number }) {
  const b = messages.pages.blog;
  const all = getPosts(locale);
  const perPage = site.blog.postsPerPage;
  const total = pageCount(all.length, perPage);
  const featured = page === 1 ? all.filter((p) => p.featured).slice(0, 2) : [];
  const pagePosts = all.slice((page - 1) * perPage, page * perPage);
  const crumbs = baseCrumbs({ locale, messages });
  if (page > 1) crumbs.push({ name: fmt(b.pagination.page, { n: page }), path: blogPaths.page(locale, page) });

  return (
    <>
      <PageHero crumbs={crumbs} breadcrumbLabel={messages.common.labels.breadcrumbs} eyebrow={b.eyebrow} title={page > 1 ? `${b.title} – ${fmt(b.pagination.page, { n: page })}` : b.title} intro={b.intro} />
      <Section tone="mist">
        <CategoryNav locale={locale} messages={messages} />
        <BlogExplorer
          posts={all.map(toSummary)}
          locale={locale}
          intlLocale={localeConfig[locale].intlLocale}
          labels={{ ...cardLabels(messages), searchLabel: b.searchLabel, searchPlaceholder: b.searchPlaceholder, tagsTitle: b.tagsTitle, clearFilters: b.clearFilters, resultsCount: b.resultsCount, noResults: b.noResults }}
        >
          {featured.length ? (
            <section aria-labelledby="featured-title" className="mb-14">
              <h2 id="featured-title" className="mb-6 flex items-center gap-2 text-2xl"><Sparkles className="size-5 text-teal-ink" aria-hidden="true" />{b.featuredTitle}</h2>
              <ul className="grid gap-5 md:grid-cols-2">
                {featured.map((p) => (
                  <li key={p.id}><PostCard post={toSummary(p)} locale={locale} labels={cardLabels(messages)} featured headingLevel="h3" /></li>
                ))}
              </ul>
            </section>
          ) : null}
          <section aria-labelledby="all-title">
            <h2 id="all-title" className="mb-6 text-2xl">{b.allTitle}</h2>
            <PostGrid posts={pagePosts} locale={locale} messages={messages} />
            <p className="sr-only">{fmt(b.pagination.current, { n: page, total })}</p>
            <Pagination locale={locale} messages={messages} page={page} total={total} />
          </section>
        </BlogExplorer>
      </Section>
    </>
  );
}

export function BlogCategoryPage({ locale, messages, category }: P & { category: CategoryId }) {
  const b = messages.pages.blog;
  const cat = b.categories[category];
  const posts = getPostsByCategory(locale, category);
  return (
    <>
      <PageHero
        crumbs={[...baseCrumbs({ locale, messages }), { name: cat.name, path: blogPaths.category(locale, categorySlug(category, locale)) }]}
        breadcrumbLabel={messages.common.labels.breadcrumbs}
        eyebrow={b.category.eyebrow}
        title={cat.name}
        intro={cat.description}
      />
      <Section tone="mist">
        <CategoryNav locale={locale} messages={messages} current={category} />
        <PostGrid posts={posts} locale={locale} messages={messages} />
        <div className="mt-10"><ArrowLink href={href("blog", locale)}>{b.category.back}</ArrowLink></div>
      </Section>
    </>
  );
}

export function BlogAuthorPage({ locale, messages, author }: P & { author: AuthorId }) {
  const b = messages.pages.blog;
  const a = b.authors[author];
  return (
    <>
      <PageHero
        crumbs={[...baseCrumbs({ locale, messages }), { name: a.name, path: blogPaths.author(locale, author) }]}
        breadcrumbLabel={messages.common.labels.breadcrumbs}
        eyebrow={b.authorPage.eyebrow}
        title={a.name}
        intro={a.bio}
      />
      <Section tone="mist">
        <h2 className="mb-6 text-2xl">{fmt(b.authorPage.articlesBy, { name: a.name })}</h2>
        <PostGrid posts={getPostsByAuthor(locale, author)} locale={locale} messages={messages} />
      </Section>
    </>
  );
}

export function BlogPostPage({ locale, messages, post }: P & { post: Post }) {
  const b = messages.pages.blog;
  const t = b.article;
  const c = messages.common;
  const path = blogPaths.post(locale, post.slug);
  const author = b.authors[post.author];
  const authorPath = blogPaths.author(locale, post.author);
  const cat = b.categories[post.category];
  const related = getRelatedPosts(post);
  const service = post.relatedService ? messages.services.items[post.relatedService] : null;
  const ServiceIcon = post.relatedService ? serviceIcons[post.relatedService] : null;
  const crumbs: Crumb[] = [
    ...baseCrumbs({ locale, messages }),
    { name: cat.name, path: blogPaths.category(locale, categorySlug(post.category, locale)) },
    { name: post.title, path },
  ];

  return (
    <article>
      <JsonLd
        data={[
          articleJsonLd({
            locale,
            title: post.title,
            description: post.description,
            path,
            datePublished: post.date,
            dateModified: post.updated,
            author: { name: author.name, type: authors[post.author].type, path: authorPath, sameAs: authors[post.author].sameAs },
            section: cat.name,
            keywords: post.tags,
            wordCountMinutes: post.readingMinutes,
          }),
          ...(post.faq.length ? [faqJsonLd(post.faq)] : []),
        ]}
      />
      <header className="on-dark hero-backdrop text-soft">
        <div className="container-page py-12 sm:py-16">
          <Breadcrumbs crumbs={crumbs} label={c.labels.breadcrumbs} dark />
          <div className="max-w-3xl">
            {post.status === "draft" ? <p className="mb-4 inline-block rounded-full bg-amber-300 px-3 py-1 text-xs font-bold text-navy">{t.draft}</p> : null}
            <h1 className="text-3xl text-white sm:text-5xl">{post.title}</h1>
            <p className="mt-5 text-lg">{post.excerpt}</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li className="flex items-center gap-2">
                <UserRound className="size-4 text-aqua" aria-hidden="true" />
                <span>{t.by} <Link href={authorPath} rel="author" className="font-semibold text-white underline-offset-4 hover:underline">{author.name}</Link></span>
              </li>
              <li className="flex items-center gap-2"><CalendarDays className="size-4 text-aqua" aria-hidden="true" /><span>{t.published} <time dateTime={post.date}>{formatDate(post.date, locale)}</time></span></li>
              <li className="flex items-center gap-2"><RefreshCw className="size-4 text-aqua" aria-hidden="true" /><span>{t.updated} <time dateTime={post.updated}>{formatDate(post.updated, locale)}</time></span></li>
              <li className="flex items-center gap-2"><Clock className="size-4 text-aqua" aria-hidden="true" />{fmt(t.readingTime, { minutes: post.readingMinutes })}</li>
            </ul>
          </div>
        </div>
      </header>

      <div className="container-page grid gap-12 py-12 sm:py-16 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="min-w-0 max-w-3xl">
          {post.translationStatus === "needs-review" ? <p className="mb-6 rounded-xl bg-mist px-4 py-3 text-sm italic">{t.translationNote}</p> : null}

          {/* Short direct answer — first thing in the article body */}
          <section aria-labelledby="answer-title" className="rounded-2xl border-s-4 border-turquoise bg-mist p-6">
            <h2 id="answer-title" className="text-lg">{t.answerTitle}</h2>
            <p className="mt-2 text-lg text-ink">{post.answer}</p>
          </section>

          <section aria-labelledby="takeaways-title" className="mt-6 rounded-2xl border border-line p-6">
            <h2 id="takeaways-title" className="mb-4 text-lg">{t.takeawaysTitle}</h2>
            <CheckList items={post.keyTakeaways} />
          </section>

          {/* Table of contents (mobile: collapsible) */}
          <details className="mt-6 rounded-2xl border border-line p-5 lg:hidden">
            <summary className="flex min-h-9 cursor-pointer items-center gap-2 font-display font-bold text-ink"><ListOrdered className="size-5 text-teal-ink" aria-hidden="true" />{t.tocTitle}</summary>
            <Toc post={post} />
          </details>

          <div className="mt-10">
            <ArticleBody source={post.body} locale={locale} anchorLabel={t.anchorLabel} externalLabel={c.labels.externalLink} />
          </div>

          {post.faq.length ? (
            <section aria-labelledby="article-faq" className="mt-14">
              <h2 id="article-faq" className="mb-5 text-2xl sm:text-3xl">{t.faqTitle}</h2>
              <FaqList items={post.faq} />
            </section>
          ) : null}

          {post.sources.length ? (
            <section aria-labelledby="sources-title" className="mt-12">
              <h2 id="sources-title" className="mb-3 text-xl">{t.sourcesTitle}</h2>
              <ul className="list-disc space-y-1 ps-6">
                {post.sources.map((s) => (
                  <li key={s.url}><a href={s.url} rel="noopener noreferrer" target="_blank" className="text-teal-ink underline underline-offset-4">{s.title}</a></li>
                ))}
              </ul>
            </section>
          ) : null}

          <ul aria-label={b.tagsTitle} className="mt-10 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li key={tag} className="rounded-full bg-mist px-3 py-1 text-sm font-medium text-ink">{tag}</li>
            ))}
          </ul>

          {/* Author */}
          <section aria-labelledby="author-title" className="mt-10 flex gap-4 rounded-2xl border border-line p-6">
            <span className="bg-brand-gradient grid size-12 shrink-0 place-items-center rounded-full text-navy"><UserRound className="size-6" aria-hidden="true" /></span>
            <div>
              <h2 id="author-title" className="text-lg"><Link href={authorPath} className="hover:underline">{author.name}</Link></h2>
              <p className="text-sm font-semibold text-teal-ink">{author.role}</p>
              <p className="mt-2 text-[0.95rem]">{author.bio}</p>
            </div>
          </section>

          <ShareLinks url={abs(path)} title={post.title} labels={{ title: t.shareTitle, copy: t.copyLink, copied: t.copied, shareOn: t.shareOn, email: t.shareByEmail }} />

          {/* Article CTA */}
          <aside className="on-dark hero-backdrop mt-12 rounded-3xl p-7 text-soft sm:p-9">
            <h2 className="text-2xl text-white">{t.ctaTitle}</h2>
            <p className="mt-3">{t.ctaText}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href={href("contact", locale)}>{c.cta.primary}</ButtonLink>
              {post.relatedService && service ? <ButtonLink variant="outlineDark" href={href(`service:${post.relatedService}`, locale)}>{service.name}</ButtonLink> : null}
            </div>
          </aside>
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-6">
            <nav aria-label={t.tocTitle} className="rounded-2xl border border-line p-5">
              <p className="flex items-center gap-2 font-display font-bold text-ink"><ListOrdered className="size-5 text-teal-ink" aria-hidden="true" />{t.tocTitle}</p>
              <Toc post={post} />
            </nav>
            {post.relatedService && service && ServiceIcon ? (
              <div className="rounded-2xl bg-mist p-5">
                <p className="text-xs font-bold tracking-wider text-teal-ink uppercase">{t.relatedServiceLabel}</p>
                <p className="mt-2 flex items-center gap-2 font-display font-bold text-ink"><ServiceIcon className="size-5 text-teal-ink" aria-hidden="true" />{service.name}</p>
                <p className="mt-2 text-sm">{service.short}</p>
                <ArrowLink href={href(`service:${post.relatedService}`, locale)}>{c.cta.learnMore}</ArrowLink>
              </div>
            ) : null}
          </div>
        </aside>
      </div>

      {related.length ? (
        <Section tone="mist" labelledBy="related-title">
          <h2 id="related-title" className="mb-8 text-2xl sm:text-3xl">{t.relatedTitle}</h2>
          <PostGrid posts={related} locale={locale} messages={messages} />
        </Section>
      ) : null}
    </article>
  );
}

function Toc({ post }: { post: Post }) {
  return (
    <ol className="mt-3 space-y-1 text-sm">
      {post.toc.map((item) => (
        <li key={item.id} className={item.level === 3 ? "ps-4" : undefined}>
          <a href={`#${item.id}`} className="inline-flex min-h-8 items-center text-body hover:text-teal-ink hover:underline">{item.text}</a>
        </li>
      ))}
    </ol>
  );
}
