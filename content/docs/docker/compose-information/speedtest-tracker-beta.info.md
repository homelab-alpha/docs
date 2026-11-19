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
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `compose.yml` file does in detail. This file deploys
the Speedtest Tracker Beta with a MariaDB database. It uses the `alexjustesen`
image, its own network, and ports 80 and 443.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `compose.yml`
- **Project name**: `speedtest-tracker-beta`, set with the top-level `name:` of
  the file.
- **Author**: GJS (homelab-alpha)
- **Date**: November 19, 2026
- **Description**: Configures a Docker network and the Speedtest Tracker Beta
  services.
- **RAW Compose File**: [compose.yml]
- **RAW Environment File**: [stack.env]
- **RAW MariaDB Configuration File**: [my.cnf]

<br />

## Networks Configuration

```yaml
---
name: speedtest-tracker-beta

networks:
  # Joins the network of the speedtest-tracker stack, which must be running first.
  speedtest-tracker_net:
    external: true
    name: speedtest-tracker
```

<br />

- **networks**: This stack has no network of its own. It joins the network of
  the `speedtest-tracker` stack.
  - **speedtest-tracker_net**: The name of the network inside this Compose file.
  - **external: true**: The network already exists; Docker Compose does not
    create or remove it. Start the `speedtest-tracker` stack first.
  - **name: speedtest-tracker**: The name of the network in Docker
    (`172.20.23.0/24`). The database uses `172.20.23.4` and the app
    `172.20.23.5`; `speedtest-tracker` uses `.2` and `.3`.

<br />

## Services Configuration

### `speedtest-tracker-beta_db`

```yaml
services:
  speedtest-tracker-beta_db:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: speedtest-tracker-beta_db
    image: docker.io/mariadb:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/speedtest-tracker-beta/testing/db:/var/lib/mysql
      - /docker/speedtest-tracker-beta/testing/my.cnf:/etc/my.cnf
      - /sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure
    env_file:
      # Compose loads each file that exists and skips a missing one:
      # '.env' for the Docker Compose CLI, 'stack.env' for Portainer.
      - path: .env
        required: false
      - path: stack.env
        required: false
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
      MARIADB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB}
      MARIADB_DATABASE: ${NAME_DB}
      MARIADB_USER: ${USER_DB}
      MARIADB_PASSWORD: ${PASSWORD_DB}
    hostname: speedtest-tracker-beta_db
    networks:
      speedtest-tracker_net:
        ipv4_address: 172.20.23.4
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

- **speedtest-tracker-beta_db**: The service definition.
  - **restart: unless-stopped**: Restarts the container unless it is explicitly
    stopped.
  - **logging**: Uses the `json-file` driver, limited to 1MB per file and a
    maximum of 2 files.
  - **stop_grace_period: 1m**: Waits 1 minute before forcibly stopping the
    container.
  - **container_name: speedtest-tracker-beta_db**: Names the container.
  - **image: docker.io/mariadb**: Uses this image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not present
    locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/speedtest-tracker-beta/testing/db:/var/lib/mysql**
    - **/docker/speedtest-tracker-beta/testing/my.cnf:/etc/my.cnf**
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**
  - **env_file**: Loads `.env` (Docker Compose CLI) and `stack.env` (Portainer).
    Both are listed with `required: false`, so Compose skips the file that is
    missing.
  - **environment**: Sets environment variables.
    - **PUID: 1000**: The user ID the container runs as.
    - **PGID: 1000**: The group ID the container runs as.
    - **TZ: Europe/Amsterdam**
    - **MARIADB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB}**
    - **MARIADB_DATABASE: ${NAME_DB}**
    - **MARIADB_USER: ${USER_DB}**
    - **MARIADB_PASSWORD: ${PASSWORD_DB}**
  - **hostname: speedtest-tracker-beta_db**: Sets the hostname for the
    container.
  - **networks**: Connects the service to `speedtest-tracker_net` with static IP
    address `172.20.23.4`.
  - **security_opt: no-new-privileges:true**: Prevents the container from
    gaining new privileges.
  - **labels**: A description label.
  - **healthcheck**: Runs `healthcheck.sh --connect --innodb_initialized`.
    - **interval / timeout / retries / start_period / start_interval**: 10s / 5s
      / 3 / 10s / 5s.

<br />

### `speedtest-tracker-beta_app`

```yaml
services:
  speedtest-tracker-beta_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: speedtest-tracker-beta
    image: ghcr.io/alexjustesen/docker-speedtest-tracker:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    depends_on:
      speedtest-tracker-beta_db:
        condition: service_healthy
        restart: true
    volumes:
      - /docker/speedtest-tracker-beta/testing/.cert:/config/keys
      - /docker/speedtest-tracker-beta/testing/app:/config
    env_file:
      # Compose loads each file that exists and skips a missing one:
      # '.env' for the Docker Compose CLI, 'stack.env' for Portainer.
      - path: .env
        required: false
      - path: stack.env
        required: false
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
        ipv4_address: 172.20.23.5
    ports:
      - "80:8080/tcp"
      - "80:8080/udp"
      - "443:8443/tcp"
      - "443:8443/udp"
    security_opt:
      - no-new-privileges:true
    labels:
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

