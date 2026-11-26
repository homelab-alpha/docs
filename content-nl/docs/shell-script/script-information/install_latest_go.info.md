---
title: "install_latest_go.info"
description:
  "Automatiseer met dit shellscript het ophalen, downloaden, installeren en
  opruimen van de nieuwste versie van Go van de officiële downloadpagina van Go."
url: "shell-script/script-info/install-latest-go"
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
  - Go
  - Automation
  - Installation
keywords:
  - Go installation
  - Shell script
  - Official Go download
  - Automated deployment
  - Error handling

weight: 10210

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`install_latest_go.sh`, is geschreven door GJS (homelab-alpha) en haalt de
nieuwste versie van Go op van de officiële downloadpagina van Go, downloadt en
installeert die, en ruimt daarna op.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `install_latest_go.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 11 november 2025
- **Versie**: 1.2.0
- **Beschrijving**: dit script haalt de nieuwste versie van Go op van de
  officiële downloadpagina van Go, downloadt die, installeert die in
  `/usr/local/go` en ruimt de gedownloade bestanden op.
- **RAW-script**: [install_latest_go.sh]

## Logging

Het script toont elke melding in de terminal en voegt die toe aan het logbestand
`$HOME/.bash-script/install_latest_go.log`. De functie `log` legt informatieve
meldingen vast en de functie `log_error` fouten, allebei met een tijdstempel.
Het script maakt de logmap niet zelf.

```bash
LOG_DIR="$HOME/.bash-script"
LOG_FILE="$LOG_DIR/install_latest_go.log"

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

## De geïnstalleerde versie controleren {#checking-the-installed-version}

Voor de installatie controleert het script of Go al beschikbaar is en logt het
de geïnstalleerde versie.

```bash
log "Checking current installed version of Go (if available)..."
if command -v go &>/dev/null; then
  log "Go version: $(go version)"
else
  log "Go is not currently installed."
fi
```

## De nieuwste versie ophalen {#fetching-the-latest-version}

Het script haalt de nieuwste versie van Go op van de officiële downloadpagina
van Go. Het vraagt met `curl` het versie-endpoint van Go op, houdt met `head`
alleen de eerste regel van de uitvoer over en haalt met `sed` het voorvoegsel
`go` weg, zodat alleen het versienummer overblijft.

```bash
log "Fetching the latest version of Go from the official download page..."
LATEST_VERSION=$(curl -s https://go.dev/VERSION?m=text | head -n 1 | sed 's/^go//')
```

## Foutafhandeling bij het ophalen van de versie {#error-handling-for-version-fetching}

Het script controleert of het ophalen van de versie is gelukt, door na te gaan
of de variabele `LATEST_VERSION` niet leeg is. Is die leeg, dan toont het een
foutmelding en stopt het met status 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  log_error "Failed to fetch the latest version of Go. Exiting."
  exit 1
fi
```

## De download-URL opbouwen {#constructing-the-download-url}

Met het opgehaalde versienummer bouwt het script de URL op om het nieuwste
binaire bestand van Go te downloaden.

```bash
DOWNLOAD_URL="https://go.dev/dl/go${LATEST_VERSION}.linux-amd64.tar.gz"
```

## De downloadmap bepalen {#defining-the-download-directory}

Het script bepaalt de map waarin het gedownloade bestand wordt bewaard. Hier is
dat de map `Downloads` in de thuismap van de gebruiker.

```bash
DOWNLOAD_DIR="$HOME/Downloads"
```

## De nieuwste versie downloaden {#downloading-the-latest-version}

Het script downloadt het tar.gz-bestand van Go met `wget` naar de opgegeven
downloadmap en controleert of de download is gelukt.

```bash
if ! wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/go${LATEST_VERSION}.linux-amd64.tar.gz"; then
  log_error "Failed to download Go version ${LATEST_VERSION}. Exiting."
  exit 1
fi
log "Successfully downloaded Go version ${LATEST_VERSION} to $DOWNLOAD_DIR."
```

## Het gedownloade bestand uitpakken {#extracting-the-downloaded-file}

Het script pakt het gedownloade bestand in twee stappen uit. Eerst decomprimeert
`gzip -d` de tarball tot een `.tar`-bestand. Daarna pakt `tar -xf` dat
`.tar`-bestand uit in de downloadmap. Bij beide stappen wordt op fouten
gecontroleerd.

```bash
log "Extracting Go files..."

if gzip -d "$DOWNLOAD_DIR/go${LATEST_VERSION}.linux-amd64.tar.gz"; then
  log "Decompression of the tarball was successful."
else
  log_error "Failed to decompress Go tarball. Exiting."
  exit 1
fi

if tar -xf "$DOWNLOAD_DIR/go${LATEST_VERSION}.linux-amd64.tar" -C "$DOWNLOAD_DIR"; then
  log "Extraction of the tar file was successful."
else
  log_error "Failed to extract Go tar file. Exiting."
  exit 1
fi
```

## De installatiemap voorbereiden {#preparing-the-installation-directory}

Het script maakt de doelmap `/usr/local/go` als die nog niet bestaat. Daarna
verwijdert het eerdere installaties in die map, voor een schone installatie.

```bash
sudo mkdir -p /usr/local/go
sudo rm -rf /usr/local/go
```

## Bestanden naar de installatiemap verplaatsen {#moving-files-to-the-installation-directory}

Het script verplaatst de uitgepakte bestanden naar de doelmap en controleert of
dat is gelukt.

```bash
if ! sudo mv "$DOWNLOAD_DIR/go" /usr/local/; then
  log_error "Failed to move Go files to /usr/local/go. Exiting."
  exit 1
fi
log "Go version ${LATEST_VERSION} installed successfully to /usr/local/go."
```

## Opruimen {#cleaning-up}

Het script verwijdert het uitgepakte `.tar`-bestand uit de downloadmap, om
overbodige bestanden op te ruimen.

```bash
rm "$DOWNLOAD_DIR/go${LATEST_VERSION}.linux-amd64.tar"
log "Cleanup complete."
```

## Controleren of het commando go beschikbaar is {#checking-for-go-command-availability}

Tot slot controleert het script of het commando `go` in de PATH van de gebruiker
staat. Wordt het niet gevonden, dan legt het uit hoe je Go aan de PATH toevoegt.

```bash
if ! command -v go &>/dev/null; then
  log_error "Go command not found. You may need to add Go to your PATH."
  log_error "To do this, add the following line to your ~/.bashrc or ~/.bash_profile:"
  log_error "export PATH=\$PATH:/usr/local/go/bin"
  exit 1
else
  log "Go version: $(go version)"
fi
```

## Conclusie {#conclusion}

Dit script automatiseert het downloaden en installeren van de nieuwste versie
van Go, zodat je altijd de nieuwste versie hebt met zo min mogelijk handwerk.
Het handelt fouten uitgebreid af en legt duidelijk uit hoe je de installatie zo
nodig afrondt.

[install_latest_go.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_go.sh
