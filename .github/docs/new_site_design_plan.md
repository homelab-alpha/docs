# New site design: plan and testing

The plan of approach and the test plan for the new design of homelab-alpha.nl.
The design follows the Apple Human Interface Guidelines (HIG) in the colors of
GitHub Light Default and GitHub Dark Default. The mockups are on the design
canvas "Homelab-Alpha HIG redesign".

Branch: `dev/new-site-design`. No pull request until the maintainer asks for
one. When everything meets the quality goals, the plan is a v1 release.

## Decisions

| Topic           | Decision                                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| Scope           | Docs pages, docs home, landing page, `/links/`, and the 404 page. The e-reader version stays as it is.     |
| Approach        | Restyle the current Hugo layouts and Bootstrap step by step, so the site works after every phase.          |
| Colors          | GitHub Light Default and GitHub Dark Default (Primer). One accent: blue.                                   |
| Buttons         | Prominent buttons use the blue accent (`#0969da` light, `#1f6feb` dark).                                   |
| Appearance      | Follows the system by default. A toggle switch in the toolbar: light or dark (see below).                  |
| Fonts           | System font for text (SF Pro on Apple devices). JetBrains Mono, self-hosted, for code.                     |
| Icons           | Sidebar icons in the accent color. Docs home: a colored tile per topic.                                    |
| Materials       | Translucent material only for the toolbar and the mobile bottom bar; solid with Reduce Transparency.       |
| Search          | FlexSearch in a popover under the search field, with arrow keys, Enter, Escape, and `Ctrl /`.              |
| Code            | Highlighting at build time with Hugo (Chroma), in GitHub colors. Prism is removed.                         |
| Mobile          | A floating bar at the bottom: previous page, "On this page", next page. The menu opens from the toolbar.   |
| Features kept   | Breadcrumbs, previous and next page, table of contents, Edit on GitHub, last modified, KaTeX, and Mermaid. |
| Feature removed | The "Was this page helpful?" block.                                                                        |
| Footer          | `© Homelab-Alpha <current year>`, the license (CC BY-NC-SA 4.0), and links to License and Terms.           |
| Landing page    | Turned on with the v1 release. Until then `/` redirects to `/docs/`.                                       |
| Old stack       | The old Lotus landing stack and everything else that is no longer used is removed at the end.              |
| Progress        | After each phase: a signed commit, a push to the dev branch, and screenshots (light and dark) in the chat. |

## Design tokens

Colors (Primer, current values):

| Token            | Light Default           | Dark Default      |
| ---------------- | ----------------------- | ----------------- |
| Background       | `#ffffff`               | `#0d1117`         |
| Subtle surface   | `#f6f8fa`               | `#151b23`         |
| Text             | `#1f2328`               | `#f0f6fc`         |
| Muted text       | `#59636e`               | `#9198a1`         |
| Border           | `#d1d9e0`               | `#3d444d`         |
| Accent (links)   | `#0969da`               | `#4493f8`         |
| Accent fill      | `#0969da`               | `#1f6feb`         |
| Success          | `#1a7f37`               | `#3fb950`         |
| Attention        | `#9a6700`               | `#d29922`         |
| Danger           | `#d1242f`               | `#f85149`         |
| Done (purple)    | `#8250df`               | `#ab7df8`         |
| Toolbar material | `rgba(246,248,250,.85)` | `rgba(1,4,9,.85)` |

Typography (HIG text styles, in rem so they follow the browser text size):

| Style       | Size  | Weight   |
| ----------- | ----- | -------- |
| Large title | 40 px | Bold     |
| Title 1     | 28 px | Bold     |
| Title 2     | 22 px | Bold     |
| Title 3     | 20 px | Semibold |
| Body        | 17 px | Regular  |
| Callout     | 15 px | Regular  |
| Footnote    | 13 px | Regular  |
| Caption     | 12 px | Regular  |
| Code        | 14 px | Regular  |

Layout: an 8 px grid, corner radius 8 px for rows, 12 px for blocks, 16 px for
cards, and touch targets of at least 44 × 44 px.

## Phases

