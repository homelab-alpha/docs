---
title: "install_latest_protoc.info"
description:
  "Automatiseer met dit shellscript het ophalen, downloaden, installeren en
  opruimen van de nieuwste versie van Protoc (Protocol Buffers) uit de officiële
  GitHub-repository."
url: "shell-script/script-info/install-latest-protoc"
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
  - GitHub
  - Automation
  - Installation
  - Protocol Buffers
keywords:
  - Protoc installation
  - Shell script
  - GitHub API
  - Automated deployment
  - Error handling

weight: 10213

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`install_latest_protoc.sh`, is geschreven door GJS (homelab-alpha) en haalt de
nieuwste versie van Protoc (Protocol Buffers) op uit de officiële
GitHub-repository, downloadt en installeert die, en ruimt daarna op.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `install_latest_protoc.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 9 mei 2025
- **Versie**: 1.0.0
- **Beschrijving**: dit script haalt de nieuwste versie van Protoc (Protocol
  Buffers) op uit de officiële GitHub-repository, downloadt die, installeert die
  in `/usr/local/protoc` en ruimt de gedownloade bestanden op.
- **RAW-script**: [install_latest_protoc.sh]

## Logging

Het script toont elke melding in de terminal en voegt die toe aan het logbestand
`$HOME/.bash-script/install_latest_protoc.log`. De functie `log` legt
informatieve meldingen vast en de functie `log_error` fouten, allebei met een
tijdstempel. Het script maakt de logmap niet zelf.

```bash
LOG_DIR="$HOME/.bash-script"
LOG_FILE="$LOG_DIR/install_latest_protoc.log"

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

Het script haalt eerst de nieuwste versie van Protoc op via de GitHub-API. Het
stuurt met `curl` een verzoek naar het API-endpoint voor de releases van Protoc
en haalt met `grep` de tagnaam van de nieuwste release eruit. Die tagnaam, met
het versienummer, wordt met `sed` opgeschoond zodat alleen het versienummer
overblijft.

```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/protocolbuffers/protobuf/releases/latest | grep '"tag_name":' | sed -E 's/.*"([^"]+)".*/\1/')
```

## Foutafhandeling bij het ophalen van de versie {#error-handling-for-version-fetching}

Het script controleert of het ophalen van de versie is gelukt, door na te gaan
of de variabele `LATEST_VERSION` niet leeg is. Is die leeg, dan toont het een
foutmelding en stopt het met status 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  log_error "Unable to fetch the latest version of Protoc. Exiting."
  exit 1
fi
```

## De download-URL opbouwen {#constructing-the-download-url}

Met het opgehaalde versienummer bouwt het script de URL op om het nieuwste
binaire bestand van Protoc (Protocol Buffers) te downloaden.

```bash
DOWNLOAD_URL="https://github.com/protocolbuffers/protobuf/releases/download/${LATEST_VERSION}/protoc-${LATEST_VERSION#v}-linux-x86_64.zip"
```

## De downloadmap bepalen {#defining-the-download-directory}

Het script bepaalt de map waarin het gedownloade bestand wordt bewaard. Hier is
dat de map `Downloads` in de thuismap van de gebruiker.

```bash
DOWNLOAD_DIR="$HOME/Downloads"
```

## De nieuwste versie downloaden {#downloading-the-latest-version}

Het script downloadt het .zip-bestand van Protoc met `wget` naar de opgegeven
downloadmap en controleert of de download is gelukt.

```bash
if ! wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/protoc-${LATEST_VERSION}-linux-x86_64.zip"; then
  log_error "Failed to download Protoc version ${LATEST_VERSION}. Exiting."
  exit 1
fi
echo
log "Successfully downloaded Protoc version ${LATEST_VERSION} to $DOWNLOAD_DIR."
```

## Het gedownloade bestand uitpakken {#extracting-the-downloaded-file}

Het script pakt de inhoud van het gedownloade .zip-bestand met `unzip` uit in de
downloadmap.

```bash
unzip -o "$DOWNLOAD_DIR/protoc-${LATEST_VERSION}-linux-x86_64.zip" -d "$DOWNLOAD_DIR/protoc"
```

## De installatiemap voorbereiden {#preparing-the-installation-directory}

Het script maakt de doelmap `/usr/local/protoc` als die nog niet bestaat. Daarna
verwijdert het eerdere installaties in die map, voor een schone installatie.

```bash
sudo mkdir -p /usr/local/protoc
sudo rm -rf /usr/local/protoc/*
```

## Bestanden naar de installatiemap verplaatsen {#moving-files-to-the-installation-directory}

Het script verplaatst de uitgepakte bestanden naar de doelmap en controleert of
dat is gelukt.

```bash
if ! sudo mv "$DOWNLOAD_DIR/protoc"/* /usr/local/protoc/; then
  log_error "Failed to move Protoc files to /usr/local/protoc. Exiting."
  exit 1
fi
log "Protoc version ${LATEST_VERSION} installed successfully."
```

## Opruimen {#cleaning-up}

Het script verwijdert het gedownloade .zip-bestand en de uitgepakte map uit de
downloadmap, om overbodige bestanden op te ruimen.

```bash
rm -r "$DOWNLOAD_DIR/protoc-${LATEST_VERSION}-linux-x86_64.zip"
rm -rf "$DOWNLOAD_DIR/protoc"
log "Cleanup complete."
```

## Controleren of het commando protoc beschikbaar is {#checking-for-protoc-command-availability}

Tot slot controleert het script of het commando `protoc` in de PATH van de
gebruiker staat. Wordt het niet gevonden, dan legt het uit hoe je Protoc aan de
PATH toevoegt.

```bash
if ! command -v protoc &>/dev/null; then
  log_error "Protoc command not found. You may need to add Protoc to your PATH."
  log_error "To do this, add the following line to your ~/.bashrc or ~/.bash_profile:"
  log_error "export PATH=\$PATH:/usr/local/protoc/bin"
  exit 1
else
  log "Verification: Protoc is installed and available."
  log "Protoc version: $(protoc --version)"
fi
```

## Conclusie {#conclusion}

Dit script automatiseert het downloaden en installeren van de nieuwste versie
van Protoc (Protocol Buffers), zodat je altijd de nieuwste versie hebt met zo
min mogelijk handwerk. Het handelt fouten uitgebreid af en legt duidelijk uit
hoe je de installatie zo nodig afrondt.

[install_latest_protoc.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_protoc.sh
