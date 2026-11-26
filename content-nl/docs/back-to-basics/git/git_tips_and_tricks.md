---
title: "Tips en trucs voor Git"
description:
  "Ontdek belangrijke tips en trucs voor Git om je werk met versiebeheer te
  verbeteren, van basiscommando's tot gevorderde technieken."
url: "back-to-basics/git/tips-and-tricks"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Git
tags:
  - Git
  - Version Control
  - Development
  - Workflow
keywords:
  - Git tips
  - Git tricks
  - Version control tips
  - Development workflow
  - Git commands
  - Advanced Git techniques

weight: 2404

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

## Je werk met versiebeheer verbeteren {#enhancing-your-version-control-workflow}

Welkom bij onze gids met tips en trucs voor Git! Git is een krachtig
versiebeheersysteem dat ontwikkelaars veel gebruiken om wijzigingen in code
efficiënt te beheren. Of je nu beginner bent of al ervaring hebt met Git: met de
juiste tips en trucs word je veel productiever en werk je soepeler.

In deze gids bekijken we een verzameling tips en trucs voor Git, van
basiscommando's tot gevorderde technieken. Ze helpen je veelvoorkomende taken
beter uit te voeren, de mogelijkheden van Git beter te begrijpen en problemen
tijdens het ontwikkelen op te lossen.

Of je nu je commitgeschiedenis wilt opschonen, efficiënter met je team wilt
samenwerken of problemen beter wilt oplossen: deze gids heeft voor iedereen
iets. Laten we ontdekken hoe je alles uit Git haalt!

## De laatste commit aanpassen {#amending-the-last-commit}

Je kunt de laatste commit aanpassen met nieuwe wijzigingen:

```bash
git commit --amend
```

## Wijzigingen stashen {#stashing-changes}

Stash wijzigingen om ze tijdelijk te bewaren:

```bash
git stash
```

## Commits cherry-picken {#cherry-picking-commits}

Pas een bepaalde commit van de ene branch toe op een andere:

```bash
git cherry-pick <commit-hash>
```

## Interactief rebasen {#interactive-rebasing}

Herschrijf de commitgeschiedenis interactief:

```bash
git rebase -i HEAD~3  # Rebase last 3 commits
```

## Verschillen bekijken {#viewing-diffs}

Bekijk de verschillen tussen twee commits:

```bash
git diff <commit1> <commit2>
```

## Aliassen maken {#creating-aliases}

Maak snelkoppelingen voor commando's van Git:

```bash
git config --global alias.sw switch
```

## Git bisect

Zoek de commit waarmee een bug is ontstaan:

```bash
git bisect start
git bisect bad            # Current commit is bad
git bisect good <commit>  # Known good commit
```

## Commits samenvoegen {#squashing-commits}

Voeg meerdere commits samen tot één:

```bash
git rebase -i HEAD~3  # Squash last 3 commits
```

## Git hooks

Automatiseer taken met Git hooks:

```bash
# Create a pre-commit hook
touch .git/hooks/pre-commit
```

## Git worktrees

Werk tegelijk aan meerdere branches:

```bash
git worktree add <path> <branch>
```

## Git submodules

Neem andere Git-repository's op in je eigen repository:

```bash
git submodule add <repository-url>
```

## Reflog

Herstel verloren commits met reflog:

```bash
git reflog
git switch --detach HEAD@{1}  # Inspect a commit from the reflog
```

## Patronen voor gitignore {#gitignore-patterns}

Sluit bestanden uit van versiebeheer:

```bash
# Add a pattern to .gitignore
echo '*.log' >> .gitignore
```

## Git bisect met een script {#git-bisect-with-script}

Automatiseer het bisecten met een script:

```bash
git bisect start
git bisect bad
git bisect good $(git bisect-script)
```