Each phase ends with a working site, the automated tests below, a signed commit,
a push, and screenshots.

1. **Baseline.** Build the current `main`, take the reference screenshots, and
   record the Lighthouse, accessibility, and link results. Add the test scripts
   (see "Test tooling").
2. **Tokens and appearance.** Replace the color and type variables with the
   tokens above (light and dark). Three-state appearance (Light, Dark, Auto) in
   `darkmode-init.js` and `darkmode-switch.js`, without a flash on load.
3. **Toolbar.** `top-header.html`: material, search field, segmented control,
   and the items. The items stay as they are (GitHub, GitHub Community, and
   Links) until the maintainer decides on them, after all phases.
4. **Sidebar.** `sidebar.html`: source-list style, accent icons, the selected
   page in an accent fill, collapsible sections, keyboard focus.
5. **Content.** Headings, text, lists, tables, inline code, images, the meta row
   (last modified, Edit on GitHub), breadcrumbs, the table of contents, and
   previous and next page. Callouts for the `alert` shortcode and the GitHub
   alerts. Remove the feedback block.
6. **Code.** Highlighting with Hugo at build time, in GitHub light and dark
   colors. A code block header with the filename or language and a copy button
   with a tooltip. The `tabs` shortcode becomes a segmented control. Remove
   Prism.
7. **Search.** The popover with keyboard support, on top of the current
   FlexSearch index.
8. **Mobile.** The floating bottom bar, the menu, and the "On this page" sheet.
9. **Docs home.** `/docs/` with the large title and the topic tiles.
10. **Landing page, `/links/`, 404, and footer.** In the new style.
11. **Clean up.** Remove the old Lotus landing stack (`assets/scss/`,
    `layouts/_default/baseof.html`, `layouts/partials/header.html`, image
    compare), Prism, and unused images, icons, and fonts, such as the old alert
    screenshots.
12. **Final check.** The full test plan, the maintainer's device tests, and the
    documentation (`CLAUDE.md`, `README.md`, `assets/icons/README.md`). Then a
    pull request, only when the maintainer asks for it.

## Test plan

### Automated, every phase

- `hugo` build for production and for development, without errors or warnings.
- `npm run lint` (Prettier, textlint, conflict markers).
- Screenshots with Playwright of the test pages, in light and dark, at three
  widths: desktop (1440 px), laptop (1280 px), and smartphone (390 px). Compared
  with the previous phase and the baseline.
- Accessibility: axe-core with the WCAG 2.2 AA rules on every test page, in
  light and dark. No violations.
- Lighthouse 13 on every test page, mobile and desktop: 100 in Performance,
  Accessibility, Best Practices, and SEO.
- Links: every internal link and anchor in the built site resolves.

### Test pages

| Page                                           | Why                                         |
| ---------------------------------------------- | ------------------------------------------- |
| `/` (landing page, development build)          | Landing page                                |
| `/docs/`                                       | Docs home                                   |
| `/links/`                                      | Links page                                  |
| `/404.html`                                    | Error page                                  |
| `/docker/compose-info/`                        | Section list                                |
| `/docker/compose-info/dozzle/`                 | Typical page with code blocks and a callout |
| `/back-to-basics/markdown/code-blocks/`        | Many code languages                         |
| `/back-to-basics/markdown/unorthodox/`         | GitHub alerts and shortcodes                |
| `/back-to-basics/markdown/katex-plus-mermaid/` | KaTeX and Mermaid                           |
| `/kairos/`                                     | Section with images                         |
| `/terms-of-homelab-alpha/`                     | Long text, many headings                    |

### Manual, by Claude, every phase

- Keyboard only: Tab order, visible focus, `Ctrl /` search, Escape closes
  popovers and menus, skip link.
- Reduce Motion and Reduce Transparency (emulated in Chromium).
- Zoom to 200 % and a larger browser text size: no clipped text.
- Print preview of a docs page.
- The e-reader version still looks as before.

### Manual, by the maintainer, at the end

Devices: Desktop, Laptop, and Smartphone. Browsers: Brave, Safari, and Firefox.
Only results on real devices count as verified.

