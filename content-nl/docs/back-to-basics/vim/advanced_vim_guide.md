---
title: "Gevorderde gids voor Vim"
description:
  "Haal alles uit Vim met gevorderde technieken en mogelijkheden om het aan te
  passen, voor efficiënt tekst bewerken."
url: "back-to-basics/vim/advanced-guide"
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
  - advanced techniques
  - customization
keywords:
  - Vim
  - text editor
  - productivity
  - text editing
  - Vim macros
  - Vim registers
  - Vim marks
  - Vim folding
  - Vim plugins
  - Vimscript
  - Vim sessions
  - remote editing
  - version control integration

weight: 2801

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Vim beheersen {#mastering-vim}

Vim, een teksteditor die je zeer ver kunt aanpassen, heeft een groot aantal
gevorderde functies en instellingen. Laten we die verkennen om meer uit Vim te
halen:

## Macro's

Met macro's neem je reeksen toetsaanslagen op en speel je ze opnieuw af, om
herhalende taken te automatiseren. Begin een opname met `q` gevolgd door een
letter, stop met `q` en voer de macro uit met `@`.

## Registers

Registers zijn tijdelijke opslag voor het bewerken van tekst. Kopieer (yank)
naar een register met `"a` en plak met `"ap`.

## Markeringen {#marks}

Zet met markeringen bladwijzers op bepaalde plekken in een bestand, om er snel
naartoe te gaan. Zet een markering met `m` + letter en spring ernaartoe met
`'` + letter.

## Vouwen {#folding}

Klap delen van code of tekst in en uit met vouwen. Vouw met `zf` en vouw open
met `zo`.

## Plug-ins {#plugins}

Het ecosysteem van plug-ins breidt Vim uit. Vim 8 en nieuwer kan plug-ins zelf
laden uit `~/.vim/pack/*/start/` (zie `:help packages`), dus een pluginbeheerder
is niet nodig. Populaire keuzes zijn:

- **vim-plug**: een minimale pluginbeheerder om eenvoudig te installeren en bij
  te werken.
- **NERDTree**: een verkenner voor het bestandssysteem (Vim heeft ook de
  ingebouwde `netrw`, die je opent met `:Explore`).
- **fzf.vim**: fuzzy zoeken in bestanden, buffers en tekst.
- **YouCompleteMe**: een engine voor het aanvullen van code, met suggesties op
  basis van de context.

## Vimscript

Pas het gedrag van Vim aan met Vimscript. Definieer functies, toetskoppelingen
en autocommando's in `.vimrc`.

## Vim-sessies {#vim-sessions}

Bewaar en herstel bewerksessies met `:mksession [session-file]` en
`:source [session-file]`.

## Op afstand bewerken {#remote-editing}

Bewerk bestanden via SSH of andere protocollen op afstand met
`vim scp://user@host//path/to/file`.

## Integratie met versiebeheer {#version-control-integration}

Werk soepel samen met versiebeheersystemen als Git. Plug-ins als Fugitive voegen
integratie met Git toe aan Vim.

## Conclusie {#conclusion}

Met de gevorderde functies en instellingen van Vim kunnen ontwikkelaars en
ervaren gebruikers veel. Probeer ze uit om Vim aan je werk aan te passen en
productiever te worden. Veel plezier met bewerken!
