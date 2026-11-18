// Verifies that every language has exactly the same message structure as German (the source):
// same keys, same array lengths, same {placeholders}, no empty or untranslated-looking strings.
// Also reports blog translation coverage. Exit code 1 on structural errors.
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SOURCE = "de";
const LOCALES = ["de", "en", "ar", "ku", "tr"];
const NAMESPACES = ["common", "home", "services", "industries", "pages", "legal"];
// Values that are legitimately identical in every language.
const SAME_OK = /^(Starter|Business|Komplett|FAQ|Blog|Reel|Story|Cookie|Instagram|Portfolio|Business|smk_\w+|[\d\s.,:·–-]*)$/i;

const errors = [];
const warnings = [];
const load = (l, ns) => JSON.parse(readFileSync(join("messages", l, `${ns}.json`), "utf8"));
const placeholders = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join(",");

function compare(src, tgt, path, locale) {
  if (typeof src === "string") {
    if (typeof tgt !== "string") return errors.push(`${locale} ${path}: expected string`);
    if (!tgt.trim()) errors.push(`${locale} ${path}: empty string`);
    if (placeholders(src) !== placeholders(tgt)) errors.push(`${locale} ${path}: placeholders differ (${placeholders(src)} ≠ ${placeholders(tgt)})`);
    if (locale !== SOURCE && src === tgt && src.length > 14 && !SAME_OK.test(src) && !path.endsWith("relatedPost")) warnings.push(`${locale} ${path}: identical to German – untranslated?`);
    return;
  }
  if (Array.isArray(src)) {
    if (!Array.isArray(tgt)) return errors.push(`${locale} ${path}: expected array`);
    if (src.length !== tgt.length) return errors.push(`${locale} ${path}: array length ${tgt.length} ≠ ${src.length}`);
    return src.forEach((v, i) => compare(v, tgt[i], `${path}[${i}]`, locale));
  }
  if (src && typeof src === "object") {
    if (!tgt || typeof tgt !== "object" || Array.isArray(tgt)) return errors.push(`${locale} ${path}: expected object`);
    for (const k of Object.keys(src)) k in tgt ? compare(src[k], tgt[k], `${path}.${k}`, locale) : errors.push(`${locale} ${path}.${k}: missing`);
    for (const k of Object.keys(tgt)) if (!(k in src)) errors.push(`${locale} ${path}.${k}: unknown key (not in German source)`);
  }
}

for (const ns of NAMESPACES) {
  const src = load(SOURCE, ns);
  for (const l of LOCALES) {
    const file = join("messages", l, `${ns}.json`);
    if (!existsSync(file)) { errors.push(`${l}: missing file ${file}`); continue; }
    try { compare(src, load(l, ns), ns, l); } catch (e) { errors.push(`${l} ${ns}: ${e.message}`); }
  }
}

// Blog coverage
const blogDir = join("content", "blog");
const ids = readdirSync(blogDir).filter((d) => !d.startsWith("_") && statSync(join(blogDir, d)).isDirectory());
console.log("\nBlog translation coverage (status from frontmatter):");
for (const id of ids) {
  const row = LOCALES.map((l) => {
    const f = join(blogDir, id, `${l}.mdx`);
    if (!existsSync(f)) return `${l}: –`;
    const m = /translationStatus:\s*"?([\w-]+)"?/.exec(readFileSync(f, "utf8"));
    return `${l}: ${m ? m[1] : "?"}`;
  });
  console.log(`  ${id.padEnd(42)} ${row.join("  ")}`);
  if (!existsSync(join(blogDir, id, `${SOURCE}.mdx`))) errors.push(`blog ${id}: German source missing`);
}

if (warnings.length) console.log(`\nWarnings (${warnings.length}):\n` + warnings.map((w) => "  " + w).join("\n"));
if (errors.length) {
  console.error(`\n✖ ${errors.length} i18n error(s):\n` + errors.map((e) => "  " + e).join("\n"));
  process.exit(1);
}
console.log(`\n✔ Message structure is identical across ${LOCALES.join(", ")} (${NAMESPACES.length} namespaces).`);
