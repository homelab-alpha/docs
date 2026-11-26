---
title: "cpg.info"
description:
  "Het script cpg.info biedt de veelzijdige functie 'cpg' om bestanden of mappen
  van een bron naar een doel te kopiëren, losse bestanden en mappen, ook
  recursief. Ontdek hoe het werkt en hoe het bestandsbeheer eenvoudiger maakt."
url: "shell-script/function-info/cpg"
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
  - Shell Script
  - File Management
  - Copy Files
  - Copy Directories
  - Recursive Copy
  - Scripting
  - Bash Script
  - Function
keywords:
  - cpg.info
  - shell script
  - file management
  - copy files
  - copy directories
  - recursive copy
  - bash script
  - function information

weight: 10101

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet `cpg.sh`, is
geschreven door GJS (homelab-alpha) en maakt de functie `cpg`, die bestanden of
mappen van een bronlocatie naar een doellocatie kopieert. Het script werkt met
losse bestanden en met mappen, die het recursief kopieert.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `cpg.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 26 mei 2024
- **Versie**: 1.0
- **Beschrijving**: het script biedt de functie `cpg` om bestanden of mappen van
  een bron naar een doel te kopiëren; losse bestanden en mappen, recursief.
- **RAW-script**: [cpg.sh]

## Functie: cpg {#function-cpg}

Het belangrijkste deel van dit script is de functie `cpg`. Laten we stap voor
stap bekijken wat die doet.

## Definitie en controle van de argumenten {#definition-and-argument-check}

```bash
function cpg() {
  if [ $# -ne 2 ]; then
    echo "Usage: cpg source destination"
    return 1
  fi
```

Hier wordt de functie `cpg` gedefinieerd. Eerst controleert ze of er precies 2
argumenten zijn meegegeven. Zo niet, dan toont ze een gebruiksmelding
(`Usage: cpg source destination`) en geeft ze een foutstatus (`1`) terug.

## Variabelen toewijzen {#variables-assignment}

```bash
  local source="$1"
  local destination="$2"
```

Het script wijst het eerste argument toe aan de variabele `source` en het tweede
aan de variabele `destination`. Dat maakt de code leesbaarder en makkelijker om
mee te werken.

## Mapcontrole en recursief kopiëren {#directory-check-and-recursive-copy}

```bash
  if [ -d "$source" ]; then
    if [ -d "$destination" ]; then
      cp -r "$source" "$destination" && cd "$destination/$(basename "$source")" || exit
    else
      echo "Destination is not a directory: $destination"
      return 1
    fi
  else
    cp "$source" "$destination"
  fi
}
```

Daarna controleert het script met de vlag `-d` of `source` een map is. Is
`source` een map, dan controleert het of `destination` ook een map is. Klopt dat
allebei, dan kopieert het de map `source` recursief naar `destination` met
`cp -r`. Na het kopiëren gaat het met `cd` naar de zojuist gekopieerde map in
`destination`. Mislukt dat, dan stopt het script met een fout.

## Een los bestand kopiëren {#single-file-copy}

Is `source` geen map, dan kopieert het script het bestand `source` gewoon naar
`destination` met `cp`.

## Foutafhandeling {#error-handling}

Het script heeft eenvoudige foutafhandeling. Is `destination` geen map terwijl
`source` wel een map is, dan toont het een foutmelding
(`Destination is not a directory: $destination`) en geeft het een foutstatus
(`1`) terug.

## Conclusie {#conclusion}

Samengevat doet de functie `cpg` in het script `cpg.sh` het volgende:

1. **Controleert het aantal argumenten**: zorgt dat er precies twee argumenten
   zijn.
2. **Wijst variabelen toe**: bewaart de argumenten in `source` en `destination`.
3. **Verwerkt mappen**:
   - Zijn `source` en `destination` allebei mappen, dan kopieert ze `source`
     recursief naar `destination` en gaat ze naar de gekopieerde map.
   - Is `destination` geen map, dan toont ze een fout en stopt ze.
4. **Verwerkt bestanden**: is `source` een bestand, dan kopieert ze het bestand
   naar `destination`.

Deze functie is een handig hulpmiddel om eenvoudig bestanden en mappen te
kopiëren, ook als mappen recursief moeten worden gekopieerd.

[cpg.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/functions/cpg.sh
