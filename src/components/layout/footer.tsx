import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { site } from "@/config/site";
import { localeConfig, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { href, industryIds, serviceIds, type StaticPageId } from "@/lib/routes";
import { fmt } from "@/lib/utils";

function FooterColumn({ title, links }: { title: string; links: { href: string; label: string }[] }) {
  return (
    <nav aria-label={title}>
      <h2 className="mb-4 font-display text-sm font-bold tracking-wider text-white uppercase">{title}</h2>
      <ul className="space-y-1">
        {links.map((l) => (
          <li key={l.href}>
            <Link href={l.href} className="inline-flex min-h-9 items-center text-sm text-soft hover:text-white">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function Footer({ locale, messages }: { locale: Locale; messages: Messages }) {
  const c = messages.common;
  const cfg = localeConfig[locale];
  const link = (id: StaticPageId, label: string) => ({ href: href(id, locale), label });
  const area = { city: site.serviceArea.baseCity, km: site.serviceArea.onSiteRadiusKm };
  const social = Object.entries(site.social).filter((e): e is [string, string] => !!e[1]);

  return (
    <footer className="on-dark bg-navy text-soft">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Logo className="h-12 sm:h-14" />
          <p className="mt-4 max-w-xs text-sm">{c.footer.description}</p>
          <p className="ltr-isolate mt-4 font-display text-sm font-bold text-aqua" lang="de" dir="ltr">
            {site.tagline}
          </p>
          <p className="mt-4 max-w-xs text-sm">{fmt(c.footer.areaText, area)}</p>
          {site.contact.email ? (
            <p className="mt-3 text-sm">
              <a href={`mailto:${site.contact.email}`} className="ltr-isolate text-white underline-offset-4 hover:underline" dir="ltr">
                {site.contact.email}
              </a>
            </p>
          ) : null}
          {social.length ? (
            <ul aria-label={c.footer.socialLabel} className="mt-4 flex flex-wrap gap-3 text-sm">
              {social.map(([name, url]) => (
                <li key={name}>
                  <a href={url} rel="me noopener" className="capitalize text-white hover:text-aqua">
                    {name}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <FooterColumn title={c.footer.servicesTitle} links={serviceIds.map((id) => link(`service:${id}`, messages.services.items[id].name))} />
        <FooterColumn title={c.footer.industriesTitle} links={industryIds.map((id) => link(`industry:${id}`, messages.industries.items[id].name))} />
        <FooterColumn
          title={c.footer.companyTitle}
          links={[
            link("about", c.nav.about),
            link("process", c.nav.process),
            link("packages", c.nav.packages),
            link("portfolio", c.nav.portfolio),
            link("blog", c.nav.blog),
            link("faq", c.nav.faq),
            link("contact", c.nav.contact),
          ]}
        />
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} <span className="ltr-isolate" dir="ltr">{site.name}</span>. {c.footer.rights}
          </p>
          <nav aria-label={c.footer.legalTitle}>
            <ul className="flex flex-wrap gap-x-5 gap-y-1">
              <li><Link href={href("imprint", locale)} className="inline-flex min-h-9 items-center hover:text-white">{c.footer.imprint}</Link></li>
              <li><Link href={href("privacy", locale)} className="inline-flex min-h-9 items-center hover:text-white">{c.footer.privacy}</Link></li>
              <li><Link href={href("cookies", locale)} className="inline-flex min-h-9 items-center hover:text-white">{c.footer.cookies}</Link></li>
            </ul>
          </nav>
        </div>
        {cfg.reviewStatus === "needs-review" || !site.confirmedServiceLanguages.includes(locale) ? (
          <div className="container-page pb-6 text-xs text-soft/80">
            {cfg.reviewStatus === "needs-review" ? <p>{c.notices.translationReview}</p> : null}
            {!site.confirmedServiceLanguages.includes(locale) ? <p>{c.notices.serviceLanguage}</p> : null}
          </div>
        ) : null}
      </div>
    </footer>
  );
}
