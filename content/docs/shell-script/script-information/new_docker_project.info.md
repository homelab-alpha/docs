---
title: "new_docker_project.info"
description:
  "This script automates the creation of a new Docker container's directory
  structure and configuration files based on user input, ensuring all necessary
  tools and permissions are in place."
url: "shell-script/script-info/new-docker-project"
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
  - Containerization
keywords:
  - Docker project setup
  - Shell script automation
  - Docker directory structure
  - DevOps tools
  - Container configuration
  - Dockerfile
  - Docker Compose
  - Scripting
  - Homelab

weight: 9100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this script does in detail. The script is named
`new_docker_project.sh`, authored by GJS (homelab-alpha), and its purpose is
to create a new Docker container directory structure and configuration files
based on user input. The script ensures that the necessary tools are available,
checks for proper execution permissions, and creates a comprehensive directory
structure and configuration files for Docker containers.

## Script Metadata

- **Filename**: `new_docker_project.sh`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 17, 2025
- **Version**: 2.1.4
- **Description**: This script creates a new Docker container directory
  structure and configuration files based on user input.
- **RAW Script**: [new_docker_project.sh]

<br />

## Check for sudo Permissions

```sh
if [ "$EUID" -ne 0 ]; then
  echo "Please run this script with sudo."
  exit 1
fi
```

This section ensures that the script is run with `sudo` to have the necessary
permissions for creating directories and files.

<br />

## Validate Existence of Required Commands

```sh
for cmd in mkdir touch chown; do
  if ! command -v "$cmd" &>/dev/null; then
    echo "ERROR: $cmd command not found. Please install it and try again."
    exit 1
  fi
done
```

This part checks if the required commands (`mkdir`, `touch`, `chown`) are
available on the system. If any of these commands are missing, the script will
exit with an error message.

<br />

## Display Message Function

```sh
display_message() {
  echo -e "\n$1\n"
}
```

This function is used to display messages to the user in a formatted manner.

<br />

## Prompt for Docker Container Name

```sh
display_message "What is the name of the new Docker container:"
read -r container_name
```

The script prompts the user to enter the name of the new Docker container and
reads the input into the variable `container_name`.

<br />

## Validate Container Name

```sh
if [[ ! "$container_name" =~ ^[a-zA-Z0-9_-]+$ ]]; then
  display_message "Invalid container name. Use only letters, numbers, underscore (_), and hyphen (-)."
  exit 1
fi
```

This validation ensures that the container name only contains letters, numbers,
underscores, and hyphens.

<br />

## Set Base Directory for Docker Containers

```sh
base_dir="${docker_base_dir:-/docker}"
dir_path="$base_dir/$container_name"
```

This section sets the base directory for Docker containers. If `docker_base_dir`
is not set, it defaults to `/docker`. The full directory path for the new
container is constructed.

<br />

## Check if Directory Already Exists

```sh
if [ -d "$dir_path" ]; then
  display_message "The directory already exists. Choose a different name for the container."
  exit 1
fi
```

This checks if a directory with the specified container name already exists. If
it does, the script exits with a message.

<br />

## Create Required Directories

```sh
declare -a directories=(
  "notes"
  "production/.cert" "production/app" "production/config" "production/db" "production/log" "production/redis"
  "testing/.cert" "testing/app" "testing/config" "testing/db" "testing/log" "testing/redis"
)
for dir in "${directories[@]}"; do
  if ! mkdir -p "$dir_path/$dir"; then
    display_message "Failed to create directory: $dir_path/$dir"
    exit 1
  fi
done
```

This part creates the required directory structure for the Docker container,
including directories for notes, production, and testing environments.

<br />

## Create Docker Startup Files

```sh
if ! touch "$dir_path/.dockerignore" "$dir_path/Dockerfile" "$dir_path/README.md"; then
  display_message "Failed to create Docker startup files in $dir_path."
  exit 1
fi
```

The script creates essential Docker startup files in the new container
directory.

<br />

## Add Content to `docker-compose.yml` for production

