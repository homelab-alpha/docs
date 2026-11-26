---
title: "install_latest_dart_sass.info"
description:
  "Automatiseer met dit shellscript het ophalen, downloaden, installeren en
  opruimen van de nieuwste versie van Dart Sass uit de officiële
  GitHub-repository."
url: "shell-script/script-info/install-latest-dart-sass"
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
  - Shell Script
  - Dart Sass
  - GitHub
  - Automation
  - Installation
keywords:
  - Dart Sass installation
  - Shell script
  - GitHub API
  - Automated deployment
  - Error handling

weight: 10209

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`install_latest_dart_sass.sh`, is geschreven door GJS (homelab-alpha) en haalt
de nieuwste versie van Dart Sass op uit de officiële GitHub-repository,
downloadt en installeert die, en ruimt daarna op.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `install_latest_dart_sass.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 9 mei 2025
- **Versie**: 1.1.2
- **Beschrijving**: dit script haalt de nieuwste versie van Dart Sass op uit de
  officiële GitHub-repository, downloadt die, installeert die in
  `/usr/local/dart-sass` en ruimt de gedownloade bestanden op.
- **RAW-script**: [install_latest_dart_sass.sh]

## Logging

Het script toont elke melding in de terminal en voegt die toe aan het logbestand
`$HOME/.bash-script/install_latest_dart_sass.log`. De functie `log` legt
informatieve meldingen vast en de functie `log_error` fouten, allebei met een
tijdstempel. Het script maakt de logmap niet zelf.

```bash
LOG_DIR="$HOME/.bash-script"
LOG_FILE="$LOG_DIR/install_latest_dart_sass.log"

log() {
  local TIMESTAMP
  TIMESTAMP=$(date +"%b %d, %Y %H:%M:%S")
  echo "$TIMESTAMP [INFO] - $1" | tee -a "$LOG_FILE"
}

log_error() {
  local TIMESTAMP
  TIMESTAMP=$(date +"%b %d, %Y %H:%M:%S")
  echo "$TIMESTAMP [ERROR] - $1" | tee -a "$LOG_FILE"
}
```

## De nieuwste versie ophalen {#fetching-the-latest-version}

Het script haalt eerst de nieuwste versie van Dart Sass op via de GitHub-API.
Het stuurt met `curl` een verzoek naar het API-endpoint voor de releases van
Dart Sass en haalt met `grep` de tagnaam van de nieuwste release eruit. Die
tagnaam, met het versienummer, wordt met `sed` opgeschoond zodat alleen het
versienummer overblijft.

```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/sass/dart-sass/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
```

## Foutafhandeling bij het ophalen van de versie {#error-handling-for-version-fetching}

Het script controleert of het ophalen van de versie is gelukt, door na te gaan
of de variabele `LATEST_VERSION` niet leeg is. Is die leeg, dan toont het een
foutmelding en stopt het met status 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  log_error "Unable to fetch the latest version of Dart Sass. Exiting."
  exit 1
fi
```

## De download-URL opbouwen {#constructing-the-download-url}

Met het opgehaalde versienummer bouwt het script de URL op om het nieuwste
binaire bestand van Dart Sass te downloaden.

```bash
DOWNLOAD_URL="https://github.com/sass/dart-sass/releases/download/${LATEST_VERSION}/dart-sass-${LATEST_VERSION}-linux-x64.tar.gz"
```

## De downloadmap bepalen {#defining-the-download-directory}

Het script bepaalt de map waarin het gedownloade bestand wordt bewaard. Hier is
dat de map `Downloads` in de thuismap van de gebruiker.

```bash
DOWNLOAD_DIR="$HOME/Downloads"
```

## De nieuwste versie downloaden {#downloading-the-latest-version}

Het script downloadt het tar.gz-bestand van Dart Sass met `wget` naar de
opgegeven downloadmap en controleert of de download is gelukt.

```bash
if ! wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/dart-sass-${LATEST_VERSION}-linux-x64.tar.gz"; then
  log_error "Failed to download Dart Sass version ${LATEST_VERSION}. Exiting."
  exit 1
fi
log "Successfully downloaded Dart Sass version ${LATEST_VERSION} to $DOWNLOAD_DIR."
```

## Het gedownloade bestand uitpakken {#extracting-the-downloaded-file}

Het script pakt de inhoud van het gedownloade tar.gz-bestand met `tar` uit in de
downloadmap.

```bash
tar -xzf "$DOWNLOAD_DIR/dart-sass-${LATEST_VERSION}-linux-x64.tar.gz" -C "$DOWNLOAD_DIR"
```

## De installatiemap voorbereiden {#preparing-the-installation-directory}

Het script maakt de doelmap `/usr/local/dart-sass` als die nog niet bestaat.
Daarna verwijdert het eerdere installaties in die map, voor een schone
installatie.

```bash
sudo mkdir -p /usr/local/dart-sass
sudo rm -rf /usr/local/dart-sass/*
```

## Bestanden naar de installatiemap verplaatsen {#moving-files-to-the-installation-directory}

Het script verplaatst de uitgepakte bestanden naar de doelmap en controleert of
dat is gelukt.

```bash
if ! sudo mv "$DOWNLOAD_DIR/dart-sass"/* /usr/local/dart-sass/; then
  log_error "Failed to move Dart Sass files to /usr/local/dart-sass. Exiting."
  exit 1
fi
log "Dart Sass version ${LATEST_VERSION} installed successfully."
```

## Opruimen {#cleaning-up}

Het script verwijdert het gedownloade tar.gz-bestand en de uitgepakte map uit de
downloadmap, om overbodige bestanden op te ruimen.

```bash
rm -r "$DOWNLOAD_DIR/dart-sass-${LATEST_VERSION}-linux-x64.tar.gz"
rm -rf "$DOWNLOAD_DIR/dart-sass"
log "Cleanup complete."
```

## Controleren of het commando sass beschikbaar is {#checking-for-sass-command-availability}

Tot slot controleert het script of het commando `sass` in de PATH van de
gebruiker staat. Wordt het niet gevonden, dan legt het uit hoe je Dart Sass aan
de PATH toevoegt.

```bash
if ! command -v sass &>/dev/null; then
  log_error "Sass command not found. You may need to add Dart Sass to your PATH."
  log_error "To do this, add the following line to your ~/.bashrc or ~/.bash_profile:"
  log_error "export PATH=\$PATH:/usr/local/dart-sass"
  exit 1
else
  log "Sass version: $(sass --version)"
fi
```

## Conclusie {#conclusion}

Dit script automatiseert het downloaden en installeren van de nieuwste versie
van Dart Sass, zodat je altijd de nieuwste versie hebt met zo min mogelijk
handwerk. Het handelt fouten uitgebreid af en legt duidelijk uit hoe je de
installatie zo nodig afrondt.

[install_latest_dart_sass.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_dart_sass.sh
