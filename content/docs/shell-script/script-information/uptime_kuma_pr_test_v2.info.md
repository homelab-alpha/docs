---
title: "uptime_kuma_pr_test_v2.info"
description:
  "Enables developers to verify pull requests for Uptime-Kuma by running a
  Docker container with the specified Uptime-Kuma image on designated ports for
  the app and API."
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

weight: 9100

katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`uptime_kuma_pr_test_v2.sh`, authored by GJS (homelab-alpha), and its purpose is
to facilitate the testing of pull requests for Uptime-Kuma version 2.x.x in a
Docker container environment. Here’s a detailed look at each section:

Here's a detailed explanation:

## Script Metadata

- **Filename**: `uptime_kuma_pr_test_v2.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: November 3, 2024
- **Version**: 1.0.0
- **Description**: Enables developers to verify pull requests for Uptime-Kuma by
  running a Docker container with the specified Uptime-Kuma image on designated
  ports for the app and API.
- **RAW Script**:[uptime_kuma_pr_test_v2.sh]

<br />

## Variable Definitions

```bash
# Define the default ports for the Uptime-Kuma application and API.
port_app=3000
port_api=3001

# Retrieve current user information.
username=$(whoami)
puid=$(id -u)
pgid=$(id -g)
```

These lines set up default ports (`3000` and `3001`) for the application and
API, and retrieve user information such as the `username`, `PUID`, and `PGID`.

<br />

## Helper Function

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

This function displays usage instructions and script options in a neatly
formatted menu. It describes how to run the tool, what each option does, and
provides some guidance on troubleshooting issues with option 2, which uses
persistent storage.

<br />

## System Information Display

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

  if command -v docker-compose &>/dev/null; then
    # Get Docker Compose version
    docker_compose_version=$(docker-compose --version)
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

This function retrieves and displays system, user, and Docker-related
information:

- **OS name** from `/etc/os-release`.
- **Kernel version** using `uname -r`.
- **Filesystem type** with `findmnt`.
- **Docker and Docker Compose versions**, if installed.

<br />

## Validation Function

```bash
validate_repo_name() {
  if [[ ! "$1" =~ ^[a-zA-Z0-9._-]+:[a-zA-Z0-9._-]+$ ]]; then
    echo "Error: Invalid GitHub repository format. Use 'owner:repo' (e.g., 'Ionys320:master')."
    # Exit if the command fails
    exit 1
  fi
}
```

Checks if the GitHub repository link entered by the user is in the correct
format (`owner:repo`). If the format is invalid, it displays an error and exits
the script.

<br />

## Docker Run for version 2.x.x

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
    --rm \
    --publish "$port_app:3000/tcp" \
    --publish "$port_api:3001/tcp" \
    --security-opt no-new-privileges:true \
    --interactive \
    --tty \
    louislam/uptime-kuma:pr-test2 || {
    echo
    echo "Exiting container. Goodbye! Use CTRL+C to terminate."
    # Exit if the command fails or was terminated using CTRL+C
    exit 1
  }
}
```

This function runs the Uptime-Kuma version 2 container without persistent
storage:

- Checks if a container with the name `uptime-kuma-pr-test-v2` is already
  running. If it is, the function exits.
- Runs the container with the Uptime-Kuma image using the set environment
  variables (`PUID`, `PGID`), publishes the ports, and enforces limited
  privileges using `--security-opt no-new-privileges:true`.

<br />

## Docker Run with Persistent Storage

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
    --rm \
    --publish "$port_app:3000/tcp" \
    --publish "$port_api:3001/tcp" \
    --security-opt no-new-privileges:true \
    --interactive \
    --tty \
    --volume uptime-kuma-pr-test-v2:/app/data \
    louislam/uptime-kuma:pr-test2 || {
    echo
    echo "Exiting container. Goodbye! Use CTRL+C to terminate."
    # Exit if the command fails or was terminated using CTRL+C
    exit 1
  }
}
```

This function is similar to `version_2` but includes persistent storage using a
volume (`--volume uptime-kuma-pr-test-v2:/app/data`). It allows any changes made
in the container to be saved across runs.

<br />

## Cleanup Function

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

This function cleans up any unused (dangling) Docker images to free up disk
space by running `docker image prune`.

<br />

## Main Execution Logic

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

This main menu loop:

- Displays a menu with options to run the Docker container with or without
  persistent storage, display help, show system info, or exit.
- Prompts the user to select an option.
- Based on the choice, it either runs one of the `version_2` functions, displays
  help, shows system info, or exits.

  The selected function (`version_2` or `version_2_persistent_storage`) is then
  called based on the user’s input.

<br />

## Prompt for GitHub Repository and Execution

```bash
read -r -p "Please enter the GitHub repository link here (e.g., Ionys320:master): " pr_repo_name
validate_repo_name "$pr_repo_name"
$selected_option
cleanup_dangling_images
```

After the user selects an option, they are prompted to enter a GitHub repository
link. The script then:

- Validates the link format.
- Runs the Docker container as per the selected function (`version_2` or
  `version_2_persistent_storage`).
- Finally, calls `cleanup_dangling_images` to remove unused Docker images.

<br />

## Conclusion

This script provides a flexible and interactive way for developers to test
Uptime-Kuma pull requests, whether they require temporary or persistent Docker
environments.

[uptime_kuma_pr_test_v2.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/uptime_kuma_pr_test_v2.sh