```sh
cat <<EOL >"$dir_path/production/docker-compose.yml"
---
networks:
  ${container_name}_net:
    attachable: false # If is set to true: then standalone containers should be able to attach to this network.
    internal: false # when set to true, allows you to create an externally isolated network.
    external: false # If set to true: specifies that this networks lifecycle is maintained outside of that of the application.
    name: ${container_name}
    driver: bridge # host: Use the hosts networking stack and none: Turn off networking.
    ipam:
      driver: default
      config:
        - subnet: 172.20.0.0/24   # Subnet in CIDR format that represents a network segment
          ip_range: 172.20.0.0/24 # Range of IPs from which to allocate container IPs
          gateway: 172.20.0.1     # IPv4 or IPv6 gateway for the master subnet
          # Auxiliary IPv4 or IPv6 addresses used by Network driver, as a mapping from hostname to IP
          # aux_addresses:
          #   host1: 192.168.0.2
          #   host2: 192.168.0.3
          #   host3: 192.168.0.4
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
    # deploy:
    #   resources:
    #     limits:
    #       cpus: "2.0"
    #       memory: 128M
    #     reservations:
    #       cpus: "0.25"
    #       memory: 64M
    #   restart_policy:
    #     condition: on-failure
    #     delay: 5s
    #     max_attempts: 3
    #     window: 120s
    #   update_config:
    #     parallelism: 2 # The number of containers updated simultaneously during an update process.
    #     delay: 10s # Time interval between updating each batch of containers (ns|us|ms|s|m|h). Default: 10s.
    #     failure_action: pause # Action to take if an update fails: continue, rollback, or pause. Default: pause.
    #     monitor: 60s # Monitoring duration after updating each task to check for stability (ns|us|ms|s|m|h). Default: 60s. Requires a healthcheck.
    #     max_failure_ratio: 0 # Tolerable failure rate during updates. High availability: 0.1 (10%), flexible applications: 0.5 (50%), test environments: 1.0 (100%).
    #     order: stop-first # Update order: stop-first (stop old task before starting the new one), or start-first (start new task before stopping the old one) Default: stop-first.
    restart: unless-stopped #"no", always, unless-stopped.
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
      # driver: syslog
      # options:
      #   syslog-address: "tcp://192.168.0.0:123"
    stop_grace_period: 1m
      # specifies how long Compose must wait when attempting to stop a container.
    container_name: ${container_name}_db
    image: change_me:latest
    init: false
      # init runs an init process (PID 1) inside the container that forwards signals and reaps processes.
      # Set this option to true to enable this feature for the service.
    pull_policy: if_not_present # always, never, missing, if_not_present, build.
    volumes:
      # rw: Read and write access. ro: Read-only access. z: multiple containers. Z: private and unshared
      # - ${container_name}_db:/change_me
      # - /docker/${container_name}/production/.cert:/change_me
      - /docker/${container_name}/production/config/my.cnf:/etc/my.cnf
      - /docker/${container_name}/production/db:/var/lib/mysql
      # - /docker/${container_name}/production/log:/change_me
      # - /docker/${container_name}/production/redis:/change_me
    env_file:
      # adds environment variables to the container based on the file content.
      # Choose the correct environment file:
      # - Use '.env' for Docker Compose.
      # - Use 'stack.env' for Portainer.
      # Comment out the file you are not using in the Compose file to avoid issues.
      - .env
      - stack.env
    environment:
      # Any boolean values; "true", "false", "yes", "no", should be enclosed in quotes.
      PUID: "1000" # UserID
      PGID: "1000" # GroupID
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      MARIADB_ROOT_PASSWORD: \${ROOT_PASSWORD_DB}
      MARIADB_DATABASE: \${NAME_DB}
      MARIADB_USER: \${USER_DB}
      MARIADB_PASSWORD: \${PASSWORD_DB}
    hostname: ${container_name}_db
    networks:
      ${container_name}_net:
        ipv4_address: 172.20.0.2
    # ports:
    #   - target: 3306       # container port
    #     host_ip: 127.0.0.1 # The Host IP mapping, unspecified means all network interfaces (0.0.0.0)
    #     published: 3306    # publicly exposed port
    #     protocol: tcp      # tcp or udp
    #     mode: ingress      # host: For publishing a host port on each node
    security_opt:
      - no-new-privileges:true
    labels:
      com.${container_name}.db.description: "is a MariaDB database."
    healthcheck:
      disable: false
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  ${container_name}_app:
    # deploy:
    #   resources:
    #     limits:
    #       cpus: "2.0"
    #       memory: 128M
    #     reservations:
    #       cpus: "0.25"
    #       memory: 64M
    #   restart_policy:
    #     condition: on-failure
    #     delay: 5s
    #     max_attempts: 3
    #     window: 120s
    #   update_config:
    #     parallelism: 2 # The number of containers updated simultaneously during an update process.
    #     delay: 10s # Time interval between updating each batch of containers (ns|us|ms|s|m|h). Default: 10s.
    #     failure_action: pause # Action to take if an update fails: continue, rollback, or pause. Default: pause.
    #     monitor: 60s # Monitoring duration after updating each task to check for stability (ns|us|ms|s|m|h). Default: 60s. Requires a healthcheck.
    #     max_failure_ratio: 0 # Tolerable failure rate during updates. High availability: 0.1 (10%), flexible applications: 0.5 (50%), test environments: 1.0 (100%).
    #     order: stop-first # Update order: stop-first (stop old task before starting the new one), or start-first (start new task before stopping the old one) Default: stop-first.
    restart: unless-stopped #"no", always, unless-stopped.
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
      # driver: syslog
      # options:
      #   syslog-address: "tcp://192.168.0.0:123"
    stop_grace_period: 1m
      # specifies how long Compose must wait when attempting to stop a container.
    container_name: ${container_name}
    image: change_me:latest
    init: false
      # init runs an init process (PID 1) inside the container that forwards signals and reaps processes.
      # Set this option to true to enable this feature for the service.
    pull_policy: if_not_present # always, never, missing, if_not_present, build.
    depends_on:
      ${container_name}_db:
        condition: service_healthy
        restart: true
      ${container_name}_redis:
        condition: service_healthy
    links:
      - ${container_name}_db
    volumes:
      # rw: Read and write access. ro: Read-only access. z: multiple containers. Z: private and unshared
      # - ${container_name}_app:/change_me
      # - /docker/${container_name}/production/.cert:/change_me
      - /docker/${container_name}/production/app:/change_me
      # - /docker/${container_name}/production/config/change_me:/change_me
      # - /docker/${container_name}/production/log:/change_me
      # - /docker/${container_name}/production/redis:/change_me
    env_file:
      # adds environment variables to the container based on the file content.
      # Choose the correct environment file:
      # - Use '.env' for Docker Compose.
      # - Use 'stack.env' for Portainer.
      # Comment out the file you are not using in the Compose file to avoid issues.
      - .env
      - stack.env
    environment:
      # Any boolean values; "true", "false", "yes", "no", should be enclosed in quotes.
      PUID: "1000" # UserID
      PGID: "1000" # GroupID
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      MARIADB_HOST: \${HOST_DB}
      MARIADB_PORT: \${PORT_DB}
      MARIADB_NAME: \${NAME_DB}
      MARIADB_USER: \${USER_DB}
      MARIADB_PASSWORD: \${PASSWORD_DB}
    command: ["change_me"]
    entrypoint: ["change_me"]
      # declares the default entrypoint for the service container.
      # This overrides the ENTRYPOINT instruction from the services Dockerfile.
    domainname: ${container_name}.local # Customize this with your own domain, e.g., \`${container_name}.local\` to \`${container_name}\`.your-fqdn-here.com.
    hostname: ${container_name}
    extra_hosts:
      ${container_name}: "0.0.0.0"
    networks:
      ${container_name}_net:
        ipv4_address: 172.20.0.3
    dns:
      # defines custom DNS servers to set on the container network interface configuration.
      # It can be a single value or a list.
      - 8.8.8.8
      - 8.8.4.4
    dns_search:
      # defines custom DNS search domains to set on container network interface configuration.
      # It can be a single value or a list.
      - dc1.example.com
      - dc2.example.com
    dns_opt:
      # list custom DNS options to be passed to the container’s DNS resolver (/etc/resolv.conf file on Linux).
      - use-vc
      - no-tld-query
    ports:
      - ":/tcp"
      - ":/udp"
    devices:
      # defines a list of device mappings for created containers-
      # in the form of HOST_PATH:CONTAINER_PATH[:CGROUP_PERMISSIONS].
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
    healthcheck:
      disable: true
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s

volumes:
  ${container_name}_db:
    external: true
  ${container_name}_app:
    external: true
EOL
```

