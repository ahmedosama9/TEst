import { Mail, MapPin, Phone } from "lucide-react";
import Link from "next/link";
import { ContactFormLoader } from "@/components/forms/contact-form-loader";
import {
  IconBadge,
  IndustryCards,
  PackageCards,
  PackageCompareTable,
  PortfolioGrid,
  ProcessSteps,
  RelatedLinks,
  ServiceCards,
  industryIcons,
  serviceIcons,
} from "@/components/sections/cards";
import { ArrowLink, CheckList, CtaBanner, FaqList, PageHero } from "@/components/sections/shared";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Card, Section, SectionHeading } from "@/components/ui/section";
import { commercialTerms } from "@/config/packages";
import { site } from "@/config/site";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { getPostById } from "@/lib/blog";
import { blogPaths, href, industryIds, type IndustryId, type ServiceId } from "@/lib/routes";
import { faqJsonLd, organizationJsonLd, serviceJsonLd, type Crumb } from "@/lib/seo";
import { fmt } from "@/lib/utils";

type P = { locale: Locale; messages: Messages };

const home = (p: P): Crumb => ({ name: p.messages.common.nav.home, path: href("home", p.locale) });
const area = { city: site.serviceArea.baseCity, km: site.serviceArea.onSiteRadiusKm };

/* ------------------------------ Services ------------------------------ */

