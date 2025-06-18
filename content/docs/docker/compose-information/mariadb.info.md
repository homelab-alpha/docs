---
title: "mariadb.info"
description: "Deploy a MariaDB instance with Docker Compose, detailing network
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
- **Date**: Jun 18, 2025
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

- **`ROOT_PASSWORD_DB`**: The root user's password for the MariaDB instance.
  This user has full administrative privileges. Use a secure and unique value.
- **`HOST_DB`**: Hostname or IP address of the database server. In Docker-based
  setups, this usually matches the service name (`mariadb_db`).
- **`NAME_DB`**: The name of the database to be used by the application (e.g., mariadb_db).
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
log-bin = mariadb_binlog
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

This `docker-compose.yml` file sets up a MariaDB instance, defining a custom
network for isolation and secure communication. The MariaDB container is
configured with persistent storage, environment variables for database
credentials, and health check configurations to ensure its availability. The
setup ensures secure and efficient database management with proper logging and
restart policies.

[docker-compose.yml]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/mariadb/docker-compose.yml
[.env]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/mariadb/.env
[stack.env]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/mariadb/stack.env
[my.cnf]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/mariadb/my.cnf
