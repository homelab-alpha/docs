---
title: "speedtest-tracker-beta.info"
description:
  "This file deploys the Speedtest Tracker Beta with a MariaDB database. It uses
  the `alexjustesen` image, its own network, and ports 80 and 443."
url: "docker/compose-info/speedtest-tracker-beta"
aliases: ""
icon: "code"

params:
  author:
    name: "Homelab-Alpha"
    email: ""

categories:
  - Docker
series:
  - Docker Compose
tags:
  - Docker
  - Speedtest Tracker Beta
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - Speedtest Tracker Beta
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - Speedtest Tracker
  - MariaDB
  - Internet Speed Monitoring

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `docker-compose.yml` file does in detail. This file
deploys the Speedtest Tracker Beta with a MariaDB database. It uses the
`alexjustesen` image, its own network, and ports 80 and 443.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: October 28, 2026
- **Description**: Configures a Docker network and the Speedtest Tracker Beta
  services.
- **RAW Compose File**: [docker-compose.yml]
- **RAW Environment File**: [stack.env]
- **RAW MariaDB Configuration File**: [my.cnf]

<br />

## Networks Configuration

```yaml
networks:
  speedtest-tracker_net:
    attachable: false
    internal: false
    external: false
    name: speedtest-tracker
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.21.23.0/24
          ip_range: 172.21.23.0/24
          gateway: 172.21.23.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "speedtest"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.speedtest-tracker.network.description:
        "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `speedtest-tracker_net`.
- **attachable: false**: Other containers can't attach to this network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file.
- **name: speedtest-tracker**: Specifies the name of the network.
- **driver: bridge**: Uses the bridge driver to create an isolated network.
- **ipam**: Configures IP address management for the network.
  - **subnet**: `172.21.23.0/24`.
  - **ip_range**: `172.21.23.0/24`.
  - **gateway**: `172.21.23.1`.
- **driver_opts**: Additional options for the network driver.
  - **com.docker.network.bridge.default_bridge: "false"**: Indicates this is not
    the default Docker bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows outbound
    traffic to appear as if it came from the host.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds the bridge
    to all available IP addresses on the host.
  - **com.docker.network.bridge.name: "speedtest"**: Names the bridge interface
    on the host.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **description label**: Describes the network as an isolated bridge network.

<br />

## Services Configuration

### `speedtest-tracker_db`

```yaml
services:
  speedtest-tracker_db:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: speedtest-tracker_db
    image: docker.io/mariadb:13.0.2
    pull_policy: if_not_present
    volumes:
      - /docker/speedtest-tracker/production/db:/var/lib/mysql
      - /docker/speedtest-tracker/production/my.cnf:/etc/my.cnf
      - /sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure
    env_file:
      - .env
      - stack.env
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
      MARIADB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB}
      MARIADB_DATABASE: ${NAME_DB}
      MARIADB_USER: ${USER_DB}
      MARIADB_PASSWORD: ${PASSWORD_DB}
    hostname: speedtest-tracker_db
    networks:
      speedtest-tracker_net:
        ipv4_address: 172.21.23.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.speedtest-tracker.db.description: "is a MariaDB database."
    healthcheck:
      disable: false
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

<br />

- **speedtest-tracker_db**: The service definition.
  - **restart: unless-stopped**: Restarts the container unless it is explicitly
    stopped.
  - **logging**: Uses the `json-file` driver, limited to 1MB per file and a
    maximum of 2 files.
  - **stop_grace_period: 1m**: Waits 1 minute before forcibly stopping the
    container.
  - **container_name: speedtest-tracker_db**: Names the container.
  - **image: docker.io/mariadb:13.0.2**: Uses this image, pinned to version
    `13.0.2`.
  - **pull_policy: if_not_present**: Pulls the image only if it's not present
    locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/speedtest-tracker/production/db:/var/lib/mysql**
    - **/docker/speedtest-tracker/production/my.cnf:/etc/my.cnf**
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**
  - **env_file**: Loads the variables from `.env` (Docker Compose) or
    `stack.env` (Portainer). Comment out the file you are not using.
  - **environment**: Sets environment variables.
    - **PUID: 1000**: The user ID the container runs as.
    - **PGID: 1000**: The group ID the container runs as.
    - **TZ: Europe/Amsterdam**
    - **MARIADB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB}**
    - **MARIADB_DATABASE: ${NAME_DB}**
    - **MARIADB_USER: ${USER_DB}**
    - **MARIADB_PASSWORD: ${PASSWORD_DB}**
  - **hostname: speedtest-tracker_db**: Sets the hostname for the container.
  - **networks**: Connects the service to `speedtest-tracker_net` with static IP
    address `172.21.23.2`.
  - **security_opt: no-new-privileges:true**: Prevents the container from
    gaining new privileges.
  - **labels**: Project label and a description label.
  - **healthcheck**: Runs `healthcheck.sh --connect --innodb_initialized`.
    - **interval / timeout / retries / start_period / start_interval**: 10s / 5s
      / 3 / 10s / 5s.

