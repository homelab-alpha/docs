---
title: "dockge.info"
description:
  "Deploy Dockge, a self-hosted, user-friendly Docker Compose stack management
  interface. It includes details on custom Docker network settings, service
  configurations, and security measures for efficient and secure operation."
url: "docker/compose-info/dockge"
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
  - Dockge
  - Docker Compose
  - Container Management
  - Infrastructure Management
keywords:
  - Docker
  - Dockge
  - Docker Compose
  - Container Management
  - Docker Network
  - Dockge Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
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

Let's break down what this `docker-compose.yml` file does in detail for
deploying Dockge, a user-friendly Docker Compose stack management interface.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Feb 9, 2025
- **Description**: Configures a Docker network and the Dockge service for
  managing Docker Compose stacks.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  dockge_net:
    attachable: false
    internal: false
    external: false
    name: dockge
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.7.0/24
          ip_range: 172.20.7.0/24
          gateway: 172.20.7.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "dockge"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.dockge.network.description: "is an isolated bridge network."
```

- **networks**: This section defines a custom network named `dockge_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: dockge**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "dockge"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.dockge.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  dockge_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: dockge
    image: louislam/dockge:latest
    pull_policy: if_not_present
    volumes:
      - /docker/dockge/production/app/data:/app/data
      - /docker/dockge/production/app/stacks:/opt/stacks
      - /var/run/docker.sock:/var/run/docker.sock
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      DOCKGE_STACKS_DIR: /opt/stacks
    domainname: dockge.local # Customize this with your own domain, e.g., `dockge.local` to `dockge.your-fqdn-here.com`.
    hostname: dockge
    networks:
      dockge_net:
        ipv4_address: 172.20.7.2
    ports:
      - "3005:5001/tcp" # HTTP
      - "3005:5001/udp" # HTTP
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "dockge"
      com.dockge.description:
        "a fancy, easy-to-use and reactive self-hosted docker compose.yml stack."
    healthcheck:
      disable: false
      test: ["CMD", "extra/healthcheck"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: Defines services to be deployed.
- **dockge_app**: The service name for the Dockge container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: dockge**: Names the container "dockge".
  - **image: louislam/dockge:latest**: Uses the latest Dockge image from Docker
    Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/dockge/production/app/data:/app/data**: Mounts the app data
      directory.
    - **/docker/dockge/production/app/stacks:/opt/stacks**: Mounts the stacks
      directory.
    - **/var/run/docker.sock:/var/run/docker.sock**: Mounts the Docker socket.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **DOCKGE_STACKS_DIR: /opt/stacks**: Sets the stacks directory.
  - **domainname: dockge.local**: Sets the domain name for the container.
  - **hostname: dockge**: Sets the hostname for the container.
  - **networks**: Connects the service to the `dockge_net` network.
    - **ipv4_address: 172.20.7.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **3005:5001/tcp**: Maps the HTTP port.
    - **3005:5001/udp**: Maps the HTTP port (UDP).
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "dockge"**: Project label.
    - **com.dockge.description**: Description label for Dockge.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Specifies the command to be run for the health check. In this
      case, it is `extra/healthcheck`.
    - **interval**: The time between running health checks (10 seconds).
    - **timeout**: The time a health check is allowed to run before it is
      considered to have failed (5 seconds).
    - **retries**: The number of consecutive failures required before the
      container is considered unhealthy (3 retries).
    - **start_period**: The initial period during which a health check failure
      will not be counted towards the retries (10 seconds).
    - **start_interval**: The time between starting health checks (5 seconds).

<br />

## Conclusion

This `docker-compose` file sets up a Docker environment for Dockge, a fancy,
easy-to-use, and reactive self-hosted Docker Compose stack. The configuration
defines a custom bridge network with specific IP settings and security
configurations. The Dockge service is configured to run continuously, with
persistent storage for application data and Docker Compose stacks. The setup
ensures Dockge runs efficiently and securely, with appropriate logging and
restart policies, making it an excellent tool for managing Docker Compose
stacks.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/dockge/docker-compose.yml
