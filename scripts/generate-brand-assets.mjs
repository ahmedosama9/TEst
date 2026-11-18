// Renders PNG brand assets (logo, touch icon, Open Graph images per language) with Playwright.
// Usage: start the site (npm run dev / npm start), then `node scripts/generate-brand-assets.mjs [baseUrl]`.
// The running site is only used to load the real web fonts (incl. Arabic).
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";

// Playwright is not a project dependency: install it once with `npm i -D playwright && npx playwright install chromium`.
const { chromium } = createRequire(import.meta.url)("playwright");

const base = process.argv[2] ?? "http://localhost:3000";
const mark = readFileSync("public/brand/logo-mark-on-dark.svg", "utf8");
const og = {
  de: { dir: "ltr", title: "Dein Partner für erfolgreiches Social Media.", sub: "Content-Erstellung · Reels-Produktion · Betreuung" },
  en: { dir: "ltr", title: "Your partner for successful social media.", sub: "Content creation · Reels production · Management" },
  ar: { dir: "rtl", title: "شريكك لنجاح حساباتك على وسائل التواصل الاجتماعي.", sub: "صناعة المحتوى · إنتاج الريلز · إدارة الحسابات" },
  ku: { dir: "ltr", title: "Hevkarê we ji bo medyaya civakî ya serkeftî.", sub: "Çêkirina naverokê · Hilberîna Reels · Rêveberî" },
  tr: { dir: "ltr", title: "Başarılı sosyal medya için iş ortağınız.", sub: "İçerik üretimi · Reels prodüksiyonu · Yönetim" },
};

const browser = await chromium.launch();
for (const [locale, t] of Object.entries(og)) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(`${base}/${locale}`, { waitUntil: "networkidle" });
  await page.evaluate(
    ({ mark, t }) => {
      const el = document.createElement("div");
      document.documentElement.appendChild(el);
      el.innerHTML = `
      <div style="position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;background:#0B1026;background-image:radial-gradient(900px 500px at 90% -10%,rgba(0,212,179,.3),transparent 60%),radial-gradient(700px 420px at 0% 110%,rgba(123,97,255,.28),transparent 60%);color:#fff" dir="${t.dir}">
        <div style="display:flex;align-items:center;gap:20px" dir="ltr"><div style="width:84px;height:84px">${mark}</div>
          <div style="width:2px;height:74px;background:rgba(255,255,255,.4);transform:rotate(12deg)"></div><div style="font:italic 800 38px/1.05 var(--font-montserrat),sans-serif">Social Media<br><span style="color:#33F6E0">Komplett</span></div></div>
        <div><div style="font:italic 800 62px/1.2 var(--font-display);max-width:1000px">${t.title}</div>
          <div style="margin-top:26px;font:500 28px var(--font-sans);color:#B8C2DE">${t.sub}</div></div>
        <div style="display:flex;justify-content:space-between;align-items:center;font:italic 700 26px var(--font-montserrat),sans-serif" dir="ltr"><span style="color:#33F6E0">Content. Betreuung. Ergebnisse.</span><span style="color:#B8C2DE;font-weight:500">socialmediakomplett.de</span></div>
      </div>`;
    },
    { mark, t },
  );
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(400);
  await page.screenshot({ path: `public/og/${locale}.png` });
  await page.close();
}
for (const [file, size, pad] of [["logo-mark.png", 512, 64], ["apple-touch-icon.png", 180, 28]]) {
  const page = await browser.newPage({ viewport: { width: size, height: size } });
  await page.setContent(`<body style="margin:0;background:#0B1026"><div style="padding:${pad}px;box-sizing:border-box;width:${size}px;height:${size}px">${mark}</div></body>`);
  await page.screenshot({ path: `public/brand/${file}` });
  await page.close();
}
await browser.close();
console.log("Brand assets written to public/brand and public/og");
