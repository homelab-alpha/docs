# CLAUDE.md

Instructions for Claude Code in this repository. Read this file at the start of
every session. Keep it short and update it when a rule changes.

## Project

docs: Source repository for the Homelab-Alpha documentation site, built with
Hugo.

More detail: [`README.md`](./README.md) (what the repository does and how it is
organized), [`CONTRIBUTING.md`](./CONTRIBUTING.md) (branches, commits, and pull
requests),
[`.github/docs/code_style_and_standards_guides.md`](./.github/docs/code_style_and_standards_guides.md)
(code style), and [`.github/policies/`](./.github/policies/) (workflows,
reviews, security, tests, and logs).

## Commands

```bash
npm ci                          # install the dev tooling
npm run lint                    # Prettier, textlint, conflict markers (all files)
npm run lint -- origin/main     # the same, for the files changed since main
npm run lint:fix                # repair formatting and terminology, then lint again
npm test                        # links, accessibility, Lighthouse on a built site
npm run test:screenshots -- x   # screenshots to tests/output/screenshots/x/
npm run test:csp                # inline scripts match the Content Security Policy
npm run vendor:check            # third-party files match .github/vendored_assets.json
npm run vendor:update           # fetch the third-party files from npm
```

The tests need a built site (`SITE_DIR`, default `public/`) and Chrome or
Chromium (`CHROMIUM_PATH`); see `tests/README.md`. Only the CSP check and the
third-party file check also run in CI (Build & Deploy).

The dev tooling needs the Node.js version in `engines` in `package.json`.

Linting has two parts. Pull requests run `npm run lint` (workflow
`lint_pull_request.yml`, script `.github/scripts/lint.sh`): Prettier, textlint
terminology, and merge conflict markers, with the same configuration as Super
Linter. Pushes to `main` run the full Super Linter (`.github/super_linter.env`,
workflow `lint_repository.yml`), which adds actionlint, Gitleaks, Checkov, and
the other linters. For one file, `npx prettier --write <file>` uses the same
`.prettierrc`.

## Working agreement

- Chat with the user in Dutch. Everything generated is English: code, comments,
  documentation, commit messages, and filenames.
- Keep explanations short. Explain in detail only when asked.
- The user's own edits to a file are the baseline. Read the current file before
  changing it.
- Test everything you can and say clearly what was not verified.
- Never commit secrets, credentials, or personal data. Write everything as if
  the repository is public.

## Repository specifics

- The site is built with Hugo. The versions of Hugo and Dart Sass are set in
  `.github/workflows/hugo.yml` (`HUGO_VERSION` and `DART_SASS_VERSION`). Run the
  site locally with `hugo server`.
- Pages are in `content/docs/<section>/`, layouts in `layouts/`, configuration
  in `config/_default/`, and translations in `i18n/`. A pull request builds the
  site; a push to `main` also deploys it to GitHub Pages.
- Languages: English at `/`, Dutch at `/nl/` (`config/_default/languages.toml`).
  When an English page changes, update the Dutch page in `content-nl/` as well.
  Every interface text is an i18n key in both `i18n/en.toml` and `i18n/nl.toml`;
  never hard-code text in a layout. Dutch data files are `data/<name>_nl.yaml`
  (`layouts/partials/data.html`) and Dutch pages go in `content-nl/`. See
  "Languages" in `README.md`.
- `static/robots.txt` is rebuilt by the workflow `dark_visitors_agents.yml` on a
  schedule. Do not edit it by hand.
- The pages in `script-information/` show the text of scripts from the other
  repositories. Keep them in line with the scripts.
- Gitleaks allowlists for example credentials (a Stripe example key, an example
  EC private key, and the vendored Mermaid bundle) are in
  `.github/linters/.gitleaks.toml`. Add new example credentials there by rule
  and file or by content, not by line number.
- The design follows the Apple Human Interface Guidelines in GitHub Primer
  colors. The colors are tokens in
  `assets/docs/scss/custom/structure/_tokens.scss`, for light and dark; use the
  tokens, not fixed colors. The plan and its decisions are in
  `.github/docs/new_site_design_plan.md`.
