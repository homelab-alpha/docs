---
title: "uptime-kuma.info"
description:
  "Deploy an Uptime Kuma instance with a MariaDB database for monitoring website
  uptime and alerting. It covers the custom Docker network, the database
  service, the Uptime Kuma service, and the environment and MariaDB
  configuration files."
url: "docker/compose-info/uptime-kuma"
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
  - Uptime Kuma
  - MariaDB
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - Uptime Kuma
  - MariaDB
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Self-hosted Monitoring

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
is used to configure and deploy an Uptime Kuma instance for monitoring website
uptime and alerting. Uptime Kuma stores its data in a separate MariaDB
container, which is started first and must be healthy before Uptime Kuma starts.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: October 28, 2026
- **Description**: This file configures a custom Docker network, a MariaDB
  database service, and an Uptime Kuma service for monitoring website uptime and
  alerting.
- **RAW Compose File**: [docker-compose.yml]
- **RAW Environment File**: [stack.env]
- **RAW MariaDB Configuration File**: [my.cnf]

<br />

## Networks Configuration

```yaml
networks:
  uptime-kuma_net:
    attachable: false
    internal: false
    external: false
    name: uptime-kuma
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.19.3.0/24
          ip_range: 172.19.3.0/24
          gateway: 172.19.3.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "uptimekuma"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.uptime-kuma.network.description: "is an isolated bridge network."
```

<br />

- **networks**: This section defines a custom network named `uptime-kuma_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is not an externally defined one but created
  within this `docker-compose` file.
- **name: uptime-kuma**: Specifies the name of the network.
- **driver: bridge**: Uses the bridge driver to create an isolated network.
- **ipam**: Configures IP address management for the network.
  - **driver: default**: Uses the default IPAM driver.
  - **config**: Sets up the IP address configuration.
    - **subnet**: Defines the subnet (`172.19.3.0/24`) for the network.
    - **ip_range**: Restricts the IP range within the subnet.
    - **gateway**: Sets the gateway (`172.19.3.1`) for the network.
- **driver_opts**: Additional options for the network driver.
  - **com.docker.network.bridge.default_bridge: "false"**: Indicates this is not
    the default Docker bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows outbound
    traffic to appear as if it came from the host.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds the bridge
    to all available IP addresses on the host.
  - **com.docker.network.bridge.name: "uptimekuma"**: Names the bridge interface
    on the host.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.uptime-kuma.network.description**: A description label for the
    network.

<br />

## Services Configuration

### Database Service (`uptime-kuma_db`)

```yaml
services:
  uptime-kuma_db:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: uptime-kuma_db
    image: docker.io/mariadb:13.0.2
    pull_policy: if_not_present
    volumes:
      - /docker/uptime-kuma/production/db:/var/lib/mysql
      - /docker/uptime-kuma/production/my.cnf:/etc/my.cnf
      - /sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure
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
      MARIADB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_DATABASE: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
    hostname: uptime-kuma_db
    networks:
      uptime-kuma_net:
        ipv4_address: 172.19.3.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.uptime-kuma.db.description: "is an MariaDB database."
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

