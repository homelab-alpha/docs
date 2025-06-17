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
- **Date**: Jun 17, 2025
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
      com.uptime-kuma-beta.description:
        "is a self-hosted monitoring tool for uptime and status notifications."
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
  - **healthcheck**: Health check configuration for the database service.

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
  - **healthcheck**: Health check configuration for the app service.

<br />

## Environment Variables

This file contains configuration settings that can be used by various
applications (such as Docker containers or your MariaDB server). The values are
variables stored outside the source code for security purposes.

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

- **`ROOT_PASSWORD_DB`**: The password for the root user of the MariaDB database.
  This account has full access to all databases. Make sure this password is
  strong, unique, and complex to prevent unauthorized access.
- **HOST_DB**: The name or IP address of the host where the database is running.
  In this case, it’s `uptime-kuma-beta_db`, which could refer to the name of a
  database container or network in a Docker setup for the Uptime Kuma
  application.
- **NAME_DB**: The name of the database being used. Here, it’s
  `uptime_kuma_beta_db`, likely related to the Uptime Kuma application.
- **PASSWORD_DB**: The password for the `uptime-kuma` user. As with the root
  password, it’s important to use a strong and unique password here to secure
  the database.
- **PORT_DB**: The port MariaDB is listening on. The default port is `3306` unless
  configured differently.
- **USER_DB**: The username for accessing the database. In this case, the user
  is `uptime-kuma`.

## MariaDB/MySQL Configuration

This file contains configuration settings for the MariaDB/MySQL server. It
determines how the database behaves, such as connection settings, performance,
and security.

<br />

### Sections in this file

```cnf
[mysqld]
# ============================================
# General Server Settings
# ============================================
server-id = 1
datadir = /var/lib/mysql/
pid-file = /var/run/mysqld/mysqld.pid
skip-name-resolve
default-storage-engine = InnoDB
transaction-isolation = REPEATABLE-READ
skip-symbolic-links
```

- **server-id**: This is a unique ID for the server, important if you want to
  set up replication with MariaDB/MySQL. It’s set to `1` here.
- **datadir**: The directory where the database files are stored on disk.
- **pid-file**: This file holds the process ID of the running MySQL server.
- **skip-name-resolve**: This prevents DNS resolution for client connections,
  improving connection speed.
- **default-storage-engine**: The default storage engine for new tables, set to
  `InnoDB`, which is ACID-compliant (Atomicity, Consistency, Isolation,
  Durability).
- **transaction-isolation**: The isolation level for transactions, set to
  `REPEATABLE-READ` (a common default in MySQL).
- **skip-symbolic-links**: Prevents the use of symbolic links, enhancing data
  security.

<br />

```cnf
# ============================================
# Performance Optimizations
# ============================================
innodb-buffer-pool-size = 1G
innodb-buffer-pool-size-auto-min = 0
innodb-log-file-size = 1G
innodb-log-buffer-size = 32M
innodb-flush-log-at-trx-commit = 1
innodb-read-io-threads = 8
innodb-write-io-threads = 8
```

- **innodb-buffer-pool-size**: The amount of memory allocated to cache data in
  the InnoDB storage engine. This should be a significant portion of your total
  RAM (here, it's set to 1GB).
- **innodb-buffer-pool-size-auto-min**: Minimum InnoDB buffer pool size when
  auto-shrinking under memory pressure. Shrinks pool halfway between current
  size and this value. 0 = no minimum.
- **innodb-log-file-size**: The size of the InnoDB redo log files. Larger log
  files can improve performance for write-heavy workloads.
- **innodb-log-buffer-size**: The size of the memory buffer for the InnoDB log
  files. Larger buffers reduce disk I/O.
- **innodb-flush-log-at-trx-commit**: Ensures that logs are written to disk with
  each transaction commit, providing ACID guarantees, though it can impact
  performance.
- **innodb-read-io-threads and innodb-write-io-threads**: The number of threads
  InnoDB uses for read and write operations. These can improve performance for
  high I/O workloads.

<br />

```cnf
# ============================================
# Binary Logging and Replication
# ============================================
log-bin = uptime-kuma-beta_binlog
max-binlog-size = 500M
expire-logs-days = 7
binlog-format = ROW
```

- **log-bin**: Enables binary logging, which is needed for replication and
  point-in-time recovery. The log will be stored as `uptime-kuma-beta_binlog`.
- **max-binlog-size**: The maximum size for each binary log file. A new log file
  is created when this limit is reached (500MB in this case).
- **expire-logs-days**: The number of days after which binary logs will be
  automatically purged. Here, it’s set to 7 days to save disk space.
- **binlog-format**: The format for binary logging, set to `ROW`, which ensures
  data consistency for replication.

<br />

```cnf
# ============================================
# Character Set and Encoding
# ============================================
character-set-server = utf8mb4
collation-server = utf8mb4_general_ci
```

- **character-set-server** and **collation-server**: These settings ensure that
  the database uses UTF-8 encoding by default, which is important for
  international support. `utf8mb4` supports a wider range of characters than the
  older `utf8` encoding.

<br />

```cnf
# ============================================
# SSL/TLS Security
# ============================================
# ssl-ca = /etc/mysql/ssl/ca-cert.pem
# ssl-cert = /etc/mysql/ssl/server-cert.pem
# ssl-key = /etc/mysql/ssl/server-key.pem
# require-secure-transport = 1
```

- **SSL/TLS settings**: These settings enable SSL certificates for encrypted
  connections. It's disabled (commented out), but can be configured for added
  security.

<br />

## Conclusion

This `docker-compose.yml` file sets up a Docker environment for Uptime Kuma
Beta, a self-hosted monitoring tool. The configuration defines a custom bridge
network with specific IP settings, a MariaDB database service, and the Uptime Kuma
Beta application. This setup ensures that both services run efficiently and
securely, with proper health checks, logging, and restart policies.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma-beta/docker-compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma-beta/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma-beta/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/uptime-kuma-beta/my.cnf