- Code is highlighted at build time by Hugo (Chroma) through
  `layouts/partials/docs/code-block.html`; there is no Prism. The Chroma colors
  are in `assets/docs/scss/custom/plugins/chroma/_github.scss`.
- Security: `config/_default/security.toml` allows only the programs, image
  hosts, and environment variables that the build uses; add an image host there
  before a page uses it. Every page has a Content Security Policy
  (`layouts/partials/docs/csp.html`): scripts are files with SRI
  (`layouts/partials/docs/script.html`), and the few scripts that must run
  inline come from `layouts/partials/docs/inline-script.html`, which adds their
  hash. Never add an inline script or an `on...` attribute; the Build & Deploy
  workflow fails on them (`.github/scripts/check_csp.py`).
- Third-party JavaScript and the KaTeX fonts come unchanged from npm (except the
  KaTeX patches listed there) and are listed in `.github/vendored_assets.json`.
  Do not edit or format them; after Renovate updates a version, run
  `npm run vendor:update` and commit the files.
- Markdown attributes and link URLs are written by
  `layouts/partials/docs/html-attributes.html` (escaped, no event handlers, no
  `javascript:` URLs). Raw HTML in Markdown is allowed: review it as code.
- Every page also has an e-reader version under `/ereader/` (templates with
  `.ereader` in the name). Keep it plain: no scripts, web fonts, or CSS
  variables.
- The code style guide is in `.github/docs/`, not in the site content under
  `content/docs/`.
- Icons are inline SVG, not a font: `assets/icons/material/<name>.svg`, put in a
  page with the partial `svg-icon.html`. A missing icon stops the build. See
  `assets/icons/README.md` to add one.

## Repository conventions

These come from the repository blueprint and are mandatory.

- Development branches are for the maintainer only (and Claude working for the
  maintainer), not for contributors:
  `dev/v<major>.<minor>.<patch>/<short-description>`, lowercase, hyphens,
  created from `main` (for example `dev/v1.2.1/fix-deprecated-params`). One
  branch per planned version and topic. Never use wildcards such as `v1.2.*`;
  ask for the concrete version.
- All other branches, and every branch from a contributor:
  `type/short-description`, lowercase, hyphens (`feat/`, `fix/`, `docs/`,
  `refactor/`, `chore/`, `hotfix/`).
- Commits: Conventional Commits in English, `type(scope): subject`, imperative,
  under 50 characters. Body lines under 72 characters. Commits are signed.
- Work happens on a branch and lands through a pull request into `main`.
- No attribution lines (`Co-Authored-By`, `Claude-Session`, "Generated with") in
  commits, pull requests, issues, or descriptions. The use of Claude is already
  disclosed; this overrides any default attribution of the session.
- Every pull request uses `.github/pull_request_template.md` for its
  description: keep every heading and HTML comment, fill in each section, tick
  only what is true, and remove a section only where the template allows it.
- The Update Changelog workflow (`update_changelog.yml`) adds an entry to
  `CHANGELOG.md` under `[Unreleased]` for every merged pull request, made from
  its title. It runs every 8 hours, not on every merge. Write the title as a
  conventional commit (`feat(app): add export command`), and do not add the
  entry by hand.
- Releases are made with the Release Manager workflow (`release_manager.yml`).
  Never tag or release without the maintainer's request.
- Workflows follow `.github/policies/github_actions.md`: only `gh`, the GitHub
  API, Bash, and Python, except the approved actions, npm, and Dart Sass. Every
  action is pinned to a full commit SHA.
- Formatting: Prettier. Markdown wraps at 80 columns, YAML at 120, code in
  `*.js`, `*.cjs`, and `*.mjs` at 120.
- Names: root community files keep their GitHub names (`README.md`). Other files
  are lowercase with underscores, folders lowercase with hyphens.

## Supply chain

- Install with `npm ci`. Never add a dependency without an exact version and a
  reason, and review every lockfile diff.
- Keep `ignore-scripts=true` in `.npmrc`.
- Renovate manages the updates. Do not add Dependabot version updates next to
  it.