| Device     | Brave | Safari | Firefox |
| ---------- | ----- | ------ | ------- |
| Desktop    |       |        |         |
| Laptop     |       |        |         |
| Smartphone |       |        |         |

## Test tooling

The scripts are in `tests/` (see `tests/README.md`) and run with npm:
`test:links`, `test:a11y`, `test:screenshots`, and `test:lighthouse`. They are
development tools and do not run in CI. They use three new dev dependencies with
exact versions: `playwright-core` (drives Chromium), `axe-core` (the WCAG
rules), and `lighthouse` (the scores). npm does not download a browser; the
tests use an installed Chrome or Chromium (`CHROMIUM_PATH`).

## Baseline

Measured on `main` on November 24, 2026, before the new design. Screenshots are
in `tests/output/screenshots/baseline/` (local, not in Git).

Links: two broken links, fixed in phase 1: the feed link `/index.xml` in the
head of every docs page (the site builds no feed), and a link to
`trusted-id.info.md` on the shell scripting overview (the file is
`trusted_id.info.md`).

Accessibility (axe-core, WCAG 2.2 AA), 27 violations in 44 runs:

| Rule                          | Where                                                |
| ----------------------------- | ---------------------------------------------------- |
| `scrollable-region-focusable` | Code blocks that scroll cannot get keyboard focus.   |
| `color-contrast`              | A few elements, mostly in dark mode.                 |
| `link-name`                   | 404 page: a link without text.                       |
| `link-in-text-block`          | 404 page and others: links only told apart by color. |

Lighthouse (Performance, Accessibility, Best Practices, SEO), production build:
13 of 20 runs at 100. The alerts page lost Best Practices points only for a
remote image that the local build replaces; it is left out. Below 100:

| Page                                           | Form            | Scores               | Main cause                              |
| ---------------------------------------------- | --------------- | -------------------- | --------------------------------------- |
| `/404.html`                                    | mobile, desktop | 100, 86–87, 100, 100 | Heading order, link names, no `main`    |
| `/back-to-basics/markdown/katex-plus-mermaid/` | mobile          | 91, 100, 100, 100    | Largest Contentful Paint, blocking time |
| `/links/`                                      | mobile          | 99, 100, 100, 100    | Blocking time                           |
| `/terms-of-homelab-alpha/`                     | mobile          | 99, 100, 100, 100    | Largest Contentful Paint                |

## Results per phase

Phase 2 (tokens and appearance): accessibility violations went from 27 to 20;
the color contrast problems are gone. The rest are code blocks without keyboard
access (phase 6) and the 404 page (phase 10). Lighthouse: the same pages below
100 as in the baseline; `/links/` and the terms page now score 100 on mobile.

Phase 3 (toolbar): no new violations after the search field got an accessible
name that starts with its visible text. Lighthouse unchanged.

Phase 4 (sidebar): the sidebar is one recursive template now, with
`aria-expanded` on each group and `aria-current` on the current page. No new
violations; Lighthouse unchanged.

Phase 5 (content): links in the text are underlined, tables scroll in a
focusable region (a table render hook), and the feedback widget is removed with
its template, styles, and translations. No new violations; Lighthouse unchanged.

Phase 6 (code): Prism is gone (its scripts, 297 language files, styles, and
settings). Hugo highlights code at build time; every block has a header with the
language and a copy button, and can be scrolled with the keyboard. The `prism`
shortcode still works. Accessibility violations went from 20 to 8; only the 404
page is left (phase 10). Lighthouse: the KaTeX and Mermaid page now scores 100
on mobile.

Phase 7 (search): the search opens in a popover under the search field. The
field is a combobox and the results a list box; the arrow keys move between the
field and the results, Enter opens a result, and Escape closes the popover and
returns focus to the search field. No violations in the open popover; the totals
are unchanged.

Phase 8 (mobile): below 1200 px a floating bar shows the previous page, "On this
page", and the next page. "On this page" opens the table of contents in a sheet
(a modal dialog). The page dims behind the open menu; Escape closes the menu and
the sheet, and the menu button reports `aria-expanded`. Tests unchanged.

