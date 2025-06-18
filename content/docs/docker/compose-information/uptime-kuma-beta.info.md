---
title: "uptime-kuma-beta.info"
description:
  "Deploy Uptime Kuma Beta, a self-hosted monitoring tool that allows you to
  monitor uptime, status, and notifications for various services and domains."
url: "docker/compose-info/uptime-kuma-beta"
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
  - Docker Compose
  - Container Management
  - Infrastructure Monitoring
keywords:
  - Docker
  - Uptime Kuma
  - Docker Compose
  - Container Management
  - Docker Network
  - Uptime Kuma Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Infrastructure Monitoring
  - Self-hosted Monitoring

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `docker-compose.yml` file does in detail for
deploying Uptime Kuma Beta, a self-hosted monitoring tool.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 18, 2025
- **Description**: Configures a Docker network and the Uptime Kuma Beta service
  for monitoring uptime and status of various services.
- **RAW Compose File**: [docker-compose.yml]
- **RAW .env File**: [.env]
- **RAW stack.env File**: [stack.env]
- **RAW my.cnf File**: [my.cnf]

<br />

## Networks Configuration

```yaml
networks:
  uptime-kuma-beta_net:
    attachable: false
    internal: false
    external: false
    name: uptime-kuma-beta
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
      com.docker.network.bridge.name: "uptimekuma-beta"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.uptime-kuma-beta.network.description: "is an isolated bridge network."
```

<br />

- **networks**: This section defines a custom network named
  `uptime-kuma-beta_net`.
- **attachable**: Set to `false`, meaning other containers cannot attach to this
  network.
- **internal**: Set to `false`, meaning the network is accessible externally.
- **external**: Set to `false`, indicating the network is created within the
  `docker-compose` file.
- **name**: The name of the network is `uptime-kuma-beta`.
- **driver**: The network uses the `bridge` driver for isolation.
- **ipam**: Configures IP address management for the network.
  - **driver**: Uses the default IPAM driver.
  - **config**: Specifies the subnet, IP range, and gateway for the network.
- **driver_opts**: Additional options for the network driver.
  - **com.docker.network.bridge.default_bridge: "false"**: Indicates this is not
    the default Docker bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows outbound
    traffic to appear as if it came from the host.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds the bridge
    to all available IP addresses on the host.
  - **com.docker.network.bridge.name: "uptimekuma-beta"**: Names the bridge
    network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit for the network.
- **labels**: Metadata for the network, describing it as an isolated bridge
  network.

<br />

## Services Configuration

