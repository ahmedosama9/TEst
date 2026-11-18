import type { MetadataRoute } from "next";
import { allowIndexing, site } from "@/config/site";

/**
 * Crawler policy — see docs/SEO.md ("Crawler control") for the options and trade-offs.
 * Default: all public content is open to search engines AND AI search/answer crawlers,
 * because being cited by AI search requires being crawlable. Non-production deployments
 * disallow everything.
 */
export default function robots(): MetadataRoute.Robots {
  if (!allowIndexing) return { rules: [{ userAgent: "*", disallow: "/" }] };
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
