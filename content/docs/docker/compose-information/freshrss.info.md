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
- **Date**: Jun 15, 2024
- **Description**: Configures a Docker network and services for FreshRSS and its
  MariaDB database.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  freshrss_net:
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

- **networks**: Defines a custom network named `freshrss_net`.
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

## MariaDB Database Service

```yaml
services:
  freshrss_db:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    container_name: freshrss_db
    image: mariadb:latest
    pull_policy: if_not_present
    volumes:
      - /docker/freshrss/production/db:/var/lib/mysql
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
      MYSQL_ROOT_PASSWORD: "sprD3KmxVgS5u4UaBbyRedLkWt6fn" # Change the MySQL root password to a strong, unique password of your choice.  Avoid using symbols like !";#$%&'()*+,-./:;<=>?@[]^_`{|}~
      MYSQL_DATABASE: "freshrss_db"
      MYSQL_USER: "freshrss"
      MYSQL_PASSWORD: "bNg5cEUFTvRH2XMxzSksemh8PrJ4u" # Change the MySQL password to a strong, unique password of your choice. Avoid using symbols like !";#$%&'()*+,-./:;<=>?@[]^_`{|}~
    command:
      [
        "--transaction-isolation=READ-COMMITTED",
        "--log-bin=binlog",
        "--binlog-format=ROW",
      ]
    hostname: freshrss_db
    networks:
      freshrss_net:
        ipv4_address: 172.20.6.2
    security_opt:
      - no-new-privileges:true
    labels:
      com.freshrss.db.description: "is a MySQL database."
    healthcheck:
      disable: true
```

- **freshrss_db**: The service name for the MariaDB container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **container_name: freshrss_db**: Names the container "freshrss_db".
  - **image: mariadb:latest**: Uses the latest MariaDB image from Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/freshrss/production/db:/var/lib/mysql**: Mounts the MySQL data
      directory.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **MYSQL_ROOT_PASSWORD**: Sets the MySQL root password.
    - **MYSQL_DATABASE: "freshrss_db"**: Creates a database named "freshrss_db".
    - **MYSQL_USER: "freshrss"**: Creates a MySQL user named "freshrss".
    - **MYSQL_PASSWORD**: Sets the MySQL user password.
  - **command**: Configures MariaDB startup commands.
    - **--transaction-isolation=READ-COMMITTED**: Sets transaction isolation
      level.
    - **--log-bin=binlog**: Enables binary logging.
    - **--binlog-format=ROW**: Sets binary log format to ROW.
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
    - **disable: true**: Disables health checks for the container.

<br />

### FreshRSS Application Service

```yaml
freshrss_app:
  restart: unless-stopped
  logging:
    driver: "json-file"
    options:
      max-size: "1M"
      max-file: "2"
  container_name: freshrss
  image: freshrss/freshrss:latest
  pull_policy: if_not_present
  depends_on:
    freshrss_db:
      condition: service_started
  links:
    - freshrss_db
  volumes:
    - /docker/freshrss/production/app/data:/var/www/FreshRSS/data
    - /docker/freshrss/extensions:/var/www/FreshRSS/extensions
  environment:
    PUID: "1000"
    PGID: "1000"
    TZ: Europe/Amsterdam
    CRON_MIN: "*/10"
    MYSQL_HOST: "freshrss_db"
    MYSQL_PORT: 3306
    MYSQL_NAME: "freshrss_db"
    MYSQL_USER: "freshrss"
    MYSQL_PASSWORD: "bNg5cEUFTvRH2XMxzSksemh8PrJ4u" # Change the MySQL password to a strong, unique password of your choice. Avoid using symbols like !";#$%&'()*+,-./:;<=>?@[]^_`{|}~
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
    disable: true
```

- **freshrss_app**: The service name for the FreshRSS container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **container_name: freshrss**: Names the container "freshrss".
  - **image: freshrss/freshrss:latest**: Uses the latest FreshRSS image from
    Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **depends_on**: Specifies dependencies for this service.
    - **freshrss_db**: Waits for the database service to start.
  - **links**: Links to the database container.
    - **freshrss_db**: Links to the `freshrss_db` container.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/freshrss/production/app/data:/var/www/FreshRSS/data**: Mounts
      the FreshRSS data directory.
    - **/docker/freshrss/extensions:/var/www/FreshRSS/extensions**: Mounts the
      FreshRSS extensions directory.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **CRON_MIN: "\*/10"**: Sets the cron job interval.
    - **MYSQL_HOST: "freshrss_db"**: Sets the database host.
    - **MYSQL_PORT: 3306**: Sets the database port.
    - **MYSQL_NAME: "freshrss_db"**: Sets the database name.
    - **MYSQL_USER: "freshrss"**: Sets the database user.
    - **MYSQL_PASSWORD**: Sets the database user password.
  - **domainname: freshrss.local**: Sets the domain name for the container.
  - **hostname: freshrss**: Sets the hostname for the container.
  - **networks**: Connects the service to the `freshrss_net` network.
    - **ipv4_address: 172.20.6.3**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **3002:80/tcp**: Maps the HTTP port.
    - **3002:80/udp**: Maps the HTTP port (UDP).
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "freshrss"**: Project label.
    - **com.freshrss.description**: Description label for FreshRSS.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

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
