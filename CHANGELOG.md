# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add a brand guide and branding files in `.github/branding/` (logo, icons,
  favicon, and social preview), and show the logo at the top of `README.md`
- Add the `badges.yml` workflow and `.github/scripts/generate_badges.py` to render the
  README badges, including Super Linter and CodeQL, as SVG files on the `badges`
  branch
- feat(workflows): add dark visitors agents update workflow [253800d](https://github.com/homelab-alpha/docs/commit/253800d6a89cd4e13fe74bcb125fe7d46b9edcb2) by [@homelab-alpha](https://github.com/homelab-alpha)
- feat(fonts): self-host Inter and JetBrains Mono [e0d6d51](https://github.com/homelab-alpha/docs/commit/e0d6d51d692d593efa4f7060661821ee5342028f) by [@homelab-alpha](https://github.com/homelab-alpha)

### Changed

- Move the repository tooling (`lint.sh`, `generate_badges.py`, `setup_gpg.sh`,
  and `verify_signatures.sh`) from `scripts/` to `.github/scripts/`, the
  branding from `assets/branding/` to `.github/branding/`, and the code style
  guide from `docs/` to `.github/docs/`, and update the links to the code style
  guide on the site
- Add a 20 px protective border to the logo SVGs and show the logo in
  `README.md` at a fixed height of 100 px
- Update the badges only after Lint Repository and CodeQL ran and passed for the
  same commit: remove the `push` trigger from `badges.yml` and add the
  `check-workflows` job
- Update the `ssl_dotfiles_installer.info` page to version 2.7.0 of the script,
  which no longer lists the `docs` and `assets` folders and the badge script,
  because they now live in `.github`
- Replace the `img.shields.io` badges in `README.md` with the self-hosted
  badges
- Explain in `.github/super_linter.env` when to enable PowerShell validation
- Explain in `codeql.yml` when to add a language
- Ignore `notes.md`, `super_linter.log`, and Python cache files in `.gitignore`
- Update Dart Sass to 1.107.1 in the Hugo workflow
- Track the Dart Sass version with Renovate
- Run the Dark Visitors agents workflow every 8 hours instead of every 3 hours
- Update the FAQ with the current contribution, license, support, and security
  answers
- Replace ChatGPT with Claude in the AI notice of all pages and in the FAQ
- Update the About Us page with the current repositories, notes, and documents
- Update the contribution statements to match the repositories
- Update the How to Contribute, Code Style and Standards Guides, and Terms pages
  to match the current repository files
- Update the Docker image tags in the Dozzle, Portainer, Portainer Edge Agent,
  and Watchtower pages
- Replace the deprecated `deny-licenses` option in `dependency_review.yml` with
  an `allow-licenses` list of permissive licenses and CC BY-NC-SA 4.0, so GPL
  and LGPL stay blocked
- Check development dependencies too in `dependency_review.yml`, by setting
  `fail-on-scopes` to `runtime, development`
- docs: sync documentation with source repositories [41253c7](https://github.com/homelab-alpha/docs/commit/41253c79777ce16814e9b9c25001ee6224a2d33c) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(back-to-basics): update guides to current information [d9087b6](https://github.com/homelab-alpha/docs/commit/d9087b6b57e8bdc4a2348c2c2b24e5fa96304ec2) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(linux): update guides to current information [fef3a2b](https://github.com/homelab-alpha/docs/commit/fef3a2b4028f93ab8674abfcb2b21b0b914b6dd7) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs: sync documentation with the fixed source repositories [68e69ff](https://github.com/homelab-alpha/docs/commit/68e69ffa52356fbe7546bb33970fd38c1a4169a2) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore: harden workflows, dependencies, and secret scanning [d4a643a](https://github.com/homelab-alpha/docs/commit/d4a643ad54e891293cfe1082281c01650b74e677) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(layouts): switch the Sass transpiler to Dart Sass [3e11e0e](https://github.com/homelab-alpha/docs/commit/3e11e0eedb55beb5c8a4268a52d6b97a177ac9ed) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(deps): update Prism fix, Day.js, and Bootstrap module [38c24ce](https://github.com/homelab-alpha/docs/commit/38c24cecf77ea1b94bee964f4fe7712f87893723) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(ci): run the Hugo build check on pull requests that change site files [82aca9c](https://github.com/homelab-alpha/docs/commit/82aca9cf8641b7deb6a68575f6daed62e19c6fb1) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(deps): update FlexSearch to 0.8.212 [3fd2834](https://github.com/homelab-alpha/docs/commit/3fd2834eca5491f1deeea491be2e8c4095fce136) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(scss): use @use for the KaTeX stylesheet [f6fba5d](https://github.com/homelab-alpha/docs/commit/f6fba5d840ea0697dafed6726cfb450fddaaa6f2) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(layouts): silence unfixable Dart Sass deprecation warnings [89b77f0](https://github.com/homelab-alpha/docs/commit/89b77f068f99ebf13d6cd1b71071fc33568d176d) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(ci): pin Dart Sass, add timeouts, and stop persisting checkout credentials [1310d54](https://github.com/homelab-alpha/docs/commit/1310d549d941630ff1a4eb54c793f3915d779fa9) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore: remove the unused DocSearch integration [3b22d46](https://github.com/homelab-alpha/docs/commit/3b22d464ba7e02d44654a3e0f34b73fdf334fb8d) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore: adopt the blueprint template as the repository standard [bb50cf3](https://github.com/homelab-alpha/docs/commit/bb50cf33b00a151371cced2319f725f66dc857eb) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(deps): comment on the pull request only when the dependency review fails [cbc9e0e](https://github.com/homelab-alpha/docs/commit/cbc9e0e8a0d9ee19cd95bd4ec9c5defe4ed55622) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs: add CLAUDE.md with the project rules for Claude Code [864fc83](https://github.com/homelab-alpha/docs/commit/864fc83b80d50334a51e7b0c0ee321663a8c7c27) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(docker): sync image tags with compose files [b65b1dd](https://github.com/homelab-alpha/docs/commit/b65b1dda18325a5a12752465a44fdec5503345a4) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(contributing): sync pages with repository files [d198a45](https://github.com/homelab-alpha/docs/commit/d198a455c035c93e465c8d5662ed169cc85cfc4b) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(overview): fix license section and link [8a5ae1d](https://github.com/homelab-alpha/docs/commit/8a5ae1d797dafe7925640a3c7a6d39fd8bbf8f96) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(quickstart): clone to the expected locations [c10e822](https://github.com/homelab-alpha/docs/commit/c10e822aad27ac8b7db14aa1631f4c158cb37cfc) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs: remove the notice and update the about page [bc81203](https://github.com/homelab-alpha/docs/commit/bc81203bfdac92e4f3dca07392a030b85d9981a2) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(faq): update the FAQ and name Claude as the AI [af741bb](https://github.com/homelab-alpha/docs/commit/af741bbf3e78b39f14c323e3dbcc01159679c60c) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(workflows): run the agents update every 8h [24c1425](https://github.com/homelab-alpha/docs/commit/24c14254a7f039ff34810821a615ad97b440babd) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(deps): update dart sass to 1.107.1 [0db87ad](https://github.com/homelab-alpha/docs/commit/0db87ad72fcfa390da0dec93dd286038be4889ba) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(repo): adopt the current blueprint standard [3712af6](https://github.com/homelab-alpha/docs/commit/3712af6efa728e8928768c3c19ccdb4a2fea5012) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(openssl): update the installer page [c6505fd](https://github.com/homelab-alpha/docs/commit/c6505fd2d0833f83cc5e73fcbfd38652a2a7c372) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(repo): sync the latest blueprint updates [42cfdde](https://github.com/homelab-alpha/docs/commit/42cfdde71cc396bceb3319e271d8c3d39fee5c2f) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(openssl): update the installer page to 2.7.0 [eec7562](https://github.com/homelab-alpha/docs/commit/eec7562959d631bd72751d9edbf45d7d81852098) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(workflows): replace deny-licenses with allow-licenses [ec2ced3](https://github.com/homelab-alpha/docs/commit/ec2ced328ca41b2a365fd08e951e4820db74a964) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(blueprint): sync with the blueprint [13e8215](https://github.com/homelab-alpha/docs/commit/13e82153c39432669feaf45f38ccccc61f51ac9d) by [@homelab-alpha](https://github.com/homelab-alpha)

### Deprecated

### Removed

- Remove the Notice page

### Fixed

- Fix the GitHub link in `NOTICE`, which pointed to `github.com/docs`
  instead of `github.com/homelab-alpha`
- Fix the contribute links in the overview pages
- Fix the table of contents link of `CONTRIBUTING.md` to its first heading
- Clone the dotfiles and OpenSSL repositories to `~/dotfiles` and `~/openssl` in
  the quickstart guides, and remove the reference to a script that does not
  exist
- Fix the broken license link and the outdated copyright year in the AdGuard
  Home, Docker, dotfiles, OpenSSL, and shell script overview pages
- Rename three page files that did not follow the file naming convention
- fix(layouts): replace deprecated .Params lookups and add dry run to Hugo workflow [1d55279](https://github.com/homelab-alpha/docs/commit/1d55279b4a0cf1c6e05d49ba15064b2ca7c48943) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(renovate): fix invalid automergeType and vulnerability rule [8411f0a](https://github.com/homelab-alpha/docs/commit/8411f0a9b79a08535934ae0c5babd2fc4f1e6914) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(katex): replace all backslashes and asterisks in string escaping [773ed20](https://github.com/homelab-alpha/docs/commit/773ed20884092d917f60dd6b110d080043b40555) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(workflows): match the new agent-name markup on Known Agents [46964fb](https://github.com/homelab-alpha/docs/commit/46964fbebb0b11cc2ebd2f46b0885eef98b5209e) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(gitleaks): restore the allowlists for the documentation examples [77ffb28](https://github.com/homelab-alpha/docs/commit/77ffb28cb6af6d53b9dcf428b913f04350556615) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(labels): skip unchanged labels and retry failed writes [91809ee](https://github.com/homelab-alpha/docs/commit/91809eef8c68b2de9e11a6656d406e05276a6b1b) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(docs): rename page files to the naming convention [f390280](https://github.com/homelab-alpha/docs/commit/f390280a5adcd734ce107e15edb4b6c2c8bfd2f4) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(docs): fix the TOC link to the first heading [8e346f8](https://github.com/homelab-alpha/docs/commit/8e346f89b3916e5d6d7ac75703bbba970e8a6b04) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(changelog): remove the date from Unreleased [0ee84fc](https://github.com/homelab-alpha/docs/commit/0ee84fc1c30264553ec73aa3ca557b307fdcb23d) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(changelog): remove the Unreleased link [75fc4a1](https://github.com/homelab-alpha/docs/commit/75fc4a18aaea0b19845eab3910446aba124a48f0) by [@homelab-alpha](https://github.com/homelab-alpha)

### Security

- Override the transitive dev dependencies `glob` (14.0.3) and `minimatch`
  (11.0.3) to fix Dependabot alerts, which textlint pulls in
