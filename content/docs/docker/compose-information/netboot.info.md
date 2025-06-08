---
title: "netboot.info"
description:
  "Deploy NetBoot, enabling network booting of various operating systems and
  utility disks. It details the Docker network settings, service configurations,
  and security measures for seamless and secure operation."
url: "docker/compose-info/netboot"
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
  - NetBoot
  - Docker Compose
  - Container Management
  - Network Booting
keywords:
  - Docker
  - NetBoot
  - Docker Compose
  - Container Management
  - Docker Network
  - Docker Setup
  - Docker Containers
  - Docker Environment
  - Network Boot
  - Operating System Boot
  - Utility Disk Boot

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
is used to configure and deploy the NetBoot service using Docker Compose,
enabling network booting of various operating systems and utility disks.

Here's a detailed explanation:

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: GJS (homelab-alpha)
- **Date**: Jun 08, 2025
- **Description**: Configures a Docker network and the NetBoot service,
  providing an environment for network booting various OS and utility disks.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  netboot_net:
    attachable: false
    internal: false
    external: false
    name: netboot
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.11.0/24
          ip_range: 172.20.11.0/24
          gateway: 172.20.11.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "netboot"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.netboot.network.description: "is an isolated bridge network."
```

<br />

- **networks**: This section defines a custom network named `netboot_net`.
- **attachable**: Set to `false`, meaning other containers can't attach to this
  network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is created within this `docker-compose` file,
  not externally defined.
- **name: netboot**: Specifies the name of the network.
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
  - **com.docker.network.bridge.name: "netboot"**: Names the bridge network.
  - **com.docker.network.driver.mtu: "1500"**: Sets the Maximum Transmission
    Unit size for the network.
- **labels**: Metadata for the network.
  - **com.netboot.network.description**: A description label for the network.

<br />

## Services Configuration

```yaml
services:
  netboot_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: netboot
    image: netbootxyz/netbootxyz:latest
    pull_policy: if_not_present
    volumes:
      - /docker/netboot/production/app:/config
      - /docker/media/images/netboot/assets:/assets
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      # MENU_VERSION: 2.0.79 # optional
      # PORT_RANGE: 30000:30010 # optional
      # SUBFOLDER: / # optional
    domainname: netboot.local # Customize this with your own domain, e.g., `netboot.local` to `netboot.your-fqdn-here.com`.
    hostname: netboot
    networks:
      netboot_net:
        ipv4_address: 172.20.11.2
    ports:
      - "69:69/udp" # TFTP Port
      - "3011:3000/tcp" # Web configuration interface.
      - "3011:3000/udp" # Web configuration interface.
      # - "3012:80/tcp" # NGINX server for hosting assets.
      # - "3012:80/udp" # NGINX server for hosting assets.
    security_opt:
      - no-new-privileges:true
    labels:
      com.docker.compose.project: "netboot"
      com.netboot.description:
        "is a convenient place to boot into any type of operating system or
        utility disk without the need of having to go spend time retrieving the
        ISO just to run it."
    healthcheck:
      disable: false
      test: ["CMD", "/healthcheck.sh"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

<br />

- **services**: Defines services to be deployed.
- **netboot_app**: The service name for the NetBoot container.
  - **restart: unless-stopped**: Ensures the container restarts unless it is
    explicitly stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses JSON file logging driver.
    - **max-size: "1M"**: Limits log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: Sets a grace period of 1 minute before forcibly
    stopping the container.
  - **container_name: netboot**: Names the container "netboot".
  - **image: netbootxyz/netbootxyz:latest**: Uses the latest NetBootXYZ image
    from Docker Hub.
  - **pull_policy: if_not_present**: Pulls the image only if it's not already
    present locally.
  - **volumes**: Mounts host directories or files into the container.
    - **/docker/netboot/production/app:/config**: Mounts the configuration
      directory.
    - **/docker/media/images/netboot/assets:/assets**: Mounts the assets
      directory.
    - **/docker/media/images/iso:/assets**: Mounts the ISO images directory.
    - **/docker/media/images/dmg:/assets**: Mounts the DMG images directory.
  - **environment**: Sets environment variables.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam.
  - **domainname: netboot.local**: Sets the domain name for the container.
  - **hostname: netboot**: Sets the hostname for the container.
  - **networks**: Connects the service to the `netboot_net` network.
    - **ipv4_address: 172.20.11.2**: Assigns a static IP address to the
      container.
  - **ports**: Maps container ports to host ports.
    - **69:69/udp**: Maps the TFTP port.
    - **3011:3000/tcp**: Maps the web configuration interface port.
    - **3011:3000/udp**: Maps the web configuration interface port (UDP).
    - **3012:80/tcp**: Maps the NGINX server port (commented out).
    - **3012:80/udp**: Maps the NGINX server port (commented out).
  - **security_opt**: Security options for the container.
    - **no-new-privileges:true**: Ensures the container does not gain new
      privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "netboot"**: Project label.
    - **com.netboot.description**: Description label for NetBoot.
  - **healthcheck**: Healthcheck configuration.
    - **disable: false**: Enables health checks for the container.
    - **test**: Specifies the command to be run for the health check. In this
      case, it is `["CMD", "/healthcheck.sh"]`.
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

This `docker-compose` file sets up a Docker environment for NetBoot, a service
that allows booting various operating systems or utility disks over a network.
The configuration defines a custom bridge network with specific IP settings and
security configurations. The NetBoot service is configured to run continuously,
with persistent storage for configuration and assets, and includes options for
setting the TFTP port and web configuration interface. The setup ensures NetBoot
runs efficiently and securely, with appropriate logging and restart policies.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/netboot/docker-compose.yml
