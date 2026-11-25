---
title: "uptime_kuma_pr_test_v2.info"
description:
  "Hiermee kunnen ontwikkelaars pull requests voor Uptime Kuma testen, door een
  Docker-container met de opgegeven image van Uptime Kuma te starten op aparte
  poorten voor de app en de API."
url: "shell-script/script-info/uptime-kuma-pr-test-v2"
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
  - Uptime-Kuma
  - Docker
  - Shell Script
  - GitHub
keywords:
  - Uptime-Kuma
  - testing
  - PR testing
  - Docker automation
  - persistent storage

weight: 10220

katex: true
---

<!-- textlint-disable terminology -->
<!-- The terminology rules are for English; this page is Dutch. -->

{{% alert context="primary" %}}
Claude heeft bijgedragen aan dit document. Wees daarom voorzichtig met de
informatie hier en controleer die zo nodig. {{% /alert %}}

Laten we in detail bekijken wat dit script doet. Het script heet
`uptime_kuma_pr_test_v2.sh`, is geschreven door GJS (homelab-alpha) en maakt het
testen van pull requests voor Uptime Kuma versie 2.x.x in een Docker-container
eenvoudiger. Hier volgt een uitgebreide uitleg van elk deel:

## Scriptgegevens {#script-metadata}

- **Bestandsnaam**: `uptime_kuma_pr_test_v2.sh`
- **Auteur**: GJS (homelab-alpha)
- **Datum**: 4 januari 2025
- **Versie**: 1.2.0
- **Beschrijving**: hiermee kunnen ontwikkelaars pull requests voor Uptime Kuma
  testen, door een Docker-container met de opgegeven image van Uptime Kuma te
  starten op aparte poorten voor de app en de API.
- **RAW-script**:[uptime_kuma_pr_test_v2.sh]

## Variabelen {#variable-definitions}

```bash
# Define the default ports for the Uptime-Kuma application and API.
port_app=3000
port_api=3001

# Retrieve current user information.
username=$(whoami)
puid=$(id -u)
pgid=$(id -g)
```

Deze regels stellen de standaardpoorten (`3000` en `3001`) in voor de toepassing
en de API, en halen gebruikersgegevens op, zoals de `username`, `PUID` en
`PGID`.

## Hulpfunctie {#helper-function}

```bash
display_help() {
  clear
  echo "======================================================================"
  echo "         Welcome to the Uptime-Kuma Pull Request Testing Tool         "
  echo "======================================================================"
  echo
  echo "Usage:"
  echo "  1. Select an option from the main menu."
  echo "  2. Follow the on-screen prompts to proceed."
  echo
  echo "Note:"
  echo "  Option 2 has limited write permissions implemented."
  echo "  This limitation causes the container to exit unexpectedly when using"
  echo "  images louislam/uptime-kuma:pr-test2."
  echo
  echo "Options:"
  echo
  echo "  1. Uptime-Kuma Pull Request version: 2.x.x"
  echo "     Run a container with the louislam/uptime-kuma:pr-test2 image."
  echo
  echo "  2. Uptime-Kuma Pull Request version: 2.x.x with Persistent Storage"
  echo "     Run a container with the louislam/uptime-kuma:pr-test2 image."
  echo
  echo "Additional Options:"
  echo "  h or --help      : Display this help message."
  echo "  i or --info      : Show current user's information (PUID and PGID),"
  echo "                     as well as Docker and Docker Compose versions."
  echo "  q or --quit      : Quit the script."
  echo
  echo "For more information, visit:"
  echo "  https://github.com/louislam/uptime-kuma/wiki/Test-Pull-Requests"
  echo
  echo "======================================================================"
}
```

Deze functie toont de gebruiksinstructies en de opties van het script in een
overzichtelijk menu. Ze legt uit hoe je het hulpmiddel gebruikt en wat elke
optie doet, en geeft tips bij problemen met optie 2, die blijvende opslag
gebruikt.

## Systeeminformatie tonen {#system-information-display}

