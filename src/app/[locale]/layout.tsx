import type { Metadata, Viewport } from "next";
import { Inter, Montserrat, Noto_Sans_Arabic } from "next/font/google";
import { setRequestLocale } from "next-intl/server";
import { defaultLocale, isLocale, localeConfig, locales } from "@/i18n/config";
import { site } from "@/config/site";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const montserrat = Montserrat({
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
  variable: "--font-montserrat",
  display: "swap",
});
// Loaded for Arabic only (and for a future Sorani locale); never preloaded on Latin pages.
const arabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  icons: { icon: [{ url: "/icon.svg", type: "image/svg+xml" }], apple: "/brand/apple-touch-icon.png" },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = { themeColor: "#0B1026", width: "device-width", initialScale: 1 };

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale: raw } = await params;
  // Unknown first segments fall back to German so the localized 404 page can render.
  const locale = isLocale(raw) ? raw : defaultLocale;
  setRequestLocale(locale);
  const cfg = localeConfig[locale];
  const fonts = [inter.variable, montserrat.variable, cfg.script === "arabic" ? arabic.variable : ""].join(" ");

  return (
    <html lang={cfg.htmlLang} dir={cfg.dir} className={fonts}>
      <head>
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
