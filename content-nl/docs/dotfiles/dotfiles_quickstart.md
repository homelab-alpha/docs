---
title: "Snelstart dotfiles"
description:
  "Begin met het beheren van je dotfiles met deze snelstarthandleiding"
url: "dotfiles/quickstart"
aliases: ""
icon: "rocket_launch"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Dotfiles
series:
  - Dotfiles
tags:
  - dotfiles management
keywords:
  - dotfiles
  - quickstart guide
  - dotfiles installation
  - dotfiles management
  - dotfiles script
  - dotfiles backup
  - dotfiles removal
  - dotfiles uninstallation
  - dotfiles log files

weight: 5002

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

## Snel installeren {#quick-install}

```bash
git clone https://github.com/homelab-alpha/dotfiles.git ~/dotfiles && cd ~/dotfiles && echo 1 | ./dotfiles_installer.sh
```

## Het script `dotfiles_installer.sh` gebruiken {#using-the-dotfiles_installersh-script}

### De repository klonen {#clone-the-repository}

Voer het volgende commando uit in je terminal:

```bash
git clone https://github.com/homelab-alpha/dotfiles.git ~/dotfiles
```

Dit commando kloont de repository met dotfiles van GitHub naar `~/dotfiles`. Het
installatiescript verwacht de repository in `$HOME/dotfiles`.

### Naar de map gaan {#navigate-to-the-folder}

Ga naar de gekloonde repository met het volgende commando:

```bash
cd $HOME/dotfiles
```

### Het installatiescript uitvoeren {#run-the-installation-script}

Voer in de map `dotfiles` het installatiescript uit met:

```bash
./dotfiles_installer.sh
```

Het script toont een menu. Kies `1` om de dotfiles te installeren of `2` om ze
te verwijderen. Na de installatie verwijdert het script `.git`, `.github` en
`.gitignore` uit `$HOME/dotfiles`.

### Volg eventuele instructies {#follow-any-instructions}

Als het script om meer acties vraagt, volg dan de instructies op het scherm.

### Controlelijst vóór de installatie {#pre-installation-checklist}

Van de volgende bestanden wordt vóór de installatie een back-up gemaakt:

```plaintext
~/.bash_*
~/.bash-*
~/.bashrc
~/.gitconfig
~/.nano
~/.nanorc
~/.profile
~/.selected_editor
~/.tmux.conf
~/.vimrc
~/.zshrc
```

Je vindt de back-ups in `$HOME/dotfiles-backup/before-installation`.

### De installatie controleren {#verifying-the-installation}

Controleer na het installatiescript of je dotfiles goed zijn geïnstalleerd.

## Dotfiles verwijderen {#removal-of-dotfiles}

Om de dotfiles te verwijderen, voer je het script `dotfiles_installer.sh`
opnieuw uit en kies je `2`.

### Controlelijst vóór het verwijderen {#pre-uninstallation-checklist}

Net als bij de installatie wordt er een back-up van je bestanden gemaakt:

```plaintext
~/.bash_*
~/.bash-*
~/.bashrc
~/.gitconfig
~/.nano
~/.nanorc
~/.profile
~/.selected_editor
~/.tmux.conf
~/.vimrc
~/.zshrc
```

Deze back-ups staan in `$HOME/dotfiles-backup/before-uninstallation`.

### Na het verwijderen {#post-deletion-process}

Na het verwijderen worden je dotfiles uit de back-up teruggezet. Het script
verwijdert ook de map `$HOME/dotfiles`.

### Het verwijderen controleren {#verifying-the-uninstallation}

Controleer na het verwijderen of alles goed is verwijderd.

Met deze stappen beheer je je dotfiles eenvoudig met het script
`dotfiles_installer.sh` uit de GitHub-repository. Heb je nog vragen? Stel ze
gerust!

## Logbestanden {#log-files}

Waar logbestanden staan, verschilt per besturingssysteem en toepassing.
Logbestanden staan vaak in een submap van de installatiemap van de toepassing,
of in een systeemmap zoals `/var/log` op Linux.

Het script `dotfiles_installer.sh` schrijft zijn logregels naar
`$HOME/dotfiles.log`.
