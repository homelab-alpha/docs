---
title: "mariadb.info"
description:
  "Deploy a MariaDB instance with Docker Compose, detailing network
  configurations, service settings, and security measures for optimal operation."
url: "docker/compose-info/mariadb"
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
  - MariaDB
  - Docker Compose
  - Container Management
  - Infrastructure Management
keywords:
  - Docker
  - MariaDB
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Database
  - Infrastructure Monitoring
  - Self-hosted Docker Management

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let’s break down what this `docker-compose.yml` file does in detail. This file
is used to configure and deploy a MariaDB instance using Docker Compose,
ensuring efficient database management and secure operations. It includes
network settings, environment variables for configuration, and health checks to
maintain the system's stability.

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 16, 2025
- **Description**: Configures a custom network and a MariaDB service using
  Docker Compose.
- **RAW Compose File**: [docker-compose.yml]
- **RAW .env File**: [.env]
- **RAW stack.env File**: [stack.env]
- **RAW my.cnf File**: [my.cnf]

<br />

## Networks Configuration

```yaml
networks:
  mariadb_net:
    attachable: false
    internal: false
    external: false
    name: mariadb
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.16.0/24
          ip_range: 172.20.16.0/24
          gateway: 172.20.16.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "mariadb"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.mariadb.network.description: "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `mariadb_net`.
- **attachable**: Set to `false`, preventing other containers from attaching to
  this network.
- **internal**: Set to `false`, allowing external access.
- **external**: Set to `false`, meaning the network is not externally defined.
- **name**: Specifies the network name as `mariadb`.
- **driver**: Uses the `bridge` driver to create an isolated network.
- **ipam**: Configures IP address management for the network.
  - **driver**: Default IPAM driver is used.
  - **config**: Defines the network's IP configuration.
    - **subnet**: Sets the network subnet to `172.20.16.0/24`.
    - **ip_range**: Restricts the IP range to `172.20.16.0/24`.
    - **gateway**: Defines the gateway for the network as `172.20.16.1`.
- **driver_opts**: Additional driver options.
  - **com.docker.network.bridge.default_bridge: "false"**: Ensures this is not
    the default Docker bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows IP
    masquerading for outbound traffic.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds to all
    available host IP addresses.
  - **com.docker.network.bridge.name: "mariadb"**: Names the bridge network
    `mariadb`.
  - **com.docker.network.driver.mtu: "1500"**: Sets the MTU (Maximum
    Transmission Unit) for the network.
- **labels**: Metadata describing the network.
  - **com.mariadb.network.description**: Describes the network as an isolated
    bridge network.

<br />

## Services Configuration

```yaml
services:
  mariadb_db:
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
    container_name: mariadb_db
    image: docker.io/mariadb:latest
    pull_policy: if_not_present
    volumes:
      - /docker/mariadb/production/db:/var/lib/mysql
      - /docker/mariadb/production/my.cnf:/etc/my.cnf
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
      MARIADB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB}
      MARIADB_DATABASE: ${NAME_DB}
      MARIADB_USER: ${USER_DB}
      MARIADB_PASSWORD: ${PASSWORD_DB}
    hostname: mariadb_db
    networks:
      mariadb_net:
        ipv4_address: 172.20.16.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.mariadb.db.description: "is a MariaDB database."
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
- **mariadb_db**: The service name for the MariaDB container.
  - **deploy: "resources"**: Configuration for managing compute resource usage.
    - **Limits: "memory"**: Caps memory usage at 1 GB.
    - **Reservations: "memory"**: Reserves 1 GB of memory for the container.
  - **restart: unless-stopped**: The container will restart unless explicitly
    stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses the JSON file logging driver.
    - **max-size: "1M"**: Limits log files to a maximum size of 1MB.
    - **max-file: "2"**: Retains a maximum of 2 log files.
  - **stop_grace_period: 1m**: Allows a grace period of 1 minute for the
    container to stop.
  - **container_name: mariadb_db**: Names the container `mariadb_db`.
  - **image: docker.io/mariadb:latest**: Uses the latest MariaDB image.
  - **pull_policy: if_not_present**: Pulls the image only if it is not already
    present locally.
  - **volumes**: Mounts directories or files into the container.
    - **/docker/mariadb/production/db:/var/lib/mysql**: Mounts the database
      storage directory.
    - **/docker/mariadb/production/my.cnf:/etc/my.cnf**: Mounts the custom
      MariaDB configuration file.
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**: Mounts
      system memory pressure info for monitoring.
  - **env_file**: Specifies environment files.
    - **.env**: For Docker Compose.
    - **stack.env**: For Portainer.
  - **environment**: Configures environment variables for the MariaDB instance.
    - **PUID**: Sets the user ID for the container.
    - **PGID**: Sets the group ID for the container.
    - **TZ**: Configures the timezone, which should be updated to match your
      local timezone.
    - **MARIADB_ROOT_PASSWORD**: Defines the MariaDB root password (using a
      variable from the `.env` file).
    - **MARIADB_DATABASE**: Defines the default database name (from the `.env`
      file).
    - **MARIADB_USER**: Defines the database user (from the `.env` file).
    - **MARIADB_PASSWORD**: Defines the database user's password (from the `.env`
      file).
  - **hostname: mariadb_db**: Configures the container's hostname as
    `mariadb_db`.
  - **networks**: Connects the service to the `mariadb_net` network with a
    static IP address of `172.20.16.2`.
  - **security_opt**: Adds security options to the container.
    - **no-new-privileges:true**: Ensures that the container cannot gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.mariadb.db.description**: Describes the service as a MariaDB database.
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
HOST_DB=mariadb_db

# Database name: Change this to your desired database name
NAME_DB=mariadb_db

# MariaDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MariaDB connection port (default: 3306)
PORT_DB=3306

# MariaDB username: Change this to your desired username
USER_DB=mariadb
```

- **`ROOT_PASSWORD_DB`**: The password for the root user of the MariaDB database.
  This account has full access to all databases. Make sure this password is
  strong, unique, and complex to prevent unauthorized access.
- **HOST_DB**: The name or IP address of the host where the database is running.
  In this case, it’s `mariadb_db`, which could refer to the name of a database
  container or network, possibly for a MariaDB service.
- **NAME_DB**: The name of the database being used. Here, it's `mariadb_db`,
  which is probably the database related to a MariaDB instance.
- **PASSWORD_DB**: The password for the `mariadb` user. As with the root
  password, make sure this password is strong and unique to secure access to the
  database.
- **PORT_DB**: The port MariaDB is listening on. The default port is `3306` unless
  configured otherwise.
- **USER_DB**: The username for accessing the database. In this case, it’s
  `mariadb`.

<br />

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
innodb-buffer-pool-size-auto-min = 0
innodb-log-file-size = 1G
innodb-log-buffer-size = 32M
innodb-flush-log-at-trx-commit = 1
innodb-read-io-threads = 8
innodb-write-io-threads = 8
```

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
log-bin = mariadb_binlog
max-binlog-size = 500M
expire-logs-days = 7
binlog-format = ROW
```

- **log-bin**: Enables binary logging, which is needed for replication and
  point-in-time recovery. The log will be stored as `mariadb_binlog`.
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

This `docker-compose.yml` file sets up a MariaDB instance, defining a custom
network for isolation and secure communication. The MariaDB container is
configured with persistent storage, environment variables for database
credentials, and health check configurations to ensure its availability. The
setup ensures secure and efficient database management with proper logging and
restart policies.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/mariadb/docker-compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/mariadb/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/mariadb/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/mariadb/my.cnf
