---
title: "Spoedcursus Git"
description:
  "Leer Git vanaf de basis met deze uitgebreide spoedcursus. Beheers de basis-
  en gevorderde commando's, beheer repository's, los conflicten op en meer."
url: "back-to-basics/git/crash-course"
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
  - version control
  - collaboration
  - repository management
  - Git commands
  - Git workflow
keywords:
  - Git crash course
  - Git basics
  - Git commands
  - Git workflow
  - version control system

weight: 2403

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

## Kennismaking met Git: een gids voor beginners {#introduction-to-git-a-beginners-guide}

Welkom bij de spoedcursus Git! Git is een krachtig versiebeheersysteem dat
ontwikkelaars over de hele wereld gebruiken om wijzigingen in hun code efficiënt
te beheren en te volgen. Of je nu een ervaren ontwikkelaar bent of net begint
met programmeren: wie Git begrijpt, werkt makkelijker samen aan projecten en
houdt de code overzichtelijk.

In deze spoedcursus behandelen we alles wat je nodig hebt om met Git te
beginnen, van het inrichten van je omgeving tot de basis- en gevorderde
commando's. Aan het eind heb je de kennis en het vertrouwen om Git goed in je
projecten te gebruiken.

Laten we de wereld van versiebeheer met Git gaan verkennen!

## Git inrichten {#setting-up-git}

- Installeer Git op je systeem als je dat nog niet hebt gedaan.
- Stel je gebruikersnaam en e-mailadres in:
  ```bash
  git config --global user.name "Your Name"
  git config --global user.email "your.email@example.com"
  ```
- Gebruik `main` als standaardnaam van de branch voor nieuwe repository's:
  ```bash
  git config --global init.defaultBranch main
  ```

### Een repository maken {#initializing-a-repository}

- Maak een nieuwe repository:
  ```bash
  git init my_project
  cd my_project
  ```

### Basiscommando's {#basic-commands}

- Bekijk de status van je repository:
  ```bash
  git status
  ```
- Voeg wijzigingen toe aan de staging area:
  ```bash
  git add <file>
  ```
- Leg wijzigingen vast in de repository:
  ```bash
  git commit -m "Commit message"
  ```
- Bekijk de commitgeschiedenis:
  ```bash
  git log
  ```

### Werken met branches {#working-with-branches}

- Maak een nieuwe branch:
  ```bash
  git branch new_feature
  ```
- Wissel naar een andere branch:
  ```bash
  git switch new_feature
  ```
- Merge branches:
  ```bash
  git merge <branch_name>
  ```

### Externe repository's {#remote-repositories}

- Voeg een externe repository toe:
  ```bash
  git remote add origin <remote_url>
  ```
- Push wijzigingen naar een externe repository:
  ```bash
  git push -u origin <branch_name>
  ```
- Kloon een repository:
  ```bash
  git clone <repository_url>
  ```

### Conflicten oplossen {#resolving-conflicts}

- Bij het mergen van branches kunnen conflicten ontstaan. Los de conflicten met
  de hand op in de betrokken bestanden en voer daarna dit uit:
  ```bash
  git add <resolved_file>
  git commit -m "Resolved conflicts"
  ```

### Wijzigingen ongedaan maken {#undoing-changes}

- Gooi wijzigingen in de werkmap weg:
  ```bash
  git restore <file>
  ```
- Maak de laatste commit ongedaan (de wijzigingen blijven in je werkmap):
  ```bash
  git reset HEAD~1
  ```

### Overig {#miscellaneous}

- Maak een bestand .gitignore met de bestanden die Git moet negeren:

  ```bash
  touch .gitignore
  echo "file_to_ignore.txt" >> .gitignore
  ```

- Bekijk het verschil tussen bestanden:

  ```bash
  git diff <file>
  ```

## Voorbeeld van een werkwijze {#example-workflow}

### Een repository maken {#initialize-a-repository}

```bash
git init my_project
cd my_project
```

### Een nieuw bestand maken en er inhoud aan toevoegen {#create-a-new-file-and-add-some-content}

Voeg het bestand toe aan de staging area:

```bash
git add new_file.txt
```

### De wijzigingen vastleggen {#commit-the-changes}

```bash
git commit -m "Added: new_file.txt"
```

### Een nieuwe branch maken voor een nieuwe functie {#create-a-new-branch-for-a-new-feature}

```bash
git branch new_feature
```

### Naar de nieuwe branch wisselen {#switch-to-the-new-branch}

```bash
git switch new_feature
```

### Wijzigingen maken, toevoegen en vastleggen {#make-changes-add-them-and-commit}

```bash
git add modified_file.txt
git commit -m "Implemented new feature"
```

### Terug naar de hoofdbranch en de nieuwe functie mergen {#switch-back-to-the-main-branch-and-merge-the-new-feature}

```bash
git switch main
git merge new_feature
```

### Eventuele conflicten oplossen {#resolve-any-conflicts-if-they-occur}

Push de wijzigingen naar een externe repository

```bash
git remote add origin <repository_url>
git push -u origin main
```

Deze spoedcursus behandelt de basisbegrippen en -commando's van Git om je op weg
te helpen. Oefen deze commando's om vertrouwd te raken met de werkwijze van Git.