export function ServicesPage({ locale, messages }: P) {
  const o = messages.services.overview;
  const c = messages.common;
  return (
    <>
      <PageHero crumbs={[home({ locale, messages }), { name: c.nav.services, path: href("services", locale) }]} breadcrumbLabel={c.labels.breadcrumbs} eyebrow={o.eyebrow} title={o.title} intro={o.intro}>
        <ButtonLink href={href("contact", locale)} size="lg">{c.cta.primary}</ButtonLink>
      </PageHero>
      <Section tone="mist">
        <ServiceCards locale={locale} messages={messages} />
      </Section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">{o.agencyTitle}</h2>
            {o.agencyText.map((t) => <p key={t} className="mt-4 text-lg">{t}</p>)}
          </div>
          <div>
            <h2 className="text-3xl">{o.compareTitle}</h2>
            <p className="mt-4">{o.compareIntro}</p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-line" tabIndex={0} role="region" aria-label={o.compareTitle}>
              <table className="w-full min-w-[30rem] border-collapse text-start text-[0.95rem]">
                <thead>
                  <tr className="bg-navy text-white">
                    {o.compare.headers.map((h, i) => (
                      <th key={i} scope="col" className="px-4 py-3 text-start font-display font-bold">{h || <span className="sr-only">{o.compareTitle}</span>}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {o.compare.rows.map((row) => (
                    <tr key={row[0]} className="border-t border-line align-top">
                      <th scope="row" className="px-4 py-3 text-start font-semibold text-ink">{row[0]}</th>
                      <td className="px-4 py-3">{row[1]}</td>
                      <td className="px-4 py-3">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-6"><ArrowLink href={href("packages", locale)}>{c.cta.viewPackages}</ArrowLink></div>
          </div>
        </div>
      </Section>
      <CtaBanner locale={locale} messages={messages} />
    </>
  );
}

export function ServicePage({ locale, messages, id }: P & { id: ServiceId }) {
  const s = messages.services.items[id];
  const l = messages.services.labels;
  const c = messages.common;
  const path = href(`service:${id}`, locale);
  const Icon = serviceIcons[id];
  return (
    <>
      <JsonLd data={[serviceJsonLd({ locale, name: s.name, description: s.meta.description, path, serviceType: s.name }), faqJsonLd(s.faq)]} />
      <PageHero
        crumbs={[home({ locale, messages }), { name: c.nav.services, path: href("services", locale) }, { name: s.name, path }]}
        breadcrumbLabel={c.labels.breadcrumbs}
        eyebrow={c.nav.services}
        title={s.title}
        intro={s.intro}
      >
        <ButtonLink href={href("contact", locale)} size="lg">{c.cta.primary}</ButtonLink>
        <ButtonLink href={href("packages", locale)} size="lg" variant="outlineDark">{c.cta.viewPackages}</ButtonLink>
      </PageHero>

      {/* Direct, quotable definition */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <IconBadge icon={Icon} />
            <h2 className="text-3xl">{s.definitionTitle}</h2>
            <p className="mt-4 text-lg text-ink">{s.definition}</p>
          </div>
          <Card className="self-start bg-mist shadow-none">
            <h2 className="text-xl">{l.forWhom}</h2>
            <div className="mt-4"><CheckList items={s.forWhom} /></div>
          </Card>
        </div>
      </Section>

      <Section tone="mist">
        <SectionHeading title={l.includes} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {s.includes.map((item) => (
            <li key={item.title}>
              <Card className="h-full">
                <h3 className="text-lg">{item.title}</h3>
                <p className="mt-2 text-[0.95rem]">{item.text}</p>
              </Card>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl">{l.partOfPackages}</p>
      </Section>

      <Section>
        <SectionHeading title={l.howItWorks} />
        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {s.howItWorks.map((step, i) => (
            <li key={step.title} className="rounded-2xl border border-line p-6">
              <span className="bg-brand-gradient mb-4 grid size-10 place-items-center rounded-full font-display font-extrabold text-navy" aria-hidden="true">{i + 1}</span>
              <h3 className="text-lg">{step.title}</h3>
              <p className="mt-2 text-[0.95rem]">{step.text}</p>
            </li>
          ))}
        </ol>
        <div className="mt-8"><ArrowLink href={href("process", locale)}>{c.cta.viewProcess}</ArrowLink></div>
      </Section>

      <Section tone="mist">
        <div className="mx-auto max-w-3xl">
          <SectionHeading title={l.faq} />
          <FaqList items={s.faq} />
        </div>
      </Section>

      <Section>
        <SectionHeading title={l.otherServices} />
        <ServiceCards locale={locale} messages={messages} exclude={id} />
      </Section>
      <CtaBanner locale={locale} messages={messages} />
    </>
  );
}

/* ------------------------------ Industries ------------------------------ */

export function IndustriesPage({ locale, messages }: P) {
  const o = messages.industries.overview;
  const c = messages.common;
  return (
    <>
      <PageHero crumbs={[home({ locale, messages }), { name: c.nav.industries, path: href("industries", locale) }]} breadcrumbLabel={c.labels.breadcrumbs} eyebrow={o.eyebrow} title={o.title} intro={o.intro}>
        <ButtonLink href={href("contact", locale)} size="lg">{c.cta.primary}</ButtonLink>
      </PageHero>
      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {industryIds.map((id) => {
            const it = messages.industries.items[id];
            return (
              <li key={id}>
                <article className="relative flex h-full flex-col rounded-2xl border border-line bg-white p-7 shadow-card transition hover:border-turquoise">
                  <IconBadge icon={industryIcons[id]} />
                  <h2 className="text-2xl">
                    <Link href={href(`industry:${id}`, locale)} className="after:absolute after:inset-0 after:rounded-2xl">{it.name}</Link>
                  </h2>
                  <p className="mt-3 flex-1">{it.short}</p>
                  <span className="mt-5 font-display text-sm font-bold text-teal-ink" aria-hidden="true">{c.cta.learnMore} <span className="rtl-flip inline-block">→</span></span>
                </article>
              </li>
            );
          })}
        </ul>
        <Card className="mt-10 bg-mist shadow-none">
          <h2 className="text-xl">{o.noteTitle}</h2>
          <p className="mt-2 max-w-3xl">{o.noteText}</p>
          <div className="mt-2"><ArrowLink href={href("contact", locale)}>{c.cta.contactUs}</ArrowLink></div>
        </Card>
      </Section>
      <CtaBanner locale={locale} messages={messages} />
    </>
  );
}

export function IndustryPage({ locale, messages, id }: P & { id: IndustryId }) {
  const it = messages.industries.items[id];
  const l = messages.industries.labels;
  const c = messages.common;
  const path = href(`industry:${id}`, locale);
  const related = getPostById(locale, it.relatedPost);
  return (
    <>
      <JsonLd data={faqJsonLd(it.faq)} />
      <PageHero
        crumbs={[home({ locale, messages }), { name: c.nav.industries, path: href("industries", locale) }, { name: it.name, path }]}
        breadcrumbLabel={c.labels.breadcrumbs}
        eyebrow={c.nav.industries}
        title={it.title}
        intro={it.intro}
      >
        <ButtonLink href={href("contact", locale)} size="lg">{c.cta.primary}</ButtonLink>
      </PageHero>

      <Section>
        <SectionHeading title={l.challenges} />
        <ul className="grid gap-5 md:grid-cols-3">
          {it.challenges.map((ch) => (
            <li key={ch.title}><Card className="h-full"><h3 className="text-lg">{ch.title}</h3><p className="mt-2 text-[0.95rem]">{ch.text}</p></Card></li>
          ))}
        </ul>
      </Section>

      <Section tone="mist">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">{l.ideas}</h2>
            <div className="mt-6"><CheckList items={it.ideas} /></div>
            <p className="mt-6 text-sm">{l.ideasNote}</p>
          </div>
          <div>
            <h2 className="text-3xl">{l.approach}</h2>
            <ul className="mt-6 space-y-4">
              {it.approach.map((a) => (
                <li key={a.title}><Card><h3 className="text-lg">{a.title}</h3><p className="mt-2 text-[0.95rem]">{a.text}</p></Card></li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <SectionHeading title={l.faq} />
            <FaqList items={it.faq} />
          </div>
          <div className="space-y-5 self-start">
            <RelatedLinks
              title={c.labels.relatedServices}
              links={(["reels-video-production", "content-creation", "social-media-management"] as const).map((s) => ({ href: href(`service:${s}`, locale), label: messages.services.items[s].name }))}
            />
            {related ? <RelatedLinks title={c.labels.relatedArticles} links={[{ href: blogPaths.post(locale, related.slug), label: related.title }]} /> : null}
          </div>
        </div>
      </Section>

      <Section tone="navy">
        <SectionHeading dark title={l.otherIndustries} />
        <IndustryCards locale={locale} messages={messages} exclude={id} />
      </Section>
      <CtaBanner locale={locale} messages={messages} />
    </>
  );
}

/* ------------------------------ Portfolio / About / Process ------------------------------ */

export function PortfolioPage({ locale, messages }: P) {
  const p = messages.pages.portfolio;
  const c = messages.common;
  return (
    <>
      <PageHero crumbs={[home({ locale, messages }), { name: c.nav.portfolio, path: href("portfolio", locale) }]} breadcrumbLabel={c.labels.breadcrumbs} eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <Section>
        <div role="note" className="mb-10 rounded-2xl border border-violet/30 bg-violet/5 p-6">
          <h2 className="text-lg">{p.disclaimerTitle}</h2>
          <p className="mt-2 max-w-4xl">{p.disclaimer}</p>
        </div>
        <PortfolioGrid messages={messages} detailed />
      </Section>
      <CtaBanner locale={locale} messages={messages} />
    </>
  );
}

export function AboutPage({ locale, messages }: P) {
  const a = messages.pages.about;
  const c = messages.common;
  const facts = [a.facts.what, a.facts.who, a.facts.base, { ...a.facts.area, value: fmt(a.facts.area.value, area) }, a.facts.platforms];
  return (
    <>
      <JsonLd data={organizationJsonLd(locale, c.meta.siteDescription)} />
      <PageHero crumbs={[home({ locale, messages }), { name: c.nav.about, path: href("about", locale) }]} breadcrumbLabel={c.labels.breadcrumbs} eyebrow={a.eyebrow} title={a.title} intro={a.intro} />
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <h2 className="text-3xl">{a.storyTitle}</h2>
            {a.story.map((t) => <p key={t} className="mt-4 text-lg">{t}</p>)}
          </div>
          <Card className="self-start bg-mist shadow-none">
            <h2 className="text-xl">{a.factsTitle}</h2>
            <dl className="mt-4 space-y-4">
              {facts.map((f) => (
                <div key={f.label}>
                  <dt className="text-sm font-semibold text-teal-ink">{f.label}</dt>
                  <dd className="text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>
      </Section>
      <Section tone="mist">
        <SectionHeading title={a.valuesTitle} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {a.values.map((v) => (
            <li key={v.title}><Card className="h-full"><h3 className="text-lg">{v.title}</h3><p className="mt-2 text-[0.95rem]">{v.text}</p></Card></li>
          ))}
        </ul>
      </Section>
      <Section>
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Operator details are shown only once supplied in src/config/site.ts — never invented. */}
          {site.owner ? (
            <div>
              <h2 className="text-3xl">{a.teamTitle}</h2>
              <p className="mt-4 text-lg text-ink">{site.owner.name}</p>
              <p>{site.owner.role}</p>
            </div>
          ) : null}
          <div>
            <h2 className="text-3xl">{a.languagesTitle}</h2>
            <p className="mt-4 text-lg">{a.languagesText}</p>
          </div>
        </div>
      </Section>
      <CtaBanner locale={locale} messages={messages} />
    </>
  );
}

export function ProcessPage({ locale, messages }: P) {
  const p = messages.pages.process;
  const c = messages.common;
  return (
    <>
      <PageHero crumbs={[home({ locale, messages }), { name: c.nav.process, path: href("process", locale) }]} breadcrumbLabel={c.labels.breadcrumbs} eyebrow={p.eyebrow} title={p.title} intro={p.intro}>
        <ButtonLink href={href("contact", locale)} size="lg">{c.cta.primary}</ButtonLink>
      </PageHero>
      <Section tone="mist"><ProcessSteps messages={messages} detailed /></Section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            <h2 className="text-3xl">{p.onsiteTitle}</h2>
            <ol className="mt-6 space-y-4">
              {p.onsite.map((s) => (
                <li key={s.title}><Card><h3 className="text-lg">{s.title}</h3><p className="mt-2 text-[0.95rem]">{s.text}</p></Card></li>
              ))}
            </ol>
            <p className="mt-6 flex items-start gap-2"><MapPin className="mt-1 size-4.5 shrink-0 text-teal-ink" aria-hidden="true" />{fmt(messages.home.onsite.areaText, area)}</p>
          </div>
          <Card className="self-start bg-mist shadow-none">
            <h2 className="text-xl">{p.yourPartTitle}</h2>
            <div className="mt-4"><CheckList items={p.yourPart} /></div>
          </Card>
        </div>
      </Section>
      <CtaBanner locale={locale} messages={messages} />
    </>
  );
}

/* ------------------------------ Packages / FAQ / Contact ------------------------------ */

export function PackagesPage({ locale, messages }: P) {
  const p = messages.pages.packages;
  const c = messages.common;
  const costPost = getPostById(locale, "social-media-management-cost");
  const t = p.terms;
  const terms = [
    { label: t.term.label, value: commercialTerms.minimumTermMonths === null ? t.term.fallback : fmt(t.term.value, { months: commercialTerms.minimumTermMonths }) },
    { label: t.travel.label, value: commercialTerms.travelIncludedKm === null ? t.travel.fallback : fmt(t.travel.value, { km: commercialTerms.travelIncludedKm, city: site.serviceArea.baseCity }) },
    { label: t.billing.label, value: t.billing.value },
    { label: t.rights.label, value: t.rights.value },
  ];
  return (
    <>
      <JsonLd data={faqJsonLd(p.faq)} />
      <PageHero crumbs={[home({ locale, messages }), { name: c.nav.packages, path: href("packages", locale) }]} breadcrumbLabel={c.labels.breadcrumbs} eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <Section tone="mist">
        <PackageCards locale={locale} messages={messages} headingLevel="h2" />
        <p className="mx-auto mt-8 max-w-3xl text-center">{p.priceNote}</p>
      </Section>
      <Section>
        <SectionHeading title={p.compareTitle} />
        <PackageCompareTable locale={locale} messages={messages} />
      </Section>
      <Section tone="mist">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">{p.termsTitle}</h2>
            <dl className="mt-6 space-y-5">
              {terms.map((term) => (
                <div key={term.label}><dt className="font-display font-bold text-ink">{term.label}</dt><dd className="mt-1">{term.value}</dd></div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-3xl">{p.addonsTitle}</h2>
            <p className="mt-3">{p.addonsIntro}</p>
            <ul className="mt-6 grid gap-4 sm:grid-cols-2">
              {commercialTerms.addons.map((id) => (
                <li key={id}><Card className="h-full p-5 sm:p-5"><h3 className="text-base">{p.addons[id].title}</h3><p className="mt-1.5 text-sm">{p.addons[id].text}</p></Card></li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl">{p.explainerTitle}</h2>
            {p.explainer.map((e) => <p key={e} className="mt-4">{e}</p>)}
            {costPost ? <div className="mt-4"><ArrowLink href={blogPaths.post(locale, costPost.slug)}>{p.explainerLink}</ArrowLink></div> : null}
          </div>
          <div>
            <h2 className="mb-6 text-3xl">{c.labels.faqTitle}</h2>
            <FaqList items={p.faq} />
          </div>
        </div>
      </Section>
      <CtaBanner locale={locale} messages={messages} />
    </>
  );
}

export function FaqPage({ locale, messages }: P) {
  const f = messages.pages.faq;
  const c = messages.common;
  return (
    <>
      <JsonLd data={faqJsonLd(f.groups.flatMap((g) => g.items))} />
      <PageHero crumbs={[home({ locale, messages }), { name: c.nav.faq, path: href("faq", locale) }]} breadcrumbLabel={c.labels.breadcrumbs} eyebrow={f.eyebrow} title={f.title} intro={f.intro} />
      <Section tone="mist">
        <div className="mx-auto max-w-3xl space-y-12">
          {f.groups.map((g) => (
            <section key={g.title}>
              <h2 className="mb-5 text-2xl">{g.title}</h2>
              <FaqList items={g.items} />
            </section>
          ))}
        </div>
      </Section>
      <CtaBanner locale={locale} messages={messages} />
    </>
  );
}

export function ContactPage({ locale, messages }: P) {
  const p = messages.pages.contact;
  const c = messages.common;
  return (
    <>
      <PageHero crumbs={[home({ locale, messages }), { name: c.nav.contact, path: href("contact", locale) }]} breadcrumbLabel={c.labels.breadcrumbs} eyebrow={p.eyebrow} title={p.title} intro={p.intro} />
      <Section tone="mist">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <Card className="sm:p-9">
            <h2 className="text-2xl">{c.form.title}</h2>
            <p className="mt-2 mb-6">{c.form.intro}</p>
            <ContactFormLoader t={c.form} locale={locale} privacyHref={href("privacy", locale)} fallbackEmail={site.contact.email} />
          </Card>
          <div className="space-y-6 self-start">
            <Card>
              <h2 className="text-xl">{p.nextTitle}</h2>
              <ol className="mt-5 space-y-5">
                {p.next.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="bg-brand-gradient grid size-9 shrink-0 place-items-center rounded-full font-display font-extrabold text-navy" aria-hidden="true">{i + 1}</span>
                    <div><h3 className="text-base">{s.title}</h3><p className="mt-1 text-sm">{s.text}</p></div>
                  </li>
                ))}
              </ol>
            </Card>
            <Card>
              <h2 className="text-xl">{p.directTitle}</h2>
              <ul className="mt-4 space-y-3 text-[0.95rem]">
                {site.contact.email ? (
                  <li className="flex items-center gap-3"><Mail className="size-4.5 shrink-0 text-teal-ink" aria-hidden="true" /><span className="sr-only">{p.emailLabel}: </span><a href={`mailto:${site.contact.email}`} dir="ltr" className="ltr-isolate font-medium text-ink underline underline-offset-4">{site.contact.email}</a></li>
                ) : null}
                {site.contact.phone ? (
                  <li className="flex items-center gap-3"><Phone className="size-4.5 shrink-0 text-teal-ink" aria-hidden="true" /><span className="sr-only">{p.phoneLabel}: </span><a href={`tel:${site.contact.phone}`} dir="ltr" className="ltr-isolate font-medium text-ink underline underline-offset-4">{site.contact.phone}</a></li>
                ) : null}
                <li className="flex items-start gap-3"><MapPin className="mt-1 size-4.5 shrink-0 text-teal-ink" aria-hidden="true" /><span><span className="sr-only">{p.areaLabel}: </span>{fmt(p.areaText, area)}</span></li>
              </ul>
              {!site.confirmedServiceLanguages.includes(locale) ? <p className="mt-4 border-t border-line pt-4 text-sm">{c.notices.serviceLanguage}</p> : null}
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}

