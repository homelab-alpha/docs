---
title: "unifi-network-application.info"
description:
  "Deploy the UniFi Network Application, a network management tool, with a
  MongoDB database using Docker Compose. It covers the custom Docker network,
  the database and application services, the environment file, and the MongoDB
  init script."
url: "docker/compose-info/unifi-network-application"
aliases:
  - "docker/compose-info/unifi-controller"
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
  - UniFi Network Application
  - MongoDB
  - Docker Compose
  - Network Management
  - Docker Networking
keywords:
  - Docker UniFi Network Application setup
  - Docker Compose UniFi configuration
  - UniFi Network Application Docker persistent storage
  - Network management Docker container
  - Docker network configuration
  - MongoDB init script

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
is used to deploy the UniFi Network Application (formerly the UniFi Controller),
a network management tool, together with a MongoDB database. The application
starts only after the database is healthy.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: October 28, 2026
- **Description**: Configures a Docker network, a MongoDB database service, and
  a UniFi Network Application service.
- **RAW Compose File**: [docker-compose.yml]
- **RAW Environment File**: [stack.env]
- **RAW MongoDB Init Script**: [init-mongo.sh]

<br />

## Networks Configuration

```yaml
networks:
  unifi-network-application_net:
    attachable: false
    internal: false
    external: false
    name: unifi-network-application
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.19.0/24
          ip_range: 172.20.19.0/24
          gateway: 172.20.19.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "unifi"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.unifi-network-application.network.description:
        "is an isolated bridge network."
```

<br />

- **networks**: Defines a custom network named `unifi-network-application_net`.
- **attachable: false**: Other containers can't attach to this network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file.
- **name: unifi-network-application**: Specifies the name of the network.
- **driver: bridge**: Uses the bridge driver to create an isolated network.
- **ipam**: Configures IP address management for the network.
  - **subnet**: `172.20.19.0/24`.
  - **ip_range**: `172.20.19.0/24`.
  - **gateway**: `172.20.19.1`.
- **driver_opts**: Additional options for the network driver.
  - **com.docker.network.bridge.default_bridge: "false"**: Indicates this is not
    the default Docker bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows outbound
    traffic to appear as if it came from the host.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds the bridge
    to all available IP addresses on the host.
  - **com.docker.network.bridge.name: "unifi"**: Names the bridge interface on
    the host.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.unifi-network-application.network.description**: A description label
    for the network.

<br />

## Services Configuration

### Database Service (`unifi-network-application_db`)

