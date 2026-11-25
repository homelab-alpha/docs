---
title: "Tips en trucs voor Nano"
description: "Bewerk tekst prettiger met handige tips en trucs voor Nano."
url: "back-to-basics/nano/tips-and-tricks"
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
  - productivity
  - text editing
  - tips and tricks
keywords:
  - Nano
  - text editor
  - productivity
  - text editing
  - Nano features
  - Nano customization
  - Nano commands
  - Nano shortcuts
  - syntax highlighting
  - spell checking
  - clipboard integration
  - external commands
  - line wrapping
  - backup files
  - smart Home key

weight: 2603

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Blijvend ongedaan maken {#persistent-undo}

Zet de functie voor blijvend ongedaan maken van Nano aan, zodat je wijzigingen
ook na opslaan en sluiten ongedaan kunt maken. Zet `set undo` in je
configuratiebestand `.nanorc`.

## Automatisch inspringen {#automatic-indentation}

Nano kan regels automatisch laten inspringen op basis van de syntaxis van het
bestand. Zet dat aan met `set autoindent` in je `.nanorc`.

## Syntaxmarkering aanpassen {#syntax-highlighting-customization}

Pas de kleuren en stijlen van de syntaxmarkering in Nano aan door een bestand
`.nanorc` in je thuismap te wijzigen of te maken.

## Taal van de spellingcontrole {#spell-checking-language}

Wijzig de taal van de spellingcontrole van Nano door de omgevingsvariabele
`LANG` in te stellen voordat je Nano start.

## De cursorpositie onthouden {#cursor-location-persistence}

Nano onthoudt de laatste positie van de cursor in een bestand. Zet deze functie
uit door `set positionlog` toe te voegen aan je `.nanorc`.

## Integratie met het klembord {#clipboard-integration}

Kopieer en plak tekst tussen Nano en andere programma's met `Ctrl + Shift + 6`
om geselecteerde tekst te kopiëren en `Ctrl + Shift + U` om te plakken vanaf het
klembord.

## Externe commando's {#external-commands}

Voer externe commando's direct vanuit Nano uit met sneltoetsen als `Ctrl + R` om
de uitvoer van een commando in te lezen, `Ctrl + T` voor de spellingcontrole en
`Ctrl + \` om te zoeken en te vervangen met reguliere expressies.

## Tekstblokken markeren {#marking-text-blocks}

Markeer tekstblokken met `Alt + A` om te kopiëren of te knippen. Gebruik
`Alt + 6` om de gemarkeerde tekst te kopiëren of `Alt + K` om die te knippen.

## Regels afbreken {#line-wrapping}

Zet het afbreken van regels aan of uit met `Ctrl + \_` (underscore), zodat lange
regels in het terminalvenster passen.

## Back-upbestanden {#backup-files}

Maak automatisch back-upbestanden voordat je wijzigingen opslaat, door
`set backup` toe te voegen aan je `.nanorc`.

## Externe bestanden voor syntaxmarkering {#external-syntax-highlighting-files}

Ondersteun extra talen met externe bestanden voor syntaxmarkering in
`/usr/share/nano`, die je in je `.nanorc` opneemt.

## Slimme Home-toets {#smart-home-key}

Zet het slimme gedrag van de Home-toets aan met `set smarthome` in je `.nanorc`,
voor een betere beweging van de cursor.

## Conclusie {#conclusion}

Met deze tips en trucs haal je meer uit Nano en bewerk je tekst efficiënter.
Probeer ze uit om je werk te stroomlijnen en een echte kenner van Nano te
worden!
