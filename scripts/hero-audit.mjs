// Responsive check of the homepage hero in all five languages at eight viewport widths:
// no horizontal scroll, artwork uncropped at its natural aspect ratio on phones/tablets,
// exactly one hero artwork downloaded, no overlap between text/buttons and artwork,
// equal-width CTA buttons on phones, platform logos never mirrored.
// Usage: node scripts/hero-audit.mjs [baseUrl]   (SHOTS_DIR=… also saves screenshots)
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const shots = process.env.SHOTS_DIR;
if (shots) mkdirSync(shots, { recursive: true });
const widths = [320, 360, 375, 390, 430, 768, 1024, 1440];
const locales = ["de", "en", "ar", "ku", "tr"];
const failures = [];
const browser = await chromium.launch();

for (const locale of locales) {
  for (const width of widths) {
    const page = await browser.newPage({ viewport: { width, height: width < 768 ? 800 : 900 }, deviceScaleFactor: 2 });
    const heroRequests = new Set();
    page.on("request", (r) => { const m = /url=%2Fbrand%2F(hero[a-z-]*\.(?:png|jpg))/.exec(r.url()); if (m) heroRequests.add(m[1]); });
    await page.goto(`${base}/${locale}`, { waitUntil: "networkidle" });
    await page.waitForTimeout(500);
    const r = await page.evaluate(() => {
      const box = (el) => el.getBoundingClientRect();
      const section = document.querySelector("main section");
      const h1 = section.querySelector("h1");
      const img = section.querySelector("picture img");
      const art = box(img);
      const buttons = [...section.querySelectorAll("h1 ~ div a")].map(box);
      const text = box(h1.parentElement);
      const strip = box(section.querySelector("ul"));
      const fontSize = parseFloat(getComputedStyle(h1).fontSize);
      return {
        overflow: document.documentElement.scrollWidth - innerWidth,
        sectionH: Math.round(box(section).height),
        h1Lines: Math.round(box(h1).height / parseFloat(getComputedStyle(h1).lineHeight)),
        h1Font: Math.round(fontSize),
        artW: Math.round(art.width), artH: Math.round(art.height), artTop: Math.round(art.top), artLeft: Math.round(art.left),
        current: decodeURIComponent(img.currentSrc), fit: getComputedStyle(img).objectFit,
        transform: getComputedStyle(img).transform + getComputedStyle(img.closest("div")).transform,
        textBottom: Math.round(text.bottom), textRight: Math.round(text.right), textLeft: Math.round(text.left),
        buttonWidths: buttons.map((b) => Math.round(b.width)), buttonTops: buttons.map((b) => Math.round(b.top)),
        gapTextArt: Math.round(art.top - text.bottom), gapArtStrip: Math.round(strip.top - art.bottom),
        dir: getComputedStyle(h1).direction, align: getComputedStyle(h1).textAlign,
      };
    });
    const id = `${locale} ${width}px`;
    const fail = (m) => { failures.push(`${id}: ${m}`); };
    const mobile = width < 1024;
    if (r.overflow > 0) fail(`horizontal overflow ${r.overflow}px`);
    if (heroRequests.size !== 1) fail(`downloaded ${heroRequests.size} hero files: ${[...heroRequests].join(", ")}`);
    const expected = mobile ? "hero-mobile.jpg" : "hero.png";
    if (!heroRequests.has(expected) || !r.current.includes(expected)) fail(`wrong artwork (${[...heroRequests]})`);
    if (!/none/.test(r.transform)) fail("artwork is transformed/mirrored");
    if ((r.dir === "rtl") !== (locale === "ar")) fail(`direction ${r.dir}`);
    if (mobile) {
      if (Math.abs(r.artW - r.artH) > 1 || r.fit !== "contain") fail(`artwork not at natural 1:1 ratio (${r.artW}×${r.artH}, ${r.fit})`);
      if (r.artW > width) fail("artwork wider than viewport");
      if (r.gapTextArt < 0) fail(`text/buttons overlap artwork by ${-r.gapTextArt}px`);
      if (r.gapTextArt > 40) fail(`gap between buttons and artwork is ${r.gapTextArt}px`);
      if (width < 640 && (r.buttonWidths[0] !== r.buttonWidths[1] || r.buttonWidths[0] < width - 60)) fail(`CTA widths ${r.buttonWidths}`);
    } else {
      // phone in the wide artwork starts at 54.7% of the image width
      const phoneLeft = r.artLeft + r.artW * 0.547;
      if (r.textRight > phoneLeft + 4 && locale !== "ar") fail(`text column (${r.textRight}) reaches the phone (${Math.round(phoneLeft)})`);
    }
    console.log(id.padEnd(10), `hero ${String(r.sectionH).padStart(4)}px  h1 ${r.h1Font}px/${r.h1Lines} lines  art ${r.artW}×${r.artH}  gap→art ${mobile ? r.gapTextArt : "–"}  ${[...heroRequests].join(",")}`);
    if (shots) await page.screenshot({ path: `${shots}/${locale}-${width}.png`, fullPage: true, clip: { x: 0, y: 0, width, height: Math.min(r.sectionH + 73, 1700) } });
    await page.close();
  }
}
await browser.close();
if (failures.length) { console.error(`\n✖ ${failures.length} hero check(s) failed:\n  ` + failures.join("\n  ")); process.exit(1); }
console.log(`\n✔ Hero audit passed: ${locales.length} languages × ${widths.length} widths`);
