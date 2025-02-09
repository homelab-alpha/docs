---
title: "jellyfin.info"
description:
  "Deploy Jellyfin media server. It includes comprehensive instructions on
  configuring a custom Docker network and Jellyfin service, ensuring smooth and
  secure media management and streaming."
url: "docker/compose-info/jellyfin"
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
  - Portainer
  - Docker Compose
  - Container Management
keywords:
  - Docker
  - Portainer
  - Docker Compose
  - Container Management
  - Docker Network
  - Portainer Configuration
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Portainer Service

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `docker-compose.yml` file does in detail. This file
is used to configure and deploy a Jellyfin media server using Docker Compose,
ensuring smooth management and streaming of media content.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Feb 9, 2025
- **Description**: This file configures a custom Docker network and a Jellyfin
  service to manage and stream media. It includes detailed network settings and
  service configurations to ensure Jellyfin runs smoothly and securely.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  jellyfin_net:
    attachable: false
    internal: false
    external: false
    name: jellyfin
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.5.0/24
          ip_range: 172.20.5.0/24
          gateway: 172.20.5.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "jellyfin"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.jellyfin.network.description: "is an isolated bridge network."
```

- **networks**: This section defines a custom network named `jellyfin_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is not an externally defined one but created
  within this `docker-compose` file.
- **name: jellyfin**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "jellyfin"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.jellyfin.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  jellyfin_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: jellyfin
    image: jellyfin/jellyfin:latest
    pull_policy: if_not_present
    volumes:
      - /docker/jellyfin/production/app:/config
      - /docker/jellyfin/production/app/cache:/cache
      - /docker/media:/media:ro
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam
      JELLYFIN_PublishedServerUrl: "https://jellyfin.local"
    domainname: jellyfin.local
    hostname: jellyfin
    extra_hosts:
      host.docker.internal: "host-gateway"
    networks:
      jellyfin_net:
        ipv4_address: 172.20.5.2
    ports:
      - "8096:8096/tcp"
      - "8096:8096/udp"
      - "8920:8920/tcp"
      - "8920:8920/udp"
    devices:
      - /dev/dri:/dev/dri
      - /dev/dri/renderD128:/dev/dri/renderD128
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "jellyfin"
      com.jellyfin.description:
        "is a free software media system that puts you in control of managing
        and streaming your media."
    healthcheck:
      disable: false
      test: ["CMD", "curl", "--noproxy", "localhost", "-Lk", "-fsS", "http://localhost:8096/health",]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: Defines services to be deployed.
- **jellyfin_app**: The service name for the Jellyfin container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: jellyfin**: Names the container "jellyfin".
  - **image: jellyfin/jellyfin:latest**: Uses the latest Jellyfin image from
    Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/jellyfin/production/app:/config**: Persists Jellyfin
      configuration data.
    - **/docker/jellyfin/production/app/cache:/cache**: Persists Jellyfin cache
      data.
    - **/docker/media:/media:ro**: Mounts media directory as read-only.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID for permissions.
    - **PGID: "1000"**: Sets the group ID for permissions.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **JELLYFIN_PublishedServerUrl: "<https://jellyfin.local>"**: Sets the
      server URL for Jellyfin.
  - **domainname: jellyfin.local**: Sets the domain name for the container.
  - **hostname: jellyfin**: Sets the hostname for the container.
  - **extra_hosts**: Adds entries to the container's `/etc/hosts` file.
    - **host.docker.internal: "host-gateway"**: Maps the host gateway.
  - **networks**: Connects the service to the `jellyfin_net` network.
    - **ipv4_address: 172.20.5.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps host ports to container ports.
    - **"8096:8096/tcp"**: Maps TCP port 8096 on the host to port 8096 in the
      container.
    - **"8096:8096/udp"**: Maps UDP port 8096 on the host to port 8096 in the
      container.
    - **"8920:8920/tcp"**: Maps TCP port 8920 on the host to port 8920 in the
      container.
    - **"8920:8920/udp"**: Maps UDP port 8920 on the host to port 8920 in the
      container.
  - **devices**: Adds host devices to the container.
    - **/dev/dri:/dev/dri**: Adds the host's Direct Rendering Infrastructure
      device.
    - **/dev/dri/renderD128:/dev/dri/renderD128**: Adds the host's render
      device.
  - **security_opt**: Security options for the container.
    - **no-new-privileges: true**: Prevents the container from gaining
      additional privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "jellyfin"**: Project label.
    - **com.jellyfin.description**: Description label for Jellyfin.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Specifies the command to be run for the health check. In this
      case, it is
      `["CMD", "curl", "--noproxy", "localhost", "-Lk", "-fsS", "http://localhost:8096/health"]`.
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

This `docker-compose` file sets up a robust Docker environment for running
Jellyfin, a media management and streaming system. It creates a custom bridge
network with specific IP settings and security configurations. The Jellyfin
service is configured with persistent storage, access to media directories, and
various network and security options. The configuration ensures that Jellyfin
runs continuously, restarts on failure, and logs efficiently.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/jellyfin/docker-compose.yml
