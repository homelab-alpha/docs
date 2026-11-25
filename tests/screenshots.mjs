// Full-page screenshots of every test page, in light and dark mode, at the
// desktop, laptop, and smartphone widths.
//
// Usage: npm run test:screenshots -- [label]
// The screenshots go to tests/output/screenshots/<label>/ (default: current).
// Take a set before and after a change and compare them.

import { mkdirSync } from "node:fs";
import path from "node:path";

import { chromium } from "playwright-core";

import { MODES, OUTPUT_DIR, WIDTHS, chromiumPath, pagesInBuild } from "./helpers/config.mjs";
import { buildHasLanding, origin, startServer } from "./helpers/server.mjs";

const label = (process.argv[2] || "current").replace(/[^a-z0-9_-]/gi, "_");
const dir = path.join(OUTPUT_DIR, "screenshots", label);
mkdirSync(dir, { recursive: true });

const server = await startServer();
const browser = await chromium.launch({ executablePath: chromiumPath() });
let count = 0;

try {
  for (const page of pagesInBuild(buildHasLanding())) {
    for (const mode of MODES) {
      for (const size of WIDTHS) {
        const context = await browser.newContext({
          viewport: { width: size.width, height: size.height },
          deviceScaleFactor: size.width < 600 ? 2 : 1,
          colorScheme: mode,
          reducedMotion: "reduce",
        });
        const tab = await context.newPage();
        await tab.goto(origin + page.path, { waitUntil: "networkidle" });
        // Scroll through the page so lazy content (images, code, diagrams) loads.
        await tab.evaluate(async () => {
          for (let y = 0; y < document.body.scrollHeight; y += window.innerHeight) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 100));
          }
          window.scrollTo(0, 0);
        });
        await tab.waitForTimeout(300);
        const file = path.join(dir, `${page.name}_${size.name}_${mode}.png`);
        await tab.screenshot({ path: file, fullPage: true });
        await context.close();
        count++;
      }
    }
    console.log(`${page.path}: done`);
  }
} finally {
  await browser.close();
  server.close();
}

console.log(`${count} screenshots in ${path.relative(process.cwd(), dir)}`);
