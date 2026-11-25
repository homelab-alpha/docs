// Check every internal link and anchor in the built site.
//
// Usage: npm run test:links
// A link is internal when it is relative, starts with /, or starts with
// BASE_URL. External links are not fetched.

import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";

import { BASE_URL, SITE_DIR } from "./helpers/config.mjs";
import { resolveFile } from "./helpers/server.mjs";

function htmlFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return htmlFiles(p);
    return e.name.endsWith(".html") ? [p] : [];
  });
}

// Ids and names on a page, cached per file.
const anchors = new Map();
function anchorsOf(file) {
  if (!anchors.has(file)) {
    const html = readFileSync(file, "utf8");
    const ids = new Set();
    for (const m of html.matchAll(/\s(?:id|name)=(?:"([^"]+)"|'([^']+)'|([^\s>]+))/g)) {
      ids.add(m[1] ?? m[2] ?? m[3]);
    }
    anchors.set(file, ids);
  }
  return anchors.get(file);
}

// The URL path of a file in the site, for resolving relative links.
function urlPathOf(file) {
  const rel = "/" + path.relative(SITE_DIR, file).split(path.sep).join("/");
  return rel.endsWith("/index.html") ? rel.slice(0, -"index.html".length) : rel;
}

const problems = [];
const files = htmlFiles(SITE_DIR);
let checked = 0;

for (const file of files) {
  const html = readFileSync(file, "utf8")
    // Code and preformatted text can show example links; skip them.
    .replace(/<pre[\s\S]*?<\/pre>/g, "")
    .replace(/<code[\s\S]*?<\/code>/g, "");
  const pagePath = urlPathOf(file);
  for (const m of html.matchAll(/\s(?:href|src)=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
    let url = (m[1] ?? m[2] ?? m[3]).trim().replace(/&amp;/g, "&");
    if (!url || /^(mailto:|tel:|javascript:|data:|blob:)/i.test(url)) continue;
    if (url.startsWith(BASE_URL)) url = url.slice(BASE_URL.length) || "/";
    if (/^[a-z][a-z0-9+.-]*:/i.test(url) || url.startsWith("//")) continue;
    checked++;
    const resolved = new URL(url, "http://site" + pagePath);
    const target = resolved.pathname === pagePath && url.startsWith("#") ? file : resolveFile(resolved.pathname);
    const where = path.relative(SITE_DIR, file);
    if (!target) {
      problems.push(`${where}: missing page ${url}`);
      continue;
    }
    const hash = decodeURIComponent(resolved.hash.slice(1));
    if (hash && target.endsWith(".html") && !anchorsOf(target).has(hash)) {
      problems.push(`${where}: missing anchor ${url}`);
    }
  }
}

console.log(`Checked ${checked} internal links in ${files.length} pages.`);
if (problems.length) {
  const unique = [...new Set(problems)];
  console.log(`${unique.length} problem(s):`);
  for (const p of unique.slice(0, 200)) console.log(`  ${p}`);
  if (unique.length > 200) console.log(`  ... and ${unique.length - 200} more`);
  process.exitCode = 1;
} else {
  console.log("No broken internal links.");
}
