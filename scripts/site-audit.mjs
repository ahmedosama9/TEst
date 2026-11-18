// Crawls a running build (default http://localhost:3000) starting from the sitemap and checks,
// for every page: status, <html lang/dir>, unique title + description, self-referencing canonical,
// reciprocal hreflang (+ x-default), valid JSON-LD, single <h1>, image alts, internal links,
// leftover placeholders. Usage: npm run build && npm start &  →  npm run audit:site [baseUrl]
import { parse } from "node-html-parser";

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const ORIGIN = "https://socialmediakomplett.de";
const LANG = { de: ["de-DE", "ltr"], en: ["en", "ltr"], ar: ["ar", "rtl"], ku: ["ku", "ltr"], tr: ["tr-TR", "ltr"] };
const errors = [];
const warn = [];
const err = (url, msg) => errors.push(`${url}  ${msg}`);
const toLocal = (u) => u.replace(ORIGIN, base);

const sitemapXml = await (await fetch(`${base}/sitemap.xml`)).text();
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (!urls.length) { console.error("Sitemap is empty – was the build made with NEXT_PUBLIC_ALLOW_INDEXING=true?"); process.exit(1); }

const pages = new Map(); // canonical url → data
const internalLinks = new Set();
const titles = new Map();
const descriptions = new Map();

async function inspect(url) {
  const res = await fetch(toLocal(url), { redirect: "manual" });
  if (res.status !== 200) return err(url, `status ${res.status}`);
  const html = await res.text();
  const root = parse(html);
  const locale = new URL(url).pathname.split("/")[1];
  const htmlEl = root.querySelector("html");
  const [lang, dir] = LANG[locale] ?? [];
  if (htmlEl?.getAttribute("lang") !== lang) err(url, `html lang="${htmlEl?.getAttribute("lang")}" expected "${lang}"`);
  if (htmlEl?.getAttribute("dir") !== dir) err(url, `html dir="${htmlEl?.getAttribute("dir")}" expected "${dir}"`);

  const title = root.querySelector("title")?.text.trim() ?? "";
  const desc = root.querySelector('meta[name="description"]')?.getAttribute("content")?.trim() ?? "";
  if (!title) err(url, "missing <title>");
  if (!desc) err(url, "missing meta description");
  if (title.length > 70) warn.push(`${url}  title is ${title.length} chars`);
  if (desc.length > 170 || desc.length < 70) warn.push(`${url}  description is ${desc.length} chars`);
  titles.has(title) ? err(url, `duplicate title (also ${titles.get(title)})`) : titles.set(title, url);
  descriptions.has(desc) ? err(url, `duplicate description (also ${descriptions.get(desc)})`) : descriptions.set(desc, url);

  const canonical = root.querySelector('link[rel="canonical"]')?.getAttribute("href");
  if (canonical !== url) err(url, `canonical "${canonical}" is not self-referencing`);
  const robots = root.querySelector('meta[name="robots"]')?.getAttribute("content") ?? "";
  if (/noindex/.test(robots)) err(url, "page in sitemap is noindex");

  const alternates = Object.fromEntries(root.querySelectorAll('link[rel="alternate"][hreflang]').map((l) => [l.getAttribute("hreflang"), l.getAttribute("href")]));
  if (alternates[locale] !== url) err(url, `hreflang "${locale}" does not point to itself`);
  if (!alternates["x-default"]) err(url, "missing x-default");
  for (const k of ["og:title", "og:description", "og:url", "og:image", "og:locale"]) {
    if (!root.querySelector(`meta[property="${k}"]`)?.getAttribute("content")) err(url, `missing ${k}`);
  }

  const h1 = root.querySelectorAll("h1");
  if (h1.length !== 1) err(url, `${h1.length} <h1> elements`);
  for (const img of root.querySelectorAll("img")) if (img.getAttribute("alt") === undefined) err(url, "img without alt");

  const types = [];
  for (const s of root.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      for (const node of [JSON.parse(s.text)].flat()) {
        if (node["@context"] !== "https://schema.org" || !node["@type"]) err(url, "JSON-LD without @context/@type");
        types.push([node["@type"]].flat().join("+"));
        if (node["@type"] === "BreadcrumbList" && !node.itemListElement?.every((i) => i.item?.startsWith(ORIGIN) && i.name)) err(url, "invalid BreadcrumbList");
        if (node["@type"] === "FAQPage" && !node.mainEntity?.every((q) => q.name && q.acceptedAnswer?.text && html.includes(q.name.replace(/&/g, "&amp;").slice(0, 25)))) err(url, "FAQPage question not visible on page");
        if (node["@type"] === "BlogPosting" && !(node.headline && node.datePublished && node.dateModified && node.author && node.publisher)) err(url, "incomplete BlogPosting");
      }
    } catch (e) { err(url, `invalid JSON-LD: ${e.message}`); }
  }
  if (!types.includes("BreadcrumbList") && new URL(url).pathname.split("/").length > 2) err(url, "missing BreadcrumbList");

  // Placeholders must never be indexed.
  const text = root.querySelector("main")?.text ?? "";
  for (const p of [/lorem ipsum/i, /\bTODO\b/, /\{[a-z]+\}/, /undefined|\[object Object\]/]) if (p.test(text)) err(url, `placeholder text matches ${p}`);

  for (const a of root.querySelectorAll("a[href]")) {
    const h = a.getAttribute("href");
    if (h.startsWith("/") && !h.startsWith("//")) internalLinks.add(h.split("#")[0]);
    if (/^(page|post):/.test(h)) err(url, `unresolved content link ${h}`);
  }
  pages.set(url, { alternates, types });
}