```bash
display_system_info() {
  clear
  echo "======================================================================"
  echo "         Welcome to the Uptime-Kuma Pull Request Testing Tool         "
  echo "======================================================================"
  echo

  # Extract OS name from /etc/os-release.
  if [ -f /etc/os-release ]; then
    os_name=$(grep '^PRETTY_NAME=' /etc/os-release | cut -d= -f2 | tr -d '"')
  else
    # Default if the OS name cannot be determined
    os_name="Unknown OS"
  fi

  # Retrieve kernel version.
  kernel_info=$(uname -r)

  # Determine filesystem type of the root directory.
  filesystem=$(findmnt -n -o FSTYPE /)

  # Check for Docker and Docker Compose, displaying versions if installed.
  if command -v docker &>/dev/null; then
    # Get Docker version
    docker_version=$(docker --version)
  else
    # Message if Docker is not found
    docker_version="Docker is not installed."
  fi

  if command -v docker compose &>/dev/null; then
    # Get Docker Compose version
    docker_compose_version=$(docker compose version)
  else
    # Message if Docker Compose is not found
    docker_compose_version="Docker Compose is not installed."
  fi

  # Display collected information.
  echo -e "Operating System Information:"
  echo -e "OS: $os_name"
  echo -e "Kernel Version: $kernel_info"
  echo -e "Filesystem: $filesystem"
  echo
  echo -e "User Information:"
  echo -e "Username: $username"
  echo -e "PUID: $puid"
  echo -e "PGID: $pgid"
  echo
  echo -e "Docker Information:"
  echo -e "$docker_version"
  echo -e "$docker_compose_version"
  echo
  echo "======================================================================"
}
```

Deze functie haalt informatie op over het systeem, de gebruiker en Docker, en
toont die:

- De **naam van het besturingssysteem** uit `/etc/os-release`.
- De **kernelversie** met `uname -r`.
- Het **soort bestandssysteem** met `findmnt`.
- De **versies van Docker en Docker Compose**, als die zijn geïnstalleerd.

## Controlefunctie {#validation-function}

```bash
validate_repo_name() {
  if [[ ! "$1" =~ ^[a-zA-Z0-9._-]+:[a-zA-Z0-9._-]+$ ]]; then
    echo "Error: Invalid GitHub repository format. Use 'owner:repo' (e.g., 'Ionys320:master')."
    # Exit if the command fails
    exit 1
  fi
}
```

Controleert of de link naar de GitHub-repository die je invoert het juiste
formaat heeft (`owner:repo`). Is het formaat ongeldig, dan toont ze een fout en
stopt het script.

## Docker starten voor versie 2.x.x {#docker-run-for-version-2xx}

```bash
version_2() {
  echo "Running Uptime-Kuma version 2.x.x..."

  # Check if the container is already running.
  if [ "$(docker ps -q -f name=uptime-kuma-pr-test-v2)" ]; then
    echo "Error: The container 'uptime-kuma-pr-test-v2' is already running."
    # Exit if the container is already running
    exit 1
  fi

  # Execute the Docker run command with necessary environment variables and options.
  docker run \
    --env RUN_LOCAL=true \
    --env UPTIME_KUMA_GH_REPO="$pr_repo_name" \
    --env PUID="$puid" \
    --env PGID="$pgid" \
    --name uptime-kuma-pr-test-v2 \
    --pull=always \
    --publish "$port_app:3000/tcp" \
    --publish "$port_api:3001/tcp" \
    --security-opt="no-new-privileges=true" \
    --interactive \
    --tty \
    --no-healthcheck \
    --rm \
    louislam/uptime-kuma:pr-test2 || {
    echo
    echo "Exiting container. Goodbye! Use CTRL+C to terminate."
    # Exit if the command fails or was terminated using CTRL+C
    exit 1
  }
}
```

Deze functie start de container van Uptime Kuma versie 2 zonder blijvende
opslag:

- Controleert of er al een container met de naam `uptime-kuma-pr-test-v2`
  draait. Zo ja, dan stopt de functie.
- Start de container met de image van Uptime Kuma en de ingestelde
  omgevingsvariabelen (`RUN_LOCAL`, `UPTIME_KUMA_GH_REPO`, `PUID`, `PGID`),
  publiceert de poorten (`$port_app:3000/tcp`, `$port_api:3001/tcp`) en beperkt
  de rechten met `--security-opt="no-new-privileges=true"`.
- Verwijdert de container na afloop (`--rm`), zet de health checks uit
  (`--no-healthcheck`) en draait interactief met een terminal (`--interactive`,
  `--tty`).

## Docker starten met blijvende opslag {#docker-run-with-persistent-storage}

