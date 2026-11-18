// Real-browser checks against a running build (default http://localhost:3000):
// horizontal overflow at mobile/tablet/desktop in all five languages, RTL rendering, console and
// page errors, language switcher (equivalent page + cookie), mobile menu + keyboard, blog search/
// filter/pagination, contact-form validation and honest failure state in every language.
// Playwright is not a project dependency: `npm i -D playwright && npx playwright install chromium`.
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";
const { chromium } = createRequire(import.meta.url)("playwright");

const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const shots = process.env.SHOTS_DIR;
if (shots) mkdirSync(shots, { recursive: true });
const locales = ["de", "en", "ar", "ku", "tr"];
const paths = { de: ["", "/leistungen/reels-videoproduktion", "/pakete", "/ratgeber", "/kontakt", "/branchen/gastronomie", "/faq", "/datenschutz", "/leistungen/speisekarten-design", "/leistungen/google-unternehmensprofil", "/leistungen"], en: ["", "/services/reels-video-production", "/packages", "/blog", "/contact", "/industries/gastronomy", "/faq", "/privacy-policy", "/services/menu-design", "/services/google-business-profile", "/services"], tr: ["", "/hizmetler/reels-video-produksiyonu", "/paketler", "/blog", "/iletisim", "/sektorler/gastronomi", "/sss", "/gizlilik-politikasi", "/hizmetler/menu-tasarimi", "/hizmetler/google-isletme-profili", "/hizmetler"] };
paths.ar = paths.en; paths.ku = paths.en;
const viewports = { mobile: { width: 360, height: 740 }, tablet: { width: 820, height: 1180 }, desktop: { width: 1440, height: 900 } };
const failures = [];
const fail = (m) => { failures.push(m); console.error("  ✖ " + m); };
const ok = (m) => console.log("  ✔ " + m);

const browser = await chromium.launch();

console.log("1. Layout: no horizontal overflow, no console errors");
let pagesChecked = 0;
for (const [vpName, viewport] of Object.entries(viewports)) {
  const ctx = await browser.newContext({ viewport });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  for (const l of locales) {
    // first article of each language, taken from the blog index
    await page.goto(`${base}/${l}${paths[l][3]}`, { waitUntil: "networkidle" });
    const article = await page.locator("main article h3 a, main article h2 a").first().getAttribute("href");
    for (const p of [...paths[l], article.replace(`/${l}`, "")]) {
      errors.length = 0;
      const res = await page.goto(`${base}/${l}${p}`, { waitUntil: "networkidle" });
      pagesChecked++;
      if (res.status() !== 200) fail(`${vpName} /${l}${p}: status ${res.status()}`);
      const { overflow, dir } = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, dir: getComputedStyle(document.documentElement).direction }));
      if (overflow > 1) fail(`${vpName} /${l}${p}: horizontal overflow of ${overflow}px`);
      if (dir !== (l === "ar" ? "rtl" : "ltr")) fail(`${vpName} /${l}${p}: direction is ${dir}`);
      if (errors.length) fail(`${vpName} /${l}${p}: console errors: ${errors.join(" | ").slice(0, 300)}`);
      if (shots && p === "") await page.screenshot({ path: `${shots}/${l}-${vpName}.png`, fullPage: false });
    }
  }
  await ctx.close();
}
ok(`${pagesChecked} page renders checked across ${Object.keys(viewports).length} viewports × ${locales.length} languages`);