- **services**: Defines services to be deployed.
- **uptime-kuma_db**: The service name for the MariaDB container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Uses the `json-file` driver, limited to 1MB per file and a
    maximum of 2 files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: uptime-kuma_db**: Names the container "uptime-kuma_db".
  - **image: docker.io/mariadb:13.0.2**: Uses the MariaDB image, pinned to
    version `13.0.2`.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/uptime-kuma/production/db:/var/lib/mysql**: Persists the
      database files.
    - **/docker/uptime-kuma/production/my.cnf:/etc/my.cnf**: Mounts the MariaDB
      configuration file.
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**: Gives
      MariaDB access to the memory pressure information of the host.
  - **env_file**: Loads the variables from `.env` (Docker Compose) or
    `stack.env` (Portainer). Comment out the file you are not using.
  - **environment**: Sets environment variables.
    - **PUID / PGID**: The user and group ID the container runs as.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **MARIADB_ROOT_PASSWORD**: The root password, taken from
      `ROOT_PASSWORD_DB`.
    - **MARIADB_DATABASE**: The database that is created, taken from `NAME_DB`.
    - **MARIADB_USER**: The database user that is created, taken from `USER_DB`.
    - **MARIADB_PASSWORD**: The password of that user, taken from `PASSWORD_DB`.
  - **hostname: uptime-kuma_db**: Sets the hostname for the container.
  - **networks**: Connects the service to the `uptime-kuma_net` network.
    - **ipv4_address: 172.19.3.2**: Assigns a static IP address to the
      container.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.uptime-kuma.db.description**: Description label for the database.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Runs `healthcheck.sh --connect --innodb_initialized`, which
      verifies that MariaDB accepts connections and InnoDB is initialized.
    - **interval**: The time between running health checks (10 seconds).
    - **timeout**: The time a health check is allowed to run before it is
      considered to have failed (5 seconds).
    - **retries**: The number of consecutive failures required before the
      container is considered unhealthy (3 retries).
    - **start_period**: The initial period during which a health check failure
      will not be counted towards the retries (10 seconds).
    - **start_interval**: The time between health checks during the start period
      (5 seconds).

<br />

### Application Service (`uptime-kuma_app`)

```yaml
services:
  uptime-kuma_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: uptime-kuma
    image: ghcr.io/louislam/uptime-kuma:2.5.8-slim
    pull_policy: if_not_present
    depends_on:
      uptime-kuma_db:
        condition: service_healthy
    links:
      - uptime-kuma_db
    volumes:
      - /docker/uptime-kuma/production/app:/app/data
      - /usr/local/share/ca-certificates:/app/data/docker-tls
      - /var/run/docker.sock:/var/run/docker.sock:ro
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
      # Replace 'root_ca.crt' with your own Root CA certificate, then uncomment the line
      # NODE_EXTRA_CA_CERTS: /app/data/docker-tls/root_ca.crt
      MARIADB_HOST: ${HOST_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_PORT: ${PORT_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_NAME: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      MARIADB_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
    domainname: status.local # Customize this with your own domain, e.g., `status.local` to `status.your-fqdn-here.com`.
    hostname: status
    networks:
      uptime-kuma_net:
        ipv4_address: 172.19.3.3
    ports:
      - "3001:3001/tcp" # HTTP
      - "3001:3001/udp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "uptime-kuma"
      com.uptime-kuma.description:
        "is an self-hosted monitoring tool that allows you to monitor uptime,
        status, and notifications for various services and domains."
    healthcheck:
      disable: false
      test: ["CMD", "extra/healthcheck"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

<br />

- **uptime-kuma_app**: The service name for the Uptime Kuma container.
  - **restart**, **logging**, **stop_grace_period**, **pull_policy**: Same
    behavior as the database service.
  - **container_name: uptime-kuma**: Names the container "uptime-kuma".
  - **image: ghcr.io/louislam/uptime-kuma:2.5.8-slim**: Uses the Uptime Kuma
    image, pinned to version `2.5.8-slim`.
  - **depends_on**: Starts this service only when `uptime-kuma_db` reports
    `service_healthy`.
  - **links**: Makes the database reachable under the name `uptime-kuma_db`.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/uptime-kuma/production/app:/app/data**: Persists Uptime Kuma
      data.
    - **/usr/local/share/ca-certificates:/app/data/docker-tls**: Mounts the
      directory containing custom CA certificates.
    - **/var/run/docker.sock:/var/run/docker.sock:ro**: Mounts the Docker socket
      read-only.
  - **env_file**: Loads the variables from `.env` (Docker Compose) or
    `stack.env` (Portainer). Comment out the file you are not using.
  - **environment**: Sets environment variables.
    - **PUID / PGID**: The user and group ID the container runs as.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **# NODE_EXTRA_CA_CERTS: /app/data/docker-tls/root_ca.crt**: Commented
      out. Replace `root_ca.crt` with your own Root CA certificate and uncomment
      the line to add it as a trusted root certificate.
    - **MARIADB_HOST / MARIADB_PORT / MARIADB_NAME / MARIADB_USER /
      MARIADB_PASSWORD**: The database connection settings, taken from
      `HOST_DB`, `PORT_DB`, `NAME_DB`, `USER_DB`, and `PASSWORD_DB`.
  - **domainname: status.local**: Sets the domain name for the container.
    Replace it with your own domain.
  - **hostname: status**: Sets the hostname for the container.
  - **networks**: Connects the service to the `uptime-kuma_net` network.
    - **ipv4_address: 172.19.3.3**: Assigns a static IP address to the
      container.
  - **ports**: Maps host ports to container ports.
    - **"3001:3001/tcp"**: Maps TCP port 3001 on the host to port 3001 in the
      container.
    - **"3001:3001/udp"**: Maps UDP port 3001 on the host to port 3001 in the
      container.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "uptime-kuma"**: Project label.
    - **com.uptime-kuma.description**: Description label for Uptime Kuma.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Runs `["CMD", "extra/healthcheck"]`.
    - **interval**, **timeout**, **retries**, **start_period**,
      **start_interval**: Same values as the database service.

<br />

## Environment Variables

The database credentials are stored in an environment file, outside the compose
file. Use `.env` for Docker Compose and `stack.env` for Portainer. Both files
must contain the same values.

<br />

### Variables in this file

```env
# Database Configuration: ROOT USER
# Change the MariaDB root password to a strong, unique password of your choice.
# Ensure the password is complex and not easily guessable.
ROOT_PASSWORD_DB=StrongUniqueRootPassword1234

