---
title: "up.info"
description:
  "Maakt het eenvoudiger om meerdere mapniveaus omhoog te gaan in het
  bestandssysteem. In plaats van meerdere keren `cd ../` te typen, geef je met
  één commando het aantal niveaus op"
url: "shell-script/function-info/up"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Function Information
tags:
  - shell-script
  - bash
  - linux
  - command-line
  - filesystem-navigation
  - scripting
  - utility
keywords:
  - navigate directory levels
  - bash function
  - shell script navigation
  - cd command shortcut
  - directory traversal script
  - linux filesystem
  - efficient directory navigation

weight: 10110

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet `up.sh`, is
geschreven door GJS (homelab-alpha) en maakt de functie `up`, waarmee je een
opgegeven aantal mapniveaus omhoog gaat in het bestandssysteem. Zo ga je snel
meerdere niveaus omhoog zonder steeds `cd ../../..` te typen.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `up.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 26 mei 2024
- **Versie**: 1.0
- **Beschrijving**: het script definieert de functie `up` om een opgegeven
  aantal mapniveaus omhoog te gaan in het bestandssysteem. Voer het script uit
  in een terminal en geef het aantal niveaus op.
- **RAW-script**: [up.sh]

## Definitie van de functie {#function-definition}

```bash
function up() {
  local levels=${1:-1} # Set the default level to 1 if not specified
  local target=""
```

Dit definieert de functie `up`. `local levels=${1:-1}` zet de lokale variabele
`levels` op het eerste argument van de functie, of op `1` als er geen argument
is. Dit bepaalt hoeveel mapniveaus je omhoog gaat. `local target=""` maakt de
lege tekenreeks `target`, waarin het pad wordt opgebouwd.

## Lus die het pad opbouwt {#loop-to-construct-path}

```bash
  for ((i = 1; i <= levels; i++)); do
    target="../$target"
  done
```

Deze lus loopt van 1 tot het getal in `levels`. Bij elke ronde komt er `../` bij
`target`, zodat het relatieve pad ontstaat om het gewenste aantal niveaus omhoog
te gaan.

## Randgevallen {#handling-edge-cases}

```bash
  if [ -z "$target" ]; then
    target=".."
  fi
```

Deze voorwaarde controleert of `target` leeg is en zet het dan op `..`. Zo is er
altijd een geldig pad.

## Het commando om van map te wisselen {#change-directory-command}

```bash
  cd "$target" || return 1 # Go to the target directory or return an error code if it fails
}
```

Het commando `cd "$target"` probeert naar het opgebouwde pad `target` te gaan.
`|| return 1` zorgt dat de functie foutcode `1` teruggeeft als het commando `cd`
mislukt (bijvoorbeeld als de doelmap niet bestaat).

## Voorbeelden van gebruik {#usage-examples}

## Eén mapniveau omhoog {#move-up-one-directory-level}

```bash
up
```

Dit is hetzelfde als `cd ..`.

## Drie mapniveaus omhoog {#move-up-three-directory-levels}

```bash
up 3
```

Dit gaat drie niveaus omhoog in de mappenstructuur, hetzelfde als
`cd ../../../`.

## Conclusie {#conclusion}

Dit script is eenvoudig maar krachtig: je navigeert efficiënter door je
bestandssysteem door in het commando zelf op te geven hoeveel niveaus je omhoog
wilt.

[up.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/up.sh
