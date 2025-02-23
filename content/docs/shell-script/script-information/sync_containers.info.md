---
title: "sync_containers.info"
description:
  "A script for synchronizing Docker container images from a predefined list. It
  validates container formats, checks disk space, and logs actions to a file.
  With interactive options, users can easily update containers and view system
  information."
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

weight: 9100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}} ChatGPT has contributed to this document.
Therefore, it's advisable to treat the information here with caution and verify
it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`sync_containers.sh`, authored by GJS (homelab-alpha), and its purpose is to
synchronize Docker container images from a predefined list, validate container
labels, and perform system disk space checks. It also logs all actions and
errors to a log file.

## Script Metadata

- **Filename**: `sync_containers.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: February 23, 2025
- **Version**: 1.0.0
- **Description**: Synchronizes Docker container images from a predefined list,
  validates container formats, checks system disk space, and logs the actions.
- **RAW Script**: [sync_containers.sh]

<br />

## Script Header

The script starts with a metadata section, including the author, version,
description, and usage instructions. It also provides information about
available options and necessary dependencies.

<br />

## Requirements

Before running the script, ensure the following dependencies are available on
your system:

- **Docker**: Required for managing and pulling container images.
- **Disk space validation**: Ensures sufficient space to download Docker
  containers.
- **Log directory**: Automatically created if it does not already exist.

<br />

## Usage

### Command-Line Usage

The script can be executed directly with the following command structure:

```bash
./sync_containers.sh [options]
```

#### Options

- `--update`: Synchronize Docker containers.
- `--info`: Display current system and Docker information.
- `-h`, `--help`: Show the help menu.
- `-q`, `--quit`: Exit the script.

<br />

### Examples

1. **Synchronize Docker containers**:

   ```bash
   ./sync_containers.sh --update
   ```

2. **Display system and Docker information**:

   ```bash
   ./sync_containers.sh --info
   ```

3. **Show help menu**:

   ```bash
   ./sync_containers.sh --help
   ```

4. **Exit the script**:

   ```bash
   ./sync_containers.sh --quit
   ```

<br />

## Main Menu

Upon execution, the script displays an interactive menu, offering the following
options:

1. **Synchronize Docker containers**.
2. **Display Docker and system information**.
3. **Exit the script**.

Additionally, users can interact with the following shortcuts:

- `-h` or `--help`: Show the help menu.
- `-q` or `--quit`: Exit the script.

<br />

## Synchronization Process

The synchronization process consists of the following key steps:

1. **Disk Space Check**: Verifies available disk space before attempting to pull
   images.
2. **Container Format Validation**: Checks each container image against a
   regular expression to ensure correct format.
3. **Pull Docker Images**: Attempts to pull each Docker image from the list.
   Success or failure is logged.
4. **Logging**: All actions, successes, and failures are logged to a file
   (`sync_containers.log`).
5. **Summary Report**: After synchronization, the script provides a summary of
   the success, failure, and invalid pulls.

<br />

### Example Output

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

<br />

## Handling User Input

Upon running the script, users are prompted with the following options:

- **Option 1**: Synchronize Docker containers (`--update`).
- **Option 2**: View system and Docker information (`--info`).
- **Option 3**: Exit the script (`--quit`).

If the user selects an invalid option, the script will ask them to choose again.

<br />

## Functions

### Display Help Message

The `display_help()` function provides a detailed guide on script options and
usage.

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

<br />

### Display System and Docker Information

The `display_info()` function provides system details, Docker status, and
available disk space.

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

<br />

### Synchronize Docker Containers

The `sync_containers()` function handles the synchronization by validating
formats, checking disk space, and pulling the images.

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

<br />

### Command-Line Option Parsing

The main loop processes user input and executes the appropriate action
(synchronizing containers, displaying system info, or quitting).

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

<br />

## Conclusion

The `sync_containers.sh` script simplifies Docker container synchronization,
ensuring proper disk space, format validation, and error logging. It is a
helpful tool for automating Docker container management tasks, making it ideal
for Docker administrators or anyone managing containerized applications.

[sync_containers.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/sync_containers.sh
