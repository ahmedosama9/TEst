import { getImageProps } from "next/image";
import { Camera, Check, Clapperboard, Images, Layers, MapPin, Target, TrendingUp, Users, Zap } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { LazyContactForm } from "@/components/forms/lazy-contact-form";
import { IndustryCards, PackageCards, PortfolioGrid, ProcessSteps, ServiceCards } from "@/components/sections/cards";
import { ArrowLink, CheckList, FaqList } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { serviceGroups } from "@/config/service-catalog";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { getPosts, toSummary } from "@/lib/blog";
import { href } from "@/lib/routes";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { fmt } from "@/lib/utils";

const onsiteIcons = [MapPin, Clapperboard, Images, Users];
const valueIcons = [Zap, Layers, TrendingUp, Target];

/** Hero headline on three lines; the brand-coloured part is marked per language in the messages. */
function HeroTitle({ lines, highlight }: { lines: readonly string[]; highlight: string }) {
  return (
    <>
      {lines.map((line, n) => {
        const i = highlight ? line.indexOf(highlight) : -1;
        return (
          <span key={n} className="lg:block">
            {i < 0 ? (
              line
            ) : (
              <>
                {line.slice(0, i)}
                <span className="text-gradient box-decoration-clone pe-[0.08em]">{highlight}</span>
                {line.slice(i + highlight.length)}
              </>
            )}{" "}
          </span>
        );
      })}
    </>
  );
}

