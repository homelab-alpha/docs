---
title: "mkdirg.info"
description:
  "Een shellfunctie die een map maakt als die nog niet bestaat en erin gaat. Het
  script controleert het aantal argumenten en of de map al bestaat, en handelt
  fouten netjes af. Daarnaast controleert en vult het de gegevens in de
  commentaarregels van het script aan."
url: "shell-script/function-info/mkdirg"
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
  - Shell Scripting
  - Bash Function
  - Directory Management
  - Script Documentation
  - Automation
keywords:
  - mkdirg
  - bash script
  - shell function
  - directory creation
  - scripting
  - automation
  - metadata verification

weight: 10106

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet `mkdirg.sh`, is
geschreven door GJS (homelab-alpha) en maakt de functie `mkdirg`, die een map
maakt als die nog niet bestaat en daarna naar die map gaat. Het script maakt de
map en maakt de nieuwe map de huidige werkmap.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `mkdirg.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 26 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script maakt een map als die nog niet bestaat en gaat
  erin.
- **RAW-script**: [mkdirg.sh]

## Definitie van de functie {#function-definition}

Het script definieert de functie `mkdirg`:

```bash
function mkdirg() {
```

## Controle van de argumenten {#argument-check}

De functie controleert eerst of er precies één argument is opgegeven, de naam
van de map die moet worden gemaakt:

```bash
  # Check if the correct number of arguments is provided
  if [ $# -ne 1 ]; then
    echo "Usage: mkdirg directory_name"
    return 1
  fi
```

Is het aantal argumenten niet precies één, dan toont ze een gebruiksmelding en
geeft ze status 1 terug, wat een fout aangeeft.

## De mapnaam bewaren {#directory-name-storage}

De opgegeven mapnaam wordt in een lokale variabele bewaard:

```bash
  # Store the directory name provided as an argument
  local directory_name="$1"
```

## Controleren of de map bestaat {#directory-existence-check}

Het script controleert of de map al bestaat:

```bash
  # Check if the directory already exists
  if [ -d "$directory_name" ]; then
    echo "Directory already exists: $directory_name"
    return 1
  fi
```

Bestaat de map al, dan toont het een melding en geeft het status 1 terug.

## De map maken en erin gaan {#directory-creation-and-navigation}

Bestaat de map nog niet, dan maakt het de map en gaat het erin:

```bash
  # Create the directory and navigate into it
  mkdir -p "$directory_name" && cd "$directory_name" || exit
}
```

Het commando `mkdir -p` maakt ook de bovenliggende mappen die nodig zijn. Het
deel `&& cd "$directory_name"` zorgt dat het script alleen van map wisselt als
het maken is gelukt. Het deel `|| exit` laat het script stoppen als het commando
`cd` mislukt.

## Controle en aanvulling van de scriptgegevens {#script-metadata-checks-and-updates}

Het script controleert of bepaalde commentaarregels aanwezig zijn en voegt ze
toe als ze ontbreken:

```bash
# Check if Description is present in the script, add if not
grep -q "# Description:" "$0" || sed -i '2i# Description:' "$0"

# Check if Usage Example is present in the script, add if not
grep -q "# Usage Example:" "$0" || sed -i '/# Description/a# Usage Example:' "$0"
```

Deze regels zoeken met `grep` naar bepaalde commentaarregels in het script en
voegen ze met `sed` toe als ze niet worden gevonden.

## Het script tonen {#displaying-the-script}

Tot slot toont het script zijn eigen inhoud:

```bash
# Show the entire script with improvements
cat "$0"
```

Dit deel toont het script met `cat`, wat handig kan zijn om de huidige staat van
het script na wijzigingen te bekijken.

## Conclusie {#conclusion}

Al met al is `mkdirg.sh` een handig hulpmiddel om mappen te maken en erin te
gaan, terwijl het ook zorgt dat de nodige gegevens in het script zelf staan.

[mkdirg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/mkdirg.sh
