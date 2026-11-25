---
title: "Spoedcursus Vim"
description:
  "Begin goed met Vim met deze spoedcursus over de belangrijkste commando's en
  modi voor efficiënt tekst bewerken."
url: "back-to-basics/vim/crash-course"
aliases: ""
icon: "description"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Back to Basics
series:
  - Vim
tags:
  - Vim
  - text editor
  - productivity
  - text editing
  - crash course
keywords:
  - Vim
  - text editor
  - productivity
  - text editing
  - Vim modes
  - Vim navigation
  - Vim editing
  - Vim commands
  - Vim customization
  - Vim resources
  - Vim tutorial
  - Vim basics
  - Vim features

weight: 2802

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Kennismaking met Vim {#introduction-to-vim}

Vim, kort voor `Vi IMproved`, is een verbeterde versie van de klassieke
Unix-teksteditor Vi. Vim is ver aan te passen en heeft functies voor efficiënt
tekst bewerken.

## Modi in Vim {#modes-in-vim}

Vim werkt in verschillende modi, elk met een eigen functie:

1. **Normal Mode**: de standaardmodus om te navigeren en commando's uit te
   voeren.
2. **Insert Mode**: om tekst in te voegen en te bewerken.
3. **Visual Mode**: om tekst visueel te selecteren en te bewerken.
4. **Command-Line Mode**: om commando's van Vim in te voeren.

## Basisnavigatie {#basic-navigation}

- `h`, `j`, `k`, `l`: naar links, omlaag, omhoog en naar rechts.
- `w`: naar het begin van het volgende woord.
- `b`: naar het begin van het vorige woord.
- `0`: naar het begin van de huidige regel.
- `$`: naar het eind van de huidige regel.
- `gg`: naar het begin van het bestand.
- `G`: naar het eind van het bestand.
- `Ctrl + f`: een pagina omlaag scrollen.
- `Ctrl + b`: een pagina omhoog scrollen.

## Tekst bewerken {#editing-text}

- `i`: Insert Mode vóór de cursor.
- `a`: Insert Mode na de cursor.
- `o`: een nieuwe regel eronder openen en Insert Mode starten.
- `O`: een nieuwe regel erboven openen en Insert Mode starten.
- `x`: het teken onder de cursor verwijderen.
- `dd`: de huidige regel verwijderen.
- `yy`: de huidige regel kopiëren (yank).
- `p`: gekopieerde of verwijderde tekst na de cursor plakken.
- `u`: de laatste actie ongedaan maken.
- `Ctrl + r`: de laatste ongedaan gemaakte actie opnieuw uitvoeren.

## Visual Mode

- `v`: tekst teken voor teken selecteren.
- `V`: hele regels selecteren.
- `Ctrl + v`: rechthoekige tekstblokken selecteren.

## Command-Line Mode

- `:w`: wijzigingen opslaan.
- `:q`: Vim afsluiten.
- `:q!`: Vim afsluiten zonder wijzigingen op te slaan.
- `:wq` of `:x`: wijzigingen opslaan en afsluiten.
- `:e [file]`: een bestand openen om te bewerken.
- `:set nu`: regelnummers tonen.
- `:set nonu`: regelnummers verbergen.

## Gevorderde functies {#advanced-features}

- **Zoeken**: `/` gevolgd door de zoekterm. Druk op `n` voor de volgende
  treffer.
- **Vervangen**: `:%s/old/new/g` om alle "old" te vervangen door "new".
- **Buffers**: `:ls` om de open buffers te tonen, `:b [number]` om van buffer te
  wisselen.
- **Tabbladen**: `:tabnew [file]` om een bestand in een nieuw tabblad te openen,
  `gt` om van tabblad te wisselen.

## Aanpassen {#customization}

- **.vimrc**: pas instellingen en toetskoppelingen aan in het
  configuratiebestand van Vim.

## Bronnen om verder te leren {#resources-for-further-learning}

- **Vimtutor**: voer `vimtutor` uit in de terminal voor de ingebouwde
  handleiding van Vim.
- **Online gidsen en handleidingen**: verken verschillende online bronnen voor
  uitgebreide gidsen over Vim.

## Conclusie {#conclusion}

Vim is in het begin lastig, maar eenmaal onder de knie ongeëvenaard efficiënt.
Oefen regelmatig en verken de functies om er alles uit te halen. Veel plezier
met bewerken!