# Database Configuration: USER
# Database host and connection settings
HOST_DB=uptime-kuma_db

# Database name:
NAME_DB=uptime_kuma_db

# MariaDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MariaDB connection port (default: 3306)
PORT_DB=3306

# MariaDB username: Change this to your desired username
USER_DB=uptime-kuma
```

- **`ROOT_PASSWORD_DB`**: The root password of the MariaDB instance. Use a
  secure and unique value.
- **`HOST_DB`**: Hostname of the database server. This matches the service name
  (`uptime-kuma_db`).
- **`NAME_DB`**: The name of the database used by Uptime Kuma.
- **`PASSWORD_DB`**: The password for the non-root database user. Use a secure
  and unique value.
- **`PORT_DB`**: The port MariaDB listens on (default: 3306).
- **`USER_DB`**: The username Uptime Kuma uses to connect to the database.

<br />

## MariaDB Configuration

The `my.cnf` file is mounted into the database container as `/etc/my.cnf`. It
configures server operation, performance tuning, security, binary logging,
character encoding, and monitoring. See [my.cnf] for the full file with
comments. The same file layout is explained in detail on the
[MariaDB compose page](/docker/compose-info/mariadb/).

- **General**: `server-id`, `datadir`, `skip-name-resolve`, and InnoDB as the
  default storage engine.
- **Performance**: A 1G InnoDB buffer pool and redo log, 8 read and write I/O
  threads, and up to 200 connections.
- **Binary logging**: Enabled as `uptime-kuma_binlog`, in `ROW` format with
  `CRC32` checksums, compression, and a 7 day retention (`expire-logs-days`).
- **Character set**: `utf8mb4` with the `utf8mb4_general_ci` collation.
- **Security**: `secure-file-priv` restricts imports and exports to
  `/var/lib/mysql/`. The password validation and TLS options are commented out.

<br />

## Conclusion

This `docker-compose` file sets up a Docker environment for running Uptime Kuma,
a self-hosted monitoring tool similar to Uptime Robot, with a dedicated MariaDB
database. It creates a custom bridge network with static IP addresses, starts
Uptime Kuma only after the database is healthy, and keeps all credentials in an
environment file. Both services restart automatically, log efficiently, and run
with `no-new-privileges`.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma/docker-compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma/my.cnf