console.log("2. RTL specifics (Arabic)");
{
  const page = await browser.newPage({ viewport: viewports.desktop });
  await page.goto(`${base}/ar/contact`, { waitUntil: "networkidle" });
  const r = await page.evaluate(() => {
    const h1 = document.querySelector("h1");
    const logo = document.querySelector("header a");
    const email = document.querySelector('input[type="email"]');
    return {
      font: getComputedStyle(h1).fontFamily,
      h1Align: getComputedStyle(h1).textAlign,
      logoRight: logo.getBoundingClientRect().left > innerWidth / 2,
      emailDir: getComputedStyle(email).direction,
      crumbFlip: getComputedStyle(document.querySelector('nav ol svg')).transform !== "none",
    };
  });
  /Arabic/i.test(r.font) ? ok("Arabic font applied to headings") : fail(`Arabic font not applied (${r.font})`);
  r.logoRight ? ok("header is mirrored (logo on the right)") : fail("header not mirrored in RTL");
  r.emailDir === "ltr" ? ok("e-mail field stays LTR") : fail("e-mail field is not LTR");
  r.crumbFlip ? ok("breadcrumb chevrons are flipped") : fail("directional icons not flipped");
  await page.close();
}

console.log("3. Language switcher");
{
  const ctx = await browser.newContext({ viewport: viewports.desktop });
  const page = await ctx.newPage();
  await page.goto(`${base}/de/leistungen/reels-videoproduktion`, { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /Sprache wählen/ }).click();
  await Promise.all([page.waitForURL("**/tr/hizmetler/reels-video-produksiyonu"), page.getByRole("link", { name: "Türkçe" }).first().click()]);
  ok("keeps the equivalent page (de service → tr service)");
  const cookie = (await ctx.cookies()).find((c) => c.name === "smk_locale");
  cookie?.value === "tr" ? ok("stores the explicit choice in smk_locale") : fail("language cookie not set");
  await page.goto(`${base}/`, { waitUntil: "networkidle" });
  page.url().endsWith("/tr") ? ok("root URL honours the stored choice") : fail(`root went to ${page.url()}`);
  await page.goto(`${base}/en/faq`, { waitUntil: "networkidle" });
  page.url().endsWith("/en/faq") ? ok("direct language URLs are never overridden") : fail("direct URL was redirected");
  // article → translated article slug
  await page.goto(`${base}/de/ratgeber/kosten-social-media-betreuung`, { waitUntil: "networkidle" });
  const enHref = await page.locator('header a[hreflang="en"]').first().getAttribute("href");
  /^\/en\/blog\/[a-z0-9-]+$/.test(enHref) ? ok(`article switches to its translated slug (${enHref})`) : fail(`unexpected article alternate ${enHref}`);
  await ctx.close();
}

console.log("4. Mobile menu and keyboard");
{
  const page = await browser.newPage({ viewport: viewports.mobile });
  await page.goto(`${base}/de`, { waitUntil: "networkidle" });
  await page.keyboard.press("Tab");
  const skip = await page.evaluate(() => document.activeElement?.textContent);
  /Zum Inhalt springen/.test(skip ?? "") ? ok("first Tab stop is the skip link") : fail(`first Tab stop is "${skip}"`);
  await page.getByRole("button", { name: "Menü öffnen" }).click();
  const open = await page.evaluate(() => document.querySelector("dialog")?.open);
  open ? ok("menu opens as modal dialog") : fail("menu did not open");
  await page.keyboard.press("Escape");
  (await page.evaluate(() => document.querySelector("dialog")?.open)) ? fail("Esc does not close the menu") : ok("Esc closes the menu");
  await page.getByRole("button", { name: "Menü öffnen" }).click();
  await Promise.all([page.waitForURL("**/de/pakete"), page.locator("dialog").getByRole("link", { name: "Pakete", exact: true }).click()]);
  ok("menu link navigates");
  // services are grouped in a collapsible block; the two local-marketing services must be reachable
  await page.getByRole("button", { name: "Menü öffnen" }).click();
  const before = await page.locator("dialog a:visible").count();
  await page.locator("dialog summary").first().click();
  const groups = await page.locator("dialog details li.uppercase").allTextContents();
  groups.includes("Lokales Marketing & Design") ? ok(`services expand into groups (${groups.join(" / ")}); ${before} links when collapsed`) : fail(`service groups missing: ${groups}`);
  await Promise.all([page.waitForURL("**/de/leistungen/google-unternehmensprofil"), page.locator("dialog").getByRole("link", { name: "Google-Unternehmensprofil" }).click()]);
  (await page.locator("h1").textContent()).includes("Google-Unternehmensprofil") ? ok("new service page reachable from the mobile menu") : fail("new service page not reached");
  await page.close();
}

