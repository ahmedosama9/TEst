import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
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
  const fonts = `${inter.variable} ${montserrat.variable}`;

  return (
    <html lang={cfg.htmlLang} dir={cfg.dir} className={fonts}>
      <head>
        {cfg.script === "arabic" ? (
          <link rel="preload" href="/fonts/noto-sans-arabic.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        ) : null}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col">{children}</body>
    </html>
  );
}
