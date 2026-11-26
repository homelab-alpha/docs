---
title: "Spoedcursus Nano"
description: "Leer Nano snel kennen: navigeren, bewerken, opslaan en meer."
url: "back-to-basics/nano/crash-course"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - nano – Text editor
tags:
  - Nano
  - text editor
  - crash course
  - basic navigation
  - editing
  - saving
  - commands
keywords:
  - Nano
  - text editor
  - crash course
  - basic navigation
  - editing
  - saving
  - Nano commands
  - Nano shortcuts
  - Nano customization
  - text editing basics
  - Nano features
  - Nano tutorial

weight: 2602

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Kennismaking met Nano, de teksteditor {#introduction-to-nano--the-text-editor}

Open Nano door `nano` te typen, gevolgd door de naam van het bestand dat je wilt
bewerken. Bestaat het bestand niet, dan maakt Nano een nieuw bestand met die
naam.

```bash
nano filename.txt
```

## Basisnavigatie {#basic-navigation}

Gebruik de pijltjestoetsen om de cursor door de tekst te bewegen. Met Page Up en
Page Down ga je een pagina tegelijk omhoog of omlaag.

- `Ctrl + A` gaat naar het begin van de regel.
- `Ctrl + E` gaat naar het eind van de regel.
- `Ctrl + Y` scrolt een regel omhoog.
- `Ctrl + V` scrolt een regel omlaag.

## Tekst bewerken {#editing-text}

Typ direct in de editor om tekst toe te voegen of te wijzigen. Gebruik Backspace
om tekens te verwijderen. Om hele regels te verwijderen, knip je de regel met
`Ctrl + K`. Plak de geknipte regel met `Ctrl + U`.

## Opslaan en afsluiten {#saving-and-exiting}

Druk op `Ctrl + O` (WriteOut) om je wijzigingen op te slaan. Je wordt gevraagd
de bestandsnaam te bevestigen. Druk op `Ctrl + X` (Exit) om Nano af te sluiten.
Heb je je wijzigingen niet opgeslagen, dan vraagt Nano of je wilt opslaan
voordat het afsluit.

## Zoeken {#searching}

Druk op `Ctrl + W` om tekst in het bestand te zoeken. Typ het woord of de zin
die je zoekt en druk op Enter. Gebruik `Ctrl + W` opnieuw voor de volgende
treffer.

## Andere handige commando's {#other-useful-commands}

`Ctrl + G` toont het hulpmenu met alle beschikbare commando's. `Ctrl + C` toont
de huidige positie van de cursor. `Ctrl + \_` (underscore) zet het zacht
afbreken van lange regels aan of uit.

## Aanpassen {#customization}

Je past Nano aan door het configuratiebestand `.nanorc` in je thuismap te maken
of te wijzigen. Je stelt er onder andere de syntaxmarkering en de sneltoetsen
in.