```bash
version_2_persistent_storage() {
  echo "Running Uptime-Kuma version 2.x.x with persistent storage..."

  # Check if the container is already running.
  if [ "$(docker ps -q -f name=uptime-kuma-pr-test-v2)" ]; then
    echo "Error: The container 'uptime-kuma-pr-test-v2' is already running."
    # Exit if the container is already running
    exit 1
  fi

  # Execute the Docker run command with necessary environment variables, options, and volume mapping for persistence.
  docker run \
    --env RUN_LOCAL=true \
    --env UPTIME_KUMA_GH_REPO="$pr_repo_name" \
    --env PUID="$puid" \
    --env PGID="$pgid" \
    --name uptime-kuma-pr-test-v2 \
    --pull=always \
    --volume uptime-kuma-pr-test-v2:/app/data \
    --publish "$port_app:3000/tcp" \
    --publish "$port_api:3001/tcp" \
    --security-opt="no-new-privileges=true" \
    --interactive \
    --tty \
    --no-healthcheck \
    --rm \
    louislam/uptime-kuma:pr-test2 || {
    echo
    echo "Exiting container. Goodbye! Use CTRL+C to terminate."
    # Exit if the command fails or was terminated using CTRL+C
    exit 1
  }
}
```

Deze functie lijkt op `version_2`, maar gebruikt blijvende opslag met een volume
(`--volume uptime-kuma-pr-test-v2:/app/data`). Zo blijven wijzigingen in de
container bewaard tussen verschillende keren starten.

## Opruimfunctie {#cleanup-function}

```bash
cleanup_dangling_images() {
  echo "Removing unused Docker images to free up storage..."
  # Prune dangling images to recover disk space.
  docker image prune --filter "dangling=true" -f || {
    echo "Error: Failed to prune Docker images. Please check your Docker setup."
    # Exit if the command fails
    exit 1
  }
}
```

Deze functie ruimt ongebruikte (dangling) Docker-images op met
`docker image prune`, om schijfruimte vrij te maken.

## Hoofdlogica {#main-execution-logic}

```bash
while true; do
  clear
  echo "======================================================================"
  echo "         Welcome to the Uptime-Kuma Pull Request Testing Tool         "
  echo "======================================================================"
  echo
  echo "Please choose an option:"
  echo
  echo "   1. Uptime-Kuma Pull Request version: 2.x.x"
  echo "   2. Uptime-Kuma Pull Request version: 2.x.x with Persistent Storage"
  echo
  echo "   q: quit   h: help   i: info"
  echo "======================================================================"
  echo
  read -r -p "Please select an option (1, 2, h, i, or q to exit): " choice

  case $choice in
  1)
    selected_option="version_2"
    break
    ;;
  2)
    selected_option="version_2_persistent_storage"
    break
    ;;
  h | --help)
    # Show help message
    display_help
    echo
    # Wait for user input
    read -n 1 -s -r -p "Press any key to continue..."
    continue
    ;;
  i | --info)
    # Show system info
    display_system_info
    echo
    # Wait for user input
    read -n 1 -s -r -p "Press any key to continue..."
    continue
    ;;
  q | --quit)
    echo
    echo "Exiting the script Goodbye!."
    echo
    echo "Thank you for using the Uptime-Kuma Pull Request Testing Tool."
    # Exiting the script
    exit 0
    ;;
  *)
    echo "Error: Invalid option. Please try again." # Error message for invalid option
    ;;
  esac
done
```

Deze lus van het hoofdmenu:

- Toont een menu met opties om de Docker-container met of zonder blijvende
  opslag te starten, de hulp te tonen, systeeminformatie te tonen of af te
  sluiten.
- Vraagt je een optie te kiezen.
- Start afhankelijk van je keuze een van de functies `version_2`, toont de hulp,
  toont systeeminformatie of sluit af.

  De gekozen functie (`version_2` of `version_2_persistent_storage`) wordt
  daarna aangeroepen op basis van je invoer.

## Om de GitHub-repository vragen en uitvoeren {#prompt-for-github-repository-and-execution}

```bash
read -r -p "Please enter the GitHub repository link here (e.g., Ionys320:master): " pr_repo_name
validate_repo_name "$pr_repo_name"
$selected_option
cleanup_dangling_images
```

Na je keuze vraagt het script om een link naar een GitHub-repository. Daarna:

- Controleert het het formaat van de link.
- Start het de Docker-container volgens de gekozen functie (`version_2` of
  `version_2_persistent_storage`).
- Roept het tot slot `cleanup_dangling_images` aan om ongebruikte Docker-images
  te verwijderen.

## Conclusie {#conclusion}

Dit script biedt ontwikkelaars een flexibele, interactieve manier om pull
requests voor Uptime Kuma te testen, in een tijdelijke of een blijvende
Docker-omgeving.

[uptime_kuma_pr_test_v2.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/uptime_kuma_pr_test_v2.sh
