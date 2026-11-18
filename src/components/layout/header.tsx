import Link from "next/link";
import { ButtonLink } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { localeConfig, locales, type Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { href, serviceIds, type Alternates, type StaticPageId } from "@/lib/routes";
import { LanguageSwitcher, type LanguageOption } from "./language-switcher";
import { MobileMenu, type MobileLink } from "./mobile-menu";

export type NavSection = "services" | "industries" | "portfolio" | "packages" | "blog" | "about" | "process" | "faq" | "contact" | null;

export function Header({ locale, messages, alternates, section }: { locale: Locale; messages: Messages; alternates: Alternates; section: NavSection }) {
  const t = messages.common.nav;
  const desktop: { id: StaticPageId; label: string; key: NavSection }[] = [
    { id: "services", label: t.services, key: "services" },
    { id: "industries", label: t.industries, key: "industries" },
    { id: "portfolio", label: t.portfolio, key: "portfolio" },
    { id: "packages", label: t.packages, key: "packages" },
    { id: "blog", label: t.blog, key: "blog" },
    { id: "about", label: t.about, key: "about" },
  ];
  const mobile: MobileLink[] = [
    {
      href: href("services", locale),
      label: t.services,
      current: section === "services",
      children: serviceIds.map((id) => ({ href: href(`service:${id}`, locale), label: messages.services.items[id].name })),
    },
    { href: href("industries", locale), label: t.industries, current: section === "industries" },
    { href: href("portfolio", locale), label: t.portfolio, current: section === "portfolio" },
    { href: href("process", locale), label: t.process, current: section === "process" },
    { href: href("packages", locale), label: t.packages, current: section === "packages" },
    { href: href("blog", locale), label: t.blog, current: section === "blog" },
    { href: href("about", locale), label: t.about, current: section === "about" },
    { href: href("faq", locale), label: t.faq, current: section === "faq" },
    { href: href("contact", locale), label: t.contact, current: section === "contact" },
  ];
  // Equivalent page if a translation exists, otherwise that language's home page.
  const options: LanguageOption[] = locales.map((l) => ({
    locale: l,
    hreflang: localeConfig[l].hreflang,
    nativeName: localeConfig[l].nativeName,
    dir: localeConfig[l].dir,
    href: alternates[l] ?? href("home", l),
  }));

  return (
    <header className="on-dark sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-3 focus:z-50 focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
      >
        {t.skipToContent}
      </a>
      <div className="container-page flex h-18 items-center justify-between gap-4">
        <Link href={href("home", locale)} aria-label={t.homeLinkLabel} className="shrink-0 rounded-lg">
          <Logo eager />
        </Link>
        <nav aria-label={t.mainLabel} className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {desktop.map((item) => (
              <li key={item.id}>
                <Link
                  href={href(item.id, locale)}
                  aria-current={section === item.key ? "page" : undefined}
                  className="flex min-h-11 items-center rounded-full px-3 text-sm font-medium text-white/85 transition hover:text-white aria-[current=page]:text-aqua xl:px-4"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <LanguageSwitcher options={options} current={locale} label={t.languageLabel} />
          </div>
          <ButtonLink href={href("contact", locale)} className="hidden md:inline-flex">
            {messages.common.cta.primary}
          </ButtonLink>
          <MobileMenu
            links={mobile}
            labels={{ open: t.openMenu, close: t.closeMenu, nav: t.mobileLabel }}
            cta={{ href: href("contact", locale), label: messages.common.cta.primary }}
            languageSlot={<LanguageSwitcher options={options} current={locale} label={t.languageLabel} variant="inline" />}
          />
        </div>
      </div>
    </header>
  );
}
