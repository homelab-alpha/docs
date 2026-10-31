# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased] - 2026-10-29

### Added

- Add a brand guide and branding files in `assets/branding/` (logo, icons,
  favicon, and social preview), and show the logo at the top of `README.md`
- Add the `badges.yml` workflow and `scripts/generate_badges.py` to render the
  README badges, including Super Linter and CodeQL, as SVG files on the `badges`
  branch

### Changed

- Update the `ssl_dotfiles_installer.info` page to version 2.6.0 of the script,
  which also removes the `assets` folder and the badge script
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

### Security

[Unreleased]: https://github.com/homelab-alpha/docs/compare/main...HEAD

---
