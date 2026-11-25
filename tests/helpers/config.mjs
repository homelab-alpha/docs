// Shared settings for the site tests: the built site, the test pages, the
// widths, and the browser. See tests/README.md.

import { existsSync } from "node:fs";
import path from "node:path";

// The built site. Build it first, for example: hugo --gc --minify -d public
export const SITE_DIR = path.resolve(process.env.SITE_DIR || "public");

// The base URL the site was built with. Absolute links that start with it are
// checked as internal links.
export const BASE_URL = (process.env.BASE_URL || "https://homelab-alpha.nl").replace(/\/$/, "");

// Port of the local test server.
export const PORT = Number(process.env.PORT || 8765);

// Where screenshots and reports go. Ignored by Git.
export const OUTPUT_DIR = path.resolve("tests/output");

// The test pages of the design plan (.github/docs/new_site_design_plan.md).
// The landing page at / is only tested when the build has it (a development
// build); a production build redirects / to /docs/.
export const PAGES = [
  { name: "landing", path: "/", landingOnly: true },
  { name: "docs_home", path: "/docs/" },
  { name: "links", path: "/links/" },
  { name: "not_found", path: "/404.html" },
  { name: "section_list", path: "/docker/compose-info/" },
  { name: "dozzle", path: "/docker/compose-info/dozzle/" },
  { name: "code_blocks", path: "/back-to-basics/markdown/code-blocks/" },
  { name: "alerts", path: "/back-to-basics/markdown/unorthodox/" },
  { name: "katex_mermaid", path: "/back-to-basics/markdown/katex-plus-mermaid/" },
  { name: "kairos", path: "/kairos/" },
  { name: "terms", path: "/terms-of-homelab-alpha/" },
];

// Screen widths: desktop, laptop, and smartphone.
export const WIDTHS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "laptop", width: 1280, height: 800 },
  { name: "smartphone", width: 390, height: 844 },
];

export const MODES = ["light", "dark"];

// Chromium for Playwright and Lighthouse. npm does not download browsers
// (ignore-scripts), so point CHROMIUM_PATH at an installed Chrome or Chromium.
export function chromiumPath() {
  const candidates = [
    process.env.CHROMIUM_PATH,
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
  ].filter(Boolean);
  const found = candidates.find((p) => existsSync(p));
  if (!found) {
    throw new Error("No Chromium found. Set CHROMIUM_PATH to a Chrome or Chromium executable.");
  }
  return found;
}

// The test pages that exist in this build.
export function pagesInBuild(hasLanding) {
  return PAGES.filter((p) => !p.landingOnly || hasLanding);
}
