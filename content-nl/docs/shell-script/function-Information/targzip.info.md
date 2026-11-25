---
title: "targzip.info"
description:
  "Automatiseer het maken en comprimeren van tar-archieven met `targzip.sh`. Dit
  script maakt een tar-archief van een opgegeven map of bestand, comprimeert het
  met gzip en controleert het gecomprimeerde bestand, betrouwbaar en efficiënt."
url: "shell-script/function-info/targzip"
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
  - shell-script
  - tar
  - gzip
  - archiving
  - compression
keywords:
  - shell script
  - tar command
  - gzip compression
  - file archiving
  - bash script
  - file compression
  - tar archive
  - gzip verification
  - linux scripting
  - shell automation

weight: 10108

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet `targzip.sh`,
is geschreven door GJS (homelab-alpha) en maakt de functie `targzip`, die een
tar-archief van een map of bestand maakt en het met gzip comprimeert. Het script
maakt het archief, comprimeert het en controleert het gecomprimeerde bestand.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `targzip.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 26 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script maakt een tar-archief van een map of bestand en
  comprimeert het met gzip.
- **Gebruik**: `targzip <directory or file>`
- **RAW-script**: [targzip.sh]

## Definitie van de functie {#function-definition}

```bash
function targzip() {
  local source
  source="$1"
  local timestamp
  timestamp=$(date +'%b %d, %Y - %H%M%S')
  local tmpFile
  tmpFile="${source%/} [$timestamp].tar"
  local compressedFile
  compressedFile="$tmpFile.gz"
```

De functie `targzip` begint met een aantal lokale variabelen:

- `source`: de map of het bestand dat wordt gearchiveerd, het eerste argument
  van de functie.
- `timestamp`: een tijdstempel in het formaat
  `Month Day, Year - HourMinuteSecond`.
- `tmpFile`: de naam van het tar-bestand, met de naam van de bron en de
  tijdstempel.
- `compressedFile`: de naam van het gecomprimeerde bestand, de naam van het
  tar-bestand met de extensie `.gz`.

## Tar-archief maken {#create-tar-archive}

```bash
  tar --create --file="$tmpFile" --verify --verbose "$source" || return 1
```

Het script maakt een tar-archief van `source` en bewaart het in `tmpFile`. Het
gebruikt het commando `tar` met de opties `--create`, `--file`, `--verify` en
`--verbose`:

- `--create`: maakt een nieuw archief.
- `--file="$tmpFile"`: geeft de naam van het archiefbestand.
- `--verify`: controleert de inhoud van het archief na het maken.
- `--verbose`: toont uitgebreide informatie over het proces.

Mislukt het commando tar, dan geeft de functie 1 terug, wat een fout aangeeft.

## Bestandsgrootte bepalen {#determine-file-size}

```bash
  local size
  if stat --version &>/dev/null; then
    size=$(stat -c%s "$tmpFile")
  elif stat -f%z "$tmpFile" &>/dev/null; then
    size=$(stat -f%z "$tmpFile")
  else
    echo "Error: Unable to determine file size."
    return 1
  fi

  echo "Size of $tmpFile: $size bytes"
```

Daarna bepaalt het script de grootte van het tar-bestand met het commando
`stat`. Het probeert twee vormen van `stat`, zodat het op verschillende systemen
werkt:

- `stat -c%s "$tmpFile"`: voor systemen met GNU stat.
- `stat -f%z "$tmpFile"`: voor systemen met BSD stat.

Werkt geen van beide, dan toont het een foutmelding en geeft het 1 terug. Lukt
het wel, dan toont het de grootte van het tar-bestand.

## Tar-archief comprimeren {#compress-tar-archive}

```bash
  local cmd="gzip"

  echo ""
  echo "Compressing .tar using $cmd."
  $cmd "$tmpFile" --best --rsyncable --verbose || return 1
  [ -f "$tmpFile" ] && rm "$tmpFile"
```

Daarna comprimeert het script het tar-bestand met `gzip`, met deze opties:

- `--best`: gebruikt het hoogste compressieniveau.
- `--rsyncable`: maakt de compressie geschikt voor rsync.
- `--verbose`: toont uitgebreide informatie over het proces.

Lukt het comprimeren, dan verwijdert het het oorspronkelijke tar-bestand.

## Gecomprimeerd bestand controleren {#verify-compressed-file}

```bash
  echo ""
  echo "Verifying $compressedFile using $cmd."
  $cmd -t "$compressedFile" --verbose || return 1

  echo ""
  echo "$compressedFile has been successfully created and verified."
  chmod 644 "$compressedFile"
```

Het script controleert het gecomprimeerde bestand met `gzip -t`, dat het bestand
op fouten test. Lukt dat, dan toont het een melding en zet het de rechten van
het gecomprimeerde bestand zo dat de eigenaar het kan lezen en schrijven en
anderen het kunnen lezen (`chmod 644`).

## De functie aanroepen {#call-the-function}

```bash
targzip "$1"
```

Tot slot roept het script de functie `targzip` aan met het eerste argument van
het script, waarmee het archiveren en comprimeren begint.

## Conclusie {#conclusion}

Het script `targzip.sh` automatiseert het maken van een tar-archief van een map
of bestand, het comprimeren met gzip en het controleren van het gecomprimeerde
bestand. Het werkt op verschillende systemen doordat het nagaat welke vorm van
`stat` beschikbaar is, en toont bij elke stap uitgebreide uitvoer, zodat je kunt
volgen wat er gebeurt en kunt debuggen.

[targzip.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/targzip.sh