```yaml
services:
  uptime-kuma-beta_db:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 1G
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: uptime-kuma-beta_db
    image: docker.io/mariadb:latest
    pull_policy: if_not_present
    volumes:
      - /docker/uptime-kuma-beta/production/db:/var/lib/mysql
      - /docker/uptime-kuma-beta/production/my.cnf:/etc/my.cnf
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
      TZ: Europe/Amsterdam
      MARIADB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB}
      MARIADB_DATABASE: ${NAME_DB}
      MARIADB_USER: ${USER_DB}
      MARIADB_PASSWORD: ${PASSWORD_DB}
    hostname: uptime-kuma-beta_db
    networks:
      uptime-kuma-beta_net:
        ipv4_address: 172.19.3.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.uptime-kuma-beta.db.description: "is an MariaDB database."
    healthcheck:
      disable: false
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  uptime-kuma-beta_app:
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 1G
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: uptime-kuma-beta
    image: ghcr.io/louislam/uptime-kuma:beta
    pull_policy: if_not_present
    depends_on:
      uptime-kuma-beta_db:
        condition: service_healthy
    links:
      - uptime-kuma-beta_db
    volumes:
      - /docker/uptime-kuma-beta/production/app:/app/data
      - /usr/local/share/ca-certificates:/app/data/docker-tls
      - /var/run/docker.sock:/var/run/docker.sock:ro
    env_file:
      - .env
      - stack.env
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
      MARIADB_HOST: ${HOST_DB}
      MARIADB_PORT: ${PORT_DB}
      MARIADB_NAME: ${NAME_DB}
      MARIADB_USER: ${USER_DB}
      MARIADB_PASSWORD: ${PASSWORD_DB}
    domainname: status.local
    hostname: status
    networks:
      uptime-kuma-beta_net:
        ipv4_address: 172.19.3.3
    ports:
      - "3001:3001/tcp" # HTTP
      - "3001:3001/udp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "uptime-kuma-beta"
      com.uptime-kuma-beta.description: "is a self-hosted monitoring tool for uptime and status notifications."
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

- **services**: Defines services to be deployed.
- **uptime-kuma-beta_db**: The service for the MariaDB database.
  - **deploy: "resources"**: Configuration for managing compute resource usage.
    - **Limits: "memory"**: Caps memory usage at 1 GB.
    - **Reservations: "memory"**: Reserves 1 GB of memory for the container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: uptime-kuma-beta_db**: Names the container
    `uptime-kuma-beta_db`.
  - **image: docker.io/mariadb:latest**: Uses the latest MariaDB image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts directories or files into the container.
    - **/docker/uptime-kuma-beta/production/db:/var/lib/mysql**: Mounts the database
      storage directory.
    - **/docker/uptime-kuma-beta/production/my.cnf:/etc/my.cnf**: Mounts the custom
      MariaDB configuration file.
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**: Mounts
      system memory pressure info for monitoring.
  - **env_file**: Specifies environment files.
    - **.env**: For Docker Compose.
    - **stack.env**: For Portainer.
  - **environment**: Sets environment variables for the database connection.
  - **hostname: uptime-kuma-beta_db**: Sets the container hostname.
  - **networks**: Connects the service to the `uptime-kuma-beta_net` network.
    - **ipv4_address**: Assigns a static IP address to the container.
  - **healthcheck**: Configures the health check for the service.
    - **disable: false**: Enables the health check.
    - **test**: Specifies the health check command (using `healthcheck.sh`).
    - **interval**: Defines the health check interval (10 seconds).
    - **timeout**: Defines the timeout for health checks (5 seconds).
    - **retries**: The number of retries before considering the container
      unhealthy (3 retries).
    - **start_period**: The period after which health check failures are
      considered (10 seconds).
    - **start_interval**: The time between health checks (5 seconds).

<br />

- **uptime-kuma-beta_app**: The service for the Uptime Kuma Beta app.
  - **deploy: "resources"**: Configuration for managing compute resource usage.
    - **Limits: "memory"**: Caps memory usage at 1 GB.
    - **Reservations: "memory"**: Reserves 1 GB of memory for the container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: uptime-kuma-beta**: Names the container
    `uptime-kuma-beta`.
  - **image: ghcr.io/louislam/uptime-kuma:beta**: Uses the specified Uptime Kuma
    Beta image.
  - **depends_on**: Ensures that the database service is healthy before starting
    the app service.
  - **volumes**: Mounts host directories or files into the container.
  - **environment**: Sets environment variables for the Uptime Kuma Beta app.
  - **domainname: status.local**: Customizes the domain name for the container.
  - **ports**: Maps container ports to host ports.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Specifies the command to be run for the health check. In this
      case, it is `["CMD", "extra/healthcheck"]`.
    - **interval**: The time between running health checks (10 seconds).
    - **timeout**: The time a health check is allowed to run before it is
      considered to have failed (5 seconds).
    - **retries**: The number of consecutive failures required before the
      container is considered unhealthy (3 retries).
    - **start_period**: The initial period during which a health check failure
      will not be counted towards the retries (10 seconds).
    - **start_interval**: The time between starting health checks (5 seconds).

<br />

## Environment Variables

This file contains configuration settings that can be used by various
applications (such as Docker containers or your MariaDB server). These values are
stored outside the source code to enhance **security, portability, and flexibility**.

<br />

### Variables in this file

```env
# Database Configuration: ROOT USER
# Change the MariaDB root password to a strong, unique password of your choice.
# Ensure the password is complex and not easily guessable.
ROOT_PASSWORD_DB=StrongUniqueRootPassword1234

