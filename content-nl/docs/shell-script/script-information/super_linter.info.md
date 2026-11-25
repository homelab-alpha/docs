---
title: "super_linter.info"
description:
  "Dit script maakt lokaal linten van repository's eenvoudiger met GitHub Super
  Linter in een Docker-container. Je lint een hele lokale Git-repository of een
  bepaalde map, met steeds dezelfde controles op codekwaliteit in verschillende
  omgevingen."
url: "shell-script/script-info/super-linter"
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
  - linting
  - code quality
  - GitHub Super Linter
  - Docker
  - automation
  - shell script
keywords:
  - local linting
  - GitHub Super Linter
  - Docker container linting
  - code quality checks
  - shell script automation
  - linting repositories
  - directory linting
  - linting tool

weight: 10218

katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`super_linter.sh`, is geschreven door GJS (homelab-alpha) en maakt lokaal linten
van repository's mogelijk met GitHub Super Linter. Het start de Docker-container
van Super Linter en kan een lokale Git-repository of een bepaalde map linten.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `super_linter.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 20 mei 2024
- **Versie**: 1.0
- **Beschrijving**: dit script maakt lokaal linten van repository's mogelijk met
  GitHub Super Linter. Het start de Docker-container van Super Linter en kan een
  lokale Git-repository of een bepaalde map linten.
- **RAW-script**:[super_linter.sh]

Het script heeft functies om de Docker-container van Super Linter met
verschillende opties te starten, verwerkt de argumenten op de opdrachtregel en
toont een menu waarin je kiest hoe je lint.

## Standaard debugmodus {#default-debug-mode}

```bash
DEBUG=false
```

Het script zet eerst de standaardwaarde voor de debugmodus: `false`.

## Functie om Docker met de standaardopties te starten {#function-to-run-docker-with-standard-options}

```bash
run_docker_super_linter() {
  docker run \
    --env DEFAULT_BRANCH=main \
    --env RUN_LOCAL=true \
    --name super-linter \
    --pull=always \
    --rm \
    --volume "$PWD":/tmp/lint \
    "$@" \
    ghcr.io/super-linter/super-linter:latest
}
```

Deze functie start de Docker-container van Super Linter met de standaardopties.
Ze stelt omgevingsvariabelen in, verwijdert de container na afloop en koppelt de
huidige werkmap aan `/tmp/lint` in de container.

## Functie om Docker met extra opties te starten {#function-to-run-docker-with-extra-options}

```bash
run_docker_super_linter_file() {
  docker run \
    --env DEFAULT_BRANCH=main \
    --env RUN_LOCAL=true \
    --env USE_FIND_ALGORITHM=true \
    --name super-linter \
    --pull=always \
    --rm \
    --volume "$PWD":/tmp/lint/file \
    "$@" \
    ghcr.io/super-linter/super-linter:latest
}
```

Deze functie lijkt op de vorige, maar heeft de extra omgevingsvariabele
`USE_FIND_ALGORITHM=true` en koppelt de huidige map aan `/tmp/lint/file`.

## Opties op de opdrachtregel verwerken {#processing-command-line-options}

```bash
while [[ "$#" -gt 0 ]]; do
  case $1 in
  -d | --debug)
    DEBUG=true
    ;;
  *)
    echo "Unknown parameter: $1"
    exit 1
    ;;
  esac
  shift
done
```

Het script verwerkt de argumenten op de opdrachtregel om te zien of de
debugmodus aan moet (`-d` of `--debug`). Bij een onbekende parameter toont het
een foutmelding en stopt het.

## Controleren of de debugmodus aan staat {#check-if-debug-mode-is-enabled}

```bash
if [ "$DEBUG" = true ]; then
  echo "Debug mode is enabled."
fi
```

Staat de debugmodus aan, dan meldt het script dat.

## Menu voor de keuze {#menu-for-user-choice}

```bash
echo "Choose an option:"
echo "1. Root directory"
echo "2. Local File or Folder"
read -rp "Enter the number of the desired option: " choice
```

Het script toont een menu waarin je kiest of je de hoofdmap lint of een bepaald
bestand of een bepaalde map.

## De gekozen optie uitvoeren {#execute-the-selected-option}

```bash
case $choice in
1)
  if [ "$DEBUG" = true ]; then
    run_docker_super_linter -e LOG_LEVEL=DEBUG
  else
    run_docker_super_linter
  fi
  ;;
2)
  if [ "$DEBUG" = true ]; then
    run_docker_super_linter_file -e LOG_LEVEL=DEBUG
  else
    run_docker_super_linter_file
  fi
  ;;
*)
  echo "Invalid choice. Enter 1 or 2."
  ;;
esac
```

Afhankelijk van je keuze roept het script de juiste functie aan om de
Docker-container van Super Linter te starten. Staat de debugmodus aan, dan zet
het ook `LOG_LEVEL` op `DEBUG`.

## Conclusie {#conclusion}

Dit script maakt linten eenvoudiger door Super Linter in Docker te laten
draaien, zodat je in verschillende omgevingen eenvoudig dezelfde controles
uitvoert.

[super_linter.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/super_linter.sh
