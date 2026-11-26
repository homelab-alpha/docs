---
title: "sync_containers.info"
description:
  "Een script dat Docker-containerimages synchroniseert uit een vaste lijst. Het
  controleert het formaat van de containers en de vrije schijfruimte, en logt de
  acties in een bestand. Met de interactieve opties werk je containers eenvoudig
  bij en bekijk je systeeminformatie."
url: "shell-script/script-info/sync-containers"
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
  - Docker
  - Container Management
  - Automation
  - System Maintenance
  - Synchronization
keywords:
  - docker containers
  - sync containers
  - automate docker pull
  - system information
  - disk space check

weight: 10219

toc: true
katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}} Claude heeft bijgedragen aan dit document. Wees
daarom voorzichtig met de informatie hier en controleer die zo nodig.
{{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`sync_containers.sh`, is geschreven door GJS (homelab-alpha) en synchroniseert
Docker-containerimages uit een vaste lijst, controleert de labels van de
containers en de vrije schijfruimte van het systeem. Het logt ook alle acties en
fouten in een logbestand.

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `sync_containers.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 23 februari 2025
- **Versie**: 1.0.0
- **Beschrijving**: synchroniseert Docker-containerimages uit een vaste lijst,
  controleert het formaat van de containers en de vrije schijfruimte, en logt de
  acties.
- **RAW-script**: [sync_containers.sh]

## Header van het script {#script-header}

Het script begint met een deel met gegevens: de auteur, de versie, een
beschrijving en gebruiksinstructies. Het noemt ook de beschikbare opties en de
benodigde software.

## Vereisten {#requirements}

Zorg voordat je het script uitvoert dat dit op je systeem beschikbaar is:

- **Docker**: nodig om containerimages te beheren en op te halen.
- **Controle van de schijfruimte**: zorgt dat er genoeg ruimte is om
  Docker-containers te downloaden.
- **Logmap**: wordt automatisch gemaakt als die nog niet bestaat.

## Gebruik {#usage}

### Gebruik op de opdrachtregel {#command-line-usage}

Je kunt het script direct uitvoeren met deze opbouw:

```bash
./sync_containers.sh [options]
```

#### Opties {#options}

- `--update`: synchroniseert de Docker-containers.
- `--info`: toont de huidige informatie over het systeem en Docker.
- `-h`, `--help`: toont de hulp.
- `-q`, `--quit`: sluit het script af.

### Voorbeelden {#examples}

1. **Docker-containers synchroniseren**:

   ```bash
   ./sync_containers.sh --update
   ```

2. **Informatie over het systeem en Docker tonen**:

   ```bash
   ./sync_containers.sh --info
   ```

3. **De hulp tonen**:

   ```bash
   ./sync_containers.sh --help
   ```

4. **Het script afsluiten**:

   ```bash
   ./sync_containers.sh --quit
   ```

## Hoofdmenu {#main-menu}

Na het starten toont het script een interactief menu met deze opties:

1. **Docker-containers synchroniseren**.
2. **Informatie over Docker en het systeem tonen**.
3. **Het script afsluiten**.

Daarnaast kun je deze sneltoetsen gebruiken:

- `-h` of `--help`: toont de hulp.
- `-q` of `--quit`: sluit het script af.

## Lijst met containers en logging {#container-list-and-logging}

Het script synchroniseert de containerimages in de array `CONTAINERS` en
schrijft de uitvoer naar `$HOME/.bash-script/sync_containers.log`. Het script
maakt de logmap en het logbestand als die niet bestaan.

```bash
log_dir="$HOME/.bash-script"
log_file="$log_dir/sync_containers.log"

mkdir -p "$log_dir"
touch "$log_file"

CONTAINERS=(
  "amir20/dozzle:latest"          # Lightweight Docker log viewer
  "containrrr/watchtower:latest"  # Automated container updates
  "freshrss/freshrss:latest"      # RSS aggregator
  "jellyfin/jellyfin:latest"      # Media server
  "louislam/dockge:latest"        # Docker GUI for managing containers
  "louislam/uptime-kuma:beta"     # Uptime monitoring service
  "mariadb:latest"                # MariaDB database server
  "netbootxyz/netbootxyz:latest"  # Network boot server for PXE
  "netdata/netdata:latest"        # Real-time monitoring and troubleshooting
  "openspeedtest/latest"          # Speed test application
  "plexinc/pms-docker:latest"     # Plex media server
  "portainer/portainer-ee:latest" # Portainer Enterprise Edition for Docker management
  "ronivay/xen-orchestra:latest"  # Xen Orchestra for managing XenServer
)
```

## Het synchroniseren {#synchronization-process}

Het synchroniseren bestaat uit deze stappen:

1. **Controle van de schijfruimte**: controleert de vrije schijfruimte voordat
   het images ophaalt.
2. **Controle van het formaat**: controleert elke containerimage met een
   reguliere expressie op het juiste formaat.
3. **Docker-images ophalen**: probeert elke Docker-image uit de lijst op te
   halen. Succes of mislukking wordt gelogd.
4. **Logging**: alle acties, successen en mislukkingen worden in een bestand
   gelogd (`sync_containers.log`).
5. **Samenvatting**: na het synchroniseren toont het script een samenvatting van
   de geslaagde, mislukte en ongeldige downloads.

### Voorbeeld van de uitvoer {#example-output}

```bash
Starting Docker container synchronization...
Pulling amir20/dozzle:latest...
Success: amir20/dozzle:latest pulled successfully.
Pulling containrrr/watchtower:latest...
Error: Failed to pull containrrr/watchtower:latest.
Detailed error for containrrr/watchtower:latest:
<docker pull error log>

Summary:
 - Successful pulls: 10
 - Failed pulls: 2
 - Invalid labels: 0

Synchronization completed!
```

## Verwerking van de invoer {#handling-user-input}

Als je het script start, krijg je deze opties:

- **Optie 1**: Docker-containers synchroniseren (`--update`).
- **Optie 2**: informatie over het systeem en Docker bekijken (`--info`).
- **Optie 3**: het script afsluiten (`--quit`).

Kies je een ongeldige optie, dan vraagt het script je opnieuw te kiezen.

## Functies {#functions}

### De hulp tonen {#display-help-message}

De functie `display_help()` geeft een uitgebreide uitleg van de opties en het
gebruik van het script.

```bash
display_help() {
  clear
  echo "================================================================================"
  echo "                   Docker Container Sync Tool - Help                            "
  echo "================================================================================"
  echo
  echo "Usage:"
  echo "  ./sync_containers.sh [options]"
  echo
  echo "Options:"
  echo "  1. --update   : Synchronize Docker containers"
  echo "  2. --info     : Show current user's system and Docker information."
  echo "  h, --help     : Display this help message."
  echo "  q, --quit     : Exit the script."
  echo
  echo "Description:"
  echo "  This script helps you synchronize Docker container images from a"
  echo "  predefined list. It validates container labels, checks disk space,"
  echo "  and ensures Docker and network connectivity before pulling the images."
  echo
  echo "================================================================================"
}
```

### Informatie over het systeem en Docker tonen {#display-system-and-docker-information}

De functie `display_info()` toont gegevens over het systeem, de status van
Docker en de vrije schijfruimte.

```bash
display_info() {
  clear
  echo "================================================================================"
  echo "                  Docker User and System Information                            "
  echo "================================================================================"
  echo
  echo "Current User Information:"
  echo "User  ID (PUID): $(id -u)"
  echo "Group ID (PGID): $(id -g)"
  echo

  echo "Install Check List:"
  if command -v docker &>/dev/null; then
    docker_version=$(docker --version)
    echo "$docker_version"
  else
    echo "Docker: Not installed"
  fi

  if command -v docker compose &>/dev/null; then
    docker_compose_version=$(docker compose version)
    echo "$docker_compose_version"
  else
    echo "Docker Compose: Not installed"
  fi

  echo
  echo "System Disk Space:"
  df -h | grep -E '^/dev/|^Filesystem'
  echo
  echo "================================================================================"
}
```

### Docker-containers synchroniseren {#synchronize-docker-containers}

De functie `sync_containers()` synchroniseert: ze controleert de formaten en de
schijfruimte en haalt de images op.

```bash
sync_containers() {
  if [[ -z "${CONTAINERS+x}" || -z "$log_file" ]]; then
    echo "Error: CONTAINERS array or log file path is not defined."
    return 1
  fi

  echo "Starting Docker container synchronization..."
  success_count=0
  fail_count=0
  invalid_count=0

  for container in "${CONTAINERS[@]}"; do
    if [[ "$container" =~ ^[a-zA-Z0-9_.-]+(/?[a-zA-Z0-9_.-]+)+(:[a-zA-Z0-9_.-]+)?$ ]]; then
      echo "Pulling $container..."
      if docker pull "$container" &>>"$log_file"; then
        ((success_count++))
        echo "Success: $container pulled successfully."
      else
        ((fail_count++))
        echo "Error: Failed to pull $container."
        echo "Detailed error for $container:" >> "$log_file"
        docker pull "$container" 2>> "$log_file"
      fi
    else
      ((invalid_count++))
      echo "Invalid container format: $container"
    fi
  done

  echo
  echo "Summary:"
  echo " - Successful pulls: $success_count"
  echo " - Failed pulls: $fail_count"
  echo " - Invalid labels: $invalid_count"
  echo
  echo "Synchronization completed!"
}
```

### Opties op de opdrachtregel verwerken {#command-line-option-parsing}

De hoofdlus verwerkt de invoer en voert de juiste actie uit (containers
synchroniseren, systeeminformatie tonen of afsluiten).

```bash
while true; do
  clear
  echo "================================================================================"
  echo "                           Docker Container Sync Tool                           "
  echo "================================================================================"
  echo
  echo "Please choose an option:"
  echo
  echo "   1. Synchronize Docker containers"
  echo "   2. Display Docker and system information"
  echo
  echo "   q: quit   h: help"
  echo "================================================================================"
  echo
  read -r -p "Please select an option (1, 2, h, or q to exit): " choice

  case $choice in
  1 | --update)
    echo "Starting synchronization of Docker containers..."
    sync_containers
    break
    ;;
  2 | --info)
    display_info
    echo
    read -n 1 -s -r -p "Press any key to continue..."
    continue
    ;;
  h | --help)
    display_help
    echo
    read -n 1 -s -r -p "Press any key to continue..."
    continue
    ;;
  q | --quit)
    echo "Exiting the script. Goodbye!"
    exit 0
    ;;
  *)
    echo "Error: Invalid option. Please try again."
    ;;
  esac
done
```

## Conclusie {#conclusion}

Het script `sync_containers.sh` maakt het synchroniseren van Docker-containers
eenvoudiger, met controles op schijfruimte en formaat en logging van fouten. Het
is een handig hulpmiddel om het beheer van Docker-containers te automatiseren,
ideaal voor Docker-beheerders en iedereen die toepassingen in containers
beheert.

[sync_containers.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/sync_containers.sh