// small concurrency pool
const queue = [...urls];
await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) await inspect(queue.shift()); }));

// Reciprocal hreflang: every alternate must exist in the sitemap and link back with the same set.
for (const [url, { alternates }] of pages) {
  for (const [lang, target] of Object.entries(alternates)) {
    if (lang === "x-default") continue;
    const other = pages.get(target);
    if (!other) { err(url, `hreflang ${lang} → ${target} is not in the sitemap`); continue; }
    if (JSON.stringify(other.alternates) !== JSON.stringify(alternates)) err(url, `hreflang set is not reciprocal with ${target}`);
  }
}

// Every internal link must resolve (200), and indexable targets must be in the sitemap or be legal pages.
const known = new Set(urls.map((u) => new URL(u).pathname));
let checked = 0;
const linkQueue = [...internalLinks];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (linkQueue.length) {
    const path = linkQueue.shift();
    checked++;
    if (known.has(path)) continue;
    const res = await fetch(base + path, { redirect: "manual" });
    if (res.status !== 200) errors.push(`broken internal link ${path} (status ${res.status})`);
  }
}));

// 404 handling and root redirect
const nf = await fetch(`${base}/de/diese-seite-gibt-es-nicht`);
if (nf.status !== 404) errors.push(`unknown URL returns ${nf.status}, expected 404`);
if (!/noindex/.test(await nf.text())) errors.push("404 page is not noindex");
const root = await fetch(`${base}/`, { redirect: "manual" });
if (![307, 308, 302].includes(root.status) || !root.headers.get("location")?.endsWith("/de")) errors.push(`root does not redirect to /de (status ${root.status}, location ${root.headers.get("location")})`);
const rootCookie = await fetch(`${base}/`, { redirect: "manual", headers: { cookie: "smk_locale=tr" } });
if (!rootCookie.headers.get("location")?.endsWith("/tr")) errors.push("root ignores the explicit language cookie");
const direct = await fetch(`${base}/en`, { redirect: "manual", headers: { cookie: "smk_locale=tr", "accept-language": "de" } });
if (direct.status !== 200) errors.push("direct language URL was redirected");
const robots = await (await fetch(`${base}/robots.txt`)).text();
if (!/Sitemap: https:\/\/socialmediakomplett\.de\/sitemap\.xml/.test(robots)) errors.push("robots.txt has no sitemap reference");

const typeCount = {};
for (const { types } of pages.values()) for (const t of types) typeCount[t] = (typeCount[t] ?? 0) + 1;
const perLocale = {};
for (const u of urls) { const l = new URL(u).pathname.split("/")[1]; perLocale[l] = (perLocale[l] ?? 0) + 1; }
console.log(`Pages in sitemap: ${urls.length}`, perLocale);
console.log(`Internal links checked: ${checked}`);
console.log("JSON-LD types:", typeCount);
if (warn.length) console.log(`\nWarnings (${warn.length}):\n` + warn.map((w) => "  " + w).join("\n"));
if (errors.length) { console.error(`\n✖ ${errors.length} error(s):\n` + errors.map((e) => "  " + e).join("\n")); process.exit(1); }
console.log("\n✔ Site audit passed: status, lang/dir, unique titles/descriptions, canonicals, reciprocal hreflang, JSON-LD, links, 404, root redirect.");
