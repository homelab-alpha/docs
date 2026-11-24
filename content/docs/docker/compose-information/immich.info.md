---
title: "immich.info"
description:
  "Comprehensive Docker Compose setup for Immich, a self-hosted photo and video
  management solution featuring PostgreSQL, Redis caching, and machine learning
  services for enhanced media automation and privacy-focused control."
url: "docker/compose-info/immich"
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
  - Immich
  - Docker Compose
  - Self-Hosted
  - Photo Management
  - Video Management
  - PostgreSQL
  - Redis
  - Machine Learning
  - Media Automation
  - Privacy
keywords:
  - immich docker compose
  - self-hosted photo manager
  - video management solution
  - docker postgres redis immich
  - immich machine learning
  - homelab photo server
  - media automation docker
  - immich privacy control
  - docker compose example
  - immich deployment

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `compose.yml` file does in detail for deploying
Immich, a self-hosted photo and video management solution, along with its
supporting services including MariaDB for database management, Redis for
caching, and a machine learning component for enhanced media automation.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `compose.yml`
- **Project name**: `immich`, set with the top-level `name:` of the file.
- **Author**: GJS (homelab-alpha)
- **Date**: November 19, 2026
- **Description**: Docker Compose configuration for Immich with PostgreSQL,
  Redis, and machine learning services for self-hosted media management.
- **RAW Compose File**: [compose.yml]
- **RAW .env File**: [.env]
- **RAW stack.env File**: [stack.env]

<br />

## Networks Configuration

```yaml
---
name: immich

networks:
  immich_net:
    attachable: false
    internal: false
    external: false
    name: immich
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.24.0/24
          ip_range: 172.20.24.0/24
          gateway: 172.20.24.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "immich"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.immich.network.description: "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `immich_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this Compose file, not
  externally defined.
- **name: immich**: Specifies the name of the network.
- **driver: bridge**: Uses the bridge driver to create an isolated network.
- **ipam**: Configures IP address management for the network.
  - **driver: default**: Uses the default IPAM driver.
  - **config**: Sets up the IP address configuration.
    - **subnet**: Defines the subnet for the network.
    - **ip_range**: Restricts the IP range within the subnet.
    - **gateway**: Sets the gateway for the network.
- **driver_opts**: Additional options for the network driver.
  - **com.docker.network.bridge.default_bridge: "false"**: Indicates this is not
    the default Docker bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows outbound
    traffic to appear as if it came from the host.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds the bridge
    to all available IP addresses on the host.
  - **com.docker.network.bridge.name: "immich"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.immich.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  immich_db:
    deploy:
      resources:
        limits:
          pids: 2048 # Limits the number of processes and threads (fork bomb protection).
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: immich_db
    image: ghcr.io/immich-app/postgres:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/immich/production/db:/var/lib/postgresql/data
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
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      POSTGRES_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      POSTGRES_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      POSTGRES_DB: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      POSTGRES_INITDB_ARGS: "--data-checksums"
      # DB_STORAGE_TYPE: "HDD" # Uncomment if using HDD storage
    hostname: database # DO NOT MODIFY – Essential for Immich stack functionality.
    networks:
      immich_net:
        ipv4_address: 172.20.24.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.immich.db.description: "is a PostgreSQL database."
    healthcheck:
      disable: false
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  immich_redis:
    deploy:
      resources:
        limits:
          pids: 2048 # Limits the number of processes and threads (fork bomb protection).
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: immich_redis
    image: docker.io/valkey/valkey:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/immich/production/redis:/data
      - /docker/immich/production/redis:/usr/local/etc/redis/redis.conf
      - /docker/immich/production/redis:/var/lib/redis
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    hostname: redis # DO NOT MODIFY – Essential for Immich stack functionality.
    networks:
      immich_net:
        ipv4_address: 172.20.24.3
    security_opt:
      - no-new-privileges:true
    labels:
      com.immich.redis.description: "is a redis database."
    healthcheck:
      disable: false
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  immich_ml:
    deploy:
      resources:
        limits:
          pids: 2048 # Limits the number of processes and threads (fork bomb protection).
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: immich_ml
    image: ghcr.io/immich-app/immich-machine-learning:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    volumes:
      - /docker/immich/production/ml:/cache
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
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    hostname: immich-machine-learning # DO NOT MODIFY – Essential for Immich stack functionality.
    networks:
      immich_net:
        ipv4_address: 172.20.24.4
    security_opt:
      - no-new-privileges:true
    labels:
      com.immich.ml.description:
        "a machine learning-powered component of immich, designed to enhance
        media management and automation."
    healthcheck:
      disable: false

  immich_app:
    deploy:
      resources:
        limits:
          pids: 2048 # Limits the number of processes and threads (fork bomb protection).
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: immich
    image: ghcr.io/immich-app/immich-server:<tag> # The current tag is in the RAW compose.yml.
    pull_policy: if_not_present
    depends_on:
      immich_db:
        condition: service_healthy
        restart: true
      immich_redis:
        condition: service_healthy
      immich_ml:
        condition: service_started
        restart: true
    volumes:
      - /docker/immich/production/app:/data
      - /docker/immich/production/app:/usr/src/app/upload
      - /etc/localtime:/etc/localtime:ro
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    domainname: photos.local # Customize this with your own domain, e.g., `photos.local` to `photos.your-fqdn-here.com`
    hostname: photos
    networks:
      immich_net:
        ipv4_address: 172.20.24.5
    ports:
      - "3015:2283/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.immich.description:
        "a self-hosted solution for seamless photo and video management,
        offering privacy and full control."
    healthcheck:
      disable: false
