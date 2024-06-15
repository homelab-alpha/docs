---
title: "new_docker_compose_file.info"
description:
  "This guide provides a comprehensive walkthrough for a shell script named
  `new_docker_compose_file.sh`, which is designed to automate the creation of
  Docker-Compose files and configuration files based on user input. By utilizing
  this script, users can streamline the setup of Docker containers, ensuring
  consistent and efficient configuration. Authored by GJS (Homelab-Alpha), the
  script verifies necessary commands, prompts for container names, creates
  directories, and generates `.env` and `docker-compose.yml` files with template
  content."
url: "shell-script/script-info/new-docker-compose-file"
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
  - Shell Script
  - Automation
  - DevOps
  - Container Management
keywords:
  - Docker Compose automation
  - Shell script for Docker
  - Docker container setup
  - Configuration file generation
  - DevOps tools
  - Homelab-Alpha scripts
  - Container orchestration
  - Environment configuration

weight: 6100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`new_docker_compose_file.sh`, authored by GJS (homelab-alpha), and its purpose
is to create a new Docker-Compose file along with configuration files based on
user input. This can help streamline the setup of Docker containers with
specific configurations.

Here's a detailed explanation:

## Script Metadata

- **Filename**: `new_docker_compose_file.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: May 18, 2024
- **Version**: 1.0.1
- **Description**: The script provides a function to create a new Docker-Compose
  file and configuration files based on user input.
- **RAW Script**: [new_docker_compose_file.sh]

<br />

## Command Validation

The script starts by validating the existence of required commands (`mkdir`,
`touch`, `chown`). If any of these commands are not found, it exits with an
error message.

```bash
for cmd in mkdir touch chown; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "ERROR: $cmd command not found. Please install it and try again."
    exit 1
  fi
done
```

<br />

## Message Display Function

A function `display_message` is defined to format and display messages to the
user.

```bash
display_message() {
  echo -e "\n$1\n"
}
```

<br />

## User Input for Container Name

The script prompts the user to input the name of the new Docker container. It
reads the input and validates it to ensure it only contains letters, numbers,
underscores, and hyphens.

```bash
display_message "What is the name of the new Docker container:"
read -r container_name

if [[ ! "$container_name" =~ ^[a-zA-Z0-9_-]+$ ]]; then
  display_message "Invalid container name. Use only letters, numbers, underscore (_), and hyphen (-)."
  exit 1
fi
```

<br />

## Directory Setup

The base directory for Docker containers is specified, and the path for the new
container is determined. The script checks if the directory already exists, and
if so, it exits with an error message. Otherwise, it creates the necessary
directories.

```bash
base_dir="$HOME/Docker"
dir_path="$base_dir/$container_name"

if [ -d "$dir_path" ]; then
  display_message "The directory already exists. Choose a different name for the container."
  exit 1
fi

if ! mkdir -p "$dir_path"; then
  display_message "Failed to create directory: $dir_path"
  exit 1
fi
```

<br />

## Creating Configuration Files

The script creates `.env` and `docker-compose.yml` files in the specified
directory. If it fails to create these files, it exits with an error message.

```bash
if ! touch "$dir_path/.env" "$dir_path/docker-compose.yml"; then
  display_message "Failed to create Docker startup files in $dir_path."
  exit 1
fi
```

<br />

## Populating `.env` File

The `.env` file is populated with template content, including placeholders for
API keys, secrets, and MySQL configuration.

```bash
cat <<EOL >"$dir_path/.env"
# API keys and secrets
API_KEY=
SECRET_KEY=

# App configuration
MYSQL_HOST_APP=${container_name}
MYSQL_PORT_APP=3306
MYSQL_NAME_APP=${container_name}
MYSQL_USER_APP=${container_name}
MYSQL_PASSWORD_APP=