This section adds content to the `docker-compose.yml` file, specifying the
configuration for Docker services and networks.

<br />

## Add Content to `docker-compose.yml` for testing

```sh
cat <<EOL >"$dir_path/testing/docker-compose.yml"
---
networks:
  ${container_name}_testing_net:
    attachable: false # If is set to true: then standalone containers should be able to attach to this network.
    internal: false # when set to true, allows you to create an externally isolated network.
    external: false # If set to true: specifies that this networks lifecycle is maintained outside of that of the application.
    name: ${container_name}_testing
    driver: bridge # host: Use the hosts networking stack and none: Turn off networking.
    ipam:
      driver: default
      config:
        - subnet: 172.19.0.0/24   # Subnet in CIDR format that represents a network segment
          ip_range: 172.19.0.0/24 # Range of IPs from which to allocate container IPs
          gateway: 172.19.0.1     # IPv4 or IPv6 gateway for the master subnet
          # Auxiliary IPv4 or IPv6 addresses used by Network driver, as a mapping from hostname to IP
          # aux_addresses:
          #   host1: 192.168.0.2
          #   host2: 192.168.0.3
          #   host3: 192.168.0.4
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "${container_name}_testing"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.${container_name}.test.network.description: "is an isolated bridge network."

services:
  ${container_name}_testing_db:
    # deploy:
    #   resources:
    #     limits:
    #       cpus: "2.0"
    #       memory: 128M
    #     reservations:
    #       cpus: "0.25"
    #       memory: 64M
    #   restart_policy:
    #     condition: on-failure
    #     delay: 5s
    #     max_attempts: 3
    #     window: 120s
    #   update_config:
    #     parallelism: 2 # The number of containers updated simultaneously during an update process.
    #     delay: 10s # Time interval between updating each batch of containers (ns|us|ms|s|m|h). Default: 10s.
    #     failure_action: pause # Action to take if an update fails: continue, rollback, or pause. Default: pause.
    #     monitor: 60s # Monitoring duration after updating each task to check for stability (ns|us|ms|s|m|h). Default: 60s. Requires a healthcheck.
    #     max_failure_ratio: 0 # Tolerable failure rate during updates. High availability: 0.1 (10%), flexible applications: 0.5 (50%), test environments: 1.0 (100%).
    #     order: stop-first # Update order: stop-first (stop old task before starting the new one), or start-first (start new task before stopping the old one) Default: stop-first.
    restart: unless-stopped #"no", always, unless-stopped.
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
      # driver: syslog
      # options:
      #   syslog-address: "tcp://192.168.0.0:123"
    stop_grace_period: 1m
      # specifies how long Compose must wait when attempting to stop a container.
    container_name: ${container_name}_testing_db
    image: change_me:latest
    init: false
      # init runs an init process (PID 1) inside the container that forwards signals and reaps processes.
      # Set this option to true to enable this feature for the service.
    pull_policy: if_not_present # always, never, missing, if_not_present, build.
    volumes:
      # rw: Read and write access. ro: Read-only access. z: multiple containers. Z: private and unshared
      # - ${container_name}_db:/change_me
      # - /docker/${container_name}/testing/.cert:/change_me
      - /docker/${container_name}/testing/config/my.cnf:/etc/my.cnf
      - /docker/${container_name}/testing/db:/var/lib/mysql
      # - /docker/${container_name}/testing/log:/change_me
      # - /docker/${container_name}/testing/redis:/change_me
    env_file:
      # adds environment variables to the container based on the file content.
      # Choose the correct environment file:
      # - Use '.env' for Docker Compose.
      # - Use 'stack.env' for Portainer.
      # Comment out the file you are not using in the Compose file to avoid issues.
      - .env
      - stack.env
    environment:
      # Any boolean values; "true", "false", "yes", "no", should be enclosed in quotes.
      PUID: "1000" # UserID
      PGID: "1000" # GroupID
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      MARIADB_ROOT_PASSWORD: \${ROOT_PASSWORD_DB}
      MARIADB_DATABASE: \${NAME_DB}
      MARIADB_USER: \${USER_DB}
      MARIADB_PASSWORD: \${PASSWORD_DB}
    hostname: ${container_name}_testing_db
    networks:
      ${container_name}_testing_net:
        ipv4_address: 172.19.0.2
    # ports:
    #   - target: 3306       # container port
    #     host_ip: 127.0.0.1 # The Host IP mapping, unspecified means all network interfaces (0.0.0.0)
    #     published: 3306    # publicly exposed port
    #     protocol: tcp      # tcp or udp
    #     mode: ingress      # host: For publishing a host port on each node
    security_opt:
      - no-new-privileges:true
    labels:
      com.${container_name}.test.db.description: "is a MariaDB database."
    healthcheck:
      disable: false
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  ${container_name}_testing_app:
    # deploy:
    #   resources:
    #     limits:
    #       cpus: "2.0"
    #       memory: 128M
    #     reservations:
    #       cpus: "0.25"
    #       memory: 64M
    #   restart_policy:
    #     condition: on-failure
    #     delay: 5s
    #     max_attempts: 3
    #     window: 120s
    #   update_config:
    #     parallelism: 2 # The number of containers updated simultaneously during an update process.
    #     delay: 10s # Time interval between updating each batch of containers (ns|us|ms|s|m|h). Default: 10s.
    #     failure_action: pause # Action to take if an update fails: continue, rollback, or pause. Default: pause.
    #     monitor: 60s # Monitoring duration after updating each task to check for stability (ns|us|ms|s|m|h). Default: 60s. Requires a healthcheck.
    #     max_failure_ratio: 0 # Tolerable failure rate during updates. High availability: 0.1 (10%), flexible applications: 0.5 (50%), test environments: 1.0 (100%).
    #     order: stop-first # Update order: stop-first (stop old task before starting the new one), or start-first (start new task before stopping the old one) Default: stop-first.
    restart: unless-stopped #"no", always, unless-stopped.
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
      # driver: syslog
      # options:
      #   syslog-address: "tcp://192.168.0.0:123"
    stop_grace_period: 1m
      # specifies how long Compose must wait when attempting to stop a container.
    container_name: ${container_name}_testing
    image: change_me:latest
    init: false
      # init runs an init process (PID 1) inside the container that forwards signals and reaps processes.
      # Set this option to true to enable this feature for the service.
    pull_policy: if_not_present # always, never, missing, if_not_present, build.
    depends_on:
      ${container_name}_testing_db:
        condition: service_healthy
        restart: true
      ${container_name}_testing_redis:
        condition: service_healthy
    links:
      - ${container_name}_testing_db
    volumes:
      # rw: Read and write access. ro: Read-only access. z: multiple containers. Z: private and unshared
      # - ${container_name}_testing_app:/change_me
      # - /docker/${container_name}/testing/.cert:/change_me
      - /docker/${container_name}/testing/app:/change_me
      # - /docker/${container_name}/testing/config/change_me:/change_me
      # - /docker/${container_name}/testing/log:/change_me
      # - /docker/${container_name}/testing/redis:/change_me
    env_file:
      # adds environment variables to the container based on the file content.
      # Choose the correct environment file:
      # - Use '.env' for Docker Compose.
      # - Use 'stack.env' for Portainer.
      # Comment out the file you are not using in the Compose file to avoid issues.
      - .env
      - stack.env
    environment:
      # Any boolean values; "true", "false", "yes", "no", should be enclosed in quotes.
      PUID: "1000" # UserID
      PGID: "1000" # GroupID
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      MARIADB_HOST: \${HOST_DB}
      MARIADB_PORT: \${PORT_DB}
      MARIADB_NAME: \${NAME_DB}
      MARIADB_USER: \${USER_DB}
      MARIADB_PASSWORD: \${PASSWORD_DB}
    command: ["change_me"]
    entrypoint: ["change_me"]
      # declares the default entrypoint for the service container.
      # This overrides the ENTRYPOINT instruction from the services Dockerfile.
    domainname: ${container_name}.local # Customize this with your own domain, e.g., \`${container_name}.local\` to \`${container_name}\`.your-fqdn-here.com.
    hostname: ${container_name}_testing
    extra_hosts:
      ${container_name}_testing: "0.0.0.0"
    networks:
      ${container_name}_testing_net:
        ipv4_address: 172.19.0.3
    dns:
      # defines custom DNS servers to set on the container network interface configuration.
      # It can be a single value or a list.
      - 8.8.8.8
      - 8.8.4.4
    dns_search:
      # defines custom DNS search domains to set on container network interface configuration.
      # It can be a single value or a list.
      - dc1.example.com
      - dc2.example.com
    dns_opt:
      # list custom DNS options to be passed to the container’s DNS resolver (/etc/resolv.conf file on Linux).
      - use-vc
      - no-tld-query
    ports:
      - ":/tcp"
      - ":/udp"
    devices:
      # defines a list of device mappings for created containers-
      # in the form of HOST_PATH:CONTAINER_PATH[:CGROUP_PERMISSIONS].
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
      com.docker.compose.project: "${container_name}_testing"
      com.${container_name}.test.description: "change_me."
    healthcheck:
      disable: true
      test: ["CMD", "curl", "-f", "http://localhost"]
      interval: 1m30s
      timeout: 10s
      retries: 3
      start_period: 40s
      start_interval: 5s

volumes:
  ${container_name}_testing_db:
    external: true
  ${container_name}_testing_app:
    external: true
EOL
```

