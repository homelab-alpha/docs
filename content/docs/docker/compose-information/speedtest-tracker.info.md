---
title: "speedtest-tracker.info"
description:
  "Deploy and manage Speedtest Tracker using Docker Compose. A self-hosted
  application that monitors your internet speed and uptime, backed by a MariaDB
  database for persistent data storage."
url: "docker/compose-info/speedtest-tracker"
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
  - Docker Compose
  - Speedtest Tracker
  - Internet Monitoring
  - Self-Hosted
  - MariaDB
  - Network Performance
keywords:
  - speedtest tracker
  - internet speed monitoring
  - self-hosted internet monitor
  - docker compose setup
  - mariadb docker
  - network performance monitoring
  - uptime monitoring

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
deploying Speedtest Tracker, a self-hostable internet performance monitoring
application, along with its MariaDB database.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 18, 2025
- **Description**: Docker Compose setup for Speedtest Tracker with MariaDB for
  self-hosted internet speed and uptime monitoring.
- **RAW Compose File**: [docker-compose.yml]
- **RAW .env File**: [.env]
- **RAW stack.env File**: [stack.env]
- **RAW my.cnf File**: [my.cnf]

<br />

## Networks Configuration

```yaml
---
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
        - subnet: 172.20.23.0/24
          ip_range: 172.20.23.0/24
          gateway: 172.20.23.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "speed-tracker"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.speedtest-tracker.network.description: "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `speedtest-tracker_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: speedtest-tracker**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "speed-tracker"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.freshrss.network.description**: A description label for the network.

<br />

## Services Configuration

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
    image: docker.io/mariadb:latest
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
        ipv4_address: 172.20.23.2
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

  speedtest-tracker_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: speedtest-tracker
    image: linuxserver/speedtest-tracker:latest
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
      MARIADB_HOST: ${HOST_DB}
      MARIADB_PORT: ${PORT_DB}
      MARIADB_NAME: ${NAME_DB}
      MARIADB_USER: ${USER_DB}
      MARIADB_PASSWORD: ${PASSWORD_DB}
      APP_NAME: speedtest-tracker
      APP_KEY: ${APP_KEY}
      ADMIN_NAME: ${ADMIN_NAME}
      ADMIN_EMAIL: ${ADMIN_EMAIL}
      ADMIN_PASSWORD: ${ADMIN_PASSWORD}
      # ALLOWED_IPS: ""
      # APP_URL: https://speedtest-tracker.local
      # ASSET_URL: https://speedtest-tracker.local
      APP_TIMEZONE: Europe/Amsterdam
      CHART_BEGIN_AT_ZERO: "true"
      CHART_DATETIME_FORMAT: "m/j G:i"
      DATETIME_FORMAT: "M j, Y G:i:s"
      DISPLAY_TIMEZONE: "Europe/Amsterdam"
      # CONTENT_WIDTH: "7x1"
      PUBLIC_DASHBOARD: "true"
      # SPEEDTEST_SKIP_IPS: ""
      SPEEDTEST_SCHEDULE: "*/10 * * * *"
      # SPEEDTEST_SERVERS: ""
      # SPEEDTEST_BLOCKED_SERVERS: ""
      # SPEEDTEST_INTERFACE: ""
      # SPEEDTEST_CHECKINTERNET_URL: ""
      THRESHOLD_ENABLED: "true"
      THRESHOLD_DOWNLOAD: "900"
      THRESHOLD_UPLOAD: "900"
      THRESHOLD_PING: "25"
      PRUNE_RESULTS_OLDER_THAN: "31"
      API_RATE_LIMIT: "30"
    domainname: speedtest-tracker.local
    hostname: speedtest-tracker
    networks:
      speedtest-tracker_net:
        ipv4_address: 172.20.23.3
    ports:
      - "3013:80/tcp"
      - "3013:80/upd"
      - "3013:443/tcp"
      - "3013:443/udp"
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "speedtest-tracker"
      com.speedtest-tracker.description: "a self-hosted application that monitors the performance and uptime of your internet connection."
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

- **services**: Defines services to be deployed.
- **speedtest-tracker_db**: The service name for the MariaDB container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **options**:
      - **max-size: "1M"**: Limits log file size to 1MB.
      - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: speedtest-tracker_db**: Names the container "speedtest-tracker_db".
  - **image: docker.io/mariadb:latest**: Uses the latest MariaDB image.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts directories or files into the container.
    - **/docker/speedtest-tracker/production/db:/var/lib/mysql**: Mounts the database
      storage directory.
    - **/docker/speedtest-tracker/production/my.cnf:/etc/my.cnf**: Mounts the custom
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
    - **MARIADB_ROOT_PASSWORD**: Sets the MariaDB root password.
    - **MARIADB_DATABASE**: Sets the database name.
    - **MARIADB_USER**: Sets the MariaDB user.
    - **MARIADB_PASSWORD**: Sets the MariaDB user password.
  - **hostname: speedtest-tracker_db**: Sets the hostname for the container.
  - **networks**: Connects the service to the `speedtest-tracker_net` network.
    - **ipv4_address: 172.20.23.2**: Assigns a static IP address to the
      container.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.speedtest-tracker.db.description**: Description label for the MariaDB
      container.
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

