---
title: "maintain_git_repo.info"
description:
  "Automatiseer het opruimen van je Git-repository: verwijder overbodige
  bestanden en zet de commitgeschiedenis opnieuw in voor een frisse start."
url: "shell-script/script-info/maintain-git-repo"
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
  - git
  - repository maintenance
  - automation
  - script
  - version control
keywords:
  - Git repository cleanup
  - reset commit history
  - automate Git maintenance
  - shell script
  - fresh start Git

weight: 10214

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`maintain_git_repo.sh`, is geschreven door GJS (homelab-alpha) en automatiseert
het onderhoud van een Git-repository: het ruimt overbodige bestanden op en zet
de commitgeschiedenis opnieuw in voor een frisse start. Dat is handig na een
import uit een ander versiebeheersysteem, of voor een schone geschiedenis die
het projectbeheer en de samenwerking eenvoudiger maakt.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `maintain_git_repo.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 18 mei 2024
- **Versie**: 1.0
- **Beschrijving**: het script automatiseert het opruimen van een Git-repository
  door overbodige bestanden te verwijderen en de commitgeschiedenis opnieuw in
  te zetten. Dat helpt om de repository te ordenen en kleiner te maken.
- **RAW-script**: [maintain_git_repo.sh]

## Beschrijving {#description}

Het script maakt het opruimen van een Git-repository eenvoudiger. Het maakt een
nieuwe branch zonder de eerdere commitgeschiedenis, voegt alle bestanden aan die
branch toe en vervangt daarna de oude hoofdbranch door deze schone branch. Het
resultaat is een repository met één schone commit, die makkelijker te beheren
is.

## Een nieuwe branch zonder geschiedenis maken {#create-a-new-branch-without-history}

```sh
git checkout --orphan cleaned-history
```

Dit commando maakt de nieuwe branch `cleaned-history` zonder commitgeschiedenis.
Zo begin je opnieuw zonder de oude commitgeschiedenis mee te nemen.

## Alle bestanden aan de staging area toevoegen {#add-all-files-to-the-staging-area}

```sh
git add -A
```

Dit commando zet alle bestanden in de repository klaar voor de volgende commit.

## Een eerste commit maken {#make-an-initial-commit}

```sh
git commit -am "maintenance: New start, a clean history"
```

Dit legt alle klaargezette bestanden vast met een bericht dat dit een
onderhoudsactie is om met een schone geschiedenis te beginnen.

## De oude branch `main` verwijderen {#delete-the-old-main-branch}

```sh
git branch -D main
```

Dit commando verwijdert de oude branch `main`. Die stap is nodig om de oude
branch door de nieuwe te vervangen.

## De huidige branch hernoemen naar `main` {#rename-the-current-branch-to-main}

```sh
git branch -m main
```

Dit hernoemt de huidige branch (eerder `cleaned-history`) naar `main`, zodat die
de nieuwe hoofdbranch van de repository wordt.

## De nieuwe branch `main` naar de externe repository pushen {#push-the-new-main-branch-to-the-remote-repository}

```sh
git push -f origin main
```

Dit pusht de nieuwe branch `main` geforceerd naar de externe repository en
vervangt zo de oude branch `main`. De optie `-f` (force) is nodig, omdat de
geschiedenissen van de branches niet overeenkomen.

## De terminal sluiten {#close-the-terminal}

```sh
exit 0
```

Dit commando sluit de terminalsessie. Hier eindigt het script.

## Voorbeeld van gebruik {#example-usage}

Stel dat je Git-repository vol overbodige bestanden zit of een rommelige
commitgeschiedenis heeft. Met dit script ruim je de repository op en begin je
opnieuw. Zo gebruik je het:

1. Ga naar de map van je Git-repository.
2. Voer het script uit met `./maintain_git_repo.sh`.
3. Controleer of alle wijzigingen zijn zoals verwacht.
4. Push de wijzigingen naar je externe repository.
5. Laat je teamleden weten dat je onderhoud hebt gedaan, om conflicten of
   misverstanden te voorkomen.

## Conclusie {#conclusion}

Dit script is een efficiënte manier om een Git-repository op te ruimen door de
geschiedenis opnieuw in te zetten en de structuur te ordenen. Het is vooral
handig voor een duidelijke en beknopte projectgeschiedenis, wat de samenwerking
en het projectbeheer ten goede komt.

[maintain_git_repo.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/maintain_git_repo.sh