This section adds content to the `docker-compose.yml` file, specifying the
configuration for Docker services and networks.

<br />

## Add Content to `.env` and `.stack.env`

```sh
for file in "$dir_path/production/.env" "$dir_path/production/stack.env" "$dir_path/testing/.env" "$dir_path/testing/stack.env"; do
  cat <<EOL >"$file"
# Database Configuration: ROOT USER
# Change the MariaDB root password to a strong, unique password of your choice.
# Ensure the password is complex and not easily guessable.
ROOT_PASSWORD_DB=StrongUniqueRootPassword1234

# Database Configuration: USER
# Database host and connection settings
HOST_DB=${container_name}_db

# Database name: Change this to your desired database name
NAME_DB=${container_name}_db

# MariaDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MariaDB connection port (default: 3306)
PORT_DB=3306

# MariaDB username: Change this to your desired username
USER_DB=${container_name}
EOL
done
```

This writes configuration settings, including secrets, and database
details, to the `.env` and `stack.env` file.


## Add Content to `my.cnf`

```bash
cat <<EOL >"$dir_path/my.cnf"
#
# The MariaDB/MySQL tools read configuration files in the following order:
# 0. "/etc/mysql/my.cnf" symlinks to this file, reason why all the rest is read.
# 1. "/etc/mysql/mariadb.cnf" (this file) to set global defaults,
# 2. "/etc/mysql/conf.d/*.cnf" to set global options.
# 3. "/etc/mysql/mariadb.conf.d/*.cnf" to set MariaDB-only options.
# 4. "~/.my.cnf" to set user-specific options.
#
# If the same option is defined multiple times, the last one will apply.
#
# One can use all long options that the program supports.
# Run program with --help to get a list of available options and with
# --print-defaults to see which it would actually understand and use.
#
# If you are new to MariaDB, check out https://mariadb.com/kb/en/basic-mariadb-articles/

#
# This group is read both by the client and the server
# use it for options that affect everything
#
[client-server]
# Port or socket location where to connect
# port = 3306
socket = /run/mysqld/mysqld.sock

[mysqld]
# ============================================
# General Server Settings
# ============================================

# Unique server ID for replication. Each server in a replication setup
# must have a unique ID. Default is 0, which is invalid for replication.
server-id = 1

# Path to the database files. This is where all database data will be stored.
datadir = /var/lib/mysql/

# Location of the PID file. This file contains the process ID of the running MySQL server.
pid-file = /var/run/mysqld/mysqld.pid

# Disable DNS lookups when clients connect to the server, improving connection speed.
# Note: With this setting enabled, only IP addresses will be logged.
skip-name-resolve

# Set the default storage engine for new tables. InnoDB is generally recommended
# for its ACID compliance and support for transactions.
default-storage-engine = InnoDB

# Define the transaction isolation level. REPEATABLE-READ is a common default,
# ensuring consistent reads within a transaction.
transaction-isolation = REPEATABLE-READ

# Prevent the use of symbolic links to ensure data security.
skip-symbolic-links

# ============================================
# Performance Optimizations
# ============================================

# Enable native asynchronous I/O for improved performance in InnoDB.
innodb-use-native-aio = 0

# Set the size of the InnoDB buffer pool. This should be 70-80% of the available memory.
# Larger values allow more data to be cached in memory, improving performance.
innodb-buffer-pool-size = 1G

# Minimum InnoDB buffer pool size when auto-shrinking under memory pressure.
# Shrinks pool halfway between current size and this value. 0 = no minimum.
innodb-buffer-pool-size-auto-min = 0

# Configure the size of the InnoDB redo log files. Larger log files can improve
# performance for write-heavy workloads but require more recovery time after a crash.
innodb-log-file-size = 1G

# Define the size of the InnoDB log buffer. This buffer holds transaction logs
# in memory before they are written to disk. Larger buffers reduce disk I/O.
innodb-log-buffer-size = 32M

# Flush logs to disk after each transaction. This ensures ACID compliance,
# but may reduce performance. Setting this to 2 can improve performance at the
# cost of potential data loss during crashes.
innodb-flush-log-at-trx-commit = 1

# Number of background threads for read and write operations in InnoDB.
# Increase these values for high I/O workloads.
innodb-read-io-threads = 8
innodb-write-io-threads = 8

# Configure the I/O capacity for background operations such as flushing.
# Set this based on your disk's capabilities.
innodb-io-capacity = 6000
innodb-io-capacity-max = 8000

# Disable query caching as it is not beneficial for most modern workloads.
# Consider enabling it only if your application benefits from repeated identical queries.
query-cache-type = 0

# Set the maximum size for temporary tables stored in memory.
tmp-table-size = 64M

# Configure the maximum size for internal temporary tables stored in memory.
max-heap-table-size = 64M

# Define the maximum number of simultaneous client connections. Adjust based
# on your application's concurrency requirements.
max-connections = 200

# Number of threads to cache for reuse. Higher values reduce the overhead of
# creating new threads for each connection.
thread-cache-size = 50

# Configure the cache size for table definitions and open tables. Larger caches
# improve performance for workloads with many tables.
table-definition-cache = 4000
table-open-cache = 4000

# Set the buffer size for the Aria storage engine, used in MariaDB-specific workloads.
aria-pagecache-buffer-size = 128M

# ============================================
# Security Settings
# ============================================

# Restrict file imports and exports to a secure directory to prevent unauthorized access.
secure-file-priv = /var/lib/mysql/

# Load the password validation plugin to enforce strong password policies.
# plugin-load-add = validate_password.so

# Enforce a strong password policy with specific requirements.
# validate-password-policy = STRONG

# Minimum password length for increased security.
# validate-password-length = 12

# Require at least one uppercase letter in passwords.
# validate-password-mixed-case-count = 1

# Require at least one numeric character in passwords.
# validate-password-number-count = 1

# Require at least one special character in passwords.
# validate-password-special-char-count = 1

# ============================================
# Binary Logging and Replication
# ============================================

# Enable binary logging for replication and point-in-time recovery.
# The log file will be named '${container_name}_binlog'. You can specify a different name if desired.
log-bin = ${container_name}_binlog

# Set the maximum size for each binary log file. Once the file size reaches this limit,
# a new binary log file is created. A value of 0 means there is no size limit for the binary logs.
max-binlog-size = 500M

# Define the number of days after which binary logs will be automatically purged.
# This helps prevent the binary log files from growing indefinitely.
expire-logs-days = 14

# Enable checksums for binary logs to ensure data integrity.
binlog-checksum = CRC32

# Configure the format for binary logging. ROW-based replication is recommended
# for ensuring data consistency.
binlog-format = ROW

# Enable compression for binary logs to reduce disk usage.
log-bin-compress = 1

# Disable binary log encryption for better performance. Enable it if data security
# requires encrypted logs.
encrypt-binlog = 0

# Automatically purge relay logs to save disk space.
relay-log-purge = 1

# Enable relay log recovery to ensure consistency during replication recovery.
relay-log-recovery = 1

# Configure whether replication slave connections are required before purging logs.
slave_connections_needed_for_purge = 0

# ============================================
# Character Set and Encoding
# ============================================

# Set the server's default character set to UTF-8 with full Unicode support.
character-set-server = utf8mb4

# Set the default collation for the server to match the UTF-8 character set.
collation-server = utf8mb4_general_ci

# Ensure proper encoding when clients connect to the server.
init-connect = 'SET NAMES utf8mb4'

# ============================================
# Monitoring and Debugging
# ============================================

# Enable the Performance Schema for detailed diagnostics.
performance-schema = 1

# Enable specific consumers in the Performance Schema for tracking events.
performance-schema-consumer-events-statements-history = 1
performance-schema-consumer-events-transactions-history = 1
performance-schema-consumer-events-waits-history = 1

# Enable detailed InnoDB status output for monitoring locks and transactions.
innodb-status-output = 0
innodb-status-output-locks = 0

# Disable the general query log by default to avoid excessive disk usage.
# Enable it only for debugging purposes.
general-log = 0

# ============================================
# Temporary Files
# ============================================

# Specify a directory for temporary files. Storing temporary files on an SSD
# can improve performance.
# tmpdir = /tmp

# ============================================
# SSL/TLS Security
# ============================================

# SSL/TLS-instellingen
# ssl-ca = /etc/mysql/ssl/ca-cert.pem
# ssl-cert = /etc/mysql/ssl/server-cert.pem
# ssl-key = /etc/mysql/ssl/server-key.pem
# require-secure-transport = 1

# ============================================
# Inclusion of Additional Configuration Files
# ============================================

# Import all .cnf files from the specified configuration directories.
!includedir /etc/mysql/conf.d/
!includedir /etc/mysql/mariadb.conf.d/
EOL
```

