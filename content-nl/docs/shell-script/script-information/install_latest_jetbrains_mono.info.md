---
title: "install_latest_jetbrains_mono.info"
description:
  "Automatiseer de installatie van het nieuwste lettertype JetBrains Mono. Dit
  script haalt de nieuwste release op van GitHub, downloadt die, installeert die
  voor het hele systeem en ruimt op. Uitgebreide foutafhandeling zorgt voor een
  betrouwbare uitvoering."
url: "shell-script/script-info/install-latest-jetbrains-mono"
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
  - JetBrains Mono
  - Font Installation
  - Shell Script
  - Automation
  - GitHub API
  - Linux Fonts
keywords:
  - JetBrains Mono
  - install script
  - download font
  - GitHub releases
  - system fonts
  - shell script
  - Linux automation
  - font management

weight: 10212

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`install_latest_jetbrains_mono.sh`, is geschreven door GJS (homelab-alpha) en
haalt de nieuwste versie van JetBrains Mono op uit de officiële
GitHub-repository, downloadt die, installeert die in de systeembrede
lettertypemap en ruimt de gedownloade bestanden op.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `install_latest_jetbrains_mono.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 28 oktober 2026
- **Versie**: 1.1.3
- **Beschrijving**: het script haalt de nieuwste versie van JetBrains Mono op
  uit de officiële GitHub-repository, downloadt die, installeert die in de
  systeembrede lettertypemap en ruimt de gedownloade bestanden op.
- **Gebruik**: `sudo ./install_latest_jetbrains_mono.sh`
- **RAW-script**: [install_latest_jetbrains_mono.sh]

## Logging

Het script toont elke melding in de terminal en voegt die toe aan het logbestand
`$HOME/.bash-script/install_latest_jetbrains_mono.log`. De functie `log` legt
informatieve meldingen vast en de functie `log_error` fouten, allebei met een
tijdstempel. Het script maakt de logmap niet zelf.

```bash
LOG_DIR="$HOME/.bash-script"
LOG_FILE="$LOG_DIR/install_latest_jetbrains_mono.log"

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

Het script haalt eerst de nieuwste versie van JetBrains Mono op via de
GitHub-API. Het stuurt met `curl` een verzoek naar het API-endpoint voor de
releases van JetBrains Mono en haalt met `grep` de tagnaam van de nieuwste
release eruit. Die tagnaam, met het versienummer, wordt met `sed` opgeschoond
zodat alleen het versienummer overblijft.

```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/JetBrains/JetBrainsMono/releases/latest | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
```

## Foutafhandeling bij het ophalen van de versie {#error-handling-for-version-fetching}

Het script controleert of het ophalen van de versie is gelukt, door na te gaan
of de variabele `LATEST_VERSION` niet leeg is. Is die leeg, dan toont het een
foutmelding en stopt het met status 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  log_error "Failed to fetch the latest version of JetBrains Mono. Exiting."
  exit 1
fi
```

## De download-URL opbouwen {#constructing-the-download-url}

Met het opgehaalde versienummer bouwt het script de URL op om het nieuwste
zip-bestand van JetBrains Mono te downloaden.

```bash
DOWNLOAD_URL="https://github.com/JetBrains/JetBrainsMono/releases/download/v${LATEST_VERSION}/JetBrainsMono-${LATEST_VERSION}.zip"
```

## De downloadmap bepalen {#defining-the-download-directory}

Het script bepaalt de map waarin het gedownloade bestand wordt bewaard. Hier is
dat de map `Downloads` in de thuismap van de gebruiker.

```bash
DOWNLOAD_DIR="$HOME/Downloads"
```

## De downloadmap controleren en maken {#checking-and-creating-the-download-directory}

Het script controleert of de downloadmap bestaat en maakt die als dat niet zo
is.

```bash
log "Ensuring download directory exists: $DOWNLOAD_DIR"
mkdir -p "$DOWNLOAD_DIR"
```

## De nieuwste versie downloaden {#downloading-the-latest-version}

Het script downloadt het zip-bestand van JetBrains Mono met `wget` naar de
opgegeven downloadmap.

```bash
if ! wget -v "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}.zip"; then
  log_error "Failed to download JetBrains Mono version ${LATEST_VERSION}. Exiting."
  exit 1