```yaml
services:
  unifi-network-application_db:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: unifi-network-application_db
    image: docker.io/mongo:9.0.4
    pull_policy: if_not_present
    volumes:
      - /docker/unifi-network-application/production/db:/data/db
      - /docker/unifi-network-application/init-mongo.sh:/docker-entrypoint-initdb.d/init-mongo.sh:ro
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
      MONGO_AUTHSOURCE: ${ROOT_AUTHSOURCE_DB} # Fill in the value in both the .env and stack.env files
      MONGO_INITDB_ROOT_PASSWORD: ${ROOT_PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      MONGO_INITDB_ROOT_USERNAME: ${ROOT_USER_DB} # Fill in the value in both the .env and stack.env files
      MONGO_DBNAME: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MONGO_PASS: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      MONGO_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
    hostname: unifi-network-application_db
    networks:
      unifi-network-application_net:
        ipv4_address: 172.20.19.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.unifi-network-application.db.description: "is an Mongo database."
    healthcheck:
      disable: false
      test:
        [
          "CMD",
          "mongosh",
          "mongodb://${USER_DB}:${PASSWORD_DB}@${HOST_DB}:${PORT_DB}/?authSource=${ROOT_AUTHSOURCE_DB}",
          "--quiet",
          "--eval",
          "printjson(db.runCommand('ping').ok)",
        ]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

<br />

- **restart: unless-stopped**: Restarts the container unless it is explicitly
  stopped.
- **logging**: Uses the `json-file` driver, limited to 1MB per file and a
  maximum of 2 files.
- **stop_grace_period: 1m**: Waits 1 minute before forcibly stopping the
  container.
- **container_name: unifi-network-application_db**: Names the container.
- **image: docker.io/mongo:9.0.4**: Uses the MongoDB image, pinned to version
  `9.0.4`.
- **pull_policy: if_not_present**: Pulls the image only if it's not present
  locally.
- **volumes**: Mounts host directories or files into the container.
  - **/docker/unifi-network-application/production/db:/data/db**: Persists the
    database files.
  - **/docker/unifi-network-application/init-mongo.sh:/docker-entrypoint-initdb.d/init-mongo.sh:ro**:
    Mounts the init script read-only. It runs on the first start and creates the
    application user.
- **env_file**: Loads the variables from `.env` (Docker Compose) or `stack.env`
  (Portainer). Comment out the file you are not using.
- **environment**: Sets environment variables.
  - **PUID / PGID**: The user and group ID the container runs as.
  - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **MONGO_AUTHSOURCE**: The authentication database, taken from
    `ROOT_AUTHSOURCE_DB`.
  - **MONGO_INITDB_ROOT_USERNAME / MONGO_INITDB_ROOT_PASSWORD**: The root
    credentials, taken from `ROOT_USER_DB` and `ROOT_PASSWORD_DB`.
  - **MONGO_DBNAME / MONGO_USER / MONGO_PASS**: The database name, user, and
    password used by the init script, taken from `NAME_DB`, `USER_DB`, and
    `PASSWORD_DB`.
- **hostname: unifi-network-application_db**: Sets the hostname for the
  container.
- **networks**: Connects the service to the network with static IP address
  `172.20.19.2`.
- **security_opt**: `no-new-privileges:true` prevents the container from gaining
  new privileges.
- **labels**: `com.unifi-network-application.db.description` describes the
  database.
- **healthcheck**: Uses `mongosh` to authenticate with the application user and
  run a `ping` command.
  - **interval**: 10 seconds.
  - **timeout**: 5 seconds.
  - **retries**: 3.
  - **start_period**: 10 seconds.
  - **start_interval**: 5 seconds.

<br />

### Application Service (`unifi-network-application_app`)

```yaml
services:
  unifi-network-application_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: unifi-network-application
    image: ghcr.io/linuxserver/unifi-network-application:10.6.109
    pull_policy: if_not_present
    depends_on:
      unifi-network-application_db:
        condition: service_healthy
    links:
      - unifi-network-application_db
    volumes:
      - /docker/unifi-network-application/production/app:/config
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
      MONGO_AUTHSOURCE: ${ROOT_AUTHSOURCE_DB} # Fill in the value in both the .env and stack.env files
      MONGO_HOST: ${HOST_DB} # Fill in the value in both the .env and stack.env files
      MONGO_DBNAME: ${NAME_DB} # Fill in the value in both the .env and stack.env files
      MONGO_PASS: ${PASSWORD_DB} # Fill in the value in both the .env and stack.env files
      MONGO_PORT: ${PORT_DB} # Fill in the value in both the .env and stack.env files
      MONGO_USER: ${USER_DB} # Fill in the value in both the .env and stack.env files
      BASICAUTH: ${BASICAUTH_DB} # Fill in the value in both the .env and stack.env files
      # MONGO_URL: ${MONGODB_URL}  # Fill in the value in both the .env and stack.env files
      MEM_LIMIT: 2048
      MEM_STARTUP: 2048
      # MONGO_TLS:
    domainname: unifi-network-application.local # Customize this with your own domain, e.g., `unifi-network-application.local` to `unifi-network-application.your-fqdn-here.com`.
    hostname: unifi-network-application
    networks:
      unifi-network-application_net:
        ipv4_address: 172.20.19.3
    ports:
      - "1900:1900/udp" # Required for Make controller discoverable on L2
      - "3478:3478/udp" # Unifi STUN port
      - "5514:5514/tcp" # Remote syslog port
      - "6789:6789/tcp" # For mobile throughput test
      - "8080:8080/tcp" # Required for device communication
      - "8443:8443/tcp" # Unifi web admin port
      - "8843:8843/tcp" # Unifi guest portal HTTPS redirect port
      - "8880:8880/tcp" # Unifi guest portal HTTP redirect port
      - "10001:10001/udp" # Required for AP discovery
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "unifi-network-application"
      com.unifi-network-application.description:
        "is an end-to-end system of network devices across different locations —
        all controlled from a single interface."
    healthcheck:
      disable: true