# Database configuration
MYSQL_ROOT_PASSWORD_DB="
MYSQL_DATABASE_DB=${container_name}_db
MYSQL_USER_DB=${container_name}
MYSQL_PASSWORD_DB=
EOL
```

<br />

## Populating `docker-compose.yml` File

The `docker-compose.yml` file is populated with a template configuration for the
Docker services. This includes network settings, service definitions, and
environment variables.

```bash
cat <<EOL >"$dir_path/docker-compose.yml"
version: "3.9"

networks:
  ${container_name}_net:
    attachable: false
    internal: false
    external: false
    name: ${container_name}
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.0.0/24
          ip_range: 172.20.0.0/24
          gateway: 172.20.0.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "${container_name}"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.${container_name}.network.description: "is an isolated bridge network."

services:
  ${container_name}_db:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: ${container_name}_db
    image: change_me:latest
    init: false
    pull_policy: if_not_present
    volumes:
      - /docker/${container_name}/production/db:/change_me
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
      MYSQL_RANDOM_ROOT_PASSWORD:
      MYSQL_ROOT_PASSWORD:
      MYSQL_DATABASE: "${container_name}_db"
      MYSQL_USER: "${container_name}"
      MYSQL_PASSWORD:
    command: ["--transaction-isolation=READ-COMMITTED", "--log-bin=binlog", "--binlog-format=ROW"]
    hostname: ${container_name}_db
    networks:
      ${container_name}_net:
        ipv4_address: 172.20.0.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.${container_name}.db.description: "is a MySQL database."

  ${container_name}_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: ${container_name}
    image: change_me:latest
    init: false
    pull_policy: if_not_present
    volumes:
      - /docker/${container_name}/production/app:/change_me
    env_file:
      - .env
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
      MYSQL_HOST: "${container_name}_db"
      MYSQL_PORT: 3306
      MYSQL_NAME: "${container_name}_db"
      MYSQL_USER: "${container_name}"
      MYSQL_PASSWORD:
    command: ["change_me"]
    entrypoint: ["change_me"]
    domainname: ${container_name}.my-lan.nl
    hostname: ${container_name}
    extra_hosts:
      ${container_name}: "0.0.0.0"
    networks:
      ${container_name}_net:
        ipv4_address: 172.20.0.3
    dns:
      - 8.8.8.8
      - 8.8.4.4
    dns_search:
      - dc1.example.com
      - dc2.example.com
    dns_opt:
      - use-vc
      - no-tld-query
    ports:
      - ":/tcp"
      - ":/udp"
    devices:
      - "/dev/ttyUSB0:/dev/ttyUSB0"
      - "/dev/ttyACMO"
      - "/dev/sda:/dev/xvda:rwm"
    security_opt:
      - no-new-privileges:true
      - label:user:USER
      - label:role:ROLE
    cap_add:
      - CHANGE_ME
    cap_drop:
      - CHANGE_ME
    labels:
      com.docker.compose.project: "${container_name}"
      com.${container_name}.description: "change_me."

volumes:
  ${container_name}_db:
    external: true
  ${container_name}_app:
    external: true

secrets:
  mysql_root_passwrd:
    file: change_my.txt
    external: true
  mysql_db:
    file: change_my.txt
    external: true
  mysql_user:
    file: change_my.txt
    external: true
  mysql_password:
    file: change_my.txt
    external: true
  ${container_name}_admin_user:
    file: change_my.txt
    external: true
  ${container_name}_db_admin_password:
    file: change_my.txt
    external: true
EOL
```

<br />

## Completion Message

Finally, the script displays a message indicating that the Docker Compose file
has been created in the specified directory.

```bash
display_message "Docker Compose File is created in $dir_path"
```

<br />

## Conclusion

In summary, this script automates the creation of a Docker Compose setup for a
new container, including the necessary directories and configuration files,
based on user-provided input for the container name. It ensures required
commands are available, validates user input, creates necessary files and
directories, and populates the configuration files with appropriate template
content.

[new_docker_compose_file.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/new_docker_compose_file.sh
