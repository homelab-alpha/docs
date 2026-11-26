---
title: "tarzip.info"
description:
  "Een uitgebreid shellscript om gecomprimeerde archieven (.zip) van opgegeven
  mappen te maken en te controleren. Het script `tarzip.sh` combineert de
  commando's `tar` en `zip` voor degelijk archiveren en comprimeren, met extra
  controles. Ideaal voor systeembeheerders en gebruikers die een efficiënte
  back-up nodig hebben."
url: "shell-script/function-info/tarzip"
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
  - Bash
  - Archiving
  - Compression
  - Backup
  - Shell Scripting
  - tar
  - zip
keywords:
  - tarzip.sh
  - Bash script
  - file compression
  - directory archiving
  - backup script
  - shell function
  - Homelab-Alpha
  - tar command
  - zip command
  - automated backup

weight: 10109

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet `tarzip.sh`, is
geschreven door GJS (homelab-alpha) en maakt een gecomprimeerd archief (.zip)
van een opgegeven map met de commando's tar en zip.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `tarzip.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 26 mei 2024
- **Versie**: 1.0
- **Beschrijving**: het script biedt de functie `tarzip`, die een tar-archief
  van een opgegeven map maakt en dat comprimeert tot een .zip-bestand met een
  tijdstempel in de bestandsnaam. Het controleert ook het gecomprimeerde
  bestand.
- **RAW-script**: [tarzip.sh]

Het script is geschreven in Bash en definieert één functie: `tarzip`. Laten we
die stap voor stap bekijken.

## Definitie van de functie en controle van de invoer {#function-definition-and-input-validation}

```bash
function tarzip() {
  local input_folder
  input_folder="$1"

  # Input validation
  if [ $# -ne 1 ]; then
    echo "Usage: tarzip <folder>"
    return 1
  fi

  if [ ! -d "$input_folder" ]; then
    echo "Error: '$input_folder' is not a valid directory."
    return 1
  fi
```

De functie `tarzip` begint met de lokale variabele `input_folder`, met het
eerste argument van de functie. Ze controleert of er precies één argument is. Zo
niet, dan toont ze een gebruiksmelding en stopt ze met returncode 1. Daarna
controleert ze of het argument een geldige map is. Zo niet, dan toont ze een
foutmelding en stopt ze met returncode 1.

## Een tijdstempel en bestandsnamen maken {#generating-a-timestamp-and-filenames}

```bash
  local timestamp
  timestamp="$(date +'%b %d, %Y - %H%M%S')"

  local tmp_file
  tmp_file="${input_folder%/} [$timestamp].tar"

  local zip_file
  zip_file="${input_folder%/} [$timestamp].tar.zip"
```

Het script maakt met het commando `date` een tijdstempel in het formaat "Month
Day, Year - HHMMSS". Daarna maakt het de naam van het tijdelijke tar-bestand en
van het uiteindelijke zip-bestand, door de tijdstempel achter de naam van de
invoermap te zetten.

## Het tar-archief maken {#creating-the-tar-archive}

```bash
  echo "Creating .tar archive for $input_folder..."
  tar --create --file="$tmp_file" --verbose "$input_folder" || return 1
```

Het meldt dat het een tar-archief van de invoermap maakt. Het commando `tar`
maakt een tar-archief (`--create`) met de opgegeven bestandsnaam
(`--file="$tmp_file"`) en uitgebreide uitvoer (`--verbose`).

## De grootte van het tar-bestand controleren {#checking-the-tar-file-size}

```bash
  local size
  size=$(stat -c "%s" "$tmp_file" 2>/dev/null)
  [ -z "$size" ] && size=$(stat -f "%z" "$tmp_file" 2>/dev/null)
```

Het haalt de grootte van het tar-bestand op met het commando `stat`, om te
controleren of het bestand goed is gemaakt. Het probeert twee vormen van `stat`
(`-c` en `-f`), zodat het op verschillende systemen werkt.

## Het tar-archief comprimeren {#compressing-the-tar-archive}

```bash
  local cmd="zip"
  echo ""
  echo "Compressing .tar using $cmd..."
  $cmd "$zip_file" --encrypt --recurse-paths -9 --verbose "$tmp_file" || return 1

  if [ -f "$tmp_file" ]; then
    rm "$tmp_file"
  fi
```

1. Het script zet de variabele `cmd` op `zip`.
2. Het meldt dat het het tar-bestand comprimeert met het commando `zip`.
3. Het commando `zip` comprimeert het tar-bestand (`$tmp_file`) tot een
   zip-bestand (`$zip_file`), met deze opties:
   - `--encrypt` om versleuteling aan te zetten.
   - `--recurse-paths` om mappen en hun inhoud mee te nemen.
   - `-9` voor de hoogste compressie.
   - `--verbose` voor uitgebreide uitvoer.

4. Na het comprimeren controleert het of het tar-bestand bestaat en verwijdert
   het dat om op te ruimen.

## Het zip-archief controleren {#verifying-the-zip-archive}

```bash
  echo ""
  echo "Verifying $zip_file using $cmd..."
  $cmd "$zip_file" --test --verbose || return 1
```

Het script meldt dat het het zip-bestand controleert. Het commando `zip` test
opnieuw of het zip-bestand in orde is (`--test`), met uitgebreide uitvoer
(`--verbose`).

## Afronden {#finalizing}

```bash
  echo ""
  echo "$zip_file has been successfully created and verified."
  chmod 644 "$zip_file"
}
```

Het meldt dat het zip-bestand is gemaakt en gecontroleerd. Het zet de rechten
van het zip-bestand met `chmod` op `644`, zodat iedereen het kan lezen en alleen
de eigenaar erin kan schrijven.

## Conclusie {#conclusion}

Het script `tarzip.sh` is een handig hulpmiddel om gecomprimeerde archieven van
mappen te maken. Het controleert de invoer grondig, maakt bestandsnamen met een
tijdstempel en controleert het gecomprimeerde bestand. De duidelijke meldingen
en de uitgebreide uitvoer helpen om elke stap van het proces te begrijpen.

[tarzip.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/tarzip.sh
