// Accessibility check with axe-core: the WCAG 2.2 A and AA rules on every test
// page, in light and dark mode, at the desktop and smartphone widths.
//
// Usage: npm run test:a11y

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { chromium } from "playwright-core";

import { MODES, OUTPUT_DIR, WIDTHS, chromiumPath, pagesInBuild } from "./helpers/config.mjs";
import { buildHasLanding, origin, startServer } from "./helpers/server.mjs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const widths = WIDTHS.filter((w) => w.name !== "laptop");

const server = await startServer();
const browser = await chromium.launch({ executablePath: chromiumPath() });
const results = [];
let total = 0;

try {
  for (const page of pagesInBuild(buildHasLanding())) {
    for (const mode of MODES) {
      for (const size of widths) {
        const context = await browser.newContext({
          viewport: { width: size.width, height: size.height },
          colorScheme: mode,
          // axe-core is injected as an inline script, which the site's Content Security Policy blocks, as it
          // should. Bypass the policy in this test browser only; .github/scripts/check_csp.py tests the policy.
          bypassCSP: true,
        });
        const tab = await context.newPage();
        await tab.goto(origin + page.path, { waitUntil: "load" });
        await tab.addScriptTag({ content: axeSource });
        const { violations } = await tab.evaluate(
          (tags) => window.axe.run(document, { runOnly: { type: "tag", values: tags } }),
          TAGS,
        );
        await context.close();
        total += violations.length;
        results.push({ page: page.path, mode, width: size.name, violations });
        const label = `${page.path} ${mode} ${size.name}`.padEnd(64);
        console.log(`${label} ${violations.length ? violations.length + " violation(s)" : "ok"}`);
        for (const v of violations) {
          console.log(`    ${v.impact}: ${v.id}: ${v.help} (${v.nodes.length} element(s))`);
          for (const n of v.nodes.slice(0, 3)) console.log(`      ${n.target.join(" ")}`);
        }
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(path.join(OUTPUT_DIR, "a11y.json"), JSON.stringify(results, null, 2));
console.log(total ? `${total} violation(s) in total.` : "No accessibility violations.");
if (total) process.exitCode = 1;
