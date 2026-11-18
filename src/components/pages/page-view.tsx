import type { NavSection } from "@/components/layout/header";
import { PageShell } from "@/components/layout/page-shell";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import { alternatesOf, type Resolved } from "@/lib/pages";
import type { IndustryId, ServiceId } from "@/lib/routes";
import { BlogAuthorPage, BlogCategoryPage, BlogIndexPage, BlogPostPage } from "./blog";
import { HomePage } from "./home";
import { AboutPage, ContactPage, FaqPage, IndustriesPage, IndustryPage, PackagesPage, PortfolioPage, ProcessPage, ServicePage, ServicesPage } from "./inner";
import { CookiesPage, ImprintPage, PrivacyPage } from "./legal";

function sectionOf(page: Resolved): NavSection {
  if (page.kind !== "static") return "blog";
  const id = page.id;
  if (id === "services" || id.startsWith("service:")) return "services";
  if (id === "industries" || id.startsWith("industry:")) return "industries";
  if (id === "home" || id === "imprint" || id === "privacy" || id === "cookies") return null;
  return id as NavSection;
}

function Content({ locale, page, messages }: { locale: Locale; page: Resolved; messages: Messages }) {
  const p = { locale, messages };
  switch (page.kind) {
    case "blogPage":
      return <BlogIndexPage {...p} page={page.page} />;
    case "category":
      return <BlogCategoryPage {...p} category={page.category} />;
    case "author":
      return <BlogAuthorPage {...p} author={page.author} />;
    case "post":
      return <BlogPostPage {...p} post={page.post} />;
  }
  const id = page.id;
  if (id.startsWith("service:")) return <ServicePage {...p} id={id.slice(8) as ServiceId} />;
  if (id.startsWith("industry:")) return <IndustryPage {...p} id={id.slice(9) as IndustryId} />;
  switch (id) {
    case "home": return <HomePage {...p} />;
    case "services": return <ServicesPage {...p} />;
    case "industries": return <IndustriesPage {...p} />;
    case "portfolio": return <PortfolioPage {...p} />;
    case "about": return <AboutPage {...p} />;
    case "process": return <ProcessPage {...p} />;
    case "packages": return <PackagesPage {...p} />;
    case "faq": return <FaqPage {...p} />;
    case "contact": return <ContactPage {...p} />;
    case "blog": return <BlogIndexPage {...p} page={1} />;
    case "imprint": return <ImprintPage {...p} />;
    case "privacy": return <PrivacyPage {...p} />;
    case "cookies": return <CookiesPage {...p} />;
  }
  return null;
}

export function PageView({ locale, page, messages }: { locale: Locale; page: Resolved; messages: Messages }) {
  return (
    <PageShell locale={locale} messages={messages} alternates={alternatesOf(page)} section={sectionOf(page)}>
      <Content locale={locale} page={page} messages={messages} />
    </PageShell>
  );
}