<br />

### `speedtest-tracker_app`

```yaml
services:
  speedtest-tracker_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: speedtest-tracker
    image: ghcr.io/alexjustesen/docker-speedtest-tracker:1.15.1
    # image: ghcr.io/alexjustesen/docker-speedtest-tracker:dev-amd64
    pull_policy: if_not_present
    depends_on:
      speedtest-tracker_db:
        condition: service_healthy
        restart: true
    links:
      - speedtest-tracker_db
    volumes:
      - /docker/speedtest-tracker/production/.cert:/config/keys
      - /docker/speedtest-tracker/production/app:/config
    env_file:
      - .env
      - stack.env
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
      DB_CONNECTION: mysql
      DB_HOST: ${HOST_DB}
      DB_PORT: ${PORT_DB}
      DB_DATABASE: ${NAME_DB}
      DB_USERNAME: ${USER_DB}
      DB_PASSWORD: ${PASSWORD_DB}
      APP_KEY: ${APP_KEY}
      APP_LOCALE: en_EN
      APP_NAME: "Speedtest Tracker Beta"
      APP_TIMEZONE: Europe/Amsterdam
      APP_URL: http://localhost
      ASSET_URL: http://localhost
      APP_DEBUG: true
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_NAME: ${ADMIN_NAME}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      SPEEDTEST_INTERNET_CHECK_HOSTNAME: "google.com"
      SPEEDTEST_SCHEDULE: "*/10 * * * *"
      # SPEEDTEST_SCHEDULE: "*/1 * * * *"
      PUBLIC_DASHBOARD: "true"
      CHART_BEGIN_AT_ZERO: "true"
      CHART_DATETIME_FORMAT: "M jS, H:i"
      DATETIME_FORMAT: "F jS, Y, H:i"
      DISPLAY_TIMEZONE: "Europe/Amsterdam"
      PRUNE_RESULTS_OLDER_THAN: "31"
      API_RATE_LIMIT: "30"
    domainname: speedtest-tracker-beta.local
    hostname: speedtest-tracker-beta
    networks:
      speedtest-tracker_net:
        ipv4_address: 172.21.23.3
    ports:
      - "80:8080/tcp"
      - "80:8080/udp"
      - "443:8443/tcp"
      - "443:8443/udp"
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "speedtest-tracker"
      com.speedtest-tracker.description:
        "a self-hosted application that monitors the performance and uptime of
        your internet connection."
    healthcheck:
      disable: false
      test: curl -fSs APP_URL/api/healthcheck | jq -r .message || exit 1
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

<br />

- **speedtest-tracker_app**: The service definition.
  - **restart: unless-stopped**: Restarts the container unless it is explicitly
    stopped.
  - **logging**: Uses the `json-file` driver, limited to 1MB per file and a
    maximum of 2 files.
  - **stop_grace_period: 1m**: Waits 1 minute before forcibly stopping the
    container.
  - **container_name: speedtest-tracker**: Names the container.
  - **image: ghcr.io/alexjustesen/docker-speedtest-tracker:1.15.1**: Uses this
    image, pinned to version `1.15.1`.
  - **pull_policy: if_not_present**: Pulls the image only if it's not present
    locally.
  - **depends_on**: Starts this service only when `speedtest-tracker_db` has the
    condition `service_healthy`.
  - **links**: Makes `speedtest-tracker_db` reachable by service name.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/speedtest-tracker/production/.cert:/config/keys**
    - **/docker/speedtest-tracker/production/app:/config**
  - **env_file**: Loads the variables from `.env` (Docker Compose) or
    `stack.env` (Portainer). Comment out the file you are not using.
  - **environment**: Sets environment variables.
    - **PUID: 1000**: The user ID the container runs as.
    - **PGID: 1000**: The group ID the container runs as.
    - **TZ: Europe/Amsterdam**
    - **DB_CONNECTION: mysql**
    - **DB_HOST: ${HOST_DB}**
    - **DB_PORT: ${PORT_DB}**
    - **DB_DATABASE: ${NAME_DB}**
    - **DB_USERNAME: ${USER_DB}**
    - **DB_PASSWORD: ${PASSWORD_DB}**
    - **APP_KEY: ${APP_KEY}**
    - **APP_LOCALE: en_EN**
    - **APP_NAME: Speedtest Tracker Beta**
    - **APP_TIMEZONE: Europe/Amsterdam**
    - **APP_URL: http://localhost**
    - **ASSET_URL: http://localhost**
    - **APP_DEBUG: True**
    - **ADMIN_EMAIL: ${ADMIN_EMAIL}**
    - **ADMIN_NAME: ${ADMIN_NAME}**
    - **ADMIN_PASSWORD: ${ADMIN_PASSWORD}**
    - **SPEEDTEST_INTERNET_CHECK_HOSTNAME: google.com**
    - **SPEEDTEST_SCHEDULE: */10 * * * ***
    - **PUBLIC_DASHBOARD: true**
    - **CHART_BEGIN_AT_ZERO: true**
    - **CHART_DATETIME_FORMAT: M jS, H:i**
    - **DATETIME_FORMAT: F jS, Y, H:i**
    - **DISPLAY_TIMEZONE: Europe/Amsterdam**
    - **PRUNE_RESULTS_OLDER_THAN: 31**
    - **API_RATE_LIMIT: 30**
  - **domainname: speedtest-tracker-beta.local**: Sets the domain name for the
    container. Replace it with your own domain.
  - **hostname: speedtest-tracker-beta**: Sets the hostname for the container.
  - **networks**: Connects the service to `speedtest-tracker_net` with static IP
    address `172.21.23.3`.
  - **ports**: Maps host ports to container ports.
    - **"80:8080/tcp"**
    - **"80:8080/udp"**
    - **"443:8443/tcp"**
    - **"443:8443/udp"**
  - **security_opt: no-new-privileges:true**: Prevents the container from
    gaining new privileges.
  - **labels**: Project label and a description label.
  - **healthcheck**: Runs
    `curl -fSs APP_URL/api/healthcheck | jq -r .message || exit 1`.
    - **interval / timeout / retries / start_period / start_interval**: 10s / 5s
      / 3 / 10s / 5s.

<br />

## Environment Variables

The variables are stored in an environment file, outside the compose file. Use
`.env` for Docker Compose and `stack.env` for Portainer. Both files must contain
the same values.

<br />

### Variables in this file

```env
# Database Configuration: ROOT USER
# Change the MariaDB root password to a strong, unique password of your choice.
# Ensure the password is complex and not easily guessable.
ROOT_PASSWORD_DB=StrongUniqueRootPassword1234