The `my.cnf` file is created with MariaDB/MySQL configurations for the Docker
containers.

<br />

## Add Content to `.dockerignore`

```sh
cat <<EOL >"$dir_path/.dockerignore"
*/temp*
# Exclude files and directories whose names start with temp in any immediate subdirectory of the root.
# For example, the plain file /somedir/temporary.txt is excluded, as is the directory /somedir/temp.

*/*/temp*
# Exclude files and directories starting with temp from any subdirectory that is two levels below the root.
# For example, /somedir/subdir/temporary.txt is excluded.

temp?
# Exclude files and directories in the root directory whose names are a one-character extension of temp.
# For example, /tempa and /tempb are excluded.
EOL
```

This section writes predefined content to the `.dockerignore` file to exclude
certain files from Docker builds.

<br />

## Add Content to `Dockerfile`

```sh
cat <<EOL >"$dir_path/Dockerfile"

EOL
```

This creates an empty `Dockerfile`, which should be populated with build
instructions.

<br />

## Add Content to `README.md`

```sh
cat <<EOL >"$dir_path/README.md"
# Welcome to ${container_name} README

## Docker Directory Structure

\`\`\`tree
/${container_name}
.
├── notes                    - Note files and information about the configuration.
│
├── production               - Configuration files and data for the production environment.
│   ├── .cert                - SSL certificates for secure connections.
│   ├── app                  - Application files.
│   ├── config/              - Configuration files for the application.
│   │   └── my.cnf           - MariaDB configuration file.
│   ├── db                   - Database files.
│   ├── log                  - Log files.
│   ├── redis                - Redis database files.
│   ├── .env                 - Environment variables for the Docker containers.
│   ├── docker-compose.yml   - Docker Compose configuration.
│   └── stack.env            - Environment variables specific to Portainer or the stack setup.
│
├── testing                  - Configuration files and data for the testing environment.
│   ├── .cert                - SSL certificates for secure connections.
│   ├── app                  - Application files.
│   ├── config/              - Configuration files for the application.
│   │   └── my.cnf           - MariaDB configuration file.
│   ├── db                   - Database files.
│   ├── log                  - Log files.
│   ├── redis                - Redis database files.
│   ├── .env                 - Environment variables for the Docker containers.
│   ├── docker-compose.yml   - Docker Compose configuration.
│   └── stack.env            - Environment variables specific to Portainer or the stack setup.
│
├── .dockerignore            - Excludes files from Docker builds.
├── Dockerfile               - Docker container build instructions.
└── README.md                - Instructions and information about the project.
\`\`\`

## Customization

- Update placeholder values (change_me, USER, ROLE, etc.) in the Docker Compose
  files with your specific configurations.
- Modify the .env file with API keys, secrets, and MariaDB configurations.

## Author

GJS (homelab-alpha)

## License

This project is licensed under CC BY-NC-SA 4.0 - see the [LICENSE](LICENSE.md) file for details.

[LICENSE]: https://github.com/homelab-alpha/shell-script/blob/main/LICENSE.md
EOL
```

This section populates the `README.md` file with a directory structure overview
and customization instructions.

<br />

## Completion Message

```sh
display_message "Docker container directory structure created in $dir_path."
```

Finally, the script displays a message indicating that the Docker container
directory structure has been successfully created.

<br />

## Conclusion

The script is a well-structured tool to automate the creation of a standardized
Docker container setup. It ensures that the necessary commands and permissions
are in place, validates user input, and creates a comprehensive directory
structure with essential configuration files for Docker containers. This can
significantly streamline the setup process for Docker-based projects, ensuring
consistency and reducing the risk of errors.

[new_docker_project.sh]:
  https://raw.githubusercontent.com/homelab-alpha/shell-script/main/scripts/new_docker_project.sh
