# Site tests

Development tests for the built site: links, accessibility, screenshots, and
Lighthouse. They belong to the test plan in
[`.github/docs/new_site_design_plan.md`](../.github/docs/new_site_design_plan.md).
They do not run in CI, except the CSP check (`.github/scripts/check_csp.py`),
which the Build & Deploy workflow runs on every build.

## Requirements

- The dev tooling: `npm ci`.
- A built site in `public/`, or another folder in `SITE_DIR`.
- Chrome or Chromium for the browser tests. npm does not download browsers
  (`ignore-scripts=true`), so the tests look for an installed Chrome or
  Chromium. Set `CHROMIUM_PATH` if it is somewhere else.

Build the site for the tests with the base URL of the test server:

```bash
hugo --gc --minify --baseURL http://localhost:8765/ -d public
```

A development build (`--environment development`) has the landing page at `/`;
the tests then include it.

## Commands

```bash
npm run test:csp                # every inline script matches its page's CSP
npm run test:links              # every internal link and anchor resolves
npm run test:a11y               # axe-core, WCAG 2.2 A and AA, light and dark
npm run test:screenshots -- before   # screenshots to tests/output/screenshots/before/
npm run test:lighthouse         # Lighthouse, mobile and desktop
npm test                        # links, accessibility, and Lighthouse
```

## Settings

| Variable        | Default                    | Use                                          |
| --------------- | -------------------------- | -------------------------------------------- |
| `SITE_DIR`      | `public`                   | The built site.                              |
| `BASE_URL`      | `https://homelab-alpha.nl` | Absolute links with this start are internal. |
| `PORT`          | `8765`                     | Port of the local test server.               |
| `CHROMIUM_PATH` | an installed Chrome        | Chrome or Chromium executable.               |
| `LH_MIN`        | `100`                      | Lowest passing Lighthouse score.             |
| `LH_PORT`       | `9222`                     | DevTools port for Lighthouse.                |

The test pages, widths, and modes are in `tests/helpers/config.mjs`. Reports and
screenshots go to `tests/output/`, which Git ignores.

## Dependencies

| Package           | Why                                                          |
| ----------------- | ------------------------------------------------------------ |
| `playwright-core` | Drives Chromium for the accessibility tests and screenshots. |
| `axe-core`        | The WCAG 2.2 accessibility rules.                            |
| `lighthouse`      | Performance, accessibility, best practices, and SEO scores.  |