export function HomePage({ locale, messages }: { locale: Locale; messages: Messages }) {
  const h = messages.home;
  const c = messages.common;
  const area = { city: site.serviceArea.baseCity, km: site.serviceArea.onSiteRadiusKm };
  const posts = getPosts(locale).slice(0, 3).map(toSummary);
  // Art direction: square illustration for phones/tablets, wide artwork for desktop.
  const mobileImg = getImageProps({ src: "/brand/hero-mobile.jpg", alt: "", width: 1536, height: 1536, sizes: "(min-width: 640px) 544px, 100vw" }).props;
  const desktopImg = getImageProps({ src: "/brand/hero.png", alt: "", width: 1672, height: 941, quality: 85, sizes: "(min-width: 1280px) 1310px, 1195px" }).props;
  const { srcSet: mobileSrcSet, sizes: mobileSizes, alt: _alt, loading: _loading, fetchPriority: _fp, decoding: _dec, className: _cn, style: _style, ...mobileRest } = mobileImg;
  void [_alt, _loading, _fp, _dec, _cn, _style];
  const art = {
    mobile: { srcSet: mobileSrcSet, sizes: mobileSizes, rest: mobileRest },
    desktop: { srcSet: desktopImg.srcSet, sizes: desktopImg.sizes },
  };
  const g = messages.pages.faq.groups;
  const faq = [g[0].items[0], g[0].items[2], g[1].items[1], g[2].items[0], g[3].items[1]];

  return (
    <>
      <JsonLd data={[organizationJsonLd(locale, c.meta.siteDescription), websiteJsonLd(locale, c.meta.siteDescription)]} />

      {/* 1. Hero */}
      <section className="on-dark relative isolate overflow-hidden bg-[#000a22] text-soft">
        {/* Only the artwork that matches the viewport is fetched early (and it is the LCP element). */}
        <link rel="preload" as="image" media="(max-width: 1023.98px)" imageSrcSet={art.mobile.srcSet} imageSizes={art.mobile.sizes} fetchPriority="high" />
        <link rel="preload" as="image" media="(min-width: 1024px)" imageSrcSet={art.desktop.srcSet} imageSizes={art.desktop.sizes} fetchPriority="high" />
        <div className="relative lg:h-[42rem] xl:h-[46rem]">
          {/* Text sits on the empty left side of the wide artwork in every language (artwork is never mirrored). */}
          <div className="container-page relative z-10 flex h-full items-center pt-7 sm:pt-12 lg:py-0">
            <div className="animate-rise w-full max-w-xl lg:mr-auto lg:ml-0 lg:max-w-[27rem] xl:max-w-[40rem]">
              <p className="mb-2 font-display text-[0.6875rem] font-bold tracking-[0.1em] text-balance text-aqua uppercase min-[400px]:text-xs sm:mb-3 sm:text-sm sm:tracking-[0.14em]">{h.hero.eyebrow}</p>
              <h1 className="text-[clamp(1.9rem,8.4vw,3.5rem)] text-white lg:text-[2.85rem] xl:text-[4rem]">
                <HeroTitle lines={h.hero.titleLines} highlight={h.hero.titleHighlight} />
              </h1>
              <p className="mt-4 max-w-md text-base text-white/90 sm:mt-6 sm:text-xl">{h.hero.subtitle}</p>
              <div className="mt-6 grid gap-3 sm:mt-8 sm:flex sm:flex-wrap">
                <ButtonLink href={href("contact", locale)} size="lg" className="w-full sm:w-auto">
                  {h.hero.ctaPrimary}
                  <span className="rtl-flip" aria-hidden="true">→</span>
                </ButtonLink>
                <ButtonLink href={href("services", locale)} size="lg" variant="outlineDark" className="w-full sm:w-auto">{h.hero.ctaSecondary}</ButtonLink>
              </div>
            </div>
          </div>
          {/* Approved artwork. Below 1024px: the square mobile illustration at its natural aspect ratio,
              uncropped. From 1024px: the wide artwork anchored right at full height. One <picture>,
              so each device downloads exactly one of the two files. */}
          <div className="hero-art relative mx-auto mt-3 aspect-square w-full max-w-[34rem] lg:absolute lg:inset-y-0 lg:right-0 lg:left-auto lg:mx-0 lg:mt-0 lg:aspect-[1672/941] lg:h-full lg:w-auto lg:max-w-none">
            <picture>
              <source media="(min-width: 1024px)" srcSet={art.desktop.srcSet} sizes={art.desktop.sizes} width={1672} height={941} />
              {/* <img> props come from next/image getImageProps (art direction) */}
              <img
                {...art.mobile.rest}
                alt={h.hero.imageAlt}
                sizes={art.mobile.sizes}
                srcSet={art.mobile.srcSet}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                className="absolute inset-0 size-full object-contain lg:object-cover lg:object-right"
              />
            </picture>
          </div>
        </div>
        {/* Brand attributes from the identity sheet */}
        <div className="relative z-10 border-white/10 lg:border-t lg:bg-navy">
          <ul className="container-page grid grid-cols-2 gap-x-3 gap-y-4 pt-1 pb-7 sm:grid-cols-4 sm:py-6 lg:divide-x lg:divide-white/15 rtl:lg:divide-x-reverse">
            {h.hero.values.map((v, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <li key={v} className="flex flex-col items-center gap-1.5 rounded-xl bg-white/5 px-2 py-3 text-center sm:gap-2 sm:bg-transparent sm:px-3 sm:py-0">
                  <Icon className="size-6 shrink-0 text-aqua sm:size-7" strokeWidth={1.75} aria-hidden="true" />
                  <span className="max-w-full font-display text-[0.8125rem] leading-tight font-bold text-white min-[360px]:text-sm sm:text-lg">{v}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 2. Trust and value proposition */}
      <Section labelledBy="trust-title">
        <SectionHeading id="trust-title" eyebrow={h.trust.eyebrow} title={h.trust.title} intro={h.trust.intro} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {h.trust.items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={i * 0.05} className="h-full rounded-2xl bg-mist p-6">
                <span className="bg-brand-gradient mb-4 block h-1.5 w-10 rounded-full" aria-hidden="true" />
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-2 text-[0.95rem]">{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 3. Services */}
      <Section tone="mist" labelledBy="services-title">
        <SectionHeading id="services-title" eyebrow={h.services.eyebrow} title={h.services.title} intro={h.services.intro} />
        <ServiceCards
          locale={locale}
          messages={messages}
          ids={serviceGroups.core}
          extra={
            <article className="on-dark hero-backdrop relative flex h-full flex-col rounded-2xl p-6 text-soft sm:p-7">
              <h3 className="text-xl text-white">{h.services.localCard.title}</h3>
              <p className="mt-3">{h.services.localCard.text}</p>
              <ul className="mt-4 flex-1 space-y-1">
                {serviceGroups.local.map((id) => (
                  <li key={id}><ArrowLink dark href={href(`service:${id}`, locale)}>{messages.services.items[id].name}</ArrowLink></li>
                ))}
              </ul>
            </article>
          }
        />
        <div className="mt-8"><ArrowLink href={href("services", locale)}>{c.cta.allServices}</ArrowLink></div>
      </Section>

      {/* 4. Process */}
      <Section labelledBy="process-title">
        <SectionHeading id="process-title" eyebrow={h.process.eyebrow} title={h.process.title} intro={h.process.intro} />
        <ProcessSteps messages={messages} />
        <div className="mt-8"><ArrowLink href={href("process", locale)}>{c.cta.viewProcess}</ArrowLink></div>
      </Section>

      {/* 5. On-site content creation */}
      <Section tone="navy" labelledBy="onsite-title">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow dark>{h.onsite.eyebrow}</Eyebrow>
            <h2 id="onsite-title" className="text-3xl text-white sm:text-4xl">{h.onsite.title}</h2>
            <p className="mt-4 text-lg">{h.onsite.text}</p>
            <div className="mt-6"><CheckList items={h.onsite.points} dark /></div>
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="flex items-center gap-2 text-base text-white"><MapPin className="size-4.5 text-aqua" aria-hidden="true" />{h.onsite.areaTitle}</h3>
              <p className="mt-2 text-[0.95rem]">{fmt(h.onsite.areaText, area)}</p>
            </div>
          </div>
          <Reveal>
            <div role="img" aria-label={h.onsite.visualAlt} className="rounded-3xl border border-white/10 bg-navy-700/70 p-6 shadow-2xl sm:p-8">
              <p className="mb-5 flex items-center gap-2 font-display font-bold text-white"><Camera className="size-5 text-aqua" aria-hidden="true" />{h.onsite.visual.title}</p>
              <ol className="space-y-3">
                {h.onsite.visual.items.map((item, i) => {
                  const Icon = onsiteIcons[i % onsiteIcons.length];
                  return (
                    <li key={item} className="flex items-center gap-4 rounded-xl bg-white/5 p-4">
                      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-aqua/15 text-aqua"><Icon className="size-5" aria-hidden="true" /></span>
                      <span className="font-medium text-white">{item}</span>
                      <span className="ms-auto font-display text-sm font-bold text-soft" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* 6. Industries */}
      <Section tone="navy" className="border-t border-white/10 !bg-none" labelledBy="industries-title">
        <SectionHeading id="industries-title" dark eyebrow={h.industries.eyebrow} title={h.industries.title} intro={h.industries.intro} />
        <IndustryCards locale={locale} messages={messages} />
        <div className="mt-8"><ArrowLink dark href={href("industries", locale)}>{c.cta.allIndustries}</ArrowLink></div>
      </Section>

      {/* 7. Portfolio examples */}
      <Section labelledBy="portfolio-title">
        <SectionHeading id="portfolio-title" eyebrow={h.portfolio.eyebrow} title={h.portfolio.title} intro={h.portfolio.intro} />
        <PortfolioGrid messages={messages} limit={3} />
        <div className="mt-8"><ArrowLink href={href("portfolio", locale)}>{c.cta.viewPortfolio}</ArrowLink></div>
      </Section>

      {/* 8. Packages */}
      <Section tone="mist" labelledBy="packages-title">
        <SectionHeading id="packages-title" center eyebrow={h.packages.eyebrow} title={h.packages.title} intro={h.packages.intro} />
        <PackageCards locale={locale} messages={messages} />
        <div className="mt-8 text-center"><ArrowLink href={href("packages", locale)}>{c.cta.viewPackages}</ArrowLink></div>
      </Section>

      {/* 9. Why choose us */}
      <Section labelledBy="why-title">
        <SectionHeading id="why-title" eyebrow={h.why.eyebrow} title={h.why.title} />
        <ul className="grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {h.why.items.map((item, i) => (
            <li key={item.title}>
              <Reveal delay={(i % 3) * 0.05}>
                <h3 className="flex items-start gap-3 text-lg">
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-turquoise/15 text-teal-ink"><Check className="size-4" strokeWidth={3} aria-hidden="true" /></span>
                  {item.title}
                </h3>
                <p className="mt-2 ps-9 text-[0.95rem]">{item.text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* 10. Latest blog articles */}
      {posts.length ? (
        <Section tone="mist" labelledBy="blog-title">
          <SectionHeading id="blog-title" eyebrow={h.blog.eyebrow} title={h.blog.title} intro={h.blog.intro} />
          <ul className="grid gap-5 md:grid-cols-3">
            {posts.map((post) => (
              <li key={post.id}>
                <PostCard post={post} locale={locale} labels={{ readingTime: messages.pages.blog.article.readingTime, categories: messages.pages.blog.categories }} />
              </li>
            ))}
          </ul>
          <div className="mt-8"><ArrowLink href={href("blog", locale)}>{c.cta.allArticles}</ArrowLink></div>
        </Section>
      ) : null}

      {/* 11. FAQ */}
      <Section labelledBy="faq-title">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeading id="faq-title" eyebrow={h.faq.eyebrow} title={h.faq.title} intro={h.faq.intro} />
            <ArrowLink href={href("faq", locale)}>{h.faq.more}</ArrowLink>
          </div>
          <FaqList items={faq} />
        </div>
      </Section>

      {/* 12. Final CTA and contact form */}
      <Section tone="navy" id="kontakt" labelledBy="contact-title">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <Eyebrow dark>{h.contact.eyebrow}</Eyebrow>
            <h2 id="contact-title" className="text-3xl text-white sm:text-4xl">{h.contact.title}</h2>
            <p className="mt-4 text-lg">{h.contact.text}</p>
            <div className="mt-6"><CheckList items={h.contact.points} dark /></div>
            <p className="ltr-isolate mt-10 font-display text-xl font-extrabold text-aqua" lang="de" dir="ltr">{site.tagline}</p>
          </div>
          <div className="on-light rounded-3xl bg-white p-6 text-body shadow-2xl sm:p-9">
            <h3 className="text-2xl">{c.form.title}</h3>
            <p className="mt-2 mb-6">{c.form.intro}</p>
            <LazyContactForm t={c.form} locale={locale} privacyHref={href("privacy", locale)} fallbackEmail={site.contact.email} fallbackHref={href("contact", locale)} fallbackLabel={c.cta.contactUs} />
          </div>
        </div>
      </Section>
    </>
  );
}
