---
title: "pi-hole.info"
description:
  "Deploy Pi-hole, a self-hosted, user-friendly DNS sinkhole and DHCP server.
  This guide covers the custom Docker network settings, Pi-hole service
  configurations, and security measures for efficient operation."
url: "docker/compose-info/pi-hole"
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
  - Pi-hole
  - Docker Compose
  - Container Management
  - Infrastructure Management
keywords:
  - Docker
  - Pi-hole
  - Docker Compose
  - Container Management
  - Docker Network
  - Pi-hole Configuration
  - Docker Setup
  - DNS Sinkhole
  - DHCP Server
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

This guide explains the setup for **Pi-hole**, a network-level advertisement and
tracker blocker that acts as a DNS sinkhole and optionally a DHCP server. Below
is a breakdown of the `docker-compose.yml` file configuration for deploying
Pi-hole on Docker.

## Compose File Metadata

- **Filename**: `docker-compose.yml`
- **Author**: Homelab-Alpha
- **Date**: February 22, 2025
- **Description**: Configures a Docker network and the Pi-hole service for
  ad-blocking and DHCP functionalities.
- **RAW Compose File**: [docker-compose.yml]

<br />

## Networks Configuration

```yaml
networks:
  pi-hole_net:
    attachable: false
    internal: false
    external: false
    name: pi-hole
    driver: bridge
    ipam:
      driver: default
      config:
        - subnet: 172.20.17.0/24
          ip_range: 172.20.17.0/24
          gateway: 172.20.17.1
    driver_opts:
      com.docker.network.bridge.default_bridge: "false"
      com.docker.network.bridge.enable_icc: "true"
      com.docker.network.bridge.enable_ip_masquerade: "true"
      com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"
      com.docker.network.bridge.name: "pi-hole"
      com.docker.network.driver.mtu: "1500"
    labels:
      com.pi-hole.network.description: "is an isolated bridge network."
```

- **networks**: This section defines a custom network named `pi-hole_net`.
- **attachable: false**: Other containers cannot attach to this network.
- **internal: false**: The network is accessible externally.
- **external: false**: The network is only created within the `docker-compose`
  file.
- **name: pi-hole**: Names the network `pi-hole`.
- **driver: bridge**: Uses Docker's bridge driver for network isolation.
- **ipam**: IP address management configuration.
  - **driver: default**: The default IPAM driver is used.
  - **config**: Configures the subnet, IP range, and gateway for the network.
    - **subnet**: 172.20.17.0/24 defines the network range.
    - **ip_range**: 172.20.17.0/24 restricts the IP range to this subnet.
    - **gateway**: 172.20.17.1 sets the default gateway.
- **driver_opts**: Additional driver options for network configuration.
  - **com.docker.network.bridge.default_bridge: "false"**: Ensures this is not
    the default bridge.
  - **com.docker.network.bridge.enable_icc: "true"**: Enables inter-container
    communication.
  - **com.docker.network.bridge.enable_ip_masquerade: "true"**: Allows traffic
    masquerading.
  - **com.docker.network.bridge.host_binding_ipv4: "0.0.0.0"**: Binds the
    network to all available host IPs.
  - **com.docker.network.bridge.name: "pi-hole"**: Names the bridge network as
    `pi-hole`.
  - **com.docker.network.driver.mtu: "1500"**: Sets the maximum transmission
    unit for the network.
- **labels**: Metadata for the network.
  - **com.pi-hole.network.description**: Describes the network as an isolated
    bridge.

<br />

## Services Configuration

```yaml
services:
  pi-hole_app:
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "1M"
        max-file: "2"
    stop_grace_period: 1m
    container_name: pi-hole
    image: pihole/pihole:latest
    pull_policy: if_not_present
    volumes:
      - /docker/pi-hole/production/app:/etc/pihole
      - ./etc-dnsmasq.d:/etc/dnsmasq.d
    environment:
      PUID: "1000"
      PGID: "1000"
      TZ: Europe/Amsterdam # Adjust the timezone to match your local timezone. You can find the full list of timezones here https://en.wikipedia.org/wiki/List_of_tz_database_time_zones.
      WEBPASSWORD: "set a secure password here or it will be random"
    domainname: pi-hole.local # Customize this with your own domain, e.g., `pi-hole.local` to `pi-hole.your-fqdn-here.com`.
    hostname: pi-hole
    networks:
      pi-hole_net:
        ipv4_address: 172.20.17.2
    ports:
      - "5353:53/tcp" # plain DNS
      - "5353:53/udp" # plain DNS
      - "67:67/udp" # DHCP
      - "3080:80/tcp" # HTTP
    security_opt:
      - no-new-privileges:true
    cap_add:
      - NET_ADMIN
    labels:
      com.docker.compose.project: "pi-hole"
      com.pi-hole.description:
        "is a Linux network-level advertisement and Internet tracker blocking
        application which acts as a DNS sinkhole and optionally a DHCP server."
    healthcheck:
      disable: false
      test: ["CMD", "dig", "+short", "+norecurse", "+retry=0", "@127.0.0.1", "pi.hole"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s
      start_interval: 5s
```