```

<br />

- **restart**, **logging**, **stop_grace_period**, **pull_policy**: Same
  behavior as the database service.
- **container_name: unifi-network-application**: Names the container.
- **image: ghcr.io/linuxserver/unifi-network-application:10.6.109**: Uses the
  LinuxServer.io UniFi Network Application image, pinned to version `10.6.109`.
- **depends_on**: Starts this service only when the database is
  `service_healthy`.
- **links**: Makes the database reachable under the name
  `unifi-network-application_db`.
- **volumes**: `/docker/unifi-network-application/production/app:/config`
  persists the application configuration.
- **env_file**: Same behavior as the database service.
- **environment**: Sets environment variables.
  - **PUID / PGID / TZ**: User and group ID, and timezone.
  - **MONGO_AUTHSOURCE / MONGO_HOST / MONGO_DBNAME / MONGO_PASS / MONGO_PORT /
    MONGO_USER**: The database connection settings, taken from the environment
    file.
  - **BASICAUTH**: Enables basic authentication, taken from `BASICAUTH_DB`.
  - **# MONGO_URL**: Commented out. An alternative to the separate connection
    settings, taken from `MONGODB_URL`.
  - **MEM_LIMIT / MEM_STARTUP**: Memory limit and startup memory of the
    application in MB (2048).
  - **# MONGO_TLS**: Commented out. Can be used to enable TLS for the database
    connection.
- **domainname: unifi-network-application.local**: Sets the domain name for the
  container. Replace it with your own domain.
- **hostname: unifi-network-application**: Sets the hostname for the container.
- **networks**: Connects the service to the network with static IP address
  `172.20.19.3`.
- **ports**: Maps host ports to container ports.
  - **1900/udp**: Makes the controller discoverable on L2.
  - **3478/udp**: UniFi STUN port.
  - **5514/tcp**: Remote syslog port.
  - **6789/tcp**: Mobile throughput test.
  - **8080/tcp**: Device communication.
  - **8443/tcp**: UniFi web admin port.
  - **8843/tcp**: Guest portal HTTPS redirect.
  - **8880/tcp**: Guest portal HTTP redirect.
  - **10001/udp**: Access point discovery.
- **security_opt**: `no-new-privileges:true` prevents the container from gaining
  new privileges.
- **labels**: Project label and a description label for the application.
- **healthcheck: disable: true**: The health check is disabled for this
  container.

<br />

## Environment Variables

The database credentials are stored in an environment file, outside the compose
file. Use `.env` for Docker Compose and `stack.env` for Portainer. Both files
must contain the same values.

<br />

### Variables in this file

```env
# Database Configuration: ROOT USER
# Change the MongoDB root password to a strong, unique password of your choice.
# Ensure the password is complex and not easily guessable.
ROOT_AUTHSOURCE_DB=admin
ROOT_PASSWORD_DB=StrongUniqueRootPassword1234
ROOT_USER_DB=root

# Database Configuration: USER
# Database host and connection settings
HOST_DB=unifi-network-application_db

# Database name:
NAME_DB=unifi_network_application_db

# MongoDB user password: Change this to a strong, unique password
PASSWORD_DB=StrongUniqueUserPassword5678

# MongoDB connection port (default: 27017)
PORT_DB=27017

# MongoDB username: Change this to your desired username
USER_DB=unifi

# MongoDB URL - Make sure to replace with real credentials
MONGODB_URL=mongodb://root:StrongUniqueRootPassword1234@mongo:27017/?authSource=admin

# Enable Basic Authentication for additional security (set to true if needed)
BASICAUTH=false
```

- **`ROOT_AUTHSOURCE_DB`**: The authentication database for the root user
  (`admin`).
- **`ROOT_USER_DB`**: The MongoDB root username.
- **`ROOT_PASSWORD_DB`**: The MongoDB root password. Use a secure and unique
  value.
- **`HOST_DB`**: Hostname of the database server. This matches the service name
  (`unifi-network-application_db`).
- **`NAME_DB`**: The name of the database used by the application.
- **`USER_DB`**: The username the application uses to connect to the database.
- **`PASSWORD_DB`**: The password of that user. Use a secure and unique value.
- **`PORT_DB`**: The port MongoDB listens on (default: 27017).
- **`MONGODB_URL`**: A connection URL, only used when `MONGO_URL` is enabled in
  the compose file. Replace it with real credentials.
- **`BASICAUTH`**: Set to `true` to enable basic authentication.

<br />

## MongoDB Init Script

The `init-mongo.sh` script is mounted into `/docker-entrypoint-initdb.d/` and
runs only when the database is initialized for the first time.

```bash
#!/bin/bash

if which mongosh > /dev/null 2>&1; then
  mongo_init_bin='mongosh'
else
  mongo_init_bin='mongo'
fi
"${mongo_init_bin}" << EOF
use ${MONGO_AUTHSOURCE}
db.auth("${MONGO_INITDB_ROOT_USERNAME}", "${MONGO_INITDB_ROOT_PASSWORD}")
db.createUser({
  user: "${MONGO_USER}",
  pwd: "${MONGO_PASS}",
  roles: [
    { db: "${MONGO_DBNAME}", role: "dbOwner" },
    { db: "${MONGO_DBNAME}_stat", role: "dbOwner" }
  ]
})
EOF
```

<br />

- **mongosh or mongo**: Uses `mongosh` when available and falls back to `mongo`.
- **use ${MONGO_AUTHSOURCE}**: Selects the authentication database.
- **db.auth(...)**: Authenticates as the root user.
- **db.createUser(...)**: Creates the application user with the `dbOwner` role
  on the application database and on the `_stat` database.

<br />

## Conclusion

This `docker-compose` file deploys the UniFi Network Application with a
dedicated MongoDB database. It creates a custom bridge network with static IP
addresses, creates the database user with an init script, and starts the
application only after the database is healthy. The credentials are kept in an
environment file, and both services restart automatically, log efficiently, and
run with `no-new-privileges`.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/unifi-network-application/docker-compose.yml
[stack.env]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/unifi-network-application/stack.env
[init-mongo.sh]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/unifi-network-application/init-mongo.sh
