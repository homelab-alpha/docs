// Lighthouse on every test page, mobile and desktop. The goal is 100 in
// Performance, Accessibility, Best Practices, and SEO.
//
// Usage: npm run test:lighthouse
// LH_MIN sets the lowest passing score (default 100). Scores on mobile can vary
// by a few points between runs; run again before you act on a 98 or 99.

import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";

import lighthouse from "lighthouse";
import desktopConfig from "lighthouse/core/config/desktop-config.js";
import { chromium } from "playwright-core";

import { OUTPUT_DIR, chromiumPath, pagesInBuild } from "./helpers/config.mjs";
import { buildHasLanding, origin, startServer } from "./helpers/server.mjs";

const MIN = Number(process.env.LH_MIN || 100);
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

const server = await startServer();
// Lighthouse drives the browser over the DevTools protocol on this port.
const DEBUG_PORT = Number(process.env.LH_PORT || 9222);
const browser = await chromium.launch({
  executablePath: chromiumPath(),
  args: [`--remote-debugging-port=${DEBUG_PORT}`],
});
const summary = [];
let failed = 0;

try {
  for (const page of pagesInBuild(buildHasLanding())) {
    for (const form of ["mobile", "desktop"]) {
      const config = form === "desktop" ? desktopConfig : undefined;
      const result = await lighthouse(
        origin + page.path,
        { port: DEBUG_PORT, output: "json", logLevel: "error", onlyCategories: CATEGORIES },
        config,
      );
      const scores = Object.fromEntries(
        CATEGORIES.map((c) => [c, Math.round((result.lhr.categories[c]?.score ?? 0) * 100)]),
      );
      const low = Object.entries(scores).filter(([, s]) => s < MIN);
      if (low.length) failed++;
      summary.push({ page: page.path, form, scores });
      console.log(`${page.path.padEnd(48)} ${form.padEnd(8)} ${CATEGORIES.map((c) => scores[c]).join(" ")}`);
      for (const [cat] of low) {
        const audits = result.lhr.categories[cat].auditRefs
          .map((r) => result.lhr.audits[r.id])
          .filter((a) => a.score !== null && a.score < 1 && a.scoreDisplayMode !== "informative")
          .slice(0, 5);
        for (const a of audits) console.log(`    ${cat}: ${a.id} ${a.displayValue || ""}`);
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(path.join(OUTPUT_DIR, "lighthouse.json"), JSON.stringify(summary, null, 2));
console.log(`Scores: ${CATEGORIES.join(", ")}.`);
console.log(failed ? `${failed} run(s) below ${MIN}.` : `All runs at ${MIN} or higher.`);
if (failed) process.exitCode = 1;