fi
```

## Foutafhandeling bij het downloaden {#error-handling-for-downloading}

Het controleert of `wget` het bestand heeft gedownload door na te gaan of het
bestaat. Mislukt de download, dan toont het een foutmelding en stopt het met
status 1.

```bash
log "Successfully downloaded JetBrains Mono to $DOWNLOAD_DIR."
```

## Het gedownloade bestand uitpakken {#extracting-the-downloaded-file}

Het script pakt de inhoud van het gedownloade zip-bestand met `unzip` uit in de
downloadmap.

```bash
unzip "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}.zip" -d "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}"
```

## De installatiemap voorbereiden {#preparing-the-installation-directory}

Het script maakt de doelmap `/usr/share/fonts/jetbrains-mono` als die nog niet
bestaat.

```bash
JETBRAINS_MONO_DIR="/usr/share/fonts/jetbrains-mono"
sudo mkdir -p "$JETBRAINS_MONO_DIR"
```

## Eerdere installaties verwijderen {#removing-previous-installations}

Om conflicten te voorkomen, verwijdert het script eerdere installaties van
JetBrains Mono uit de doelmap.

```bash
sudo rm -rf "$JETBRAINS_MONO_DIR"/*
```

## Bestanden naar de installatiemap verplaatsen {#moving-files-to-the-installation-directory}

Het script verplaatst de lettertypebestanden naar de systeembrede lettertypemap.

```bash
sudo mv "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}/fonts/"* "$JETBRAINS_MONO_DIR"
```

## De installatie controleren {#verifying-the-installation}

Het controleert of de lettertypebestanden in de doelmap staan. Worden ze niet
gevonden, dan toont het een foutmelding en stopt het met status 1.

```bash
if [ ! -f "$JETBRAINS_MONO_DIR/ttf/JetBrainsMono-Regular.ttf" ]; then
  log_error "Failed to move JetBrains Mono fonts to $JETBRAINS_MONO_DIR. Exiting."
  exit 1
fi
```

## De lettertypecache bijwerken {#updating-the-font-cache}

Het script werkt de lettertypecache bij, zodat de nieuwe lettertypen in het hele
systeem beschikbaar zijn.

```bash
sudo fc-cache -f -v
```

## Opruimen {#cleaning-up}

Het script verwijdert het gedownloade zip-bestand en de uitgepakte map, om
overbodige bestanden op te ruimen.

```bash
rm "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}.zip"
rm -r "$DOWNLOAD_DIR/JetBrainsMono-${LATEST_VERSION}"
```

## De installatie controleren met de lijst van lettertypen {#verifying-the-installation-by-listing-installed-fonts}

Tot slot controleert het script of JetBrains Mono is geïnstalleerd, door de
geïnstalleerde lettertypen op te vragen en het lettertype daarin te zoeken.
Wordt het niet gevonden, dan toont het een foutmelding; anders een melding dat
het is gelukt.

```bash
if ! fc-list | grep -q "JetBrains Mono"; then
  log_error "JetBrains Mono font not found. Installation may have failed."
  exit 1
fi
log "JetBrains Mono font installed successfully."
```

## Conclusie {#conclusion}

Dit script automatiseert het downloaden en installeren van de nieuwste versie
van JetBrains Mono, zodat je altijd de nieuwste versie hebt met zo min mogelijk
handwerk. Het handelt fouten uitgebreid af en legt duidelijk uit hoe je de
installatie zo nodig afrondt.

[install_latest_jetbrains_mono.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_jetbrains_mono.sh
