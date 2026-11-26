---
title: "install_latest_hugo.info"
description:
  "Automatiseer met dit shellscript het ophalen, downloaden, installeren en
  opruimen van de nieuwste versie van Hugo uit de officiële GitHub-repository."
url: "shell-script/script-info/install-latest-hugo"
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
  - Hugo
  - GitHub
  - Automation
  - Installation
keywords:
  - Hugo installation
  - Shell script
  - GitHub API
  - Automated deployment
  - Error handling

weight: 10211

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Dit script, `install_latest_hugo.sh`, geschreven door GJS (homelab-alpha),
automatiseert het ophalen, downloaden, installeren en opruimen van de nieuwste
versie van Hugo uit de officiële GitHub-repository.

Zo werkt het script:

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `install_latest_hugo.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 28 oktober 2026
- **Versie**: 1.1.3
- **Beschrijving**: dit script haalt de nieuwste versie van Hugo op uit de
  officiële GitHub-repository, downloadt die, installeert die in
  `/usr/local/hugo-extended` en ruimt de gedownloade bestanden op.
- **RAW-script**: [install_latest_hugo.sh]

## Logging

Het script toont elke melding in de terminal en voegt die toe aan het logbestand
`$HOME/.bash-script/install_latest_hugo.log`. De functie `log` legt informatieve
meldingen vast en de functie `log_error` fouten, allebei met een tijdstempel.
Het script maakt de logmap niet zelf.

```bash
LOG_DIR="$HOME/.bash-script"
LOG_FILE="$LOG_DIR/install_latest_hugo.log"

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

## De huidige versie controleren {#checking-the-current-version}

Voordat het de nieuwste versie ophaalt, controleert het script of Hugo al
beschikbaar is en logt het de geïnstalleerde versie.

```bash
if command -v hugo &>/dev/null; then
  log "Hugo version: $(hugo version)"
else
  log "Hugo is not currently installed."
fi
```

## De nieuwste versie ophalen {#fetching-the-latest-version}

Het script haalt de nieuwste versie van Hugo op via de GitHub-API. Het stuurt
met `curl` een verzoek naar het API-endpoint voor de releases van Hugo en haalt
het versienummer eruit en schoont het op met `grep` en `sed`.

```bash
LATEST_VERSION=$(curl -s https://api.github.com/repos/gohugoio/hugo/releases/latest | grep '"tag_name":' | sed -E 's/.*"v([^"]+)".*/\1/')
```

## Foutafhandeling bij het ophalen van de versie {#error-handling-for-version-fetching}

Lukt het niet om de nieuwste versie van Hugo op te halen, dan is de variabele
`LATEST_VERSION` leeg. Het script controleert dat; is die leeg, dan logt het een
fout en stopt het met status 1.

```bash
if [ -z "$LATEST_VERSION" ]; then
  log_error "Failed to fetch the latest version of Hugo. Exiting."
  exit 1
fi
```

## De download-URL opbouwen {#constructing-the-download-url}

Het script bouwt met het opgehaalde versienummer de download-URL voor het
binaire bestand van Hugo op.

```bash
DOWNLOAD_URL="https://github.com/gohugoio/hugo/releases/download/v${LATEST_VERSION}/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz"
```

## De downloadmap bepalen {#defining-the-download-directory}

Het script bewaart het gedownloade bestand in de map `Downloads` in de thuismap
van de gebruiker.

```bash
DOWNLOAD_DIR="$HOME/Downloads"
```

## De nieuwste versie downloaden {#downloading-the-latest-version}

Het script downloadt met `wget` het tar.gz-bestand van de nieuwste versie van
Hugo.

```bash
wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz"
```

## Foutafhandeling bij het downloaden {#error-handling-for-downloading}

Mislukt de download, dan logt het script een fout en stopt het.

```bash
if ! wget "$DOWNLOAD_URL" -O "$DOWNLOAD_DIR/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz"; then
  log_error "Failed to download Hugo version ${LATEST_VERSION}. Exiting."
  exit 1
fi
```

## Het gedownloade bestand uitpakken {#extracting-the-downloaded-file}

Het script pakt het gedownloade tar.gz-bestand uit in de downloadmap.

```bash
tar -xzf "$DOWNLOAD_DIR/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz" -C "$DOWNLOAD_DIR"
```

## De installatiemap voorbereiden {#preparing-the-installation-directory}

Het script zorgt dat de doelmap `/usr/local/hugo-extended` bestaat en ruimt een
bestaande installatie van Hugo op.

```bash
sudo mkdir -p /usr/local/hugo-extended
sudo rm -rf /usr/local/hugo-extended/*
```

## Bestanden naar de installatiemap verplaatsen {#moving-files-to-the-installation-directory}

Het binaire bestand van Hugo en de bijbehorende bestanden worden naar de
installatiemap verplaatst.

```bash
sudo mv "$DOWNLOAD_DIR/hugo" /usr/local/hugo-extended/
sudo mv "$DOWNLOAD_DIR/LICENSE" /usr/local/hugo-extended/
sudo mv "$DOWNLOAD_DIR/README.md" /usr/local/hugo-extended/
```

## De installatie controleren {#verifying-the-installation}

Staat het binaire bestand van Hugo niet in de doelmap, dan logt het script een
fout en stopt het met een foutstatus.

```bash
if [ ! -f "/usr/local/hugo-extended/hugo" ]; then
  log_error "Failed to move Hugo binary to /usr/local/hugo-extended. Exiting."
  exit 1
fi
```

## Opruimen {#cleaning-up}

Het script ruimt het gedownloade tar.gz-bestand op uit de map `Downloads`.

```bash
rm "$DOWNLOAD_DIR/hugo_extended_${LATEST_VERSION}_linux-amd64.tar.gz"
log "Cleanup complete."
```

## Controleren of het commando hugo beschikbaar is {#checking-for-hugo-command-availability}

Tot slot controleert het script of het commando `hugo` in de `PATH` van de
gebruiker staat. Zo niet, dan stelt het voor om het aan de `PATH` toe te voegen
en legt het uit hoe dat moet.

```bash
if ! command -v hugo &>/dev/null; then
  log_error "Hugo command not found. You may need to add Hugo to your PATH."
  log_error "To do this, add the following line to your ~/.bashrc or ~/.bash_profile:"
  log_error "export PATH=\$PATH:/usr/local/hugo-extended"
  exit 1
else
  log "Verification: Hugo is installed and available."
  log "Hugo version: $(hugo version)"
fi
```

## Conclusie {#conclusion}

Dit script automatiseert het downloaden en installeren van de nieuwste versie
van Hugo, zodat je altijd de nieuwste versie hebt. Het handelt fouten uitgebreid
af en legt duidelijk uit hoe je de installatie zo nodig afrondt.

[install_latest_hugo.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/install_latest_hugo.sh
