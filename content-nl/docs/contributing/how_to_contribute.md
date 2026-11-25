---
title: "Hoe je bijdraagt"
description:
  "Leer hoe je code bijdraagt, de documentatie verbetert en de community van
  Homelab-Alpha steunt."
url: "contributing/contribute"
aliases: ""
icon: "volunteer_activism"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Homelab-Alpha
series:
  - Contributing
tags:
  - code contribution
  - documentation improvement
  - community support
  - bug reporting
  - feature requests
  - GitHub flow
keywords:
  - code contribution
  - documentation improvement
  - community support
  - bug reporting
  - feature requests
  - GitHub flow
  - pull request
  - conventional commits
  - issue reporting
  - bug report template
  - feature request template
  - Homelab-Alpha discussions

weight: 3003

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
De volgende projecten van **Homelab-Alpha** nemen bijdragen van de community
aan:

**Repository's van Homelab-Alpha die open staan voor externe bijdragen:**

- **[AdGuard Home]**
- **[Docker]**
- **[dotfiles]**
- **[OpenSSL]**
- **[Shell Script]**
- **[Docs]**
  {{% /alert %}}

Bedankt voor je interesse om bij te dragen aan **docs**! Alle soorten bijdragen
zijn welkom: van bugmeldingen en verzoeken om functies tot verbeteringen aan de
code en de documentatie. Deze handleiding legt uit wat je moet weten om goed bij
te dragen.

{{% alert context="primary" %}}
Lees dit document goed voordat je een bijdrage instuurt. Niet elke pull request
wordt aangenomen. Als je deze richtlijnen volgt, verloopt de review voor
iedereen soepel en efficiënt.
{{% /alert %}}

## Gedragscode {#code-of-conduct}

