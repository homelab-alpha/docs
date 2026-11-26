---
title: "ex.info"
description:
  "Een veelzijdig shellscript dat het uitpakken van allerlei archiefformaten
  eenvoudiger maakt, door het bestandstype zelf te herkennen en de juiste manier
  van uitpakken te kiezen."
url: "shell-script/function-info/ex"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Shell Script
series:
  - Function Information
tags:
  - shell
  - script
  - extraction
  - archive
  - automation
  - command-line
  - linux
  - unix
keywords:
  - shell script
  - archive extraction
  - file decompression
  - tar
  - zip
  - gzip
  - bzip2
  - rar
  - automation tools
  - command-line utilities

weight: 10104

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet `ex.sh`, is
geschreven door GJS (homelab-alpha) en biedt een handige manier om allerlei
archiefformaten uit te pakken. Het herkent het formaat zelf en kiest de juiste
manier van uitpakken.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `ex.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 26 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script biedt een handige manier om allerlei
  archiefformaten uit te pakken, zoals tar, zip, gzip, bzip2 en rar. Het herkent
  het formaat zelf en kiest de juiste manier van uitpakken.
- **RAW-script**: [ex.sh]

## Declaratie van de functie {#function-declaration}

```bash
# Function: ex
function ex() {
```

Het script definieert de functie `ex`. Deze functie pakt de verschillende
archiefformaten uit.

## Controleren of het bestand bestaat {#file-existence-check}

```bash
  # Check if the input file exists
  if [ -f "$1" ]; then
```

De functie controleert eerst met de vlag `-f` of het invoerbestand (het eerste
argument `$1`) bestaat.

## Case-statement om het bestandstype te herkennen {#case-statement-for-file-type-detection}

```bash
    # Determine the file type and perform extraction accordingly
    case "$1" in
```

Het script gebruikt een `case`-statement om het bestandstype te bepalen aan de
hand van de extensie van het invoerbestand.

## De verschillende bestandstypen {#handling-different-file-types}

Elk geval in het `case`-statement behandelt één extensie:

- **`.tar.bz2`**: uitpakken met `tar -jxvf`

  ```bash
    *.tar.bz2) tar -jxvf "$1" ;;
  ```

- **`.tar.gz`**: uitpakken met `tar -zxvf`

  ```bash
    *.tar.gz) tar -zxvf "$1" ;;
  ```

- **`.bz2`**: uitpakken met `bunzip2`

  ```bash
    *.bz2) bunzip2 "$1" ;;
  ```

- **`.dmg`**: de schijfkopie koppelen met `hdiutil`

  ```bash
    *.dmg) hdiutil mount "$1" ;;
  ```

- **`.gz`**: uitpakken met `gunzip`

  ```bash
    *.gz) gunzip "$1" ;;
  ```

- **`.tar`**: uitpakken met `tar -xvf`

  ```bash
    *.tar) tar -xvf "$1" ;;
  ```

- **`.tbz2`**: uitpakken met `tar -jxvf`

  ```bash
    *.tbz2) tar -jxvf "$1" ;;
  ```

- **`.tgz`**: uitpakken met `tar -zxvf`

  ```bash
    *.tgz) tar -zxvf "$1" ;;
  ```

- **`.zip` of `.ZIP`**: uitpakken met `unzip`

  ```bash
    *.zip | *.ZIP) unzip "$1" ;;
  ```

- **`.pax`**: uitpakken met `pax`

  ```bash
    *.pax) pax -r <"$1" ;;
  ```

- **`.pax.Z`**: decomprimeren en uitpakken met `uncompress`, doorgegeven aan
  `pax`

  ```bash
    *.pax.Z) uncompress "$1" --stdout | pax -r ;;
  ```

- **`.rar`**: uitpakken met `unrar`

  ```bash
    *.rar) unrar x "$1" ;;
  ```

- **`.Z`**: uitpakken met `uncompress`

  ```bash
    *.Z) uncompress "$1" ;;
  ```

## Niet-ondersteund formaat {#unsupported-file-format}

```bash
    *) echo "$1 cannot be extracted/mounted via ex()" ;; # Unsupported file format
```

Past de extensie bij geen van de ondersteunde formaten, dan meldt het script dat
het bestand niet kan worden uitgepakt.

## Bestand bestaat niet {#non-existent-file-handling}

```bash
  else
    echo "$1 is not a valid file" # Print error message for non-existent files
  fi
```

Bestaat het invoerbestand niet, dan meldt het script dat het bestand niet geldig
is.

## Conclusie {#conclusion}

Dit script pakt allerlei archiefformaten goed uit en is zo een handig hulpmiddel
om met gecomprimeerde bestanden te werken.

[ex.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/ex.sh
