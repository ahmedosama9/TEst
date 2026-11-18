import type { Locale } from "./config";
import type common from "../../messages/de/common.json";
import type home from "../../messages/de/home.json";
import type services from "../../messages/de/services.json";
import type industries from "../../messages/de/industries.json";
import type pages from "../../messages/de/pages.json";
import type legal from "../../messages/de/legal.json";

/** German is the source of truth for the message shape (checked by `npm run check:i18n`). */
export type Messages = {
  common: typeof common;
  home: typeof home;
  services: typeof services;
  industries: typeof industries;
  pages: typeof pages;
  legal: typeof legal;
};

export const namespaces = ["common", "home", "services", "industries", "pages", "legal"] as const;

export async function loadMessages(locale: Locale): Promise<Messages> {
  const entries = await Promise.all(
    namespaces.map(async (ns) => [ns, (await import(`../../messages/${locale}/${ns}.json`)).default] as const),
  );
  return Object.fromEntries(entries) as unknown as Messages;
}