Phase 9 (docs home): `/docs/` has a search field that opens the search, a
"Topics" heading, and a card per topic with a tile in its own color. Other
section lists use the same cards with accent tiles and show the number of items.
The repeated `id="list-item"` is gone. Tests unchanged. Later, at the
maintainer's request, the search field on `/docs/` was removed: the one in the
toolbar is enough.

Phase 10 (landing, links, 404, footer): the landing page, `/links/`, and the 404
page share a site header and a site footer; the 404 page no longer uses the old
Lotus layout. The footer reads "© Homelab-Alpha <year> · Licensed under CC
BY-NC-SA 4.0" with links to License and Terms. No accessibility violations left.
Lighthouse: every test page at 100 (the alerts page loses Best Practices points
only for the remote image that the local build replaces).

Phase 11 (clean up): the old Lotus stack is gone (its base template, header,
footer, head, styles, and scripts), with the old mobile table of contents and
its setting, the feature styles, the Inter font, the alert screenshots, the
landing gradients, the feedback icons, and unused Material icons. The built site
has the same files except the Inter font, and the screenshots are the same as
before the clean up (only the Mermaid diagrams differ by a pixel between runs).
Tests unchanged.

Phase 12 (final check): on a production build with the landing page turned on,
Lighthouse scores 100 in every category on every test page, mobile and desktop,
except Best Practices on the alerts page (96), which only the local placeholder
for its remote image causes. No accessibility violations, and every internal
link resolves (again apart from that placeholder). Manual checks: with Reduce
Transparency the toolbar and the mobile bar are solid, Reduce Motion turns off
the transitions, nothing scrolls sideways at 200 % zoom or with 150 % text, and
the print version shows only the content (the copy buttons are now hidden on
paper). The e-reader version only differs from `main` in the changed content.
The documentation (`CLAUDE.md`, `README.md`, and `assets/icons/README.md`) is up
to date. Left: the maintainer's device tests and the open questions below.

