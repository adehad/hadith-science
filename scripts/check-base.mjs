// crawl a BASE build: every internal href/src/refresh/canonical/fetch must carry the base (spec §8, §9)
// usage: bun scripts/check-base.mjs <dir> <base>   (SITE origin is read from env SITE or the home page canonical)
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const [dir, rawBase] = process.argv.slice(2);
if (!dir || !rawBase) { console.error("usage: check-base.mjs <dir> <base>"); process.exit(2); }
const base = rawBase.endsWith("/") ? rawBase : rawBase + "/";

const files = [];
(function walk(d) {
  for (const f of readdirSync(d)) {
    const p = join(d, f);
    statSync(p).isDirectory() ? walk(p) : files.push(p);
  }
})(dir);

let site = process.env.SITE;
if (!site) {
  const home = readFileSync(join(dir, "index.html"), "utf8");
  site = home.match(/<link[^>]+rel="canonical"[^>]+href="(https?:\/\/[^/"]+)/)?.[1];
}
if (!site) { console.error("check-base: cannot determine SITE origin (set SITE or add a canonical to index.html)"); process.exit(2); }
site = site.replace(/\/$/, "");

const bad = [];
const baseNoSlash = base.replace(/\/$/, "");
const hasBase = (p) => p === baseNoSlash || p.startsWith(base);

// returns an error string, or null when the url is fine
function judge(raw) {
  let v = raw.trim().replace(/^\d+\s*;\s*url=/i, "").replace(/^'|'$/g, "");
  if (!v || v.startsWith("#")) return null;
  if (/^(data|mailto|tel|javascript|blob):/i.test(v)) return null;
  if (v.startsWith("//")) return null; // protocol-relative (fonts etc.)
  if (/^https?:\/\//i.test(v)) {
    const u = new URL(v);
    if (u.origin !== new URL(site).origin) return null; // external
    return hasBase(u.pathname) ? null : "site-origin URL without base";
  }
  if (v.startsWith("/")) return hasBase(v.split(/[?#]/)[0]) ? null : "unprefixed root path";
  return null; // relative paths resolve against the page, not checked here
}

// attributes whose value is a URL
const urlAttr = /\s(?:href|src|action|poster|data-href|data-src)\s*=\s*(?:"([^"]*)"|'([^']*)')/gi;
const srcset = /\ssrcset\s*=\s*"([^"]*)"/gi;
// <meta ... content="..."> only when the value looks like a URL or a refresh
const meta = /<meta\b[^>]*>/gi;
const metaContent = /\scontent\s*=\s*"([^"]*)"/i;

for (const f of files) {
  const rel = f.split(String.fromCharCode(92)).join("/");
  if (/\.html$/.test(f)) {
    const s = readFileSync(f, "utf8");
    for (const m of s.matchAll(urlAttr)) {
      const err = judge(m[1] ?? m[2]);
      if (err) bad.push(`${rel}: ${err}: ${m[0].trim()}`);
    }
    for (const m of s.matchAll(srcset)) {
      for (const part of m[1].split(",")) {
        const err = judge(part.trim().split(/\s+/)[0]);
        if (err) bad.push(`${rel}: ${err}: srcset ${part.trim()}`);
      }
    }
    for (const [tag] of s.matchAll(meta)) {
      const c = tag.match(metaContent)?.[1];
      if (c && (/^\d+\s*;\s*url=/i.test(c) || /^(https?:\/\/|\/)/.test(c))) {
        const err = judge(c);
        if (err) bad.push(`${rel}: ${err}: ${tag}`);
      }
    }
  } else if (/\.js$/.test(f)) {
    const s = readFileSync(f, "utf8");
    // any quoted root-absolute literal that names a data file or a site route
    const lit = /["'`](\/(?:[\w.-]+\/)*[\w.-]+\.(?:json|html|xml)|\/(?:terms|t|orbit)\/[\w./#?=-]*)["'`]/g;
    for (const m of s.matchAll(lit)) {
      if (!hasBase(m[1])) bad.push(`${rel}: unprefixed root path in JS: ${m[1]}`);
    }
  } else if (/\.css$/.test(f)) {
    const s = readFileSync(f, "utf8");
    for (const m of s.matchAll(/url\(\s*["']?([^"')]+)["']?\s*\)/g)) {
      const err = judge(m[1]);
      if (err) bad.push(`${rel}: ${err}: url(${m[1]})`);
    }
  }
}

if (bad.length) { console.error(bad.join("\n")); process.exit(1); }
console.log(`check-base: ${files.length} files ok`);
