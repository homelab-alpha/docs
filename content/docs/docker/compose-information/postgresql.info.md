---
title: "postgresql.info"
description:
  "This file deploys a PostgreSQL database with a custom configuration file, a
  persistent data directory, and a health check."
url: "docker/compose-info/postgresql"
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
  - PostgreSQL
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - PostgreSQL
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - PostgreSQL
  - Database

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
Claude has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `docker-compose.yml` file does in detail. This file
deploys a PostgreSQL database with a custom configuration file, a persistent
data directory, and a health check.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: October 28, 2026
- **Description**: Configures a Docker network and the PostgreSQL service.
- **RAW Compose File**: [docker-compose.yml]
- **RAW Environment File**: [stack.env]
- **RAW PostgreSQL Configuration File**: [config/postgresql.conf]

<br />

## Networks Configuration

```yaml
networks:
  postgresql_net:
    attachable: true
    internal: true
    external: false
    name: postgresql
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.25.0/24
          ip_range: 172.20.25.0/24
          gateway: 172.20.25.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "postgresql"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.postgresql.network.description: "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `postgresql_net`.
- **attachable: false**: Other containers can't attach to this network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file.
- **name: postgresql**: Specifies the name of the network.
- **driver: bridge**: Uses the bridge driver to create an isolated network.
- **ipam**: Configures IP address management for the network.
  - **subnet**: `172.20.25.0/24`.
  - **ip_range**: `172.20.25.0/24`.
  - **gateway**: `172.20.25.1`.
- **driver_opts**: Additional options for the network driver.
  - **com.docker.network.bridge.default_bridge: "false"**: Indicates this is not
    the default Docker bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows outbound
    traffic to appear as if it came from the host.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds the bridge
    to all available IP addresses on the host.
  - **com.docker.network.bridge.name: "postgresql"**: Names the bridge interface
    on the host.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **description label**: Describes the network as an isolated bridge network.

<br />

## Services Configuration

### `postgresql_db`

```yaml
services:
  postgresql_db:
    restart: always
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: postgresql_db
    image: docker.io/postgres:18-trixie
    pull_policy: if_not_present
    volumes:
      - /docker/postgresql/config/postgresql.conf:/etc/postgresql/postgresql.conf
      - /docker/postgresql/18/production/db:/var/lib/postgresql
    env_file:
      # Choose the correct environment file:
      # - Use '.env' for Docker Compose.
      # - Use 'stack.env' for Portainer.
      # Comment out the file you are not using in the Compose file to avoid issues.
      - .env
      - stack.env
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      POSTGRES_PASSWORD: ${POSTGRES_SUPERUSER_PASSWORD} # Fill in the value in both the .env and stack.env files
      POSTGRES_USER: ${POSTGRES_SUPERUSER_NAME} # Fill in the value in both the .env and stack.env files
    command: ["postgres", "-c", "config_file=/etc/postgresql/postgresql.conf"]
    hostname: postgresql_db
    networks:
      postgresql_net:
        ipv4_address: 172.20.25.2
    ports:
      - target: 5432 # container port
        host_ip: 127.0.0.1 # The Host IP mapping, unspecified means all network interfaces (0.0.0.0)
        published: 5432 # publicly exposed port
        protocol: tcp # tcp or udp
        mode: ingress # host: For publishing a host port on each node
    security_opt:
      - no-new-privileges:true
    labels:
      com.postgresql.db.description: "is a PostgreSQL database."
    healthcheck:
      disable: false
      test: ["CMD-SHELL", "pg_isready -U $${POSTGRES_USER}"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

<br />

- **postgresql_db**: The service definition.
  - **restart: always**: Always restarts the container.
  - **logging**: Uses the `json-file` driver, limited to 1MB per file and a
    maximum of 2 files.
  - **stop_grace_period: 1m**: Waits 1 minute before forcibly stopping the
    container.
  - **container_name: postgresql_db**: Names the container.
  - **image: docker.io/postgres:18-trixie**: Uses this image, pinned to version
    `18-trixie`.
  - **pull_policy: if_not_present**: Pulls the image only if it's not present
    locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/postgresql/config/postgresql.conf:/etc/postgresql/postgresql.conf**
    - **/docker/postgresql/18/production/db:/var/lib/postgresql** PostgreSQL 18
      images store the data in `/var/lib/postgresql/18/docker`, so the mount
      point is `/var/lib/postgresql` instead of `/var/lib/postgresql/data`.
  - **env_file**: Loads the variables from `.env` (Docker Compose) or
    `stack.env` (Portainer). Comment out the file you are not using.
  - **environment**: Sets environment variables.
    - **PUID: 1000**: The user ID the container runs as.
    - **PGID: 1000**: The group ID the container runs as.
    - **TZ: Europe/Amsterdam**: Adjust the timezone to match your local
      timezone. You can find the full list of timezones here
      https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    - **POSTGRES_PASSWORD: ${POSTGRES_SUPERUSER_PASSWORD}**: Fill in the value
      in both the .env and stack.env files
    - **POSTGRES_USER: ${POSTGRES_SUPERUSER_NAME}**: Fill in the value in both
      the .env and stack.env files
  - **command**: Runs `postgres -c config_file=/etc/postgresql/postgresql.conf`.
  - **hostname: postgresql_db**: Sets the hostname for the container.
  - **networks**: Connects the service to `postgresql_net` with static IP
    address `172.20.25.2`.
  - **ports**: Maps host ports to container ports.
    - **127.0.0.1:5432 -> 5432/tcp**: Publishes the port on the host IP
      `127.0.0.1` only.
  - **security_opt: no-new-privileges:true**: Prevents the container from
    gaining new privileges.
  - **labels**: Project label and a description label.
  - **healthcheck**: Runs `pg_isready -U $${POSTGRES_USER}`.
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
# PostgreSQL Admin password: Change this to a strong, unique password
POSTGRES_SUPERUSER_PASSWORD=StrongUniqueAdminPassword5678

# PostgreSQL Admin username: Change this to your desired username
# Note: Avoid using 'root' or 'postgres' if possible
POSTGRES_SUPERUSER_NAME=admin
```

- **`POSTGRES_SUPERUSER_PASSWORD`**: PostgreSQL Admin password: Change this to a
  strong, unique password
- **`POSTGRES_SUPERUSER_NAME`**: PostgreSQL Admin username: Change this to your
  desired username Note: Avoid using 'root' or 'postgres' if possible

<br />

## PostgreSQL Configuration

The `postgresql.conf` file is mounted into the container and loaded with the
`config_file` option of the `postgres` command. See [postgresql.conf] for the
full file with comments. It contains the following sections:

- **Connection Settings**
- **Memory Settings**
- **Logging Settings**
- **Localization and Timezone**
- **Full Text Search**
- **Security and Access Control**
- **Including Additional Configuration Files**

<br />

## Conclusion

This `docker-compose` file deploys PostgreSQL on a custom bridge network with a
static IP address. The port is published on `127.0.0.1` only, the superuser
credentials are kept in an environment file, and the health check uses
`pg_isready`.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/postgresql/docker-compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/postgresql/stack.env
[config/postgresql.conf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/postgresql/config/postgresql.conf
