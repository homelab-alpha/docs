---
title: "Overzicht van dotfiles"
description: "Maak kennis met dotfiles en de aanpassingen erin"
url: "dotfiles/overview"
aliases: ""
icon: "overview"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Dotfiles
series:
  - Dotfiles
tags:
  - dotfiles
  - configuration files
  - customization
keywords:
  - dotfiles
  - dotfiles overview
  - dotfiles customization
  - dotfiles configurations
  - dotfiles usage
  - bash configuration
  - vim configuration
  - git configuration
  - tmux configuration
  - dotfiles repository

weight: 5001

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Inleiding

Dotfiles zijn configuratiebestanden waarmee je je systeemomgeving persoonlijk
maakt. Deze repository bevat mijn eigen instellingen en configuraties voor
allerlei opdrachtregeltools, editors en toepassingen die ik regelmatig gebruik.

## Inhoud

- **bash**: configuratiebestanden voor de Bash-shell (`.bashrc`,
  `.bash_aliases`, `.bash_exports` en `.bash_snippets`).
- **zsh**: configuratie voor de Zsh-shell (`.zshrc`).
- **vim**: instellingen voor de teksteditor Vim (`.vimrc`).
- **nano**: instellingen voor de teksteditor nano (`.nanorc`) en bestanden voor
  syntaxiskleuring (`.nano/`).
- **git**: Git-instellingen (`.gitconfig` en `.gitignore_global`).
- **tmux**: configuratie voor de terminalmultiplexer tmux (`.tmux.conf`).
- **editor**: de standaard gekozen editor (`.selected_editor`).
- **scripts**: handige scripts om taken te automatiseren of productiever te
  werken (`.bash-script/`).
- **installer**: het script `dotfiles_installer.sh` dat de dotfiles installeert
  en verwijdert.

## Gebruik

Bekijk en gebruik gerust alle configuraties in deze repository. Je kunt de
repository klonen naar `$HOME/dotfiles` en het script `dotfiles_installer.sh`
uitvoeren. Dat maakt een back-up van je huidige configuratie en kopieert de
dotfiles naar je thuismap. Je kunt de gewenste configuratiebestanden ook met de
hand kopiëren. Maak wel eerst een back-up van je huidige configuratie voordat je
die overschrijft.

## Logbestanden

Waar logbestanden staan, verschilt per besturingssysteem en toepassing.
Logbestanden staan vaak in een submap van de installatiemap van de toepassing,
of in een systeemmap zoals `/var/log` op Linux.

Het script `dotfiles_installer.sh` schrijft zijn logregels naar
`$HOME/dotfiles.log`.

## Bijdragen aan Homelab-Alpha - Dotfiles

We waarderen je bijdrage en maken het je zo makkelijk mogelijk om bij te dragen
aan de repository Homelab-Alpha - dotfiles. Wijzigingen aan de dotfiles lopen
via pull requests naar de branch `main`. Lees [hoe je bijdraagt][contribute].

## Licentie

Dit project valt onder de **Creative Commons
Naamsvermelding-NietCommercieel-GelijkDelen 4.0 Internationaal-licentie** (CC
BY-NC-SA 4.0). Zie de pagina [licentie][license] voor de volledige licentietekst
en het bestand [NOTICE] voor de eisen aan de naamsvermelding.

[license]: /license/
[NOTICE]: https://github.com/homelab-alpha/dotfiles/blob/main/NOTICE
[contribute]: /contributing/contribute/
