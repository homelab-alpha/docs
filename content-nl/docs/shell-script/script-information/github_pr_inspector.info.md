---
title: "github_pr_inspector.info"
description:
  "Dit script biedt een interactieve interface om .patch- en .diff-links te
  maken voor pull requests op GitHub. Zo kun je de wijzigingen van een PR direct
  in de terminal bekijken. Het script heeft een interactief menu, vaste
  repository's en eigen invoer, zodat je er flexibel mee werkt."
url: "shell-script/script-info/github-pr-inspector"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Script Information
tags:
  - GitHub
  - Pull Request
  - PR Inspector
  - .patch
  - .diff
  - Terminal
  - Shell Script
  - Interactive Menu
  - Script
keywords:
  - GitHub Pull Request
  - PR Changes
  - GitHub PR Inspector
  - Patch and Diff
  - Terminal Script
  - Shell Scripting
  - Interactive Script

weight: 10206

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`github_pr_inspector.sh`, is geschreven door GJS (homelab-alpha) en helpt je
pull requests op GitHub te bekijken: het maakt `.patch`- en `.diff`-links en
toont de wijzigingen van een PR direct in de terminal.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `github_pr_inspector.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 3 januari 2025
- **Versie**: 1.0.0
- **Beschrijving**: dit script biedt een interactieve interface om .patch- en
  .diff-links te maken voor pull requests op GitHub. Zo kun je de wijzigingen
  van een PR direct in de terminal bekijken. Het script heeft een interactief
  menu, vaste repository's en eigen invoer, zodat je er flexibel mee werkt.
- **RAW-script**: [github_pr_inspector.sh]

## Header van het script {#script-header}

Het script begint met commentaarregels met gegevens, zoals de auteur, de versie
en een korte beschrijving. De header bevat ook gebruiksinstructies, met de
benodigde software, zoals `curl` en `less`.

## Vereisten {#requirements}

Het script controleert of deze software op je systeem is geïnstalleerd; die is
nodig om het goed te laten werken:

- `curl` (om de gegevens van de PR op GitHub op te halen)
- `less` (om de gegevens van de PR in de terminal te bekijken)

## Gebruik {#usage}

### Gebruik op de opdrachtregel {#command-line-usage}

Je kunt het script direct uitvoeren met deze opbouw:

```bash
./github_pr_inspector.sh [username/repository] [pr_number]
```

- **Zonder parameters** toont het script een interactief menu.
- **Optionele vlaggen**:
  - `-h` of `--help`: toont de hulp.
  - `-r` of `--reset`: begint de sessie opnieuw.
  - `-q` of `--quit`: sluit het script af.

### Voorbeelden {#examples}

1. Links maken voor PR #123 in een bepaalde repository:

```bash
./github_pr_inspector.sh username/repository 123
```

2. Het interactieve menu gebruiken:

```bash
./github_pr_inspector.sh
```

### Aliassen {#aliases}

Voeg deze regels toe aan het configuratiebestand van je shell (bijvoorbeeld
`.bashrc` of `.bash_aliases`) voor handige aliassen voor het script:

```bash
alias github-pr-inspector="$HOME/github_pr_inspector.sh"
# or
alias github-pr-inspector="$HOME/.bash_aliases/github_pr_inspector.sh"
```

## Hoofdmenu {#main-menu}

Na het starten toont het script een interactief menu waarin je een van deze
opties kiest:

1. `Github: homelab-alpha`
2. `Github: louislam/uptime-kuma`
3. `Custom: username/repository`

Daarnaast kun je deze opties gebruiken:

- `h` of `--help`: toont de hulp.
- `r` of `--reset`: begint de sessie opnieuw.
- `t` of `--toggle`: wisselt de standaardextensie tussen `.patch` en `.diff`.
- `q` of `--quit`: sluit het script af.

### Verwerking van de invoer {#handling-user-input}

- Het script vraagt om een **GitHub-repository** en een **nummer van de pull
  request** als die nog niet zijn opgegeven.
- **Formaat van de repository**: de invoer moet de vorm `username/repository`
  hebben (bijvoorbeeld `homelab-alpha/shell-script`).
- **PR-nummer**: je geeft ook het **nummer van de pull request** op.

Zijn de repository en het PR-nummer gecontroleerd, dan maakt het script de
juiste `.patch`- of `.diff`-link, afhankelijk van de gekozen extensie (die je
zelf wisselt).

## De bestanden van de PR ophalen {#fetching-pr-files}

Het script maakt twee soorten links om een PR te bekijken:

1. `.patch`: toont de wijzigingen als patch.
2. `.diff`: toont de wijzigingen als diff.

Kies je een repository en een PR-nummer, dan haalt het script het bijbehorende
bestand op met `curl` en toont het dat met `less`.

Kan het bestand niet worden opgehaald (er komt een andere HTTP-status dan 200
terug), dan meldt het script dat het is mislukt.

## Opnieuw beginnen {#reset-functionality}

De optie `--reset` wist alle eerder ingevoerde gegevens (repository, PR-nummer
enzovoort), zodat je met een schone lei begint.

## Wisselen tussen .patch en .diff {#toggle-between-patch-and-diff}

Het script gebruikt standaard `.patch`-bestanden, maar met de optie `t` of
`--toggle` wissel je tussen de formaten `.patch` en `.diff`.

## Argumenten op de opdrachtregel {#handling-command-line-arguments}

- Start je het script met twee argumenten (repository en PR-nummer), dan slaat
  het het interactieve menu over en haalt het zowel de `.patch`- als de
  `.diff`-link voor die PR op.
- Voorbeeld:

```bash
./github_pr_inspector.sh username/repository 123
```

Dit maakt zowel de `.patch`- als de `.diff`-link voor PR #123 in de repository
`username/repository`.

## Conclusie {#conclusion}

Het script `github_pr_inspector.sh` biedt een gebruiksvriendelijke manier om de
wijzigingen van een PR op GitHub direct in de terminal te bekijken. Met het
interactieve menu, eigen repository's en het wisselen van de extensie werk je er
flexibel en efficiënt mee.

[github_pr_inspector.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/github_pr_inspector.sh