E-reader version (added after phase 12, at the maintainer's request): the
e-reader home page lists the topics and the other pages directly, with the
number of pages per topic. The `alert` and `prism` shortcodes have their own
e-reader templates (a quote with a bold title, and a plain code block), so no
icons, copy buttons, or classes of the full site reach the e-reader pages. Code
blocks have a label with the language, with the same names as the full site
(`layouts/partials/docs/code-label.html`). Math shows as its TeX source in a
labeled block. The table of contents is built from the headings, so its indent
always matches the outline. The footer has a link to the full version of the
page and the same copyright, license, and links as the site footer. Long words
and table cells break, so no page scrolls sideways at 600 px. Tests: no scripts,
SVG, or CSS variables in the e-reader pages; no accessibility violations; every
link resolves; the full site is unchanged.

Security audit (before the pull request, at the maintainer's request), in three
parts:

1. Hardening: `security.toml` allows only the programs (Dart Sass, Git, Go), the
   GET method, and the two image hosts that the build uses. Remote SVGs are
   never put inline. CSS source maps are no longer published in production.
   External links get `noopener noreferrer`. Mermaid is 12.3.0 (DOMPurify
   3.4.17) with `securityLevel: "strict"`. The Dark Visitors workflow has write
   access at job level only.
2. Content Security Policy on every page (`layouts/partials/docs/csp.html`):
   scripts are files with SRI; the three scripts that must run before the first
   paint are inline with their SHA-256 hash; no inline event handlers. The
   e-reader pages, the alias redirects, and the redirect home page have a policy
   without scripts. `.github/scripts/check_csp.py` checks every built page, and
   the Build & Deploy workflow fails on a mismatch.
3. Supply chain and review: `/.well-known/security.txt` (RFC 9116, made on every
   build). The third-party files (Mermaid, KaTeX with its fonts and three
   patches, FlexSearch, Day.js, Simple Scrollspy) are listed with their SHA-256
   in `.github/vendored_assets.json`; Renovate tracks their versions,
   `npm run vendor:update` fetches them, and Build & Deploy checks them.
   Markdown attributes and link URLs are escaped, without event handlers or
   `javascript:` URLs. The review policy asks to review raw HTML in Markdown.

CodeQL still scans the third-party files: excluding them would reduce the
security scanning, so they stay in. Tests: no CSP violations or console errors
on the test pages; search, theme, copy, back to top, the mobile menu, KaTeX,
Mermaid, and the e-reader redirect work; the links and tables have the same
attributes as before.

Appearance and toolbar (after the final check, at the maintainer's request): the
segmented control (Light, Dark, Auto) is now a HIG toggle switch between light
and dark. Auto is still the default but has no button: without a choice the site
follows the system, and flipping the switch to the theme of the system removes
the choice again. The switch takes its position from `data-dark-mode`, so it is
right at the first paint. The toolbar has no icon items anymore: the GitHub and
GitHub Community icons are gone (also from the site header), and Links is a row
below a separator at the bottom of the sidebar.

Topic colors (at the maintainer's request): every docs topic has a fixed tile
color in its front matter (`color` in `content/docs/<topic>/_index.md`). The
docs home, the topics and projects on the landing page, and the projects on
`/links/` use it (`layouts/partials/docs/tile-color.html`), so a topic has the
same color everywhere. Pages, the sidebar, and the community links keep the
accent color.

FAQ and About Us (at the maintainer's request): the `<br />` spacers are gone.
Every FAQ question is a disclosure row (`faq` shortcode, a native `<details>`
element without a script); the rows of a section form one inset grouped list.
About Us shows the banner with rounded corners, the repositories as the
topic-colored cards of `/links/` (`project-cards` shortcode, from
`data/links.yaml`), and the disclaimer as an info alert. The e-reader version
shows the questions with their answers and the repositories as a plain list.

Theme menu (at the maintainer's request): the toggle switch is replaced by a
theme menu after the theme settings of GitHub. The button opens a panel with the
theme mode (System, the default; Light; Dark), the light theme (Default,
Protanopia and deuteranopia, Tritanopia), the dark theme (the same, and Dimmed),
and two switches to increase the contrast in light and dark mode. The contrast
follows `prefers-contrast: more` until the visitor flips a switch. The variants
are the GitHub themes of `@primer/primitives` 11.10.0, set on `html[data-theme]`
in `structure/_themes.scss`; the choices are saved in `localStorage` and applied
before the first paint (`darkmode-init.js`). The code colors (Chroma) and the
topic colors stay the same in every variant.

Accessibility (at the maintainer's request): every page starts with a skip link
to the page content (`partials/skip-link.html`). An "Aa" reading menu next to
the theme menu sets the font (the default, Atkinson Hyperlegible, or
OpenDyslexic), the text size (S, M, L, XL), the spacing (normal, or wide after
WCAG 1.4.12), a narrow text column, and reduced motion, with a preview and a
reset (`partials/reading-menu.html`, `js/toolbar-menus.js`). The fonts come from
Fontsource on npm (`.github/vendored_assets.json`) and load only when chosen;
OpenDyslexic has Latin only. When the site has more than one language, a globe
menu lists the languages (`partials/language-menu.html`). Every text of the
menus is in `i18n/`, and the panels use logical CSS properties, so they also
work in right-to-left languages. The images on About Us have descriptive alt
texts.

## Open questions for the end

- Which items go in the toolbar? First answered: keep GitHub, GitHub Community,
  and Links. Later changed by the maintainer: GitHub and GitHub Community are
  gone, and Links is a row at the bottom of the sidebar.
- Is the footer without "Developed by GJS" right? Answered: yes, keep it as it
  is.

## Progress

| Phase                           | Status                        |
| ------------------------------- | ----------------------------- |
| 1. Baseline                     | Done                          |
| 2. Tokens and appearance        | Done                          |
| 3. Toolbar                      | Done                          |
| 4. Sidebar                      | Done                          |
| 5. Content                      | Done                          |
| 6. Code                         | Done                          |
| 7. Search                       | Done                          |
| 8. Mobile                       | Done                          |
| 9. Docs home                    | Done                          |
| 10. Landing, links, 404, footer | Done                          |
| 11. Clean up                    | Done                          |
| 12. Final check                 | Done, except the device tests |