```

<br />

- **services**: Defines services to be deployed.
- **immich_db**: The service name for the PostgreSQL database container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: immich_db**: Names the container "immich_db".
  - **image**: Specifies the PostgreSQL database image with a specific tag.
    - **ghcr.io/immich-app/postgres**
  - **pull_policy: if_not_present**: Pulls the image only if it is not already
    present locally.
  - **volumes**: Mounts host directories into the container.
    - **/docker/immich/production/db:/var/lib/postgresql/data**: Persists
      database data on the host.
  - **env_file**: Loads `.env` (Docker Compose CLI) and `stack.env` (Portainer).
    Both are listed with `required: false`, so Compose skips the file that is
    missing.
    - **.env**: For Docker Compose.
    - **stack.env**: For Portainer.
  - **environment**: Sets environment variables for the PostgreSQL database.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **POSTGRES_PASSWORD: ${PASSWORD_DB}**: Sets the database password.
    - **POSTGRES_USER: ${USER_DB}**: Sets the database user.
    - **POSTGRES_DB: ${NAME_DB}**: Sets the database name.
    - **POSTGRES_INITDB_ARGS: '--data-checksums'**: Enables data checksums
      during initialization.
  - **hostname: database**: Sets the hostname for the container. This is
    required and **must not be modified** (default: database).
  - **networks**: Connects the service to the `immich_net` network.
    - **ipv4_address: 172.20.24.2**: Assigns a static IP address to the
      container.
  - **deploy.resources.limits.pids: 2048**: Limits the number of processes and
    threads in the container, which protects the host against fork bombs.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.immich.db.description: "is a PostgreSQL database."**: Description
      label for the database container.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Command to check PostgreSQL readiness.
      - `["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]`
    - **interval: 10s**: The time between running health checks.
    - **timeout: 5s**: The time allowed for a health check to complete.
    - **retries: 3**: Number of consecutive failures before the container is
      considered unhealthy.
    - **start_period: 10s**: Initial grace period before health checks count.
    - **start_interval: 5s**: Time between starting health checks.

<br />

- **immich_redis**: The service name for the Redis database container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: immich_redis**: Names the container "immich_redis".
  - **image: docker.io/valkey/valkey**: Uses the Valkey image (a
    Redis-compatible key-value store).
  - **pull_policy: if_not_present**: Pulls the image only if it is not already
    present locally.
  - **volumes**: Mounts host directories into the container.
    - **/docker/immich/production/redis:/data**: Persists Redis data on the
      host.
    - **/docker/immich/production/redis:/usr/local/etc/redis/redis.conf**:
      Mounts Redis configuration file.
    - **/docker/immich/production/redis:/var/lib/redis**: Mounts Redis library
      data.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **hostname: redis**: Sets the hostname for the container. This is required
    and **must not be modified** (default: redis).
  - **networks**: Connects the service to the `immich_net` network.
    - **ipv4_address: 172.20.24.3**: Assigns a static IP address to the
      container.
  - **deploy.resources.limits.pids: 2048**: Limits the number of processes and
    threads in the container, which protects the host against fork bombs.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.immich.redis.description: "is a redis database."**: Description
      label for the Redis container.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Command to check Redis availability.
      - `["CMD", "redis-cli", "ping"]`
    - **interval: 10s**: The time between running health checks.
    - **timeout: 5s**: The time allowed for a health check to complete.
    - **retries: 3**: Number of consecutive failures before the container is
      considered unhealthy.
    - **start_period: 10s**: Initial grace period before health checks count.
    - **start_interval: 5s**: Time between starting health checks.

<br />

- **immich_ml**: The service name for the machine learning component container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: immich_ml**: Names the container "immich_ml".
  - **image: ghcr.io/immich-app/immich-machine-learning**: Uses the machine
    learning image from the specified repository.
  - **pull_policy: if_not_present**: Pulls the image only if it is not already
    present locally.
  - **volumes**: Mounts host directories into the container.
    - **/docker/immich/production/ml:/cache**: Mounts the cache directory.
  - **env_file**: Loads `.env` (Docker Compose CLI) and `stack.env` (Portainer).
    Both are listed with `required: false`, so Compose skips the file that is
    missing.
    - **.env**: For Docker Compose.
    - **stack.env**: For Portainer.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **hostname: immich-machine-learning**: Sets the hostname for the container.
    This is required and **must not be modified** (default:
    immich-machine-learning).
  - **networks**: Connects the service to the `immich_net` network.
    - **ipv4_address: 172.20.24.4**: Assigns a static IP address to the
      container.
  - **deploy.resources.limits.pids: 2048**: Limits the number of processes and
    threads in the container, which protects the host against fork bombs.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.immich.ml.description**: "a machine learning-powered component of
      immich, designed to enhance media management and automation."
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.

<br />

- **immich_app**: The service name for the Immich application container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: immich**: Names the container "immich".
  - **image: ghcr.io/immich-app/immich-server**: Uses the Immich server image
    from GitHub Container Registry.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **depends_on**: Specifies dependencies for this service.
    - **immich_db**: Waits for the database service to be healthy; will restart.
    - **immich_redis**: Waits for the Redis service to be healthy.
    - **immich_ml**: Waits for the machine learning service to start, and
      restarts with it.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/immich/production/app:/data**: Mounts the application data
      directory.
    - **/docker/immich/production/app:/usr/src/app/upload**: Mounts the upload
      directory.
    - **/etc/localtime:/etc/localtime:ro**: Mounts the localtime file
      (read-only) to synchronize time.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **domainname: photos.local**: Sets the domain name for the container.
  - **hostname: photos**: Sets the hostname for the container.
  - **networks**: Connects the service to the `immich_net` network.
    - **ipv4_address: 172.20.24.5**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **3015:2283/tcp**: Maps TCP port 2283 in the container to host port 3015.
  - **deploy.resources.limits.pids: 2048**: Limits the number of processes and
    threads in the container, which protects the host against fork bombs.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.immich.description**: "a self-hosted solution for seamless photo and
      video management, offering privacy and full control."
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.

<br />

## Environment Variables

This file contains configuration settings that can be used by various
applications (such as Docker containers or your MariaDB server). These values
are stored outside the source code to enhance **security, portability, and
flexibility**.

<br />

### Variables in this file

```env
# Database Configuration: USER
# Database name: DO NOT MODIFY – Essential for Immich stack functionality.
NAME_DB=immich

# PostgreSQL user password: DO NOT MODIFY – Essential for Immich stack functionality.
PASSWORD_DB=postgres

# PostgreSQL username: DO NOT MODIFY – Essential for Immich stack functionality.
USER_DB=postgres
```

- **`NAME_DB`**: The name of the PostgreSQL database used by the Immich stack.
  This value **must not be modified** for proper functionality (default:
  `immich`).
- **`PASSWORD_DB`**: The password for the PostgreSQL user. This is essential for
  Immich stack functionality and **must not be changed** (default: `postgres`).
- **`USER_DB`**: The PostgreSQL username used by the Immich stack. This is
  required and **must not be modified** (default: `postgres`).

<br />

## Quick Start

{{% alert context="info" %}}
Requires Docker Compose 2.24.0 or later.
{{% /alert %}}

1. Change the values in `.env` (Docker Compose CLI) or `stack.env` (Portainer),
   at least the passwords.

2. Start the stack:

   ```bash
   docker compose up -d
   ```

<br />

## Default Web Access

Access the Immich web interface using the following URL:

```bash
http://your-ip-address:3015
```

<br />

## Default Login Credentials

{{% alert context="info" %}}
On the first visit, click **Getting Started**. The first user to register
becomes the admin user.
{{% /alert %}}

**Username**: Created during setup

**Password**: Created during setup

{{% alert context="warning" %}}
**For security reasons, it is strongly recommended to create a strong username
and password during the setup.**
{{% /alert %}}

<br />

## Conclusion

This Compose file sets up a Docker environment for the Immich application and
its dependent services. The configuration defines resource limits and
reservations, custom networking with static IP assignments, and security options
to enhance container safety. The Immich app container depends on healthy
database, Redis, and machine learning services, with proper restart policies to
maintain uptime. Persistent storage is configured for uploads, and timezone
synchronization is ensured. Logging and healthchecks are configured to monitor
container status, ensuring the services run efficiently and securely.

[compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/immich/compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/immich/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/compose-files/immich/stack.env
