import Image from "next/image";
import { Camera, Check, Clapperboard, Images, Layers, MapPin, Target, TrendingUp, Users, Zap } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { ContactForm } from "@/components/forms/contact-form";
import { IndustryCards, PackageCards, PortfolioGrid, ProcessSteps, ServiceCards } from "@/components/sections/cards";
import { ArrowLink, CheckList, FaqList } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow, Section, SectionHeading } from "@/components/ui/section";
import { site } from "@/config/site";
import { localeConfig, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { getPosts, toSummary } from "@/lib/blog";
import { href } from "@/lib/routes";
import { organizationJsonLd, websiteJsonLd } from "@/lib/seo";
import { fmt, joinList } from "@/lib/utils";

const onsiteIcons = [MapPin, Clapperboard, Images, Users];
const valueIcons = [Zap, Layers, TrendingUp, Target];

/** Hero headline on three lines; the brand-coloured part is marked per language in the messages. */
function HeroTitle({ lines, highlight }: { lines: readonly string[]; highlight: string }) {
  return (
    <>
      {lines.map((line, n) => {
        const i = highlight ? line.indexOf(highlight) : -1;
        return (
          <span key={n} className="block">
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
  const areas = joinList(site.serviceArea.onSiteAreas, localeConfig[locale].intlLocale);
  const posts = getPosts(locale).slice(0, 3).map(toSummary);
  const g = messages.pages.faq.groups;
  const faq = [g[0].items[0], g[0].items[2], g[1].items[1], g[2].items[0], g[3].items[1]];

  return (
    <>
      <JsonLd data={[organizationJsonLd(locale, c.meta.siteDescription), websiteJsonLd(locale, c.meta.siteDescription)]} />

      {/* 1. Hero */}
      <section className="on-dark relative isolate overflow-hidden bg-[#000a22] text-soft">
        <div className="relative lg:h-[42rem] xl:h-[46rem]">
          {/* Text sits on the empty left side of the artwork in every language (the artwork is never mirrored). */}
          <div className="container-page relative z-10 flex h-full items-center pt-14 pb-2 sm:pt-20 lg:py-0">
            <div className="animate-rise w-full max-w-xl lg:mr-auto lg:ml-0 lg:max-w-[27rem] xl:max-w-[40rem]">
              <Eyebrow dark>{h.hero.eyebrow}</Eyebrow>
              <h1 className="text-[2.1rem] text-white min-[400px]:text-[2.4rem] sm:text-6xl lg:text-[2.85rem] xl:text-[4rem]">
                <HeroTitle lines={h.hero.titleLines} highlight={h.hero.titleHighlight} />
              </h1>
              <p className="mt-6 max-w-md text-lg text-white/90 sm:text-xl">{h.hero.subtitle}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <ButtonLink href={href("contact", locale)} size="lg">
                  {h.hero.ctaPrimary}
                  <span className="rtl-flip" aria-hidden="true">→</span>
                </ButtonLink>
                <ButtonLink href={href("services", locale)} size="lg" variant="outlineDark">{h.hero.ctaSecondary}</ButtonLink>
              </div>
            </div>
          </div>
          {/* Approved hero artwork (public/brand/hero.png). Desktop: anchored right at full height.
              Mobile: shown below the text, positioned so the phone stays fully visible. */}
          <div className="hero-art relative mt-4 h-[22rem] w-full sm:h-[30rem] lg:absolute lg:inset-y-0 lg:right-0 lg:left-auto lg:mt-0 lg:aspect-[1672/941] lg:h-full lg:w-auto">
            <Image
              src="/brand/hero.png"
              alt={h.hero.imageAlt}
              fill
              fetchPriority="high"
              loading="eager"
              quality={85}
              sizes="(min-width: 1280px) 1310px, (min-width: 1024px) 1195px, (min-width: 640px) 855px, 600px"
              className="object-cover object-[92%_50%] lg:object-right"
            />
          </div>
        </div>
        {/* Brand attributes from the identity sheet */}
        <div className="relative z-10 border-t border-white/10 bg-navy">
          <ul className="container-page grid grid-cols-2 gap-y-6 py-6 sm:grid-cols-4 sm:divide-x sm:divide-white/15 rtl:sm:divide-x-reverse">
            {h.hero.values.map((v, i) => {
              const Icon = valueIcons[i % valueIcons.length];
              return (
                <li key={v} className="flex flex-col items-center gap-2 px-3 text-center">
                  <Icon className="size-7 text-aqua" strokeWidth={1.75} aria-hidden="true" />
                  <span className="font-display text-base font-bold text-white sm:text-lg">{v}</span>
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
        <ServiceCards locale={locale} messages={messages} />
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
              <p className="mt-2 text-[0.95rem]">{fmt(h.onsite.areaText, { areas, remote: site.serviceArea.remote })}</p>
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
            <ContactForm t={c.form} locale={locale} privacyHref={href("privacy", locale)} fallbackEmail={site.contact.email} />
          </div>
        </div>
      </Section>
    </>
  );
}
