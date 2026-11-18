import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/messages";
import type { Alternates } from "@/lib/routes";
import { Footer } from "./footer";
import { Header, type NavSection } from "./header";

/** Header + main + footer. Every page passes its own language alternates so the switcher links to the equivalent page. */
export function PageShell({
  locale,
  messages,
  alternates,
  section = null,
  children,
}: {
  locale: Locale;
  messages: Messages;
  alternates: Alternates;
  section?: NavSection;
  children: ReactNode;
}) {
  return (
    <>
      <Header locale={locale} messages={messages} alternates={alternates} section={section} />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer locale={locale} messages={messages} />
    </>
  );
}
