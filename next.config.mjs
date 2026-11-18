import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Plain JavaScript on purpose: hosts whose build servers cannot load Next.js's native compiler
// (older glibc, e.g. Hostinger) fail to transpile a TypeScript config file.
// Keep in sync with src/i18n/config.ts.
const NON_DEFAULT_LOCALES = ["en", "ar", "ku", "tr"];
const LOCALE_COOKIE = "smk_locale";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
];

/** @type {import("next").NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"], qualities: [75, 85] },
  // Blog content is read from disk; make sure it ships with on-demand (404/ISR) renders too.
  outputFileTracingIncludes: { "/[locale]/[[...path]]": ["./content/**/*"] },
  async redirects() {
    return [
      // Root: honour an explicit language choice (cookie set only by the language switcher) …
      ...NON_DEFAULT_LOCALES.map((locale) => ({
        source: "/",
        has: [{ type: "cookie", key: LOCALE_COOKIE, value: locale }],
        destination: `/${locale}`,
        permanent: false,
      })),
      // … otherwise always German. No Accept-Language sniffing, so crawlers and users
      // can open every language URL directly.
      { source: "/", destination: "/de", permanent: false },
    ];
  },
  async headers() {
    return [
      { source: "/:path*", headers: securityHeaders },
      { source: "/fonts/:file*", headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }] },
    ];
  },
};

export default withNextIntl(nextConfig);