- **speedtest-tracker_app**: The service name for the Speedtest Tracker container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: speedtest-tracker**: Names the container "speedtest-tracker".
  - **image: linuxserver/speedtest-tracker:latest**: Uses the latest Speedtest Tracker image from linuxserver.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **depends_on**: Specifies dependencies for this service.
    - **speedtest-tracker_db**: Waits for the database service to be healthy.
  - **links**: Links to the database container.
    - **speedtest-tracker_db**: Links to the `speedtest-tracker_db` container.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/speedtest-tracker/production/.cert:/config/keys**: Mounts the
      TLS certificate keys.
    - **/docker/speedtest-tracker/production/app:/config**: Mounts the main
      application configuration directory.
  - **env_file**: Specifies environment files.
    - **.env**: For Docker Compose.
    - **stack.env**: For Portainer.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **MARIADB_HOST**: The database host.
    - **MARIADB_PORT**: The database port.
    - **MARIADB_NAME**: The database name.
    - **MARIADB_USER**: The database user.
    - **MARIADB_PASSWORD**: The database user password.
    - **APP_NAME: speedtest-tracker**: The application name.
    - **APP_KEY**: Application encryption key.
    - **ADMIN_NAME**: Name of the admin user.
    - **ADMIN_EMAIL**: Admin user's email address.
    - **ADMIN_PASSWORD**: Admin user's password.
    - **APP_TIMEZONE: Europe/Amsterdam**: Timezone for the application.
    - **CHART_BEGIN_AT_ZERO: "true"**: Charts start from zero.
    - **CHART_DATETIME_FORMAT: "m/j G:i"**: Format for chart date and time.
    - **DATETIME_FORMAT: "M j, Y G:i:s"**: Format for general date and time.
    - **DISPLAY_TIMEZONE: "Europe/Amsterdam"**: Display timezone setting.
    - **PUBLIC_DASHBOARD: "true"**: Enables public access to the dashboard.
    - **SPEEDTEST_SCHEDULE: "\*/10 \* \* \*"**: Runs speed tests every 10 minutes.
    - **THRESHOLD_ENABLED: "true"**: Enables speed thresholds.
    - **THRESHOLD_DOWNLOAD: "900"**: Download threshold in Mbps.
    - **THRESHOLD_UPLOAD: "900"**: Upload threshold in Mbps.
    - **THRESHOLD_PING: "25"**: Ping threshold in milliseconds.
    - **PRUNE_RESULTS_OLDER_THAN: "31"**: Prune results older than 31 days.
    - **API_RATE_LIMIT: "30"**: API rate limit (requests per minute).
  - **domainname: speedtest-tracker.local**: Sets the domain name for the container.
  - **hostname: speedtest-tracker**: Sets the hostname for the container.
  - **networks**: Connects the service to the `speedtest-tracker_net` network.
    - **ipv4_address: 172.20.23.3**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **3013:80/tcp**: Maps HTTP port (TCP).
    - **3013:80/upd**: Maps HTTP port (UDP).
    - **3013:443/tcp**: Maps HTTPS port (TCP).
    - **3013:443/udp**: Maps HTTPS port (UDP).
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "speedtest-tracker"**: Project label.
    - **com.speedtest-tracker.description**: Description label for Speedtest Tracker.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Specifies the command to be run for the health check. In this
      case, it uses `curl` to call the app's healthcheck API.
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
HOST_DB=speedtest-tracker_db

# Database name: Change this to your desired database name
NAME_DB=speedtest-tracker_db

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

- **`ROOT_PASSWORD_DB`**: The root user's password for the MariaDB instance.
  This user has full administrative privileges. Use a strong, unique, and
  complex password that is not easily guessable.
- **`HOST_DB`**: Hostname of the database server. In Docker environments, this
  typically matches the database service name (`speedtest-tracker_db`).
- **`NAME_DB`**: The name of the MariaDB database to be created and used by
  Speedtest Tracker. You may customize this name as desired.
- **`PASSWORD_DB`**: The password associated with the non-root database user
  (`USER_DB`). It should be strong and unique for production use.
- **`PORT_DB`**: The database port used for the MariaDB connection. The default
  is `3306`, but you may change this if needed.
- **`USER_DB`**: The name of the non-root MariaDB user used by the application
  to authenticate with the database.
- **`APP_KEY`**: A secure key used for application encryption. Generate this
  using the command `echo -n 'base64:'; openssl rand -base64 32`. Do not share
  this key publicly.
- **`ADMIN_EMAIL`**: The email address of the admin user for Speedtest Tracker.
  This is used for logging into the dashboard. Choose a valid and secure address.
- **`ADMIN_NAME`**: The display name for the admin user. Choose a name that is
  not generic in production environments.
- **`ADMIN_PASSWORD`**: The login password for the admin user. This should be a
  strong and secure password that is not reused across other services.

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
log-bin = speedtest-tracker_binlog
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

This `docker-compose` file sets up a Docker environment for Speedtest Tracker and
its MariaDB database. The configuration defines a custom bridge network with
specific IP settings and security configurations. The MariaDB service is
expected to be healthy before the Speedtest Tracker service starts. The
Speedtest Tracker service is configured to run with persistent storage for its
configuration and certificates. It includes detailed environment variables for
customizing application behavior, scheduling speed tests, setting thresholds,
and enabling a public dashboard. Both services are configured with appropriate
logging, health checks, and restart policies, ensuring they operate efficiently,
reliably, and securely.

[docker-compose.yml]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/speedtest-tracker/docker-compose.yml
[.env]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/speedtest-tracker/.env
[stack.env]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/speedtest-tracker/stack.env
[my.cnf]: https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/speedtest-tracker/my.cnf
