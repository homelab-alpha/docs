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
- feat(badges): add the Hugo deploy badge [e7cb258](https://github.com/homelab-alpha/docs/commit/e7cb2589f4d93f7661435c92beb4e286d2a76bd5) by [@homelab-alpha](https://github.com/homelab-alpha)
- feat(site): add lightweight e-reader version [bc91ed4](https://github.com/homelab-alpha/docs/commit/bc91ed44c3a615af56f8157a0a949963efc88eb0) by [@homelab-alpha](https://github.com/homelab-alpha)

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
- chore(scss): use @use for the KaTeX styles heet [f6fba5d](https://github.com/homelab-alpha/docs/commit/f6fba5d840ea0697dafed6726cfb450fddaaa6f2) by [@homelab-alpha](https://github.com/homelab-alpha)
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
- ci(workflows): use pull_request_body.py [05061a8](https://github.com/homelab-alpha/docs/commit/05061a85263aa5651ba2d96461c3e44f68cc5516) by [@homelab-alpha](https://github.com/homelab-alpha)
- ci(workflows): request a reviewer on bot PRs [811d200](https://github.com/homelab-alpha/docs/commit/811d200cff1eb5e5eed2057d730a7dc35f27b16f) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(policy): describe the Hugo and Dart Sass checks [55f13a4](https://github.com/homelab-alpha/docs/commit/55f13a405e8afd81cd87c8cfdce4286a92b44cc4) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(github): sync runners, Renovate, and linters [02c92ec](https://github.com/homelab-alpha/docs/commit/02c92ecde0e67fd775204f23bbf4e551cc1e6bab) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs: sync pages with the repositories [9e5ae7d](https://github.com/homelab-alpha/docs/commit/9e5ae7d6143543281b27c67a82ce60b9cf03d337) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(kairos): add draft Kairos pages [1c71f4f](https://github.com/homelab-alpha/docs/commit/1c71f4f9bbc2b21a4929a9df85797297e45feeaa) by [@homelab-alpha](https://github.com/homelab-alpha)
- ci(workflows): run workflows for bots [cdaaa25](https://github.com/homelab-alpha/docs/commit/cdaaa25381733f22c826fc058fc4feab52388070) by [@homelab-alpha](https://github.com/homelab-alpha)
- ci(workflows): allow BlueOak-1.0.0 license [98b8b99](https://github.com/homelab-alpha/docs/commit/98b8b9960687f1aeeef8770c667ce6067d5f0bbf) by [@homelab-alpha](https://github.com/homelab-alpha)
- ci(hugo): read Dart Sass digest from release [24a5f03](https://github.com/homelab-alpha/docs/commit/24a5f0326148375bfc89fd03348536a0e25aec1f) by [@homelab-alpha](https://github.com/homelab-alpha)
- refactor(site): trim e-reader header, footer [5199062](https://github.com/homelab-alpha/docs/commit/519906285c914aabc7374ca403792d8fd49417eb) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(readme): sync counts and workflow table [4741484](https://github.com/homelab-alpha/docs/commit/4741484e458d0353ceb05036d8931a4ef62cea7a) by [@homelab-alpha](https://github.com/homelab-alpha)
- chore(labels): add dependency update labels [0b02d11](https://github.com/homelab-alpha/docs/commit/0b02d11267a8caaf03b43c781b03cb5b424b4dc5) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(openssl): sync script pages with 2.5.4 [2c9875b](https://github.com/homelab-alpha/docs/commit/2c9875be1d30f2db9ed937a8c253a332d34d8f33) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(openssl): sync and add script pages [197140e](https://github.com/homelab-alpha/docs/commit/197140eb697efda65a6e62a95a68e1b3ec397693) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(openssl): add revoke script page [3bfa2b6](https://github.com/homelab-alpha/docs/commit/3bfa2b621709a2f75a9ff83a6a2333db2cc5e9f9) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(openssl): rename ssl script pages to tls [70010e4](https://github.com/homelab-alpha/docs/commit/70010e4421ed68c2308945268da656d5e74cd6c3) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(openssl): update the overview and quickstart [16b0a26](https://github.com/homelab-alpha/docs/commit/16b0a266eb958f70b3fa8ca548887645f01c3a3e) by [@homelab-alpha](https://github.com/homelab-alpha)
- docs(openssl): use example.test in the examples [d8008bc](https://github.com/homelab-alpha/docs/commit/d8008bc12473e5597dc7a52c837eed1075e6703a) by [@homelab-alpha](https://github.com/homelab-alpha)

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
- fix(changelog): natural language from `stylesheet` to style sheet [d9297f8](https://github.com/homelab-alpha/docs/commit/d9297f88f5f8721f786a101ee51ca99b4ab3dc25) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(changelog): use the correct term in an entry [abf6928](https://github.com/homelab-alpha/docs/commit/abf6928b1c323456b7b76662a6335c5a2e586d94) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(site): show last updated on documents only [57f16d0](https://github.com/homelab-alpha/docs/commit/57f16d01708b9aa6188d737796819259bc184f67) by [@homelab-alpha](https://github.com/homelab-alpha)
- fix(site): remove double rule above e-reader footer [7cdd9f8](https://github.com/homelab-alpha/docs/commit/7cdd9f8fed3f49eaa5a41fd707e5d613e81fe3cf) by [@homelab-alpha](https://github.com/homelab-alpha)

### Security

- Override the transitive dev dependencies `glob` (14.0.3) and `minimatch`
  (11.0.3) to fix Dependabot alerts, which textlint pulls in
