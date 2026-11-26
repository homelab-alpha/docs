---
title: "Codestijl en standaarden"
description:
  "Lees de afspraken over codestijl en standaarden, voor consistente en
  duidelijke ontwikkeling van het project."
url: "contributing/code-style-plus-standards-guides"
aliases: ""
icon: "handshake"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Homelab-Alpha
series:
  - Contributing
tags:
  - coding standards
  - code style
  - programming conventions
  - best practices
  - consistency
  - readability
  - maintainability
  - project development
keywords:
  - coding standards
  - code style
  - programming conventions
  - best practices
  - consistency
  - readability
  - maintainability
  - project development
  - style guides
  - standards guides
  - coding guidelines
  - development conventions
  - software engineering practices

weight: 3002

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Inleiding {#introduction}

Deze handleiding helpt bijdragers te begrijpen hoe we code schrijven en
bijdragen opbouwen in de repository docs. Met deze richtlijnen blijft onze code
consistent, onderhoudbaar en makkelijk te reviewen. Consistentie gaat voor
persoonlijke voorkeur: sluit bij twijfel aan bij de bestaande stijl.

## Algemene kwaliteit van code {#general-code-quality}

- **Wees consistent**: sluit altijd aan bij de bestaande codestijl. Consistentie
  gaat voor persoonlijke voorkeur.
- **Houd het eenvoudig**: schrijf duidelijke, leesbare code. Gebruik zinnige
  namen voor variabelen, functies en klassen.
- **Voeg opmerkingen toe (als dat nodig is)**: leg ingewikkelde delen kort uit.
  Beschrijf niet wat de code doet, maar _waarom_.
- **Deel taken op**: organiseer je code in kleine, herbruikbare stukken (modules
  of componenten).
- **Handel fouten af**: zorg dat je code netjes met fouten omgaat en ze goed
  logt.
- **Vermijd gevoelige gegevens**: zet nooit geheimen, tokens, wachtwoorden of
  API-sleutels vast in de code. Gebruik omgevingsvariabelen of een veilig
  configuratiebeheer.

## Opmaak {#formatting}

We gebruiken **Prettier** om onze code automatisch op te maken en te
controleren. Zo blijft de stijl in het hele project gelijk. Draai Prettier
voordat je commit, om opmerkingen over stijl in de review te voorkomen.

Algemene regels voor de opmaak van alle bestandstypen:

- Gebruik **2 spaties** om in te springen (geen tabs), tenzij een taal of tool
  iets anders vereist.
- Laat bestanden eindigen met **één nieuwe regel**.
- Verwijder **spaties aan het einde** van alle regels.
- Houd regels waar mogelijk op maximaal **80 tekens**. Codeblokken mogen tot
  **120 tekens** gaan.

## Afspraken voor bestanden en mappen {#file-and-folder-conventions}

- Namen van bestanden en mappen zijn in **kleine letters**. Bestanden gebruiken
  **underscores** als scheidingsteken (bijvoorbeeld `review_process.md`,
  `super_linter.env`); mappen gebruiken **koppeltekens** (bijvoorbeeld `docker`,
  `docker-compose`). Communitybestanden in de hoofdmap houden hun GitHub-naam
  (bijvoorbeeld `README.md`).
- Configuratiebestanden voor tools staan in `.github/linters/`.
- Workflows van GitHub Actions staan in `.github/workflows/`.
- Beleidsdocumenten staan in `.github/policies/`.
- Lege mappen bevatten een bestand `.placeholder`, zodat ze niet per ongeluk
  worden verwijderd en het doel duidelijk is.
- De `.gitignore` sluit veelvoorkomende bestanden uit, zoals databases,
  buildresultaten, IDE-bestanden, logs en tijdelijke bestanden. Commit die
  nooit.

## Richtlijnen voor Git {#git-guidelines}

Met deze richtlijnen blijft onze commitgeschiedenis schoon, leesbaar en
makkelijk te volgen.

### Richtlijnen voor branchnamen {#branch-naming-guidelines}

Maak voor elke wijziging een nieuwe branch. Geef branches een naam die duidelijk
het doel beschrijft.

- **Vorm**: `type/short-description`
- **Letters**: gebruik **kleine letters**; scheid woorden met **koppeltekens**.
- **Lengte**: houd de beschrijving korter dan **50 tekens**.

**Voorvoegsels (typen):**

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
feat/add-user-authentication
fix/login-page-display-error
docs/update-installation-guide
chore/update-dependencies
refactor/simplify-parser-logic
```

**Foute voorbeelden:**

```none
login-error-fix      (missing type prefix)
bug123               (too vague)
Feature/AddUserAuth  (wrong casing)
update               (not descriptive)
```

### Richtlijnen voor commitberichten {#commit-message-guidelines}

Schrijf commitberichten altijd in het **Engels** en volg de specificatie
[Conventional Commits](https://conventionalcommits.org). Voor een snel
overzicht, zie het
[spiekbriefje voor Conventional Commits](https://github.com/homelab-alpha/docs/blob/main/.github/docs/conventional_commits_cheatsheet.md).

**Kop (eerste regel):**

- **Vorm**: `type(scope)!: brief subject`
- **Typen**:
  - `feat`: nieuwe functie.
  - `fix`: bugfix.
  - `docs`: wijzigingen in de documentatie.
  - `style`: opmaak van code (geen wijziging in de logica).
  - `refactor`: code herstructureren (geen functie of fix).
  - `perf`: prestatieverbeteringen.
  - `test`: wijzigingen in tests.
  - `chore`: algemeen onderhoud en updates van afhankelijkheden (`chore(deps)`).
  - `revert`: een eerdere commit terugdraaien.
  - `build`: wijzigingen in buildtools of de buildopzet.
  - `ci`: wijzigingen in de CI-configuratie en workflows.
- **Scope (optioneel)**: het deel van de code dat verandert (bijvoorbeeld
  `core`, `data`, `cli`, `docs`).
- **Onderwerp**: in de **gebiedende wijs** (bijvoorbeeld "Add export", "Fix
  bug"). Houd het **korter dan 50 tekens**. Eindig niet met een punt.
- **Brekende wijziging**: elk type kan een brekende wijziging zijn. Markeer die
  met `!` direct voor de dubbele punt (`feat(api)!: remove the v1 endpoints`).

**Body (optioneel):**

- Laat een **lege regel** na de kop.
- Leg uit **wat** je veranderde en **waarom**, niet hoe.
- Gebruik **opsommingstekens** (`-`) voor meerdere details.
- Houd regels korter dan **72 tekens**.

**Footer (optioneel):**

- Laat een **lege regel** na de body.
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

```git
chore(deps): update super-linter to v8.6.0
```

## Richtlijnen per taal {#language-specific-guidelines}

### YAML

YAML wordt gebruikt voor workflows van GitHub Actions, sjablonen voor issues en
discussies, labeldefinities en de configuratie van linters.

- Begin elk YAML-bestand met `---`.
- Spring in met **2 spaties**.
- Zet waarden die dubbelzinnig kunnen zijn bij voorkeur **expliciet tussen
  aanhalingstekens**.
- Booleans zijn `true` of `false` (kleine letters); vermijd `yes`/`no`.
- Houd regels leesbaar; de controle op regellengte staat uit in
  `.yaml-lint.yml`, maar duidelijkheid blijft belangrijk.
- Spaties aan het einde van een regel zijn niet toegestaan.
- Bestanden eindigen met een nieuwe regel.

De yamllint-hook in `.pre-commit-config.yaml` gebruikt
`.github/linters/.yaml-lint.yml` met de regels: anchors, brackets, colons,
commas, empty-lines, hyphens, key-duplicates, new-line-at-end-of-file, new-lines
en trailing-spaces. De regels voor accolades en inspringen staan uit, omdat
Prettier die bepaalt (in `labels.yml` schrijft Prettier lijsten met mappings op
een manier die yamllint afkeurt).

### Markdown

Markdown wordt gebruikt voor alle documentatie, beleidsbestanden en sjablonen.

- Gebruik **ATX-koppen** (`#`, `##` enzovoort).
- Breek regels waar mogelijk af op **80 tekens**; tabellen zijn uitgezonderd.
- Spring geneste lijsten in met **2 spaties**.
- Gebruik omheinde codeblokken (` ``` `) met een taalaanduiding.
- Gebruik geen kale URL's, maar altijd beschrijvende linktekst.
- Gebruik waar het past de meldingskaders van GitHub:

  ```markdown
  > [!NOTE]
  >
  > Informational note.

  > [!IMPORTANT]
  >
  > Critical information the reader must not miss.

  > [!WARNING]
  >
  > Warns of a potential risk or breaking change.
  ```

De markdownlint-hook in `.pre-commit-config.yaml` gebruikt
`.github/linters/.markdown-lint.yml`. Belangrijke regels zijn: lijsten
inspringen met 2 spaties (MD007) en de gebruikelijke leestekens na koppen
(MD026). De regel voor regellengte (MD013) staat uit, omdat Prettier de tekst
afbreekt op 80 tekens.

### Omgevingsbestanden {#environment-files}

Omgevingsbestanden (in de stijl van `.env`) worden gecontroleerd door de
ENV-linter van Super Linter.

- Gebruik `UPPER_SNAKE_CASE` voor alle variabelenamen.
- Geef elke variabele een korte opmerking over het doel.
- Groepeer samenhangende variabelen met een opmerking voor de sectie.
- Commit nooit echte geheimen; gebruik voorbeeldwaarden of verwijs naar een
  geheimenbeheer.
- Het bestand `super_linter.env` is het enige bestand in de stijl van `.env` in
  de repository (expliciet uitgezonderd in `.gitignore` via
  `!super_linter.env`).

### JSON

JSON wordt gebruikt voor de configuratie van Renovate en van linters, zoals
`.textlintrc`.

- Spring in met **2 spaties**.
- Zet alle sleutels tussen **dubbele aanhalingstekens**.
- Gebruik geen komma's aan het einde.
- Bestanden moeten geldige JSON zijn; controleer dat met een linter of formatter
  voordat je commit.

### Shellscripts {#shell-scripts}

Shellscripts worden gebruikt in workflows van GitHub Actions en als hulpmiddelen
in de repository (bijvoorbeeld `init.sh`). In beide gevallen gelden dezelfde
afspraken.

- Gebruik `set -Eeuo pipefail` bovenaan elk script of scriptblok voor strikte
  foutafhandeling.
- Gebruik `$()` voor commandovervanging in plaats van backticks.
- Zet alle variabelen tussen aanhalingstekens: `"$VARIABLE"`, niet `$VARIABLE`.
- Gebruik `[[ ]]` voor voorwaarden in Bash.
- Gebruik liever benoemde variabelen dan positionele parameters, voor de
  duidelijkheid.
- Schrijf zinnige loguitvoer met `echo "::notice ..."`, `echo "::warning ..."`
  en `echo "::error ..."` voor annotaties in GitHub Actions.
- Gebruik `::group::` en `::endgroup::` om samenhangende loguitvoer te groeperen
  in workflowruns.
- **Draagbaarheid**: scripts die op computers van bijdragers draaien (zoals
  `init.sh`) moeten werken op Linux (GNU) en macOS (BSD). Detecteer de omgeving
  waar nodig; zo accepteert GNU `sed` het commando `sed -i 'expr'`, terwijl BSD
  `sed` `sed -i '' 'expr'` vereist.
- Gebruik in scripts voor bijdragers geen functies die Bash 4+ nodig hebben
  (bijvoorbeeld `mapfile` en associatieve arrays), want macOS levert standaard
  nog Bash 3.2. Workflows op Ubuntu-runners mogen Bash 4+ vrij gebruiken. De
  uitzondering is `.github/scripts/lint.sh` (`npm run lint`): dat heeft Bash 4
  of hoger nodig, en stopt met een melding als Bash ouder is.

### Workflows van GitHub Actions {#github-actions-workflows}

- Workflowbestanden staan in `.github/workflows/` en hebben de extensie `.yml`.
- Elke workflow zet `permissions: {}` op workflowniveau, en elke job definieert
  zijn eigen **permissions**, volgens het principe van minimale rechten. Geef
  nooit schrijfrechten op workflowniveau.
- Pin elke action op een volledige **commit-SHA**, gevolgd door een opmerking
  met de versie (bijvoorbeeld
  `actions/checkout@3d3c42e5aac5ba805825da76410c181273ba90b1 # v7.0.1`). Tags
  zoals `@v7` zijn niet toegestaan.
- Elke workflow heeft een blok **concurrency**, zodat runs niet dubbel lopen.
- Workflows hebben een stap met een **job summary** via `$GITHUB_STEP_SUMMARY`.
- Sla runs van bots niet over: workflows draaien voor bots op dezelfde manier
  als voor mensen.

- Zet `timeout-minutes` op alle jobs, zodat runs niet eindeloos doorlopen.
- De beveiligingscontroles voor infrastructuur als code (Checkov) slaan
  `CKV_TF_1` en `CKV_GHA_7` over, zoals ingesteld in
  `.github/linters/.checkov.yaml`.

Zie voor alle afspraken over namen van workflows, logging en job summary's
[`.github/policies/github_actions.md`](https://github.com/homelab-alpha/docs/blob/main/.github/policies/github_actions.md).

## Linting

Deze repository lint in twee stappen.

- **Pull requests** voeren `npm run lint` uit (`lint_pull_request.yml`,
  `.github/scripts/lint.sh`) op de gewijzigde bestanden: Prettier,
  textlint-terminologie en markeringen van mergeconflicten. Met
  `npm run lint:fix` herstel je opmaak en terminologie lokaal.
- **Pushes naar `main`** voeren
  [Super Linter](https://github.com/super-linter/super-linter) uit op alle
  bestandstypen. Dat voegt actionlint, zizmor, Gitleaks, Checkov en de andere
  linters toe.

Deze linters staan nu aan (ingesteld in `.github/super_linter.env`):

| Linter                     | Bereik                                            |
| :------------------------- | :------------------------------------------------ |
| Bash                       | Controle van shellscripts                         |
| Bash Exec                  | Uitvoerrechten van shellscripts                   |
| Checkov                    | Beveiligingsscan van infrastructuur als code      |
| ENV                        | Controle van omgevingsbestanden                   |
| GitHub Actions             | Controle van workflowbestanden                    |
| GitHub Actions (zizmor)    | Beveiligingsaudit van workflowbestanden           |
| Gitleaks                   | Opsporen van geheimen en inloggegevens            |
| Git merge conflict markers | Opsporen van onopgeloste mergeconflicten          |
| JSON (Prettier)            | Opmaak van JSON                                   |
| Markdown (Prettier)        | Opmaak van Markdown                               |
| Natural Language           | Controle van terminologie en grammatica           |
| Pre-commit                 | Controle van de configuratie van pre-commit-hooks |
| Renovate                   | Controle van de configuratie van afhankelijkheden |
| YAML (Prettier)            | Opmaak van YAML                                   |

De configuratiebestanden van de linters staan in `.github/linters/`:

| Bestand              | Doel                                                                  |
| :------------------- | :-------------------------------------------------------------------- |
| `.checkov.yaml`      | Regels die Checkov overslaat                                          |
| `.gitleaks.toml`     | Configuratie van Gitleaks                                             |
| `.markdown-lint.yml` | Lintregels voor Markdown (pre-commit-hook)                            |
| `.textlintrc`        | Terminologieregels voor tekst                                         |
| `.yaml-lint.yml`     | Lintregels voor YAML (pre-commit-hook)                                |
| `actionlint.yml`     | Genegeerde meldingen van shellcheck in workflowbestanden (actionlint) |
| `zizmor.yml`         | Nagekeken uitzonderingen van zizmor in workflowbestanden              |

{{% alert context="success" %}}
Draai Super Linter lokaal voordat je een pull request instuurt, zodat je
problemen vroeg vindt en onnodige reviewrondes voorkomt.
{{% /alert %}}

### Super Linter lokaal draaien met Docker {#run-super-linter-locally-with-docker}

{{% alert context="info" %}}
Draai Super Linter in de hoofdmap ~docs.
{{% /alert %}}

```bash
#!/bin/bash

# Filename:    super_linter.sh
# Author:      Homelab-Alpha
# Date:        2026-10-29
# Version:     1.0.0

# Description: Executes GitHub Super-Linter locally within a Docker container.
#              Ensures project-specific configurations are respected and manages
#              clean-up of temporary Docker artifacts.

set -Eeuo pipefail

# Verify the presence of the environment file to prevent Docker execution errors.
if [[ ! -f ".github/super_linter.env" ]]; then
  echo "::error::Missing .github/super_linter.env — cannot start Super Linter."
  exit 1
fi

docker run --rm \
  --env-file .github/super_linter.env \
  -e RUN_LOCAL=true \
  -e DEFAULT_WORKSPACE=/tmp/lint \
  -v "$(pwd):/tmp/lint" \
  ghcr.io/super-linter/super-linter:latest
```

## Afhankelijkheden beheren {#dependency-management}

Afhankelijkheden worden automatisch beheerd door **Renovate** (zie
`.github/renovate.json`).

- Alle directe afhankelijkheden zijn vastgezet op een exacte versie.
- Renovate stelt op elk moment updates voor, zonder schema of limiet op open
  pull requests (de tijdzone is Europe/Amsterdam).
- Renovate groepeert updates per soort (bijvoorbeeld `github actions (minor)`),
  zodat een week aan updates maar een paar pull requests is. Alle niet-grote
  npm-updates komen in één pull request `npm (non-major)`, en alle niet-grote
  updates van Docker Compose-images in één pull request
  `docker compose (non-major)`. Grote updates blijven apart.
- Renovate wacht tot een release 3 dagen oud is (`minimumReleaseAge`). Het opent
  de pull request voor de nieuwste versie direct, met een check die nog wacht,
  zodat het niet door oudere releases heen stapt (`internalChecksFilter: none`).
- Renovate merget nooit automatisch. Een beheerder bekijkt en merget elke
  update.
- Pull Request Automation zet de pull requests van Renovate niet terug naar
  concept.
- Indirecte Go-modules (zoals Hugo-modules) worden ook bijgewerkt, zodat
  `go.mod` en `go.sum` actueel blijven.
- Containerimages zijn vastgezet op een digest (`docker:pinDigests`). De eerste
  digests van alle images komen in één pull request.
- De hookversies in `.pre-commit-config.yaml` zijn vastgezet op een volledige
  commit-SHA, met de versie in een opmerking `# frozen:`. Renovate houdt beide
  gelijk (`:enablePreCommit`).
- Beveiligingsupdates krijgen voorrang en automatisch een label.
- Meldingen van kwetsbaarheden via OSV staan aan.

Pas vastgezette versies in workflowbestanden niet met de hand aan, tenzij daar
een duidelijke reden voor is. Laat routine-updates aan Renovate over.

## Beveiliging {#security-practices}

- **Geen geheimen in code**: commit nooit API-sleutels, wachtwoorden, tokens of
  andere gevoelige inloggegevens. Gebruik omgevingsvariabelen of een
  geheimenbeheer.
- **Gitleaks** draait bij elke push naar `main` om per ongeluk gecommitte
  geheimen te vinden. Valse meldingen kun je toestaan in `.gitleaksignore`.
- **Checkov** scant bestanden met infrastructuur als code op verkeerde
  instellingen.
- Volg het
  [beveiligingsbeleid](https://github.com/homelab-alpha/docs/blob/main/SECURITY.md)
  als je kwetsbaarheden meldt.
- Houd afhankelijkheden actueel om bekende CVE's te vermijden; Renovate regelt
  dat automatisch.
- Beheerders bekijken nieuwe code voordat die in `main` komt, om mogelijke
  beveiligingsproblemen vroeg te vinden.

## Afspraken voor de changelog {#changelog-practices}

Dit project volgt de vorm van
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/). De workflow Update
Changelog draait elke 8 uur (en met de hand) en voegt voor elke pull request die
sinds de laatste release is gemerged een regel toe aan `CHANGELOG.md`, onder de
sectie `[Unreleased]`:
`- type(scope): subject [1a2b3c4](commit link) by [@anna](profile link)`. De
titel van de pull request is de tekst, dus schrijf die als een conventional
commit. De regel kun je daarna met de hand verbeteren. Een regel wordt
overgeslagen als de commitlink (of een oudere `(#N)`) al in het bestand staat,
en voor pull requests van een bot. Alle regels van één run gaan in één commit.

**Categorieën (in deze volgorde):**

| Categorie    | Wanneer                                            |
| :----------- | :------------------------------------------------- |
| `Added`      | Nieuwe functies of mogelijkheden                   |
| `Changed`    | Wijzigingen in bestaande functies                  |
| `Deprecated` | Functies die in een toekomstige release verdwijnen |
| `Removed`    | Functies die in deze release zijn verwijderd       |
| `Fixed`      | Bugfixes                                           |
| `Security`   | Beveiligingsfixes of meldingen van kwetsbaarheden  |

**Regels:**

- Schrijf regels in **eenvoudig Engels**, vanuit de gebruiker, niet vanuit de
  ontwikkelaar.
- Gebruik de gebiedende wijs: "Add export command", niet "Added export command".
- Houd regels kort; waar mogelijk één regel per wijziging.
- Verwijs in een regel die je met de hand schrijft waar het kan naar het nummer
  van het issue of de pull request (bijvoorbeeld
  `Fix null reference in parser (#42)`).
- Lege categoriekoppen onder `[Unreleased]` zijn prima: Release Manager laat
  categorieën zonder regels weg uit de uitgebrachte sectie.

**Releasenotes:** de workflow Release Manager schrijft de sectie van een release
en de notes van de GitHub-release op basis van de tekst onder `[Unreleased]`.
Staan daar geen regels, dan somt hij de pull requests op die sinds de laatste
tag zijn gemerged, één regel per pull request. De titel van de pull request is
de tekst, dus schrijf die als een conventional commit (`feat(app): add export`).
Een regel heeft dezelfde vorm als in `CHANGELOG.md`:
`- feat(app): add export [1a2b3c4](commit link) by [@anna](profile link)`. Het
type bepaalt de categorie:

| Type in de titel                                | Categorie  |
| :---------------------------------------------- | :--------- |
| `feat`                                          | `Added`    |
| `fix`                                           | `Fixed`    |
| `fix(security)`                                 | `Security` |
| `refactor`, `perf`, `revert`                    | `Changed`  |
| `docs`, `chore`, `ci`, `build`, `test`, `style` | `Changed`  |
| elk ander type                                  | `Changed`  |
| geen type                                       | `Changed`  |

De laatste drie rijen gelden alleen voor pull requests van een persoon. Pull
requests van een bot (de release, de lijst met bijdragers, updates van
afhankelijkheden) worden weggelaten. Een `!` na het type markeert een brekende
wijziging. Een commit die zonder pull request naar `main` is gepusht, wordt
apart vermeld, onder `Changed` als het onderwerp geen type heeft.

De lijst met pull requests wordt alleen gebruikt als er onder `[Unreleased]`
geen regels staan. Tekst die je zelf onder `[Unreleased]` schrijft, vervangt die
lijst, dus voeg in dat geval elke wijziging met de hand toe. Omdat Update
Changelog elke 8 uur draait, start je hem met de hand voordat je Release Manager
draait; anders ontbreekt een pull request die een paar uur eerder is gemerged in
de release. **Squash and merge** is de standaard (zie
[het reviewproces](https://github.com/homelab-alpha/docs/blob/main/.github/policies/review_process.md#merge-strategy));
**Create a merge commit** werkt ook. **Rebase and merge** laat geen pull request
achter in de geschiedenis, dus dan wordt de pull request niet vermeld.

**Versie:** bij een release (releasetype `release`) maakt Release Manager eerst
één commit die `[Unreleased]` naar de sectie van de release verplaatst en de
versie in `package.json` en `package-lock.json` zet, op de branch
`chore/changelog-<tag>`. De tag en de GitHub-release wijzen naar die commit, dus
daar staat overal de nieuwe versie. Een pull request brengt de commit naar
`main`: merge die na de release. Prereleases (`alpha`, `beta` en `rc`) maken
geen commit en houden de versie.

---

Zie
[CONTRIBUTING.md](https://github.com/homelab-alpha/docs/blob/main/CONTRIBUTING.md)
voor de werkwijze bij bijdragen, de afspraken voor branches en de richtlijnen
voor pull requests.
