import { TriangleAlert } from "lucide-react";
import { ConsentSettings } from "@/components/forms/consent-settings";
import { PageHero } from "@/components/sections/shared";
import { Section } from "@/components/ui/section";
import { site } from "@/config/site";
import { defaultLocale, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { href, type StaticPageId } from "@/lib/routes";

type P = { locale: Locale; messages: Messages };

function LegalShell({ locale, messages, id, title, intro, children }: P & { id: StaticPageId; title: string; intro?: string; children: React.ReactNode }) {
  const c = messages.common;
  return (
    <>
      <PageHero crumbs={[{ name: c.nav.home, path: href("home", locale) }, { name: title, path: href(id, locale) }]} breadcrumbLabel={c.labels.breadcrumbs} title={title} intro={intro} />
      <Section>
        <div className="mx-auto max-w-3xl">
          {!site.legal.documentsApproved && id !== "cookies" ? (
            <div role="note" className="mb-8 flex items-start gap-3 rounded-xl border border-amber-400 bg-amber-50 p-4 text-sm font-medium text-amber-900">
              <TriangleAlert className="mt-0.5 size-5 shrink-0" aria-hidden="true" />
              <p>{c.notices.legalDraft}</p>
            </div>
          ) : null}
          {locale !== defaultLocale && id !== "cookies" ? <p className="mb-8 text-sm italic">{c.notices.legalGermanBinding}</p> : null}
          <div className="space-y-8 [&_h2]:text-xl [&_p]:mt-2">{children}</div>
        </div>
      </Section>
    </>
  );
}

/** A verified value, or a visible "to be supplied" marker — never an invented one. */
function Fact({ value, missing }: { value: string | null | undefined; missing: string }) {
  return value ? <span className="ltr-isolate" dir="ltr">{value}</span> : <mark className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">[{missing}]</mark>;
}

function ProviderBlock({ messages }: { messages: Messages }) {
  const l = messages.legal.imprint.labels;
  const missing = messages.common.notices.missingDetail;
  return (
    <dl className="mt-3 grid gap-x-6 gap-y-2 sm:grid-cols-[auto_1fr]">
      <dt className="font-semibold text-ink">{l.name}</dt>
      <dd><Fact value={site.legalName} missing={missing} /></dd>
      <dt className="font-semibold text-ink">{l.address}</dt>
      <dd><Fact value={site.address ? `${site.address.street}, ${site.address.postalCode} ${site.address.city}` : null} missing={missing} /></dd>
      <dt className="font-semibold text-ink">{l.email}</dt>
      <dd><Fact value={site.contact.email} missing={missing} /></dd>
      <dt className="font-semibold text-ink">{l.phone}</dt>
      <dd><Fact value={site.contact.phone} missing={missing} /></dd>
    </dl>
  );
}

export function ImprintPage({ locale, messages }: P) {
  const t = messages.legal.imprint;
  const missing = messages.common.notices.missingDetail;
  return (
    <LegalShell locale={locale} messages={messages} id="imprint" title={t.title}>
      <section><h2>{t.providerTitle}</h2><ProviderBlock messages={messages} /></section>
      <section><h2>{t.representedTitle}</h2><p><Fact value={site.owner?.name} missing={missing} /></p></section>
      <section><h2>{t.vatTitle}</h2><p>{t.vatText} <Fact value={site.legal.vatId} missing={missing} /></p></section>
      {site.legal.registerCourt || site.legal.registerNumber ? (
        <section><h2>{t.registerTitle}</h2><p>{t.registerCourt}: {site.legal.registerCourt} · {t.registerNumber}: {site.legal.registerNumber}</p></section>
      ) : null}
      <section><h2>{t.responsibleTitle}</h2><p><Fact value={site.owner?.name} missing={missing} /></p></section>
      <section><h2>{t.disputeTitle}</h2><p>{t.disputeText}</p></section>
      <section><h2>{t.liabilityTitle}</h2><p>{t.liabilityText}</p></section>
      <section><h2>{t.copyrightTitle}</h2><p>{t.copyrightText}</p></section>
    </LegalShell>
  );
}

export function PrivacyPage({ locale, messages }: P) {
  const t = messages.legal.privacy;
  return (
    <LegalShell locale={locale} messages={messages} id="privacy" title={t.title} intro={t.intro}>
      <section><h2>{t.controllerTitle}</h2><p>{t.controllerText}</p><ProviderBlock messages={messages} /></section>
      {t.sections.map((s) => (
        <section key={s.title}>
          <h2>{s.title}</h2>
          {s.paragraphs.map((p) => <p key={p}>{p}</p>)}
        </section>
      ))}
    </LegalShell>
  );
}

export function CookiesPage({ locale, messages }: P) {
  const t = messages.legal.cookies;
  return (
    <LegalShell locale={locale} messages={messages} id="cookies" title={t.title} intro={t.intro}>
      <section>
        <h2>{t.essentialTitle}</h2>
        <p>{t.essentialText}</p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-line" tabIndex={0} role="region" aria-label={t.essentialTitle}>
          <table className="w-full min-w-[32rem] border-collapse text-start text-sm">
            <thead>
              <tr className="bg-mist">
                {[t.tableHeaders.name, t.tableHeaders.purpose, t.tableHeaders.duration, t.tableHeaders.type].map((h) => (
                  <th key={h} scope="col" className="px-4 py-3 text-start font-semibold text-ink">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {t.essentialItems.map((i) => (
                <tr key={i.name} className="border-t border-line align-top">
                  <th scope="row" className="px-4 py-3 text-start font-mono text-xs font-semibold text-ink"><span dir="ltr">{i.name}</span></th>
                  <td className="px-4 py-3">{i.purpose}</td>
                  <td className="px-4 py-3">{i.duration}</td>
                  <td className="px-4 py-3">{i.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <ConsentSettings t={t} />
    </LegalShell>
  );
}