console.log("5. Blog: search, tag filter, pagination");
{
  const page = await browser.newPage({ viewport: viewports.desktop });
  await page.goto(`${base}/de/ratgeber`, { waitUntil: "networkidle" });
  await page.getByRole("searchbox").fill("Friseure");
  await page.waitForTimeout(300);
  const found = await page.locator("main ul article").count();
  found >= 1 && found < 10 ? ok(`search narrows the list (${found} result/s for "Friseure")`) : fail(`search returned ${found} results`);
  await page.getByRole("searchbox").fill("xyzxyz");
  (await page.getByText("keine Artikel gefunden").count()) ? ok("empty state is announced") : fail("no empty state");
  await page.getByRole("button", { name: "Filter zurücksetzen" }).click();
  await page.locator('button[aria-pressed="false"]').first().click();
  (await page.locator('button[aria-pressed="true"]').count()) === 1 ? ok("tag filter toggles") : fail("tag filter did not toggle");
  await page.getByRole("button", { name: "Filter zurücksetzen" }).click();
  await Promise.all([page.waitForURL("**/de/ratgeber/seite/2"), page.getByRole("link", { name: "Nächste Seite" }).click()]);
  (await page.locator("main article").count()) >= 1 ? ok("pagination reaches page 2") : fail("page 2 is empty");
  await page.goto(`${base}/de/ratgeber/kategorie/marketing-fuer-restaurants`, { waitUntil: "networkidle" });
  (await page.locator("main article").count()) >= 1 ? ok("category page lists its articles") : fail("category page empty");
  await page.close();
}

console.log("6. Contact form in every language");
for (const l of locales) {
  const page = await browser.newPage({ viewport: viewports.mobile });
  await page.goto(`${base}/${l}${paths[l][4]}`, { waitUntil: "networkidle" });
  const form = page.locator("main form").last();
  await form.locator('button[type="submit"]').click();
  await page.waitForTimeout(300);
  const invalid = await form.locator('[aria-invalid="true"]').count();
  const messages = await form.locator('[id$="-error"]').allTextContents();
  invalid >= 5 && messages.every((m) => m.trim().length > 5) ? ok(`${l}: ${messages.length} localized validation messages, fields marked invalid`) : fail(`${l}: validation incomplete (${invalid} invalid, ${messages.length} messages)`);
  await form.locator('input[autocomplete="name"]').fill("Test Person");
  await form.locator('input[autocomplete="organization"]').fill("Test GmbH");
  await form.locator('input[type="email"]').fill("test@example.com");
  await form.locator("select").selectOption("gastronomy");
  await form.locator('input[type="checkbox"][value="reels"]').check();
  await form.locator("textarea").fill("Automated test enquiry – please ignore.");
  await form.locator('input[type="checkbox"]').last().check();
  await page.waitForTimeout(3200); // pass the anti-spam timing check
  await form.locator('button[type="submit"]').click();
  await page.waitForFunction(() => document.querySelector('main [role="alert"]')?.textContent?.trim() || document.querySelector('main [role="status"] h3'), null, { timeout: 15000 });
  const success = await page.locator('main [role="status"] h3').count();
  const alert = (await page.locator('main [role="alert"]').last().textContent())?.trim();
  if (process.env.EXPECT_DELIVERY === "1") success ? ok(`${l}: enquiry delivered, success state shown`) : fail(`${l}: expected success, got "${alert}"`);
  else !success && alert ? ok(`${l}: without mail credentials the form reports failure honestly`) : fail(`${l}: form claimed success without a mail provider`);
  await page.close();
}

await browser.close();
if (failures.length) { console.error(`\n✖ ${failures.length} browser check(s) failed`); process.exit(1); }
console.log("\n✔ Browser audit passed");