- **speedtest-tracker-beta_app**: The service definition.
  - **restart: unless-stopped**: Restarts the container unless it is explicitly
    stopped.
  - **logging**: Uses the `json-file` driver, limited to 1MB per file and a
    maximum of 2 files.
  - **stop_grace_period: 1m**: Waits 1 minute before forcibly stopping the
    container.
  - **container_name: speedtest-tracker-beta**: Names the container.
  - **image: ghcr.io/alexjustesen/docker-speedtest-tracker**: Uses this image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not present
    locally.
  - **depends_on**: Starts this service only when `speedtest-tracker-beta_db`
    has the condition `service_healthy`.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/speedtest-tracker-beta/testing/.cert:/config/keys**
    - **/docker/speedtest-tracker-beta/testing/app:/config**
  - **env_file**: Loads `.env` (Docker Compose CLI) and `stack.env` (Portainer).
    Both are listed with `required: false`, so Compose skips the file that is
    missing.
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
    address `172.20.23.5`.
  - **ports**: Maps host ports to container ports.
    - **"80:8080/tcp"**
    - **"80:8080/udp"**
    - **"443:8443/tcp"**
    - **"443:8443/udp"**
  - **security_opt: no-new-privileges:true**: Prevents the container from
    gaining new privileges.
  - **labels**: A description label.
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
HOST_DB=speedtest-tracker-beta_db

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

## Quick Start

{{% alert context="info" %}}
Requires Docker Compose 2.24.0 or later.
{{% /alert %}}

1. Start the `speedtest-tracker` stack first. This stack joins its
   `speedtest-tracker` network, with the database on `172.20.23.4` and the app
   on `172.20.23.5`.

2. Copy `my.cnf` to `/docker/speedtest-tracker-beta/testing/my.cnf`. Docker
   creates the other directories under `/docker/speedtest-tracker-beta/` on the
   first start.

3. Change the values in `.env` (Docker Compose CLI) or `stack.env` (Portainer),
   at least the passwords.

4. Start the stack:

   ```bash
   docker compose up -d
   ```

<br />

## Default Web Access

Access the Speedtest Tracker Beta web interface using the following URL:

**HTTP**:

```bash
http://your-ip-address:80
```

**HTTPS**:

```bash
https://your-ip-address:443
```

<br />

## Default Login Credentials

{{% alert context="info" %}}
If you have changed these values in the `.env` and or `stack.env` file, use
those credentials instead of the default ones.
{{% /alert %}}

**Username**:

```bash
admin@example.com
```

**Password**:

```bash
StrongUniqueUserPassword9012
```

{{% alert context="warning" %}}
**For security reasons, it is strongly recommended that you change the default
credentials after your first login.**
{{% /alert %}}

<br />

## Conclusion

This Compose file deploys the Speedtest Tracker Beta with a dedicated MariaDB
database. It joins the network of the regular Speedtest Tracker
(`172.20.23.0/24`) and differs from it in the image, the names, the host paths
(`/docker/speedtest-tracker-beta/testing/`), the published ports (80 and 443),
and the enabled debug mode.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/speedtest-tracker-beta/compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/speedtest-tracker-beta/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/speedtest-tracker-beta/my.cnf