- **services**: This section defines the services to be deployed.
- **pi-hole_app**: The service name for the Pi-hole container.
  - **restart: unless-stopped**: The container will restart unless explicitly
    stopped.
  - **logging**: Configures logging for the container.
    - **driver: "json-file"**: Uses the `json-file` logging driver.
    - **max-size: "1M"**: Limits the log file size to 1MB.
    - **max-file: "2"**: Keeps a maximum of 2 log files.
  - **stop_grace_period: 1m**: The grace period before forcibly stopping the
    container.
  - **container_name: pi-hole**: Names the container `pi-hole`.
  - **image: pihole/pihole:latest**: Uses the latest Pi-hole image from Docker
    Hub.
  - **pull_policy: if_not_present**: Only pulls the image if it's not already
    present locally.
  - **volumes**: Mounts host directories into the container for persistent data
    storage.
    - **./docker/pi-hole/production/app:/etc/pihole**: Mounts the Pi-hole configuration directory.
    - **./etc-dnsmasq.d:/etc/dnsmasq.d**: Mounts the DNS configuration
      directory.
  - **environment**: Sets environment variables for configuration.
    - **PUID: "1000"**: Sets the user ID.
    - **PGID: "1000"**: Sets the group ID.
    - **TZ: Europe/Amsterdam**: Sets the timezone to Amsterdam (adjust as
      needed).
    - **WEBPASSWORD: "set a secure password here or it will be random"**: Set a
      secure password for the Pi-hole admin interface.
  - **domainname: pi-hole.local**: Sets the container's domain name (adjust as
    needed).
  - **hostname: pi-hole**: Names the container `pi-hole`.
  - **networks**: Connects the service to the `pi-hole_net` network.
    - **ipv4_address: 172.20.17.2**: Assigns a static IP address.
  - **ports**: Maps container ports to host ports for DNS and DHCP services.
    - **5353:53/tcp**: Maps TCP DNS port.
    - **5353:53/udp**: Maps UDP DNS port.
    - **67:67/udp**: Maps the DHCP port.
    - **3080:80/tcp**: Maps HTTP port for the web interface.
  - **security_opt**: Adds security options to the container.
    - **no-new-privileges:true**: Ensures the container cannot gain new
      privileges.
  - **cap_add**: Adds capabilities to the container.
    - **NET_ADMIN**: Grants network administrator privileges.
  - **labels**: Metadata for the container.
    - **com.docker.compose.project: "pi-hole"**: Project label.
    - **com.pi-hole.description**: Describes Pi-hole as a DNS sinkhole and
      optional DHCP server.
  - **healthcheck**: Health check configuration.
    - **disable: false**: Enables the health check.
    - **test**: Runs `dig` command to test Pi-hole functionality.
    - **interval: 10s**: Run the health check every 10 seconds.
    - **timeout: 5s**: Allow up to 5 seconds for the health check to complete.
    - **retries: 3**: Health check fails after 3 consecutive failures.
    - **start_period: 10s**: Initial period before counting failures (10
      seconds).
    - **start_interval: 5s**: Interval between starting health checks (5
      seconds).

<br />

## Conclusion

This `docker-compose.yml` file configures a Docker environment for Pi-hole, a
DNS sinkhole and optional DHCP server. It defines a custom bridge network, sets
up Pi-hole with persistent storage, and specifies various security and logging
options. This configuration ensures that Pi-hole operates efficiently and
securely as part of your Docker setup, helping block unwanted ads and trackers
on your network.

[docker-compose.yml]:
  https://raw.githubusercontent.com/homelab-alpha/docker/main/docker-compose-files/pi-hole/docker-compose.yml
