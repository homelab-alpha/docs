---
title: "freshrss.info"
description:
  "Deploy FreshRSS, a self-hostable RSS feed aggregator, using Docker Compose.
  This setup includes custom Docker network settings and configurations for
  FreshRSS and its MariaDB database, ensuring reliable operation and data
  management."
url: "docker/compose-info/freshrss"
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
  - FreshRSS
  - Docker Compose
  - RSS Feed
  - Self-hosted
  - MariaDB
keywords:
  - Docker FreshRSS setup
  - Docker Compose FreshRSS configuration
  - FreshRSS Docker persistent storage
  - Self-hosted RSS aggregator Docker
  - Docker MariaDB setup for FreshRSS

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
deploying FreshRSS, a self-hostable RSS feed aggregator, along with its MariaDB
database for data management.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 12, 2025
- **Description**: Configures a Docker network and services for FreshRSS and its
  MariaDB database.
- **RAW Compose File**: [docker-compose.yml]
- **RAW .env File**: [.env]
- **RAW stack.env File**: [stack.env]
- **RAW my.cnf File**: [my.cnf]

<br />

## Networks Configuration

```yaml
networks:
  freshrss_net:
    attachable: false
    internal: false
    external: false
    name: freshrss
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.6.0/24
          ip_range: 172.20.6.0/24
          gateway: 172.20.6.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "freshrss"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.freshrss.network.description: "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `freshrss_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: freshrss**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "freshrss"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.freshrss.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  freshrss_db:
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
    container_name: freshrss_db
    image: mariadb:latest
    pull_policy: if_not_present
    volumes:
      - /docker/freshrss/production/db:/var/lib/mysql
      - /docker/freshrss/production/my.cnf:/etc/my.cnf
      - /sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure
    env_file:
      # Choose the correct environment file:
      # - Use '.env' for Docker Compose.
      # - Use 'stack.env' for Portainer.
      # Comment out the file you are not using in the Compose file to avoid issues
      - .env
      - stack.env
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
      MYSQL_ROOT_PASSWORD: ${ROOT_PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      MYSQL_DATABASE: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MYSQL_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      MYSQL_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
    hostname: freshrss_db
    networks:
      freshrss_net:
        ipv4_address: 172.20.6.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.freshrss.db.description: "is a MySQL database."
    healthcheck:
      disable: false
      test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s

  freshrss_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: freshrss
    image: freshrss/freshrss:latest
    pull_policy: if_not_present
    depends_on:
      freshrss_db:
        condition: service_healthy
    links:
      - freshrss_db
    volumes:
      - /docker/freshrss/production/app/data:/var/www/FreshRSS/data
      - /docker/freshrss/extensions:/var/www/FreshRSS/extensions
    env_file:
      # Choose the correct environment file:
      # - Use '.env' for Docker Compose.
      # - Use 'stack.env' for Portainer.
      # Comment out the file you are not using in the Compose file to avoid issues
      - .env
      - stack.env
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
      CRON_MIN: "*/10"
      MYSQL_HOST: ${HOST_DB} # Fill in the value in both the .env and stack.env files
      MYSQL_PORT: ${PORT_DB} # Fill in the value in both the .env and stack.env files
      MYSQL_NAME: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MYSQL_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      MYSQL_PASSWORD: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
    domainname: freshrss.local
    hostname: freshrss
    networks:
      freshrss_net:
        ipv4_address: 172.20.6.3
    ports:
      - "3002:80/tcp" # HTTP
      - "3002:80/udp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "freshrss"
      com.freshrss.description: "is a free, self-hostable feeds aggregator."
    healthcheck:
      disable: false
      test: php -r "readfile('http://localhost/i/');" | grep -q 'jsonVars' || exit 1
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

<br />

- **services**: Defines services to be deployed.
- **freshrss_db**: The service name for the MariaDB container.
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
  - **container_name: freshrss_db**: Names the container "freshrss_db".
  - **image: mariadb:latest**: Uses the latest MariaDB image from Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts directories or files into the container.
    - **/docker/freshrss/production/db:/var/lib/mysql**: Mounts the database
      storage directory.
    - **/docker/freshrss/production/my.cnf:/etc/my.cnf**: Mounts the custom
      MariaDB configuration file.
    - **/sys/fs/cgroup/memory.pressure:/sys/fs/cgroup/memory.pressure**: Mounts
      system memory pressure info for monitoring.
  - **env_file**: Specifies environment files.
    - **.env**: For Docker Compose.
    - **stack.env**: For Portainer.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **MYSQL_ROOT_PASSWORD**: Sets the MySQL root password.
    - **MYSQL_DATABASE**: Sets the database name.
    - **MYSQL_USER**: Sets the MySQL user.
    - **MYSQL_PASSWORD**: Sets the MySQL user password.
  - **hostname: freshrss_db**: Sets the hostname for the container.
  - **networks**: Connects the service to the `freshrss_net` network.
    - **ipv4_address: 172.20.6.2**: Assigns a static IP address to the
      container.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.freshrss.db.description**: Description label for the MariaDB
      container.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables the health check.
    - **test: ["CMD", "healthcheck.sh", "--connect", "--innodb_initialized"]**:
      Defines the health check command.

<br />

- **freshrss_app**: The service name for the FreshRSS container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: freshrss**: Names the container "freshrss".
  - **image: freshrss/freshrss:latest**: Uses the latest FreshRSS image from
    Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **depends_on**: Specifies dependencies for this service.
    - **freshrss_db**: Waits for the database service to be healthy.
  - **links**: Links to the database container.
    - **freshrss_db**: Links to the `freshrss_db` container.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/freshrss/production/app/data:/var/www/FreshRSS/data**: Mounts
      the FreshRSS data directory.
    - **/docker/freshrss/extensions:/var/www/FreshRSS/extensions**: Mounts the
      FreshRSS extensions directory.
  - **env_file**: Specifies environment files.
    - **.env**: For Docker Compose.
    - **stack.env**: For Portainer.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **CRON_MIN: "\*/10"**: Sets the cron job interval.
    - **MYSQL_HOST**: The database host.
    - **MYSQL_PORT**: The database port.
    - **MYSQL_NAME**: The database name.
    - **MYSQL_USER**: The database user.
    - **MYSQL_PASSWORD**: The database user password.
  - **domainname: freshrss.local**: Sets the domain name for the container.
  - **hostname: freshrss**: Sets the hostname for the container.
  - **networks**: Connects the service to the `freshrss_net` network.
    - **ipv4_address: 172.20.6.3**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **3002:80/tcp**: Maps the HTTP port (TCP).
    - **3002:80/udp**: Maps the HTTP port (UDP).
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "freshrss"**: Project label.
    - **com.freshrss.description**: Description label for FreshRSS.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Specifies the command to be run for the health check. In this
      case, it is `php -r "readfile('http://localhost/i/');" | grep -q 'jsonVars' || exit 1`.
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
applications (such as Docker containers or your MySQL server). The values are
variables stored outside the source code for security purposes.

<br />

### Variables in this file

```env
# Database Configuration: ROOT USER
# Change the MySQL root password to a strong, unique password of your choice.
# Ensure the password is complex and not easily guessable.
ROOT_PASSWORD_DB=StrongUniqueRootPassword1234

# Database Configuration: USER
# Database host and connection settings
HOST_DB=freshrss_db

# Database name:
NAME_DB=freshrss_db

# MySQL user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MySQL connection port (default: 3306)
PORT_DB=3306

# MySQL username: Change this to your desired username
USER_DB=freshrss
```

- **`ROOT_PASSWORD_DB`**: The password for the root user of the MySQL database.
  This account has full access to all databases. Make sure this password is
  strong, unique, and complex to prevent unauthorized access.
- **HOST_DB**: The name or IP address of the host where the database is running.
  In this example, it's `freshrss_db`, which may refer to the name of a database
  container or network within Docker.
- **NAME_DB**: The name of the database being used. Here, it's `freshrss_db`,
  indicating this is for an application like FreshRSS.
- **PASSWORD_DB**: The password for the `freshrss` user. Ensure this password is
  strong and unique, as it grants access to the database.
- **PORT_DB**: The port MySQL is listening on. The default is `3306` unless
  configured differently.
- **USER_DB**: The username for accessing the database. In this case, the user
  is `freshrss`.

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
log-bin = freshrss_binlog
max-binlog-size = 500M
expire-logs-days = 7
binlog-format = ROW
```

- **log-bin**: Enables binary logging, which is needed for replication and
  point-in-time recovery. The log will be stored as `freshrss_binlog`.
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

This `docker-compose` file sets up a Docker environment for FreshRSS and its
MariaDB database. The configuration defines a custom bridge network with
specific IP settings and security configurations. The MariaDB service is
configured to run continuously, with persistent storage for database data. The
FreshRSS service depends on the MariaDB service and is configured to run with
persistent storage for its data and extensions. Both services are configured
with appropriate logging and restart policies, ensuring they run efficiently and
securely.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/freshrss/docker-compose.yml
[.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/freshrss/.env
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/freshrss/stack.env
[my.cnf]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/freshrss/my.cnf
