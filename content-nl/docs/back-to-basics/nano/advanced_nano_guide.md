---
title: "Gevorderde gids voor Nano"
description:
  "Word beter in Nano met deze uitgebreide gids, met gevorderde technieken als
  werken met meerdere buffers, syntaxmarkering, zoeken en vervangen met
  reguliere expressies en meer."
url: "back-to-basics/nano/advanced-guide"
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
  - advanced guide
  - buffer editing
  - syntax highlighting
  - regex search and replace
keywords:
  - Nano
  - text editor
  - advanced guide
  - buffer editing
  - syntax highlighting
  - regex search and replace
  - Nano features
  - Nano commands
  - Nano shortcuts
  - Nano customization
  - advanced text editing
  - Nano syntax highlighting
  - Nano regex
  - Nano window splitting

weight: 2601

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Werken met meerdere buffers {#multiple-buffer-editing}

In Nano bewerk je meerdere buffers tegelijk. Gebruik
`nano -O file1.txt file2.txt` om meerdere bestanden te openen. Wissel tussen
buffers met `Alt + <` en `Alt + >`.

## Kopiëren en plakken {#copying-and-pasting}

Markeer tekst om te kopiëren met `Alt + ^`. Zet de cursor aan het eind van de
gewenste tekst en druk op `Alt + 6` om te kopiëren. Plak met `Alt + U`.

## Syntaxmarkering {#syntax-highlighting}

Zet syntaxmarkering aan met de vlag `-Y`: `nano -Y <language> filename`. Vervang
`<language>` door de aanduiding van de taal (bijv. `sh`, `python`, `c`).

## Spellingcontrole {#spell-checking}

Zet spellingcontrole aan met de vlag `-S`: `nano -S filename`. Gebruik
`Ctrl + T` om de spellingcontrole aan of uit te zetten.

## Regelnummers {#line-numbering}

Toon regelnummers met de vlag `-c`: `nano -c filename`. De regelnummers staan
links.

## Zoeken en vervangen met reguliere expressies {#regular-expression-search-and-replace}

Met reguliere expressies (regex) zoek en vervang je tekst efficiënt. Volg deze
stappen:

1. **Zet de regex-modus aan**: druk op `Alt + R` om de regex-modus aan te
   zetten.
2. **Voer het zoekpatroon in**: typ het regex-patroon in het zoekveld.
3. **Voer de vervangende tekst in**: typ de tekst die de gevonden tekst vervangt
   in het vervangveld.
4. **Zoeken en vervangen**:
   - Druk op `Alt + W` om de huidige treffer te vervangen.
   - Druk op `Alt + A` om alle treffers in het document te vervangen.

### Voorbeeld van gebruik {#example-usage}

- **Zoeken**: alle e-mailadressen vind je met de regex:
  `\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b`
- **Vervangen**: om alle gevonden e-mailadressen te vervangen door
  `example@example.com`, voer je dat in het vervangveld in.

### Tips

- **Bewaar eerst**: maak altijd een back-up van je document voordat je veel
  vervangt.
- **Test je regex**: test je regex eerst op een klein deel van je document, om
  te zien of die werkt zoals verwacht.
- **Gebruik groepen**: gebruik groepen in je regex (bijv. `(...)`) om delen van
  je treffer opnieuw te gebruiken in de vervangende tekst.

Veel succes met efficiënt zoeken en vervangen met reguliere expressies!

## Eigen sneltoetsen {#custom-key-bindings}

Pas sneltoetsen aan in het bestand `.nanorc` met het commando `bind`,
bijvoorbeeld: `bind ^X savefile main`.

## Gevorderde opties {#advanced-options}

Bekijk de gevorderde opties in de handleiding van Nano (`man nano`) voor
uitgebreide aanpassingen.

## Conclusie {#conclusion}

Met deze gevorderde functies van Nano richt je je bewerkomgeving naar wens in en
werk je productiever. Probeer ze uit om je werk te verfijnen en efficiënter te
maken. Veel plezier met bewerken!
