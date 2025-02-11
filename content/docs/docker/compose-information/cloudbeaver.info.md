---
title: "cloudbeaver.info"
description:
  "Deploy CloudBeaver, a self-hosted, user-friendly web application for
  all-around data management, using Docker Compose. This guide covers custom
  Docker network settings, service configurations, and security measures for a
  smooth deployment."
url: "docker/compose-info/cloudbeaver"
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
  - CloudBeaver
  - Docker Compose
  - Container Management
  - Infrastructure Management
keywords:
  - Docker
  - CloudBeaver
  - Docker Compose
  - Container Management
  - Docker Network
  - CloudBeaver Configuration
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
deploying CloudBeaver, a lightweight web application for all-around data
management.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Feb 11, 2025
- **Description**: Configures a Docker network and the CloudBeaver service for
  data management using Docker Compose.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  cloudbeaver_net:
    attachable: false
    internal: false
    external: false
    name: cloudbeaver
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.14.0/24
          ip_range: 172.20.14.0/24
          gateway: 172.20.14.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "cloudbeaver"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.cloudbeaver.network.description: "is an isolated bridge network."
```

- **networks**: This section defines a custom network named `cloudbeaver_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: cloudbeaver**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "cloudbeaver"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.cloudbeaver.network.description**: A description label for the
    network.

<br />

## Services Configuration

```yaml
services:
  cloudbeaver_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: cloudbeaver
    image: dbeaver/cloudbeaver:latest
    pull_policy: if_not_present
    volumes:
      - /docker/cloudbeaver/production/app:/opt/cloudbeaver/workspace
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
    domainname: cloudbeaver.local # Customize this with your own domain, e.g., `cloudbeaver.local` to `cloudbeaver.your-fqdn-here.com`.
    hostname: cloudbeaver
    networks:
      cloudbeaver_net:
        ipv4_address: 172.20.14.3
    ports:
      - "3978:8978/tcp" # HTTP(s)
      - "3978:8978/udp" # HTTP(s)
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "cloudbeaver"
      com.cloudbeaver.description:
        "is an lightweight web application for all-around data management."
    healthcheck:
      disable: false
      test: ["CMD", "curl", "-f", "http://localhost:8978/status"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: Defines services to be deployed.
- **cloudbeaver_app**: The service name for the CloudBeaver container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: cloudbeaver**: Names the container "cloudbeaver".
  - **image: dbeaver/cloudbeaver:latest**: Uses the latest CloudBeaver image
    from Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/cloudbeaver/production/app:/opt/cloudbeaver/workspace**: Mounts
      the app data directory.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **domainname: cloudbeaver.local**: Sets the domain name for the container.
  - **hostname: cloudbeaver**: Sets the hostname for the container.
  - **networks**: Connects the service to the `cloudbeaver_net` network.
    - **ipv4_address: 172.20.14.3**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **3978:8978/tcp**: Maps the HTTP(s) port.
    - **3978:8978/udp**: Maps the HTTP(s) port (UDP).
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "cloudbeaver"**: Project label.
    - **com.cloudbeaver.description**: Description label for CloudBeaver.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Specifies the command to be run for the health check. In this
      case, it is `curl -f http://localhost:8978/status`.
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

This `docker-compose` file sets up a Docker environment for CloudBeaver, a
user-friendly web application for managing data and databases. The configuration
defines a custom bridge network with specific IP settings and security
configurations. The CloudBeaver service is configured to run continuously, with
persistent storage for application data. The setup ensures CloudBeaver runs
efficiently and securely, with appropriate logging, restart policies, and health
checks, making it an excellent tool for managing data and infrastructure.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/cloudbeaver/docker-compose.yml
