// Renders the Open Graph share images per language with Playwright, using the approved logo.
// Logo variants and icons come from scripts/derive-brand-variants.py.
// Usage: start the site (npm run dev / npm start), then `node scripts/generate-brand-assets.mjs [baseUrl]`.
// The running site is only used to load the real web fonts (incl. Arabic).
import { createRequire } from "node:module";

// Playwright is not a project dependency: install it once with `npm i -D playwright && npx playwright install chromium`.
const { chromium } = createRequire(import.meta.url)("playwright");

const base = process.argv[2] ?? "http://localhost:3000";
const og = {
  de: { dir: "ltr", title: "Dein Partner für erfolgreiches Social Media.", sub: "Content-Erstellung · Reels-Produktion · Betreuung" },
  en: { dir: "ltr", title: "Your partner for successful social media.", sub: "Content creation · Reels production · Management" },
  ar: { dir: "rtl", title: "شريككم للنجاح على وسائل التواصل الاجتماعي.", sub: "صناعة المحتوى · إنتاج الريلز · إدارة الحسابات" },
  ku: { dir: "ltr", title: "Hevkarê we ji bo medyaya civakî ya serkeftî.", sub: "Çêkirina naverokê · Hilberîna Reels · Rêveberî" },
  tr: { dir: "ltr", title: "Başarılı sosyal medya için iş ortağınız.", sub: "İçerik üretimi · Reels prodüksiyonu · Yönetim" },
};

const browser = await chromium.launch();
for (const [locale, t] of Object.entries(og)) {
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(`${base}/${locale}`, { waitUntil: "networkidle" });
  await page.evaluate(
    ({ t }) => {
      const el = document.createElement("div");
      document.documentElement.appendChild(el);
      el.innerHTML = `
      <div style="position:fixed;inset:0;z-index:99999;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;background:#0B1026;background-image:radial-gradient(900px 500px at 90% -10%,rgba(0,212,179,.3),transparent 60%),radial-gradient(700px 420px at 0% 110%,rgba(123,97,255,.28),transparent 60%);color:#fff" dir="${t.dir}">
        <div dir="ltr" style="text-align:left"><img data-og-logo src="/brand/logo-on-dark.png" style="height:112px;width:auto" alt=""></div>
        <div><div style="font:italic 800 62px/1.2 var(--font-display);max-width:1000px">${t.title}</div>
          <div style="margin-top:26px;font:500 28px var(--font-sans);color:#B8C2DE">${t.sub}</div></div>
        <div style="display:flex;justify-content:space-between;align-items:center;font:italic 700 26px var(--font-montserrat),sans-serif" dir="ltr"><span style="color:#33F6E0">Content. Betreuung. Ergebnisse.</span><span style="color:#B8C2DE;font-weight:500">socialmediakomplett.de</span></div>
      </div>`;
    },
    { t },
  );
  await page.evaluate(() => document.fonts.ready);
  // wait for the logo inside the overlay (lazy page images are irrelevant here)
  await page.waitForFunction(() => { const i = document.querySelector("img[data-og-logo]"); return i && i.complete && i.naturalWidth > 0; });
  await page.waitForTimeout(400);
  await page.screenshot({ path: `public/og/${locale}.png` });
  await page.close();
}
await browser.close();
console.log("Brand assets written to public/brand and public/og");
