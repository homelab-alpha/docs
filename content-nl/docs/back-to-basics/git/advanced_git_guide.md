---
title: "Gevorderde gids voor Git"
description:
  "Verbeter je vaardigheden met Git met gevorderde technieken en werkwijzen.
  Leer goed werken met branches, mergen, rebasen, stashen en de geschiedenis
  herschrijven."
url: "back-to-basics/git/advanced-guide"
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
  - Branching
  - Merging
  - Rebasing
  - Stashing
  - History Rewriting
  - Git Hooks
  - Git Workflows
keywords:
  - Advanced Git commands
  - Git branching
  - Git merging
  - Git rebasing
  - Git stashing
  - Git history rewriting
  - Git hooks
  - Git workflows

weight: 2401

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

## Welkom bij de gevorderde gids voor Git {#welcome-to-the-advanced-git-guide}

In deze gids bekijken we gevorderde technieken en commando's van Git om je
vaardigheden met versiebeheer te verbeteren. Of je nu samenwerkt aan een groot
project of complexe ontwikkelprocessen beheert: met deze gevorderde begrippen
werk je efficiënter en beter.

We gaan ervan uit dat je de basis van Git kent en vertrouwd bent met
veelgebruikte commando's als `git clone`, `git add`, `git commit` en `git push`.
Laten we nu dieper in Git duiken en de verborgen schatten ontdekken.

Aan de slag!

## Branches en mergen {#branching-and-merging}

### Een nieuwe branch maken {#create-a-new-branch}

```bash
git switch -c new-feature
```

### Wisselen tussen branches {#switch-between-branches}

```bash
git switch main  # Switch to main branch
git switch new-feature  # Switch to new-feature branch
```

### Branches mergen {#merge-branches}

```bash
git switch main  # Switch to the branch you want to merge into
git merge new-feature  # Merge new-feature branch into main
```

### Mergeconflicten oplossen {#resolve-merge-conflicts}

Bij mergeconflicten geeft Git aan welke bestanden conflicten hebben. Open die
bestanden, los de conflicten met de hand op en voeg de wijzigingen daarna toe en
leg ze vast.

### Een branch verwijderen {#delete-a-branch}

```bash
git branch -d new-feature  # Deletes the branch if changes are merged
git branch -D new-feature  # Forcefully deletes the branch
```

## Rebasen {#rebasing}

### Je branch rebasen op een andere branch {#rebase-your-branch-onto-another-branch}

```bash
git switch feature-branch
git rebase main
```

### Commits samenvoegen tijdens een rebase {#squash-commits-during-rebase}

Tijdens een rebase kun je meerdere commits samenvoegen tot één, voor een
schonere geschiedenis.

```bash
git rebase -i HEAD~3  # Squash last 3 commits
```

## Stashen {#stashing}

### Wijzigingen stashen {#stash-changes}

```bash
git stash save "Work in progress"  # Stash changes with a message
```

### Gestashte wijzigingen toepassen {#apply-stashed-changes}

```bash
git stash apply stash@{0}  # Apply the first stash
```

### Gestashte wijzigingen tonen {#list-stashed-changes}

```bash
git stash list  # List all stashed changes
```

### Gestashte wijzigingen weggooien {#drop-stashed-changes}

```bash
git stash drop stash@{0}  # Drop the first stash
```

## De geschiedenis herschrijven {#rewriting-history}

### De laatste commit aanpassen {#amend-the-last-commit}

```bash
git commit --amend
```

### Interactief rebasen om commits te bewerken, samen te voegen of te herschikken {#interactive-rebase-to-edit-squash-or-reorder-commits}

```bash
git rebase -i HEAD~3  # Interactively rebase last 3 commits
```

## Git hooks

### Pre-commit hook

Automatiseer controles voordat je wijzigingen vastlegt, zoals linten of tests
uitvoeren.

```bash
# Create a file named pre-commit in .git/hooks/ and make it executable
```

### Post-merge hook

Automatiseer taken na een merge, zoals afhankelijkheden bijwerken of
documentatie maken.

```bash
# Create a file named post-merge in .git/hooks/ and make it executable
```

## Werkwijzen met Git {#git-workflows}

### Git Flow

Een branchmodel voor grotere projecten met meerdere ontwikkelaars.

```bash
git flow feature start new-feature  # Start a new feature
git flow feature finish new-feature  # Finish a feature
```

### GitHub Flow

Een eenvoudigere werkwijze waarin pull requests centraal staan bij het
samenwerken.

```bash
# Create a new branch, make changes, push branch, create a pull request, review, merge
```

## Conclusie {#conclusion}

Met deze gevorderde commando's en werkwijzen van Git werk je productiever en
beheer je complexe ontwikkelsituaties beter. Probeer ze uit in je projecten om
een expert in Git te worden. Onthoud: grote kracht brengt grote
verantwoordelijkheid met zich mee, dus gebruik deze commando's verstandig!