Dit project volgt de
[gedragscode van het Contributor Covenant 3.0](https://github.com/homelab-alpha/docs/blob/main/CODE_OF_CONDUCT.md).
Door mee te doen aan dit project ga je akkoord met de voorwaarden daarvan.
Behandel iedereen met respect en help ons een gastvrije en inclusieve community
te houden.

Om een mogelijke overtreding van de gedragscode te melden, **stuur je een e-mail
naar het [team van Homelab-Alpha](mailto:homelab.api@gmail.com)**.

## Aan de slag {#getting-started}

### Vereisten {#prerequisites}

Zorg dat je het volgende hebt ingericht voordat je bijdraagt:

- **Git**: voor versiebeheer.
- **Node.js** (de versie in `engines` in `package.json`) en **Bash 4 of hoger**:
  om `npm run lint` uit te voeren. Installeer op macOS een nieuwere Bash met
  `brew install bash`.
- Een **GitHub-account**: nodig om issues en pull requests in te sturen.
- Kennis van het doel van het project: lees de
  [README](https://github.com/homelab-alpha/docs/blob/main/README.md) om te
  begrijpen wat docs is en hoe het werkt.

### Forken en klonen {#fork-and-clone}

1. Fork de repository met **Fork** bovenaan de
   [GitHub-pagina](https://github.com/homelab-alpha/docs).
2. Kloon je fork naar je computer:

   ```bash
   git clone https://github.com/ < your-username > /docs.git
   cd docs
   ```

3. Voeg de upstream-remote toe, zodat je je fork actueel kunt houden:

   ```bash
   git remote add upstream https://github.com/homelab-alpha/docs.git
   ```

4. Synchroniseer je fork voordat je aan het werk gaat:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

## Hoe je bijdraagt {#how-to-contribute}

### Bugs melden {#reporting-bugs}

Kom je een bug tegen,
[open dan een bugmelding](https://github.com/homelab-alpha/docs/issues/new?template=bug_report.yml)
met ons sjabloon. Zoek eerst in de
[bestaande issues](https://github.com/homelab-alpha/docs/issues) om dubbele
meldingen te voorkomen.

Een goede bugmelding bevat:

- Een duidelijke en beschrijvende titel.
- Stappen om het probleem na te bootsen.
- Wat je verwachtte en wat er echt gebeurde.
- Relevante logs of foutmeldingen.
- Gegevens over je omgeving (besturingssysteem, softwareversie, runtime
  enzovoort).

### Beveiligingslekken melden {#reporting-security-vulnerabilities}

{{% alert context="warning" %}}
Meld beveiligingslekken **niet** via openbare GitHub-issues.
{{% /alert %}}

Volg het proces in ons
[beveiligingsbeleid](https://github.com/homelab-alpha/docs/blob/main/SECURITY.md).
Stuur een privé
[GitHub Security Advisory](https://github.com/homelab-alpha/docs/security/advisories/new)
in en laat het team daarna weten door een
[beveiligingsissue te openen](https://github.com/homelab-alpha/docs/issues/new?template=security_report.yml)
met alleen de URL van de advisory, zonder gevoelige details in het issue zelf.

We proberen binnen **72 uur** op meldingen van lekken te reageren.

### Functies voorstellen {#requesting-features}

Verzoeken om functies lopen via
[GitHub Discussions](https://github.com/homelab-alpha/docs/discussions/categories/feature-request).
Zoek eerst in de bestaande discussies voordat je een nieuwe opent, en geef
zoveel mogelijk context: het probleem dat je oplost, je voorgestelde oplossing
en de alternatieven die je hebt overwogen.

### De documentatie verbeteren {#improving-documentation}

Verbeteringen aan de documentatie worden altijd gewaardeerd. Denk aan typfouten
verbeteren, bestaande tekst verduidelijken of ontbrekende informatie toevoegen.
Volg dezelfde afspraken voor branches en commits als hieronder, en gebruik het
committype `docs`.

### Codewijzigingen insturen {#submitting-code-changes}

Codebijdragen zijn welkom! Zorg dat je wijzigingen passen bij de doelen van het
project en dat je de richtlijnen in dit document volgt voordat je een pull
request opent.

Gebruik je AI-tools, lees dan eerst het
[AI-beleid voor bijdragen](https://github.com/homelab-alpha/docs/blob/main/.github/policies/ai_contribution_policy.md).
Je blijft volledig verantwoordelijk voor alles wat je instuurt.

## Richtlijnen voor ontwikkeling {#development-guidelines}

### Namen van branches {#branch-naming}

Maak voor elke bijdrage een nieuwe branch. Branches hebben deze vorm:

```none
type/short-description
```

- Gebruik alleen **kleine letters**.
- Scheid woorden met **koppeltekens**.
- Houd de beschrijving **kort en specifiek** (minder dan 50 tekens).

| Voorvoegsel | Doel                                       |
| :---------- | :----------------------------------------- |
| `feat/`     | Nieuwe functies                            |
| `fix/`      | Bugfixes                                   |
| `docs/`     | Wijzigingen in de documentatie             |
| `refactor/` | Code herstructureren (geen functie of fix) |
| `chore/`    | Algemeen onderhoud                         |
| `hotfix/`   | Dringende fixes in productie               |

**Goede voorbeelden:**

```none
feat/add-json-export
fix/null-reference-on-empty-list
docs/update-readme-installation
chore/update-dependencies
```

**Foute voorbeelden:**

```none
bugfix-123          (missing type prefix)
Feature/AddExport   (wrong casing)
update              (too vague)
```

#### Ontwikkelbranches (alleen voor de beheerder) {#development-branches-maintainer-only}

De beheerder werkt aan een geplande versie in een ontwikkelbranch. Bijdragers
gebruiken deze branches niet; zij gebruiken de vorm `type/short-description`
hierboven.

```none
dev/v<major>.<minor>.<patch>/short-description
```

- Maak de branch vanaf `main`, met één branch per geplande versie en onderwerp.
- Gebruik **kleine letters** en **koppeltekens** in de beschrijving.
- Gebruik een concrete versie. Jokertekens zoals `v1.2.*` zijn niet toegestaan.
- De pull request gaat nog steeds naar `main`.

**Goede voorbeelden:**

```none
dev/v1.2.0/add-dry-run-option
dev/v1.2.1/fix-deprecated-params
```

### Commitberichten {#commit-messages}

Alle commitberichten zijn in het **Engels** en volgen de specificatie
[Conventional Commits](https://conventionalcommits.org). Voor een snel
overzicht, zie het
[spiekbriefje voor Conventional Commits](https://github.com/homelab-alpha/docs/blob/main/.github/docs/conventional_commits_cheatsheet.md).

**Vorm:**

```none
type(scope)!: brief subject
```

- Het **type** is een van: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`,
  `test`, `chore`, `revert`, `build`, `ci`. `hotfix` is alleen een voorvoegsel
  voor branches, geen type: een dringende fix op een `hotfix/`-branch heeft het
  type `fix`.
- De **scope** is optioneel en geeft aan welk deel van de code verandert
  (bijvoorbeeld `core`, `data`, `cli`).
- Het **onderwerp** is in de gebiedende wijs en korter dan **50 tekens**.
- Markeer een **brekende wijziging** van elk type met `!` direct voor de dubbele
  punt (`feat(api)!: remove the v1 endpoints`). Gebruik `!` ook in de titel van
  de pull request.

**Optionele body:**

- Laat een lege regel na de kop.
- Leg uit _wat_ er veranderde en _waarom_ (niet hoe).
- Gebruik opsommingstekens (`-`) voor meerdere punten.
- Houd regels korter dan **72 tekens**.

**Optionele footer:**

- Laat een lege regel na de body.
- Gebruik een token, dan `: ` of ` #`, en dan een waarde (`Refs: 1a2b3c4`,
  `Closes #42`).
- Beschrijf een brekende wijziging met `BREAKING CHANGE: <description>`, in
  hoofdletters.

**Voorbeelden:**

```git
feat(cli): add JSON export command
```

```git
fix(parser): handle null reference on empty input

- Added a null check before iterating over the entries.
- Updated unit tests to cover the empty-input edge case.
```

```git
docs: update installation steps in README
```

### Codestijl {#code-style}

We gebruiken **Prettier** om code automatisch op te maken. Zorg dat je code
consequent is opgemaakt voordat je commit.

Volg deze algemene principes:

- **Consistentie**: sluit aan bij de bestaande codestijl.
- **Eenvoud**: schrijf duidelijke, leesbare code met betekenisvolle namen.
- **Opmerkingen**: voeg alleen opmerkingen toe om ingewikkelde logica uit te
  leggen, niet voor voor de hand liggende stappen.
- **Modulariteit**: deel code op in kleine, herbruikbare onderdelen of functies.
- **Foutafhandeling**: handel fouten netjes af en log ze op een passende manier.

Zie voor de volledige stijlgids
[code_style_and_standards_guides.md](https://github.com/homelab-alpha/docs/blob/main/.github/docs/code_style_and_standards_guides.md).

### Linting

Deze repository gebruikt
[Super Linter](https://github.com/super-linter/super-linter) om de kwaliteit van
de code te bewaken. Deze linters staan aan:

- **Bash** en **Bash Exec**: controle van shellscripts en uitvoerrechten
- **Checkov**: beveiligingsscan van infrastructuur als code
- **ENV**: controle van omgevingsbestanden
- **GitHub Actions**: controle van workflowbestanden (actionlint)
- **zizmor**: beveiligingsaudit van workflowbestanden
- **Gitleaks**: opsporen van geheimen
- **Markeringen van Git-mergeconflicten**: opsporen van conflicten
- **JSON**: opmaak van JSON (Prettier)
- **Markdown**: opmaak van Markdown (Prettier)
- **Natural Language**: controle van terminologie en grammatica
- **Pre-commit**: controle van pre-commit-hooks
- **Renovate**: controle van de configuratie van afhankelijkheden
- **YAML**: opmaak van YAML (Prettier)

Voer `npm ci` en `npm run lint` lokaal uit voordat je een pull request instuurt,
zodat je problemen vroeg vindt. Pull requests naar `main` voeren automatisch
`npm run lint` uit (Prettier, textlint-terminologie en markeringen van
mergeconflicten). De volledige Super Linter draait bij elke push naar `main`.

### Changelog

De workflow Update Changelog voegt voor elke gemergede pull request een regel
toe aan `CHANGELOG.md`, onder de sectie `[Unreleased]`. Hij draait elke 8 uur,
dus de regel kan een paar uur na de merge verschijnen. Je past het bestand
daarvoor niet zelf aan. De regel wordt gemaakt van de titel van de pull request:
`- feat(app): add export command [1a2b3c4](commit link) by [@anna](profile link)`.
Het type in de titel bepaalt de categorie: `feat` is `Added`, `fix` is `Fixed`,
`fix(security)` is `Security`, en elk ander type is `Changed`.

Schrijf de titel als een conventional commit, vanuit de gebruiker en in de
gebiedende wijs: `feat(app): add export command`, niet
`feat(app): added export command`.

Zie
[code_style_and_standards_guides.md](https://github.com/homelab-alpha/docs/blob/main/.github/docs/code_style_and_standards_guides.md#changelog-practices)
voor alle afspraken over de changelog.

## Pull Requests

### Voordat je instuurt {#before-you-submit}

- [ ] Je branch volgt de [afspraken voor branchnamen](#branch-naming).
- [ ] Je commits volgen de [afspraken voor commitberichten](#commit-messages).
- [ ] Je code volgt de [richtlijnen voor codestijl](#code-style).
- [ ] Je hebt je wijzigingen lokaal getest.
- [ ] Je begrijpt elke regel en hebt die nagekeken, en je hebt in de pull
      request gezegd welke AI-tools je gebruikte, zoals beschreven in het
      [AI-beleid voor bijdragen](https://github.com/homelab-alpha/docs/blob/main/.github/policies/ai_contribution_policy.md).
- [ ] De lint slaagt lokaal.
- [ ] Je hebt de relevante documentatie bijgewerkt.
- [ ] De titel van je pull request is een conventional commit, want die wordt de
      regel in de changelog.
- [ ] Je pull request gaat naar de branch `main`.

### Een pull request insturen {#submitting-a-pull-request}

1. Push je branch naar je fork:

   ```bash
   git push origin feat/your-feature-name
   ```

2. Open een pull request naar de branch `main` van de upstream-repository.
3. Vul het
   [sjabloon voor pull requests](https://github.com/homelab-alpha/docs/blob/main/.github/pull_request_template.md)
   volledig in. Haal geen secties weg.
4. Voeg zo mogelijk passende labels toe.
5. Wacht tot een beheerder je pull request bevestigt; we proberen binnen **5
   werkdagen** te reageren.

{{% alert context="info" %}}
Pull requests die het sjabloon of de richtlijnen niet volgen, kunnen zonder
review worden gesloten.
{{% /alert %}}

### Het reviewproces {#review-process}

Alle pull requests doorlopen een vast reviewproces om de kwaliteit en
consistentie van de code te bewaken. Dit kun je verwachten:

- Een beheerder bekijkt je pull request en kan om wijzigingen vragen.
- Verwerk alle opmerkingen door extra commits naar je branch te pushen.
- Zijn alle discussies afgerond en slagen de checks, dan keurt een beheerder je
  pull request goed en merget hem.
- Eenvoudige bijdragen worden meestal binnen **twee weken** bekeken.
  Ingewikkelde wijzigingen kunnen langer duren, en we laten het weten als er
  vertraging is.

Updates van afhankelijkheden worden automatisch geopend door
[Renovate](https://docs.renovatebot.com/), gegroepeerd per soort update. Alle
niet-grote npm-updates komen in één pull request, net als alle niet-grote
updates van Docker Compose-images. Niets wordt automatisch gemerged; een
beheerder bekijkt en merget elke update. Pull Request Automation laat deze pull
requests open staan voor review.

Zie voor een gedetailleerd overzicht van de review
[`.github/policies/review_process.md`](https://github.com/homelab-alpha/docs/blob/main/.github/policies/review_process.md).

## Community

We horen graag van je! Hier kun je contact zoeken:

| Kanaal                                                                                                         | Doel                                      |
| :------------------------------------------------------------------------------------------------------------- | :---------------------------------------- |
| [Announcements](https://github.com/homelab-alpha/docs/discussions/categories/announcements)                    | Blijf op de hoogte van releases en nieuws |
| [Feature Requests](https://github.com/homelab-alpha/docs/discussions/categories/feature-request)               | Stel nieuwe functies voor                 |
| [Feedback](https://github.com/homelab-alpha/docs/discussions/categories/feedback)                              | Deel je gedachten en suggesties           |
| [Help & Support](https://github.com/homelab-alpha/docs/discussions/categories/help-support)                    | Stel vragen en krijg hulp                 |
| [Q&A](https://github.com/homelab-alpha/docs/discussions/categories/q-a)                                        | Krijg antwoorden van de community         |
| [General Discussion](https://github.com/homelab-alpha/homelab-alpha/discussions/categories/general-discussion) | Gesprekken over andere onderwerpen        |

Lees
[MAINTAINERS.md](https://github.com/homelab-alpha/docs/blob/main/MAINTAINERS.md)
als je beheerder wilt worden.

---

Bedankt dat je de tijd neemt om bij te dragen aan docs. Elke bijdrage, hoe klein
ook, helpt het project te groeien en te verbeteren. 🙏

[AdGuard Home]: https://github.com/homelab-alpha/adguard-home
[Docker]: https://github.com/homelab-alpha/docker
[dotfiles]: https://github.com/homelab-alpha/dotfiles
[OpenSSL]: https://github.com/homelab-alpha/openssl
[Shell Script]: https://github.com/homelab-alpha/shell-script
[Docs]: https://github.com/homelab-alpha/docs
