---
title: "plex.info"
description:
  "Deploy Plex Media Server using Docker Compose with custom network settings
  for efficient media management and streaming. This setup includes detailed
  configurations for persistent storage, environment variables, and security
  measures to ensure optimal performance and accessibility."
url: "docker/compose-info/plex"
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
  - Plex Media Server
  - Docker Compose
  - Media Streaming
  - Containerization
  - Docker Networking
keywords:
  - Docker Plex Media Server setup
  - Docker Compose Plex configuration
  - Plex Docker persistent storage
  - Media server Docker container
  - Docker network configuration

weight: 4100

toc: true
katex: true
---

<br />

{{% alert context="primary" %}}
ChatGPT has contributed to this document. Therefore, it's advisable to treat the
information here with caution and verify it if necessary. {{% /alert %}}

<br />

Let's break down what this `docker-compose.yml` file does in detail. This
configuration is specifically designed to deploy Plex Media Server using Docker
Compose, ensuring efficient management and streaming of media.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 15, 2024
- **Description**: Configures a Docker network and service for Plex Media
  Server.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  plex_net:
    internal: false
    external: false
    name: plex
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.12.0/24
          ip_range: 172.20.12.0/24
          gateway: 172.20.12.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "plex"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.plex.network.description: "is an isolated bridge network."
```

- **networks**: Defines a custom network named `plex_net`.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: plex**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "plex"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.plex.network.description**: A description label for the network.

<br />

## Plex Media Server Service

```yaml
services:
  plex_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    container_name: plex
    image: plexinc/pms-docker:latest
    pull_policy: if_not_present
    volumes:
      - /docker/plex/production/app/config:/config
      - /docker/plex/production/app/temp:/transcode
      - /docker/media:/data:ro
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      PLEX_CLAIM: "claim-a1b2c3d4e5f6g7h8i9j0" # Visit https://www.plex.tv/claim to get a claim token for logging into your Plex server with your Plex account.
      ADVERTISE_IP: "http://192.168.1.1:32400/" # Customize this with your own server IP address, e.g., `192.168.1.1:32400` to `192.168.69.69:32400`.
      CHANGE_CONFIG_DIR_OWNERSHIP: "false"
      # ALLOWED_NETWORKS: ""
    domainname: plex.local # Customize this with your own domain, e.g., `plex.local` to `plex.your-fqdn-here.com`.
    hostname: plex
    networks:
      plex_net:
        ipv4_address: 172.20.12.2
    ports:
      - 32400:32400/tcp # HTTP
      - 32400:32400/udp # HTTP
      - 5353:5353/udp # older Bonjour/Avahi network discovery (not is use anymore)
      - 8324:8324/tcp # controlling Plex for Roku via Plex Companion
      - 1900:1900/udp # Plex DLNA Server
      - 32469:32469/tcp # Plex DLNA Server
      - 32410:32410/udp # GDM network discovery
      - 32412:32412/udp # GDM network discovery
      - 32413:32413/udp # GDM network discovery
      - 32414:32414/udp # GDM network discovery
    devices:
      - /dev/dri:/dev/dri
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "plex"
      com.plex.description:
        "organizes all of your personal media so you can enjoy it no matter
        where you are."
    healthcheck:
      disable: true
```

- **plex_app**: The service name for the Plex container.

  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **container_name: plex**: Names the container "plex".
  - **image: plexinc/pms-docker:latest**: Uses the latest Plex Media Server
    image from Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/plex/production/app/config:/config**: Mounts the Plex
      configuration directory.
    - **/docker/plex/production/app/temp:/transcode**: Mounts the transcode
      directory.
    - **/docker/media:/data:ro**: Mounts the media directory (read-only).
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
    - **PLEX_CLAIM**: Sets the Plex claim token.
    - **ADVERTISE_IP**: Sets the advertised IP address for the Plex server.
    - **CHANGE_CONFIG_DIR_OWNERSHIP: "false"**: Prevents changing ownership of
      the config directory.
  - **domainname: plex.local**: Sets the domain name for the container.
  - **hostname: plex**: Sets the hostname for the container.
  - **networks**: Connects the service to the `plex_net` network.
    - **ipv4_address: 172.20.12.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **32400:32400/tcp**: Maps the HTTP port.
    - **32400:32400/udp**: Maps the HTTP port (UDP).
    - **5353:5353/udp**: Maps the Bonjour/Avahi network discovery port (older
      version, not in use anymore).
    - **8324:8324/tcp**: Maps the port for controlling Plex for Roku via Plex
      Companion.
    - **1900:1900/udp**: Maps the Plex DLNA Server port.
    - **32469:32469/tcp**: Maps the Plex DLNA Server port.
    - **32410:32410/udp**: Maps the GDM network discovery port.
    - **32412:32412/udp**: Maps the GDM network discovery port.
    - **32413:32413/udp**: Maps the GDM network discovery port.
    - **32414:32414/udp**: Maps the GDM network discovery port.
  - **devices**: Passes host devices to the container.
    - **/dev/dri:/dev/dri**: Mounts the device for hardware-accelerated
      transcoding.
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "plex"**: Project label.
    - **com.plex.description**: Description label for Plex Media Server.
  - **healthcheck**: Healthcheck configuration.
    - **disable: true**: Disables health checks for the container.

<br />

## Conclusion

This `docker-compose.yml` file sets up a Plex Media Server with its own custom
bridge network. The configuration includes a persistent storage setup for Plex's
configuration, transcode, and media directories. Environment variables customize
the setup, including timezone and Plex claim token. The service is configured to
restart unless stopped manually, with logging options to manage log size and
retention. The network settings ensure the Plex container has a static IP within
the specified subnet, and various ports are mapped for Plex services. Security
options enhance container security by preventing privilege escalation.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/plex/docker-compose.yml
