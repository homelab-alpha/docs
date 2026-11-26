---
title: "mvg.info"
description:
  "Deze documentatie legt het script `mvg.sh` van Homelab-Alpha uitgebreid uit.
  Het script verplaatst een bestand of map naar een opgegeven doel en maakt
  daarna de nieuwe locatie de werkmap. Het controleert de bron en het doel, en
  kan zijn eigen gegevens aanvullen als die ontbreken."
url: "shell-script/function-info/mvg"
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
  - shell-scripting
  - file-management
  - automation
  - linux
keywords:
  - shell script
  - move files
  - directory management
  - bash function
  - script metadata
  - automation tools
  - linux commands

weight: 10107

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet `mvg.sh`, is
geschreven door GJS (homelab-alpha) en maakt de functie `mvg`, die een bestand
of map naar een opgegeven doel verplaatst en daarna naar de doelmap gaat. Het
script controleert ook of de bron en het doel geldig zijn, en kan zijn eigen
gegevens aanvullen als die ontbreken.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `mvg.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 26 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script verplaatst een bestand of map naar een opgegeven
  doel en gaat daarna naar de doelmap.
- **RAW-script**: [mvg.sh]

## Functie: `mvg` {#function-mvg}

De functie `mvg` is de kern van het script. Dit doet ze, stap voor stap:

### Controle van de argumenten {#argument-check}

```bash
if [ $# -ne 2 ]; then
  echo "Usage: mvg source destination"
  return 1
fi
```

Het script controleert eerst of er precies twee argumenten zijn opgegeven (de
bron en het doel). Zo niet, dan toont het een gebruiksmelding en stopt de
functie met status `1`.

### Variabelen toewijzen {#variable-assignment}

```bash
local source="$1"
local destination="$2"
```

Het script wijst het eerste argument toe aan `source` en het tweede aan
`destination`.

### Controleren of de bron bestaat {#source-existence-check}

```bash
if [ ! -e "$source" ]; then
  echo "Source does not exist: $source"
  return 1
fi
```

Het controleert met de vlag `-e` of de bron bestaat. Bestaat de bron niet, dan
toont het een foutmelding en stopt de functie met status `1`.

### Controleren of het doel geldig is {#destination-validity-check}

```bash
if [ ! -d "$destination" ]; then
  echo "Destination is not a directory: $destination"
  return 1
fi
```

Het controleert met de vlag `-d` of het doel bestaat en een map is. Is het doel
geen map, dan toont het een foutmelding en stopt de functie met status `1`.

### Verplaatsen en naar de map gaan {#move-and-enter-directory}

```bash
mv "$source" "$destination" && cd "$destination/$(basename "$source")" || exit
```

Slagen beide controles, dan verplaatst het script de bron met `mv` naar het
doel. Daarna probeert het met `cd` naar de nieuwe locatie van de verplaatste
bron te gaan. Mislukt een van deze commando's, dan stopt het script.

## Beheer van de scriptgegevens {#script-metadata-management}

Het script kan ook een beschrijving en een gebruiksvoorbeeld aan zichzelf
toevoegen als die ontbreken.

### Beschrijving toevoegen {#add-description}

```bash
description=$(grep -c "# Description:" "$0")
if [ "$description" -eq 0 ]; then
  sed -i '2i# Description: This script moves a file or directory to a specified destination and then enters the destination directory.' "$0"
fi
```

Het controleert met `grep` of de regel met de beschrijving in het script staat.
Zo niet, dan voegt het de beschrijving met `sed` in na de tweede regel.

### Gebruiksvoorbeeld toevoegen {#add-usage-example}

```bash
usage_example=$(grep -c "# Example usage:" "$0")
if [ "$usage_example" -eq 0 ]; then
  sed -i '4i# Example usage: ./mvg.sh source_file.txt destination_directory/' "$0"
fi
```

Het controleert met `grep` of de regel met het gebruiksvoorbeeld in het script
staat. Zo niet, dan voegt het het voorbeeld met `sed` in na de vierde regel.

## Conclusie {#conclusion}

Dit script is een handig hulpmiddel om bestanden of mappen naar een nieuwe
locatie te verplaatsen en de werkmap mee te laten gaan, terwijl het ook zijn
eigen documentatie bijhoudt.

[mvg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/mvg.sh
