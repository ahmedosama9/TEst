import { getLocale } from "next-intl/server";
import { PageShell } from "@/components/layout/page-shell";
import { ButtonLink } from "@/components/ui/button";
import { defaultLocale, isLocale } from "@/i18n/config";
import { loadMessages } from "@/i18n/messages";
import { href, staticAlternates } from "@/lib/routes";

export default async function NotFound() {
  const current = await getLocale();
  const locale = isLocale(current) ? current : defaultLocale;
  const messages = await loadMessages(locale);
  const c = messages.common;
  return (
    <PageShell locale={locale} messages={messages} alternates={staticAlternates("home")}>
      <section className="on-dark hero-backdrop text-soft">
        <div className="container-page py-24 text-center sm:py-32">
          <p className="text-gradient font-display text-7xl font-extrabold" aria-hidden="true">404</p>
          <h1 className="mt-4 text-3xl text-white sm:text-4xl">{c.errors.notFoundTitle}</h1>
          <p className="mx-auto mt-4 max-w-xl text-lg">{c.errors.notFoundText}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <ButtonLink href={href("home", locale)} size="lg">{c.cta.backHome}</ButtonLink>
            <ButtonLink href={href("blog", locale)} size="lg" variant="outlineDark">{c.nav.blog}</ButtonLink>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