# Database Configuration: USER
# Database host and connection settings
HOST_DB=uptime-kuma-beta_db

# Database name:
NAME_DB=uptime_kuma_beta_db

# MariaDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MariaDB connection port (default: 3306)
PORT_DB=3306

# MariaDB username: Change this to your desired username
USER_DB=uptime-kuma
```

- **`ROOT_PASSWORD_DB`**: The root user's password for the MariaDB instance.
  This user has full administrative privileges. Use a secure and unique value.
- **`HOST_DB`**: Hostname or IP address of the database server. In Docker-based
  setups, this usually matches the service name (`uptime-kuma-beta_db`).
- **`NAME_DB`**: The name of the database to be used by the application (e.g., uptime_kuma_beta_db).
- **`PASSWORD_DB`**: The password for the non-root database user (`USER_DB`).
  Ensure this is secure.
- **`PORT_DB`**: The port number MariaDB listens on (default: 3306).
- **`USER_DB`**: The username used to connect to the database.

<br />

## MariaDB/MySQL Configuration

This file configures MariaDB or MySQL behavior, covering server operations,
performance tuning, replication, security, and character encoding.

<br />

### Sections in this file

#### General Server Settings

```cnf
[mysqld]
server-id = 1
datadir = /var/lib/mysql/
pid-file = /var/run/mysqld/mysqld.pid
skip-name-resolve
default-storage-engine = InnoDB
transaction-isolation = REPEATABLE-READ
skip-symbolic-links
```

- **`server-id`**: Unique identifier for the MariaDB instance (used in replication).
- **`datadir`**: Directory path where database files are stored.
- **`pid-file`**: Stores the process ID of the running server.
- **`skip-name-resolve`**: Disables DNS resolution for hostnames—improves performance.
- **`default-storage-engine`**: Sets InnoDB as the default engine (reliable and
  ACID-compliant).
- **`transaction-isolation`**: Defines transaction behavior. `REPEATABLE-READ`
  prevents non-repeatable reads.
- **`skip-symbolic-links`**: Disallows symbolic links in data files for security reasons.

<br />

#### Performance Optimizations

```cnf
innodb-use-native-aio = 0
innodb-buffer-pool-size = 1G
innodb-buffer-pool-size-auto-min = 0
innodb-log-file-size = 1G
innodb-log-buffer-size = 32M
innodb-flush-log-at-trx-commit = 1
innodb-read-io-threads = 8
innodb-write-io-threads = 8
innodb-io-capacity = 6000
innodb-io-capacity-max = 8000
query-cache-type = 0
tmp-table-size = 64M
max-heap-table-size = 64M
max-connections = 200
thread-cache-size = 50
table-definition-cache = 4000
table-open-cache = 4000
aria-pagecache-buffer-size = 128M
```

- **`innodb-buffer-pool-size`**: Memory allocated for caching InnoDB data and indexes.
- **`innodb-buffer-pool-size-auto-min`**: Minimum size for the buffer pool when
  auto-shrinking (0 disables minimum).
- **`innodb-log-file-size`**: Size of each InnoDB redo log file.
- **`innodb-log-buffer-size`**: RAM buffer size for InnoDB logs before flushing to disk.
- **`innodb-flush-log-at-trx-commit`**: Controls transaction durability (1 = safest).
- **`innodb-io-capacity` / `innodb-io-capacity-max`**: Tuning values for I/O performance.
- **`query-cache-type`**: Set to 0 to disable query cache (recommended for InnoDB).
- **`tmp-table-size`** / **`max-heap-table-size`**: Max size for temporary
  in-memory tables.
- **`max-connections`**: Maximum number of simultaneous client connections.
- **`thread-cache-size`**: Cached threads to reduce thread creation overhead.
- **`table-definition-cache` / `table-open-cache`**: Improves performance with
  many tables.
- **`aria-pagecache-buffer-size`**: Buffer size for Aria storage engine (if used).

<br />

#### Security Settings

```cnf
secure-file-priv = /var/lib/mysql/
# plugin-load-add = validate_password.so
# validate-password-policy = STRONG
# validate-password-length = 12
# validate-password-mixed-case-count = 1
# validate-password-number-count = 1
# validate-password-special-char-count = 1
```

- **`secure-file-priv`**: Limits the directories used for file import/export operations.
- **`plugin-load-add`**: Optional—enables the password validation plugin.
- **`validate-password-*`**: Enforces strong password policies when creating
  users. Uncomment to enable.

<br />

#### Binary Logging and Replication

```cnf
log-bin = uptime-kuma-beta_binlog
max-binlog-size = 500M
expire-logs-days = 7
binlog-checksum = CRC32
binlog-format = ROW
log-bin-compress = 1
encrypt-binlog = 0
relay-log-purge = 1
relay-log-recovery = 1
slave_connections_needed_for_purge = 0
```

- **`log-bin`**: Enables binary logging for replication and recovery.
- **`max-binlog-size`**: Maximum size for individual binary log files.
- **`expire-logs-days`**: Days before old binary logs are purged.
- **`binlog-format`**: Set to `ROW` for row-based replication (most accurate).
- **`log-bin-compress`**: Compresses binary logs to save space.
- **`encrypt-binlog`**: Encrypts binary logs (disabled here).
- **`relay-log-purge`** / **`relay-log-recovery`**: Helps maintain a clean and
  recoverable replica.
- **`slave_connections_needed_for_purge`**: Controls purge dependency on
  replication status.

<br />

#### Character Set and Encoding

```cnf
character-set-server = utf8mb4
collation-server = utf8mb4_general_ci
init-connect = 'SET NAMES utf8mb4'
```

- **`character-set-server` / `collation-server`**: Defines UTF-8 as the default
  character set and collation.
- **`init-connect`**: Ensures clients use the same character set on connection.

<br />

#### Monitoring and Debugging

```cnf
performance-schema = 1
performance-schema-consumer-events-statements-history = 1
performance-schema-consumer-events-transactions-history = 1
performance-schema-consumer-events-waits-history = 1
innodb-status-output = 0
innodb-status-output-locks = 0
general-log = 0
```

- **`performance-schema`**: Enables the collection of performance data.
- **`*-history` options**: Enables tracking of query, transaction, and wait histories.
- **`innodb-status-output` / `innodb-status-output-locks`**: Output InnoDB
  monitoring info to logs (disabled here).
- **`general-log`**: Logs every query—disabled by default for performance.

<br />

#### Temporary Files

```cnf
# tmpdir = /tmp
```

- **`tmpdir`**: Directory for storing temporary files. Uncomment and customize
  for specific storage needs.

<br />

#### SSL/TLS Security

```cnf
# ssl-ca = /etc/mysql/ssl/ca-cert.pem
# ssl-cert = /etc/mysql/ssl/server-cert.pem
# ssl-key = /etc/mysql/ssl/server-key.pem
# require-secure-transport = 1
```

- **SSL/TLS settings**: Optional configuration for encrypted client-server
  communication. Uncomment and configure as needed.

<br />

#### Inclusion of Additional Configuration Files

```cnf
!includedir /etc/mysql/conf.d/
!includedir /etc/mysql/mariadb.conf.d/
```

- **`!includedir`**: Includes additional configuration files from specified
  directories, allowing modular config management.

<br />

## Conclusion

This `docker-compose.yml` file sets up a Docker environment for Uptime Kuma
Beta, a self-hosted monitoring tool. The configuration defines a custom bridge
network with specific IP settings, a MariaDB database service, and the Uptime Kuma
Beta application. This setup ensures that both services run efficiently and
securely, with proper health checks, logging, and restart policies.

[docker-compose.yml]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma-beta/docker-compose.yml
[.env]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma-beta/.env
[stack.env]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma-beta/stack.env
[my.cnf]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma-beta/my.cnf