# Database Configuration: USER
# Database host and connection settings
HOST_DB=speedtest-tracker_db

# Database name: Change this to your desired database name
NAME_DB=speedtest_tracker_db

# MariaDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MariaDB connection port (default: 3306)
PORT_DB=3306

# MariaDB username: Change this to your desired username
USER_DB=speedtest-tracker

# Application Key
# Define a secure application key for encryption.
# To generate a new secure key, run the following in the terminal:
#
#   echo -n 'base64:'; openssl rand -base64 32
#
# This will output a base64 encoded key.
# Example output: base64:BehUUH9rR5A+DDVqJDJLrj31X13asZ8YNNt9J+dauGg=
APP_KEY=Insert_the_App_key_here

# Admin Credentials for Dashboard Access
# Choose strong and unique credentials for admin access to the application dashboard.
# Avoid using default usernames and passwords in production.
ADMIN_EMAIL=admin@example.com
ADMIN_NAME=admin
ADMIN_PASSWORD=StrongUniqueUserPassword9012
```

- **`ROOT_PASSWORD_DB`**: Change the MariaDB root password to a strong, unique
  password of your choice. Ensure the password is complex and not easily
  guessable.
- **`HOST_DB`**: Database host and connection settings
- **`NAME_DB`**: Database name: Change this to your desired database name
- **`PASSWORD_DB`**: MariaDB user password: Change this to a strong, unique
  password
- **`PORT_DB`**: MariaDB connection port (default: 3306)
- **`USER_DB`**: MariaDB username: Change this to your desired username
- **`APP_KEY`**: Application Key Define a secure application key for encryption.
  To generate a new secure key, run the following in the terminal: echo -n
  'base64:'; openssl rand -base64 32 This will output a base64 encoded key.
  Example output: base64:BehUUH9rR5A+DDVqJDJLrj31X13asZ8YNNt9J+dauGg=
- **`ADMIN_EMAIL`**: Admin Credentials for Dashboard Access Choose strong and
  unique credentials for admin access to the application dashboard. Avoid using
  default usernames and passwords in production.
- **`ADMIN_NAME`**
- **`ADMIN_PASSWORD`**

<br />

## MariaDB Configuration

The `my.cnf` file is mounted into the database container as `/etc/my.cnf`. It is
identical to the file of the
[Speedtest Tracker](/docker/compose-info/speedtest-tracker/) and the
[MariaDB](/docker/compose-info/mariadb/) pages. See [my.cnf] for the full file
with comments.

<br />

## Conclusion

This `docker-compose` file deploys the Speedtest Tracker Beta with a dedicated
MariaDB database on its own bridge network. It differs from the regular
Speedtest Tracker in the image, the network (`172.21.23.0/24`), the published
ports (80 and 443), and the enabled debug mode.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/speedtest-tracker-beta/docker-compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/speedtest-tracker-beta/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/speedtest-tracker-beta/my.cnf
